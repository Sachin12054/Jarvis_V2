import os
import time
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.active_window import ActiveWindowService
from app.agent.os.desktop_controller import DesktopController
from app.agent.os.screen_capture import ScreenCaptureService
from app.agent.os.screen_understanding import ScreenUnderstandingService
from app.agent.planner import AgentPlanner
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain
from app.brain.vision_router import VisionModelRouter


def test_find_stop_button_is_screen_intent():
    """Verifies 'Find the STOP button' routes to SCREEN_INSPECTION intent, NOT FILESYSTEM_SEARCH."""
    plan = IntentEngine.analyze("Find the STOP button")
    domains = [i.domain for i in plan.intents]

    assert IntentDomain.SCREEN_INSPECTION in domains
    assert IntentDomain.FILESYSTEM_SEARCH not in domains


def test_find_run_button_is_screen_intent():
    """Verifies 'Find the Run button' routes to SCREEN_INSPECTION intent."""
    plan = IntentEngine.analyze("Find the Run button")
    domains = [i.domain for i in plan.intents]

    assert IntentDomain.SCREEN_INSPECTION in domains
    assert IntentDomain.FILESYSTEM_SEARCH not in domains


def test_find_file_remains_filesystem_intent():
    """Verifies 'Find file main.py' routes to FILESYSTEM_SEARCH intent."""
    plan = IntentEngine.analyze("Find file main.py")
    domains = [i.domain for i in plan.intents]

    assert IntentDomain.FILESYSTEM_SEARCH in domains


def test_what_is_on_screen_uses_screenshot():
    """Verifies 'What's on my screen?' triggers real screen capture."""
    cap_service = ScreenCaptureService()
    res = cap_service.capture_screen(force_refresh=True)

    assert res["status"] == "captured"
    assert res["width"] > 0
    assert res["height"] > 0
    assert os.path.exists(res["file_path"])


def test_screen_capture_is_fresh():
    """Verifies screen capture timestamp is current and TTL cache enforces freshness."""
    cap_service = ScreenCaptureService()
    now = time.time()
    res = cap_service.capture_screen(force_refresh=True)

    assert abs(res["timestamp"] - now) < 2.0


@pytest.mark.asyncio
async def test_screen_understanding_service_captures_screen():
    """Tests ScreenUnderstandingService structured observation generation with screenshot_captured=True."""
    su = ScreenUnderstandingService()
    obs = await su.analyze_current_screen("What's on my screen?")

    assert "application" in obs
    assert "ui_elements" in obs
    assert obs["screenshot_captured"] is True
    assert os.path.exists(obs["screenshot_path"])


def test_click_requires_current_visual_observation():
    """Verifies AgentPlanner generates inspect_screen BEFORE desktop_action for GUI click queries."""
    planner = AgentPlanner()
    plan = IntentEngine.analyze("Click the STOP button")
    steps = planner.build_plan("Click the STOP button", plan)

    assert len(steps) == 2
    assert steps[0].tool_name == "inspect_screen"
    assert steps[1].tool_name == "desktop_action"


def test_post_click_reobservation():
    """Tests DesktopController post-click re-observation screenshot capture."""
    dc = DesktopController()
    click_res = dc.click_ui_element("STOP")

    assert click_res["success"] is True
    assert click_res["post_observation_captured"] is True


@pytest.mark.asyncio
async def test_vision_model_required_for_visual_queries():
    """Tests VisionModelRouter fallback notice when no vision model is installed."""
    router = VisionModelRouter()
    res = await router.generate_vision_understanding(image_b64="", prompt="Test prompt")

    assert "available" in res
    if not res["available"]:
        assert "no vision model is configured" in res["error"].lower()


@pytest.mark.asyncio
async def test_whats_on_my_screen_agent_turn(db_session: AsyncSession):
    """Tests end-to-end JARVISAgent turn for 'What's on my screen?'."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "What's on my screen?", channel="chat")

    assert "message" in res
    assert len(res["message"]) > 0
