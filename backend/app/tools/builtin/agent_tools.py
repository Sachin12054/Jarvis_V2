from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.agent.goals import GoalManager
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.desktop_controller import DesktopController
from app.agent.os.process_manager import ProcessManager
from app.agent.os.screen_understanding import ScreenUnderstandingService
from app.agent.os.terminal_manager import TerminalManager
from app.devices.phone.transport import PhoneTransport
from app.tools.base import BaseTool
from app.tools.schemas import PermissionLevel, ToolCategory, ToolExecutionContext


class LaunchAppArgs(BaseModel):
    app_name: str = Field(..., min_length=1, description="Name of application to launch (e.g. Chrome, VS Code, Git Bash)")


class LaunchAppTool(BaseTool):
    """Tool that launches installed Windows applications safely and verifies startup."""

    name = "launch_app"
    description = "Launches an installed Windows application such as Chrome, VS Code, Git Bash, or PowerShell."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.CONFIRM
    args_schema = LaunchAppArgs

    def __init__(self):
        self.launcher = AppLauncher()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        app_name = kwargs["app_name"]
        return self.launcher.launch_app(app_name)


class ManageProcessArgs(BaseModel):
    action: str = Field(default="list", description="Action: list or stop")
    process_name: Optional[str] = Field(default=None, description="Name of process to stop")


class ManageProcessTool(BaseTool):
    """Tool that lists top active processes or stops approved applications using real Windows metrics."""

    name = "manage_process"
    description = "Lists top resource-consuming processes or stops an active application process."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = ManageProcessArgs

    def __init__(self):
        self.pm = ProcessManager()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        action = kwargs.get("action", "list")
        proc_name = kwargs.get("process_name")

        if action == "stop" and proc_name:
            return self.pm.stop_process(proc_name)

        return self.pm.list_processes(limit=10)


class TerminalExecuteArgs(BaseModel):
    command: str = Field(..., min_length=1, description="Command to execute in controlled terminal")
    shell: str = Field(default="powershell", description="Shell: powershell or bash")


class TerminalExecuteTool(BaseTool):
    """Tool that executes shell commands in a controlled terminal environment."""

    name = "terminal_execute"
    description = "Executes a shell command safely in PowerShell or Git Bash with stdout/stderr capture."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.CONFIRM
    args_schema = TerminalExecuteArgs

    def __init__(self):
        self.tm = TerminalManager()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        cmd = kwargs["command"]
        shell = kwargs.get("shell", "powershell")
        return self.tm.execute_command(command=cmd, shell_type=shell)


class ManageGoalArgs(BaseModel):
    action: str = Field(default="recommend", description="Action: recommend, list, or update")


class ManageGoalTool(BaseTool):
    """Tool that inspects active user goals and recommends prioritized next actions."""

    name = "manage_goal"
    description = "Inspects active user goals and recommends prioritized next tasks."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = ManageGoalArgs

    def __init__(self):
        self.gm = GoalManager()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        action = kwargs.get("action", "recommend")
        if action == "list":
            goals = self.gm.get_active_goals()
            return {"goals": [g.__dict__ for g in goals]}

        rec = self.gm.recommend_next_task()
        return {"recommendation": rec}


class PhoneStatusArgs(BaseModel):
    device_id: Optional[str] = Field(default="paired_mobile_device", description="Mobile device ID")


class PhoneStatusTool(BaseTool):
    """Tool that inspects connected mobile device status, battery level, and transport."""

    name = "phone_status"
    description = "Inspects battery level, storage, and connection status for authorized mobile devices."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = PhoneStatusArgs

    def __init__(self):
        self.transport = PhoneTransport()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        dev_id = kwargs.get("device_id", "paired_mobile_device")
        return self.transport.get_device_status(device_id=dev_id)


class InspectScreenArgs(BaseModel):
    query: Optional[str] = Field(default="", description="Specific UI query or error to inspect on screen")


class InspectScreenTool(BaseTool):
    """Tool that inspects active desktop screen and produces structured UI observations."""

    name = "inspect_screen"
    description = "Inspects active desktop screen, window title, visible text, and UI elements."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = InspectScreenArgs

    def __init__(self):
        self.su = ScreenUnderstandingService()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        query = kwargs.get("query", "")
        return await self.su.analyze_current_screen(user_message=query)


class DesktopActionArgs(BaseModel):
    action: str = Field(..., description="Action: click, focus, close, type, or press")
    target: str = Field(..., description="Target UI element, window title, or text")


class DesktopActionTool(BaseTool):
    """Tool that performs controlled desktop GUI actions such as clicking UI elements or focusing windows."""

    name = "desktop_action"
    description = "Performs controlled desktop GUI actions such as clicking buttons or switching windows."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.CONFIRM
    args_schema = DesktopActionArgs

    def __init__(self):
        self.dc = DesktopController()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        act = kwargs["action"].lower()
        tgt = kwargs["target"]

        if act == "click":
            return self.dc.click_ui_element(tgt)
        elif act == "focus":
            return self.dc.focus_window(tgt)
        elif act == "close":
            return self.dc.close_window(tgt)
        elif act == "type":
            return self.dc.type_text(tgt)
        elif act == "press":
            return self.dc.press_key(tgt)
        else:
            return {"success": False, "error": f"Unsupported desktop action '{act}'."}
