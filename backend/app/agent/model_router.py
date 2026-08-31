import re
from enum import Enum
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger


class ModelRole(str, Enum):
    CASUAL = "qwen3-test:latest"
    REASONING = "qwen3-test:latest"
    CODING = "qwen3-test:latest"


class ModelRouter:
    """Intelligently routes task contexts to specialized local Ollama models based on task complexity.
    Primary JARVIS reasoning engine is Qwen3 4B (qwen3-test:latest).
    """

    def __init__(self, default_model: Optional[str] = None):
        self.default_model = default_model or getattr(settings, "OLLAMA_MODEL", "qwen3-test:latest")

    def select_model(self, user_message: str, task_context: Optional[Dict[str, Any]] = None) -> str:
        """Selects primary JARVIS reasoning model (qwen3-test:latest)."""
        logger.info(f"[MODEL ROUTER] Selected primary model '{self.default_model}' for request")
        return self.default_model

    def get_fallback_model(self, failed_model: str) -> str:
        """Returns fallback model."""
        return self.default_model
