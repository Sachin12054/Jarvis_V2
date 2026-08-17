from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.common import ErrorResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/api/v1", tags=["Chat"])


def get_chat_service() -> ChatService:
    return ChatService()


@router.post(
    "/chat",
    response_model=ChatResponse,
    responses={
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
    """Processes dialogue interaction through the JARVIS brain service layer."""
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

