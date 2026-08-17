import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_chat_creates_new_conversation(async_client: AsyncClient):
    """Verifies POST /api/v1/chat creates a new conversation if conversation_id is omitted."""
    payload = {"message": "Hello JARVIS"}
    response = await async_client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "conversation_id" in data
    assert data["conversation_id"] is not None
    assert "Mock response from JARVIS" in data["message"]
    assert "model" in data


@pytest.mark.asyncio
async def test_chat_continues_existing_conversation(async_client: AsyncClient):
    """Verifies POST /api/v1/chat continues an existing conversation session."""
    # Turn 1
    response1 = await async_client.post("/api/v1/chat", json={"message": "First turn"})
    assert response1.status_code == 200
    conv_id = response1.json()["conversation_id"]

    # Turn 2
    response2 = await async_client.post(
        "/api/v1/chat", json={"message": "Second turn", "conversation_id": conv_id}
    )
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["conversation_id"] == conv_id
    assert "Second turn" in data2["message"]


@pytest.mark.asyncio
async def test_chat_invalid_conversation_id_returns_404(async_client: AsyncClient):
    """Verifies POST /api/v1/chat returns 404 when an unknown conversation_id is passed."""
    payload = {"message": "Hello", "conversation_id": "non-existent-uuid-1234"}
    response = await async_client.post("/api/v1/chat", json=payload)
    assert response.status_code == 404
    data = response.json()
    assert "error" in data


@pytest.mark.asyncio
async def test_chat_empty_message_returns_422(async_client: AsyncClient):
    """Verifies POST /api/v1/chat returns 422 when message is empty."""
    payload = {"message": ""}
    response = await async_client.post("/api/v1/chat", json=payload)
    assert response.status_code == 422
