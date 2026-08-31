from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.agent.os.cursor_service import CursorService
from app.agent.os.live_desktop_monitor import LiveDesktopMonitorService
from app.core.logging import logger


class CursorTargetInfo(BaseModel):
    x: int
    y: int
    active_application: str
    window_title: str
    target_element: Optional[str] = None


class ScreenPerception:
    """Screen Perception Layer: Inspects screen bounds, visual elements, cursor coordinates, and UI element under cursor."""

    _instance: Optional["ScreenPerception"] = None

    def __init__(self):
        self.cursor_service = CursorService.get_instance()
        self.monitor_service = LiveDesktopMonitorService.get_instance()

    @classmethod
    def get_instance(cls) -> "ScreenPerception":
        if cls._instance is None:
            cls._instance = ScreenPerception()
        return cls._instance

    def perceive_cursor_target(self) -> CursorTargetInfo:
        """Inspects cursor position and resolves target UI element."""
        diag = self.cursor_service.inspect_cursor_target()
        pos = diag.cursor_position

        info = CursorTargetInfo(
            x=pos.get("x", 0),
            y=pos.get("y", 0),
            active_application=diag.active_application,
            window_title=diag.window_title,
            target_element=diag.hovered_element,
        )

        logger.info(f"[PERCEIVE] cursor at=({info.x}, {info.y}) app='{info.active_application}' element='{info.target_element}'")
        return info
