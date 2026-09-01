import asyncio
from typing import List, Dict, Any, Optional, AsyncGenerator
from app.brain.context_manager import ContextManager
from app.brain.llm_manager import LLMManager
from app.brain.model_router import ModelRouter
from app.conversation.history import normalize_history
from app.core.config import settings
from app.core.logging import logger


class JARVISOrchestrator:
    """DEPRECATED COMPONENT: JARVISOrchestrator is preserved for backward-compatibility test suites.
    The canonical runtime entry point is JarvisCoreOrchestrator in backend/app/core/orchestrator.py.
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
        history: Optional[List[Dict[str, Any]]] = None,
        model: Optional[str] = None,
        memory_context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Executes a single dialogue turn through context assembly, intelligent routing, and LLM reasoning."""
        safe_history = normalize_history(history)
        logger.info(f"[JARVISOrchestrator] Processing turn history_count={len(safe_history)}...")

        # 1. Prepare formatted context including system prompt and relevant memory context
        formatted_messages = self.context_manager.prepare_messages(
            history=safe_history,
            new_user_message=user_message,
            memory_context=memory_context,
        )

        # 2. Determine active model (Explicit caller override > ModelRouter > Settings default)
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

    async def process_turn_stream(
        self,
        user_message: str,
        history: Optional[List[Dict[str, Any]]] = None,
        model: Optional[str] = None,
        memory_context: Optional[str] = None,
        cancel_event: Optional[asyncio.Event] = None,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Executes a single dialogue turn streaming responses chunk by chunk."""
        safe_history = normalize_history(history)
        logger.info(f"[JARVISOrchestrator] Processing streaming turn history_count={len(safe_history)}...")

        formatted_messages = self.context_manager.prepare_messages(
            history=safe_history,
            new_user_message=user_message,
            memory_context=memory_context,
        )

        if model:
            active_model = model
        elif settings.LLM_PROVIDER == "ollama":
            routing_result = self.model_router.route(user_message)
            active_model = routing_result.model
        else:
            active_model = settings.LLM_MODEL

        async for chunk in self.llm_manager.generate_stream(
            messages=formatted_messages,
            model=active_model,
            cancel_event=cancel_event,
        ):
            yield {
                "chunk": chunk,
                "model": active_model,
            }
