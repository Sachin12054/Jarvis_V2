from typing import List, Optional
from app.core.config import settings
from app.core.logging import logger
from app.maps.provider import MapProvider, OpenStreetMapProvider
from app.maps.schemas import (
    LocationCoordinates,
    GeocodeResult,
    ReverseGeocodeResult,
    RouteResult,
    PlaceSearchResult,
)


class MapService:
    """Application Service managing map, routing, geocoding, and place search operations."""

    def __init__(self, provider: Optional[MapProvider] = None):
        self.provider = provider or self._resolve_provider()

    @staticmethod
    def _resolve_provider() -> MapProvider:
        """Resolves configured MapProvider based on JARVIS_MAP_PROVIDER setting."""
        prov_name = settings.JARVIS_MAP_PROVIDER.lower().strip()
        logger.info(f"[MAP SERVICE] Initialized map provider: '{prov_name}'")
        return OpenStreetMapProvider()

    async def geocode(self, destination: str) -> Optional[GeocodeResult]:
        """Geocodes a destination string into geographical coordinates."""
        if not destination or not destination.strip():
            return None
        try:
            return await self.provider.geocode(destination.strip())
        except Exception as err:
            logger.warning(f"[MAP SERVICE] Geocode error for '{destination}': {err}")
            return None

    async def reverse_geocode(self, latitude: float, longitude: float, accuracy: Optional[float] = None) -> ReverseGeocodeResult:
        """Reverse geocodes geographical coordinates into a human-readable area."""
        coords = LocationCoordinates(latitude=latitude, longitude=longitude, accuracy=accuracy)
        try:
            return await self.provider.reverse_geocode(coords)
        except Exception as err:
            logger.warning(f"[MAP SERVICE] Reverse geocode error: {err}")
            return ReverseGeocodeResult(
                display_name="Approximate Area Location",
                latitude=latitude,
                longitude=longitude,
                accuracy_description="GPS Location",
            )

    async def calculate_route(
        self,
        origin_lat: float,
        origin_lng: float,
        destination_name: str,
        mode: str = "driving",
        origin_accuracy: Optional[float] = None,
    ) -> Optional[RouteResult]:
        """Geocodes destination and calculates route from origin coordinates."""
        try:
            origin_coords = LocationCoordinates(latitude=origin_lat, longitude=origin_lng, accuracy=origin_accuracy)
            dest_geocode = await self.geocode(destination_name)

            if not dest_geocode:
                logger.warning(f"[MAP SERVICE] Could not resolve destination '{destination_name}'")
                return None

            dest_coords = LocationCoordinates(latitude=dest_geocode.latitude, longitude=dest_geocode.longitude)

            return await self.provider.calculate_route(
                origin=origin_coords,
                destination=dest_coords,
                origin_name="Current Location",
                destination_name=dest_geocode.display_name,
                mode=mode,
            )
        except Exception as err:
            logger.warning(f"[MAP SERVICE] Calculate route error: {err}")
            return None

    async def search_places(
        self,
        query: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_km: float = 5.0,
    ) -> List[PlaceSearchResult]:
        """Searches for places/POIs near given coordinates."""
        try:
            coords = None
            if latitude is not None and longitude is not None:
                coords = LocationCoordinates(latitude=latitude, longitude=longitude)
            return await self.provider.search_places(query=query, location=coords, radius_km=radius_km)
        except Exception as err:
            logger.warning(f"[MAP SERVICE] Search places error for '{query}': {err}")
            return []
