import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.memory.manager import MemoryManager


@pytest.mark.asyncio
async def test_create_memory_success(async_client: AsyncClient):
    """Tests POST /api/v1/memory successfully creating a memory record."""
    payload = {
        "content": "My primary programming language is Python",
        "memory_type": "preference",
        "importance": 0.9,
        "confidence": 0.95,
        "source": "user_explicit",
    }
    response = await async_client.post("/api/v1/memory", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["memory_type"] == "preference"
    assert data["content"] == "My primary programming language is Python"
    assert data["normalized_content"] == "my primary programming language is python"
    assert data["importance"] == 0.9
    assert data["confidence"] == 0.95
    assert data["access_count"] == 0


@pytest.mark.asyncio
async def test_get_memory_success_and_access_tracking(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests GET /api/v1/memory/{id} returning details and updating access metrics."""
    manager = MemoryManager()
    from app.schemas.memory import MemoryCreate
    mem = await manager.create_memory(
        db_session,
        MemoryCreate(content="Working on JARVIS command center", memory_type="project")
    )
    await db_session.commit()

    # GET request 1 -> access_count should become 1
    res1 = await async_client.get(f"/api/v1/memory/{mem.id}")
    assert res1.status_code == 200
    d1 = res1.json()
    assert d1["access_count"] == 1

    # GET request 2 -> access_count should become 2
    res2 = await async_client.get(f"/api/v1/memory/{mem.id}")
    assert res2.status_code == 200
    d2 = res2.json()
    assert d2["access_count"] == 2


@pytest.mark.asyncio
async def test_list_memories_and_pagination(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests GET /api/v1/memory paginated listing."""
    manager = MemoryManager()
    from app.schemas.memory import MemoryCreate
    await manager.create_memory(db_session, MemoryCreate(content="Fact 1", memory_type="factual"))
    await manager.create_memory(db_session, MemoryCreate(content="Fact 2", memory_type="factual"))
    await manager.create_memory(db_session, MemoryCreate(content="Pref 1", memory_type="preference"))
    await db_session.commit()

    response = await async_client.get("/api/v1/memory?limit=2&offset=0")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3
    assert len(data["items"]) == 2


@pytest.mark.asyncio
async def test_list_memories_filtering_by_type(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests GET /api/v1/memory filtering by memory_type."""
    manager = MemoryManager()
    from app.schemas.memory import MemoryCreate
    await manager.create_memory(db_session, MemoryCreate(content="Project JARVIS", memory_type="project"))
    await manager.create_memory(db_session, MemoryCreate(content="User likes dark theme", memory_type="preference"))
    await db_session.commit()

    response = await async_client.get("/api/v1/memory?memory_type=preference")
    assert response.status_code == 200
    data = response.json()
    assert all(item["memory_type"] == "preference" for item in data["items"])


@pytest.mark.asyncio
async def test_update_memory_success(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests PUT /api/v1/memory/{id} updating fields."""
    manager = MemoryManager()
    from app.schemas.memory import MemoryCreate
    mem = await manager.create_memory(
        db_session,
        MemoryCreate(content="I use VS Code", memory_type="preference", importance=0.5)
    )
    await db_session.commit()

    update_payload = {"content": "I use Antigravity IDE", "importance": 0.95}
    response = await async_client.put(f"/api/v1/memory/{mem.id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "I use Antigravity IDE"
    assert data["normalized_content"] == "i use antigravity ide"
    assert data["importance"] == 0.95


@pytest.mark.asyncio
async def test_delete_memory_success(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests DELETE /api/v1/memory/{id} deleting a memory record."""
    manager = MemoryManager()
    from app.schemas.memory import MemoryCreate
    mem = await manager.create_memory(
        db_session,
        MemoryCreate(content="Temporary note", memory_type="contextual")
    )
    await db_session.commit()

    response = await async_client.delete(f"/api/v1/memory/{mem.id}")
    assert response.status_code == 200
    assert response.json()["id"] == mem.id

    # Verify 404 on get
    get_res = await async_client.get(f"/api/v1/memory/{mem.id}")
    assert get_res.status_code == 404


@pytest.mark.asyncio
async def test_invalid_memory_type_validation(async_client: AsyncClient):
    """Tests POST /api/v1/memory with invalid memory_type returning 422."""
    payload = {"content": "Invalid type test", "memory_type": "unsupported_category"}
    response = await async_client.post("/api/v1/memory", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_invalid_importance_validation(async_client: AsyncClient):
    """Tests POST /api/v1/memory with invalid importance returning 422."""
    payload = {"content": "Importance out of range", "memory_type": "factual", "importance": 1.5}
    response = await async_client.post("/api/v1/memory", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_invalid_confidence_validation(async_client: AsyncClient):
    """Tests POST /api/v1/memory with invalid confidence returning 422."""
    payload = {"content": "Confidence out of range", "memory_type": "factual", "confidence": -0.2}
    response = await async_client.post("/api/v1/memory", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_memory_not_found(async_client: AsyncClient):
    """Tests GET /api/v1/memory/{invalid_id} returning 404."""
    response = await async_client.get("/api/v1/memory/missing-uuid-12345")
    assert response.status_code == 404
    assert "error" in response.json()


@pytest.mark.asyncio
async def test_duplicate_memory_deduplication_behavior(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests explicit memory deduplication reinforcing confidence/importance instead of duplicating."""
    payload1 = {
        "content": "I live in San Francisco",
        "memory_type": "factual",
        "importance": 0.6,
        "confidence": 0.7,
    }
    res1 = await async_client.post("/api/v1/memory", json=payload1)
    assert res1.status_code == 201
    m1 = res1.json()

    # Same content with whitespace/case variation
    payload2 = {
        "content": "  i live in SAN FRANCISCO ",
        "memory_type": "factual",
        "importance": 0.85,
        "confidence": 0.95,
    }
    res2 = await async_client.post("/api/v1/memory", json=payload2)
    assert res2.status_code == 201
    m2 = res2.json()

    # Should return the same record ID with reinforced scores
    assert m2["id"] == m1["id"]
    assert m2["importance"] == 0.85
    assert m2["confidence"] == 0.95


@pytest.mark.asyncio
async def test_inactive_memory_filtering(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests filtering by is_active status."""
    manager = MemoryManager()
    from app.schemas.memory import MemoryCreate, MemoryUpdate
    mem = await manager.create_memory(db_session, MemoryCreate(content="Archived fact", memory_type="factual"))
    await manager.update_memory(db_session, mem.id, MemoryUpdate(is_active=False))
    await db_session.commit()

    # Default is_active=True filter should omit the inactive memory
    res1 = await async_client.get("/api/v1/memory?is_active=true")
    assert res1.status_code == 200
    ids1 = [item["id"] for item in res1.json()["items"]]
    assert mem.id not in ids1

    # is_active=False filter should include it
    res2 = await async_client.get("/api/v1/memory?is_active=false")
    assert res2.status_code == 200
    ids2 = [item["id"] for item in res2.json()["items"]]
    assert mem.id in ids2


@pytest.mark.asyncio
async def test_memory_persistence_after_db_commit(
    async_client: AsyncClient,
    db_session: AsyncSession,
):
    """Tests that memories remain persisted across session transactions."""
    manager = MemoryManager()
    from app.schemas.memory import MemoryCreate
    mem = await manager.create_memory(db_session, MemoryCreate(content="Persisted fact", memory_type="project"))
    await db_session.commit()

    response = await async_client.get(f"/api/v1/memory/{mem.id}")
    assert response.status_code == 200
    assert response.json()["content"] == "Persisted fact"
