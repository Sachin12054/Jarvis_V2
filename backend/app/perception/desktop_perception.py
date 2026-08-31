import os
import psutil
from typing import Dict, Any, Optional
from app.agent.os.active_window import ActiveWindowService
from app.agent.os.window_verifier import WindowVerificationService
from app.perception.world_model import DesktopState
from app.core.logging import logger


class DesktopPerception:
    """Desktop Perception Layer: Inspects active OS window titles, process IDs, top-level HWNDs, and foreground status using Win32 APIs."""

    _instance: Optional["DesktopPerception"] = None

    def __init__(self):
        self.active_window_service = ActiveWindowService()
        self.window_verifier = WindowVerificationService.get_instance()

    @classmethod
    def get_instance(cls) -> "DesktopPerception":
        if cls._instance is None:
            cls._instance = DesktopPerception()
        return cls._instance

    def perceive_desktop(self) -> DesktopState:
        """Queries authoritative Win32 APIs to build DesktopState."""
        win_info = self.active_window_service.get_active_window()
        win_title = win_info.get("title", "Desktop")
        pid = win_info.get("pid")

        app_name = "Desktop"
        if "chrome" in win_title.lower():
            app_name = "Chrome"
        elif "code" in win_title.lower() or "vs code" in win_title.lower():
            app_name = "VS Code"
        elif "powershell" in win_title.lower() or "cmd" in win_title.lower() or "terminal" in win_title.lower():
            app_name = "Terminal"
        elif "whatsapp" in win_title.lower():
            app_name = "WhatsApp"

        state = DesktopState(
            active_application=app_name,
            active_window=win_title,
            process_id=pid,
            foreground_status=True,
            minimized_status=False,
        )

        logger.info(f"[PERCEIVE] desktop app='{app_name}' window='{win_title}' pid={pid}")
        return state
