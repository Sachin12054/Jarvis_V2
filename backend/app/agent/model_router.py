import re
from enum import Enum
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.core.model_router import (
    CanonicalModelRouter,
    ModelSelectionContext,
    TaskComplexity,
    InteractionChannel,
)


class ModelRole(str, Enum):
    CASUAL = "qwen3-test:latest"
    REASONING = "qwen3-test:latest"
    CODING = "qwen3-test:latest"


class ModelRouter:
    """Legacy Agent ModelRouter adapter delegating to CanonicalModelRouter."""

    def __init__(self, default_model: Optional[str] = None):
        self._canonical_router = CanonicalModelRouter()
        self.default_model = default_model or getattr(settings, "OLLAMA_MODEL", "qwen3-test:latest")

    def select_model(self, user_message: str, task_context: Optional[Dict[str, Any]] = None) -> str:
        """Delegates selection to CanonicalModelRouter."""
        context = ModelSelectionContext(
            channel=InteractionChannel.CHAT,
            complexity=TaskComplexity.NORMAL,
        )
        route_res = self._canonical_router.route(context)
        selected = route_res.selected_model or self.default_model
        logger.info(f"[Agent ModelRouter Adapter] Selected '{selected}'")
        return selected

    def get_fallback_model(self, failed_model: str) -> str:
        """Returns fallback model from CanonicalModelRouter or default."""
        context = ModelSelectionContext(channel=InteractionChannel.CHAT)
        route_res = self._canonical_router.route(context)
        if route_res.fallbacks:
            return route_res.fallbacks[0]
        return self.default_model
