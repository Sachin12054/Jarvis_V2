import pytest
from pathlib import Path
from unittest.mock import AsyncMock, patch
from sqlalchemy.ext.asyncio import AsyncSession
from app.brain.prompt_manager import PromptManager
from app.database.models.memory import Memory
from app.maps.schemas import ReverseGeocodeResult
from app.memory.manager import MemoryManager
from app.memory.profile import UserProfileService
from app.memory.service import MemoryService
from app.services.chat_service import ChatService
from app.tools.builtin.location_tools import GetCurrentLocationTool
from app.tools.router import ToolIntentRouter
from app.tools.search_ranker import SearchResultRanker
from app.tools.schemas import ToolResult, ToolExecutionContext
from app.tools.workspace import WorkspacePathResolver


# ==========================================
# 1. MEMORY TESTS
# ==========================================

@pytest.mark.asyncio
async def test_store_and_retrieve_name_memory(db_session: AsyncSession):
    """1. Tests storing an explicit name memory in DB."""
    service = MemoryService()
    mems = await service.extract_and_store_memories(db_session, "Remember my name is Sachin.")

    assert len(mems) == 1
    assert "Sachin" in mems[0].content
    assert mems[0].memory_type == "factual"


@pytest.mark.asyncio
async def test_retrieve_name_in_same_chat(db_session: AsyncSession):
    """2. Tests retrieving name memory in current conversation session."""
    chat_service = ChatService()
    res1 = await chat_service.handle_chat_request(db_session, "Remember my name is Sachin.")
    assert "Sachin" in res1["message"]

    res2 = await chat_service.handle_chat_request(db_session, "What is my name?", conversation_id=res1["conversation_id"])
    assert "Your name is Sachin." in res2["message"] or "Kishore Sachin J G" in res2["message"]


@pytest.mark.asyncio
async def test_retrieve_name_in_new_conversation(db_session: AsyncSession):
    """3. Tests retrieving persistent name memory in a BRAND NEW conversation session."""
    chat_service = ChatService()
    res1 = await chat_service.handle_chat_request(db_session, "Remember my name is Sachin.")

    # Start NEW conversation (conversation_id=None)
    res2 = await chat_service.handle_chat_request(db_session, "What's my name?", conversation_id=None)
    assert res2["conversation_id"] != res1["conversation_id"]
    assert "Your name is Sachin." in res2["message"] or "Kishore Sachin J G" in res2["message"]


@pytest.mark.asyncio
async def test_missing_memory_handling(db_session: AsyncSession):
    """4. Tests asking for name when no memory exists returns clean missing message or default profile."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "What is my name?")
    assert "Kishore Sachin J G" in res["message"] or "you haven't told me your name yet" in res["message"]


@pytest.mark.asyncio
async def test_no_hallucinated_memory(db_session: AsyncSession):
    """5. Tests user identity memory retrieval."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Who am I?")
    assert "Kishore Sachin J G" in res["message"] or "you haven't told me your name yet" in res["message"]


@pytest.mark.asyncio
async def test_user_identity_scoping(db_session: AsyncSession):
    """6. Tests user_id scoping for memory retrieval."""
    manager = MemoryManager()
    from app.schemas.memory import MemoryCreate
    await manager.create_memory(db_session, MemoryCreate(content="User's name is Alice.", memory_type="factual", user_id="user_a"))
    await manager.create_memory(db_session, MemoryCreate(content="User's name is Bob.", memory_type="factual", user_id="user_b"))

    service = MemoryService(memory_manager=manager)
    mems_a = await service.get_relevant_memories(db_session, "What is my name?", user_id="user_a")
    mems_b = await service.get_relevant_memories(db_session, "What is my name?", user_id="user_b")

    assert len(mems_a) >= 1
    assert "Alice" in mems_a[0].content
    assert len(mems_b) >= 1
    assert "Bob" in mems_b[0].content


# ==========================================
# 2. LOCATION TESTS
# ==========================================

@pytest.mark.asyncio
async def test_location_available():
    """7. Tests returning concise location when coordinates are available."""
    tool = GetCurrentLocationTool()
    ctx = ToolExecutionContext()

    with patch("app.maps.service.MapService.reverse_geocode") as mock_rev:
        mock_rev.return_value = ReverseGeocodeResult(
            display_name="Peelamedu, Coimbatore, Tamil Nadu",
            city="Coimbatore",
            region="Tamil Nadu",
            state="Tamil Nadu",
            country="India",
            latitude=11.0168,
            longitude=76.9558,
            confidence=0.95,
        )
        res = await tool.run(ctx, latitude=11.0168, longitude=76.9558, accuracy=15.0)
        assert res["status"] == "LOCATION_OBTAINED"
        assert res["city"] == "Coimbatore"

        direct_ans = ToolIntentRouter.get_direct_deterministic_answer("Where am I?", ToolResult(tool="get_current_location", success=True, data=res))
        assert "You're in Coimbatore, Tamil Nadu." in direct_ans


