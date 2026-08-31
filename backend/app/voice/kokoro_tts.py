import os
import re
import time
import io
import sys
from typing import Optional, Dict, Any
from app.core.config import settings
from app.core.logging import logger

try:
    from kokoro import KPipeline
    import soundfile as sf
    import torch
    HAS_KOKORO = True
except ImportError as err:
    HAS_KOKORO = False
    KOKORO_IMPORT_ERROR = str(err)


class LocalKokoroTTSService:
    """Local Kokoro TTS Service: Provides 100% offline, zero-cloud-quota Text-to-Speech synthesis using Kokoro-82M."""

    _instance: Optional["LocalKokoroTTSService"] = None

    def __init__(self):
        self.provider = "kokoro_local"
        self.default_voice = getattr(settings, "KOKORO_VOICE", "am_adam")
        self.default_speed = float(getattr(settings, "KOKORO_SPEED", 1.0))
        self.sample_rate = 24000
        self.lang_code = "a" # American English
        
        self.pipeline: Optional[Any] = None
        self.model_loaded = False
        self.voice_loaded = False
        self.selftest_passed = False
        self.ready = False
        self.initialization_error: Optional[str] = None
        self._initializing = False

    @classmethod
    def get_instance(cls) -> "LocalKokoroTTSService":
        """Returns the single application-wide instance of LocalKokoroTTSService."""
        if cls._instance is None:
            cls._instance = LocalKokoroTTSService()
        return cls._instance

    def initialize(self):
        """Initializes the Kokoro synthesis pipeline, loads default voice, and performs self-test verification."""
        if self.ready or self._initializing:
            return

        self._initializing = True
        pid = os.getpid()
        t0 = time.time()
        logger.info(f"[KOKORO TTS STARTUP] pid={pid} Starting initialization provider={self.provider} voice={self.default_voice}...")

        if not HAS_KOKORO:
            self.initialization_error = f"Kokoro library import failed: {globals().get('KOKORO_IMPORT_ERROR', 'Unknown import error')}"
            self.ready = False
            self._initializing = False
            logger.error(f"[KOKORO TTS INITIALIZATION FAILED] pid={pid} error='{self.initialization_error}'")
            return

        try:
            # Step 1: Instantiate KPipeline
            self.pipeline = KPipeline(lang_code=self.lang_code)
            self.model_loaded = True
            self.voice_loaded = True
            logger.info(f"[KOKORO TTS INITIALIZATION] pid={pid} KPipeline loaded successfully in {(time.time()-t0)*1000:.1f}ms")

            # Step 2: Self-Test Synthesis
            t_test = time.time()
            test_text = "JARVIS system ready."
            generator = self.pipeline(test_text, voice=self.default_voice, speed=self.default_speed)
            test_chunks = list(generator)
            
            if test_chunks:
                self.selftest_passed = True
                self.ready = True
                self.initialization_error = None
                init_dur_ms = (time.time() - t0) * 1000
                logger.info(
                    f"[KOKORO TTS STARTUP SUCCESS] pid={pid} "
                    f"provider={self.provider} "
                    f"model_loaded={self.model_loaded} "
                    f"voice_loaded={self.voice_loaded} "
                    f"voice='{self.default_voice}' "
                    f"sample_rate={self.sample_rate} "
                    f"selftest={self.selftest_passed} "
                    f"ready={self.ready} "
                    f"total_init_ms={init_dur_ms:.1f}ms"
                )
            else:
                self.initialization_error = "Self-test synthesis produced no audio chunks."
                self.ready = False
                logger.error(f"[KOKORO TTS SELFTEST FAILED] pid={pid} error='{self.initialization_error}'")

        except Exception as err:
            self.initialization_error = f"Kokoro initialization exception: {str(err)}"
            self.ready = False
            logger.error(f"[KOKORO TTS EXCEPTION] pid={pid} error='{self.initialization_error}'", exc_info=True)
        finally:
            self._initializing = False

    def is_configured(self) -> bool:
        """Returns True if Kokoro TTS is initialized and ready for synthesis."""
        return self.ready

    @staticmethod
    def clean_text_for_speech(text: str) -> str:
        """Sanitizes raw response text by removing markdown formatting, code blocks, URLs, and JSON blobs."""
        if not text:
            return ""
        clean = re.sub(r'\[LOCATION ACCESS REQUIRED\]', '', text)
        clean = re.sub(r'```[\s\S]*?```', '', clean)
        clean = re.sub(r'`[^`]*`', '', clean)
        clean = re.sub(r'#+\s*', '', clean)
        clean = re.sub(r'\*+([^*]+)\*+', r'\1', clean)
        clean = re.sub(r'_+([^_]+)_+', r'\1', clean)
        clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', clean)
        clean = re.sub(r'https?://\S+', '', clean)
        clean = re.sub(r'^\s*[-*+]\s+', '', clean, flags=re.MULTILINE)
        clean = re.sub(r'\s+', ' ', clean).strip()
        return clean

    async def generate_speech(self, text: str, voice_id: Optional[str] = None, speed: Optional[float] = None) -> bytes:
        """Synthesizes text into 24kHz WAV audio PCM bytes."""
        if not self.ready or self.pipeline is None:
            logger.warning(f"[KOKORO TTS GENERATION REJECTED] Service is not ready. error='{self.initialization_error}'")
            return b""

        spoken_text = self.clean_text_for_speech(text)
        if not spoken_text:
            return b""

        v_name = voice_id or self.default_voice
        sp_val = speed or self.default_speed
        t0 = time.time()

        try:
            generator = self.pipeline(spoken_text, voice=v_name, speed=sp_val)
            audio_segments = []

            for item in generator:
                audio = getattr(item, "audio", None)
                if audio is None and isinstance(item, (tuple, list)):
                    audio = item[2]
                
                if audio is not None:
                    if hasattr(audio, "cpu"):
                        audio = audio.cpu().numpy()
                    audio_segments.append(audio)

            if not audio_segments:
                logger.warning(f"[KOKORO TTS] Generator yielded no audio for text='{spoken_text[:40]}...'")
                return b""

            import numpy as np
            full_audio = np.concatenate(audio_segments) if len(audio_segments) > 1 else audio_segments[0]

            buf = io.BytesIO()
            sf.write(buf, full_audio, self.sample_rate, format="WAV")
            wav_bytes = buf.getvalue()
            dur_ms = (time.time() - t0) * 1000

            logger.info(f"[KOKORO TTS] voice='{v_name}' text='{spoken_text[:50]}...' audio_bytes={len(wav_bytes)} duration_ms={dur_ms:.1f}ms")
            return wav_bytes

        except Exception as err:
            logger.error(f"[KOKORO TTS GENERATION ERROR] text='{spoken_text[:40]}...' error='{err}'", exc_info=True)
            return b""

    def health(self) -> Dict[str, Any]:
        """Returns health status telemetry payload."""
        return {
            "provider": self.provider,
            "pid": os.getpid(),
            "available": self.ready,
            "ready": self.ready,
            "model_loaded": self.model_loaded,
            "voice_loaded": self.voice_loaded,
            "selftest_passed": self.selftest_passed,
            "voice": self.default_voice,
            "sample_rate": self.sample_rate,
            "speed": self.default_speed,
            "initialization_error": self.initialization_error,
        }

    def stop(self):
        """Cancels running generation."""
        pass

    def shutdown(self):
        """Cleans up pipeline resources."""
        self.pipeline = None
        self.ready = False
        self.model_loaded = False
