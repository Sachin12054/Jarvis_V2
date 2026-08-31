from typing import Dict, Any, Optional
from pydantic import BaseModel, Field, field_validator
from app.core.logging import logger
from app.maps.service import MapService
from app.tools.base import BaseTool
from app.tools.schemas import PermissionLevel, ToolCategory, ToolExecutionContext


# Input Argument Schemas
class GetCurrentLocationArgs(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Current latitude from browser Geolocation API (-90 to 90)")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Current longitude from browser Geolocation API (-180 to 180)")
    accuracy: Optional[float] = Field(default=None, ge=0.0, description="Accuracy radius in meters")

    @field_validator("latitude")
    @classmethod
    def validate_lat(cls, v: float) -> float:
        if not (-90.0 <= v <= 90.0):
            raise ValueError("Latitude must be between -90 and 90 degrees.")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_lng(cls, v: float) -> float:
        if not (-180.0 <= v <= 180.0):
            raise ValueError("Longitude must be between -180 and 180 degrees.")
        return v


class ReverseGeocodeArgs(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude to reverse-geocode (-90 to 90)")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude to reverse-geocode (-180 to 180)")
    accuracy: Optional[float] = Field(default=None, ge=0.0, description="Accuracy radius in meters")


class GeocodeDestinationArgs(BaseModel):
    destination: str = Field(..., min_length=1, description="Destination name or address string")


class CalculateRouteArgs(BaseModel):
    origin_lat: float = Field(..., ge=-90.0, le=90.0, description="Origin latitude")
    origin_lng: float = Field(..., ge=-180.0, le=180.0, description="Origin longitude")
    destination: str = Field(..., min_length=1, description="Destination name or address string")
    mode: str = Field(default="driving", description="Travel mode: driving, walking, cycling")


class SearchPlacesArgs(BaseModel):
    query: str = Field(..., min_length=1, description="Place search query (e.g. coffee shop, gas station)")
    latitude: Optional[float] = Field(default=None, ge=-90.0, le=90.0, description="Optional center latitude")
    longitude: Optional[float] = Field(default=None, ge=-180.0, le=180.0, description="Optional center longitude")
    radius_km: float = Field(default=5.0, ge=0.1, le=50.0, description="Search radius in kilometers")


# Tool Implementations
class GetCurrentLocationTool(BaseTool):
    """Tool that receives current device coordinates after explicit browser permission."""

    name = "get_current_location"
    description = "Obtains the user's current device location coordinates after explicit browser permission."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = GetCurrentLocationArgs

    def __init__(self, map_service: Optional[MapService] = None):
        self.map_service = map_service or MapService()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        lat = kwargs.get("latitude")
        lng = kwargs.get("longitude")
        accuracy = kwargs.get("accuracy")

        # Privacy INFO log
        logger.info("[LOCATION] Received current device location (coordinates redacted for privacy)")

        # Coordinate Validation
        if lat is None or lng is None or not (-90.0 <= lat <= 90.0) or not (-180.0 <= lng <= 180.0):
            logger.warning(f"[LOCATION TOOL] Invalid or missing coordinates: lat={lat}, lng={lng}")
            return {
                "status": "LOCATION_ERROR",
                "error": "Location coordinates are missing or out of valid geographical bounds (-90..90, -180..180).",
                "source": "browser_geolocation",
                "confidence": 0.0,
            }

        # Requirement 6: Backend logs
        logger.info(f"[LOCATION DEBUG] Reverse geocoding coordinates")

        reverse_res = await self.map_service.reverse_geocode(latitude=lat, longitude=lng, accuracy=accuracy)

        region_val = getattr(reverse_res, "region", None) or getattr(reverse_res, "state", None)

        logger.info(f"[LOCATION DEBUG] Reverse geocode result city={reverse_res.city} region={region_val} country={reverse_res.country}")

        # Requirement 12: Structured Location Result Schema
        return {
            "status": "LOCATION_OBTAINED",
            "latitude": lat,
            "longitude": lng,
            "accuracy_meters": accuracy,
            "city": reverse_res.city,
            "region": region_val,
            "country": getattr(reverse_res, "country", None),
            "display_name": reverse_res.display_name,
            "source": getattr(reverse_res, "source", "browser_geolocation"),
            "confidence": getattr(reverse_res, "confidence", 0.95),
            "error": getattr(reverse_res, "error", None),
        }


class ReverseGeocodeTool(BaseTool):
    """Tool that converts geographical coordinates into a human-readable area name."""

    name = "reverse_geocode"
    description = "Converts geographical coordinates into a human-readable area name."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = ReverseGeocodeArgs

    def __init__(self, map_service: Optional[MapService] = None):
        self.map_service = map_service or MapService()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        lat = kwargs.get("latitude")
        lng = kwargs.get("longitude")
        accuracy = kwargs.get("accuracy")

        if lat is None or lng is None or not (-90.0 <= lat <= 90.0) or not (-180.0 <= lng <= 180.0):
            return {"error": "Invalid coordinates bounds", "confidence": 0.0}

        res = await self.map_service.reverse_geocode(latitude=lat, longitude=lng, accuracy=accuracy)
        return res.model_dump()


class GeocodeDestinationTool(BaseTool):
    """Tool that geocodes a destination string into geographical coordinates."""

    name = "geocode_destination"
    description = "Geocodes a destination name or address into geographical coordinates."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = GeocodeDestinationArgs

    def __init__(self, map_service: Optional[MapService] = None):
        self.map_service = map_service or MapService()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        destination = kwargs["destination"]
        res = await self.map_service.geocode(destination)

        if not res:
            return {"error": f"Could not resolve destination '{destination}'", "success": False}

        return res.model_dump()


class CalculateRouteTool(BaseTool):
    """Tool that calculates distance, duration, steps, and waypoints between origin and destination."""

    name = "calculate_route"
    description = "Calculates distance, duration, steps, and waypoints from origin coordinates to a destination."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = CalculateRouteArgs

    def __init__(self, map_service: Optional[MapService] = None):
        self.map_service = map_service or MapService()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        origin_lat = kwargs["origin_lat"]
        origin_lng = kwargs["origin_lng"]
        destination = kwargs["destination"]
        mode = kwargs.get("mode", "driving")

        res = await self.map_service.calculate_route(
            origin_lat=origin_lat,
            origin_lng=origin_lng,
            destination_name=destination,
            mode=mode,
        )

        if not res:
            return {"error": f"Could not calculate route to '{destination}'", "success": False}

        return res.model_dump()


class SearchPlacesTool(BaseTool):
    """Tool that searches for POIs/places near geographical coordinates."""

    name = "search_places"
    description = "Searches for points of interest (coffee shops, petrol pumps, restaurants) near a location."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = SearchPlacesArgs

    def __init__(self, map_service: Optional[MapService] = None):
        self.map_service = map_service or MapService()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        query = kwargs["query"]
        lat = kwargs.get("latitude")
        lng = kwargs.get("longitude")
        radius_km = kwargs.get("radius_km", 5.0)

        places = await self.map_service.search_places(
            query=query,
            latitude=lat,
            longitude=lng,
            radius_km=radius_km,
        )

        return {
            "query": query,
            "total_places": len(places),
            "places": [p.model_dump() for p in places],
        }
