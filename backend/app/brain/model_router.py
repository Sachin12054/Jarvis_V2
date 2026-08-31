import re
from dataclasses import dataclass
from app.core.config import settings
from app.core.logging import logger


@dataclass
class RoutingResult:
    """Structured response detailing the model routing decision."""
    model: str
    category: str
    confidence: float


class ModelRouter:
    """Intelligent local model router for Ollama workloads.
    JARVIS reasoning model is Qwen3 4B (`qwen3-test:latest`).
    """

    def __init__(self):
        self.reasoning_model = getattr(settings, "OLLAMA_MODEL", "qwen3-test:latest")

    def route(self, prompt: str) -> RoutingResult:
        """Analyzes prompt intent and selects the JARVIS reasoning model."""
        logger.info(f"[ModelRouter] category=reasoning model={self.reasoning_model}")
        return RoutingResult(
            model=self.reasoning_model,
            category="reasoning",
            confidence=1.0,
        )
