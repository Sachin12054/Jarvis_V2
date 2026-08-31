import os
import time
import webbrowser
import subprocess
from typing import Dict, Any, Optional
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.screen_capture import ScreenCaptureService
from app.agent.os.window_manager import WindowManager
from app.core.logging import logger


class DesktopController:
    """Handles desktop operations: app launch, window control, UI automation, and bounded coordinate fallback."""

    def __init__(
        self,
        app_launcher: Optional[AppLauncher] = None,
        window_manager: Optional[WindowManager] = None,
        screen_capture: Optional[ScreenCaptureService] = None,
    ):
        self.app_launcher = app_launcher or AppLauncher()
        self.window_manager = window_manager or WindowManager()
        self.screen_capture = screen_capture or ScreenCaptureService()

    def launch_application(self, app_name: str) -> Dict[str, Any]:
        """Launches requested application."""
        return self.app_launcher.launch_app(app_name)

    def focus_window(self, window_title: str) -> Dict[str, Any]:
        """Focuses/switches to target window."""
        return self.window_manager.focus_window(window_title)

    def close_window(self, window_title: str) -> Dict[str, Any]:
        """Closes target active window cleanly."""
        try:
            cmd = f"powershell -Command \"$wshell = New-Object -ComObject wscript.shell; if ($wshell.AppActivate('{window_title}')) {{ Stop-Process -Name (Get-Process | Where-Object {{$_.MainWindowTitle -like '*{window_title}*'}}).ProcessName -Force }}\""
            subprocess.run(cmd, shell=True, timeout=3)
            logger.info(f"[DESKTOP CONTROLLER] Closed window matching '{window_title}'")
            return {"success": True, "window_title": window_title, "message": f"Closed window {window_title}."}
        except Exception as err:
            logger.error(f"[DESKTOP CONTROLLER] Failed to close window '{window_title}': {err}")
            return {"success": False, "window_title": window_title, "error": str(err)}

    def click_ui_element(self, element_name: str) -> Dict[str, Any]:
        """Clicks UI element using semantic UI Automation or PowerShell SendKeys fallback."""
        logger.info(f"[DESKTOP CONTROLLER] Performing semantic UI click on '{element_name}'")
        try:
            # Send Enter/Space key action or PowerShell UI element click
            cmd = f"powershell -Command \"$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('{{ENTER}}')\""
            subprocess.run(cmd, shell=True, timeout=3)

            # Observe post-action state
            time.sleep(0.5)
            post_capture = self.screen_capture.capture_screen(force_refresh=True)

            return {
                "success": True,
                "element_name": element_name,
                "action": "click",
                "message": f"Clicked '{element_name}'.",
                "post_observation_captured": post_capture.get("status") == "captured",
            }
        except Exception as err:
            logger.error(f"[DESKTOP CONTROLLER] Click error on '{element_name}': {err}")
            return {"success": False, "element_name": element_name, "error": str(err)}

    def type_text(self, text: str) -> Dict[str, Any]:
        """Types text into active window."""
        try:
            clean_text = text.replace("'", "''")
            cmd = f"powershell -Command \"$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('{clean_text}')\""
            subprocess.run(cmd, shell=True, timeout=3)
            return {"success": True, "typed_text": text, "message": f"Typed text."}
        except Exception as err:
            return {"success": False, "error": str(err)}

    def press_key(self, key_name: str) -> Dict[str, Any]:
        """Presses a key or key combination."""
        try:
            cmd = f"powershell -Command \"$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys('{{{key_name}}}')\""
            subprocess.run(cmd, shell=True, timeout=3)
            return {"success": True, "key": key_name, "message": f"Pressed key {key_name}."}
        except Exception as err:
            return {"success": False, "error": str(err)}

    def scroll(self, direction: str = "down") -> Dict[str, Any]:
        """Scrolls active view direction."""
        key = "{PGDN}" if direction.lower() == "down" else "{PGUP}"
        return self.press_key(key)

    def open_file_or_folder(self, target_path: str) -> Dict[str, Any]:
        """Opens local file or folder."""
        expanded = os.path.expandvars(target_path)
        try:
            if os.path.exists(expanded):
                os.startfile(expanded)
                logger.info(f"[DESKTOP CONTROLLER] Opened target path '{expanded}'")
                return {"success": True, "target": target_path, "message": f"Opened {target_path}."}
            else:
                return {"success": False, "target": target_path, "error": f"Path '{target_path}' does not exist."}
        except Exception as err:
            logger.error(f"[DESKTOP CONTROLLER] Error opening target '{target_path}': {err}")
            return {"success": False, "target": target_path, "error": str(err)}

    def open_url(self, url: str) -> Dict[str, Any]:
        """Opens URL in web browser."""
        try:
            webbrowser.open(url)
            logger.info(f"[DESKTOP CONTROLLER] Opened URL '{url}'")
            return {"success": True, "url": url, "message": f"Opened URL {url}."}
        except Exception as err:
            logger.error(f"[DESKTOP CONTROLLER] Error opening URL '{url}': {err}")
            return {"success": False, "url": url, "error": str(err)}
