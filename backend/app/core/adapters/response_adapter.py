from typing import Optional
from app.core.contracts import JarvisResponse, ResponseType, ExecutionResult, VerificationResult
from app.schemas.chat import ChatResponse


class ResponseAdapter:
    """Adapter to convert between legacy/API response schemas and canonical JarvisResponse objects."""

    @staticmethod
    def from_chat_response(
        chat_res: ChatResponse,
        request_id: str,
        turn_id: str,
    ) -> JarvisResponse:
        return JarvisResponse(
            request_id=request_id,
            turn_id=turn_id,
            message=chat_res.message,
            response_type=ResponseType.TEXT,
            should_display=True,
            metadata={"model": chat_res.model, "conversation_id": chat_res.conversation_id},
        )

    @staticmethod
    def to_chat_response(jarvis_res: JarvisResponse) -> ChatResponse:
        conv_id = jarvis_res.metadata.get("conversation_id") or "default-conversation"
        model_name = jarvis_res.metadata.get("model") or "qwen3-test:latest"
        return ChatResponse(
            conversation_id=conv_id,
            message=jarvis_res.message,
            model=model_name,
        )

    @staticmethod
    def from_command_response(
        message: str,
        request_id: str,
        turn_id: str,
        execution_res: Optional[ExecutionResult] = None,
        verification_res: Optional[VerificationResult] = None,
        should_speak: bool = False,
    ) -> JarvisResponse:
        return JarvisResponse(
            request_id=request_id,
            turn_id=turn_id,
            message=message,
            response_type=ResponseType.ACTION if execution_res else ResponseType.TEXT,
            execution_result=execution_res,
            verification_result=verification_res,
            should_speak=should_speak,
            should_display=True,
        )
