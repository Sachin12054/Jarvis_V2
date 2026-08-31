import os
import sys
import json
import time
import asyncio
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.execution.cua_driver_client import CuaDriverClient
from app.core.config import settings
from app.core.logging import logger


class ActionResult(BaseModel):
    """Normalized structured result from ComputerUseGateway execution."""
    requested_action: str
    attempted: bool = True
    executed: bool
    verified: bool
    evidence: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    timestamp: float = Field(default_factory=time.time)


class ComputerUseGateway:
    """Single Authoritative OS Action Gateway for JARVIS.

    Enforces that ALL physical desktop computer-use actions (window resolution, app launch,
    keyboard input, mouse clicks, state verification) pass EXCLUSIVELY through CUA Driver (`cua-driver.exe`).
    No competing direct PyAutoGUI/ctypes OS control implementations.
    """

    _instance: Optional["ComputerUseGateway"] = None

    def __init__(self):
        self.cua_client = CuaDriverClient.get_instance()

    @classmethod
    def get_instance(cls) -> "ComputerUseGateway":
        if cls._instance is None:
            cls._instance = ComputerUseGateway()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    async def list_windows(self) -> ActionResult:
        """Lists active top-level desktop windows via CUA Driver."""
        res = await self.cua_client.list_windows()
        if res.get("success"):
            return ActionResult(
                requested_action="list_windows",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )
        return ActionResult(
            requested_action="list_windows",
            executed=False,
            verified=False,
            error=res.get("error"),
        )

    async def resolve_window(
        self,
        pid: Optional[int] = None,
        window_id: Optional[int] = None,
        app_name: Optional[str] = None,
        title_contains: Optional[str] = None,
        timeout: float = 6.0,
    ) -> ActionResult:
        """Resolves live window target via CUA Driver."""
        res = await self.cua_client.resolve_window(pid=pid, window_id=window_id, app_name=app_name, title_contains=title_contains, timeout=timeout)
        if res.get("success"):
            return ActionResult(
                requested_action="resolve_window",
                executed=True,
                verified=True,
                evidence=res,
            )
        return ActionResult(
            requested_action="resolve_window",
            executed=False,
            verified=False,
            error=res.get("error"),
        )

    async def launch_app(self, app_name: str) -> ActionResult:
        """Launches target application via CUA Driver and resolves live window target."""
        res = await self.cua_client.launch_app(app_name)
        if res.get("success"):
            logger.info(f"[COMPUTER] CUA launch_app succeeded for '{app_name}'")
            return ActionResult(
                requested_action=f"launch_app:{app_name}",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )
        logger.error(f"[COMPUTER ERROR] CUA launch_app error for '{app_name}': {res.get('error')}")
        return ActionResult(
            requested_action=f"launch_app:{app_name}",
            executed=False,
            verified=False,
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def get_window_state(self, window_id: Optional[int] = None, max_depth: int = 5, max_elements: int = 50) -> ActionResult:
        """Retrieves bounded UI element tree via CUA Driver."""
        res = await self.cua_client.get_window_state(window_id=window_id, max_depth=max_depth, max_elements=max_elements)
        return ActionResult(
            requested_action="get_window_state",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def bring_to_front(self, window_id: int) -> ActionResult:
        """Brings target window to foreground via CUA Driver."""
        res = await self.cua_client.bring_to_front(window_id)
        return ActionResult(
            requested_action=f"bring_to_front:{window_id}",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def type_text(self, text: str) -> ActionResult:
        """Types text string into active window via CUA Driver."""
        res = await self.cua_client.type_text(text)
        return ActionResult(
            requested_action=f"type_text:{text[:20]}",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def click(self, x: int, y: int, window_id: Optional[int] = None) -> ActionResult:
        """Performs left click at screen coordinates via CUA Driver."""
        res = await self.cua_client.click(x, y, window_id=window_id)
        return ActionResult(
            requested_action=f"click:({x},{y})",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def double_click(self, x: int, y: int, window_id: Optional[int] = None) -> ActionResult:
        """Performs double click at screen coordinates via CUA Driver."""
        res = await self.cua_client.double_click(x, y, window_id=window_id)
        return ActionResult(
            requested_action=f"double_click:({x},{y})",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def right_click(self, x: int, y: int, window_id: Optional[int] = None) -> ActionResult:
        """Performs right click at screen coordinates via CUA Driver."""
        res = await self.cua_client.right_click(x, y, window_id=window_id)
        return ActionResult(
            requested_action=f"right_click:({x},{y})",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def press_key(self, key: str) -> ActionResult:
        """Presses single key via CUA Driver."""
        res = await self.cua_client.press_key(key)
        return ActionResult(
            requested_action=f"press_key:{key}",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def hotkey(self, keys: List[str]) -> ActionResult:
        """Executes key combination shortcut via CUA Driver."""
        res = await self.cua_client.hotkey(keys)
        return ActionResult(
            requested_action=f"hotkey:{'+'.join(keys)}",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def set_value(self, element_id: str, value: str) -> ActionResult:
        """Sets element text value via CUA Driver."""
        res = await self.cua_client.set_value(element_id, value)
        return ActionResult(
            requested_action=f"set_value:{element_id}",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def verify_state(self, condition: str) -> ActionResult:
        """Verifies state condition via CUA Driver."""
        res = await self.cua_client.verify_state(condition)
        return ActionResult(
            requested_action=f"verify_state:{condition}",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )
