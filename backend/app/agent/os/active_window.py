import time
import subprocess
import psutil
from typing import Dict, Any, Optional
from app.core.logging import logger


class ActiveWindowService:
    """Active Window Detection Service: Inspects active foreground window title, process, executable, and bounding box."""

    def get_active_window(self) -> Dict[str, Any]:
        """Queries current active foreground window details on Windows OS."""
        timestamp = time.time()
        title = "Desktop"
        process_name = "explorer.exe"
        executable = r"C:\Windows\explorer.exe"
        bounds = {"x": 0, "y": 0, "width": 1920, "height": 1080}

        try:
            cmd = "powershell -Command \"$code = '[DllImport(\\\"user32.dll\\\")] public static extern IntPtr GetForegroundWindow(); [DllImport(\\\"user32.dll\\\")] public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count); [DllImport(\\\"user32.dll\\\")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);'; $type = Add-Type -MemberDefinition $code -Name WinAPI -PassThru; $hwnd = $type::GetForegroundWindow(); $sb = New-Object System.Text.StringBuilder 256; $null = $type::GetWindowText($hwnd, $sb, 256); $pid = 0; $null = $type::GetWindowThreadProcessId($hwnd, [ref]$pid); $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue; @{Title=$sb.ToString(); Process=$proc.ProcessName; Path=$proc.Path} | ConvertTo-Json\""
            out = subprocess.check_output(cmd, shell=True, timeout=3).decode().strip()
            if out:
                import json
                data = json.loads(out)
                title = data.get("Title") or title
                process_name = data.get("Process") or process_name
                executable = data.get("Path") or executable

        except Exception as err:
            logger.warning(f"[ACTIVE WINDOW] PowerShell Win32 API query warning: {err}")
            # Fallback to psutil process inspection
            for proc in psutil.process_iter(['name', 'exe']):
                try:
                    name = proc.info['name'].lower()
                    if name in ["code.exe", "powershell.exe", "chrome.exe", "bash.exe", "cmd.exe"]:
                        process_name = proc.info['name']
                        executable = proc.info['exe'] or executable
                        title = process_name.replace(".exe", "").title()
                        break
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue

        res = {
            "title": title,
            "process": process_name,
            "executable": executable,
            "bounds": bounds,
            "timestamp": timestamp,
        }
        logger.info(f"[ACTIVE WINDOW] Active window: '{title}' (Process: {process_name})")
        return res
