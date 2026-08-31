from typing import Dict, List, Optional
from app.core.logging import logger
from app.tools.base import BaseTool
from app.tools.builtin.system_tools import SystemMetricsTool, SystemStatusTool, OllamaStatusTool
from app.tools.builtin.filesystem_tools import ListDirectoryTool, ReadFileTool, SearchFilesTool, FileInfoTool
from app.tools.builtin.file_edit_tools import CreateFileTool, WriteFileTool, EditFileTool
from app.tools.builtin.location_tools import (
    GetCurrentLocationTool,
    ReverseGeocodeTool,
    GeocodeDestinationTool,
    CalculateRouteTool,
    SearchPlacesTool,
)
from app.tools.builtin.agent_tools import (
    LaunchAppTool,
    ManageProcessTool,
    TerminalExecuteTool,
    ManageGoalTool,
    PhoneStatusTool,
    InspectScreenTool,
    DesktopActionTool,
)
from app.tools.schemas import ToolMetadata


class ToolRegistry:
    """Central singleton registry for discovering, inspecting, and managing available JARVIS tools."""

    _instance: Optional["ToolRegistry"] = None

    def __new__(cls, register_builtins: bool = True):
        if cls._instance is None:
            cls._instance = super(ToolRegistry, cls).__new__(cls)
            cls._instance._tools = {}
            cls._instance._initialized = False
            logger.info(f"[TOOLS] registry_initialized id={id(cls._instance)}")
        else:
            logger.info(f"[TOOLS] registry_reused id={id(cls._instance)}")
        return cls._instance

    def __init__(self, register_builtins: bool = True):
        if getattr(self, "_initialized", False):
            return
        if register_builtins:
            self._register_default_tools()
        self._initialized = True

    @classmethod
    def get_instance(cls) -> "ToolRegistry":
        """Returns global application-wide singleton instance of ToolRegistry."""
        return cls()

    @classmethod
    def reset_instance(cls) -> None:
        """Resets the singleton instance (used in tests)."""
        cls._instance = None

    def _register_default_tools(self) -> None:
        """Registers default built-in safe tools once per application lifecycle."""
        # System tools
        self.register(SystemMetricsTool())
        self.register(SystemStatusTool())
        self.register(OllamaStatusTool())

        # Workspace Read-Only Filesystem tools
        self.register(ListDirectoryTool())
        self.register(ReadFileTool())
        self.register(SearchFilesTool())
        self.register(FileInfoTool())

        # Workspace File Modification tools (Permission: CONFIRM)
        self.register(CreateFileTool())
        self.register(WriteFileTool())
        self.register(EditFileTool())

        # Maps & Location tools
        self.register(GetCurrentLocationTool())
        self.register(ReverseGeocodeTool())
        self.register(GeocodeDestinationTool())
        self.register(CalculateRouteTool())
        self.register(SearchPlacesTool())

        # JARVIS V5/V6 OS Control, Vision & Phone Tools
        self.register(LaunchAppTool())
        self.register(ManageProcessTool())
        self.register(TerminalExecuteTool())
        self.register(ManageGoalTool())
        self.register(PhoneStatusTool())
        self.register(InspectScreenTool())
        self.register(DesktopActionTool())

    def register(self, tool: BaseTool) -> None:
        """Registers a new tool into the registry. Prevents duplicate tool names."""
        name = tool.name.strip().lower()
        if name in self._tools:
            raise ValueError(f"Tool with name '{name}' is already registered.")
        self._tools[name] = tool
        logger.info(f"[ToolRegistry] Registered tool: '{name}' (Category: {tool.category}, Permission: {tool.permission})")

    def unregister(self, name: str) -> bool:
        """Unregisters a tool by name."""
        clean_name = name.strip().lower()
        if clean_name in self._tools:
            del self._tools[clean_name]
            logger.info(f"[ToolRegistry] Unregistered tool: '{clean_name}'")
            return True
        return False

    def get_tool(self, name: str) -> Optional[BaseTool]:
        """Retrieves a registered tool by name."""
        return self._tools.get(name.strip().lower())

    def has_tool(self, name: str) -> bool:
        """Checks if a tool exists in the registry."""
        return name.strip().lower() in self._tools

    def list_tools(self) -> List[BaseTool]:
        """Returns a list of all registered tool instances."""
        return list(self._tools.values())

    def get_tool_schemas(self) -> List[ToolMetadata]:
        """Returns metadata and parameter specifications for all registered tools."""
        return [tool.get_metadata() for tool in self._tools.values()]
