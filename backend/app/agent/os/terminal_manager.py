import os
import shutil
import subprocess
from typing import Dict, Any, Optional
from app.core.logging import logger


class TerminalManager:
    """Manages controlled terminal execution (PowerShell / Git Bash / CMD) with stdout/stderr capture and timeout protection."""

    def execute_command(self, command: str, shell_type: str = "powershell", timeout: int = 15) -> Dict[str, Any]:
        """Executes a command safely in specified shell."""
        logger.info(f"[TERMINAL MANAGER] Executing command in {shell_type}: '{command}'")

        ps_path = shutil.which("powershell.exe") or shutil.which("powershell") or r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"

        try:
            if shell_type.lower() == "powershell" and os.path.exists(ps_path):
                cmd = [ps_path, "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command]
            elif shell_type.lower() in ["gitbash", "bash"] and shutil.which("bash"):
                cmd = ["bash", "-c", command]
            else:
                cmd = ["cmd.exe", "/c", command]

            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout,
            )

            stdout = proc.stdout.strip()
            stderr = proc.stderr.strip()
            exit_code = proc.returncode

            logger.info(f"[TERMINAL MANAGER] Command completed with exit code {exit_code}")
            return {
                "success": exit_code == 0,
                "command": command,
                "shell": shell_type,
                "exit_code": exit_code,
                "stdout": stdout,
                "stderr": stderr,
            }
        except subprocess.TimeoutExpired:
            logger.warning(f"[TERMINAL MANAGER] Command timed out after {timeout}s: '{command}'")
            return {
                "success": False,
                "command": command,
                "shell": shell_type,
                "error": f"Command execution timed out after {timeout} seconds.",
            }
        except Exception as err:
            logger.error(f"[TERMINAL MANAGER] Execution error: {err}")
            return {
                "success": False,
                "command": command,
                "shell": shell_type,
                "error": str(err),
            }
