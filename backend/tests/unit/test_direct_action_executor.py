import pytest
from unittest.mock import AsyncMock, MagicMock
from app.core.contracts import (
    DecisionResult,
    DecisionStrategy,
    ExecutionStatus,
)
from app.core.execution import DirectActionExecutor
from app.execution.computer_gateway import ComputerUseGateway, ActionResult


@pytest.mark.asyncio
async def test_open_application_dispatch():
    mock_gateway = MagicMock(spec=ComputerUseGateway)
    mock_gateway.focus_window = AsyncMock(return_value=ActionResult(
        requested_action="launch_app:Notepad",
        executed=True,
        verified=True,
        evidence={"pid": 1234},
    ))
    executor = DirectActionExecutor(gateway=mock_gateway)
    dec = DecisionResult(strategy=DecisionStrategy.DIRECT_ACTION, selected_tool="launch_app", reason="Direct action open_application")
    exec_res, ver_res = await executor.execute(dec, context={"application": "Notepad"})
    mock_gateway.focus_window.assert_called_once_with("Notepad")
    assert exec_res.status == ExecutionStatus.VERIFIED
    assert exec_res.success is True
    assert ver_res.verified is True


@pytest.mark.asyncio
async def test_close_application_dispatch():
    mock_gateway = MagicMock(spec=ComputerUseGateway)
    mock_gateway.hotkey = AsyncMock(return_value=ActionResult(
        requested_action="hotkey:alt+f4",
        executed=True,
        verified=True,
    ))
    executor = DirectActionExecutor(gateway=mock_gateway)
    dec = DecisionResult(strategy=DecisionStrategy.DIRECT_ACTION, selected_tool="close_app", reason="close application")
    exec_res, ver_res = await executor.execute(dec, context={"application": "Notepad"})
    mock_gateway.hotkey.assert_called_once_with(["alt", "f4"])
    assert exec_res.success is True


@pytest.mark.asyncio
async def test_stop_action_handling():
    mock_gateway = MagicMock(spec=ComputerUseGateway)
    executor = DirectActionExecutor(gateway=mock_gateway)
    dec = DecisionResult(strategy=DecisionStrategy.DIRECT_ACTION, selected_tool="stop", reason="stop")
    exec_res, ver_res = await executor.execute(dec)
    assert exec_res.success is True
    assert ver_res.verified is True


@pytest.mark.asyncio
async def test_pause_resume_dispatch():
    mock_gateway = MagicMock(spec=ComputerUseGateway)
    mock_gateway.pause_video = AsyncMock(return_value=ActionResult(requested_action="press_key:space", executed=True, verified=True))
    mock_gateway.resume_video = AsyncMock(return_value=ActionResult(requested_action="press_key:space", executed=True, verified=True))
    executor = DirectActionExecutor(gateway=mock_gateway)
    dec_pause = DecisionResult(strategy=DecisionStrategy.DIRECT_ACTION, selected_tool="pause", reason="pause")
    exec_p, ver_p = await executor.execute(dec_pause)
    mock_gateway.pause_video.assert_called_once()
    assert exec_p.success is True

    dec_resume = DecisionResult(strategy=DecisionStrategy.DIRECT_ACTION, selected_tool="resume", reason="resume")
    exec_r, ver_r = await executor.execute(dec_resume)
    mock_gateway.resume_video.assert_called_once()
    assert exec_r.success is True


@pytest.mark.asyncio
async def test_rejection_of_non_direct_strategies():
    mock_gateway = MagicMock(spec=ComputerUseGateway)
    executor = DirectActionExecutor(gateway=mock_gateway)
    strategies = [
        DecisionStrategy.KNOWLEDGE_QUERY,
        DecisionStrategy.TOOL_CALL,
        DecisionStrategy.COMPLEX_TASK,
        DecisionStrategy.CLARIFICATION,
        DecisionStrategy.NO_OP,
    ]
    for strat in strategies:
        dec = DecisionResult(strategy=strat)
        exec_res, ver_res = await executor.execute(dec)
        assert exec_res.success is False
        assert exec_res.status == ExecutionStatus.FAILED
        assert exec_res.error_code == "STRATEGY_REJECTED"
        assert ver_res.verified is False
    mock_gateway.focus_window.assert_not_called()
    mock_gateway.hotkey.assert_not_called()


@pytest.mark.asyncio
async def test_cancel_strategy_rejection():
    mock_gateway = MagicMock(spec=ComputerUseGateway)
    executor = DirectActionExecutor(gateway=mock_gateway)
    dec = DecisionResult(strategy=DecisionStrategy.CANCEL)
    exec_res, ver_res = await executor.execute(dec)
    assert exec_res.status == ExecutionStatus.CANCELLED
    assert exec_res.success is False
    mock_gateway.focus_window.assert_not_called()


@pytest.mark.asyncio
async def test_cua_error_code_preservation():
    mock_gateway = MagicMock(spec=ComputerUseGateway)
    mock_gateway.focus_window = AsyncMock(return_value=ActionResult(
        requested_action="launch_app:Notepad",
        executed=False,
        verified=False,
        error="CUA daemon unavailable pipe error",
    ))
    executor = DirectActionExecutor(gateway=mock_gateway)
    dec = DecisionResult(strategy=DecisionStrategy.DIRECT_ACTION, selected_tool="launch_app", reason="open_application")
    exec_res, ver_res = await executor.execute(dec, context={"application": "Notepad"})
    assert exec_res.status == ExecutionStatus.FAILED
    assert exec_res.error_code == "DAEMON_UNAVAILABLE"
    assert exec_res.success is False
    assert ver_res.verified is False
