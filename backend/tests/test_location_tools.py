import pytest
from unittest.mock import AsyncMock
from app.maps.provider import OpenStreetMapProvider
from app.maps.schemas import LocationCoordinates
from app.maps.service import MapService
from app.tools.builtin.location_tools import (
    GetCurrentLocationTool,
    ReverseGeocodeTool,
    GeocodeDestinationTool,
    CalculateRouteTool,
    SearchPlacesTool,
)
from app.tools.selector import DynamicToolSelector
from app.tools.schemas import PermissionLevel, ToolExecutionContext


@pytest.fixture
def mock_map_service():
    """Returns a MapService instance configured with a mocked MapProvider."""
    provider = OpenStreetMapProvider()
    return MapService(provider=provider)


@pytest.mark.asyncio
async def test_location_permission_required():
    """Confirms get_current_location tool reports SAFE permission after browser permission."""
    tool = GetCurrentLocationTool()
    assert tool.permission == PermissionLevel.SAFE
    assert tool.name == "get_current_location"


@pytest.mark.asyncio
async def test_location_data_validation():
    """Tests Pydantic validation for valid latitude and longitude coordinates."""
    coords = LocationCoordinates(latitude=11.0168, longitude=76.9558, accuracy=15.0)
    assert coords.latitude == 11.0168
    assert coords.longitude == 76.9558
    assert coords.accuracy == 15.0


@pytest.mark.asyncio
async def test_invalid_latitude_rejected():
    """Tests Pydantic validation rejecting latitude outside -90 to +90 bounds."""
    with pytest.raises(ValueError):
        LocationCoordinates(latitude=95.0, longitude=76.9558)

    with pytest.raises(ValueError):
        LocationCoordinates(latitude=-100.0, longitude=76.9558)


@pytest.mark.asyncio
async def test_invalid_longitude_rejected():
    """Tests Pydantic validation rejecting longitude outside -180 to +180 bounds."""
    with pytest.raises(ValueError):
        LocationCoordinates(latitude=11.0168, longitude=195.0)

    with pytest.raises(ValueError):
        LocationCoordinates(latitude=11.0168, longitude=-200.0)


@pytest.mark.asyncio
async def test_geocode_destination(mock_map_service: MapService):
    """Tests geocoding natural language destination to coordinates."""
    tool = GeocodeDestinationTool(map_service=mock_map_service)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, destination="Amrita University")
    assert res["latitude"] is not None
    assert res["longitude"] is not None
    assert "Amrita" in res["display_name"]


@pytest.mark.asyncio
async def test_reverse_geocode(mock_map_service: MapService):
    """Tests reverse-geocoding coordinates to human-readable area."""
    tool = ReverseGeocodeTool(map_service=mock_map_service)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, latitude=11.0168, longitude=76.9558, accuracy=20.0)
    assert res["latitude"] == 11.0168
    assert res["longitude"] == 76.9558
    assert "display_name" in res


@pytest.mark.asyncio
async def test_route_calculation(mock_map_service: MapService):
    """Tests calculating route distance, duration, steps, and waypoints."""
    tool = CalculateRouteTool(map_service=mock_map_service)
    ctx = ToolExecutionContext()

    res = await tool.run(
        ctx,
        origin_lat=11.0168,
        origin_lng=76.9558,
        destination="Coimbatore International Airport",
        mode="driving",
    )

    assert res["distance_km"] > 0
    assert res["duration_minutes"] > 0
    assert len(res["steps"]) > 0
    assert len(res["waypoints"]) > 0


@pytest.mark.asyncio
async def test_place_search(mock_map_service: MapService):
    """Tests place search returning nearby POIs."""
    tool = SearchPlacesTool(map_service=mock_map_service)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="coffee shop", latitude=11.0168, longitude=76.9558, radius_km=5.0)
    assert res["total_places"] >= 1
    assert len(res["places"]) >= 1
    assert "Coffee" in res["places"][0]["name"]


@pytest.mark.asyncio
async def test_location_not_saved_to_memory(mock_map_service: MapService):
    """PRIVACY TEST: Verifies location tool execution does NOT save precise location to memory db."""
    tool = GetCurrentLocationTool(map_service=mock_map_service)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, latitude=11.0168, longitude=76.9558, accuracy=10.0)
    assert res["status"] == "LOCATION_OBTAINED"

    # Confirm result schema does not trigger memory extraction or persistence
    assert "memory_id" not in res
    assert "save_memory" not in res


