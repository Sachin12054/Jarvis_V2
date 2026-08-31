import os
import socket
import httpx
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.core.config import settings
from app.core.logging import logger


class ProjectContextResult(BaseModel):
    workspace_root: str
    backend_path: str
    frontend_path: str
    is_backend_running: bool
    backend_port: int = 8000
    backend_health_url: str = "http://127.0.0.1:8000/api/v1/health"
    recommended_startup_cmd: str = "uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
    status_detail: str = ""


class ProjectContextService:
    """Project Workspace Context Service: Inspects local project structure, active process state, ports, and environment."""

    _instance: Optional["ProjectContextService"] = None

    def __init__(self):
        self.workspace_root = os.path.abspath(settings.JARVIS_WORKSPACE_ROOT)
        self.backend_dir = os.path.join(self.workspace_root, "backend")
        self.frontend_dir = os.path.join(self.workspace_root, "frontend")

    @classmethod
    def get_instance(cls) -> "ProjectContextService":
        if cls._instance is None:
            cls._instance = ProjectContextService()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    def check_port_open(self, host: str = "127.0.0.1", port: int = 8000) -> bool:
        """Checks if a local TCP port is bound and accepting connections."""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0

    async def verify_backend_health(self) -> bool:
        """Sends HTTP request to GET /api/v1/health to empirically verify backend operational status."""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get("http://127.0.0.1:8000/api/v1/health")
                return res.status_code == 200
        except Exception:
            return False

    async def inspect_workspace(self) -> ProjectContextResult:
        """Inspects JARVIS workspace directory, active port 8000, and HTTP health endpoint."""
        port_active = self.check_port_open("127.0.0.1", 8000)
        is_healthy = False

        if port_active:
            is_healthy = await self.verify_backend_health()

        status_msg = (
            "JARVIS backend is active and healthy on port 8000 (HTTP 200 OK)."
            if is_healthy
            else "JARVIS backend port 8000 is not active or responding."
        )

        logger.info(f"[PROJECT CONTEXT] workspace_inspected root='{self.workspace_root}' port_8000={port_active} healthy={is_healthy}")

        return ProjectContextResult(
            workspace_root=self.workspace_root,
            backend_path=self.backend_dir,
            frontend_path=self.frontend_dir,
            is_backend_running=is_healthy,
            backend_port=8000,
            status_detail=status_msg,
        )
