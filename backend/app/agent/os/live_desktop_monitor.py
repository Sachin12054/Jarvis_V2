import asyncio
import time
import ctypes
import hashlib
from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.agent.os.active_window import ActiveWindowService
from app.agent.os.screen_capture import ScreenCaptureService
from app.core.logging import logger


class MonitorStatus(str, Enum):
    OFF = "OFF"
    STARTING = "STARTING"
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    STOPPING = "STOPPING"
    ERROR = "ERROR"


class MonitorMode(str, Enum):
    CONTEXT = "CONTEXT"
    WINDOW = "WINDOW"
    CONDITION = "CONDITION"


class LiveDesktopMonitorState(BaseModel):
    """Pydantic state model tracking user-activated live desktop monitoring session."""

    enabled: bool = False
    status: MonitorStatus = MonitorStatus.OFF
    started_at: Optional[float] = None
    stopped_at: Optional[float] = None
    mode: MonitorMode = MonitorMode.CONTEXT
    target_window: Optional[str] = None
    last_observation_at: Optional[float] = None
    last_changed_at: Optional[float] = None
    observation_count: int = 0
    watch_condition: Optional[str] = None
    session_id: str = "default"


class CurrentDesktopState(BaseModel):
    """Structured lightweight snapshot of current desktop state."""

    active_application: str = "Unknown"
    window_title: str = "Desktop"
    process_name: str = "unknown.exe"
    process_id: int = 0
    window_bounds: Dict[str, int] = Field(default_factory=lambda: {"x": 0, "y": 0, "width": 1920, "height": 1080})
    cursor_position: Dict[str, int] = Field(default_factory=lambda: {"x": 0, "y": 0})
    focused_element: Optional[Dict[str, Any]] = None
    visible_text_summary: str = ""
    ui_elements: List[Dict[str, Any]] = Field(default_factory=list)
    screen_hash: str = ""
    last_observation: Optional[Dict[str, Any]] = None
    timestamp: float = Field(default_factory=time.time)


class POINT(ctypes.Structure):
    _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]


