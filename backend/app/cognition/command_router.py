import re
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.execution.computer_gateway import ComputerUseGateway, ActionResult
from app.agent.os.gesture_service import GestureControlService
from app.core.logging import logger


class RoutedCommand(BaseModel):
    is_routed: bool
    priority: int
    command_type: str
    action_result: Optional[ActionResult] = None
    response_message: Optional[str] = None


class CommandRouter:
    """Command Router: Enforces strict priority precedence to route physical computer actions BEFORE normal chat or search logic."""

    @classmethod
    async def route(cls, user_message: str, channel: str = "chat") -> RoutedCommand:
        clean = re.sub(r'[^\w\s]', ' ', user_message.strip().lower()).strip()
        clean = re.sub(r'\s+', ' ', clean)
        gateway = ComputerUseGateway.get_instance()

        # Priority 0: Emergency Interruption / Stop
        if clean in ["stop", "cancel", "stop speaking", "shut up", "abort"]:
            logger.info(f"[ROUTER] Priority 0 matched: command_type='stop' clean='{clean}'")
            return RoutedCommand(
                is_routed=True,
                priority=0,
                command_type="stop",
                response_message="Stopped.",
            )

        # Priority 1: Gesture Control Lifecycle Commands
        if any(phrase in clean for phrase in ["enable gesture", "turn on gesture", "activate gesture"]):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='enable_gesture' clean='{clean}'")
            res = GestureControlService.get_instance().enable_gesture_control()
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="enable_gesture",
                response_message=res["message"],
            )

        if any(phrase in clean for phrase in ["disable gesture", "turn off gesture", "deactivate gesture"]):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='disable_gesture' clean='{clean}'")
            res = GestureControlService.get_instance().disable_gesture_control()
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="disable_gesture",
                response_message=res["message"],
            )

        # Priority 1: Direct Physical Application Launch & Focus Commands
        if re.search(r'\b(?:open|launch|start|bring\s+up|get)\s+(?:my\s+)?(?:google\s+)?chrome\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='open_chrome' clean='{clean}'")
            res = await gateway.focus_window("Chrome")
            reply = "Chrome is open." if res.verified else "Couldn't open Chrome."
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="open_chrome",
                action_result=res,
                response_message=reply,
            )

        if re.search(r'\b(?:open|launch|start|switch\s+to)\s+(?:vs\s*code|visual\s+studio\s+code|code)\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='open_vscode' clean='{clean}'")
            res = await gateway.focus_window("VS Code")
            reply = "VS Code is open." if res.verified else "Couldn't open VS Code."
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="open_vscode",
                action_result=res,
                response_message=reply,
            )

        if re.search(r'\b(?:open|launch|start)\s+notepad\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='open_notepad' clean='{clean}'")
            res = await gateway.focus_window("Notepad")
            reply = "Notepad is open." if res.verified else "Couldn't open Notepad."
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="open_notepad",
                action_result=res,
                response_message=reply,
            )

        if re.search(r'\b(?:open|launch|start|get)\s+youtube\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='open_youtube' clean='{clean}'")
            res = await gateway.focus_window("YouTube")
            reply = "YouTube is ready." if res.verified else "Couldn't open YouTube."
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="open_youtube",
                action_result=res,
                response_message=reply,
            )

        # Priority 1: Direct Physical Tab / Window / Media Commands
        if re.search(r'\b(?:close\s+the\s+tab|close\s+this\s+tab|close\s+tab|get\s+rid\s+of\s+this\s+tab)\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='close_tab' clean='{clean}'")
            res = await gateway.browser_close_tab()
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="close_tab",
                action_result=res,
                response_message="Closed tab.",
            )

        if re.search(r'\b(?:new\s+tab|open\s+another\s+tab|create\s+tab)\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='new_tab' clean='{clean}'")
            res = await gateway.browser_new_tab()
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="new_tab",
                action_result=res,
                response_message="Opened new tab.",
            )

        if re.search(r'\b(?:go\s+back|previous\s+page|take\s+me\s+back|back)\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='browser_back' clean='{clean}'")
            res = await gateway.browser_back()
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="browser_back",
                action_result=res,
                response_message="Navigated back.",
            )

        if re.search(r'\b(?:scroll\s+down|scroll\s+a\s+little\s+down)\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='scroll_down' clean='{clean}'")
            res = await gateway.execute_gesture_action("SCROLL_DOWN")
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="scroll_down",
                action_result=res,
                response_message="Scrolled down.",
            )

        if re.search(r'\b(?:scroll\s+up|scroll\s+a\s+little\s+up)\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='scroll_up' clean='{clean}'")
            res = await gateway.execute_gesture_action("SCROLL_UP")
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="scroll_up",
                action_result=res,
                response_message="Scrolled up.",
            )

        if re.search(r'\b(?:pause|pause\s+it|pause\s+video|freeze)\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='pause_video' clean='{clean}'")
            res = await gateway.pause_video()
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="pause_video",
                action_result=res,
                response_message="Paused video.",
            )

        if re.search(r'\b(?:resume|unpause|continue\s+playing|play\s+it)\b', clean):
            logger.info(f"[ROUTER] Priority 1 matched: command_type='resume_video' clean='{clean}'")
            res = await gateway.resume_video()
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="resume_video",
                action_result=res,
                response_message="Resumed video.",
            )

        if clean in ["click", "left click", "click here", "press this"]:
            logger.info(f"[ROUTER] Priority 1 matched: command_type='click' clean='{clean}'")
            res = await gateway.execute_gesture_action("LEFT_CLICK")
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="click",
                action_result=res,
                response_message="Clicked.",
            )

        if clean in ["right click", "context menu"]:
            logger.info(f"[ROUTER] Priority 1 matched: command_type='right_click' clean='{clean}'")
            res = await gateway.execute_gesture_action("RIGHT_CLICK")
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="right_click",
                action_result=res,
                response_message="Right clicked.",
            )

        if clean in ["double click"]:
            logger.info(f"[ROUTER] Priority 1 matched: command_type='double_click' clean='{clean}'")
            res = await gateway.execute_gesture_action("DOUBLE_CLICK")
            return RoutedCommand(
                is_routed=True,
                priority=1,
                command_type="double_click",
                action_result=res,
                response_message="Double clicked.",
            )

        # Priority 2: Contextual Result Selection ("first one", "3rd one", "third video", "the 3rd video", "3")
        is_selection_phrase = any(kw in clean for kw in ["one", "video", "result", "option", "play"]) or clean in ["1", "2", "3", "4", "5"]
        if is_selection_phrase:
            idx = None
            if re.search(r'\b(?:first|1st|number\s+1|result\s+1|option\s+1|first\s+one|first\s+video)\b', clean) or clean == "1":
                idx = 1
            elif re.search(r'\b(?:second|2nd|number\s+2|result\s+2|option\s+2|second\s+one|second\s+video)\b', clean) or clean == "2":
                idx = 2
            elif re.search(r'\b(?:third|3rd|number\s+3|result\s+3|option\s+3|third\s+one|the\s+3rd\s+video)\b', clean) or clean == "3":
                idx = 3
            elif re.search(r'\b(?:fourth|4th|number\s+4|result\s+4|option\s+4|fourth\s+one|fourth\s+video)\b', clean) or clean == "4":
                idx = 4
            elif re.search(r'\b(?:fifth|5th|number\s+5|result\s+5|option\s+5|fifth\s+one|fifth\s+video)\b', clean) or clean == "5":
                idx = 5

            if idx is not None:
                logger.info(f"[ROUTER] Priority 2 matched: command_type='select_result' index={idx} clean='{clean}'")
                res = await gateway.select_result(idx)
                reply = "Playing." if channel == "voice" else f"Playing video #{idx}."
                return RoutedCommand(
                    is_routed=True,
                    priority=2,
                    command_type="select_result",
                    action_result=res,
                    response_message=reply,
                )

        return RoutedCommand(is_routed=False, priority=6, command_type="chat")
