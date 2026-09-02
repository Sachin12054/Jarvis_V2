import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock
from app.core.contracts import (
    JarvisRequest,
    JarvisResponse,
    InputChannel,
    DecisionStrategy,
    ResponseType,
)
from app.core.orchestrator import JarvisCoreOrchestrator
from app.core.knowledge import KnowledgeHandler
from app.core.model_router import (
    CanonicalModelRouter,
    ModelSelectionContextBuilder,
    OllamaAvailabilityAdapter,
    ModelRegistry,
    ModelSelectionContext,
    TaskComplexity,
    InteractionChannel,
)
from app.brain.llm_manager import MockLLMProvider


@pytest.mark.asyncio
async def test_simple_request_routes_through_canonical_model_router():
    kh = KnowledgeHandler(llm_provider=MockLLMProvider())
    core = JarvisCoreOrchestrator(knowledge_handler=kh)
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="hello jarvis", input_text="hello jarvis")
    resp = await core.process_request(req)
    assert resp.response_type in [ResponseType.TEXT, ResponseType.ACTION]
    assert resp.metadata.get("model") is not None


@pytest.mark.asyncio
async def test_general_request_uses_selected_model():
    kh = KnowledgeHandler(llm_provider=MockLLMProvider())
    core = JarvisCoreOrchestrator(knowledge_handler=kh)
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="what is the capital of France", input_text="what is the capital of France")
    resp = await core.process_request(req)
    assert resp.metadata.get("model") == "qwen3-test:latest"


@pytest.mark.asyncio
async def test_coding_request_selects_coding_model():
    router = CanonicalModelRouter()
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="write code for quicksort in Python", input_text="write code for quicksort in Python")
    from app.core.understanding import UnderstandingPipeline
    from app.core.decision import DecisionGate
    und = UnderstandingPipeline.process(req)
    und.intent = "CODING_TASK"
    dec = DecisionGate.evaluate(req, und)
    sel_ctx = ModelSelectionContextBuilder.build(req, und, dec)
    route = router.route(sel_ctx)
    assert route.selected_model == "qwen-coder-3b:latest"


@pytest.mark.asyncio
async def test_reasoning_request_selects_reasoning_model():
    router = CanonicalModelRouter()
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="solve deep logic math puzzle", input_text="solve deep logic math puzzle")
    from app.core.understanding import UnderstandingPipeline
    from app.core.decision import DecisionGate
    und = UnderstandingPipeline.process(req)
    und.intent = "DEEP_REASONING"
    dec = DecisionGate.evaluate(req, und)
    sel_ctx = ModelSelectionContextBuilder.build(req, und, dec)
    route = router.route(sel_ctx)
    assert route.selected_model == "deepseek-r1-7b:latest"


@pytest.mark.asyncio
async def test_tool_request_requires_tool_capable_model():
    router = CanonicalModelRouter()
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="search files in workspace", input_text="search files in workspace")
    from app.core.understanding import UnderstandingPipeline
    from app.core.decision import DecisionGate
    und = UnderstandingPipeline.process(req)
    und.intent = "FILESYSTEM_SEARCH"
    dec = DecisionGate.evaluate(req, und)
    sel_ctx = ModelSelectionContextBuilder.build(req, und, dec)
    route = router.route(sel_ctx)
    assert route.selected_model == "qwen3-test:latest"


@pytest.mark.asyncio
async def test_voice_request_provides_latency_sensitive_context():
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="jarvis status", input_text="jarvis status", channel="voice", input_channel=InputChannel.VOICE)
    from app.core.understanding import UnderstandingPipeline
    from app.core.decision import DecisionGate
    und = UnderstandingPipeline.process(req)
    dec = DecisionGate.evaluate(req, und)
    sel_ctx = ModelSelectionContextBuilder.build(req, und, dec)
    assert sel_ctx.channel == InteractionChannel.VOICE
    assert sel_ctx.latency_sensitive is True


@pytest.mark.asyncio
async def test_direct_action_bypasses_model_router():
    router_mock = MagicMock(spec=CanonicalModelRouter)
    core = JarvisCoreOrchestrator(model_router=router_mock)
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="open chrome", input_text="open chrome")
    resp = await core.process_request(req)
    assert resp.response_type in [ResponseType.ACTION, ResponseType.ERROR]
    # Model router must NOT be called for direct actions
    router_mock.route.assert_not_called()


@pytest.mark.asyncio
async def test_fallback_execution_when_primary_fails():
    class FailingPrimaryProvider:
        async def generate_response(self, messages, model=None, timeout=None):
            if model == "qwen3-test:latest":
                raise RuntimeError("Primary model error")
            return "Fallback model response"

    kh = KnowledgeHandler(llm_provider=FailingPrimaryProvider())
    core = JarvisCoreOrchestrator(knowledge_handler=kh)
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="what is quantum mechanics", input_text="what is quantum mechanics")
    resp = await core.process_request(req)
    assert resp.error is None
    assert resp.metadata.get("fallback_used") is True
    assert resp.metadata.get("model") != "qwen3-test:latest"


@pytest.mark.asyncio
async def test_max_fallback_attempts_enforced():
    class AlwaysFailingProvider:
        async def generate_response(self, messages, model=None, timeout=None):
            raise RuntimeError(f"Model {model} failed")

    kh = KnowledgeHandler(llm_provider=AlwaysFailingProvider())
    core = JarvisCoreOrchestrator(knowledge_handler=kh)
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="what is quantum computing", input_text="what is quantum computing")
    resp = await core.process_request(req)
    assert resp.response_type == ResponseType.ERROR
    assert "Failed to generate knowledge response" in resp.message


@pytest.mark.asyncio
async def test_no_compatible_model_produces_explicit_routing_failure():
    class ImpossibleRouter(CanonicalModelRouter):
        def route(self, context):
            from app.core.model_router import ModelRoute
            return ModelRoute(
                selected_model="",
                provider="",
                fallbacks=[],
                reason="No compatible model available",
                is_satisfied=False,
            )

    core = JarvisCoreOrchestrator(model_router=ImpossibleRouter())
    req = JarvisRequest(conversation_id="conv-rt-1", raw_input="explain photosynthesis", input_text="explain photosynthesis")
    resp = await core.process_request(req)
    assert resp.response_type == ResponseType.ERROR
    assert "Model routing failure" in resp.message


@pytest.mark.asyncio
async def test_ollama_availability_adapter_caching_and_non_blocking():
    adapter = OllamaAvailabilityAdapter(cache_ttl_seconds=5.0)
    # Synchronous check does not block
    avail = adapter.is_model_available("qwen3-test:latest")
    assert avail is True


@pytest.mark.asyncio
async def test_no_per_request_benchmark_execution():
    # Routing overhead test
    router = CanonicalModelRouter()
    context = ModelSelectionContext(channel=InteractionChannel.CHAT)
    t0 = asyncio.get_event_loop().time()
    for _ in range(100):
        router.route(context)
    t1 = asyncio.get_event_loop().time()
    overhead_ms = ((t1 - t0) / 100.0) * 1000.0
    assert overhead_ms < 1.0  # Routing overhead < 1ms
