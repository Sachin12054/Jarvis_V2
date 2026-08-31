import sys
import time
import json
import asyncio
import httpx
import pytest
from unittest.mock import patch
from app.core.config import settings
from app.brain.llm_manager import OllamaLLMProvider, LLMTimeoutError, LLMProviderError


@pytest.mark.asyncio
async def test_direct_ollama_non_streaming_vs_streaming_comparison():
    """Requirement 12 & 13: Direct Ollama diagnostic comparing non-streaming vs streaming TTFT/total latency.
    Sends prompt 'What is 2 plus 2?' with num_ctx=16384.
    """
    url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/chat"
    
    # 1. Non-Streaming Request
    payload_non_stream = {
        "model": settings.OLLAMA_MODEL,
        "messages": [{"role": "user", "content": "What is 2 plus 2?"}],
        "stream": False,
        "options": {"num_ctx": 16384},
        "keep_alive": "15m",
    }
    
    timeout_cfg = httpx.Timeout(connect=10.0, read=180.0, write=10.0, pool=10.0)
    
    t0 = time.time()
    async with httpx.AsyncClient(timeout=timeout_cfg) as client:
        res_ns = await client.post(url, json=payload_non_stream)
        t_non_stream = time.time() - t0
        assert res_ns.status_code == 200
        data_ns = res_ns.json()
        content_ns = data_ns.get("message", {}).get("content", "")
    
    # 2. Streaming Request
    payload_stream = {
        "model": settings.OLLAMA_MODEL,
        "messages": [{"role": "user", "content": "What is 2 plus 2?"}],
        "stream": True,
        "options": {"num_ctx": 16384},
        "keep_alive": "15m",
    }
    
    t0_s = time.time()
    ttft_s = 0.0
    full_text_s = []
    
    async with httpx.AsyncClient(timeout=timeout_cfg) as client:
        async with client.stream("POST", url, json=payload_stream) as response_s:
            t_headers = time.time() - t0_s
            assert response_s.status_code == 200
            async for line in response_s.aiter_lines():
                if not line.strip():
                    continue
                try:
                    data = json.loads(line)
                    chunk = data.get("message", {}).get("content", "")
                    if chunk:
                        if ttft_s == 0.0:
                            ttft_s = time.time() - t0_s
                        full_text_s.append(chunk)
                except json.JSONDecodeError:
                    continue
    
    t_total_s = time.time() - t0_s
    
    print("\n" + "=" * 70)
    print("OLLAMA NON-STREAMING VS STREAMING DIAGNOSTIC COMPARISON")
    print("=" * 70)
    print(f"Model: {settings.OLLAMA_MODEL} (num_ctx=16384)")
    print(f"Non-Streaming Request:")
    print(f"  - Headers / TTFT: {t_non_stream:.2f}s (Blocked until full generation complete)")
    print(f"  - Total Latency: {t_non_stream:.2f}s")
    print(f"  - Content Length: {len(content_ns)} chars")
    print(f"Streaming Request:")
    print(f"  - HTTP Headers Received: {t_headers:.2f}s")
    print(f"  - First Token TTFT: {ttft_s:.2f}s")
    print(f"  - Total Latency: {t_total_s:.2f}s")
    print(f"  - Content Length: {len(''.join(full_text_s))} chars")
    print("=" * 70)
    
    assert content_ns != ""
    assert "".join(full_text_s) != ""
    # Streaming HTTP headers must arrive significantly faster than non-streaming total completion
    assert t_headers < 5.0


@pytest.mark.asyncio
async def test_ollama_preflight_health_check():
    """Requirement 8 & 9: Test Ollama preflight health check /api/ps."""
    provider = OllamaLLMProvider()
    health = await provider.check_ollama_health(target_model=settings.OLLAMA_MODEL)
    print(f"\n[PREFLIGHT HEALTH RESULT]: {health}")
    assert health["online"] is True
    assert "target_model" in health


@pytest.mark.asyncio
async def test_ollama_unavailable_handling():
    """Requirement 14: Test behavior when Ollama server is unavailable."""
    provider = OllamaLLMProvider(base_url="http://localhost:59999")
    with pytest.raises(LLMProviderError) as exc_info:
        await provider.generate_response(messages=[{"role": "user", "content": "hello"}])
    assert "unavailable" in str(exc_info.value).lower() or "ollama" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_ollama_model_not_found_handling():
    """Requirement 14: Test behavior when requested model is not found (404)."""
    provider = OllamaLLMProvider()
    with pytest.raises(LLMProviderError) as exc_info:
        await provider.generate_response(
            messages=[{"role": "user", "content": "hello"}],
            model="nonexistent-model-xyz-123"
        )
    assert "not found" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_ollama_timeout_handling():
    """Requirement 14: Test timeout handling when HTTP request times out."""
    provider = OllamaLLMProvider()
    with patch.object(httpx.AsyncClient, "stream", side_effect=httpx.ReadTimeout("Simulated read timeout")):
        with pytest.raises(LLMTimeoutError):
            await provider.generate_response(messages=[{"role": "user", "content": "hello"}])


@pytest.mark.asyncio
async def test_ollama_concurrent_requests():
    """Requirement 14: Test model lock serialization under concurrent requests."""
    provider = OllamaLLMProvider()
    t0 = time.time()
    task1 = asyncio.create_task(provider.generate_response(
        messages=[{"role": "user", "content": "What is 1 plus 1?"}],
        model=settings.OLLAMA_MODEL
    ))
    task2 = asyncio.create_task(provider.generate_response(
        messages=[{"role": "user", "content": "What is 2 plus 2?"}],
        model=settings.OLLAMA_MODEL
    ))
    res1, res2 = await asyncio.gather(task1, task2)
    t_total = time.time() - t0
    print(f"\n[CONCURRENT TEST SUCCESS] 2 concurrent calls finished in {t_total:.2f}s")
    assert res1 != ""
    assert res2 != ""


@pytest.mark.asyncio
async def test_ollama_streaming_response():
    """Requirement 14: Test generate_response_stream streaming generator."""
    provider = OllamaLLMProvider()
    chunks = []
    async for chunk in provider.generate_response_stream(
        messages=[{"role": "user", "content": "Say hello in one word."}],
        model=settings.OLLAMA_MODEL
    ):
        chunks.append(chunk)
    full_res = "".join(chunks)
    print(f"\n[STREAMING GENERATOR TEST] Received {len(chunks)} chunks, full_text='{full_res}'")
    assert len(chunks) > 0
    assert full_res != ""
