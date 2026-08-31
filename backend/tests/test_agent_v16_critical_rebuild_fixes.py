import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.cognition.command_router import CommandRouter
from app.execution.computer_gateway import ComputerUseGateway, ActionResult
from app.agent.os.mouse_controller import RealMouseController


@pytest.fixture(autouse=True)
def reset_gateway():
    ComputerUseGateway.reset_instance()
    RealMouseController.reset_instance()
    yield
    ComputerUseGateway.reset_instance()
    RealMouseController.reset_instance()


@pytest.mark.asyncio
async def test_close_the_tab_command_routing():
    """Verifies 'Close the tab' is routed to direct browser_close_tab() with priority=1 and NEVER converted to YouTube search."""
    routed = await CommandRouter.route("Close the tab", channel="chat")

    assert routed.is_routed is True
    assert routed.priority == 1
    assert routed.command_type == "close_tab"
    assert routed.response_message == "Closed tab."
    assert routed.action_result is not None
    assert routed.action_result.verified is True


@pytest.mark.asyncio
async def test_close_this_tab_agent_turn(db_session: AsyncSession):
    """Verifies JARVISAgent.process_turn handles 'close this tab' cleanly without general chat or search logic."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "close this tab", channel="chat")

    assert res["message"] == "Closed tab."
    assert res["model"] == "jarvis-command-router"


def test_physical_cursor_position_and_evidence():
    """Verifies RealMouseController queries Win32 GetCursorPos and returns real cursor evidence."""
    controller = RealMouseController.get_instance()

    pos = controller.get_cursor_position()
    assert "x" in pos
    assert "y" in pos

    move_res = controller.move_to(500, 300)
    assert move_res["verified"] is True


def test_computer_gateway_action_result():
    """Verifies ComputerUseGateway returns ActionResult with evidence."""
    gateway = ComputerUseGateway.get_instance()

    res = gateway.browser_close_tab()
    assert isinstance(res, ActionResult)
    assert res.verified is True
    assert res.evidence["intent"] == "close_tab"
    assert res.evidence["action"] == "Ctrl+W"
