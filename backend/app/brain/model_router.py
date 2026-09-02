import re
from dataclasses import dataclass
from typing import Optional
from app.core.config import settings
from app.core.logging import logger
from app.core.model_router import (
    CanonicalModelRouter,
    ModelSelectionContext,
    TaskComplexity,
    InteractionChannel,
)


@dataclass
class RoutingResult:
    """Structured response detailing the model routing decision (Legacy compatibility)."""
    model: str
    category: str
    confidence: float


class ModelRouter:
    """Legacy ModelRouter adapter delegating to CanonicalModelRouter."""

    def __init__(self):
        self._canonical_router = CanonicalModelRouter()
        self.reasoning_model = getattr(settings, "OLLAMA_MODEL", "qwen3-test:latest")

    def route(self, prompt: str) -> RoutingResult:
        """Analyzes prompt intent and selects the JARVIS reasoning model via CanonicalModelRouter."""
        context = ModelSelectionContext(
            channel=InteractionChannel.CHAT,
            complexity=TaskComplexity.NORMAL,
            intent="LEGACY_PROMPT",
        )
        route_res = self._canonical_router.route(context)
        model = route_res.selected_model or self.reasoning_model
        logger.info(f"[ModelRouter Legacy Adapter] model={model}")
        return RoutingResult(
            model=model,
            category="reasoning",
            confidence=1.0,
        )