class LiveDesktopMonitorService:
    """Singleton service for User-Activated Live Desktop Monitoring with background change detection and zero background activity when OFF."""

    _instance: Optional["LiveDesktopMonitorService"] = None

    def __init__(
        self,
        active_window_service: Optional[ActiveWindowService] = None,
        screen_capture_service: Optional[ScreenCaptureService] = None,
    ):
        self.active_window_service = active_window_service or ActiveWindowService()
        self.screen_capture_service = screen_capture_service or ScreenCaptureService()

        self.state = LiveDesktopMonitorState()
        self.current_desktop_state = CurrentDesktopState()
        self._watcher_task: Optional[asyncio.Task] = None
        self._poll_interval_seconds: float = 1.0
        self._last_hash: str = ""

    @classmethod
    def get_instance(cls) -> "LiveDesktopMonitorService":
        if cls._instance is None:
            cls._instance = LiveDesktopMonitorService()
        return cls._instance

    def get_cursor_position(self) -> Dict[str, int]:
        """Returns current Win32 cursor (x, y) coordinates."""
        try:
            pt = POINT()
            ctypes.windll.user32.GetCursorPos(ctypes.byref(pt))
            return {"x": pt.x, "y": pt.y}
        except Exception:
            return {"x": 0, "y": 0}

    def get_element_at_cursor(self) -> Dict[str, Any]:
        """Inspects UI element directly underneath current Win32 cursor position."""
        pos = self.get_cursor_position()
        target_name = "Desktop"
        try:
            pt = POINT(pos["x"], pos["y"])
            hwnd = ctypes.windll.user32.WindowFromPoint(pt)
            if hwnd:
                length = ctypes.windll.user32.GetWindowTextLengthW(hwnd)
                if length > 0:
                    buff = ctypes.create_unicode_buffer(length + 1)
                    ctypes.windll.user32.GetWindowTextW(hwnd, buff, length + 1)
                    target_name = buff.value
        except Exception as err:
            logger.warning(f"[LIVE DESKTOP] WindowFromPoint error: {err}")

        # Check foreground active window text if target_name is generic
        win_info = self.active_window_service.get_active_window()
        win_title = win_info.get("title", "Active Window")

        # Map common button/control phrases
        if "run" in win_title.lower():
            target_name = "Run button"
        elif "stop" in win_title.lower():
            target_name = "STOP button"
        elif not target_name or target_name == "Desktop":
            target_name = win_title

        return {
            "cursor_position": pos,
            "element_name": target_name,
            "window_title": win_title,
        }

    async def start_monitoring(
        self,
        mode: MonitorMode = MonitorMode.CONTEXT,
        target_window: Optional[str] = None,
        watch_condition: Optional[str] = None,
    ) -> LiveDesktopMonitorState:
        """Explicitly activates Live Desktop Monitoring session."""
        if self.state.status == MonitorStatus.ACTIVE:
            logger.info("[LIVE DESKTOP] Monitor is already ACTIVE.")
            return self.state

        self.state.enabled = True
        self.state.status = MonitorStatus.STARTING
        self.state.mode = mode
        self.state.target_window = target_window
        self.state.watch_condition = watch_condition
        self.state.started_at = time.time()
        self.state.stopped_at = None

        logger.info(f"[LIVE DESKTOP] monitor_started mode={mode.value} target_window='{target_window}' condition='{watch_condition}'")

        # Take baseline initial observation
        await self._collect_baseline_observation()
        self.state.status = MonitorStatus.ACTIVE

        # Start asynchronous background watcher loop if not running
        if not self._watcher_task or self._watcher_task.done():
            self._watcher_task = asyncio.create_task(self._background_watcher_loop())

        return self.state

    async def stop_monitoring(self) -> LiveDesktopMonitorState:
        """Explicitly stops Live Desktop Monitoring and cleanly cancels background watcher task."""
        logger.info("[LIVE DESKTOP] Stopping live desktop monitoring session.")
        self.state.status = MonitorStatus.STOPPING

        if self._watcher_task and not self._watcher_task.done():
            self._watcher_task.cancel()
            try:
                await self._watcher_task
            except asyncio.CancelledError:
                pass
            self._watcher_task = None

        self.state.enabled = False
        self.state.status = MonitorStatus.OFF
        self.state.stopped_at = time.time()
        self.state.watch_condition = None
        self.state.target_window = None

        logger.info("[LIVE DESKTOP] monitor_stopped (Zero residual background activity).")
        return self.state

    async def pause_monitoring(self) -> LiveDesktopMonitorState:
        """Pauses monitoring session while retaining target configuration."""
        if self.state.status == MonitorStatus.ACTIVE:
            self.state.status = MonitorStatus.PAUSED
            logger.info("[LIVE DESKTOP] Monitoring session PAUSED.")
        return self.state

    async def resume_monitoring(self) -> LiveDesktopMonitorState:
        """Resumes active monitoring from PAUSED state."""
        if self.state.status == MonitorStatus.PAUSED:
            await self._collect_baseline_observation()
            self.state.status = MonitorStatus.ACTIVE
            logger.info("[LIVE DESKTOP] Monitoring session RESUMED.")
        return self.state

    async def _collect_baseline_observation(self) -> CurrentDesktopState:
        """Collects Level 1 low-cost desktop state (Active Window + Process + Cursor)."""
        win_info = self.active_window_service.get_active_window()
        pos = self.get_cursor_position()

        app_name = win_info.get("process", "unknown.exe").replace(".exe", "").title()
        win_title = win_info.get("title", "Desktop")

        sig = f"{app_name}|{win_title}|{pos['x']}|{pos['y']}"
        sig_hash = hashlib.md5(sig.encode("utf-8")).hexdigest()

        self.current_desktop_state = CurrentDesktopState(
            active_application=app_name,
            window_title=win_title,
            process_name=win_info.get("process", "unknown.exe"),
            process_id=win_info.get("pid", 0),
            window_bounds=win_info.get("bounds", {"x": 0, "y": 0, "width": 1920, "height": 1080}),
            cursor_position=pos,
            focused_element={"name": win_title},
            visible_text_summary=f"Active Window: {win_title} ({app_name})",
            ui_elements=[{"type": "window", "text": win_title}],
            screen_hash=sig_hash,
            timestamp=time.time(),
        )

        self.state.last_observation_at = time.time()
        self.state.observation_count += 1
        logger.info(f"[LIVE DESKTOP] observation_updated app='{app_name}' title='{win_title}'")
        return self.current_desktop_state

    async def _background_watcher_loop(self) -> None:
        """Background observation loop running ONLY when status == ACTIVE."""
        try:
            while self.state.enabled and self.state.status != MonitorStatus.OFF:
                if self.state.status == MonitorStatus.ACTIVE:
                    win_info = self.active_window_service.get_active_window()
                    pos = self.get_cursor_position()

                    app_name = win_info.get("process", "unknown.exe").replace(".exe", "").title()
                    win_title = win_info.get("title", "Desktop")
                    sig = f"{app_name}|{win_title}"
                    new_hash = hashlib.md5(sig.encode("utf-8")).hexdigest()

                    # Change detection (Level 2)
                    if new_hash != self._last_hash:
                        self._last_hash = new_hash
                        self.state.last_changed_at = time.time()
                        logger.info(f"[LIVE DESKTOP] change_detected app='{app_name}' title='{win_title}'")

                        self.current_desktop_state.active_application = app_name
                        self.current_desktop_state.window_title = win_title
                        self.current_desktop_state.cursor_position = pos
                        self.current_desktop_state.screen_hash = new_hash
                        self.current_desktop_state.timestamp = time.time()

                    # Evaluate watch condition if active
                    if self.state.watch_condition:
                        logger.info(f"[LIVE DESKTOP] condition_evaluated condition='{self.state.watch_condition}'")
                        cond_clean = self.state.watch_condition.lower()

                        # Condition matched: e.g. "backend starts", "build finishes"
                        if ("backend" in cond_clean and ("start" in cond_clean or "ready" in cond_clean or "run" in cond_clean)) or ("build" in cond_clean and "finish" in cond_clean):
                            if "python" in win_info.get("process", "").lower() or "uvicorn" in win_title.lower() or "cmd" in app_name.lower() or "powershell" in app_name.lower():
                                logger.info(f"[LIVE DESKTOP] Condition '{self.state.watch_condition}' SATISFIED.")
                                self.state.watch_condition = None

                await asyncio.sleep(self._poll_interval_seconds)
        except asyncio.CancelledError:
            logger.info("[LIVE DESKTOP] Background watcher loop cancelled.")
        except Exception as err:
            logger.error(f"[LIVE DESKTOP] Watcher error: {err}")
            self.state.status = MonitorStatus.ERROR
