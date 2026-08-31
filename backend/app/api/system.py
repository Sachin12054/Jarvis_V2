import httpx
from fastapi import APIRouter
from app.schemas.system import SystemMetricsResponse, ModelStatusResponse
from app.services.system_service import SystemService
from app.core.config import settings

router = APIRouter(prefix="/api/v1/system", tags=["system"])
system_service = SystemService()

@router.get("/metrics", response_model=SystemMetricsResponse)
async def get_system_metrics():
    """Retrieve real local machine system metrics (CPU, RAM, GPU, Temp, Uptime)."""
    return system_service.get_metrics()

@router.get("/model", response_model=ModelStatusResponse)
async def get_model_status():
    """Retrieve real-time LLM model status (Ollama connectivity check)."""
    provider = settings.LLM_PROVIDER
    model = settings.OLLAMA_MODEL
    status = "offline"

    if provider.lower() == "ollama":
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/tags")
                if res.status_code == 200:
                    status = "online"
        except Exception:
            status = "offline"
    else:
        status = "online"

    return ModelStatusResponse(
        provider=provider,
        model=model,
        status=status,
    )
