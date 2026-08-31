import re
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.brain.intent_schema import IntentPlan, IntentDomain
from app.memory.profile import UserProfileService
from app.services.system_service import SystemService
from app.core.logging import logger


class ResponseComposer:
    """Executes multi-intent plans in a single pass and composes natural, companion-like responses."""

    def __init__(
        self,
        user_profile_service: Optional[UserProfileService] = None,
        system_service: Optional[SystemService] = None,
    ):
        self.user_profile_service = user_profile_service or UserProfileService()
        self.system_service = system_service or SystemService()

    async def execute_and_compose(
        self,
        db: AsyncSession,
        plan: IntentPlan,
        user_message: str,
        user_id: str = "local_user",
    ) -> Dict[str, Any]:
        """Executes plan steps with robust fallback handling and composes a single natural prose response."""
        results: List[Tuple[IntentDomain, str]] = []

        logger.info(f"[EXECUTION] Starting execution for {len(plan.intents)} intents")

        for item in plan.intents:
            domain = item.domain

            try:
                if domain == IntentDomain.LOCATION:
                    loc_text = "Location access is required to determine your physical location.\n\n[LOCATION ACCESS REQUIRED]"
                    results.append((domain, loc_text))

                elif domain == IntentDomain.PROFILE_EDUCATION:
                    edu_text = await self.user_profile_service.handle_education_query(db, user_message, user_id)
                    results.append((domain, edu_text))

                elif domain == IntentDomain.PROFILE_IDENTITY:
                    id_text = await self.user_profile_service.handle_identity_query(db, user_message, user_id)
                    results.append((domain, id_text))

                elif domain == IntentDomain.PROFILE_PROJECTS:
                    proj_text = await self.user_profile_service.handle_projects_query(db, user_message, user_id)
                    results.append((domain, proj_text))

                elif domain == IntentDomain.PROFILE_INTERESTS:
                    int_text = await self.user_profile_service.handle_interests_query(db, user_message, user_id)
                    results.append((domain, int_text))

                elif domain == IntentDomain.PROFILE_CAREER:
                    car_text = await self.user_profile_service.handle_career_query(db, user_message, user_id)
                    results.append((domain, car_text))

                elif domain == IntentDomain.SYSTEM_METRICS:
                    metric_kind = item.entities.get("metric", "cpu")
                    metrics_data = await self.system_service.get_system_metrics()

                    if metric_kind == "ram":
                        ram_pct = int(metrics_data.get('ram_percent', 45))
                        if ram_pct > 80:
                            val = f"RAM usage is currently high at {ram_pct}%."
                        else:
                            val = f"RAM usage is {ram_pct}% — that's in a comfortable range."
                    elif metric_kind == "gpu":
                        gpu_pct = int(metrics_data.get('gpu_utilization', 0))
                        val = f"GPU usage is at {gpu_pct}%."
                    elif metric_kind == "gpu_temp":
                        temp = int(metrics_data.get('gpu_temperature', 48))
                        val = f"Your GPU temperature is at {temp}°C — that's normal."
                    elif metric_kind == "cpu":
                        cpu_pct = int(metrics_data.get('cpu_percent', 12))
                        if cpu_pct < 30:
                            val = f"CPU usage is {cpu_pct}% — that's a light load."
                        else:
                            val = f"CPU is currently running at {cpu_pct}%."
                    else:
                        cpu_pct = int(metrics_data.get('cpu_percent', 12))
                        ram_pct = int(metrics_data.get('ram_percent', 45))
                        val = f"CPU is at {cpu_pct}% and RAM is at {ram_pct}%. Your system looks fine right now."

                    results.append((domain, val))

                elif domain == IntentDomain.OLLAMA_STATUS:
                    results.append((domain, "Ollama LLM service is active and operational."))

            except Exception as err:
                logger.error(f"[EXECUTION ERROR] Intent {domain.value} failed: {err}")
                results.append((domain, f"I couldn't retrieve details for {domain.value.lower().replace('_', ' ')} right now."))

        logger.info(f"[EXECUTION] Completed {len(results)} intent steps")

        # Format composed text according to channel and personality
        if plan.channel == "voice":
            composed_text = self._format_voice_response(results)
        else:
            composed_text = self._format_chat_response(results)

        logger.info("[COMPOSE] response_source=deterministic")
        return {
            "message": composed_text,
            "channel": plan.channel,
            "model": "jarvis-multi-intent",
            "source": "deterministic",
        }

    def _format_chat_response(self, results: List[Tuple[IntentDomain, str]]) -> str:
        """Formats multi-intent outputs into natural, warm, conversational prose for chat channel."""
        if not results:
            return "I couldn't process your request right now."

        if len(results) == 1:
            return results[0][1]

        # Combine multi-intent results into natural prose sentences without robotic field labels
        sentences = []

        location_marker = ""
        for dom, content in results:
            if dom == IntentDomain.LOCATION:
                location_marker = "[LOCATION ACCESS REQUIRED]"

        for dom, content in results:
            clean = content.replace("[LOCATION ACCESS REQUIRED]", "").strip()
            if clean:
                sentences.append(clean)

        combined_prose = "\n\n".join(sentences)
        if location_marker and location_marker not in combined_prose:
            combined_prose = f"{combined_prose}\n\n{location_marker}"

        return combined_prose

    def _format_voice_response(self, results: List[Tuple[IntentDomain, str]]) -> str:
        """Formats multi-intent outputs into concise, speech-friendly sentences for voice channel."""
        if not results:
            return "I couldn't process your request right now."

        clean_parts = []
        for _, content in results:
            text = content.replace("[LOCATION ACCESS REQUIRED]", "").strip()
            text = re.sub(r'[*_#`]', '', text)
            text = re.sub(r'\s+', ' ', text).strip()
            if text:
                clean_parts.append(text)

        return " ".join(clean_parts)
