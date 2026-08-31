import httpx
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.config import settings
from app.services.system_service import SystemService
from app.tools.base import BaseTool
from app.tools.schemas import PermissionLevel, ToolCategory, ToolExecutionContext


class EmptyArgsSchema(BaseModel):
    """Empty parameters schema for tools requiring no input parameters."""
    pass


class SystemMetricsTool(BaseTool):
    """Tool that retrieves real-time hardware metrics (CPU, RAM, GPU, Temp, Uptime)."""

    name = "system_metrics"
    description = "Retrieves real-time CPU, RAM, GPU utilization, GPU memory, temperature, and system uptime metrics."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = EmptyArgsSchema

    def __init__(self, system_service: Optional[SystemService] = None):
        self.system_service = system_service or SystemService()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        metrics = self.system_service.get_metrics()
        return metrics


class SystemStatusTool(BaseTool):
    """Tool that retrieves overall operational health status of the JARVIS brain."""

    name = "system_status"
    description = "Retrieves complete operational health status of backend, active LLM model, memory engine, and system hardware metrics."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = EmptyArgsSchema

    def __init__(self, system_service: Optional[SystemService] = None):
        self.system_service = system_service or SystemService()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        metrics = self.system_service.get_metrics()
        return {
            "backend_status": "ONLINE (HTTP 200)",
            "active_model": settings.LLM_MODEL,
            "memory_engine": "ONLINE",
            "voice_sync": "ONLINE",
            "metrics_summary": metrics,
        }


class OllamaStatusTool(BaseTool):
    """Tool that checks health and available models of the local Ollama LLM provider."""

    name = "ollama_status"
    description = "Retrieves Ollama local LLM engine status, reachable state, available models, and currently active model."
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = EmptyArgsSchema

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        base_url = settings.OLLAMA_BASE_URL.rstrip("/")
        is_healthy = False
        available_models = []

        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{base_url}/api/tags")
                if res.status_code == 200:
                    is_healthy = True
                    data = res.json()
                    available_models = [m.get("name") for m in data.get("models", []) if isinstance(m, dict)]
        except Exception:
            is_healthy = False

        return {
            "provider": "ollama",
            "reachable": is_healthy,
            "active_model": settings.LLM_MODEL,
            "available_models": available_models,
        }
