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
from app.core.execution import DirectActionExecutor
from app.core.knowledge import KnowledgeHandler, LLMProviderPort
from app.core.tools import ToolHandler, ToolPort
from app.core.brain import TaskPlanner, CapabilityResolver, CapabilityHandler, TaskExecutionCoordinator
from app.core.orchestrator import JarvisCoreOrchestrator


@pytest.mark.asyncio
async def test_direct_action_success_flow():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    exec_res = ExecutionResult(action_type="launch_app", target="Notepad", status=ExecutionStatus.VERIFIED, success=True, evidence={"pid": 4321})
    ver_res = VerificationResult(verified=True, status="SUCCESS")
    mock_executor.execute = AsyncMock(return_value=(exec_res, ver_res))

    orchestrator = JarvisCoreOrchestrator(executor=mock_executor)
    req = JarvisRequest(request_id="r-100", turn_id="t-100", conversation_id="c-100", raw_input="Open Notepad")
    resp = await orchestrator.process_request(req)

    mock_executor.execute.assert_called_once()
    assert resp.request_id == "r-100"
    assert resp.turn_id == "t-100"
    assert resp.response_id is not None
    assert resp.response_type == ResponseType.ACTION
    assert resp.execution_result.success is True
    assert resp.verification_result.verified is True


@pytest.mark.asyncio
async def test_knowledge_query_connected_flow():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    mock_llm_port = MagicMock(spec=LLMProviderPort)
    mock_llm_port.generate_response = AsyncMock(return_value="Machine learning is a field of computer science.")
    knowledge_handler = KnowledgeHandler(llm_provider=mock_llm_port)

    orchestrator = JarvisCoreOrchestrator(executor=mock_executor, knowledge_handler=knowledge_handler)
    req = JarvisRequest(conversation_id="conv-kq", raw_input="What is machine learning?")
    resp = await orchestrator.process_request(req)

    mock_executor.execute.assert_not_called()
    mock_llm_port.generate_response.assert_called_once()
    assert resp.response_type == ResponseType.TEXT
    assert resp.message == "Machine learning is a field of computer science."


@pytest.mark.asyncio
async def test_tool_call_connected_flow():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    mock_tool_port = MagicMock(spec=ToolPort)
    mock_tool_port.execute_tool = AsyncMock(return_value={"output": "Found 5 pdf files."})
    tool_handler = ToolHandler(tool_port=mock_tool_port)

    orchestrator = JarvisCoreOrchestrator(executor=mock_executor, tool_handler=tool_handler)
    req = JarvisRequest(conversation_id="conv-tool", raw_input="Search for pdf files")
    resp = await orchestrator.process_request(req)

    mock_executor.execute.assert_not_called()
    mock_tool_port.execute_tool.assert_called_once()
    assert resp.response_type == ResponseType.ACTION
    assert resp.message == "Found 5 pdf files."


@pytest.mark.asyncio
async def test_complex_task_connected_flow():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    handler = MagicMock(spec=CapabilityHandler)
    exec_res = ExecutionResult(action_type="refactor", status=ExecutionStatus.VERIFIED, success=True)
    ver_res = VerificationResult(verified=True, status="SUCCESS")
    handler.execute = AsyncMock(return_value=(exec_res, ver_res))
    resolver.register("refactor database schema", handler)

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    orchestrator = JarvisCoreOrchestrator(task_coordinator=coordinator, planner=planner)
    req = JarvisRequest(conversation_id="conv-c", raw_input="Refactor database schema")
    resp = await orchestrator.process_request(req)

    assert resp.response_type == ResponseType.ACTION
    assert resp.message is not None and len(resp.message) > 0


@pytest.mark.asyncio
async def test_clarification_flow():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    orchestrator = JarvisCoreOrchestrator(executor=mock_executor)
    req = JarvisRequest(conversation_id="conv-clar", raw_input="Open Arun")
    resp = await orchestrator.process_request(req)

    mock_executor.execute.assert_not_called()
    assert resp.response_type == ResponseType.CLARIFICATION
    assert "ambiguous" in resp.message.lower()


@pytest.mark.asyncio
async def test_architectural_boundary_no_infrastructure_imports():
    from app.core import orchestrator as orch_module
    source_code = inspect.getsource(orch_module)
    forbidden_imports = [
        "ollama",
        "whisper",
        "kokoro",
        "fastapi",
        "pyautogui",
        "pywinauto",
        "win32",
        "subprocess",
    ]
    for item in forbidden_imports:
        assert f"import {item}" not in source_code.lower()
        assert f"from {item}" not in source_code.lower()
