from enum import Enum
from typing import Set, Dict


class VoiceState(str, Enum):
    """Canonical Voice Session Lifecycle States."""
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    PROCESSING = "PROCESSING"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"
    INTERRUPTING = "INTERRUPTING"
    ERROR = "ERROR"


class InvalidVoiceStateTransitionError(ValueError):
    """Raised when an invalid voice state transition is attempted."""
    pass


class VoiceStateMachine:
    """Deterministic state machine enforcing canonical VoiceState transitions."""

    VALID_TRANSITIONS: Dict[VoiceState, Set[VoiceState]] = {
        VoiceState.IDLE: {VoiceState.LISTENING, VoiceState.ERROR},
        VoiceState.LISTENING: {VoiceState.PROCESSING, VoiceState.INTERRUPTING, VoiceState.IDLE, VoiceState.ERROR},
        VoiceState.PROCESSING: {VoiceState.THINKING, VoiceState.INTERRUPTING, VoiceState.IDLE, VoiceState.ERROR},
        VoiceState.THINKING: {VoiceState.SPEAKING, VoiceState.INTERRUPTING, VoiceState.IDLE, VoiceState.ERROR},
        VoiceState.SPEAKING: {VoiceState.IDLE, VoiceState.INTERRUPTING, VoiceState.ERROR},
        VoiceState.INTERRUPTING: {VoiceState.IDLE, VoiceState.ERROR},
        VoiceState.ERROR: {VoiceState.IDLE},
    }

    @classmethod
    def transition(cls, current_state: VoiceState, target_state: VoiceState) -> VoiceState:
        """Enforces valid state transition or raises InvalidVoiceStateTransitionError."""
        if current_state == target_state:
            return target_state

        allowed = cls.VALID_TRANSITIONS.get(current_state, set())
        if target_state not in allowed:
            raise InvalidVoiceStateTransitionError(
                f"Cannot transition VoiceState from {current_state.value} to {target_state.value}."
            )
        return target_state