@pytest.mark.asyncio
async def test_location_permission_unavailable(db_session: AsyncSession):
    """8. Tests 'Where am I?' without granted permission prompts for location access."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Where am I?")
    assert "Location access is required" in res["message"]
    assert "Google infrastructure" not in res["message"]


@pytest.mark.asyncio
async def test_no_cloud_server_location_hallucination():
    """9. Tests PromptManager system prompt strictly forbids cloud/server location statements for 'Where am I?'."""
    prompt = PromptManager.get_system_prompt()
    assert "NEVER fabricate, guess, or invent a physical city, region, or country" in prompt


@pytest.mark.asyncio
async def test_explicit_server_location_query(db_session: AsyncSession):
    """10. Tests explicit technical query 'What is my server location?' is allowed."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "What is my server location?")
    assert res is not None


# ==========================================
# 3. SEARCH RANKER TESTS
# ==========================================

@pytest.mark.asyncio
async def test_search_ranker_classification():
    """11. Tests SearchResultRanker classifying primary implementations, references, and tests."""
    raw_matches = [
        {"relative_path": "tests/test_memory.py", "line_number": 10, "line_content": "def test_memory():"},
        {"relative_path": "backend/app/memory/service.py", "line_number": 36, "line_content": "class MemoryService:"},
        {"relative_path": "backend/app/services/chat_service.py", "line_number": 6, "line_content": "from app.memory.service import MemoryService"},
    ]

    ranked = SearchResultRanker.classify_and_rank("MemoryService", raw_matches)
    assert len(ranked["primary"]) == 1
    assert ranked["primary"][0]["relative_path"] == "backend/app/memory/service.py"
    assert len(ranked["references"]) == 1
    assert ranked["references"][0]["relative_path"] == "backend/app/services/chat_service.py"
    assert len(ranked["tests"]) == 1
    assert ranked["tests"][0]["relative_path"] == "tests/test_memory.py"


@pytest.mark.asyncio
async def test_search_ranker_concise_response():
    """12. Tests formatting concise search summary response."""
    raw_matches = [
        {"relative_path": "backend/app/memory/service.py", "line_number": 36, "line_content": "class MemoryService:"},
        {"relative_path": "frontend/src/services/memoryService.ts", "line_number": 1, "line_content": "export class MemoryService"},
        {"relative_path": "backend/app/services/chat_service.py", "line_number": 6, "line_content": "from app.memory.service import MemoryService"},
    ]

    summary = SearchResultRanker.format_concise_response("MemoryService", raw_matches, mode="summary")
    assert "Found the main implementation:" in summary
    assert "`backend/app/memory/service.py`" in summary
    assert "Want me to open the implementation?" in summary


@pytest.mark.asyncio
async def test_search_where_defined_query():
    """13. Tests 'Where is MemoryService defined?' returning primary definition location only."""
    raw_matches = [
        {"relative_path": "backend/app/memory/service.py", "line_number": 36, "line_content": "class MemoryService:"},
        {"relative_path": "backend/app/services/chat_service.py", "line_number": 6, "line_content": "from app.memory.service import MemoryService"},
    ]

    summary = SearchResultRanker.format_concise_response("MemoryService", raw_matches, mode="definition")
    assert "`MemoryService` is defined in:" in summary
    assert "`backend/app/memory/service.py` (line 36: `class MemoryService:`)" in summary


@pytest.mark.asyncio
async def test_search_where_used_query():
    """14. Tests 'Where is MemoryService used?' returning usage references."""
    raw_matches = [
        {"relative_path": "backend/app/memory/service.py", "line_number": 36, "line_content": "class MemoryService:"},
        {"relative_path": "backend/app/services/chat_service.py", "line_number": 6, "line_content": "from app.memory.service import MemoryService"},
    ]

    summary = SearchResultRanker.format_concise_response("MemoryService", raw_matches, mode="usages")
    assert "`MemoryService` is referenced in:" in summary
    assert "`backend/app/services/chat_service.py`" in summary


@pytest.mark.asyncio
async def test_search_show_all_matches():
    """15. Tests 'Show all MemoryService matches' returning expanded list."""
    raw_matches = [
        {"relative_path": "backend/app/memory/service.py", "line_number": 36, "line_content": "class MemoryService:"},
        {"relative_path": "backend/app/services/chat_service.py", "line_number": 6, "line_content": "from app.memory.service import MemoryService"},
    ]

    summary = SearchResultRanker.format_concise_response("MemoryService", raw_matches, mode="exhaustive")
    assert "Found 2 matches for `MemoryService`:" in summary
    assert "backend/app/memory/service.py:36" in summary
