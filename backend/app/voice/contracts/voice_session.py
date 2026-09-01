import time
import uuid
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.voice.contracts.voice_state import VoiceState


class VoiceSession(BaseModel):
    """Canonical Voice Session Model."""
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    active_turn_id: Optional[str] = None
    state: VoiceState = VoiceState.IDLE
    created_at: float = Field(default_factory=time.time)
    updated_at: float = Field(default_factory=time.time)
    metadata: Dict[str, Any] = Field(default_factory=dict)
