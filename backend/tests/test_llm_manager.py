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
