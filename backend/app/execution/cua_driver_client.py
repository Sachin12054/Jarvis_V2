import os
import sys
import json
import time
import asyncio
import subprocess
from typing import Dict, Any, Optional, List
from app.core.config import settings
from app.core.logging import logger


def _run_subprocess_sync(cmd: List[str], input_bytes: Optional[bytes], timeout: float) -> Dict[str, Any]:
    """Executes a synchronous subprocess with timeout, returning raw byte streams and return codes."""
    try:
        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE if input_bytes is not None else subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        stdout, stderr = proc.communicate(input=input_bytes, timeout=timeout)
        return {
            "returncode": proc.returncode,
            "stdout": stdout,
            "stderr": stderr,
            "error": None,
            "timeout": False,
        }
    except subprocess.TimeoutExpired:
        try:
            proc.kill()
            stdout, stderr = proc.communicate()
        except Exception:
            stdout, stderr = b"", b""
        return {
            "returncode": -1,
            "stdout": stdout,
            "stderr": stderr,
            "error": f"CUA Driver subprocess timed out after {timeout} seconds.",
            "timeout": True,
        }
    except Exception as err:
        return {
            "returncode": -1,
            "stdout": b"",
            "stderr": b"",
            "error": str(err),
            "timeout": False,
        }


