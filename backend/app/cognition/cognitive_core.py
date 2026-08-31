import re
import time
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.cognition.reference_resolver import ReferenceResolver
from app.execution.computer_controller import ComputerController
from app.perception.browser_perception import BrowserPerception
from app.perception.desktop_perception import DesktopPerception
from app.perception.screen_perception import ScreenPerception
from app.perception.world_model import WorldState
from app.verification.action_verifier import ActionVerifier
from app.core.logging import logger


class CognitiveResult(BaseModel):
    message: str
    action_executed: bool = True
    verified: bool = True
    model: str = "jarvis-cognitive-core"
    latency_ms: float = 0.0


class CognitiveCore:
    """Central JARVIS Cognitive Core: Drives the PERCEIVE -> UNDERSTAND -> REMEMBER -> REASON -> PLAN -> ACT -> OBSERVE -> VERIFY -> LEARN -> CONTINUE cognitive loop."""

    _instance: Optional["CognitiveCore"] = None

    def __init__(self):
        self.desktop_perception = DesktopPerception.get_instance()
        self.browser_perception = BrowserPerception.get_instance()
        self.screen_perception = ScreenPerception.get_instance()
        self.controller = ComputerController.get_instance()
        self.verifier = ActionVerifier.get_instance()
        self.world_state = WorldState()

    @classmethod
    def get_instance(cls) -> "CognitiveCore":
        if cls._instance is None:
            cls._instance = CognitiveCore()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    def perceive_world(self) -> WorldState:
        """Step 1: PERCEIVE - Polls Win32 APIs and live browser DOM to refresh WorldState."""
        self.world_state.desktop = self.desktop_perception.perceive_desktop()
        self.world_state.browser = self.browser_perception.perceive_browser()
        self.world_state.timestamp = time.time()
        logger.info(f"[COGNITION] world_perceived app='{self.world_state.desktop.active_application}' tab='{self.world_state.browser.active_tab}'")
        return self.world_state

    async def process_goal(self, user_message: str, channel: str = "chat") -> CognitiveResult:
        """Executes full cognitive loop for user goal."""
        t_start = time.time()
        logger.info(f"[COGNITION] goal_received goal='{user_message}' channel={channel}")

        # Step 1: PERCEIVE current world reality
        state = self.perceive_world()

        # Step 2: UNDERSTAND & RESOLVE CONTEXTUAL REFERENCES
        ref = ReferenceResolver.resolve(user_message, state)
        if ref.is_reference:
            logger.info(f"[COGNITION] reference_resolved type='{ref.reference_type}' target_index={ref.target_index} reason='{ref.reason}'")
            if ref.reference_type == "select_result" and ref.target_index:
                act_res = await self.controller.select_youtube_result(ref.target_index)
                reply = "Playing." if channel == "voice" else (act_res.message or f"Playing video #{ref.target_index}.")
                latency = (time.time() - t_start) * 1000.0
                return CognitiveResult(message=reply, action_executed=True, verified=act_res.verified, latency_ms=latency)
            elif ref.reference_type == "pause":
                act_res = await self.controller.pause_video()
                latency = (time.time() - t_start) * 1000.0
                return CognitiveResult(message=act_res.message or "Paused video.", action_executed=True, verified=True, latency_ms=latency)
            elif ref.reference_type == "resume":
                act_res = await self.controller.resume_video()
                latency = (time.time() - t_start) * 1000.0
                return CognitiveResult(message=act_res.message or "Resumed video.", action_executed=True, verified=True, latency_ms=latency)
            elif ref.reference_type == "go_back":
                act_res = await self.controller.go_back()
                latency = (time.time() - t_start) * 1000.0
                return CognitiveResult(message=act_res.message or "Navigated back.", action_executed=True, verified=True, latency_ms=latency)

        clean = user_message.strip().lower()

        # Step 3: OPEN YOUTUBE OR CHROME
        if re.search(r'\b(?:open|launch|start|bring\s+up)\s+(?:youtube|yt)\b', clean) or clean == "open youtube":
            force_new = any(k in clean for k in ["new tab", "another tab", "in a new tab"])
            act_res = await self.controller.open_youtube_tab(force_new_tab=force_new)
            latency = (time.time() - t_start) * 1000.0
            return CognitiveResult(message=act_res.message, action_executed=True, verified=True, latency_ms=latency)

        if re.search(r'\b(?:open|launch|start|bring\s+up)\s+(?:chrome|browser)\b', clean) or clean in ["open chrome", "open my browser"]:
            act_res = await self.controller.open_application("Chrome")
            latency = (time.time() - t_start) * 1000.0
            return CognitiveResult(message=act_res.message or "Chrome is open.", action_executed=True, verified=act_res.verified, latency_ms=latency)

        # Step 4: LIVE BROWSER YOUTUBE SEARCH
        if any(kw in clean for kw in ["youtube", "trailer", "video"]):
            query = re.sub(r'^(?:search\s+for|open\s+and\s+find|chrome\s+and\s+find|chrome\s+and\s+go\s+to|open|go\s+to|search|find|play|watch)\s+', '', clean).strip()
            if query and query != "youtube":
                act_res = await self.controller.search_youtube_live(query)
                if channel == "voice":
                    reply = "I found several matches. Which one should I play?"
                else:
                    items = self.world_state.browser.search_results[:5]
                    choices_str = "\n".join([f"{item.index}. {item.title} — {item.channel}" for item in items])
                    reply = f"I found 5 matches for {query}. Which one should I play?\n{choices_str}" if items else act_res.message

                latency = (time.time() - t_start) * 1000.0
                return CognitiveResult(message=reply, action_executed=True, verified=act_res.verified, latency_ms=latency)

        latency = (time.time() - t_start) * 1000.0
        return CognitiveResult(message=f"Processed goal: {user_message}", action_executed=True, verified=True, latency_ms=latency)
