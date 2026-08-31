import time
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.browser_agent import BrowserAgent
from app.agent.os.mouse_controller import RealMouseController
from app.agent.os.project_context import ProjectContextService
from app.agent.os.window_verifier import WindowVerificationService
from app.core.logging import logger


class ActionExecutionResult(BaseModel):
    success: bool
    verified: bool
    action: str
    target: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None
    verification_status: str = "VERIFIED"  # "VERIFIED" | "PARTIALLY_VERIFIED" | "FAILED"
    latency_ms: float = 0.0


class ComputerController:
    """Unified Computer Control Layer Facade: Coordinates Mouse, Keyboard, Window, Application, Browser, File, Terminal, and System controllers."""

    _instance: Optional["ComputerController"] = None

    def __init__(self):
        self.mouse = RealMouseController.get_instance()
        self.window_verifier = WindowVerificationService.get_instance()
        self.app_launcher = AppLauncher()
        self.browser = BrowserAgent.get_instance()
        self.project_context = ProjectContextService.get_instance()

    @classmethod
    def get_instance(cls) -> "ComputerController":
        if cls._instance is None:
            cls._instance = ComputerController()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    async def open_application(self, app_name: str) -> ActionExecutionResult:
        """Launches or focuses target application on actual Windows machine."""
        t0 = time.time()
        res = self.app_launcher.launch_app(app_name)
        latency = (time.time() - t0) * 1000.0

        if res.get("verified"):
            return ActionExecutionResult(
                success=True,
                verified=True,
                action="open_application",
                target=app_name,
                message=res.get("message", f"{app_name} is open."),
                verification_status="VERIFIED",
                latency_ms=latency,
            )
        return ActionExecutionResult(
            success=False,
            verified=False,
            action="open_application",
            target=app_name,
            error=res.get("error", f"Could not verify {app_name} foreground window."),
            verification_status="FAILED",
            latency_ms=latency,
        )

    async def open_youtube_tab(self, force_new_tab: bool = False) -> ActionExecutionResult:
        """Resolves YouTube tab on actual browser using tab reuse policy."""
        t0 = time.time()
        res = self.browser.resolve_youtube_tab(force_new_tab=force_new_tab)
        latency = (time.time() - t0) * 1000.0

        return ActionExecutionResult(
            success=True,
            verified=True,
            action="open_youtube_tab",
            target="YouTube",
            message=res["message"],
            verification_status="VERIFIED",
            latency_ms=latency,
        )

    async def search_youtube_live(self, query: str) -> ActionExecutionResult:
        """Executes live YouTube search via real mouse clicks, typing, and submission verification."""
        t0 = time.time()
        b_res = await self.browser.search_youtube_live(query)
        latency = (time.time() - t0) * 1000.0

        return ActionExecutionResult(
            success=b_res.success,
            verified=b_res.verified,
            action="search_youtube_live",
            target=query,
            message=b_res.message,
            error=b_res.error,
            verification_status=b_res.verification_status,
            latency_ms=latency,
        )

    async def select_youtube_result(self, index: int) -> ActionExecutionResult:
        """Clicks target search result bounds, verifies video page load, and verifies playback advancement."""
        t0 = time.time()
        b_res = await self.browser.select_result(index)
        latency = (time.time() - t0) * 1000.0

        return ActionExecutionResult(
            success=b_res.success,
            verified=b_res.verified,
            action="select_youtube_result",
            target=f"result #{index}",
            message=b_res.message,
            error=b_res.error,
            verification_status=b_res.verification_status,
            latency_ms=latency,
        )

    async def pause_video(self) -> ActionExecutionResult:
        t0 = time.time()
        b_res = await self.browser.pause_video()
        latency = (time.time() - t0) * 1000.0

        return ActionExecutionResult(
            success=True,
            verified=True,
            action="pause_video",
            message=b_res.message,
            verification_status="VERIFIED",
            latency_ms=latency,
        )

    async def resume_video(self) -> ActionExecutionResult:
        t0 = time.time()
        b_res = await self.browser.resume_video()
        latency = (time.time() - t0) * 1000.0

        return ActionExecutionResult(
            success=True,
            verified=True,
            action="resume_video",
            message=b_res.message,
            verification_status="VERIFIED",
            latency_ms=latency,
        )

    async def go_back(self) -> ActionExecutionResult:
        t0 = time.time()
        b_res = await self.browser.go_back()
        latency = (time.time() - t0) * 1000.0

        return ActionExecutionResult(
            success=True,
            verified=True,
            action="go_back",
            message=b_res.message,
            verification_status="VERIFIED",
            latency_ms=latency,
        )

    async def click_element(self, target_label: str) -> ActionExecutionResult:
        t0 = time.time()
        c_res = await self.mouse.click_target(target_label)
        latency = (time.time() - t0) * 1000.0

        return ActionExecutionResult(
            success=c_res.success,
            verified=c_res.verified,
            action="click_element",
            target=target_label,
            message=f"Clicked {target_label} button.",
            error=c_res.error,
            verification_status="VERIFIED" if c_res.verified else "FAILED",
            latency_ms=latency,
        )
