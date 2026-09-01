import asyncio
from typing import Optional, Dict, Any, List, Protocol
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

    Coordinates knowledge queries through an abstract LLMProviderPort boundary.
    Contains zero direct infrastructure dependencies (no Ollama, FastAPI, CUA Driver).
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
        """Executes a KNOWLEDGE_QUERY request and returns a canonical JarvisResponse."""
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
            {"role": "system", "content": "You are JARVIS, a helpful AI assistant. Be concise, precise, and direct."},
            {"role": "user", "content": query_text},
        ]

        target_model = decision.selected_model or "qwen3-test:latest"

        try:
            response_text = await self.provider.generate_response(
                messages=messages,
                model=target_model,
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
                metadata={"model": target_model, "query": query_text},
            )
        except Exception as exc:
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=f"Failed to generate knowledge response: {str(exc)}",
                response_type=ResponseType.ERROR,
                error=str(exc),
                metadata={"model": target_model},
            )
