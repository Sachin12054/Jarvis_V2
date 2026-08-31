from enum import Enum
from typing import Dict, Any, Optional
from app.core.logging import logger


class OSPermissionLevel(str, Enum):
    SAFE = "safe"           # Read-only operations (list processes, inspect windows, read screen)
    CONFIRM = "confirm"     # Interactive operations (launch app, execute terminal script, edit file, stop process)
    RESTRICTED = "restricted" # Sensitive operations (credentials, system registry, raw security bypass)


class OSPermissionGuard:
    """Enforces permission boundaries for OS application control and terminal execution."""

    @staticmethod
    def validate_action(action_name: str, level: OSPermissionLevel, user_confirmed: bool = False) -> bool:
        """Validates whether an OS action is allowed based on permission level and user confirmation state."""
        if level == OSPermissionLevel.RESTRICTED:
            logger.warning(f"[OS GUARD] Blocked restricted action '{action_name}'. Dangerous OS operation not permitted.")
            return False

        if level == OSPermissionLevel.CONFIRM and not user_confirmed:
            logger.info(f"[OS GUARD] Action '{action_name}' requires explicit user confirmation.")
            return False

        return True
