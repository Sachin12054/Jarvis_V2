import pytest
from app.brain.llm_manager import LLMManager, MockLLMProvider
from app.core.exceptions import LLMProviderError


@pytest.mark.asyncio
async def test_mock_llm_provider_success():
    """Verifies MockLLMProvider generates a response for standard input."""
    provider = MockLLMProvider()
    messages = [
        {"role": "system", "content": "You are JARVIS."},
        {"role": "user", "content": "What is 2+2?"},
    ]
    response = await provider.generate_response(messages)
    assert "Mock response from JARVIS" in response
    assert "What is 2+2?" in response


@pytest.mark.asyncio
async def test_mock_llm_provider_simulated_error():
    """Verifies MockLLMProvider raises LLMProviderError when message contains 'error'."""
    provider = MockLLMProvider()
    messages = [
        {"role": "user", "content": "Trigger an error now"},
    ]
    with pytest.raises(LLMProviderError) as exc_info:
        await provider.generate_response(messages)
    assert "mock" in str(exc_info.value)


@pytest.mark.asyncio
async def test_llm_manager_fallback():
    """Verifies LLMManager falls back to MockLLMProvider when given an unknown provider string."""
    manager = LLMManager(provider_name="unknown_provider_xyz")
    assert isinstance(manager.provider, MockLLMProvider)

    response = await manager.generate([{"role": "user", "content": "Hello"}])
    assert "Mock response" in response


# --- OllamaLLMProvider Unit Tests (HTTP Mocked) ---

from unittest.mock import AsyncMock, patch, MagicMock
import httpx
from app.brain.llm_manager import OllamaLLMProvider
from app.core.exceptions import LLMTimeoutError


@pytest.mark.asyncio
async def test_ollama_provider_success():
    """Verifies OllamaLLMProvider parses successful Ollama chat response."""
    provider = OllamaLLMProvider(base_url="http://127.0.0.1:11434")
    messages = [{"role": "user", "content": "Hello Ollama"}]

    mock_response = httpx.Response(
        status_code=200,
        json={"message": {"role": "assistant", "content": "Greetings from deepseek-r1-7b"}},
    )

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        result = await provider.generate_response(messages, model="deepseek-r1-7b:latest")
        assert result == "Greetings from deepseek-r1-7b"
        mock_post.assert_called_once()
        call_kwargs = mock_post.call_args.kwargs
        assert call_kwargs["json"]["model"] == "deepseek-r1-7b:latest"
        assert call_kwargs["json"]["messages"] == messages


@pytest.mark.asyncio
async def test_ollama_provider_timeout():
    """Verifies OllamaLLMProvider raises LLMTimeoutError on timeout."""
    provider = OllamaLLMProvider(base_url="http://127.0.0.1:11434")
    messages = [{"role": "user", "content": "Slow request"}]

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.side_effect = httpx.TimeoutException("Request timed out")
        with pytest.raises(LLMTimeoutError) as exc_info:
            await provider.generate_response(messages)
        assert "ollama" in str(exc_info.value)


@pytest.mark.asyncio
async def test_ollama_provider_http_404():
    """Verifies OllamaLLMProvider raises LLMProviderError on HTTP 404 (model not found)."""
    provider = OllamaLLMProvider(base_url="http://127.0.0.1:11434")
    messages = [{"role": "user", "content": "Hello"}]

    mock_response = httpx.Response(status_code=404, text="Model not found")

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        with pytest.raises(LLMProviderError) as exc_info:
            await provider.generate_response(messages, model="non-existent-model")
        assert "not found" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_ollama_provider_connection_failure():
    """Verifies OllamaLLMProvider raises LLMProviderError when server is unavailable."""
    provider = OllamaLLMProvider(base_url="http://127.0.0.1:11434")
    messages = [{"role": "user", "content": "Hello"}]

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.side_effect = httpx.ConnectError("Connection refused")
        with pytest.raises(LLMProviderError) as exc_info:
            await provider.generate_response(messages)
        assert "unavailable" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_ollama_provider_malformed_response():
    """Verifies OllamaLLMProvider raises LLMProviderError when response structure is invalid."""
    provider = OllamaLLMProvider(base_url="http://127.0.0.1:11434")
    messages = [{"role": "user", "content": "Hello"}]

    mock_response = httpx.Response(status_code=200, json={"unexpected_key": "data"})

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        with pytest.raises(LLMProviderError) as exc_info:
            await provider.generate_response(messages)
        assert "malformed" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_ollama_provider_registration():
    """Verifies LLMManager instantiates OllamaLLMProvider when provider_name is ollama."""
    manager = LLMManager(provider_name="ollama")
    assert isinstance(manager.provider, OllamaLLMProvider)


@pytest.mark.asyncio
async def test_ollama_provider_explicit_model_selection():
    """Verifies passing explicit model string is correctly sent to Ollama API."""
    provider = OllamaLLMProvider(base_url="http://127.0.0.1:11434")
    messages = [{"role": "user", "content": "Write code"}]
    mock_response = httpx.Response(
        status_code=200,
        json={"message": {"role": "assistant", "content": "Code response"}},
    )

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        res = await provider.generate_response(messages, model="qwen-coder-3b:latest")
        assert res == "Code response"
        assert mock_post.call_args.kwargs["json"]["model"] == "qwen-coder-3b:latest"


@pytest.mark.asyncio
async def test_ollama_provider_stream_success():
    """Verifies OllamaLLMProvider.generate_response_stream yields incremental JSON line tokens."""
    provider = OllamaLLMProvider(base_url="http://127.0.0.1:11434")
    messages = [{"role": "user", "content": "Hello"}]

    lines = [
        b'{"message":{"role":"assistant","content":"Hello"},"done":false}\n',
        b'{"message":{"role":"assistant","content":" world"},"done":false}\n',
        b'{"done":true}\n',
    ]

    async def mock_aiter_lines():
        for line in lines:
            yield line.decode("utf-8")

    mock_stream_resp = MagicMock()
    mock_stream_resp.status_code = 200
    mock_stream_resp.aiter_lines = mock_aiter_lines

    class MockStreamContext:
        async def __aenter__(self):
            return mock_stream_resp
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

    with patch("httpx.AsyncClient.stream", return_value=MockStreamContext()):
        chunks = []
        async for chunk in provider.generate_response_stream(messages):
            chunks.append(chunk)

        assert chunks == ["Hello", " world"]

