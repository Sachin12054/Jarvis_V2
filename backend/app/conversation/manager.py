from typing import List, Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import ConversationNotFoundError
from app.database.models.conversation import Conversation
from app.database.models.message import Message


class ConversationManager:
    """Manages creation, retrieval, and message storage for chat sessions."""

    async def create_conversation(self, db: AsyncSession, status: str = "active") -> Conversation:
        """Creates and persists a new conversation session."""
        conversation = Conversation(status=status)
        db.add(conversation)
        await db.flush()
        await db.refresh(conversation)
        return conversation

    async def get_conversation(self, db: AsyncSession, conversation_id: str) -> Optional[Conversation]:
        """Retrieves a conversation by ID."""
        stmt = select(Conversation).where(Conversation.id == conversation_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_or_create_conversation(
        self, db: AsyncSession, conversation_id: Optional[str] = None
    ) -> Conversation:
        """Retrieves an existing conversation or creates a new one if ID is missing or invalid."""
        if conversation_id:
            conversation = await self.get_conversation(db, conversation_id)
            if not conversation:
                raise ConversationNotFoundError(conversation_id)
            return conversation
        return await self.create_conversation(db)

    async def add_message(
        self,
        db: AsyncSession,
        conversation_id: str,
        role: str,
        content: str,
        extra_metadata: Optional[Dict[str, Any]] = None,
    ) -> Message:
        """Adds and persists a new message to a conversation."""
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            extra_metadata=extra_metadata or {},
        )
        db.add(message)
        await db.flush()
        await db.refresh(message)
        return message

    async def get_recent_history(
        self, db: AsyncSession, conversation_id: str, limit: int = 50
    ) -> List[Message]:
        """Retrieves messages for a conversation ordered chronologically."""
        stmt = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())
