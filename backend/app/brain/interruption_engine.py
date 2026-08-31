import re
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.core.logging import logger


class InterruptionType(str, Enum):
    NONE = "NONE"
    STOP_SPEAKING = "STOP_SPEAKING"
    CANCEL_TASK = "CANCEL_TASK"
    MODIFY_TASK = "MODIFY_TASK"
    REPLACE_GOAL = "REPLACE_GOAL"
    NEW_INDEPENDENT_GOAL = "NEW_INDEPENDENT_GOAL"


class InterruptionResult(BaseModel):
    is_interruption: bool
    type: InterruptionType
    stop_tts: bool = False
    cancel_active_task: bool = False
    new_user_message: Optional[str] = None
    reasoning: str = ""


class InterruptionEngine:
    """Interruption Hierarchy Engine: Fast-path recognizer for speech interruptions during thinking, acting, and speaking."""

    @staticmethod
    def check_interruption(text: str, is_speaking: bool = False, is_executing: bool = False) -> InterruptionResult:
        """Fast-path check for speech interruption commands."""
        clean = text.strip().lower()

        if not clean:
            return InterruptionResult(is_interruption=False, type=InterruptionType.NONE)

        # 1. Pure Stop / Quiet Command -> STOP_SPEAKING
        if clean in ["stop", "stop speaking", "quiet", "silence", "shh", "shut up", "pause", "wait", "hold on"]:
            logger.info(f"[INTERRUPT] detected type={InterruptionType.STOP_SPEAKING}")
            logger.info("[INTERRUPT] current_goal_cancel_requested")
            return InterruptionResult(
                is_interruption=True,
                type=InterruptionType.STOP_SPEAKING,
                stop_tts=True,
                cancel_active_task=False,
                reasoning="Pure stop command received. Halting TTS playback.",
            )

        # 2. Cancel / Abort / Never Mind -> CANCEL_TASK
        if clean in ["cancel", "cancel that", "abort", "never mind", "forget that", "stop that"]:
            logger.info(f"[INTERRUPT] detected type={InterruptionType.CANCEL_TASK}")
            logger.info("[INTERRUPT] current_goal_cancel_requested")
            logger.info("[INTERRUPT] current_goal_cancelled")
            return InterruptionResult(
                is_interruption=True,
                type=InterruptionType.CANCEL_TASK,
                stop_tts=True,
                cancel_active_task=True,
                reasoning="Task cancellation command received. Aborting active plan execution.",
            )

        # 3. Contextual Result Selection Interruptions (e.g. "Third one", "Play the 3rd one", "First one", "No, the second one")
        selection_patterns = [
            r'^(?:play\s+)?(?:the\s+)?(?:first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|number\s+[1-5]|[1-5])(?:\s+one|\s+video|\s+result)?$',
            r'^(?:no[,\s]+)?(?:play\s+)?(?:the\s+)?(?:first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|number\s+[1-5]|[1-5])(?:\s+one|\s+video|\s+result)?$',
        ]
        for pattern in selection_patterns:
            if re.match(pattern, clean):
                logger.info(f"[INTERRUPT] detected type={InterruptionType.MODIFY_TASK} (Contextual Selection)")
                logger.info("[INTERRUPT] current_goal_cancel_requested")
                logger.info("[TTS] stop_requested=true")
                logger.info("[TTS] playback_stopped=true")
                logger.info("[VOICE] interruption_detected=true")
                logger.info("[ATTENTION] user_interruption=true")

                return InterruptionResult(
                    is_interruption=True,
                    type=InterruptionType.MODIFY_TASK,
                    stop_tts=True,
                    cancel_active_task=False,
                    new_user_message=text,
                    reasoning=f"Contextual selection interruption detected: '{text}'. Stopping audio and executing selection.",
                )

        # 4. Replace Goal / Correction -> REPLACE_GOAL (e.g. "Actually, open VS Code instead", "No, check RAM")
        replace_patterns = [
            r'^(?:no|actually|instead|forget that|cancel that)[\s,]+(?:open|run|check|launch|do|go to)\b',
            r'\b(?:instead of|rather than)\b',
            r'^no[\s,]+(?:just|open|check)\b'
        ]
        for pattern in replace_patterns:
            if re.search(pattern, clean):
                logger.info(f"[INTERRUPT] detected type={InterruptionType.REPLACE_GOAL}")
                logger.info("[INTERRUPT] current_goal_cancel_requested")
                logger.info("[INTERRUPT] current_goal_cancelled")
                logger.info("[INTERRUPT] new_goal_started")

                replacement_text = re.sub(r'^(?:no|actually|instead|forget that|cancel that)[\s,]+', '', text, flags=re.IGNORECASE).strip()

                return InterruptionResult(
                    is_interruption=True,
                    type=InterruptionType.REPLACE_GOAL,
                    stop_tts=True,
                    cancel_active_task=True,
                    new_user_message=replacement_text or text,
                    reasoning=f"Goal replacement phrase detected. Superseding current goal with '{replacement_text}'.",
                )

        # 5. Modify Active Task -> MODIFY_TASK (e.g. "Actually use Git Bash", "No, 10 items")
        modify_patterns = [
            r'^(?:no|actually)[\s,]+(?:use|make it|with|in)\b'
        ]
        for pattern in modify_patterns:
            if re.search(pattern, clean):
                logger.info(f"[INTERRUPT] detected type={InterruptionType.MODIFY_TASK}")
                return InterruptionResult(
                    is_interruption=True,
                    type=InterruptionType.MODIFY_TASK,
                    stop_tts=True,
                    cancel_active_task=False,
                    new_user_message=text,
                    reasoning="Task modification phrase detected.",
                )

        return InterruptionResult(is_interruption=False, type=InterruptionType.NONE)
