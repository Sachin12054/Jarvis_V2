from typing import List, Optional, Tuple
from pydantic import BaseModel, Field, field_validator


class LocationCoordinates(BaseModel):
    """Pydantic model representing geographical coordinates with validation bounds."""
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude between -90 and 90 degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude between -180 and 180 degrees")
    accuracy: Optional[float] = Field(default=None, ge=0.0, description="Accuracy radius in meters")


class GeocodeResult(BaseModel):
    """Result schema for geocoding a location name/destination."""
    display_name: str
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    place_id: Optional[str] = None
    category: Optional[str] = None


class ReverseGeocodeResult(BaseModel):
    """Result schema for reverse-geocoding geographical coordinates into human-readable area."""
    display_name: str
    city: Optional[str] = None
    region: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    accuracy_description: str = "Approximate location"
    source: str = "browser_geolocation"
    confidence: float = 0.95
    error: Optional[str] = None


class RouteStep(BaseModel):
    """Single navigation instruction step along a route."""
    instruction: str
    distance_km: float = Field(..., ge=0.0)
    duration_minutes: float = Field(..., ge=0.0)


class RouteResult(BaseModel):
    """Result schema for route calculation between origin and destination."""
    origin_name: str
    destination_name: str
    mode: str = Field(default="driving", description="Travel mode: driving, walking, cycling")
    distance_km: float = Field(..., ge=0.0)
    duration_minutes: float = Field(..., ge=0.0)
    steps: List[RouteStep] = Field(default_factory=list)
    waypoints: List[Tuple[float, float]] = Field(default_factory=list, description="List of [latitude, longitude] pairs for map polyline rendering")


class PlaceSearchResult(BaseModel):
    """Single place search result for nearby POIs."""
    name: str
    address: str
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    distance_km: Optional[float] = None
    category: Optional[str] = None
