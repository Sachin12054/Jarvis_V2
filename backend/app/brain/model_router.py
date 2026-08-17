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

    Determines the optimal local Ollama model based on query intent:
    - GENERAL ("gemma-3-4b:latest"): Casual dialogue, greetings, simple factual queries.
    - CODING ("qwen-coder-3b:latest"): Code generation, debugging, syntax, API implementation.
    - REASONING ("deepseek-r1-7b:latest"): Architecture trade-offs, complex logic, benchmarks, math.
    """

    def __init__(self):
        self.general_model = settings.OLLAMA_FAST_MODEL
        self.coding_model = settings.OLLAMA_CODING_MODEL
        self.reasoning_model = settings.OLLAMA_MODEL

    def route(self, prompt: str) -> RoutingResult:
        """Analyzes prompt intent and selects the optimal local Ollama model."""
        text = prompt.strip().lower()

        # 1. Check Reasoning Intent (High Priority for Architectural & Complex Trade-off Queries)
        if self._is_reasoning_intent(text):
            logger.info(f"[ModelRouter] category=reasoning model={self.reasoning_model}")
            return RoutingResult(
                model=self.reasoning_model,
                category="reasoning",
                confidence=0.95,
            )

        # 2. Check Coding Intent (High Priority for Code Generation & Debugging)
        if self._is_coding_intent(text):
            logger.info(f"[ModelRouter] category=coding model={self.coding_model}")
            return RoutingResult(
                model=self.coding_model,
                category="coding",
                confidence=0.90,
            )

        # 3. Fallback to General Intent (Fast model for conversation & simple Q&A)
        logger.info(f"[ModelRouter] category=general model={self.general_model}")
        return RoutingResult(
            model=self.general_model,
            category="general",
            confidence=0.85,
        )

    def _is_reasoning_intent(self, text: str) -> bool:
        """Detects requests requiring deep reasoning, trade-off comparison, or complex architecture."""
        # Comparison patterns across system architectures or approaches
        comparison_keywords = [
            "compare", "versus", " vs ", "tradeoff", "trade-off", "trade offs", "pros and cons",
            "which is better", "which scales better", "scale better", "scalability",
            "rest or websockets", "websockets or polling", "websockets or", "rest or",
            "should i use", "should jarvis use", "architectural decision", "system design"
        ]

        # Deep logic, math, and analysis patterns
        reasoning_keywords = [
            "complex problem", "mathematical reasoning", "algorithm analysis", "complexity analysis",
            "time complexity", "space complexity", "big o", "step by step reasoning",
            "derive a solution", "large-scale system", "system architectures"
        ]

        for kw in comparison_keywords + reasoning_keywords:
            if kw in text:
                return True

        return False

    def _is_coding_intent(self, text: str) -> bool:
        """Detects requests for code generation, debugging, syntax, or technical implementation."""
        # Code snippets or blocks
        if "```" in text or "def " in text or "function " in text or "class " in text:
            return True

        # Explicit code creation & editing phrases
        coding_phrases = [
            "write code", "write a python", "write python", "write java", "write javascript",
            "write a function", "write an api", "write a script", "write a fastapi",
            "write a django", "write a flask", "write a query", "write a dockerfile",
            "create a python", "create a function", "create an api", "create a fast-api",
            "how do i create a python", "how to write", "how do i write",
            "debug this", "debug code", "fix this error", "fix error", "fix bug", "fix exception",
            "implement a function", "implement a method", "implement an api", "implement this",
            "sql query", "dockerfile", "git command", "git commands", "optimize this code",
            "explain this code", "syntax error"
        ]

        for phrase in coding_phrases:
            if phrase in text:
                return True

        # Single word programming languages / frameworks combined with task keywords
        prog_terms = ["python", "java", "javascript", "typescript", "golang", "rust", "fastapi", "django", "flask", "react", "vue", "docker", "git", "sql"]
        action_terms = ["write", "code", "create", "debug", "fix", "implement", "build", "script", "function", "endpoint"]

        has_prog = any(term in text for term in prog_terms)
        has_action = any(term in text for term in action_terms)

        if has_prog and has_action:
            # Exclude explicit conceptual explanations like "explain why python lists are mutable"
            if "explain why" in text:
                return False
            return True

        return False
