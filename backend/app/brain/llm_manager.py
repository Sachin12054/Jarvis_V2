from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings
from app.core.exceptions import LLMProviderError, LLMTimeoutError
from app.core.logging import logger


class LLMProvider(ABC):
    """Abstract base class interface for all LLM providers."""

    @abstractmethod
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        timeout: Optional[float] = None,
    ) -> str:
        """Generates a text completion response for given messages."""
        pass


class MockLLMProvider(LLMProvider):
    """Mock LLM provider for unit testing and offline development."""

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        timeout: Optional[float] = None,
    ) -> str:
        user_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break

        logger.info(f"[MockLLMProvider] Processing message: {user_message[:50]}...")
        if "error" in user_message.lower():
            raise LLMProviderError("mock", "Simulated mock provider failure")

        return f"Mock response from JARVIS to: '{user_message}'"


class OpenAILLMProvider(LLMProvider):
    """OpenAI and OpenAI-compatible API provider via HTTPX."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.LLM_API_KEY
        self.base_url = "https://api.openai.com/v1/chat/completions"

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        timeout: Optional[float] = None,
    ) -> str:
        if not self.api_key:
            raise LLMProviderError("openai", "LLM_API_KEY environment variable is not configured.")

        selected_model = model or settings.LLM_MODEL
        req_timeout = timeout or settings.LLM_TIMEOUT

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": selected_model,
            "messages": messages,
        }

        try:
            async with httpx.AsyncClient(timeout=req_timeout) as client:
                response = await client.post(self.base_url, headers=headers, json=payload)
                if response.status_code != 200:
                    raise LLMProviderError("openai", f"HTTP {response.status_code}: {response.text}")
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except httpx.TimeoutException:
            raise LLMTimeoutError("openai")
        except httpx.RequestError as exc:
            raise LLMProviderError("openai", f"Network request error: {str(exc)}")


class GeminiLLMProvider(LLMProvider):
    """Google Gemini API provider via HTTPX REST interface."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.LLM_API_KEY

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        timeout: Optional[float] = None,
    ) -> str:
        if not self.api_key:
            raise LLMProviderError("gemini", "LLM_API_KEY environment variable is not configured.")

        selected_model = model or settings.LLM_MODEL or "gemini-1.5-flash"
        req_timeout = timeout or settings.LLM_TIMEOUT

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{selected_model}:generateContent?key={self.api_key}"

        contents = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            if msg["role"] == "system":
                continue
            contents.append({
                "role": role,
                "parts": [{"text": msg["content"]}],
            })

        payload = {"contents": contents}

        try:
            async with httpx.AsyncClient(timeout=req_timeout) as client:
                response = await client.post(url, json=payload)
                if response.status_code != 200:
                    raise LLMProviderError("gemini", f"HTTP {response.status_code}: {response.text}")
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except httpx.TimeoutException:
            raise LLMTimeoutError("gemini")
        except httpx.RequestError as exc:
            raise LLMProviderError("gemini", f"Network request error: {str(exc)}")


class LLMManager:
    """Factory and router for LLM Provider instances."""

    _providers = {
        "mock": MockLLMProvider,
        "openai": OpenAILLMProvider,
        "gemini": GeminiLLMProvider,
    }

    def __init__(self, provider_name: Optional[str] = None):
        self.provider_name = (provider_name or settings.LLM_PROVIDER).lower()
        self.provider = self._get_provider(self.provider_name)

    def _get_provider(self, provider_name: str) -> LLMProvider:
        provider_cls = self._providers.get(provider_name)
        if not provider_cls:
            logger.warning(f"Unknown provider '{provider_name}'. Falling back to MockLLMProvider.")
            return MockLLMProvider()
        return provider_cls()

    async def generate(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        timeout: Optional[float] = None,
    ) -> str:
        """Routes text generation call to the configured provider."""
        return await self.provider.generate_response(messages, model=model, timeout=timeout)
