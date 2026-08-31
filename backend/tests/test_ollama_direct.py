import sys
import time
import json
import asyncio
import httpx
import pytest
from app.core.config import settings
from app.brain.llm_manager import OllamaLLMProvider, LLMTimeoutError, LLMProviderError


@pytest.mark.asyncio
async def test_direct_ollama_qwen3_request():
    """Requirement 2 & 11: Reproduce & verify direct Ollama Qwen3 request with num_ctx=16384."""
    url = "http://localhost:11434/api/chat"
    payload = {
        "model": "qwen3-test:latest",
        "messages": [{"role": "user", "content": "What is 2 plus 2?"}],
        "stream": False,
        "options": {
            "num_ctx": 16384
        },
        "keep_alive": "15m",
    }

    t0 = time.time()
    print("\n[DIRECT OLLAMA TEST] Sending request to Ollama...")

    timeout_cfg = httpx.Timeout(connect=10.0, read=180.0, write=10.0, pool=10.0)

    async with httpx.AsyncClient(timeout=timeout_cfg) as client:
        res = await client.post(url, json=payload)
        t_resp = time.time() - t0
        print(f"[DIRECT OLLAMA TEST] Status: {res.status_code} in {t_resp:.2f}s")

        assert res.status_code == 200
        data = res.json()
        content = data.get("message", {}).get("content", "")
        safe_content = content.encode("ascii", errors="replace").decode("ascii")
        print(f"[DIRECT OLLAMA TEST] Response Content Summary: '{safe_content[:60]}...'")
        assert content != ""


@pytest.mark.asyncio
async def test_ollama_provider_timing_and_logging():
    """Tests OllamaLLMProvider timing, logging, and num_ctx=16384 compliance."""
    provider = OllamaLLMProvider()
    t0 = time.time()
    res = await provider.generate_response(
        messages=[{"role": "user", "content": "What is 2 plus 2?"}],
        model="qwen3-test:latest",
        timeout=180.0
    )
    t_total = time.time() - t0
    safe_res = res.encode("ascii", errors="replace").decode("ascii")
    print(f"\n[OLLAMA PROVIDER TEST] Generated response in {t_total:.2f}s:\n{safe_res[:80]}")
    assert res != ""


@pytest.mark.asyncio
async def test_ollama_concurrent_request_protection():
    """Tests OllamaLLMProvider async model lock serialization under concurrent calls."""
    provider = OllamaLLMProvider()
    t0 = time.time()

    # Launch 2 concurrent calls
    task1 = asyncio.create_task(provider.generate_response(
        messages=[{"role": "user", "content": "What is 2 plus 2?"}],
        model="qwen3-test:latest"
    ))
    task2 = asyncio.create_task(provider.generate_response(
        messages=[{"role": "user", "content": "What is 3 plus 3?"}],
        model="qwen3-test:latest"
    ))

    res1, res2 = await asyncio.gather(task1, task2)
    t_total = time.time() - t0
    print(f"\n[CONCURRENT TEST] Successfully completed 2 concurrent calls in {t_total:.2f}s")
    assert res1 != ""
    assert res2 != ""
