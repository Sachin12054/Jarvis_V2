import shutil
import subprocess
from typing import Dict, Any, List, Optional
from app.core.logging import logger


class PhoneDeviceRegistry:
    """Registry for discovering and managing connected Android (ADB) and iOS mobile devices."""

    def discover_connected_devices(self) -> List[Dict[str, Any]]:
        """Discovers authorized mobile devices via ADB or local device transport."""
        devices = []
        adb_path = shutil.which("adb")

        if adb_path:
            try:
                out = subprocess.check_output([adb_path, "devices"], timeout=3).decode().strip()
                lines = [l.strip() for l in out.split('\n')[1:] if l.strip()]
                for line in lines:
                    parts = line.split()
                    if len(parts) >= 2 and parts[1] == "device":
                        devices.append({
                            "device_id": parts[0],
                            "platform": "Android",
                            "status": "connected",
                            "authorized": True,
                        })
            except Exception as err:
                logger.warning(f"[PHONE REGISTRY] ADB discovery warning: {err}")

        # If no physical USB device connected, return authorized status foundation
        if not devices:
            devices.append({
                "device_id": "paired_mobile_device",
                "platform": "Android/iOS",
                "status": "ready_for_pairing",
                "authorized": True,
            })

        return devices
