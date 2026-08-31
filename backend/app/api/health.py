import httpx
from fastapi import APIRouter
from app.core.config import settings
from app.execution.cua_driver_client import CuaDriverClient
from app.schemas.common import HealthResponse
from app.core.logging import logger

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check for container, Ollama, Qwen3 model, CUA Driver, and system readiness."""
    ollama_url = getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434")
    model_name = getattr(settings, "OLLAMA_MODEL", "qwen3-test:latest")

    ollama_ok = False
    model_loaded = False
    cua_ok = False
    cua_daemon_ok = False

    # Check Ollama & qwen3-test
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            res = await client.get(f"{ollama_url.rstrip('/')}/api/tags")
            if res.status_code == 200:
                ollama_ok = True
                data = res.json()
                models = [m.get("name") for m in data.get("models", [])]
                if model_name in models or any(model_name in m for m in models):
                    model_loaded = True
    except Exception as err:
        logger.warning(f"[HEALTH CHECK] Ollama check error: {err}")

    # Check CUA Driver
    cua_client = CuaDriverClient.get_instance()
    cua_ok = cua_client.is_binary_available()
    if cua_ok:
        cua_daemon_ok = await cua_client.ensure_daemon_running()

    overall_healthy = ollama_ok and model_loaded and cua_daemon_ok

    return {
        "status": "healthy" if overall_healthy else "degraded",
        "ollama": {
            "available": ollama_ok,
            "base_url": ollama_url,
            "reasoning_model": model_name,
            "model_ready": model_loaded,
            "context_length": getattr(settings, "OLLAMA_CONTEXT_LENGTH", 16384),
        },
        "cua_driver": {
            "binary_available": cua_ok,
            "path": cua_client.cua_binary_path,
            "daemon_listening": cua_daemon_ok,
            "pipe": cua_client.socket_pipe,
        },
    }
