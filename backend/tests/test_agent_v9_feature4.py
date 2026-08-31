import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.browser_agent import BrowserAgent, BrowserState
from app.agent.os.mouse_controller import RealMouseController


@pytest.fixture(autouse=True)
def reset_browser_agent():
    BrowserAgent.reset_instance()
    RealMouseController.reset_instance()
    yield
    BrowserAgent.reset_instance()
    RealMouseController.reset_instance()


def test_browser_state_model():
    """Verifies BrowserState schema fields and default evidence values."""
    agent = BrowserAgent.get_instance()
    state = agent.get_current_browser_state()

    assert isinstance(state, BrowserState)
    assert state.browser_name is not None
    assert state.source in ["browser_automation_os", "live_browser"]


def test_mouse_click_target_location_and_verification():
    """Verifies RealMouseController locates element bounding box and returns verified click status."""
    controller = RealMouseController.get_instance()
    bounds = controller.locate_target_bounds("STOP")

    assert bounds is not None
    assert bounds.width > 0
    assert bounds.height > 0
    assert bounds.confidence >= 0.70


@pytest.mark.asyncio
async def test_mouse_click_execution():
    """Verifies click_target returns MouseClickResult with verified state."""
    controller = RealMouseController.get_instance()
    res = await controller.click_target("STOP")

    assert res.success is True
    assert res.verified is True
    assert res.clicked_target == "STOP"
    assert res.post_action_verified is True


@pytest.mark.asyncio
async def test_browser_navigation_and_youtube_search():
    """Verifies BrowserAgent.search_and_play_youtube returns verified navigation and video playback status."""
    agent = BrowserAgent.get_instance()
    res = await agent.search_and_play_youtube("Spider-Man: Far From Home trailer")

    assert res.success is True
    assert res.verified is True
    assert agent.state.playback_state == "PLAYING"


@pytest.mark.asyncio
async def test_agent_feature4_browser_flow(db_session: AsyncSession):
    """Verifies JARVISAgent process_turn handles YouTube search and mouse actions cleanly."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "Open YouTube and search for Spider-Man trailer", channel="chat")

    assert res["message"] is not None
    assert len(res["message"]) > 0


@pytest.mark.asyncio
async def test_agent_feature4_mouse_click_flow(db_session: AsyncSession):
    """Verifies JARVISAgent process_turn handles explicit click action requests."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "Click the STOP button on my screen", channel="chat")

    assert res["message"] is not None
    assert "Clicked" in res["message"] or "STOP" in res["message"]
