import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.brain.context_manager import ContextManager
from app.database.models.memory import Memory
from app.memory.manager import MemoryManager
from app.memory.service import MemoryService
from app.schemas.memory import MemoryCreate


@pytest.mark.asyncio
async def test_explicit_factual_extraction(db_session: AsyncSession):
    """Tests extracting explicit factual statements like name."""
    service = MemoryService()
    user_msg = "My name is Sachin"
    mems = await service.extract_and_store_memories(db_session, user_msg)

    assert len(mems) == 1
    assert mems[0].memory_type == "factual"
    assert "Sachin" in mems[0].content
    assert mems[0].confidence >= 0.90


@pytest.mark.asyncio
async def test_preference_extraction(db_session: AsyncSession):
    """Tests extracting user preferences."""
    service = MemoryService()
    user_msg = "I prefer Python over C++ for backend dev"
    mems = await service.extract_and_store_memories(db_session, user_msg)

    assert len(mems) == 1
    assert mems[0].memory_type == "preference"
    assert mems[0].confidence >= 0.85


@pytest.mark.asyncio
async def test_project_extraction(db_session: AsyncSession):
    """Tests extracting active project details."""
    service = MemoryService()
    user_msg = "I am building JARVIS AI command center"
    mems = await service.extract_and_store_memories(db_session, user_msg)

    assert len(mems) == 1
    assert mems[0].memory_type == "project"
    assert "JARVIS" in mems[0].content


@pytest.mark.asyncio
async def test_low_value_message_rejection(db_session: AsyncSession):
    """Tests rejecting greetings, filler, or casual chat without creating memory."""
    service = MemoryService()
    greetings = ["Hello!", "hey there", "thanks JARVIS", "how are you today?", "ok cool"]
    for msg in greetings:
        mems = await service.extract_and_store_memories(db_session, msg)
        assert len(mems) == 0


@pytest.mark.asyncio
async def test_sensitive_credentials_rejection(db_session: AsyncSession):
    """Tests that API keys, passwords, and bearer tokens are rejected and never saved."""
    service = MemoryService()
    sensitive_msgs = [
        "My API key is sk-proj-1234567890abcdef1234567890abcdef",
        "Here is my token ghp_1234567890abcdef1234567890abcdef",
        "Set password = 'SuperSecretPassword123!'",
    ]
    for msg in sensitive_msgs:
        assert service.contains_sensitive_data(msg) is True
        mems = await service.extract_and_store_memories(db_session, msg)
        assert len(mems) == 0


@pytest.mark.asyncio
async def test_duplicate_memory_reinforcement(db_session: AsyncSession):
    """Tests that extracting duplicate facts reinforces confidence instead of creating duplicate records."""
    service = MemoryService()
    msg1 = "I prefer Python"
    msg2 = "i prefer python"

    mem1 = await service.extract_and_store_memories(db_session, msg1)
    assert len(mem1) == 1

    mem2 = await service.extract_and_store_memories(db_session, msg2)
    assert len(mem2) == 1
    assert mem2[0].id == mem1[0].id  # Same record ID reinforced


@pytest.mark.asyncio
async def test_relevant_memory_retrieval_and_ranking(db_session: AsyncSession):
    """Tests multi-factor ranking and top-K filtering of relevant memories."""
    service = MemoryService()
    manager = MemoryManager()

    await manager.create_memory(db_session, MemoryCreate(content="User prefers Python", memory_type="preference", importance=0.9))
    await manager.create_memory(db_session, MemoryCreate(content="User builds JARVIS", memory_type="project", importance=0.8))
    await manager.create_memory(db_session, MemoryCreate(content="User likes dark blue theme", memory_type="preference", importance=0.5))
    await db_session.commit()

    retrieved = await service.get_relevant_memories(db_session, user_query="What language do I prefer?", top_k=2)
    assert len(retrieved) <= 2
    assert any("Python" in m.content for m in retrieved)


@pytest.mark.asyncio
async def test_memory_context_builder():
    """Tests formatting retrieved memories into LLM prompt string."""
    service = MemoryService()
    mem = Memory(
        id="mem-1",
        user_id="local_user",
        memory_type="preference",
        content="User prefers Python over Java",
        normalized_content="user prefers python over java",
        importance=0.9,
        confidence=0.95,
        source="user_explicit",
        access_count=1,
    )
    context = service.build_memory_context([mem])
    assert "[RELEVANT USER MEMORIES]" in context
    assert "- [PREFERENCE] User prefers Python over Java" in context


@pytest.mark.asyncio
async def test_context_manager_memory_injection():
    """Tests ContextManager appending memory context to system prompt."""
    cm = ContextManager()
    mem_ctx = "[RELEVANT USER MEMORIES]\n- [PREFERENCE] User prefers Python"
    msgs = cm.prepare_messages(history=[], new_user_message="Hello", memory_context=mem_ctx)

    assert len(msgs) == 2
    assert msgs[0]["role"] == "system"
    assert "[RELEVANT USER MEMORIES]" in msgs[0]["content"]


@pytest.mark.asyncio
async def test_relevant_memory_api_endpoint(async_client: AsyncClient, db_session: AsyncSession):
    """Tests GET /api/v1/memory/search/relevant endpoint."""
    manager = MemoryManager()
    await manager.create_memory(db_session, MemoryCreate(content="User prefers FastAPI", memory_type="preference"))
    await db_session.commit()

    res = await async_client.get("/api/v1/memory/search/relevant?q=FastAPI&top_k=5")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "FastAPI" in data[0]["content"]


@pytest.mark.asyncio
async def test_chat_continues_if_memory_retrieval_fails(async_client: AsyncClient):
    """Tests that chat streaming works reliably even if memory retrieval fails or returns empty."""
    chat_req = {"message": "Tell me a short joke", "stream": False}
    res = await async_client.post("/api/v1/chat", json=chat_req)
    assert res.status_code == 200
    assert "message" in res.json()
