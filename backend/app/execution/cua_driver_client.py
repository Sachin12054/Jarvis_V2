import os
import sys
import json
import time
import asyncio
from typing import Dict, Any, Optional, List
from app.core.config import settings
from app.core.logging import logger


class CuaDriverClient:
    """Client for CUA Driver (`cua-driver.exe`).

    Provides single-point, safe subprocess integration with CUA Driver CLI via JSON stdin payload streams.
    Manages daemon lifecycles (`cua-driver serve`) and returns clean structured action responses.
    """

    _instance: Optional["CuaDriverClient"] = None

    def __init__(self):
        self.cua_binary_path = getattr(
            settings,
            "CUA_DRIVER_PATH",
            r"C:\Users\sachi\AppData\Local\Programs\Cua\cua-driver\bin\cua-driver.exe",
        )
        self.socket_pipe = getattr(settings, "CUA_SOCKET_PIPE", r"\\.\pipe\cua-driver")
        self.timeout = float(getattr(settings, "CUA_DRIVER_TIMEOUT", 15.0))
        self._daemon_process: Optional[asyncio.subprocess.Process] = None
        self._daemon_checked = False

    @classmethod
    def get_instance(cls) -> "CuaDriverClient":
        if cls._instance is None:
            cls._instance = CuaDriverClient()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    def is_binary_available(self) -> bool:
        """Returns True if cua-driver.exe binary exists on disk."""
        return os.path.exists(self.cua_binary_path)

    async def ensure_daemon_running(self) -> bool:
        """Verifies if CUA Driver daemon is active on pipe, spawning it if missing."""
        if not self.is_binary_available():
            logger.error(f"[CUA CLIENT] CUA Driver binary not found at '{self.cua_binary_path}'.")
            return False

        try:
            res = await self._raw_call("list_windows", payload={}, timeout=3.0, auto_start_daemon=False)
            if res.get("success"):
                self._daemon_checked = True
                return True
        except Exception:
            pass

        logger.info(f"[CUA CLIENT] CUA Driver daemon unavailable on '{self.socket_pipe}'. Spawning `cua-driver serve` daemon...")
        try:
            self._daemon_process = await asyncio.create_subprocess_exec(
                self.cua_binary_path,
                "serve",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            await asyncio.sleep(1.5)

            res = await self._raw_call("list_windows", payload={}, timeout=5.0, auto_start_daemon=False)
            if res.get("success"):
                logger.info("[CUA CLIENT] CUA Driver daemon successfully started and listening.")
                self._daemon_checked = True
                return True
            else:
                logger.warning(f"[CUA CLIENT] CUA daemon started but list_windows failed: {res.get('error')}")
                return False
        except Exception as err:
            logger.error(f"[CUA CLIENT ERROR] Failed to start CUA Driver daemon: {err}")
            return False

    async def _raw_call(
        self,
        tool_name: str,
        payload: Optional[Dict[str, Any]] = None,
        timeout: Optional[float] = None,
        auto_start_daemon: bool = True,
    ) -> Dict[str, Any]:
        """Executes `cua-driver call <tool_name>` passing JSON payload via stdin."""
        if auto_start_daemon and not self._daemon_checked:
            await self.ensure_daemon_running()

        if not self.is_binary_available():
            return {
                "success": False,
                "data": None,
                "error": f"CUA Driver daemon unavailable: Binary missing at '{self.cua_binary_path}'",
            }

        cmd_payload = payload or {}
        json_input = json.dumps(cmd_payload)
        t_req = timeout or self.timeout
        t0 = time.time()

        try:
            proc = await asyncio.create_subprocess_exec(
                self.cua_binary_path,
                "call",
                tool_name,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            try:
                stdout_data, stderr_data = await asyncio.wait_for(
                    proc.communicate(input=json_input.encode("utf-8")),
                    timeout=t_req,
                )
            except asyncio.TimeoutError:
                proc.kill()
                logger.error(f"[CUA CLIENT TIMEOUT] Tool '{tool_name}' timed out after {t_req}s.")
                return {
                    "success": False,
                    "data": None,
                    "error": f"CUA Driver subprocess timed out after {t_req} seconds for tool '{tool_name}'.",
                }

            stdout_str = stdout_data.decode("utf-8", errors="replace").strip()
            stderr_str = stderr_data.decode("utf-8", errors="replace").strip()
            latency = (time.time() - t0) * 1000.0

            if "Cua Driver daemon is not running" in stderr_str:
                if auto_start_daemon:
                    self._daemon_checked = False
                    if await self.ensure_daemon_running():
                        return await self._raw_call(tool_name, payload, timeout, auto_start_daemon=False)
                return {
                    "success": False,
                    "data": None,
                    "error": "CUA Driver daemon unavailable: Daemon is not running on pipe",
                }

            if proc.returncode != 0 and not stdout_str:
                logger.error(f"[CUA CLIENT ERROR] tool='{tool_name}' exit_code={proc.returncode} stderr='{stderr_str}'")
                return {
                    "success": False,
                    "data": None,
                    "error": f"CUA Driver call error (code {proc.returncode}): {stderr_str or 'Unknown error'}",
                }

            parsed_data = None
            if stdout_str:
                try:
                    parsed_data = json.loads(stdout_str)
                except json.JSONDecodeError:
                    parsed_data = {"raw_output": stdout_str}

            logger.info(f"[CUA CLIENT SUCCESS] tool='{tool_name}' latency_ms={latency:.1f}ms")
            return {
                "success": True,
                "data": parsed_data if parsed_data is not None else {},
                "error": None,
                "latency_ms": latency,
            }

        except Exception as err:
            logger.error(f"[CUA CLIENT EXCEPTION] tool='{tool_name}' error='{err}'", exc_info=True)
            return {
                "success": False,
                "data": None,
                "error": f"CUA Driver invocation exception: {str(err)}",
            }

    # =========================================================================
    # CUA DRIVER TOOL INTERFACES
    # =========================================================================

    async def list_apps(self) -> Dict[str, Any]:
        """Lists installed application AUMIDs and titles."""
        return await self._raw_call("list_apps", {})

    async def list_windows(self) -> Dict[str, Any]:
        """Lists open top-level application windows on desktop."""
        return await self._raw_call("list_windows", {})

    async def launch_app(self, app_identifier: str) -> Dict[str, Any]:
        """Launches target application by AUMID, executable name, or title."""
        payload = {}
        if app_identifier.startswith("Microsoft.") or "!" in app_identifier:
            payload["aumid"] = app_identifier
        elif app_identifier.endswith(".exe"):
            payload["path"] = app_identifier
        else:
            payload["name"] = app_identifier
        return await self._raw_call("launch_app", payload)

    async def get_window_state(
        self,
        window_id: Optional[int] = None,
        max_depth: int = 5,
        max_elements: int = 50,
    ) -> Dict[str, Any]:
        """Retrieves bounded UI element tree for target or foreground window."""
        payload = {
            "max_depth": max_depth,
            "max_elements": max_elements,
        }
        if window_id is not None:
            payload["window_id"] = window_id
        return await self._raw_call("get_window_state", payload)

    async def get_accessibility_tree(self, max_depth: int = 5, max_elements: int = 50) -> Dict[str, Any]:
        """Retrieves bounded accessibility element tree for active screen."""
        return await self._raw_call("get_accessibility_tree", {"max_depth": max_depth, "max_elements": max_elements})

    async def get_desktop_state(self) -> Dict[str, Any]:
        """Queries full desktop state summary."""
        return await self._raw_call("get_desktop_state", {})

    async def bring_to_front(self, window_id: int) -> Dict[str, Any]:
        """Focuses and brings target window to foreground."""
        return await self._raw_call("bring_to_front", {"window_id": window_id})

    async def click(self, x: int, y: int, window_id: Optional[int] = None) -> Dict[str, Any]:
        """Performs left click at screen coordinates (x, y)."""
        payload: Dict[str, Any] = {"x": x, "y": y, "button": "left"}
        if window_id is not None:
            payload["window_id"] = window_id
        return await self._raw_call("click", payload)

    async def double_click(self, x: int, y: int, window_id: Optional[int] = None) -> Dict[str, Any]:
        """Performs double click at screen coordinates (x, y)."""
        payload: Dict[str, Any] = {"x": x, "y": y, "double": True}
        if window_id is not None:
            payload["window_id"] = window_id
        return await self._raw_call("double_click", payload)

    async def right_click(self, x: int, y: int, window_id: Optional[int] = None) -> Dict[str, Any]:
        """Performs right click at screen coordinates (x, y)."""
        payload: Dict[str, Any] = {"x": x, "y": y, "button": "right"}
        if window_id is not None:
            payload["window_id"] = window_id
        return await self._raw_call("right_click", payload)

    async def drag(self, start_x: int, start_y: int, end_x: int, end_y: int) -> Dict[str, Any]:
        """Drags mouse cursor from (start_x, start_y) to (end_x, end_y)."""
        return await self._raw_call("drag", {"start_x": start_x, "start_y": start_y, "end_x": end_x, "end_y": end_y})

    async def move_cursor(self, x: int, y: int) -> Dict[str, Any]:
        """Moves cursor to screen coordinates (x, y)."""
        return await self._raw_call("move_cursor", {"x": x, "y": y})

    async def scroll(self, direction: str = "down", amount: int = 5) -> Dict[str, Any]:
        """Scrolls active surface in direction ('up', 'down', 'left', 'right')."""
        return await self._raw_call("scroll", {"direction": direction, "amount": amount})

    async def type_text(self, text: str) -> Dict[str, Any]:
        """Types string into active focused control."""
        return await self._raw_call("type_text", {"text": text})

    async def press_key(self, key: str) -> Dict[str, Any]:
        """Presses single key (e.g. 'enter', 'tab', 'escape', 'backspace')."""
        return await self._raw_call("press_key", {"key": key})

    async def hotkey(self, keys: List[str]) -> Dict[str, Any]:
        """Executes key combination shortcut (e.g. ['ctrl', 's'], ['alt', 'f4'])."""
        return await self._raw_call("hotkey", {"keys": keys})

    async def set_value(self, element_id: str, value: str) -> Dict[str, Any]:
        """Sets text value directly on UI element by element ID."""
        return await self._raw_call("set_value", {"element_id": element_id, "value": value})

    async def verify_state(self, condition: str) -> Dict[str, Any]:
        """Verifies UI state condition."""
        return await self._raw_call("verify_state", {"expect": condition})

    async def kill_app(self, pid_or_name: str) -> Dict[str, Any]:
        """Terminates process by PID or process name."""
        payload = {"pid": int(pid_or_name)} if str(pid_or_name).isdigit() else {"name": str(pid_or_name)}
        return await self._raw_call("kill_app", payload)
