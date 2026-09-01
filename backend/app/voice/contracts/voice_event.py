import time
import uuid
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class VoiceEventType(str, Enum):
    """Canonical Voice Lifecycle Event Types."""
    SESSION_STARTED = "SESSION_STARTED"
    LISTENING_STARTED = "LISTENING_STARTED"
    SPEECH_STARTED = "SPEECH_STARTED"
    SPEECH_ENDED = "SPEECH_ENDED"
    STT_STARTED = "STT_STARTED"
    STT_COMPLETED = "STT_COMPLETED"
    REQUEST_CREATED = "REQUEST_CREATED"
    CORE_STARTED = "CORE_STARTED"
    CORE_COMPLETED = "CORE_COMPLETED"
    TTS_STARTED = "TTS_STARTED"
    AUDIO_STARTED = "AUDIO_STARTED"
    AUDIO_COMPLETED = "AUDIO_COMPLETED"
    INTERRUPTION_REQUESTED = "INTERRUPTION_REQUESTED"
    INTERRUPTION_COMPLETED = "INTERRUPTION_COMPLETED"
    CANCELLED = "CANCELLED"
    ERROR = "ERROR"


class VoiceEvent(BaseModel):
    """Canonical Voice Lifecycle Event contract."""
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    conversation_id: str
    turn_id: Optional[str] = None
    event_type: VoiceEventType
    timestamp: float = Field(default_factory=time.time)
    metadata: Dict[str, Any] = Field(default_factory=dict)
