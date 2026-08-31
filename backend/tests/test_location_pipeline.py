import pytest
from unittest.mock import AsyncMock, patch
from sqlalchemy.ext.asyncio import AsyncSession
from app.brain.prompt_manager import PromptManager
from app.maps.schemas import LocationCoordinates, ReverseGeocodeResult
from app.maps.service import MapService
from app.maps.provider import OpenStreetMapProvider
from app.services.chat_service import ChatService
from app.tools.builtin.location_tools import GetCurrentLocationTool
from app.tools.router import ToolIntentRouter
from app.tools.schemas import ToolResult, ToolExecutionContext


@pytest.mark.asyncio
async def test_valid_browser_coordinates():
    """1. Tests valid browser coordinates returning structured location result."""
    tool = GetCurrentLocationTool()
    ctx = ToolExecutionContext()

    with patch("app.maps.service.MapService.reverse_geocode") as mock_rev:
        mock_rev.return_value = ReverseGeocodeResult(
            display_name="Peelamedu, Coimbatore, Tamil Nadu, India",
            city="Coimbatore",
            region="Tamil Nadu",
            state="Tamil Nadu",
            country="India",
            latitude=11.0168,
            longitude=76.9558,
            source="browser_geolocation",
            confidence=0.95,
        )

        res = await tool.run(ctx, latitude=11.0168, longitude=76.9558, accuracy=15.0)

        assert res["status"] == "LOCATION_OBTAINED"
        assert res["latitude"] == 11.0168
        assert res["longitude"] == 76.9558
        assert res["city"] == "Coimbatore"
        assert res["region"] == "Tamil Nadu"
        assert res["country"] == "India"
        assert res["source"] == "browser_geolocation"
        assert res["confidence"] == 0.95


@pytest.mark.asyncio
async def test_invalid_coordinates_latitude():
    """2. Tests invalid latitude (-91) returning LOCATION_ERROR."""
    tool = GetCurrentLocationTool()
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, latitude=-91.0, longitude=76.9558)
    assert res["status"] == "LOCATION_ERROR"
    assert res["confidence"] == 0.0
    assert "out of valid geographical bounds" in res["error"]


@pytest.mark.asyncio
async def test_invalid_coordinates_longitude():
    """3. Tests invalid longitude (181) returning LOCATION_ERROR."""
    tool = GetCurrentLocationTool()
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, latitude=11.0168, longitude=181.0)
    assert res["status"] == "LOCATION_ERROR"
    assert res["confidence"] == 0.0
    assert "out of valid geographical bounds" in res["error"]


@pytest.mark.asyncio
async def test_missing_coordinates():
    """4. Tests missing coordinates returning LOCATION_ERROR."""
    tool = GetCurrentLocationTool()
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, latitude=None, longitude=None)
    assert res["status"] == "LOCATION_ERROR"
    assert res["confidence"] == 0.0


@pytest.mark.asyncio
async def test_reverse_geocoding_success_formatting():
    """5. Tests reverse-geocoding success formatting concise answer: 'You're in <city>, <region>.'."""
    tool_data = {
        "status": "LOCATION_OBTAINED",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "city": "Coimbatore",
        "region": "Tamil Nadu",
        "country": "India",
        "source": "browser_geolocation",
        "confidence": 0.95,
    }

    ans = ToolIntentRouter.get_direct_deterministic_answer(
        "Where am I?",
        ToolResult(tool="get_current_location", success=True, data=tool_data),
    )

    assert ans == "You're in Coimbatore, Tamil Nadu."
    assert "Is that right?" not in ans


@pytest.mark.asyncio
async def test_reverse_geocoding_country_only_formatting():
    """6. Tests reverse-geocoding when only country is known: 'You're in <country>.'."""
    tool_data = {
        "status": "LOCATION_OBTAINED",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "city": None,
        "region": None,
        "country": "India",
        "source": "browser_geolocation",
        "confidence": 0.80,
    }

    ans = ToolIntentRouter.get_direct_deterministic_answer(
        "Where am I?",
        ToolResult(tool="get_current_location", success=True, data=tool_data),
    )

    assert ans == "You're in India."


@pytest.mark.asyncio
async def test_reverse_geocoding_failure_no_hardcoded_city():
    """7. Tests reverse-geocoding failure returning confidence=0.0 and no hardcoded city (e.g. no fake Seattle or Coimbatore)."""
    provider = OpenStreetMapProvider()
    coords = LocationCoordinates(latitude=11.0168, longitude=76.9558)

    with patch("httpx.AsyncClient.get", side_effect=Exception("API Timeout")):
        res = await provider.reverse_geocode(coords)
        assert res.city is None
        assert res.region is None
        assert res.country is None
        assert res.confidence == 0.0
        assert res.error == "Reverse geocoding service unavailable"

    tool_data = {
        "status": "LOCATION_OBTAINED",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "city": res.city,
        "region": res.region,
        "country": res.country,
        "source": "browser_geolocation",
        "confidence": res.confidence,
        "error": res.error,
    }

    ans = ToolIntentRouter.get_direct_deterministic_answer(
        "Where am I?",
        ToolResult(tool="get_current_location", success=True, data=tool_data),
    )

    assert ans == "I can't determine your location right now."
    assert "Seattle" not in ans
    assert "Coimbatore" not in ans


@pytest.mark.asyncio
async def test_prevent_cloud_ip_server_location_presentation(db_session: AsyncSession):
    """8. Tests ensuring server/cloud/IP location is NEVER presented as physical device location."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Where am I?")

    assert "Location access is required" in res["message"]
    assert "Google infrastructure" not in res["message"]
    assert "Seattle" not in res["message"]
    assert "server" not in res["message"].lower()


@pytest.mark.asyncio
async def test_prevent_llm_location_invention():
    """9. Tests PromptManager system prompt strictly forbids LLM location invention."""
    prompt = PromptManager.get_system_prompt()
    assert "NEVER fabricate, guess, or invent a physical city, region, or country" in prompt
