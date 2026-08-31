import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.live_desktop_monitor import (
    LiveDesktopMonitorService,
    MonitorStatus,
    MonitorMode,
)
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain


@pytest.mark.asyncio
async def test_monitor_default_off():
    """Verifies LiveDesktopMonitorService is OFF by default."""
    service = LiveDesktopMonitorService()
    assert service.state.enabled is False
    assert service.state.status == MonitorStatus.OFF


@pytest.mark.asyncio
async def test_start_monitoring():
    """Verifies start_monitoring sets enabled=True and status=ACTIVE."""
    service = LiveDesktopMonitorService()
    state = await service.start_monitoring(mode=MonitorMode.CONTEXT)

    assert state.enabled is True
    assert state.status == MonitorStatus.ACTIVE
    assert service._watcher_task is not None

    # Cleanup
    await service.stop_monitoring()


@pytest.mark.asyncio
async def test_stop_monitoring():
    """Verifies stop_monitoring sets enabled=False, status=OFF, and cancels watcher task."""
    service = LiveDesktopMonitorService()
    await service.start_monitoring()
    state = await service.stop_monitoring()

    assert state.enabled is False
    assert state.status == MonitorStatus.OFF
    assert service._watcher_task is None


@pytest.mark.asyncio
async def test_pause_and_resume_monitoring():
    """Verifies pause and resume lifecycle transitions."""
    service = LiveDesktopMonitorService()
    await service.start_monitoring()

    pause_state = await service.pause_monitoring()
    assert pause_state.status == MonitorStatus.PAUSED

    resume_state = await service.resume_monitoring()
    assert resume_state.status == MonitorStatus.ACTIVE

    await service.stop_monitoring()


@pytest.mark.asyncio
async def test_duplicate_start_prevented():
    """Verifies duplicate start calls do not crash or spawn orphan tasks."""
    service = LiveDesktopMonitorService()
    await service.start_monitoring()

    state2 = await service.start_monitoring()
    assert state2.status == MonitorStatus.ACTIVE

    await service.stop_monitoring()


@pytest.mark.asyncio
async def test_active_window_tracking():
    """Verifies current desktop state updates active window and application."""
    service = LiveDesktopMonitorService()
    await service.start_monitoring()

    desktop_state = service.current_desktop_state
    assert "active_application" in desktop_state.model_dump()
    assert "window_title" in desktop_state.model_dump()

    await service.stop_monitoring()


def test_cursor_target_detection():
    """Verifies Win32 cursor position and target element inspection."""
    service = LiveDesktopMonitorService()
    cursor_info = service.get_element_at_cursor()

    assert "cursor_position" in cursor_info
    assert "x" in cursor_info["cursor_position"]
    assert "y" in cursor_info["cursor_position"]
    assert "element_name" in cursor_info


def test_watch_window_mode():
    """Verifies watch window target registration."""
    planner_intent = IntentEngine.analyze("Watch this window")
    domains = [i.domain for i in planner_intent.intents]

    assert IntentDomain.WATCH_WINDOW in domains


def test_watch_condition_mode():
    """Verifies watch condition phrase parsing."""
    planner_intent = IntentEngine.analyze("Tell me when the backend starts")
    domains = [i.domain for i in planner_intent.intents]

    assert IntentDomain.WATCH_CONDITION in domains
    assert planner_intent.intents[0].entities["condition"] == "the backend starts"


def test_monitor_intent_detection():
    """Verifies intent engine mapping for live desktop monitoring phrases."""
    plan1 = IntentEngine.analyze("Monitor my screen")
    assert IntentDomain.START_LIVE_DESKTOP_MONITORING in [i.domain for i in plan1.intents]

    plan2 = IntentEngine.analyze("Stop monitoring my screen")
    assert IntentDomain.STOP_LIVE_DESKTOP_MONITORING in [i.domain for i in plan2.intents]

    plan3 = IntentEngine.analyze("What am I pointing at?")
    assert IntentDomain.QUERY_CURSOR_TARGET in [i.domain for i in plan3.intents]

    plan4 = IntentDomain.FILESYSTEM_SEARCH not in [i.domain for i in plan1.intents]


@pytest.mark.asyncio
async def test_agent_turn_start_and_stop_monitoring(db_session: AsyncSession):
    """Verifies JARVISAgent turn handling for monitor start and stop phrases."""
    agent = JARVISAgent()

    # Start
    res1 = await agent.process_turn(db_session, "Monitor my screen", channel="chat")
    assert "keep an eye on your screen" in res1["message"].lower()

    # Stop
    res2 = await agent.process_turn(db_session, "Stop monitoring my screen", channel="chat")
    assert "no longer monitoring" in res2["message"].lower()
