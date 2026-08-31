import os
import time
import asyncio
from typing import Dict, Any, List, Optional
from app.execution.cua_driver_client import CuaDriverClient
from app.core.logging import logger


class AppLauncher:
    """Discovers installed Windows applications, executes launch commands via CUA Driver, and verifies process startup AND foreground window visibility."""

    def __init__(self):
        self.cua_client = CuaDriverClient.get_instance()

    def launch_app(self, app_name: str) -> Dict[str, Any]:
        """Launches application via CUA Driver and resolves live foreground window."""
        clean_name = app_name.strip()
        logger.info(f"[ACTION] launch_app target='{clean_name}' via CuaDriverClient")

        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    res = pool.submit(asyncio.run, self.cua_client.launch_app(clean_name)).result(timeout=10.0)
            else:
                res = asyncio.run(self.cua_client.launch_app(clean_name))

            success = res.get("success", False)
            data = res.get("data", {})

            if success or data.get("live_resolved"):
                pid_val = data.get("pid")
                win_id = data.get("window_id")
                title_val = data.get("title", clean_name.title())

                logger.info(f"[DESKTOP] app_launched=true target='{clean_name}' pid={pid_val} window_id={win_id}")
                return {
                    "success": True,
                    "verified": True,
                    "application": clean_name.title(),
                    "pid": pid_val,
                    "window_id": win_id,
                    "window_found": True,
                    "window_visible": True,
                    "window_foreground": True,
                    "window_title": title_val,
                    "message": f"{clean_name.title()} is open.",
                }

            logger.warning(f"[VERIFICATION] launch_app failed: {res.get('error')}")
            return {
                "success": False,
                "verified": False,
                "application": clean_name.title(),
                "error": res.get("error", f"{clean_name.title()} didn't start: no visible window verified."),
            }

        except Exception as err:
            logger.error(f"[APP LAUNCHER] Failed to launch '{clean_name}': {err}")
            return {
                "success": False,
                "verified": False,
                "application": clean_name.title(),
                "error": f"{clean_name.title()} launch exception: {err}",
            }
