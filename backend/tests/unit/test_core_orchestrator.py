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
async def test_direct_action_failure_flow():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    exec_res = ExecutionResult(action_type="launch_app", target="Notepad", status=ExecutionStatus.FAILED, success=False, error_code="DAEMON_UNAVAILABLE", error_message="CUA daemon unavailable")
    ver_res = VerificationResult(verified=False, status="FAILED")
    mock_executor.execute = AsyncMock(return_value=(exec_res, ver_res))

    orchestrator = JarvisCoreOrchestrator(executor=mock_executor)
    req = JarvisRequest(request_id="r-err", turn_id="t-err", conversation_id="c-err", raw_input="Open Notepad")
    resp = await orchestrator.process_request(req)

    assert resp.response_type == ResponseType.ERROR
    assert resp.execution_result.error_code == "DAEMON_UNAVAILABLE"
    assert "Failed to execute" in resp.message


@pytest.mark.asyncio
async def test_knowledge_query_no_execution():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    orchestrator = JarvisCoreOrchestrator(executor=mock_executor)
    req = JarvisRequest(conversation_id="conv-kq", raw_input="What is machine learning?")
    resp = await orchestrator.process_request(req)

    mock_executor.execute.assert_not_called()
    assert resp.response_type == ResponseType.TEXT
    assert "KNOWLEDGE_QUERY is not yet connected" in resp.message


@pytest.mark.asyncio
async def test_clarification_no_execution():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    orchestrator = JarvisCoreOrchestrator(executor=mock_executor)
    req = JarvisRequest(conversation_id="conv-clar", raw_input="Open Arun")
    resp = await orchestrator.process_request(req)

    mock_executor.execute.assert_not_called()
    assert resp.response_type == ResponseType.CLARIFICATION
    assert "ambiguous" in resp.message.lower()


@pytest.mark.asyncio
async def test_cancel_no_execution():
    mock_executor = MagicMock(spec=DirectActionExecutor)
    exec_res = ExecutionResult(action_type="stop", status=ExecutionStatus.EXECUTED, success=True)
    ver_res = VerificationResult(verified=True, status="SUCCESS")
    mock_executor.execute = AsyncMock(return_value=(exec_res, ver_res))
    orchestrator = JarvisCoreOrchestrator(executor=mock_executor)

    req_stop = JarvisRequest(conversation_id="conv-can", raw_input="stop", input_channel=InputChannel.VOICE)
    resp_stop = await orchestrator.process_request(req_stop)
    assert resp_stop.response_type == ResponseType.ACTION


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
