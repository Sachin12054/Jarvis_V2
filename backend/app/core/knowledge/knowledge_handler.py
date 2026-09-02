import asyncio
from typing import Optional, Dict, Any, List, Protocol
from app.core.logging import logger
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    JarvisResponse,
    ResponseType,
)


class LLMProviderPort(Protocol):
    """Abstract port interface for LLM text generation."""
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        timeout: Optional[float] = None,
    ) -> str:
        ...


class KnowledgeHandler:
    """Core Knowledge Execution Handler.

    Coordinates knowledge queries through an abstract LLMProviderPort boundary
    with support for fallback model execution.
    """

    def __init__(self, llm_provider: Optional[LLMProviderPort] = None):
        self._provider = llm_provider

    @property
    def provider(self) -> Optional[LLMProviderPort]:
        if self._provider is None:
            try:
                from app.brain.llm_manager import OllamaLLMProvider
                self._provider = OllamaLLMProvider()
            except Exception:
                self._provider = None
        return self._provider

    async def handle_knowledge_query(
        self,
        request: JarvisRequest,
        understanding: UnderstandingResult,
        decision: DecisionResult,
        cancel_event: Optional[asyncio.Event] = None,
    ) -> JarvisResponse:
        """Executes a KNOWLEDGE_QUERY request with fallback model retries."""
        if cancel_event and cancel_event.is_set():
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message="Knowledge query cancelled by user.",
                response_type=ResponseType.TEXT,
                should_speak=False,
                metadata={"cancelled": True},
            )

        if not self.provider:
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message="Knowledge LLM Provider is not available.",
                response_type=ResponseType.ERROR,
                error="LLM_PROVIDER_UNAVAILABLE",
            )

        query_text = (
            understanding.entities.get("query")
            or request.normalized_input
            or request.raw_input
        )

        messages = [
            {"role": "system", "content": "You are JARVIS, a helpful AI assistant. Be concise, precise, and direct. Do NOT output internal chain-of-thought or thinking text."},
            {"role": "user", "content": query_text},
        ]

        # Determine target model and fallback candidates
        primary_model = decision.selected_model or "qwen3-test:latest"
        models_to_try = [primary_model]
        if getattr(decision, "fallbacks", None):
            for fb in decision.fallbacks:
                if fb not in models_to_try:
                    models_to_try.append(fb)

        # Enforce maximum fallback attempt limit (Max 2 retries = 3 total attempts)
        models_to_try = models_to_try[:3]

        last_error = None
        response_text = ""
        used_model = primary_model
        fallback_used = False

        for idx, target_model in enumerate(models_to_try):
            try:
                response_text = await self.provider.generate_response(
                    messages=messages,
                    model=target_model,
                )
                used_model = target_model
                if idx > 0:
                    fallback_used = True
                    logger.info(f"[KnowledgeHandler Fallback Success] Successfully completed query using fallback '{target_model}'")
                last_error = None
                break
            except Exception as exc:
                last_error = exc
                logger.warning(
                    f"[KnowledgeHandler Fallback Attempt] Model '{target_model}' failed ({type(exc).__name__}: {exc}). "
                    f"Attempts left: {len(models_to_try) - idx - 1}"
                )

        if last_error is not None:
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=f"Failed to generate knowledge response: {str(last_error)}",
                response_type=ResponseType.ERROR,
                error=str(last_error),
                metadata={"model": primary_model, "attempted_models": models_to_try},
            )

        if cancel_event and cancel_event.is_set():
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message="Knowledge query cancelled during generation.",
                response_type=ResponseType.TEXT,
                should_speak=False,
                metadata={"cancelled": True},
            )

        return JarvisResponse(
            request_id=request.request_id,
            turn_id=request.turn_id,
            message=response_text,
            response_type=ResponseType.TEXT,
            should_speak=request.input_channel.value == "voice",
            should_display=True,
            metadata={"model": used_model, "query": query_text, "fallback_used": fallback_used},
        )
