import re
import time
import httpx
from typing import Optional, Dict, Any
from app.core.config import settings
from app.core.logging import logger


class TTSProviderInterface:
    def is_configured(self) -> bool:
        raise NotImplementedError

    async def generate_speech(self, text: str, voice_id: Optional[str] = None) -> bytes:
        raise NotImplementedError


class ElevenLabsTTSProvider(TTSProviderInterface):
    """ElevenLabs TTS Provider: Converts JARVIS response text into a deep, calm, cinematic male assistant voice stream."""

    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        self.voice_id = settings.ELEVENLABS_VOICE_ID or "pNInz6obpgDQGcFmaJgB"
        self.tts_model = settings.ELEVENLABS_TTS_MODEL or "eleven_multilingual_v2"
        self.timeout = settings.ELEVENLABS_TIMEOUT or 15.0

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    @staticmethod
    def clean_text_for_speech(text: str) -> str:
        """Sanitizes text by stripping markdown syntax, code blocks, URLs, and extra symbols for natural spoken TTS playback."""
        if not text:
            return ""
        clean = re.sub(r'\[LOCATION ACCESS REQUIRED\]', '', text)
        clean = re.sub(r'```[\s\S]*?```', '', clean)
        clean = re.sub(r'`[^`]*`', '', clean)
        clean = re.sub(r'#+\s*', '', clean)
        clean = re.sub(r'\*+([^*]+)\*+', r'\1', clean)
        clean = re.sub(r'_+([^_]+)_+', r'\1', clean)
        clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', clean)
        clean = re.sub(r'^\s*[-*+]\s+', '', clean, flags=re.MULTILINE)
        clean = re.sub(r'\s+', ' ', clean).strip()
        return clean

    async def generate_speech(self, text: str, voice_id: Optional[str] = None) -> bytes:
        t0 = time.time()
        v_id = voice_id or self.voice_id
        spoken_text = self.clean_text_for_speech(text)

        if not spoken_text or not self.is_configured():
            return b""

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{v_id}"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        # Deep, calm, cinematic male voice settings
        payload = {
            "text": spoken_text,
            "model_id": self.tts_model,
            "voice_settings": {
                "stability": 0.65,
                "similarity_boost": 0.85,
                "style": 0.20,
                "use_speaker_boost": True,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    logger.info(f"[TTS] provider=elevenlabs voice_id='{v_id}' status=200 audio_bytes={len(resp.content)} duration_ms={(time.time()-t0)*1000:.1f}ms")
                    return resp.content
                else:
                    logger.warning(f"[TTS] ElevenLabs error status {resp.status_code}: {resp.text[:200]}")
                    return b""
        except Exception as err:
            logger.warning(f"[TTS] ElevenLabs exception: {err}")
            return b""


class LocalTTSProvider(TTSProviderInterface):
    """Local Fallback TTS Provider: Returns empty audio when offline or unconfigured."""

    def is_configured(self) -> bool:
        return True

    async def generate_speech(self, text: str, voice_id: Optional[str] = None) -> bytes:
        return b""
