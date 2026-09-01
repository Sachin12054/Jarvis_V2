import time
import uuid
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.contracts.enums import InputChannel, TargetDevice


class JarvisRequest(BaseModel):
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    turn_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    input_channel: InputChannel = InputChannel.TEXT
    raw_input: str
    normalized_input: Optional[str] = None
    timestamp: float = Field(default_factory=time.time)
    language: str = "en"
    intent: Optional[str] = None
    entities: Dict[str, Any] = Field(default_factory=dict)
    target_device: TargetDevice = TargetDevice.CURRENT
    confidence: float = 1.0
    context_info: Dict[str, Any] = Field(default_factory=dict)
