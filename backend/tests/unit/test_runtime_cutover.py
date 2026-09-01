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
)
from app.core.execution import DirectActionExecutor
from app.core.knowledge import KnowledgeHandler, LLMProviderPort
from app.core.tools import ToolHandler, ToolPort
from app.core.brain import TaskPlanner, CapabilityResolver, CapabilityHandler, TaskExecutionCoordinator
from app.core.orchestrator import JarvisCoreOrchestrator
from app.services.chat_service import ChatService
from app.agent.agent import JARVISAgent
from app.schemas.chat import ChatRequest, ChatResponse
from app.conversation.manager import ConversationManager


def make_mock_conv_mgr(conv_id: str):
    mock_conv = MagicMock()
    mock_conv.id = conv_id
    mock_mgr = MagicMock(spec=ConversationManager)
    mock_mgr.get_or_create_conversation = AsyncMock(return_value=mock_conv)
    mock_mgr.add_message = AsyncMock()
    return mock_mgr


@pytest.mark.asyncio
async def test_chat_service_routes_direct_action_through_core_once():
    mock_core = MagicMock(spec=JarvisCoreOrchestrator)
    exec_res = ExecutionResult(action_type="launch_app", target="Notepad", status=ExecutionStatus.VERIFIED, success=True)
    ver_res = VerificationResult(verified=True, status="SUCCESS")
    j_resp = JarvisResponse(request_id="r1", turn_id="t1", message="Notepad is now open.", response_type=ResponseType.ACTION, execution_result=exec_res, verification_result=ver_res, metadata={"model": "qwen3:latest", "conversation_id": "conv-da"})
    mock_core.process_request = AsyncMock(return_value=j_resp)

    mock_agent = MagicMock(spec=JARVISAgent)
    mock_agent.process_turn = AsyncMock()
    mock_conv_mgr = make_mock_conv_mgr("conv-da")

    service = ChatService(core_orchestrator=mock_core, agent=mock_agent, conversation_manager=mock_conv_mgr)
    mock_db = AsyncMock()

    result = await service.handle_chat_request(db=mock_db, user_message="Open Notepad", conversation_id="conv-da")

    mock_core.process_request.assert_called_once()
    mock_agent.process_turn.assert_not_called()
    assert result["conversation_id"] == "conv-da"
    assert result["message"] == "Notepad is now open."


@pytest.mark.asyncio
async def test_chat_service_routes_knowledge_query_through_core_once():
    mock_core = MagicMock(spec=JarvisCoreOrchestrator)
    j_resp = JarvisResponse(request_id="r1", turn_id="t1", message="AI stands for Artificial Intelligence.", response_type=ResponseType.TEXT, metadata={"model": "qwen3:latest", "conversation_id": "conv-kq"})
    mock_core.process_request = AsyncMock(return_value=j_resp)

    mock_agent = MagicMock(spec=JARVISAgent)
    mock_agent.process_turn = AsyncMock()
    mock_conv_mgr = make_mock_conv_mgr("conv-kq")

    service = ChatService(core_orchestrator=mock_core, agent=mock_agent, conversation_manager=mock_conv_mgr)
    mock_db = AsyncMock()

    result = await service.handle_chat_request(db=mock_db, user_message="What is AI?", conversation_id="conv-kq")

    mock_core.process_request.assert_called_once()
    mock_agent.process_turn.assert_not_called()
    assert result["message"] == "AI stands for Artificial Intelligence."


@pytest.mark.asyncio
async def test_chat_service_routes_complex_task_through_core_once():
    mock_core = MagicMock(spec=JarvisCoreOrchestrator)
    j_resp = JarvisResponse(request_id="r1", turn_id="t1", message="Task completed successfully.", response_type=ResponseType.ACTION, metadata={"model": "qwen3:latest", "conversation_id": "conv-complex"})
    mock_core.process_request = AsyncMock(return_value=j_resp)

    mock_agent = MagicMock(spec=JARVISAgent)
    mock_agent.process_turn = AsyncMock()
    mock_conv_mgr = make_mock_conv_mgr("conv-complex")

    service = ChatService(core_orchestrator=mock_core, agent=mock_agent, conversation_manager=mock_conv_mgr)
    mock_db = AsyncMock()

    result = await service.handle_chat_request(db=mock_db, user_message="Refactor code", conversation_id="conv-complex")

    mock_core.process_request.assert_called_once()
    mock_agent.process_turn.assert_not_called()
    assert result["message"] == "Task completed successfully."


@pytest.mark.asyncio
async def test_chat_service_routes_clarification_through_core():
    mock_core = MagicMock(spec=JarvisCoreOrchestrator)
    j_resp = JarvisResponse(request_id="r1", turn_id="t1", message="Which Arun do you mean?", response_type=ResponseType.CLARIFICATION, metadata={"model": "qwen3:latest", "conversation_id": "conv-clar"})
    mock_core.process_request = AsyncMock(return_value=j_resp)

    mock_agent = MagicMock(spec=JARVISAgent)
    mock_agent.process_turn = AsyncMock()
    mock_conv_mgr = make_mock_conv_mgr("conv-clar")

    service = ChatService(core_orchestrator=mock_core, agent=mock_agent, conversation_manager=mock_conv_mgr)
    mock_db = AsyncMock()

    result = await service.handle_chat_request(db=mock_db, user_message="Open Arun", conversation_id="conv-clar")

    mock_core.process_request.assert_called_once()
    mock_agent.process_turn.assert_not_called()
    assert "Which Arun" in result["message"]


@pytest.mark.asyncio
async def test_chat_service_streaming_uses_core_once():
    mock_core = MagicMock(spec=JarvisCoreOrchestrator)
    j_resp = JarvisResponse(request_id="r1", turn_id="t1", message="Streaming output response", response_type=ResponseType.TEXT, metadata={"model": "qwen3:latest", "conversation_id": "conv-stream"})
    mock_core.process_request = AsyncMock(return_value=j_resp)

    mock_agent = MagicMock(spec=JARVISAgent)
    mock_agent.process_turn = AsyncMock()
    mock_conv_mgr = make_mock_conv_mgr("conv-stream")

    service = ChatService(core_orchestrator=mock_core, agent=mock_agent, conversation_manager=mock_conv_mgr)
    mock_db = AsyncMock()

    chunks = []
    async for data in service.handle_chat_request_stream(db=mock_db, user_message="Stream test", conversation_id="conv-stream"):
        chunks.append(data)

    mock_core.process_request.assert_called_once()
    mock_agent.process_turn.assert_not_called()
    assert len(chunks) == 1
    assert chunks[0]["chunk"] == "Streaming output response"


def test_legacy_agent_not_imported_by_core_modules():
    import app.core.orchestrator as orch_m
    import app.core.understanding.understanding_pipeline as u_m
    import app.core.decision.decision_gate as d_m

    source = inspect.getsource(orch_m) + inspect.getsource(u_m) + inspect.getsource(d_m)
    assert "import JARVISAgent" not in source
    assert "from app.agent" not in source
