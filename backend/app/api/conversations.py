from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.conversation.manager import ConversationManager
from app.core.exceptions import ConversationNotFoundError
from app.database.session import get_db
from app.schemas.common import ErrorResponse
from app.schemas.conversation import (
    ConversationSummary,
    ConversationDetail,
    ConversationDeleteResponse,
)

router = APIRouter(prefix="/api/v1", tags=["Conversations"])


def get_conversation_manager() -> ConversationManager:
    return ConversationManager()


@router.get(
    "/conversations",
    response_model=List[ConversationSummary],
    summary="List stored conversation sessions",
    responses={
        200: {"description": "List of conversations ordered by updated_at descending"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def list_conversations_endpoint(
    limit: int = Query(default=50, ge=1, le=100, description="Max number of sessions to return"),
    offset: int = Query(default=0, ge=0, description="Offset for pagination"),
    db: AsyncSession = Depends(get_db),
    manager: ConversationManager = Depends(get_conversation_manager),
):
    """Retrieves stored conversation sessions ordered by updated_at descending (newest updated first)."""
    conversations = await manager.list_conversations(db, limit=limit, offset=offset)
    return conversations


@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationDetail,
    summary="Get conversation details and messages",
    responses={
        200: {"description": "Conversation metadata and chronological message history"},
        404: {"model": ErrorResponse, "description": "Conversation not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def get_conversation_endpoint(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    manager: ConversationManager = Depends(get_conversation_manager),
):
    """Retrieves metadata and chronological messages for a specific conversation session."""
    conversation = await manager.get_conversation_detail(db, conversation_id)
    if not conversation:
        raise ConversationNotFoundError(conversation_id)
    return conversation


@router.delete(
    "/conversations/{conversation_id}",
    response_model=ConversationDeleteResponse,
    summary="Delete conversation session",
    responses={
        200: {"description": "Conversation and associated messages successfully deleted"},
        404: {"model": ErrorResponse, "description": "Conversation not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def delete_conversation_endpoint(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    manager: ConversationManager = Depends(get_conversation_manager),
):
    """Safely deletes a conversation session and all its associated messages."""
    deleted = await manager.delete_conversation(db, conversation_id)
    if not deleted:
        raise ConversationNotFoundError(conversation_id)
    return ConversationDeleteResponse(
        message="Conversation successfully deleted.",
        id=conversation_id,
    )
