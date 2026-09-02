import inspect
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.core.contracts import (
    JarvisRequest,
    JarvisResponse,
    ResponseType,
    ExecutionResult,
    ExecutionStatus,
    VerificationResult,
    InputChannel,
    TargetDevice,
)
from app.core.adapters import RequestAdapter, ResponseAdapter
from app.core.execution import DirectActionExecutor
from app.core.knowledge import KnowledgeHandler, LLMProviderPort
from app.core.tools import ToolHandler, ToolPort
from app.core.brain import TaskPlanner, CapabilityResolver, CapabilityHandler, TaskExecutionCoordinator
from app.core.interaction import ClarificationManager
from app.core.orchestrator import JarvisCoreOrchestrator
from app.schemas.chat import ChatRequest, ChatResponse


@pytest.mark.asyncio
async def test_canonical_pipeline_direct_action_round_trip():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    exec_res = ExecutionResult(action_type="launch_app", target="Notepad", status=ExecutionStatus.VERIFIED, success=True)
    ver_res = VerificationResult(verified=True, status="SUCCESS")
    mock_executor.execute = AsyncMock(return_value=(exec_res, ver_res))

    orchestrator = JarvisCoreOrchestrator(executor=mock_executor)
    chat_req = ChatRequest(message="Open Notepad", conversation_id="conv-101")
    canonical_req = RequestAdapter.from_chat_request(chat_req, turn_id="t-101")

    canonical_resp = await orchestrator.process_request(canonical_req)
    chat_resp = ResponseAdapter.to_chat_response(canonical_resp)

    assert chat_resp.conversation_id == "conv-101"
    assert "Notepad is now open" in chat_resp.message
    assert canonical_resp.response_type == ResponseType.ACTION


@pytest.mark.asyncio
async def test_canonical_pipeline_knowledge_query_round_trip():
    mock_llm_port = MagicMock(spec=LLMProviderPort)
    mock_llm_port.generate_response = AsyncMock(return_value="Python is a programming language.")
    knowledge_handler = KnowledgeHandler(llm_provider=mock_llm_port)

    orchestrator = JarvisCoreOrchestrator(knowledge_handler=knowledge_handler)
    chat_req = ChatRequest(message="What is python?", conversation_id="conv-kq")
    canonical_req = RequestAdapter.from_chat_request(chat_req)

    canonical_resp = await orchestrator.process_request(canonical_req)
    chat_resp = ResponseAdapter.to_chat_response(canonical_resp)

    assert chat_resp.conversation_id == "conv-kq"
    assert chat_resp.message == "Python is a programming language."
    assert canonical_resp.response_type == ResponseType.TEXT


@pytest.mark.asyncio
async def test_canonical_pipeline_complex_task_round_trip():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    handler = MagicMock(spec=CapabilityHandler)
    exec_res = ExecutionResult(action_type="refactor", status=ExecutionStatus.VERIFIED, success=True)
    ver_res = VerificationResult(verified=True, status="SUCCESS")
    handler.execute = AsyncMock(return_value=(exec_res, ver_res))
    resolver.register("refactor database schema", handler)

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    orchestrator = JarvisCoreOrchestrator(task_coordinator=coordinator, planner=planner)
    chat_req = ChatRequest(message="Refactor database schema", conversation_id="conv-complex")
    canonical_req = RequestAdapter.from_chat_request(chat_req)

    canonical_resp = await orchestrator.process_request(canonical_req)
    chat_resp = ResponseAdapter.to_chat_response(canonical_resp)

    assert chat_resp.conversation_id == "conv-complex"
    assert chat_resp.message is not None and len(chat_resp.message) > 0
    assert canonical_resp.response_type == ResponseType.ACTION


@pytest.mark.asyncio
async def test_canonical_pipeline_clarification_round_trip():
    orchestrator = JarvisCoreOrchestrator()
    req1 = JarvisRequest(conversation_id="c-clar", request_id="r1", turn_id="t1", raw_input="Open Arun")

    # Turn 1: Open Arun -> DecisionGate detects ambiguity -> CLARIFICATION
    resp1 = await orchestrator.process_request(req1)
    assert resp1.response_type == ResponseType.CLARIFICATION
    assert "ambiguous" in resp1.message.lower()


def test_architectural_boundary_no_infrastructure_imports():
    import app.core.adapters.request_adapter as req_a
    import app.core.adapters.response_adapter as resp_a
    import app.core.orchestrator as orch_m

    combined = (inspect.getsource(req_a) + " " + inspect.getsource(resp_a) + " " + inspect.getsource(orch_m)).lower()
    forbidden = ["import ollama", "import whisper", "import kokoro", "import subprocess", "import pyautogui", "import pywinauto", "import win32"]
    for item in forbidden:
        assert item not in combined
