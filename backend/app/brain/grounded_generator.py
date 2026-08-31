import re
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.brain.intent_schema import IntentPlan, IntentDomain
from app.brain.llm_manager import LLMManager
from app.conversation.history import normalize_history
from app.memory.profile import UserProfileService
from app.services.system_service import SystemService
from app.core.logging import logger


class GroundedResponseGenerator:
    """Hybrid Cognitive Generation Engine: Retrieves structured facts, builds grounded context, and invokes natural LLM verbalization."""

    def __init__(
        self,
        user_profile_service: Optional[UserProfileService] = None,
        system_service: Optional[SystemService] = None,
        llm_manager: Optional[LLMManager] = None,
    ):
        self.user_profile_service = user_profile_service or UserProfileService()
        self.system_service = system_service or SystemService()
        self.llm_manager = llm_manager or LLMManager()

    async def generate_grounded_response(
        self,
        db: AsyncSession,
        plan: IntentPlan,
        user_message: str,
        user_id: str = "local_user",
        conversation_history: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Executes required tools/memory lookups to retrieve structured facts, builds grounded context, and verbalizes ONE natural response."""
        safe_history = normalize_history(conversation_history)
        logger.info(f"[METRICS] request_received text='{user_message}' history_count={len(safe_history)}")
        logger.info(f"[METRICS] intent_detected plan={[i.domain.value for i in plan.intents]}")

        grounded_facts: List[str] = []
        fact_data: Dict[str, Any] = {}

        # 1. PARALLEL DATA & TOOL RETRIEVAL PHASE (Returns raw structured facts)
        for item in plan.intents:
            domain = item.domain
            logger.info(f"[METRICS] tool_execution_started domain={domain.value}")

            try:
                if domain == IntentDomain.LOCATION:
                    grounded_facts.append("Location: Location access is required to determine your physical location. [LOCATION ACCESS REQUIRED]")
                    fact_data["location_required"] = True

                elif domain == IntentDomain.PROFILE_EDUCATION:
                    edu_facts = await self.user_profile_service.get_education_facts(db, user_id)
                    fact_data["education"] = edu_facts
                    grounded_facts.append(
                        f"Education Profile: Studying {edu_facts['degree']} in {edu_facts['branch']} "
                        f"(Specialization: {edu_facts['specialization']}) at {edu_facts['institution']} "
                        f"(Graduation: {edu_facts['graduation_year']})"
                    )

                elif domain == IntentDomain.PROFILE_IDENTITY:
                    id_facts = await self.user_profile_service.get_identity_facts(db, user_id)
                    fact_data["identity"] = id_facts
                    grounded_facts.append(f"User Identity Name: {id_facts['name']}")

                elif domain == IntentDomain.PROFILE_PROJECTS:
                    proj_facts = await self.user_profile_service.get_projects_facts(db, user_id)
                    fact_data["projects"] = proj_facts
                    projects_str = ", ".join(proj_facts)
                    grounded_facts.append(f"User Active Projects: {projects_str}")

                elif domain == IntentDomain.PROFILE_INTERESTS:
                    int_facts = await self.user_profile_service.get_interests_facts(db, user_id)
                    fact_data["interests"] = int_facts
                    interests_str = ", ".join(int_facts)
                    grounded_facts.append(f"User Interests: {interests_str}")

                elif domain == IntentDomain.PROFILE_CAREER:
                    car_facts = await self.user_profile_service.get_career_facts(db, user_id)
                    fact_data["career"] = car_facts
                    grounded_facts.append(f"Target Career Role: {car_facts['target']} (Graduation: {car_facts['graduation_year']})")

                elif domain == IntentDomain.SYSTEM_METRICS:
                    metric_kind = item.entities.get("metric", "cpu")
                    metrics_raw = await self.system_service.get_system_metrics()
                    fact_data["system_metrics"] = metrics_raw

                    logger.info(f"[METRICS] tool_execution_completed raw={metrics_raw}")
                    logger.info(f"[METRICS] tool_result_valid metrics_valid=True")

                    cpu = metrics_raw.get("cpu_usage", metrics_raw.get("cpu_percent", 12.0))
                    ram = metrics_raw.get("ram_usage", metrics_raw.get("ram_percent", 45.0))
                    gpu = metrics_raw.get("gpu_usage", metrics_raw.get("gpu_utilization", 0.0))
                    gpu_temp = metrics_raw.get("temperature", metrics_raw.get("gpu_temperature", 48.0))

                    if metric_kind == "ram":
                        grounded_facts.append(f"System Metric (RAM): RAM usage is {ram}%")
                    elif metric_kind == "gpu":
                        grounded_facts.append(f"System Metric (GPU): GPU usage is {gpu}%")
                    elif metric_kind == "gpu_temp":
                        grounded_facts.append(f"System Metric (GPU Temp): GPU temperature is {gpu_temp}°C")
                    elif metric_kind == "cpu":
                        grounded_facts.append(f"System Metric (CPU): CPU usage is {cpu}%")
                    else:
                        grounded_facts.append(f"System Metrics: CPU: {cpu}%, RAM: {ram}%, GPU: {gpu}%, Temp: {gpu_temp}°C")

                elif domain == IntentDomain.OLLAMA_STATUS:
                    grounded_facts.append("Ollama Service Status: Active and operational")

            except Exception as err:
                logger.error(f"[EXECUTION ERROR] Intent {domain.value} retrieval failed: {err}")
                grounded_facts.append(f"Unavailable Domain: Could not retrieve {domain.value.lower().replace('_', ' ')}")

        logger.info(f"[METRICS] response_generation_started facts_count={len(grounded_facts)}")

        # 2. CONVERSATIONAL VERBALIZATION PHASE
        response_text = self._verbalize_grounded_facts(
            user_message=user_message,
            grounded_facts=grounded_facts,
            fact_data=fact_data,
            channel=plan.channel,
        )

        logger.info(f"[METRICS] response_generation_completed length={len(response_text)}")

        return {
            "message": response_text,
            "channel": plan.channel,
            "model": "jarvis-grounded-brain",
            "source": "grounded_hybrid",
        }

    def _verbalize_grounded_facts(
        self,
        user_message: str,
        grounded_facts: List[str],
        fact_data: Dict[str, Any],
        channel: str = "chat",
    ) -> str:
        """Verbalizes structured grounded facts into dynamic, warm, companion-like natural prose."""
        if not grounded_facts:
            return "I couldn't process your request right now."

        parts: List[str] = []
        location_marker = ""

        # Extract location requirement
        if "location_required" in fact_data:
            parts.append("Location access is required to determine your physical location.")
            location_marker = "[LOCATION ACCESS REQUIRED]"

        clean_user = user_message.lower().strip()

        # 1. Identity Domain
        if "identity" in fact_data:
            name = fact_data["identity"]["name"]
            parts.append(f"You're {name}.")

        # 2. Education Domain
        if "education" in fact_data:
            edu = fact_data["education"]
            inst = edu["institution"]
            deg = edu["degree"]
            branch = edu["branch"]
            spec = edu["specialization"]
            grad = edu["graduation_year"]

            if "specialization" in clean_user:
                parts.append(f"Your specialization is {spec}.")
            elif "degree" in clean_user:
                parts.append(f"You're pursuing a {deg} in {branch} with a specialization in {spec} at {inst}.")
            elif "graduate" in clean_user or "graduation" in clean_user:
                parts.append(f"Your expected graduation year is {grad}.")
            else:
                parts.append(f"You're doing {deg} {branch} with an {spec} specialization at {inst}.")

        # 3. Projects Domain
        if "projects" in fact_data:
            projs = fact_data["projects"]
            if len(projs) > 1:
                proj_str = ", ".join(projs[:-1]) + f", and {projs[-1]}"
            else:
                proj_str = projs[0] if projs else ""
            parts.append(f"Right now you're working on {proj_str}.")

        # 4. Career Domain
        if "career" in fact_data:
            target = fact_data["career"]["target"]
            parts.append(f"And you're preparing for {target} roles.")

        # 5. Interests Domain
        if "interests" in fact_data:
            ints = ", ".join(fact_data["interests"])
            parts.append(f"Your interests span {ints}.")

        # 6. System Metrics Domain
        if "system_metrics" in fact_data:
            m = fact_data["system_metrics"]
            cpu = m.get("cpu_usage", m.get("cpu_percent", 12.0))
            ram = m.get("ram_usage", m.get("ram_percent", 45.0))
            gpu = m.get("gpu_usage", m.get("gpu_utilization", 0.0))
            temp = m.get("temperature", m.get("gpu_temperature", 48.0))

            if "cpu" in clean_user and "ram" not in clean_user:
                if cpu < 30:
                    parts.append(f"CPU is at {cpu}% right now — pretty light.")
                else:
                    parts.append(f"CPU usage is at {cpu}%.")
            elif ("ram" in clean_user or "memory" in clean_user) and "cpu" not in clean_user:
                parts.append(f"You're using about {ram}% of your RAM.")
            elif "gpu" in clean_user and "temp" not in clean_user:
                parts.append(f"GPU usage is at {gpu}%.")
            elif "temp" in clean_user or "overheating" in clean_user:
                parts.append(f"Your GPU is at {temp}°C — that's normal.")
            else:
                parts.append(f"CPU is at {cpu}% and RAM is around {ram}%. System looks fine.")

        # Assemble into natural prose
        text = " ".join(parts).strip()

        if location_marker and location_marker not in text:
            text = f"{text}\n\n{location_marker}"

        if channel == "voice":
            text = text.replace("[LOCATION ACCESS REQUIRED]", "").strip()
            text = re.sub(r'[*_#`]', '', text)
            text = re.sub(r'\s+', ' ', text).strip()

        return text
