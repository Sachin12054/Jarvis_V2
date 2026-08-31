import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.executor import AgentExecutor
from app.agent.os.app_discovery import AppDiscoveryService, ChromeProfile
from app.agent.os.project_context import ProjectContextService
from app.agent.state import AgentState, AgentStatus, StepStatus, TaskStep
from app.brain.attention_engine import AttentionEngine, AttentionMode
from app.brain.interruption_engine import InterruptionEngine, InterruptionType
from app.memory.service import MemoryService


@pytest.fixture(autouse=True)
def reset_feature3_singletons():
    """Resets AttentionEngine, AppDiscoveryService, ProjectContextService, and MemoryService before each test for test isolation."""
    AttentionEngine.reset_instance()
    AppDiscoveryService.reset_instance()
    ProjectContextService.reset_instance()
    MemoryService.reset_instance()
    yield
    AttentionEngine.reset_instance()
    AppDiscoveryService.reset_instance()
    ProjectContextService.reset_instance()
    MemoryService.reset_instance()


def test_attention_wake_word_confidence():
    """Verifies explicit wake word ('Hey Jarvis') yields high addressing confidence (>= 0.99)."""
    engine = AttentionEngine.get_instance()
    analysis = engine.evaluate_addressing("Hey Jarvis, what is my CPU usage?", channel="voice")

    assert analysis.addressed_to_jarvis is True
    assert analysis.confidence >= 0.99
    assert "explicit_wake_word" in analysis.matched_signals


def test_attention_temporal_dialogue_proximity():
    """Verifies recent dialogue turn (< 20s) grants addressing confidence without needing wake word repeat."""
    engine = AttentionEngine.get_instance()
    engine.record_agent_interaction(is_response=True)

    analysis = engine.evaluate_addressing("And RAM usage?", channel="voice")
    assert analysis.addressed_to_jarvis is True
    assert analysis.confidence >= 0.90


def test_attention_ambient_speech_filtered():
    """Verifies third-person ambient speech ('Can you pass the salt mom') yields low confidence and is ignored."""
    engine = AttentionEngine.get_instance()
    analysis = engine.evaluate_addressing("Can you pass the salt mom?", channel="voice")

    assert analysis.addressed_to_jarvis is False
    assert analysis.confidence < 0.50


def test_interruption_stop_speaking():
    """Verifies 'Stop' phrase triggers fast-path STOP_SPEAKING and requests TTS halt."""
    res = InterruptionEngine.check_interruption("stop")

    assert res.is_interruption is True
    assert res.type == InterruptionType.STOP_SPEAKING
    assert res.stop_tts is True


def test_interruption_cancel_task():
    """Verifies 'Cancel that' phrase triggers CANCEL_TASK and cancels active plan."""
    res = InterruptionEngine.check_interruption("cancel that")

    assert res.is_interruption is True
    assert res.type == InterruptionType.CANCEL_TASK
    assert res.stop_tts is True
    assert res.cancel_active_task is True


def test_interruption_replace_goal():
    """Verifies 'No, open VS Code instead' triggers REPLACE_GOAL with extracted new user message."""
    res = InterruptionEngine.check_interruption("No, open VS Code instead")

    assert res.is_interruption is True
    assert res.type == InterruptionType.REPLACE_GOAL
    assert res.stop_tts is True
    assert res.cancel_active_task is True
    assert "open VS Code" in res.new_user_message


@pytest.mark.asyncio
async def test_stale_action_guard_and_plan_versioning(db_session: AsyncSession):
    """Verifies AgentExecutor rejects stale steps belonging to an outdated plan_version."""
    executor = AgentExecutor()
    state = AgentState(plan_version=2)

    stale_step = TaskStep(
        step_id=1,
        plan_version=1, # Stale version
        description="Obsolete launch YouTube step",
        tool_name="system_metrics",
    )

    res_state = await executor.execute_steps(db_session, state, [stale_step])
    assert stale_step.status == StepStatus.SUPERSEDED
    assert len(res_state.completed_steps) == 0


@pytest.mark.asyncio
async def test_chrome_profile_ambiguity_and_clarification(monkeypatch):
    """Verifies 'Open Chrome' returns profile ambiguity clarification question when multiple actual profiles exist."""
    service = AppDiscoveryService.get_instance()
    mock_profiles = [
        ChromeProfile(name="Personal", dir_name="Default"),
        ChromeProfile(name="College", dir_name="Profile 1"),
        ChromeProfile(name="Work", dir_name="Profile 2"),
    ]
    monkeypatch.setattr(service, "discover_chrome_profiles", lambda: mock_profiles)

    res = await service.resolve_application_request("Chrome", user_message="Open Chrome")

    assert res.is_ambiguous is True
    assert len(res.profiles) >= 3
    profile_names = [p.name for p in res.profiles]
    assert "Personal" in profile_names
    assert "College" in profile_names
    assert "Work" in profile_names
    assert "Which one should I use?" in res.clarification_question


@pytest.mark.asyncio
async def test_chrome_profile_learned_memory_preference(monkeypatch):
    """Verifies explicit learned memory preference ('User prefers College Chrome profile') resolves profile ambiguity automatically."""
    service = AppDiscoveryService.get_instance()
    mem_service = MemoryService.get_instance()
    mock_profiles = [
        ChromeProfile(name="Personal", dir_name="Default"),
        ChromeProfile(name="College", dir_name="Profile 1"),
        ChromeProfile(name="Work", dir_name="Profile 2"),
    ]
    monkeypatch.setattr(service, "discover_chrome_profiles", lambda: mock_profiles)

    await mem_service.store_memory(user_id="local_user", fact="User prefers College Chrome profile for development", category="preference")

    res = await service.resolve_application_request("Chrome", user_message="Open Chrome", user_id="local_user")
    assert res.is_ambiguous is False
    assert res.selected_profile == "College"


@pytest.mark.asyncio
async def test_project_workspace_inspection_and_health_check():
    """Verifies ProjectContextService inspects local workspace structure and checks backend port health."""
    service = ProjectContextService.get_instance()
    res = await service.inspect_workspace()

    assert res.workspace_root is not None
    assert "backend" in res.backend_path
    assert "frontend" in res.frontend_path
    assert res.backend_port == 8000
