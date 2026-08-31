import re
from typing import Dict, Any, List, Optional
from app.core.logging import logger


class AgentReasoningEngine:
    """Evaluates tool observations, performs bottleneck diagnosis, screen understanding, and resolves contextual references."""

    def evaluate_observations(
        self,
        user_message: str,
        observations: List[Dict[str, Any]],
        profile_facts: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Evaluates hardware observations, screen captures, and facts to produce reasoned insights."""
        clean = user_message.strip().lower()
        insights: Dict[str, Any] = {}

        for obs in observations:
            tool_name = obs.get("tool")
            success = obs.get("success", False)
            data = obs.get("data", {})

            # 1. Screen Observation Evaluation
            if tool_name == "inspect_screen" and success:
                app_name = data.get("application", "Active Window")
                win_title = data.get("window_title", "Desktop")
                visible_text = data.get("visible_text", "")
                errors = data.get("errors", [])

                if "what" in clean and ("screen" in clean or "application" in clean or "window" in clean):
                    insights["diagnosis"] = f"You're currently using {app_name} ({win_title})."

                if "why" in clean or "backend" in clean or "error" in clean:
                    if "address already in use" in visible_text.lower() or any("address already in use" in e.lower() for e in errors):
                        insights["diagnosis"] = "Port 8000 is already occupied by another process."
                    elif errors:
                        insights["diagnosis"] = f"Screen shows an error in {app_name}: {errors[0]}."

            # 2. Performance Bottleneck Diagnosis
            if tool_name == "system_metrics" and success:
                cpu = data.get("cpu_usage", data.get("cpu_percent", 12.0))
                ram = data.get("ram_usage", data.get("ram_percent", 45.0))

                if "slow" in clean or "bottleneck" in clean or "heavy load" in clean:
                    if ram > 80.0 and cpu < 40.0:
                        insights["diagnosis"] = f"Your RAM is currently around {int(ram)}%, while CPU is only {int(cpu)}%. RAM looks like the main bottleneck."
                        insights["recommendation"] = "Want me to check what's using it?"
                    elif cpu > 75.0:
                        insights["diagnosis"] = f"CPU usage is high at {int(cpu)}%, which might be causing slowdowns."
                    else:
                        insights["diagnosis"] = f"System load looks normal. CPU is at {int(cpu)}% and RAM is at {int(ram)}%."

        # 3. Project Contextual Resolution ("the bioinformatics one")
        if "bioinformatics" in clean:
            insights["resolved_project"] = "GeneCopilot AI (Bioinformatics & Genomic Copilot)"
        elif "interview" in clean:
            insights["resolved_project"] = "InterviewSense AI (AI Mock Interview & Assessment Platform)"

        logger.info(f"[REASONING ENGINE] Evaluated {len(observations)} observations with insights={list(insights.keys())}")
        return insights