def _spawn_daemon_sync(cmd: List[str]) -> bool:
    """Spawns background daemon process without blocking parent execution."""
    try:
        flags = 0
        if sys.platform == "win32":
            flags = getattr(subprocess, "DETACHED_PROCESS", 0) | getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
        subprocess.Popen(
            cmd,
            creationflags=flags,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return True
    except Exception as err:
        logger.error(f"[CUA DAEMON SPAWN ERROR] {err}")
        return False


class CuaDriverClient:
    """Client for CUA Driver (`cua-driver.exe`).

    Provides single-point, safe subprocess integration with CUA Driver CLI via JSON stdin payload streams.
    Manages daemon lifecycles (`cua-driver serve`), live window resolution, automatic stale-target recovery,
    and returns clean structured action responses.
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
        self._daemon_checked = False
        self._daemon_spawn_failed = False
        self._last_resolved_target: Dict[str, Any] = {}

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

        # Quick probe to check if daemon is already responding
        res = await self._raw_call("list_windows", payload={}, timeout=3.0, auto_start_daemon=False, auto_recover=False)
        if res.get("success"):
            self._daemon_checked = True
            return True

        if self._daemon_spawn_failed:
            logger.warning("[CUA CLIENT] Previous daemon spawn attempt failed. Skipping repetitive spawn.")
            return False

        logger.info(f"[CUA CLIENT] CUA Driver daemon unavailable on '{self.socket_pipe}'. Spawning `cua-driver serve` daemon...")
        spawn_ok = await asyncio.to_thread(_spawn_daemon_sync, [self.cua_binary_path, "serve"])
        if not spawn_ok:
            self._daemon_spawn_failed = True
            return False

        await asyncio.sleep(1.5)

        res = await self._raw_call("list_windows", payload={}, timeout=5.0, auto_start_daemon=False, auto_recover=False)
        if res.get("success"):
            logger.info("[CUA CLIENT] CUA Driver daemon successfully started and listening.")
            self._daemon_checked = True
            return True

        logger.warning(f"[CUA CLIENT] CUA daemon started but list_windows failed: {res.get('error')}")
        self._daemon_spawn_failed = True
        return False

    async def resolve_window(
        self,
        pid: Optional[int] = None,
        window_id: Optional[int] = None,
        app_name: Optional[str] = None,
        title_contains: Optional[str] = None,
        timeout: float = 6.0,
    ) -> Dict[str, Any]:
        """Robust live window resolution strategy:

        1. Check if window_id/pid is active in list_windows.
        2. If missing or stale, query list_windows and match by PID, app_name, or title_contains.
        3. Filter for on-screen, non-minimized windows.
        4. Bounded polling every 250ms for newly launched apps up to `timeout`.
        5. Return fresh target metadata (pid, window_id, title, app_name).
        """
        t0 = time.time()
        poll_interval = 0.25

        clean_app = (app_name or "").lower().replace(".exe", "").strip()
        clean_title = (title_contains or "").lower().strip()

        while (time.time() - t0) <= timeout:
            res = await self._raw_call("list_windows", payload={}, timeout=5.0, auto_start_daemon=True, auto_recover=False)
            if not res.get("success"):
                await asyncio.sleep(poll_interval)
                continue

            data = res.get("data", {})
            windows = data.get("windows", []) or data.get("_legacy_windows", [])

            # 1. Match by window_id
            if window_id is not None:
                for w in windows:
                    w_id = w.get("window_id") or w.get("id")
                    if w_id == window_id:
                        target = {
                            "success": True,
                            "window_id": w_id,
                            "pid": w.get("pid"),
                            "title": w.get("title", ""),
                            "app_name": w.get("app_name", ""),
                            "data": w,
                        }
                        self._last_resolved_target = target
                        return target

            # 2. Match by PID
            if pid is not None:
                for w in windows:
                    if w.get("pid") == pid:
                        w_id = w.get("window_id") or w.get("id")
                        target = {
                            "success": True,
                            "window_id": w_id,
                            "pid": w.get("pid"),
                            "title": w.get("title", ""),
                            "app_name": w.get("app_name", ""),
                            "data": w,
                        }
                        self._last_resolved_target = target
                        return target

            # 3. Match by app_name or title_contains
            if clean_app or clean_title:
                candidates = []
                for w in windows:
                    w_title = str(w.get("title", "")).lower()
                    w_app = str(w.get("app_name", "")).lower()
                    w_bundle = str(w.get("bundle_id", "")).lower()

                    app_match = clean_app and (clean_app in w_app or clean_app in w_bundle or clean_app in w_title)
                    title_match = clean_title and (clean_title in w_title)

                    if app_match or title_match:
                        score = 0
                        if w.get("is_on_screen", True):
                            score += 2
                        if not w.get("minimized", False):
                            score += 2
                        if title_match:
                            score += 1
                        if app_match:
                            score += 1
                        candidates.append((score, w))

                if candidates:
                    candidates.sort(key=lambda item: item[0], reverse=True)
                    best_window = candidates[0][1]
                    best_id = best_window.get("window_id") or best_window.get("id")
                    target = {
                        "success": True,
                        "window_id": best_id,
                        "pid": best_window.get("pid"),
                        "title": best_window.get("title", ""),
                        "app_name": best_window.get("app_name", ""),
                        "data": best_window,
                    }
                    self._last_resolved_target = target
                    return target

            await asyncio.sleep(poll_interval)

        logger.warning(f"[CUA RESOLVER] Could not resolve window pid={pid} win_id={window_id} app={app_name} title={title_contains}")
        return {
            "success": False,
            "window_id": None,
            "pid": None,
            "error": f"Window resolution timed out ({timeout}s) for app='{app_name}', title='{title_contains}'",
        }

    async def _raw_call(
        self,
        tool_name: str,
        payload: Optional[Dict[str, Any]] = None,
        timeout: Optional[float] = None,
        auto_start_daemon: bool = True,
        auto_recover: bool = True,
    ) -> Dict[str, Any]:
        """Executes `cua-driver call <tool_name>` passing JSON payload via stdin."""
        if auto_start_daemon and not self._daemon_checked:
            await self.ensure_daemon_running()

        if not self.is_binary_available():
            return {
                "success": False,
                "data": None,
                "error_category": "SUBPROCESS_EXECUTION_ERROR",
                "error": f"CUA Driver execution error: Binary missing at '{self.cua_binary_path}'",
            }

        cmd_payload = payload or {}
        json_input = (json.dumps(cmd_payload) + "\n").encode("utf-8")
        t_req = timeout or self.timeout
        t0 = time.time()

        cmd = [self.cua_binary_path, "call", tool_name]

        # Use thread-pool executor to execute Popen synchronously without asyncio loop limitations
        sub_res = await asyncio.to_thread(_run_subprocess_sync, cmd, json_input, t_req)

        if sub_res["timeout"]:
            logger.error(f"[CUA CLIENT TIMEOUT] Tool '{tool_name}' timed out after {t_req}s.")
            return {
                "success": False,
                "data": None,
                "error_category": "TIMEOUT",
                "error": f"CUA Driver subprocess timed out after {t_req} seconds for tool '{tool_name}'.",
            }

        if sub_res["error"]:
            logger.error(f"[CUA CLIENT SUBPROCESS ERROR] tool='{tool_name}' error='{sub_res['error']}'")
            return {
                "success": False,
                "data": None,
                "error_category": "SUBPROCESS_EXECUTION_ERROR",
                "error": f"Subprocess execution unavailable: {sub_res['error']}",
            }

        stdout_bytes: bytes = sub_res["stdout"]
        stderr_bytes: bytes = sub_res["stderr"]
        stdout_str = stdout_bytes.decode("utf-8", errors="replace").strip()
        stderr_str = stderr_bytes.decode("utf-8", errors="replace").strip()
        latency = (time.time() - t0) * 1000.0

        # 1. Daemon unavailable error
        if "Cua Driver daemon is not running" in stderr_str:
            if auto_start_daemon and not self._daemon_spawn_failed:
                self._daemon_checked = False
                if await self.ensure_daemon_running():
                    return await self._raw_call(tool_name, payload, timeout, auto_start_daemon=False, auto_recover=auto_recover)
            return {
                "success": False,
                "data": None,
                "error_category": "DAEMON_UNAVAILABLE",
                "error": "CUA Driver daemon unavailable: Daemon is not running on pipe",
            }

        parsed_data = None
        if stdout_str:
            try:
                parsed_data = json.loads(stdout_str)
            except json.JSONDecodeError:
                parsed_data = {"raw_output": stdout_str}

        # 2. Stale handle / window target not found error recovery
        is_target_not_found = (
            "window_target_not_found" in stderr_str.lower()
            or (parsed_data and "window_target_not_found" in json.dumps(parsed_data).lower())
            or (parsed_data and "target_not_found" in json.dumps(parsed_data).lower())
        )

        if is_target_not_found and auto_recover:
            logger.warning(f"[CUA CLIENT STALE RECOVERY] tool='{tool_name}' reported target not found. Attempting live rediscovery...")
            target_app = cmd_payload.get("app_name") or self._last_resolved_target.get("app_name")
            target_title = cmd_payload.get("title") or self._last_resolved_target.get("title")
            target_pid = cmd_payload.get("pid") or self._last_resolved_target.get("pid")

            resolved = await self.resolve_window(pid=target_pid, app_name=target_app, title_contains=target_title, timeout=3.0)
            if resolved.get("success") and resolved.get("window_id"):
                new_payload = dict(cmd_payload)
                new_payload["window_id"] = resolved["window_id"]
                if "pid" in new_payload:
                    new_payload["pid"] = resolved["pid"]
                logger.info(f"[CUA CLIENT STALE RECOVERY] Target reacquired window_id={resolved['window_id']}. Retrying tool call...")
                return await self._raw_call(tool_name, new_payload, timeout, auto_start_daemon=False, auto_recover=False)

        # 3. CUA tool execution error
        returncode = sub_res["returncode"]
        if returncode != 0 and not stdout_str:
            logger.error(f"[CUA CLIENT ERROR] tool='{tool_name}' exit_code={returncode} stderr='{stderr_str}'")
            return {
                "success": False,
                "data": None,
                "error_category": "CUA_TOOL_ERROR",
                "error": f"CUA Driver tool error (code {returncode}): {stderr_str or 'Unknown error'}",
            }

        logger.info(f"[CUA CLIENT SUCCESS] tool='{tool_name}' latency_ms={latency:.1f}ms")
        return {
            "success": True,
            "data": parsed_data if parsed_data is not None else {},
            "error_category": None,
            "error": None,
            "latency_ms": latency,
        }

    # =========================================================================
    # CUA DRIVER TOOL INTERFACES WITH LIVE WINDOW RESOLUTION
    # =========================================================================

    async def list_apps(self) -> Dict[str, Any]:
        """Lists installed application AUMIDs and titles."""
        return await self._raw_call("list_apps", {})

    async def list_windows(self) -> Dict[str, Any]:
        """Lists open top-level application windows on desktop."""
        return await self._raw_call("list_windows", {})

    async def launch_app(self, app_identifier: str) -> Dict[str, Any]:
        """Launches target application by AUMID, executable name, or title, then resolves live window."""
        payload = {}
        clean_id = app_identifier.strip()
        if clean_id.startswith("Microsoft.") or "!" in clean_id:
            payload["aumid"] = clean_id
        elif clean_id.endswith(".exe"):
            payload["path"] = clean_id
        elif clean_id.lower() == "notepad":
            payload["path"] = "notepad.exe"
        else:
            payload["name"] = clean_id

        launch_res = await self._raw_call("launch_app", payload)

        if not launch_res.get("success"):
            return launch_res

        launch_data = launch_res.get("data") or {}
        launched_pid = launch_data.get("pid")

        resolved = await self.resolve_window(pid=launched_pid, app_name=app_identifier, title_contains=app_identifier, timeout=6.0)

        combined_data = dict(launch_data)
        if resolved.get("success"):
            combined_data["pid"] = resolved.get("pid") or launched_pid
            combined_data["window_id"] = resolved.get("window_id")
            combined_data["title"] = resolved.get("title")
            combined_data["live_resolved"] = True
        else:
            combined_data["live_resolved"] = False

        return {
            "success": True,
            "data": combined_data,
            "error": None,
        }

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

    async def click(self, x: int, y: int, window_id: Optional[int] = None, element_token: Optional[str] = None) -> Dict[str, Any]:
        """Performs left click at screen coordinates or element_token."""
        payload: Dict[str, Any] = {"x": x, "y": y, "button": "left"}
        if window_id is not None:
            payload["window_id"] = window_id
        if element_token is not None:
            payload["element_token"] = element_token
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

    async def type_text(self, text: str, pid: Optional[int] = None) -> Dict[str, Any]:
        """Types string into active focused control."""
        payload: Dict[str, Any] = {"text": text}
        if pid is not None:
            payload["pid"] = pid
        return await self._raw_call("type_text", payload)

    async def press_key(self, key: str) -> Dict[str, Any]:
        """Presses single key (e.g. 'enter', 'tab', 'escape', 'backspace')."""
        return await self._raw_call("press_key", {"key": key})

    async def hotkey(self, keys: List[str]) -> Dict[str, Any]:
        """Executes key combination shortcut (e.g. ['ctrl', 's'], ['alt', 'f4'])."""
        return await self._raw_call("hotkey", {"keys": keys})

    async def set_value(self, element_id: str, value: str) -> Dict[str, Any]:
        """Sets text value directly on UI element by element ID / token."""
        return await self._raw_call("set_value", {"element_id": element_id, "value": value})

    async def verify_state(self, condition: str) -> Dict[str, Any]:
        """Verifies UI state condition."""
        return await self._raw_call("verify_state", {"expect": condition})

    async def kill_app(self, pid_or_name: str) -> Dict[str, Any]:
        """Terminates process by PID or process name."""
        payload = {"pid": int(pid_or_name)} if str(pid_or_name).isdigit() else {"name": str(pid_or_name)}
        return await self._raw_call("kill_app", payload)
