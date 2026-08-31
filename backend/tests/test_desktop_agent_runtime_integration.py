import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.process_manager import ProcessManager
from app.agent.planner import AgentPlanner
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain
from app.services.system_service import SystemService
from app.tools.registry import ToolRegistry


def test_real_application_tool_registry_contains_desktop_tools():
    """Verifies that the REAL application ToolRegistry registers desktop/agent tools."""
    registry = ToolRegistry()
    tool_names = [t.name for t in registry.list_tools()]

    assert "launch_app" in tool_names
    assert "manage_process" in tool_names
    assert "inspect_screen" in tool_names
    assert "desktop_action" in tool_names
    assert "terminal_execute" in tool_names
    assert "manage_goal" in tool_names
    assert "phone_status" in tool_names


@pytest.mark.asyncio
async def test_get_tools_api_endpoint(async_client: AsyncClient):
    """Verifies GET /api/v1/tools exposes registered desktop tools."""
    response = await async_client.get("/api/v1/tools")
    assert response.status_code == 200
    data = response.json()
    names = [t["name"] for t in data]

    assert "launch_app" in names
    assert "manage_process" in names
    assert "inspect_screen" in names
    assert "desktop_action" in names
    assert "terminal_execute" in names


def test_open_chrome_intent_detection():
    """Verifies 'Open Chrome' intent detection."""
    plan = IntentEngine.analyze("Open Chrome")
    domains = [i.domain for i in plan.intents]
    assert IntentDomain.DESKTOP_ACTION in domains

    planner = AgentPlanner()
    steps = planner.build_plan("Open Chrome", plan)
    assert len(steps) == 1
    assert steps[0].tool_name == "launch_app"
    assert steps[0].arguments["app_name"] == "chrome"


def test_open_powershell_intent_detection():
    """Verifies 'Open PowerShell' intent detection."""
    plan = IntentEngine.analyze("Open PowerShell")
    domains = [i.domain for i in plan.intents]
    assert IntentDomain.DESKTOP_ACTION in domains

    planner = AgentPlanner()
    steps = planner.build_plan("Open PowerShell", plan)
    assert len(steps) == 1
    assert steps[0].tool_name == "launch_app"
    assert steps[0].arguments["app_name"] == "powershell"


def test_show_running_processes_intent_detection():
    """Verifies 'Show me what's running' intent detection."""
    plan = IntentEngine.analyze("Show me what's running")
    domains = [i.domain for i in plan.intents]
    assert IntentDomain.PROCESS_MANAGEMENT in domains

    planner = AgentPlanner()
    steps = planner.build_plan("Show me what's running", plan)
    assert len(steps) == 1
    assert steps[0].tool_name == "manage_process"


def test_screen_query_intent_detection():
    """Verifies 'What's on my screen?' intent detection."""
    plan = IntentEngine.analyze("What's on my screen?")
    domains = [i.domain for i in plan.intents]
    assert IntentDomain.SCREEN_INSPECTION in domains

    planner = AgentPlanner()
    steps = planner.build_plan("What's on my screen?", plan)
    assert len(steps) == 1
    assert steps[0].tool_name == "inspect_screen"


def test_metrics_consistency():
    """Verifies system metrics and process metrics RAM agreement."""
    sys_service = SystemService()
    sys_m = sys_service.get_metrics()

    proc_mgr = ProcessManager()
    proc_data = proc_mgr.list_processes(limit=5)

    assert "system_ram_percent" in proc_data
    assert abs(sys_m["ram_percent"] - proc_data["system_ram_percent"]) < 5.0
    assert isinstance(proc_data["processes"], list)


def test_app_launcher_finds_powershell():
    """Verifies AppLauncher application discovery for PowerShell."""
    launcher = AppLauncher()
    path = launcher.find_app_path("powershell")
    assert path is not None
    assert "powershell" in path.lower()


def test_failed_launch_does_not_claim_success():
    """Verifies failed launch returns verified: False and honest error message."""
    launcher = AppLauncher()
    res = launcher.launch_app("non_existent_fake_app_xyz_99")
    assert res["success"] is False
    assert res["verified"] is False
    assert "didn't start" in res["error"]


@pytest.mark.asyncio
async def test_agent_open_powershell_turn(db_session: AsyncSession):
    """Verifies live agent turn for 'Open PowerShell'."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "Open PowerShell", channel="chat")
    assert "message" in res
    assert "PowerShell" in res["message"] or "open" in res["message"].lower()


@pytest.mark.asyncio
async def test_agent_show_running_processes_turn(db_session: AsyncSession):
    """Verifies live agent turn for 'Show me what's running'."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "Show me what's running", channel="chat")
    assert "message" in res
    assert "System RAM" in res["message"] or "processes" in res["message"].lower()
