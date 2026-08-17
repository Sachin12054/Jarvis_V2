from fastapi import APIRouter
from app.schemas.common import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint suitable for container and service readiness monitoring."""
    return HealthResponse(status="healthy")
