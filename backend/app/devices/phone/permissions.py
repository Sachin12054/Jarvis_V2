from enum import Enum
from typing import Dict, Any, Optional
from app.core.logging import logger


class PhonePermissionLevel(str, Enum):
    SAFE = "safe"           # Read-only device status, battery level, connection state
    CONFIRM = "confirm"     # Sending notification, file transfer, launching approved mobile app
    RESTRICTED = "restricted" # Unlocking device, accessing raw auth tokens, SMS interception without explicit consent


class PhonePermissionGuard:
    """Enforces permission boundaries for phone device interaction."""

    @staticmethod
    def validate_phone_action(action_name: str, level: PhonePermissionLevel, user_confirmed: bool = False) -> bool:
        """Validates whether a phone action is permitted based on level and user confirmation."""
        if level == PhonePermissionLevel.RESTRICTED:
            logger.warning(f"[PHONE GUARD] Blocked restricted phone action '{action_name}'. Authentication bypass strictly forbidden.")
            return False

        if level == PhonePermissionLevel.CONFIRM and not user_confirmed:
            logger.info(f"[PHONE GUARD] Phone action '{action_name}' requires user confirmation.")
            return False

        return True
