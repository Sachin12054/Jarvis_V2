import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.conversation.manager import ConversationManager
from app.core.exceptions import ConversationNotFoundError


@pytest.mark.asyncio
async def test_conversation_lifecycle(db_session: AsyncSession):
    """Tests creating conversation, adding messages, and loading history in chronological order."""
    manager = ConversationManager()

    # Create conversation
    conv = await manager.create_conversation(db_session)
    assert conv.id is not None
    assert conv.status == "active"

    # Add messages
    msg1 = await manager.add_message(db_session, conv.id, "user", "Message 1")
    msg2 = await manager.add_message(db_session, conv.id, "assistant", "Message 2")

    # Fetch history
    history = await manager.get_recent_history(db_session, conv.id)
    assert len(history) == 2
    assert history[0].content == "Message 1"
    assert history[0].role == "user"
    assert history[1].content == "Message 2"
    assert history[1].role == "assistant"


@pytest.mark.asyncio
async def test_get_or_create_conversation_not_found(db_session: AsyncSession):
    """Tests that passing invalid conversation_id raises ConversationNotFoundError."""
    manager = ConversationManager()
    with pytest.raises(ConversationNotFoundError):
        await manager.get_or_create_conversation(db_session, "missing-uuid-1234")
