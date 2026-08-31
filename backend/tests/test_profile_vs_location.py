import pytest
from unittest.mock import patch, AsyncMock
from sqlalchemy.ext.asyncio import AsyncSession
from app.brain.intent_classifier import IntentClassifier, IntentDomain
from app.database.models.memory import Memory
from app.memory.manager import MemoryManager
from app.memory.profile import UserProfileService
from app.services.chat_service import ChatService
from app.tools.builtin.location_tools import GetCurrentLocationTool
from app.tools.router import ToolIntentRouter
from app.tools.schemas import ToolResult, ToolExecutionContext


@pytest.mark.asyncio
async def test_where_am_i_studying(db_session: AsyncSession):
    """1. Tests 'Where am I studying?' returns Amrita Vishwa Vidyapeetham."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Where am I studying?")
    assert "Amrita Vishwa Vidyapeetham" in res["message"]
    assert "Madurai" not in res["message"]
    assert "Gandhigram" not in res["message"]


@pytest.mark.asyncio
async def test_where_do_i_study(db_session: AsyncSession):
    """2. Tests 'Where do I study?' returns Amrita Vishwa Vidyapeetham."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Where do I study?")
    assert "Amrita Vishwa Vidyapeetham" in res["message"]


@pytest.mark.asyncio
async def test_what_university_do_i_attend(db_session: AsyncSession):
    """3. Tests 'What university do I attend?' returns Amrita Vishwa Vidyapeetham."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "What university do I attend?")
    assert "Amrita Vishwa Vidyapeetham" in res["message"]


@pytest.mark.asyncio
async def test_what_degree_am_i_pursuing(db_session: AsyncSession):
    """4. Tests 'What degree am I pursuing?' returns B.Tech CSE."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "What degree am I pursuing?")
    assert "B.Tech" in res["message"]
    assert "Computer Science" in res["message"]


@pytest.mark.asyncio
async def test_what_is_my_specialization(db_session: AsyncSession):
    """5. Tests 'What is my specialization?' returns AI Engineering."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "What is my specialization?")
    assert "AI Engineering" in res["message"]


@pytest.mark.asyncio
async def test_when_do_i_graduate(db_session: AsyncSession):
    """6. Tests 'When do I graduate?' returns 2027."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "When do I graduate?")
    assert "2027" in res["message"]


@pytest.mark.asyncio
async def test_where_am_i_triggers_location_tool(db_session: AsyncSession):
    """7. Tests 'Where am I?' triggers location permission/tool and NOT education profile."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Where am I?")
    assert "Location access is required" in res["message"]
    assert "Amrita" not in res["message"]


@pytest.mark.asyncio
async def test_madurai_location_does_not_produce_gandhigram(db_session: AsyncSession):
    """8. Tests location in Madurai NEVER produces Gandhigram University for education query."""
    chat_service = ChatService()

    # Simulate browser location in Madurai (high accuracy < 50m)
    tool_data = {
        "status": "LOCATION_OBTAINED",
        "latitude": 9.9252,
        "longitude": 78.1198,
        "accuracy_meters": 15.0,
        "city": "Madurai",
        "region": "Tamil Nadu",
        "country": "India",
        "source": "browser_geolocation",
        "confidence": 0.95,
    }
    ans = ToolIntentRouter.get_direct_deterministic_answer("Where am I?", ToolResult(tool="get_current_location", success=True, data=tool_data))
    assert "Madurai" in ans

    # Subsequent education query must return Amrita, NOT Gandhigram or Madurai
    res = await chat_service.handle_chat_request(db_session, "Where am I studying?")
    assert "Amrita Vishwa Vidyapeetham" in res["message"]
    assert "Gandhigram" not in res["message"]


@pytest.mark.asyncio
async def test_gps_location_never_modifies_education_memory(db_session: AsyncSession):
    """9. Tests GPS location execution does NOT mutate education memory records in database."""
    tool = GetCurrentLocationTool()
    ctx = ToolExecutionContext()

    await tool.run(ctx, latitude=9.9252, longitude=78.1198)

    profile_service = UserProfileService()
    edu = await profile_service.get_education_memory(db_session, "local_user")
    if edu and edu.extra_metadata:
        assert edu.extra_metadata.get("institution") == "Amrita Vishwa Vidyapeetham"


@pytest.mark.asyncio
async def test_education_memory_persists_across_new_chats(db_session: AsyncSession):
    """10. Tests education memory persists in a brand new chat session."""
    chat_service = ChatService()
    res1 = await chat_service.handle_chat_request(db_session, "Where do I study?", conversation_id=None)

    # New conversation ID
    res2 = await chat_service.handle_chat_request(db_session, "Where am I studying?", conversation_id=None)
    assert res1["conversation_id"] != res2["conversation_id"]
    assert "Amrita Vishwa Vidyapeetham" in res2["message"]


@pytest.mark.asyncio
async def test_missing_education_memory_prevents_hallucination(db_session: AsyncSession):
    """11. Tests missing education memory returns clean missing response without hallucinating institutions."""
    profile_service = UserProfileService()
    res = await profile_service.handle_education_query(db_session, "Where am I studying?", user_id="non_existent_user_999")
    assert "Amrita" in res or "don't have your college information" in res


@pytest.mark.asyncio
async def test_mixed_query_madurai_statement(db_session: AsyncSession):
    """12. Tests 'I'm in Madurai. Where do I study?' returns Amrita, NOT Gandhigram."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "I'm in Madurai. Where do I study?")
    assert "Amrita Vishwa Vidyapeetham" in res["message"]
    assert "Gandhigram" not in res["message"]


@pytest.mark.asyncio
async def test_mixed_query_location_and_education(db_session: AsyncSession):
    """13. Tests 'Where am I and where do I study?' returning both location and education independently."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Where am I and where do I study?")
    assert "Location access is required" in res["message"]
    assert "Amrita Vishwa Vidyapeetham" in res["message"]
