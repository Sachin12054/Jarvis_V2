import pytest
from unittest.mock import AsyncMock, MagicMock
from app.brain.model_router import ModelRouter
from app.brain.orchestrator import JARVISOrchestrator
from app.core.config import settings


def test_router_general_greeting():
    """Verifies 'Hello JARVIS' routes to general category (gemma-3-4b:latest)."""
    router = ModelRouter()
    result = router.route("Hello JARVIS")
    assert result.category == "general"
    assert result.model == settings.OLLAMA_FAST_MODEL


def test_router_coding_request():
    """Verifies 'Write a Python function to sort a list' routes to coding category (qwen-coder-3b:latest)."""
    router = ModelRouter()
    result = router.route("Write a Python function to sort a list")
    assert result.category == "coding"
    assert result.model == settings.OLLAMA_CODING_MODEL


def test_router_debugging_request():
    """Verifies 'Debug this Python code and fix the error' routes to coding category (qwen-coder-3b:latest)."""
    router = ModelRouter()
    result = router.route("Debug this Python code and fix the error")
    assert result.category == "coding"
    assert result.model == settings.OLLAMA_CODING_MODEL


def test_router_complex_reasoning():
    """Verifies architecture comparison routes to reasoning category (deepseek-r1-7b:latest)."""
    router = ModelRouter()
    result = router.route("Compare these two system architectures and determine which scales better")
    assert result.category == "reasoning"
    assert result.model == settings.OLLAMA_MODEL


def test_router_simple_explanation():
    """Verifies 'What is a database?' routes to general category (gemma-3-4b:latest)."""
    router = ModelRouter()
    result = router.route("What is a database?")
    assert result.category == "general"
    assert result.model == settings.OLLAMA_FAST_MODEL


def test_router_technical_architecture():
    """Verifies 'Should JARVIS use WebSockets or polling for real-time communication?' routes to reasoning category (deepseek-r1-7b:latest)."""
    router = ModelRouter()
    result = router.route("Should JARVIS use WebSockets or polling for real-time communication?")
    assert result.category == "reasoning"
    assert result.model == settings.OLLAMA_MODEL


def test_router_avoid_bad_routing_list_explanation():
    """Verifies 'Explain why Python lists are mutable.' routes to general category."""
    router = ModelRouter()
    result = router.route("Explain why Python lists are mutable.")
    assert result.category == "general"
    assert result.model == settings.OLLAMA_FAST_MODEL


@pytest.mark.asyncio
async def test_orchestrator_explicit_model_override(monkeypatch):
    """Verifies that an explicit model parameter passed to orchestrator is not overridden by ModelRouter."""
    monkeypatch.setattr(settings, "LLM_PROVIDER", "ollama")

    mock_llm_manager = MagicMock()
    mock_llm_manager.generate = AsyncMock(return_value="Explicit response")

    orchestrator = JARVISOrchestrator(llm_manager=mock_llm_manager)

    # Pass explicit model override
    res = await orchestrator.process_turn(
        user_message="Write code",
        history=[],
        model="gemma-3-4b:latest",
    )

    assert res["model"] == "gemma-3-4b:latest"
    mock_llm_manager.generate.assert_called_once()
    assert mock_llm_manager.generate.call_args.kwargs["model"] == "gemma-3-4b:latest"
