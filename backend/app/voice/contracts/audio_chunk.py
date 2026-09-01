import time
import uuid
from typing import Optional
from pydantic import BaseModel, Field


class AudioChunk(BaseModel):
    """Canonical Audio Chunk representation for real-time streams."""
    chunk_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    turn_id: Optional[str] = None
    sequence: int = 0
    sample_rate: int = 16000
    channels: int = 1
    format: str = "pcm"
    size_bytes: int = 0
    timestamp: float = Field(default_factory=time.time)
