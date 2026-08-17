from typing import List, Dict, Any, Optional
from app.brain.context_manager import ContextManager
from app.brain.llm_manager import LLMManager
from app.brain.model_router import ModelRouter
from app.core.config import settings
from app.core.logging import logger


class JARVISOrchestrator:
    """Central Orchestrator runtime for JARVIS Brain.

    Routes user messages, manages context preparation, triggers LLM reasoning,
    and provides extension hooks for future Tool Registry and Permission Manager.
    """

    def __init__(
        self,
        context_manager: Optional[ContextManager] = None,
        llm_manager: Optional[LLMManager] = None,
        model_router: Optional[ModelRouter] = None,
    ):
        self.context_manager = context_manager or ContextManager()
        self.llm_manager = llm_manager or LLMManager()
        self.model_router = model_router or ModelRouter()

    async def process_turn(
        self,
        user_message: str,
        history: List[Dict[str, Any]],
        model: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Executes a single dialogue turn through context assembly, intelligent routing, and LLM reasoning."""
        logger.info("[JARVISOrchestrator] Processing turn...")

        # 1. Prepare formatted context including system prompt
        formatted_messages = self.context_manager.prepare_messages(
            history=history,
            new_user_message=user_message,
        )

        # 2. Extension Point Hook: Future Tool Selection & Planning
        # In future versions:
        # tool_plan = await self.tool_registry.plan_tools(formatted_messages)
        # if tool_plan: await self.permission_manager.check_and_execute(tool_plan)

        # 3. Determine active model (Explicit caller override > ModelRouter > Settings default)
        if model:
            active_model = model
        elif settings.LLM_PROVIDER == "ollama":
            routing_result = self.model_router.route(user_message)
            active_model = routing_result.model
        else:
            active_model = settings.LLM_MODEL

        response_text = await self.llm_manager.generate(
            messages=formatted_messages,
            model=active_model,
        )

        logger.info(f"[JARVISOrchestrator] Response generated via model '{active_model}'.")

        return {
            "response": response_text,
            "model": active_model,
        }
