import pytest
from app.core.contracts import JarvisRequest, InputChannel
from app.core.understanding import UnderstandingPipeline
from app.core.decision import DecisionGate
from app.core.model_router.contracts import (
    ModelCapability,
    TaskComplexity,
    InteractionChannel,
    ModelSelectionContext,
    ModelProfile,
    ModelRoute,
)
from app.core.model_router.registry import ModelRegistry
from app.core.model_router.router import CanonicalModelRouter
from app.core.model_router.context_builder import ModelSelectionContextBuilder


def test_simple_arithmetic_routing():
    router = CanonicalModelRouter()
    req = JarvisRequest(conversation_id="c1", raw_input="What is 15 multiplied by 24?", input_text="What is 15 multiplied by 24?")
    und = UnderstandingPipeline.process(req)
    dec = DecisionGate.evaluate(req, und)
    ctx = ModelSelectionContextBuilder.build(req, und, dec)
    route = router.route(ctx)
    assert route.is_satisfied is True
    assert route.selected_model == "qwen3-test:latest"
    assert ctx.complexity == TaskComplexity.SIMPLE


def test_general_knowledge_routing():
    router = CanonicalModelRouter()
    req = JarvisRequest(conversation_id="c1", raw_input="Explain computing in simple terms.", input_text="Explain computing in simple terms.")
    und = UnderstandingPipeline.process(req)
    dec = DecisionGate.evaluate(req, und)
    ctx = ModelSelectionContextBuilder.build(req, und, dec)
    route = router.route(ctx)
    assert route.is_satisfied is True
    assert route.selected_model == "qwen3-test:latest"
    assert route.selected_model != "qwen-coder-3b:latest"


def test_coding_routing():
    router = CanonicalModelRouter()
    req = JarvisRequest(conversation_id="c1", raw_input="Write a Python function to calculate Fibonacci numbers.", input_text="Write a Python function to calculate Fibonacci numbers.")
    und = UnderstandingPipeline.process(req)
    dec = DecisionGate.evaluate(req, und)
    ctx = ModelSelectionContextBuilder.build(req, und, dec)
    route = router.route(ctx)
    assert route.is_satisfied is True
    assert route.selected_model == "qwen-coder-3b:latest"
    assert ctx.requires_coding is True


def test_complex_reasoning_routing():
    router = CanonicalModelRouter()
    req = JarvisRequest(
        conversation_id="c1",
        raw_input="Solve this complex reasoning problem: A system has several interacting constraints. Determine the optimal solution and explain your reasoning.",
        input_text="Solve this complex reasoning problem: A system has several interacting constraints. Determine the optimal solution and explain your reasoning.",
    )
    und = UnderstandingPipeline.process(req)
    dec = DecisionGate.evaluate(req, und)
    ctx = ModelSelectionContextBuilder.build(req, und, dec)
    route = router.route(ctx)
    assert route.is_satisfied is True
    assert route.selected_model == "deepseek-r1-7b:latest"
    assert ctx.requires_reasoning is True
    assert ctx.complexity == TaskComplexity.DEEP_REASONING


def test_direct_action_bypasses_model_router():
    req = JarvisRequest(conversation_id="c1", raw_input="Open Chrome.", input_text="Open Chrome.")
    und = UnderstandingPipeline.process(req)
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy.value == "DIRECT_ACTION"


def test_tool_required_task_rejects_non_tool_models():
    router = CanonicalModelRouter()
    context = ModelSelectionContext(requires_tool_calling=True)
    route = router.route(context)
    assert route.selected_model == "qwen3-test:latest"


def test_long_context_task_rejects_insufficient_context_models():
    router = CanonicalModelRouter()
    context = ModelSelectionContext(required_context_tokens=65000, requires_long_context=True)
    route = router.route(context)
    assert route.selected_model == "qwen3-test:latest"
    assert "qwen-coder-3b:latest" not in route.fallbacks


def test_latency_preference_when_capabilities_equal():
    router = CanonicalModelRouter()
    context = ModelSelectionContext(channel=InteractionChannel.VOICE, latency_sensitive=True, complexity=TaskComplexity.SIMPLE)
    route = router.route(context)
    assert route.is_satisfied is True


def test_end_to_end_integration_pipeline():
    # Input -> Understanding -> Decision -> ContextBuilder -> CanonicalRouter -> ModelRoute
    req = JarvisRequest(conversation_id="c1", raw_input="Write a Python function to calculate Fibonacci numbers.")
    und = UnderstandingPipeline.process(req)
    dec = DecisionGate.evaluate(req, und)
    ctx = ModelSelectionContextBuilder.build(req, und, dec)
    route = CanonicalModelRouter().route(ctx)

    assert und.intent == "CODING_TASK"
    assert dec.strategy.value in ("KNOWLEDGE_QUERY", "COMPLEX_TASK")
    assert ctx.requires_coding is True
    assert route.selected_model == "qwen-coder-3b:latest"