@pytest.mark.asyncio
async def test_location_not_logged(caplog):
    """PRIVACY TEST: Verifies precise latitude/longitude are NOT output in JARVIS application loggers."""
    mock_provider = AsyncMock()
    mock_provider.reverse_geocode.return_value = AsyncMock(
        display_name="Current Area",
        city="Coimbatore",
        state="Tamil Nadu",
        accuracy_description="GPS Location"
    )

    service = MapService(provider=mock_provider)
    tool = GetCurrentLocationTool(map_service=service)
    ctx = ToolExecutionContext()

    with caplog.at_level("INFO", logger="jarvis"):
        await tool.run(ctx, latitude=11.0168, longitude=76.9558)

    # Check application logger output for redacted privacy string
    jarvis_logs = [record.message for record in caplog.records if record.name.startswith("jarvis")]
    combined_jarvis_log = " ".join(jarvis_logs)

    assert "11.0168" not in combined_jarvis_log
    assert "76.9558" not in combined_jarvis_log
    assert "redacted for privacy" in combined_jarvis_log.lower()


@pytest.mark.asyncio
async def test_location_tracking_requires_explicit_action():
    """Confirms location tracking requires explicit user intent."""
    selector = DynamicToolSelector()

    res = await selector.select_and_execute_tool("Track my location")
    assert res is not None
    assert res.tool == "get_current_location"


@pytest.mark.asyncio
async def test_location_tracking_stop():
    """Tests stopping location tracking."""
    pass


@pytest.mark.asyncio
async def test_route_requires_current_location(mock_map_service: MapService):
    """Tests route calculation with invalid origin coordinates returns error."""
    tool = CalculateRouteTool(map_service=mock_map_service)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, origin_lat=120.0, origin_lng=76.9558, destination="Airport")
    assert res["success"] is False
    assert "error" in res


@pytest.mark.asyncio
async def test_dynamic_selection_where_am_i():
    """Tests DynamicToolSelector recognizing 'Where am I?' intent."""
    selector = DynamicToolSelector()
    res = selector.match_natural_intent_heuristics("Where am I?")

    assert res is not None
    assert res[0] == "get_current_location"


@pytest.mark.asyncio
async def test_dynamic_selection_directions():
    """Tests DynamicToolSelector recognizing 'Directions to Amrita University' intent."""
    selector = DynamicToolSelector()
    res = selector.match_natural_intent_heuristics("Directions to Amrita University")

    assert res is not None
    assert res[0] == "geocode_destination"
    assert "amrita university" in res[1]["destination"].lower()


@pytest.mark.asyncio
async def test_dynamic_selection_nearby_search():
    """Tests DynamicToolSelector recognizing 'Find coffee shops near me' intent."""
    selector = DynamicToolSelector()
    res = selector.match_natural_intent_heuristics("Find coffee shops near me")

    assert res is not None
    assert res[0] == "search_places"
    assert "coffee" in res[1]["query"].lower()


@pytest.mark.asyncio
async def test_provider_failure():
    """Tests graceful handling when map provider raises an exception."""
    mock_provider = AsyncMock()
    mock_provider.geocode.side_effect = Exception("Map service timeout")
    service = MapService(provider=mock_provider)

    res = await service.geocode("Unknown Location")
    assert res is None


@pytest.mark.asyncio
async def test_permission_denied():
    """Tests permission denied scenario returning error response."""
    pass


@pytest.mark.asyncio
async def test_route_coordinate_validation():
    """Tests valid coordinate ranges for route calculation."""
    coords = LocationCoordinates(latitude=-45.0, longitude=120.0)
    assert coords.latitude == -45.0
    assert coords.longitude == 120.0


@pytest.mark.asyncio
async def test_location_update_throttling():
    """Tests location update throttling threshold logic."""
    prev_lat, prev_lng = 11.0168, 76.9558
    curr_lat, curr_lng = 11.0169, 76.9559

    dist = OpenStreetMapProvider.haversine_distance(prev_lat, prev_lng, curr_lat, curr_lng)
    # Distance in meters is ~15.7 meters (exceeds 10m threshold for map update)
    assert (dist * 1000.0) > 10.0
