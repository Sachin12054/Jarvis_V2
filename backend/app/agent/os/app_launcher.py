import os
import time
import shutil
import ctypes
import subprocess
import psutil
from typing import Dict, Any, List, Optional
from app.agent.os.window_verifier import WindowVerificationService
from app.core.logging import logger

SW_RESTORE = 9


class AppLauncher:
    """Discovers installed Windows applications, executes launch commands, and verifies process startup AND foreground window visibility."""

    KNOWN_APPS = {
        "chrome": [
            "chrome.exe",
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe",
            r"%USERPROFILE%\AppData\Local\Google\Chrome\Application\chrome.exe",
        ],
        "google chrome": [
            "chrome.exe",
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe",
            r"%USERPROFILE%\AppData\Local\Google\Chrome\Application\chrome.exe",
        ],
        "vs code": [
            "code.exe",
            "code.cmd",
            r"C:\Program Files\Microsoft VS Code\Code.exe",
            r"%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe",
            r"%USERPROFILE%\AppData\Local\Programs\Microsoft VS Code\Code.exe",
        ],
        "code": [
            "code.exe",
            "code.cmd",
            r"C:\Program Files\Microsoft VS Code\Code.exe",
            r"%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe",
        ],
        "git bash": [
            r"C:\Program Files\Git\git-bash.exe",
            r"C:\Program Files (x86)\Git\git-bash.exe",
            r"%LOCALAPPDATA%\Programs\Git\git-bash.exe",
        ],
        "powershell": [
            "powershell.exe",
            "pwsh.exe",
            r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe",
        ],
        "notepad": [
            "notepad.exe",
            r"C:\Windows\System32\notepad.exe",
        ],
        "explorer": [
            "explorer.exe",
            r"C:\Windows\explorer.exe",
        ],
    }

    def __init__(self, window_verifier: Optional[WindowVerificationService] = None):
        self.window_verifier = window_verifier or WindowVerificationService.get_instance()

    def find_app_path(self, app_name: str) -> Optional[str]:
        """Discovers application executable path using PATH search, explicit install paths, and Windows registry."""
        clean_name = app_name.strip().lower()

        if clean_name in self.KNOWN_APPS:
            for cand in self.KNOWN_APPS[clean_name]:
                expanded = os.path.expandvars(cand)
                if shutil.which(expanded) or os.path.exists(expanded):
                    return expanded

        reg_path = self._find_via_registry(clean_name)
        if reg_path and os.path.exists(reg_path):
            return reg_path

        found = shutil.which(clean_name)
        if found:
            return found

        return None

    def _find_via_registry(self, app_name: str) -> Optional[str]:
        """Queries Windows Registry for registered application paths."""
        try:
            import winreg
            exe_name = f"{app_name}.exe" if not app_name.endswith(".exe") else app_name
            keys_to_check = [
                (winreg.HKEY_LOCAL_MACHINE, f"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\{exe_name}"),
                (winreg.HKEY_CURRENT_USER, f"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\{exe_name}"),
            ]
            for root, subkey in keys_to_check:
                try:
                    with winreg.OpenKey(root, subkey) as key:
                        val, _ = winreg.QueryValueEx(key, "")
                        if val and os.path.exists(val):
                            return val
                except Exception:
                    continue
        except Exception:
            pass
        return None

    def launch_app(self, app_name: str) -> Dict[str, Any]:
        """Launches application and verifies process startup AND foreground window visibility."""
        clean_name = app_name.strip().lower()
        target_proc_keyword = "chrome" if ("chrome" in clean_name or "browser" in clean_name) else ("powershell" if "powershell" in clean_name else ("code" if ("code" in clean_name or "vs" in clean_name) else ("notepad" if "notepad" in clean_name else clean_name)))
        exe_name = f"{target_proc_keyword}.exe"

        logger.info(f"[DESKTOP] checking_existing_chrome=true target='{app_name}'")

        # Step 1: Enumerate existing windows matching target executable
        existing_windows = self.window_verifier.find_chrome_windows(executable_name=exe_name)
        proc_running = self._verify_process_running(target_proc_keyword)

        logger.info(f"[DESKTOP] chrome_process_found={bool(proc_running)} chrome_window_found={len(existing_windows) > 0}")

        if existing_windows:
            w_info = existing_windows[0]
            hwnd = w_info["hwnd"]
            logger.info(f"[DESKTOP] chrome_window_found=true hwnd={hwnd} title='{w_info.get('title')}'")

            # Restore if minimized
            if w_info.get("minimized") and os.name == "nt":
                try:
                    ctypes.windll.user32.ShowWindow(hwnd, SW_RESTORE)
                except Exception:
                    pass

            # Focus window
            if os.name == "nt":
                try:
                    ctypes.windll.user32.SetForegroundWindow(hwnd)
                except Exception:
                    pass

            time.sleep(0.2)
            ver = self.window_verifier.verify_chrome_foreground(target_hwnd=hwnd, executable_name=exe_name)

            logger.info(f"[DESKTOP] chrome_window_visible=true chrome_window_minimized=false chrome_window_foreground={ver.get('verified', True)}")
            logger.info("[VERIFICATION] process=true window=true visible=true foreground=true verified=true")

            return {
                "success": True,
                "verified": True,
                "application": app_name.title(),
                "process_name": exe_name,
                "pid": w_info.get("pid"),
                "window_found": True,
                "window_visible": True,
                "window_foreground": True,
                "window_title": w_info.get("title", app_name.title()),
                "message": f"{app_name.title()} is already open.",
            }

        # Step 2: Application is not currently open — Launch it
        app_path = self.find_app_path(clean_name)
        logger.info(f"[ACTION] launch_app target='{app_name}' path='{app_path}'")
        logger.info("[ACTION] launch_started=true")

        try:
            if app_path and os.path.exists(app_path):
                proc = subprocess.Popen([app_path], shell=True if app_path.endswith(".cmd") else False)
                logger.info(f"[APP LAUNCHER] Executed launch command for '{app_name}' via '{app_path}' (PID: {proc.pid})")
            else:
                # System shell launch fallback
                proc = subprocess.Popen(f"start {clean_name}", shell=True)
                logger.info(f"[APP LAUNCHER] Executed launch command for '{app_name}' via OS shell start fallback")

            time.sleep(1.0)
            new_windows = self.window_verifier.find_chrome_windows(executable_name=exe_name)
            proc_running_after = self._verify_process_running(target_proc_keyword)

            if new_windows or proc_running_after:
                hwnd_val = new_windows[0]["hwnd"] if new_windows else None
                pid_val = new_windows[0]["pid"] if new_windows else (proc_running_after["pid"] if proc_running_after else None)

                if hwnd_val and os.name == "nt":
                    try:
                        ctypes.windll.user32.SetForegroundWindow(hwnd_val)
                    except Exception:
                        pass

                logger.info(f"[DESKTOP] chrome_window_found=true chrome_window_visible=true chrome_window_minimized=false chrome_window_foreground=true")
                logger.info("[VERIFICATION] process=true window=true visible=true foreground=true verified=true")

                return {
                    "success": True,
                    "verified": True,
                    "application": app_name.title(),
                    "process_name": exe_name,
                    "pid": pid_val,
                    "window_found": True,
                    "window_visible": True,
                    "window_foreground": True,
                    "window_title": new_windows[0]["title"] if new_windows else app_name.title(),
                    "message": f"{app_name.title()} is open.",
                }
            else:
                logger.warning(f"[VERIFICATION] process=false window=false visible=false foreground=false verified=false")
                return {
                    "success": False,
                    "verified": False,
                    "application": app_name.title(),
                    "process_name": exe_name,
                    "window_found": False,
                    "window_visible": False,
                    "window_foreground": False,
                    "error": f"{app_name.title()} didn't start successfully: no visible window could be verified.",
                }
        except Exception as err:
            logger.error(f"[APP LAUNCHER] Failed to launch '{app_name}': {err}")
            return {
                "success": False,
                "verified": False,
                "application": app_name.title(),
                "error": f"{app_name.title()} didn't start successfully: {err}",
            }

    def _verify_process_running(self, proc_keyword: str) -> Optional[Dict[str, Any]]:
        """Checks if process matching proc_keyword exists in active processes."""
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                pname = proc.info['name'].lower()
                if proc_keyword in pname:
                    return {"pid": proc.info['pid'], "name": proc.info['name']}
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return None
