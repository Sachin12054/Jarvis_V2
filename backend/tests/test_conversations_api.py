import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.conversation.manager import ConversationManager


@pytest.mark.asyncio
async def test_list_conversations_empty(async_client: AsyncClient):
    """Tests GET /api/v1/conversations returning empty list when no conversations exist."""
    response = await async_client.get("/api/v1/conversations")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_list_conversations_ordering(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests GET /api/v1/conversations returning sessions ordered by updated_at descending."""
    manager = ConversationManager()

    c1 = await manager.create_conversation(db_session)
    c2 = await manager.create_conversation(db_session)

    # Add message to c1 later so its updated_at is refreshed
    await manager.add_message(db_session, c1.id, "user", "Message for C1")
    await db_session.commit()

    response = await async_client.get("/api/v1/conversations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

    # Newest updated conversation should be first
    assert data[0]["id"] == c1.id
    assert data[1]["id"] == c2.id


@pytest.mark.asyncio
async def test_get_conversation_detail(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests GET /api/v1/conversations/{id} returning metadata and chronological messages."""
    manager = ConversationManager()
    conv = await manager.create_conversation(db_session)

    await manager.add_message(db_session, conv.id, "user", "Hello JARVIS")
    await manager.add_message(db_session, conv.id, "assistant", "Hello! How can I assist you?", extra_metadata={"model": "gemma-3-4b"})
    await db_session.commit()

    response = await async_client.get(f"/api/v1/conversations/{conv.id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == conv.id
    assert data["status"] == "active"
    assert len(data["messages"]) == 2

    # Messages ordered created_at ASC (oldest first)
    assert data["messages"][0]["role"] == "user"
    assert data["messages"][0]["content"] == "Hello JARVIS"
    assert data["messages"][1]["role"] == "assistant"
    assert data["messages"][1]["content"] == "Hello! How can I assist you?"
    assert data["messages"][1]["extra_metadata"]["model"] == "gemma-3-4b"


@pytest.mark.asyncio
async def test_get_conversation_not_found(async_client: AsyncClient):
    """Tests GET /api/v1/conversations/{invalid_id} returning 404."""
    response = await async_client.get("/api/v1/conversations/nonexistent-uuid-9999")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert "nonexistent-uuid-9999" in data["error"]


@pytest.mark.asyncio
async def test_delete_conversation_success(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests DELETE /api/v1/conversations/{id} removing conversation and messages."""
    manager = ConversationManager()
    conv = await manager.create_conversation(db_session)
    await manager.add_message(db_session, conv.id, "user", "Test deletion message")
    await db_session.commit()

    # Delete conversation via API
    response = await async_client.delete(f"/api/v1/conversations/{conv.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == conv.id
    assert "successfully deleted" in data["message"]

    # Verify 404 on subsequent GET
    get_res = await async_client.get(f"/api/v1/conversations/{conv.id}")
    assert get_res.status_code == 404


@pytest.mark.asyncio
async def test_delete_conversation_not_found(async_client: AsyncClient):
    """Tests DELETE /api/v1/conversations/{invalid_id} returning 404."""
    response = await async_client.delete("/api/v1/conversations/nonexistent-uuid-8888")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data


@pytest.mark.asyncio
async def test_chat_persistence_compatibility(async_client: AsyncClient):
    """Tests that messages generated during chat API stream are accessible via conversations API."""
    # 1. Send chat message
    chat_req = {"message": "Tell me a joke", "stream": False}
    chat_res = await async_client.post("/api/v1/chat", json=chat_req)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    conv_id = chat_data["conversation_id"]

    # 2. Retrieve conversation details via new API
    conv_res = await async_client.get(f"/api/v1/conversations/{conv_id}")
    assert conv_res.status_code == 200
    detail = conv_res.json()
    assert detail["id"] == conv_id
    assert len(detail["messages"]) == 2
    assert detail["messages"][0]["role"] == "user"
    assert detail["messages"][0]["content"] == "Tell me a joke"
    assert detail["messages"][1]["role"] == "assistant"
