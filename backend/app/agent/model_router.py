import re
from enum import Enum
from typing import Dict, Any, Optional
from app.core.logging import logger


class ModelRole(str, Enum):
    CASUAL = "gemma-3-4b:latest"
    REASONING = "deepseek-r1-7b:latest"
    CODING = "qwen-coder-3b:latest"


class ModelRouter:
    """Intelligently routes task contexts to specialized local Ollama models based on task complexity."""

    def __init__(self, default_model: str = "gemma-3-4b:latest"):
        self.default_model = default_model

    def select_model(self, user_message: str, task_context: Optional[Dict[str, Any]] = None) -> str:
        """Infers task complexity and selects appropriate model role without requiring manual user selection."""
        clean = user_message.strip().lower()
        ctx = task_context or {}

        # 1. Coding & Repository Tasks -> Qwen Coder
        is_coding = (
            ctx.get("requires_code", False)
            or bool(re.search(r'\b(?:code|python|typescript|react|fastapi|backend|frontend|function|bug|refactor|repo|repository|class|import|def|script|npm|pytest)\b', clean))
        )
        if is_coding:
            logger.info("[MODEL ROUTER] Selected 'qwen-coder-3b:latest' for coding/repository task")
            return ModelRole.CODING.value

        # 2. Deep Reasoning, Performance Diagnosis & Multi-Step Planning -> DeepSeek R1
        is_reasoning = (
            ctx.get("requires_reasoning", False)
            or bool(re.search(r'\b(?:why|slow|bottleneck|diagnose|plan|architecture|compare|analyze|evaluate|reason|heavy\s+load|overheating)\b', clean))
        )
        if is_reasoning:
            logger.info("[MODEL ROUTER] Selected 'deepseek-r1-7b:latest' for complex reasoning/diagnosis task")
            return ModelRole.REASONING.value

        # 3. Casual Conversation, Quick Profile/System Lookup -> Gemma 3
        logger.info("[MODEL ROUTER] Selected 'gemma-3-4b:latest' for casual dialogue/fast task")
        return ModelRole.CASUAL.value

    def get_fallback_model(self, failed_model: str) -> str:
        """Returns robust fallback model if preferred model fails or is offline."""
        if "deepseek" in failed_model or "qwen" in failed_model:
            return ModelRole.CASUAL.value
        return self.default_model
