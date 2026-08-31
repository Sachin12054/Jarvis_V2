import time
from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.core.logging import logger


class AttentionMode(str, Enum):
    IDLE = "IDLE"
    PASSIVE_LISTENING = "PASSIVE_LISTENING"
    ENGAGED = "ENGAGED"
    THINKING = "THINKING"
    ACTING = "ACTING"
    SPEAKING = "SPEAKING"
    INTERRUPTED = "INTERRUPTED"


class AddressingAnalysis(BaseModel):
    addressed_to_jarvis: bool
    confidence: float
    mode: AttentionMode
    matched_signals: List[str] = Field(default_factory=list)
    reason: str


class AttentionEngine:
    """Continuous Attention Engine with Conversational Lock & Engagement State Machine."""

    _instance: Optional["AttentionEngine"] = None

    def __init__(self):
        self.mode = AttentionMode.IDLE
        self.last_directed_turn_timestamp: float = 0.0
        self.engagement_window_seconds: float = 45.0
        self.pending_clarification_question: Optional[str] = None
        self.voice_mode_active: bool = False

    @classmethod
    def get_instance(cls) -> "AttentionEngine":
        if cls._instance is None:
            cls._instance = AttentionEngine()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    def set_voice_mode(self, active: bool) -> None:
        """Sets continuous Voice Mode state."""
        self.voice_mode_active = active
        if active:
            if self.mode == AttentionMode.IDLE:
                self.mode = AttentionMode.PASSIVE_LISTENING
            logger.info("[ATTENTION] voice_session=ACTIVE mode=PASSIVE_LISTENING")
        else:
            self.mode = AttentionMode.IDLE
            logger.info("[ATTENTION] voice_session=INACTIVE mode=IDLE")

    def record_agent_interaction(self, is_response: bool = True) -> None:
        """Records timestamp of active dialogue turn and locks engagement state."""
        now = time.time()
        self.last_directed_turn_timestamp = now
        if self.voice_mode_active:
            self.mode = AttentionMode.ENGAGED
            logger.info(f"[ATTENTION] engagement_state=ENGAGED window={self.engagement_window_seconds}s timestamp={now}")

    def set_pending_clarification(self, question: Optional[str]) -> None:
        """Sets or clears pending clarification question."""
        self.pending_clarification_question = question
        if question:
            self.mode = AttentionMode.ENGAGED

    def evaluate_addressing(
        self,
        user_message: str,
        channel: str = "chat",
        conversation_history: Optional[List[Dict[str, Any]]] = None,
    ) -> AddressingAnalysis:
        """Evaluates addressing confidence based on conversational lock, engagement window, and direct command structure."""
        clean = user_message.strip().lower()
        matched_signals: List[str] = []
        now = time.time()

        # Text channel is always addressed to JARVIS
        if channel != "voice":
            return AddressingAnalysis(
                addressed_to_jarvis=True,
                confidence=1.0,
                mode=AttentionMode.ENGAGED,
                matched_signals=["text_channel_direct"],
                reason="Text channel requests are directly addressed.",
            )

        # Signal 1: Wake Word Boost ("Hey Jarvis", "Jarvis")
        wake_words = ["hey jarvis", "jarvis", "hi jarvis", "ok jarvis", "hello jarvis", "javis"]
        has_wake_word = any(w in clean for w in wake_words)
        if has_wake_word:
            matched_signals.append("explicit_wake_word")
            self.mode = AttentionMode.ENGAGED
            self.last_directed_turn_timestamp = now
            logger.info(f"[ATTENTION] engagement_state=ENGAGED confidence=0.99 addressed=true matched={matched_signals}")
            return AddressingAnalysis(
                addressed_to_jarvis=True,
                confidence=0.99,
                mode=AttentionMode.ENGAGED,
                matched_signals=matched_signals,
                reason="Explicit wake word detected.",
            )

        # Signal 2: Pending Clarification Question
        if self.pending_clarification_question:
            matched_signals.append("pending_clarification_answer")
            self.mode = AttentionMode.ENGAGED
            logger.info(f"[ATTENTION] engagement_state=ENGAGED confidence=0.95 addressed=true matched={matched_signals}")
            return AddressingAnalysis(
                addressed_to_jarvis=True,
                confidence=0.95,
                mode=AttentionMode.ENGAGED,
                matched_signals=matched_signals,
                reason="Direct answer to pending clarification question.",
            )

        # Signal 3: Active Conversational Lock Window (< 45s)
        time_since_last_turn = now - self.last_directed_turn_timestamp
        is_engaged_window = (self.last_directed_turn_timestamp > 0 and time_since_last_turn <= self.engagement_window_seconds)

        if is_engaged_window or self.mode in [AttentionMode.ENGAGED, AttentionMode.SPEAKING, AttentionMode.THINKING, AttentionMode.ACTING]:
            matched_signals.append(f"conversational_lock_window ({time_since_last_turn:.1f}s)")
            self.mode = AttentionMode.ENGAGED
            logger.info(f"[ATTENTION] engagement_state=ENGAGED confidence=0.92 addressed=true matched={matched_signals}")
            return AddressingAnalysis(
                addressed_to_jarvis=True,
                confidence=0.92,
                mode=AttentionMode.ENGAGED,
                matched_signals=matched_signals,
                reason=f"Within active conversational engagement window ({time_since_last_turn:.1f}s).",
            )

        # Signal 4: Direct OS/Browser Command Structure in Voice Mode
        command_verbs = ["open", "launch", "start", "find", "search", "go to", "click", "show", "what", "how", "stop", "cancel", "run", "bring up", "describe"]
        if any(clean.startswith(v) or f" {v} " in clean for v in command_verbs):
            matched_signals.append("direct_command_structure")
            self.mode = AttentionMode.ENGAGED
            self.last_directed_turn_timestamp = now
            logger.info(f"[ATTENTION] engagement_state=ENGAGED confidence=0.88 addressed=true matched={matched_signals}")
            return AddressingAnalysis(
                addressed_to_jarvis=True,
                confidence=0.88,
                mode=AttentionMode.ENGAGED,
                matched_signals=matched_signals,
                reason="Direct OS/browser command structure detected in Voice Mode.",
            )

        # Ambient Speech Fallback
        matched_signals.append("third_person_ambient")
        logger.info(f"[ATTENTION] engagement_state={self.mode.value} confidence=0.35 addressed=false matched={matched_signals}")
        return AddressingAnalysis(
            addressed_to_jarvis=False,
            confidence=0.35,
            mode=self.mode,
            matched_signals=matched_signals,
            reason="Unaddressed background ambient speech.",
        )
