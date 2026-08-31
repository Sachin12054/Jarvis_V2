import asyncio
from typing import Dict, Any, List, Optional
from app.execution.cua_driver_client import CuaDriverClient
from app.core.logging import logger


class WindowManager:
    """Manages window switching, focus, and title inspection via CUA Driver."""

    def __init__(self):
        self.cua_client = CuaDriverClient.get_instance()

    def list_open_windows(self) -> List[str]:
        """Lists active top-level window titles via CUA Driver."""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # Run in thread pool if loop is running
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    res = pool.submit(asyncio.run, self.cua_client.list_windows()).result(timeout=3.0)
            else:
                res = asyncio.run(self.cua_client.list_windows())

            data = res.get("data", {})
            windows = data.get("windows", []) or data.get("_legacy_windows", [])
            titles = [str(w.get("title", "")).strip() for w in windows if str(w.get("title", "")).strip()]
            return titles
        except Exception as err:
            logger.warning(f"[WINDOW MANAGER] Could not list window titles via CUA: {err}")
            return []

    def focus_window(self, window_title: str) -> Dict[str, Any]:
        """Focuses/switches to specified window title via CUA Driver live window resolution."""
        try:
            resolved = asyncio.run(self.cua_client.resolve_window(title_contains=window_title, timeout=3.0))
            if resolved.get("success") and resolved.get("window_id"):
                win_id = resolved["window_id"]
                asyncio.run(self.cua_client.bring_to_front(win_id))
                logger.info(f"[WINDOW MANAGER] Focused window '{window_title}' (window_id={win_id}) via CUA")
                return {"success": True, "window_title": window_title, "window_id": win_id, "message": f"Switched to {window_title}."}
            return {"success": False, "window_title": window_title, "error": resolved.get("error", "Window not found")}
        except Exception as err:
            logger.error(f"[WINDOW MANAGER] Failed to focus window '{window_title}': {err}")
            return {"success": False, "window_title": window_title, "error": str(err)}
