import subprocess
from typing import Dict, Any, List, Optional
from app.core.logging import logger


class WindowManager:
    """Manages window switching, focus, and title inspection on Windows OS."""

    def list_open_windows(self) -> List[str]:
        """Lists active top-level window titles."""
        try:
            cmd = "powershell -Command \"Get-Process | Where-Object {$_.MainWindowTitle} | Select-Object -ExpandProperty MainWindowTitle\""
            out = subprocess.check_output(cmd, shell=True, timeout=3).decode().strip()
            titles = [t.strip() for t in out.split('\n') if t.strip()]
            return titles
        except Exception as err:
            logger.warning(f"[WINDOW MANAGER] Could not list window titles: {err}")
            return []

    def focus_window(self, window_title: str) -> Dict[str, Any]:
        """Focuses/switches to specified window title."""
        try:
            cmd = f"powershell -Command \"$wshell = New-Object -ComObject wscript.shell; $wshell.AppActivate('{window_title}')\""
            subprocess.run(cmd, shell=True, timeout=3)
            logger.info(f"[WINDOW MANAGER] Focused window matching '{window_title}'")
            return {"success": True, "window_title": window_title, "message": f"Switched to {window_title}."}
        except Exception as err:
            logger.error(f"[WINDOW MANAGER] Failed to focus window '{window_title}': {err}")
            return {"success": False, "window_title": window_title, "error": str(err)}
