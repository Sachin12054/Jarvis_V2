import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.executor import AgentExecutor
from app.agent.goals import GoalManager
from app.agent.learning import AgentLearningEngine
from app.agent.model_router import ModelRouter, ModelRole
from app.agent.planner import AgentPlanner
from app.agent.reasoning import AgentReasoningEngine
from app.agent.reflection import AgentReflectionEngine
from app.agent.skills import SkillManager
from app.agent.state import AgentState, AgentStatus
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.process_manager import ProcessManager
from app.agent.os.terminal_manager import TerminalManager
from app.devices.phone.transport import PhoneTransport
from app.services.chat_service import ChatService


def test_agent_state_initialization():
    """Tests AgentState structure and observation logging."""
    state = AgentState(user_message="My laptop is slow", channel="chat")
    assert state.status == AgentStatus.IDLE
    assert state.max_agent_steps == 5

    state.add_observation("system_metrics", {"cpu_usage": 22.0, "ram_usage": 88.0}, success=True)
    assert len(state.tool_observations) == 1
    assert state.tool_observations[0]["tool"] == "system_metrics"


def test_model_router_task_selection():
    """Tests ModelRouter task context model selection."""
    router = ModelRouter()

    # Coding task -> Qwen Coder
    m1 = router.select_model("Refactor the FastAPI backend router")
    assert m1 == ModelRole.CODING.value

    # Reasoning / Diagnosis task -> DeepSeek R1
    m2 = router.select_model("Why is my laptop running so slow?")
    assert m2 == ModelRole.REASONING.value

    # Casual conversation -> Gemma 3
    m3 = router.select_model("Hey Jarvis, how are you?")
    assert m3 == ModelRole.CASUAL.value


def test_agent_planner_step_building():
    """Tests AgentPlanner step generation."""
    planner = AgentPlanner()
    from app.brain.intent_engine import IntentEngine
    intent_plan = IntentEngine.analyze("Where do I study and what projects am I working on?")

    steps = planner.build_plan("Where do I study and what projects am I working on?", intent_plan)
    assert len(steps) == 2
    assert steps[0].tool_name == "user_profile"
    assert steps[1].tool_name == "user_profile"


def test_laptop_slow_reasoning_diagnosis():
    """Tests AgentReasoningEngine hardware bottleneck diagnosis."""
    engine = AgentReasoningEngine()
    obs = [{"tool": "system_metrics", "success": True, "data": {"cpu_usage": 22.0, "ram_usage": 88.0}}]

    insights = engine.evaluate_observations("My laptop feels slow. Find out why.", obs)
    assert "diagnosis" in insights
    assert "RAM" in insights["diagnosis"]
    assert "main bottleneck" in insights["diagnosis"]


def test_agent_reflection_engine():
    """Tests AgentReflectionEngine skill candidate extraction."""
    reflector = AgentReflectionEngine()
    obs = [{"tool": "system_metrics", "success": True, "data": {}}]

    res = reflector.reflect_on_turn("My laptop is slow", obs, "RAM looks like the bottleneck.", success=True)
    assert res["task_success"] is True
    assert res["reusable_skill_candidate"] == "diagnose_laptop_performance"


def test_app_launcher_discovery():
    """Tests Windows OS AppLauncher application discovery."""
    launcher = AppLauncher()
    cmd = launcher.find_app_path("powershell")
    assert cmd is not None


def test_process_manager_listing():
    """Tests Windows OS ProcessManager process listing."""
    pm = ProcessManager()
    res = pm.list_processes(limit=5)
    procs = res["processes"]
    assert isinstance(procs, list)
    assert len(procs) > 0


def test_terminal_manager_execution():
    """Tests controlled TerminalManager PowerShell execution."""
    tm = TerminalManager()
    res = tm.execute_command("Write-Host 'JARVIS V5 AGENT ONLINE'")
    assert res["success"] is True
    assert "JARVIS V5 AGENT ONLINE" in res["stdout"]


def test_phone_status_transport():
    """Tests PhoneTransport device status check."""
    transport = PhoneTransport()
    status = transport.get_device_status()
    assert status["connected"] is True
    assert status["battery_percent"] > 0


@pytest.mark.asyncio
async def test_user_memory_correction_learning(db_session: AsyncSession):
    """Tests AgentLearningEngine memory correction detection and updates."""
    learning = AgentLearningEngine()
    res = await learning.check_and_apply_user_correction(db_session, "That's wrong. I study at Amrita University.")
    assert res is not None
    assert res["type"] == "correction"
    assert "Amrita University" in res["value"]


@pytest.mark.asyncio
async def test_jarvis_agent_process_turn(db_session: AsyncSession):
    """Tests end-to-end JARVISAgent turn execution."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "What projects am I working on?", channel="chat")
    assert "message" in res
    assert "InterviewSense AI" in res["message"] or "JARVIS" in res["message"]
