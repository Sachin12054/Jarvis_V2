import asyncio
import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging import logger
from app.database.session import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.common import ErrorResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/api/v1", tags=["Chat"])


def get_chat_service() -> ChatService:
    return ChatService()


SSE_HEADERS = {
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
}


async def _generate_sse_stream(
    db: AsyncSession,
    request: ChatRequest,
    chat_service: ChatService,
):
    last_conv_id = None
    last_model = None

    try:
        async for data in chat_service.handle_chat_request_stream(
            db=db,
            user_message=request.message,
            conversation_id=request.conversation_id,
        ):
            last_conv_id = data["conversation_id"]
            last_model = data["model"]
            payload = json.dumps({
                "conversation_id": last_conv_id,
                "chunk": data["chunk"],
                "model": last_model,
            })
            yield f"data: {payload}\n\n"

        done_payload = json.dumps({
            "done": True,
            "conversation_id": last_conv_id,
            "model": last_model,
        })
        yield f"data: {done_payload}\n\n"

    except asyncio.CancelledError:
        logger.info(f"[SSE STREAM] Request stream cancelled by client (conversation_id={request.conversation_id})")
        raise
    except Exception as err:
        logger.error(f"[SSE STREAM] Stream generation error: {err}")
        error_payload = json.dumps({"error": f"JARVIS stream error: {str(err)}", "done": True})
        yield f"data: {error_payload}\n\n"


@router.post(
    "/chat",
    responses={
        200: {"model": ChatResponse, "description": "Successful non-streamed response"},
        404: {"model": ErrorResponse, "description": "Conversation not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
        502: {"model": ErrorResponse, "description": "LLM Provider error"},
    },
)
async def chat_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    chat_service: ChatService = Depends(get_chat_service),
):
    """Processes dialogue interaction through the JARVIS brain service layer (supports stream=true or default non-streamed response)."""
    if request.stream:
        return StreamingResponse(
            _generate_sse_stream(db, request, chat_service),
            media_type="text/event-stream",
            headers=SSE_HEADERS,
        )

    result = await chat_service.handle_chat_request(
        db=db,
        user_message=request.message,
        conversation_id=request.conversation_id,
    )
    return ChatResponse(
        conversation_id=result["conversation_id"],
        message=result["message"],
        model=result["model"],
    )


@router.post(
    "/chat/stream",
    responses={
        200: {"description": "Server-Sent Events text token stream"},
        404: {"model": ErrorResponse, "description": "Conversation not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
        502: {"model": ErrorResponse, "description": "LLM Provider error"},
    },
)
async def chat_stream_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    chat_service: ChatService = Depends(get_chat_service),
):
    """Processes dialogue interaction streaming real-time tokens via Server-Sent Events (SSE)."""
    return StreamingResponse(
        _generate_sse_stream(db, request, chat_service),
        media_type="text/event-stream",
        headers=SSE_HEADERS,
    )
