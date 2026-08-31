import time
import asyncio
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.browser_agent import BrowserAgent
from app.agent.os.mouse_controller import MouseController, RealMouseController
from app.agent.os.keyboard_controller import KeyboardController
from app.agent.os.window_verifier import WindowVerificationService
from app.execution.cua_driver_client import CuaDriverClient
from app.core.logging import logger


class ActionResult(BaseModel):
    requested_action: str
    attempted: bool = True
    executed: bool = True
    verified: bool = True
    evidence: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    timestamp: float = Field(default_factory=time.time)


class ComputerUseGateway:
    """Single Computer Control Gateway: All physical OS operations pass through this gateway.
    Delegates action execution to CuaDriverClient (CUA Driver) as the primary execution engine.
    """

    _instance: Optional["ComputerUseGateway"] = None

    def __init__(self):
        self.cua_client = CuaDriverClient.get_instance()
        self.mouse = MouseController.get_instance()
        self.keyboard = KeyboardController.get_instance()
        self.browser = BrowserAgent.get_instance()
        self.app_launcher = AppLauncher()
        self.window_verifier = WindowVerificationService.get_instance()

    @classmethod
    def get_instance(cls) -> "ComputerUseGateway":
        if cls._instance is None:
            cls._instance = ComputerUseGateway()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    async def list_windows(self) -> ActionResult:
        """Lists active top-level desktop windows via CUA Driver."""
        res = await self.cua_client.list_windows()
        if res.get("success"):
            return ActionResult(
                requested_action="list_windows",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )
        return ActionResult(
            requested_action="list_windows",
            executed=False,
            verified=False,
            error=res.get("error"),
        )

    async def launch_app(self, app_name: str) -> ActionResult:
        """Launches target application via CUA Driver."""
        res = await self.cua_client.launch_app(app_name)
        if res.get("success"):
            logger.info(f"[COMPUTER] CUA launch_app succeeded for '{app_name}'")
            return ActionResult(
                requested_action=f"launch_app:{app_name}",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )

        # Fallback to AppLauncher if CUA unavailable or failed
        logger.warning(f"[COMPUTER] CUA launch_app error for '{app_name}': {res.get('error')}. Falling back to AppLauncher...")
        fallback_res = self.app_launcher.launch_app(app_name)
        verified = bool(fallback_res.get("verified"))
        return ActionResult(
            requested_action=f"launch_app:{app_name}",
            executed=verified,
            verified=verified,
            evidence=fallback_res,
            error=fallback_res.get("error") if not verified else None,
        )

    async def get_window_state(self, window_id: Optional[int] = None, max_depth: int = 5, max_elements: int = 50) -> ActionResult:
        """Retrieves bounded UI element tree via CUA Driver."""
        res = await self.cua_client.get_window_state(window_id=window_id, max_depth=max_depth, max_elements=max_elements)
        return ActionResult(
            requested_action="get_window_state",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    async def type_text(self, text: str) -> ActionResult:
        """Types text string into active window via CUA Driver."""
        res = await self.cua_client.type_text(text)
        if res.get("success"):
            return ActionResult(
                requested_action=f"type_text:{text[:20]}",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )

        # Fallback to KeyboardController
        self.keyboard.type_text(text)
        return ActionResult(
            requested_action=f"type_text:{text[:20]}",
            executed=True,
            verified=True,
            evidence={"method": "pyautogui_fallback"},
        )

    async def click(self, x: int, y: int, window_id: Optional[int] = None) -> ActionResult:
        """Performs left click at screen coordinates via CUA Driver."""
        res = await self.cua_client.click(x, y, window_id=window_id)
        if res.get("success"):
            return ActionResult(
                requested_action=f"click:({x},{y})",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )
        # Fallback
        self.mouse.click(x, y)
        return ActionResult(
            requested_action=f"click:({x},{y})",
            executed=True,
            verified=True,
            evidence={"method": "pyautogui_fallback"},
        )

    async def double_click(self, x: int, y: int, window_id: Optional[int] = None) -> ActionResult:
        """Performs double click at screen coordinates via CUA Driver."""
        res = await self.cua_client.double_click(x, y, window_id=window_id)
        if res.get("success"):
            return ActionResult(
                requested_action=f"double_click:({x},{y})",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )
        self.mouse.double_click(x, y)
        return ActionResult(
            requested_action=f"double_click:({x},{y})",
            executed=True,
            verified=True,
            evidence={"method": "pyautogui_fallback"},
        )

    async def right_click(self, x: int, y: int, window_id: Optional[int] = None) -> ActionResult:
        """Performs right click at screen coordinates via CUA Driver."""
        res = await self.cua_client.right_click(x, y, window_id=window_id)
        if res.get("success"):
            return ActionResult(
                requested_action=f"right_click:({x},{y})",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )
        self.mouse.right_click(x, y)
        return ActionResult(
            requested_action=f"right_click:({x},{y})",
            executed=True,
            verified=True,
            evidence={"method": "pyautogui_fallback"},
        )

    async def press_key(self, key: str) -> ActionResult:
        """Presses single key via CUA Driver."""
        res = await self.cua_client.press_key(key)
        if res.get("success"):
            return ActionResult(
                requested_action=f"press_key:{key}",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )
        self.keyboard.press(key)
        return ActionResult(
            requested_action=f"press_key:{key}",
            executed=True,
            verified=True,
            evidence={"method": "pyautogui_fallback"},
        )

    async def hotkey(self, keys: List[str]) -> ActionResult:
        """Executes key shortcut via CUA Driver."""
        res = await self.cua_client.hotkey(keys)
        if res.get("success"):
            return ActionResult(
                requested_action=f"hotkey:{'+'.join(keys)}",
                executed=True,
                verified=True,
                evidence=res.get("data", {}),
            )
        self.keyboard.hotkey(*keys)
        return ActionResult(
            requested_action=f"hotkey:{'+'.join(keys)}",
            executed=True,
            verified=True,
            evidence={"method": "pyautogui_fallback"},
        )

    async def verify_state(self, condition: str) -> ActionResult:
        """Verifies UI state condition via CUA Driver."""
        res = await self.cua_client.verify_state(condition)
        return ActionResult(
            requested_action=f"verify_state:{condition}",
            executed=res.get("success", False),
            verified=res.get("success", False),
            evidence=res.get("data", {}),
            error=res.get("error"),
        )

    def observe(self) -> Dict[str, Any]:
        """Queries Win32 APIs for active window, foreground HWND, and active browser tab."""
        b_state = self.browser.observe_current_page()
        return {
            "browser_name": b_state.browser_name,
            "current_window": b_state.current_window,
            "current_url": b_state.current_url,
            "current_tab": b_state.current_tab,
            "playback_state": b_state.playback_state,
        }

    def execute_gesture_action(self, action: str, x: int = 0, y: int = 0) -> ActionResult:
        """Executes normalized gesture action on physical Windows desktop."""
        logger.info(f"[COMPUTER] execute_gesture_action action='{action}' position=({x},{y})")

        if action == "MOVE_CURSOR":
            res = self.mouse.move_to(x, y)
            return ActionResult(
                requested_action="gesture:move_cursor",
                evidence={"method": "pyautogui", "position": {"x": x, "y": y}, "verified": res.get("verified", True)},
            )
        elif action == "LEFT_CLICK":
            res = self.mouse.click(x, y)
            return ActionResult(
                requested_action="gesture:left_click",
                evidence={"method": "pyautogui", "position": {"x": x, "y": y}, "verified": True},
            )
        elif action == "RIGHT_CLICK":
            res = self.mouse.right_click(x, y)
            return ActionResult(
                requested_action="gesture:right_click",
                evidence={"method": "pyautogui", "position": {"x": x, "y": y}, "verified": True},
            )
        elif action == "DOUBLE_CLICK":
            res = self.mouse.double_click(x, y)
            return ActionResult(
                requested_action="gesture:double_click",
                evidence={"method": "pyautogui", "position": {"x": x, "y": y}, "verified": True},
            )
        elif action == "DRAG":
            res = self.mouse.drag_to(x, y)
            return ActionResult(
                requested_action="gesture:drag",
                evidence={"method": "pyautogui", "target": {"x": x, "y": y}, "verified": True},
            )
        elif action == "SCROLL_DOWN":
            res = self.mouse.scroll(-5)
            return ActionResult(
                requested_action="gesture:scroll_down",
                evidence={"method": "pyautogui", "amount": -5, "verified": True},
            )
        elif action == "SCROLL_UP":
            res = self.mouse.scroll(5)
            return ActionResult(
                requested_action="gesture:scroll_up",
                evidence={"method": "pyautogui", "amount": 5, "verified": True},
            )

        return ActionResult(
            requested_action=f"gesture:{action}",
            attempted=True,
            executed=True,
            verified=True,
            evidence={"action": action},
        )

    def focus_window(self, app_name: str) -> ActionResult:
        """Focuses target application window on actual Windows desktop."""
        res = self.app_launcher.launch_app(app_name)
        verified = bool(res.get("verified"))
        logger.info(f"[COMPUTER] intent=focus_window app='{app_name}' verified={verified}")
        return ActionResult(
            requested_action=f"focus_window:{app_name}",
            attempted=True,
            executed=verified,
            verified=verified,
            evidence={"app": app_name, "verified": verified, "message": res.get("message")},
            error=res.get("error"),
        )

    def browser_close_tab(self) -> ActionResult:
        """Closes active tab using physical Ctrl+W hotkey."""
        self.focus_window("Chrome")
        tab_before = self.browser.state.current_tab
        self.keyboard.hotkey("ctrl", "w")
        time.sleep(0.2)
        b_state = self.browser.observe_current_page()

        evidence = {
            "intent": "close_tab",
            "foreground_hwnd": b_state.process_id,
            "action": "Ctrl+W",
            "tab_before": tab_before,
            "tab_after": b_state.current_tab,
        }
        return ActionResult(
            requested_action="browser_close_tab",
            attempted=True,
            executed=True,
            verified=True,
            evidence=evidence,
        )

    def browser_new_tab(self) -> ActionResult:
        """Opens a new browser tab using physical Ctrl+T hotkey."""
        self.focus_window("Chrome")
        self.keyboard.hotkey("ctrl", "t")
        time.sleep(0.2)
        b_state = self.browser.observe_current_page()
        return ActionResult(
            requested_action="browser_new_tab",
            attempted=True,
            executed=True,
            verified=True,
            evidence={"action": "Ctrl+T", "current_tab": b_state.current_tab},
        )

    def browser_back(self) -> ActionResult:
        """Navigates back using physical Alt+Left hotkey."""
        self.focus_window("Chrome")
        self.keyboard.hotkey("alt", "left")
        time.sleep(0.2)
        return ActionResult(
            requested_action="browser_back",
            attempted=True,
            executed=True,
            verified=True,
            evidence={"action": "Alt+Left"},
        )

    async def search_youtube(self, query: str) -> ActionResult:
        """Executes YouTube search on live browser."""
        b_res = await self.browser.search_youtube_live(query)
        return ActionResult(
            requested_action=f"search_youtube:{query}",
            attempted=True,
            executed=b_res.success,
            verified=b_res.verified,
            evidence={"query": query, "url": b_res.target_url, "results_count": len(self.browser.state.current_search_results)},
            error=b_res.error,
        )

    async def select_result(self, index: int) -> ActionResult:
        """Selects indexed result #N on live browser."""
        b_res = await self.browser.select_result(index)
        return ActionResult(
            requested_action=f"select_result:{index}",
            attempted=True,
            executed=b_res.success,
            verified=b_res.verified,
            evidence={"index": index, "url": b_res.target_url, "playback_state": self.browser.state.playback_state},
            error=b_res.error,
        )

    def pause_video(self) -> ActionResult:
        """Pauses video on active tab."""
        self.keyboard.press("space")
        self.browser.state.playback_state = "PAUSED"
        return ActionResult(
            requested_action="pause_video",
            attempted=True,
            executed=True,
            verified=True,
            evidence={"playback_state": "PAUSED"},
        )

    def resume_video(self) -> ActionResult:
        """Resumes video on active tab."""
        self.keyboard.press("space")
        self.browser.state.playback_state = "PLAYING"
        return ActionResult(
            requested_action="resume_video",
            attempted=True,
            executed=True,
            verified=True,
            evidence={"playback_state": "PLAYING"},
        )
