import time
from typing import Dict, Any, List, Optional
from app.core.logging import logger


class AgentReflectionEngine:
    """Produces structured internal task reflections without exposing chain-of-thought to the user."""

    def reflect_on_turn(
        self,
        user_message: str,
        observations: List[Dict[str, Any]],
        response_text: str,
        success: bool = True,
    ) -> Dict[str, Any]:
        """Creates a compact internal reflection object to log turn outcomes and identify reusable skills."""
        tools_used = [o.get("tool") for o in observations if o.get("tool")]

        reflection = {
            "timestamp": time.time(),
            "task_success": success,
            "tools_used": tools_used,
            "observation_count": len(observations),
            "response_length": len(response_text),
            "reusable_skill_candidate": None,
        }

        clean = user_message.lower()

        # Identify workflow patterns for skill candidates
        if "laptop" in clean and "slow" in clean:
            reflection["reusable_skill_candidate"] = "diagnose_laptop_performance"
        elif "run" in clean and "jarvis" in clean:
            reflection["reusable_skill_candidate"] = "start_jarvis_environment"

        logger.info(f"[REFLECTION] Turn outcome success={success} tools={tools_used} skill_candidate={reflection['reusable_skill_candidate']}")
        return reflection
