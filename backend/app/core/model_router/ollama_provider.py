import time
import asyncio
from typing import Set, Optional
import httpx
from app.core.config import settings
from app.core.logging import logger


class OllamaAvailabilityAdapter:
    """Runtime availability provider for Ollama models with short-lived TTL caching.
    
    Provides bounded, non-blocking model availability checks without adding latency
    to voice or chat requests.
    """

    def __init__(self, base_url: Optional[str] = None, cache_ttl_seconds: float = 10.0):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.cache_ttl_seconds = cache_ttl_seconds
        self._cached_available_models: Set[str] = set()
        self._last_check_time: float = 0.0
        self._lock = asyncio.Lock()

    async def refresh_availability(self) -> Set[str]:
        """Queries Ollama GET /api/tags to discover currently installed models."""
        now = time.time()
        if now - self._last_check_time < self.cache_ttl_seconds and self._cached_available_models:
            return self._cached_available_models

        url = f"{self.base_url}/api/tags"
        timeout_cfg = httpx.Timeout(connect=1.0, read=1.0, write=1.0, pool=1.0)

        try:
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    models = data.get("models", [])
                    available = set()
                    for m in models:
                        name = m.get("name") or m.get("model")
                        if name:
                            available.add(name)
                            # Also add name without tag if :latest
                            if ":" in name:
                                available.add(name.split(":")[0])

                    self._cached_available_models = available
                    self._last_check_time = now
                    logger.debug(f"[OllamaAvailabilityAdapter] Discovered models: {available}")
                    return available
        except Exception as exc:
            logger.debug(f"[OllamaAvailabilityAdapter] Could not check /api/tags: {exc}")

        # If refresh fails, return previous cache or assume default configured models are available
        return self._cached_available_models or {settings.OLLAMA_MODEL, settings.OLLAMA_CODING_MODEL}

    def is_model_available(self, model_id: str) -> bool:
        """Synchronous protocol check for CanonicalModelRouter."""
        if not self._cached_available_models:
            # First check or cache uninitialized: assume true for registered models to avoid blocking router
            return True

        base_name = model_id.split(":")[0] if ":" in model_id else model_id
        return model_id in self._cached_available_models or base_name in self._cached_available_models
