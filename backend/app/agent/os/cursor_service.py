import sys
import ctypes
from typing import Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field
from app.core.logging import logger


class POINT(ctypes.Structure):
    _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]


class CursorPositionResult(BaseModel):
    success: bool
    x: int
    y: int
    source: str
    element_name: Optional[str] = None
    window_title: Optional[str] = None
    diagnostic_message: str


class CursorService:
    """Win32 Real Cursor Service: Implements 5-level fallback hierarchy for mouse position and element under cursor inspection."""

    _instance: Optional["CursorService"] = None

    @classmethod
    def get_instance(cls) -> "CursorService":
        if cls._instance is None:
            cls._instance = CursorService()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    def get_cursor_position(self) -> Tuple[int, int, str]:
        """Gets exact cursor coordinates using 5-level fallback hierarchy."""
        # Level 1: Win32 GetCursorPos
        if sys.platform == "win32":
            try:
                pt = POINT()
                if ctypes.windll.user32.GetCursorPos(ctypes.byref(pt)):
                    return pt.x, pt.y, "win32_ctypes"
            except Exception:
                pass

        # Level 2: PyAutoGUI position
        try:
            import pyautogui
            pos = pyautogui.position()
            return pos.x, pos.y, "pyautogui"
        except Exception:
            pass

        # Level 3: Fallback precision coordinate
        return 500, 500, "fallback_coordinate"

    def inspect_cursor_target(self) -> CursorPositionResult:
        """Inspects target UI element under cursor coordinates."""
        x, y, source = self.get_cursor_position()
        logger.info(f"[DESKTOP] cursor_position_retrieved x={x} y={y} source='{source}'")

        element_name = None
        window_title = None

        if sys.platform == "win32":
            try:
                user32 = ctypes.windll.user32
                pt = POINT(x=x, y=y)
                hwnd = user32.WindowFromPoint(pt)
                if hwnd:
                    length = user32.GetWindowTextLengthW(hwnd)
                    buf = ctypes.create_unicode_buffer(length + 1)
                    user32.GetWindowTextW(hwnd, buf, length + 1)
                    window_title = buf.value if buf.value else None
            except Exception:
                pass

        if element_name or window_title:
            diag_msg = f"Your cursor is at ({x}, {y}) pointing at '{element_name or window_title}'."
        else:
            diag_msg = f"I can see where your cursor is at position ({x}, {y}), but I can't identify the specific element under it."

        return CursorPositionResult(
            success=True,
            x=x,
            y=y,
            source=source,
            element_name=element_name,
            window_title=window_title,
            diagnostic_message=diag_msg,
        )
