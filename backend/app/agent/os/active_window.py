import time
import asyncio
from typing import Dict, Any, Optional
from app.execution.cua_driver_client import CuaDriverClient
from app.core.logging import logger


class ActiveWindowService:
    """Active Window Perception Service: Queries current active foreground window details via CUA Driver."""

    def __init__(self):
        self.cua_client = CuaDriverClient.get_instance()

    def get_active_window(self) -> Dict[str, Any]:
        """Queries current active foreground window details via CUA Driver state."""
        timestamp = time.time()
        title = "Desktop"
        process_name = "explorer.exe"
        executable = r"C:\Windows\explorer.exe"
        bounds = {"x": 0, "y": 0, "width": 1920, "height": 1080}

        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    res = pool.submit(asyncio.run, self.cua_client.list_windows()).result(timeout=3.0)
            else:
                res = asyncio.run(self.cua_client.list_windows())

            if res.get("success"):
                data = res.get("data", {})
                windows = data.get("windows", []) or data.get("_legacy_windows", [])
                if windows:
                    # Top window in windows list (z_index highest)
                    top = windows[0]
                    title = top.get("title") or title
                    process_name = top.get("app_name") or process_name
                    bounds = top.get("bounds") or bounds

        except Exception as err:
            logger.warning(f"[ACTIVE WINDOW] CUA Driver query warning: {err}")

        res = {
            "title": title,
            "process": process_name,
            "executable": executable,
            "bounds": bounds,
            "timestamp": timestamp,
        }
        logger.info(f"[ACTIVE WINDOW] Active window: '{title}' (Process: {process_name})")
        return res
