import re
import time
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.core.config import settings
from app.core.logging import logger
from app.voice.tts_provider import ElevenLabsTTSProvider


class VoiceTranscription(BaseModel):
    """Structured transcription metadata returned by STT provider."""

    text: str
    language: str = "en"
    confidence: float = 0.98
    duration_ms: float = 0.0
    provider: str = "local_whisper"
    timestamp: float = Field(default_factory=time.time)
    error: Optional[str] = None


class ElevenLabsVoiceService:
    """Voice Service handling local STT routing and Text-to-Speech (TTS) integration with zero cloud STT calls."""

    def __init__(self):
        self.tts_provider = ElevenLabsTTSProvider()
        self.api_key = settings.ELEVENLABS_API_KEY
        self.voice_id = settings.ELEVENLABS_VOICE_ID or "pNInz6obpgDQGcFmaJgB"
        self.tts_model = settings.ELEVENLABS_TTS_MODEL or "eleven_multilingual_v2"
        self.timeout = settings.ELEVENLABS_TIMEOUT or 15.0

    def is_configured(self) -> bool:
        """Returns True if ElevenLabs API key is configured for TTS."""
        return self.tts_provider.is_configured()

    @staticmethod
    def clean_text_for_speech(text: str) -> str:
        """Sanitizes text by stripping markdown syntax, code blocks, URLs, and extra symbols for natural spoken TTS playback."""
        return ElevenLabsTTSProvider.clean_text_for_speech(text)

    async def generate_speech(
        self,
        text: str,
        voice_id: Optional[str] = None,
    ) -> bytes:
        """Sends response text to ElevenLabs TTS provider and returns audio bytes."""
        return await self.tts_provider.generate_speech(text, voice_id=voice_id)
