import os
import io
import sys
import time
import shutil
import tempfile
import subprocess
import traceback
import numpy as np
from typing import Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field
from app.core.config import settings
from app.core.logging import logger

try:
    import imageio_ffmpeg
    IMAGEIO_FFMPEG_AVAILABLE = True
except Exception:
    IMAGEIO_FFMPEG_AVAILABLE = False

try:
    import ctranslate2
    CTRANSLATE2_AVAILABLE = True
    CTRANSLATE2_VERSION = getattr(ctranslate2, "__version__", "loaded")
except Exception as ctrans_err:
    CTRANSLATE2_AVAILABLE = False
    CTRANSLATE2_VERSION = str(ctrans_err)

try:
    import tokenizers
    TOKENIZERS_AVAILABLE = True
    TOKENIZERS_VERSION = getattr(tokenizers, "__version__", "loaded")
except Exception as tok_err:
    TOKENIZERS_AVAILABLE = False
    TOKENIZERS_VERSION = str(tok_err)

try:
    from faster_whisper import WhisperModel
    HAS_FASTER_WHISPER = True
    FASTER_WHISPER_IMPORT_ERROR = None
except Exception as fw_err:
    HAS_FASTER_WHISPER = False
    FASTER_WHISPER_IMPORT_ERROR = str(fw_err)


def get_verified_ffmpeg() -> Tuple[Optional[str], Optional[str]]:
    """Discovers and verifies FFmpeg executable exit code 0 and version string."""
    candidates = []

    if hasattr(settings, "JARVIS_FFMPEG_PATH") and getattr(settings, "JARVIS_FFMPEG_PATH"):
        candidates.append(getattr(settings, "JARVIS_FFMPEG_PATH"))

    root_dir = settings.JARVIS_WORKSPACE_ROOT
    candidates.append(os.path.join(root_dir, "backend", "bin", "ffmpeg.exe"))
    candidates.append(os.path.join(root_dir, "scratch", "ffmpeg.exe"))
    candidates.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../bin/ffmpeg.exe")))

    if IMAGEIO_FFMPEG_AVAILABLE:
        try:
            candidates.append(imageio_ffmpeg.get_ffmpeg_exe())
        except Exception:
            pass

    sys_path = shutil.which("ffmpeg")
    if sys_path:
        candidates.append(sys_path)

    for exe in candidates:
        if exe and os.path.exists(exe):
            try:
                res = subprocess.run([exe, "-version"], capture_output=True, text=True, timeout=5.0)
                if res.returncode == 0:
                    version = res.stdout.splitlines()[0] if res.stdout else "unknown"
                    logger.info(f"[LOCAL STT FFMPEG] pid={os.getpid()} exe='{os.path.abspath(exe)}' returncode=0 version='{version}'")
                    return os.path.abspath(exe), version
            except Exception as err:
                logger.debug(f"[LOCAL STT FFMPEG] Candidate '{exe}' verification failed: {err}")

    return None, None


class LocalVoiceTranscription(BaseModel):
    """Structured transcription metadata returned by local STT provider."""

    text: str
    language: str = "en"
    confidence: float = 0.98
    duration_ms: float = 0.0
    decode_ms: float = 0.0
    inference_ms: float = 0.0
    postprocess_ms: float = 0.0
    total_ms: float = 0.0
    provider: str = "local_whisper"
    engine: str = "faster-whisper"
    device: str = "CPU"
    model: str = "tiny"
    timestamp: float = Field(default_factory=time.time)
    error_code: Optional[str] = None
    error: Optional[str] = None


class LocalWhisperSTTProvider:
    """Unified 100% Local Speech-to-Text Provider: Single authoritative singleton managing FFmpeg WebM audio decoding and resident Faster-Whisper inference."""

    _instance: Optional["LocalWhisperSTTProvider"] = None

    def __init__(self):
        self.engine = settings.JARVIS_STT_ENGINE
        self.model_name = settings.JARVIS_STT_MODEL or "tiny"
        self.device = "CPU"

        self.ffmpeg_path: Optional[str] = None
        self.ffmpeg_version: Optional[str] = None
        self.ffmpeg_available = False

        self.model_loaded = False
        self.selftest_passed = False
        self.whisper_model: Optional[Any] = None
        self.initialized = False
        self.initialization_error: Optional[str] = None

        self.initialize()

    @classmethod
    def get_instance(cls) -> "LocalWhisperSTTProvider":
        if cls._instance is None:
            cls._instance = LocalWhisperSTTProvider()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    @property
    def ready(self) -> bool:
        """One authoritative readiness property: ready=True ONLY IF FFmpeg verified AND model loaded AND selftest passed."""
        return bool(
            self.ffmpeg_available
            and self.model_loaded
            and self.selftest_passed
            and self.whisper_model is not None
        )

    @property
    def is_ready(self) -> bool:
        """Alias for property ready."""
        return self.ready

    def initialize(self) -> None:
        """Explicit startup initialization method with detailed error capture and diagnostic logging."""
        if self.initialized and self.ready:
            return

        pid = os.getpid()
        ppid = getattr(os, "getppid", lambda: None)()
        logger.info(f"[LOCAL STT LIFESPAN] pid={pid} ppid={ppid} initialize_called=true provider_id={hex(id(self))}")

        self.initialization_error = None

        try:
            # 1. Discover and verify FFmpeg binary
            self.ffmpeg_path, self.ffmpeg_version = get_verified_ffmpeg()
            self.ffmpeg_available = bool(self.ffmpeg_path and os.path.exists(self.ffmpeg_path))

            if not self.ffmpeg_available:
                err_msg = "FFmpeg executable is missing or failed verification."
                self.initialization_error = err_msg
                logger.error(f"[LOCAL STT INITIALIZATION ERROR] pid={pid}: {err_msg}")

            # 2. Load resident Faster-Whisper model into memory
            self._load_resident_model()

            # 3. Perform startup self-test inference
            self._run_startup_selftest()

            self.initialized = True

            logger.info(
                f"[LOCAL STT STARTUP DEBUG] pid={pid} "
                f"provider_id={hex(id(self))} "
                f"ffmpeg_available={self.ffmpeg_available} "
                f"ffmpeg_path='{self.ffmpeg_path}' "
                f"ffmpeg_version='{self.ffmpeg_version}' "
                f"model_name='{self.model_name}' "
                f"model_loaded={self.model_loaded} "
                f"whisper_model_is_none={self.whisper_model is None} "
                f"selftest_passed={self.selftest_passed} "
                f"ready={self.ready} "
                f"initialization_error='{self.initialization_error or 'None'}'"
            )

        except Exception as unhandled_err:
            tb_str = traceback.format_exc()
            self.initialization_error = f"{unhandled_err}\n{tb_str}"
            logger.error(f"[LOCAL STT CRITICAL INITIALIZATION FAILURE] pid={pid} error={unhandled_err}\n{tb_str}")
            self.model_loaded = False
            self.selftest_passed = False

    def _load_resident_model(self) -> None:
        """Loads Faster-Whisper model into memory once."""
        pid = os.getpid()

        if not HAS_FASTER_WHISPER:
            err_msg = f"faster_whisper package import failed: {FASTER_WHISPER_IMPORT_ERROR or 'ImportError'}"
            self.initialization_error = err_msg
            logger.error(f"[LOCAL STT MODEL FAILURE] pid={pid} loaded=false object_present=false initialization_error='{err_msg}'")
            self.model_loaded = False
            self.whisper_model = None
            return

        if settings.JARVIS_STT_DEVICE == "cuda":
            try:
                logger.info(f"[LOCAL STT MODEL] pid={pid} model='{self.model_name}' device='CUDA' compute_type='float16' loading=true...")
                self.whisper_model = WhisperModel(self.model_name, device="cuda", compute_type="float16")
                self.device = "CUDA"
                self.model_loaded = True
                logger.info(f"[LOCAL STT MODEL] pid={pid} loaded=true object_present=true device='CUDA'")
                return
            except Exception as cuda_err:
                logger.warning(f"[LOCAL STT MODEL] CUDA load warning: {cuda_err}")

        try:
            logger.info(f"[LOCAL STT MODEL] pid={pid} model='{self.model_name}' device='CPU' compute_type='int8' loading=true...")
            self.whisper_model = WhisperModel(self.model_name, device="cpu", compute_type="int8")
            self.device = "CPU"
            self.model_loaded = True
            logger.info(f"[LOCAL STT MODEL] pid={pid} loaded=true object_present=true device='CPU'")
        except Exception as cpu_err:
            tb_str = traceback.format_exc()
            self.initialization_error = f"Faster-Whisper CPU load failed: {repr(cpu_err)}"
            logger.error(f"[LOCAL STT MODEL] pid={pid} loaded=false object_present=false initialization_error='{repr(cpu_err)}'\n{tb_str}")
            self.model_loaded = False
            self.whisper_model = None

    def _run_startup_selftest(self) -> None:
        """Runs a tiny 0.5s synthetic PCM self-test inference through Faster-Whisper to verify model inference functions cleanly."""
        pid = os.getpid()
        if not self.model_loaded or not self.whisper_model:
            self.selftest_passed = False
            if not self.initialization_error:
                self.initialization_error = "Model not loaded prior to self-test"
            return

        try:
            logger.info(f"[LOCAL STT SELF TEST] pid={pid} started=true")
            t0 = time.time()
            sample_rate = 16000
            t = np.linspace(0, 0.5, int(sample_rate * 0.5), False)
            synthetic_pcm = (0.5 * np.sin(2 * np.pi * 440 * t)).astype(np.float32)

            segments, _ = self.whisper_model.transcribe(synthetic_pcm, language="en", vad_filter=False)
            _ = list(segments)
            infer_ms = (time.time() - t0) * 1000.0
            self.selftest_passed = True
            logger.info(f"[LOCAL STT SELF TEST] pid={pid} completed=true inference_ms={infer_ms:.1f}ms status=PASSED")
        except Exception as selftest_err:
            tb_str = traceback.format_exc()
            self.initialization_error = f"Startup selftest failed: {repr(selftest_err)}"
            logger.error(f"[LOCAL STT SELF TEST FAILURE] pid={pid} error={selftest_err}\n{tb_str}")
            self.selftest_passed = False
            self.model_loaded = False

    def _decode_audio_with_ffmpeg(self, audio_bytes: bytes, filename: str) -> Tuple[np.ndarray, float, float, float, float, Optional[str]]:
        """Decodes WebM/Opus/WAV audio bytes using verified FFmpeg into 16,000 Hz mono S16LE Float32 PCM array."""
        t_start = time.time()
        ffmpeg_exe = self.ffmpeg_path
        pid = os.getpid()

        if not ffmpeg_exe or not os.path.exists(ffmpeg_exe):
            return np.array([], dtype=np.float32), 0.0, 0.0, 0.0, 0.0, "FFmpeg binary unavailable."

        scratch_dir = os.path.abspath(os.path.join(settings.JARVIS_WORKSPACE_ROOT, "scratch"))
        os.makedirs(scratch_dir, exist_ok=True)

        temp_in = os.path.join(scratch_dir, f"voice_input_{int(time.time() * 1000)}.webm")
        try:
            with open(temp_in, "wb") as f:
                f.write(audio_bytes)
        except Exception as err:
            logger.warning(f"[AUDIO] Failed to write temp file: {err}")

        try:
            cmd = [
                ffmpeg_exe,
                "-y",
                "-i", temp_in if os.path.exists(temp_in) else "pipe:0",
                "-f", "s16le",
                "-ac", "1",
                "-ar", "16000",
                "pipe:1"
            ]

            proc = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE if not os.path.exists(temp_in) else None,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            input_data = audio_bytes if not os.path.exists(temp_in) else None
            stdout, stderr = proc.communicate(input=input_data, timeout=10.0)

            decode_ms = (time.time() - t_start) * 1000.0

            if proc.returncode != 0 or not stdout:
                err_msg = stderr.decode('utf-8', errors='ignore') if stderr else "FFmpeg process failed."
                logger.error(f"[AUDIO DECODE] pid={pid} FFmpeg conversion failed (returncode={proc.returncode}): {err_msg[:200]}")
                return np.array([], dtype=np.float32), 0.0, 0.0, 0.0, decode_ms, err_msg

            pcm_int16 = np.frombuffer(stdout, dtype=np.int16)
            if len(pcm_int16) == 0:
                return np.array([], dtype=np.float32), 0.0, 0.0, 0.0, decode_ms, "Decoded 0 PCM samples."

            pcm_float32 = pcm_int16.astype(np.float32) / 32768.0
            rms = float(np.sqrt(np.mean(pcm_float32 ** 2)))
            peak = float(np.max(np.abs(pcm_float32)))
            duration_ms = (len(pcm_float32) / 16000.0) * 1000.0

            logger.info(f"[AUDIO DECODE] pid={pid} success=true input_bytes={len(audio_bytes)} samples={len(pcm_float32)} sample_rate=16000 channels=1 duration_ms={duration_ms:.1f} rms={rms:.4f} peak={peak:.4f}")

            return pcm_float32, duration_ms, rms, peak, decode_ms, None

        except Exception as err:
            logger.error(f"[AUDIO DECODE] pid={pid} Exception during FFmpeg decoding: {err}")
            return np.array([], dtype=np.float32), 0.0, 0.0, 0.0, (time.time() - t_start) * 1000.0, str(err)
        finally:
            if temp_in and os.path.exists(temp_in):
                try:
                    os.remove(temp_in)
                except Exception:
                    pass

    async def transcribe(
        self,
        audio_bytes: bytes,
        filename: str = "speech.webm",
        content_type: str = "audio/webm",
    ) -> LocalVoiceTranscription:
        """Transcribes microphone audio locally using verified FFmpeg PCM conversion and resident Faster-Whisper model."""
        t_start = time.time()
        pid = os.getpid()
        logger.info(f"[VOICE] pid={pid} provider=local_whisper audio_bytes={len(audio_bytes)} filename='{filename}' content_type='{content_type}'")

        if not self.ffmpeg_available:
            logger.error(f"[VOICE] pid={pid} STT Unavailable: FFmpeg binary is missing or unverified.")
            return LocalVoiceTranscription(
                text="",
                error_code="FFMPEG_MISSING",
                error="FFmpeg executable is missing or invalid on Windows backend.",
                confidence=0.0,
                total_ms=(time.time() - t_start) * 1000.0,
            )

        if not self.ready:
            logger.error(f"[VOICE] pid={pid} STT Unavailable: Local STT provider is not ready. detail='{self.initialization_error or 'Unknown'}'")
            return LocalVoiceTranscription(
                text="",
                error_code="STT_MODEL_NOT_READY",
                error=f"Local STT model or FFmpeg decoder is not ready: {self.initialization_error or 'Initialization incomplete'}",
                confidence=0.0,
                total_ms=(time.time() - t_start) * 1000.0,
            )

        if not audio_bytes or len(audio_bytes) < 100:
            logger.warning(f"[VOICE] pid={pid} Audio file empty or below minimum size (100 bytes).")
            return LocalVoiceTranscription(
                text="",
                error_code="AUDIO_EMPTY",
                error="Audio input is empty or corrupt.",
                confidence=0.0,
                total_ms=(time.time() - t_start) * 1000.0,
            )

        pcm, duration_ms, rms, peak, decode_ms, err = self._decode_audio_with_ffmpeg(audio_bytes, filename)

        if len(pcm) == 0:
            logger.error(f"[AUDIO DECODE] pid={pid} Failed to decode PCM: {err}")
            return LocalVoiceTranscription(
                text="",
                error_code="AUDIO_DECODE_FAILED",
                error=err or "FFmpeg failed to decode audio samples.",
                confidence=0.0,
                decode_ms=decode_ms,
                total_ms=(time.time() - t_start) * 1000.0,
            )

        if rms < 0.001 or duration_ms < 150.0:
            logger.info(f"[AUDIO] pid={pid} output_samples={len(pcm)} rms={rms:.4f} peak={peak:.4f} speech_present=false")
            return LocalVoiceTranscription(
                text="",
                error_code="AUDIO_SILENT",
                error="Audio is silent or RMS below speech threshold.",
                confidence=0.0,
                duration_ms=duration_ms,
                decode_ms=decode_ms,
                total_ms=(time.time() - t_start) * 1000.0,
                provider="local_whisper",
                engine=self.engine,
                device=self.device,
                model=self.model_name,
            )

        logger.info(f"[AUDIO] pid={pid} output_samples={len(pcm)} rms={rms:.4f} peak={peak:.4f} speech_present=true")

        t_infer_start = time.time()

        initial_prompt = (
            "JARVIS Notepad Chrome Google Chrome YouTube Spotify WhatsApp Settings "
            "VS Code Visual Studio Code File Explorer Task Manager Calculator PowerPoint Word Excel "
            "open close launch start stop type search play pause resume"
        )
        vad_params = dict(min_silence_duration_ms=500, speech_pad_ms=400)

        logger.info(
            f"[STT CONFIG] pid={pid} model='{self.model_name}' device='{self.device}' "
            f"language='en' beam_size=5 vad_filter=True condition_on_previous_text=False "
            f"initial_prompt='{initial_prompt[:60]}...'"
        )

        try:
            segments_gen, info = self.whisper_model.transcribe(
                pcm,
                beam_size=5,
                language="en",
                vad_filter=True,
                vad_parameters=vad_params,
                condition_on_previous_text=False,
                initial_prompt=initial_prompt,
            )
            segments = list(segments_gen)
            segment_texts = [seg.text.strip() for seg in segments if seg.text.strip()]
            raw_text = " ".join(segment_texts).strip()

            lang_prob = getattr(info, "language_probability", 1.0)
            logger.info(
                f"[STT RESULT] raw_text='{raw_text}' language='{getattr(info, 'language', 'en')}' "
                f"language_probability={lang_prob:.2f} segments={len(segment_texts)}"
            )

            # Apply conservative command normalization (e.g. "open not bad" -> "Open Notepad.")
            from app.voice.normalization import normalize_voice_command
            normalized_text, norm_rule = normalize_voice_command(raw_text)

            inference_ms = (time.time() - t_infer_start) * 1000.0
            t_post = time.time()

            postprocess_ms = (time.time() - t_post) * 1000.0
            total_ms = (time.time() - t_start) * 1000.0

            logger.info(f"[LOCAL STT] pid={pid} inference_completed=true decode_ms={decode_ms:.1f}ms inference_ms={inference_ms:.1f}ms postprocess_ms={postprocess_ms:.1f}ms total_ms={total_ms:.1f}ms")
            logger.info(f"[LOCAL STT] pid={pid} segments={len(segment_texts)} raw_text='{raw_text}' final_text='{normalized_text}' norm_rule='{norm_rule or 'none'}'")

            return LocalVoiceTranscription(
                text=normalized_text,
                language=getattr(info, "language", "en"),
                confidence=0.98 if normalized_text else 0.0,
                duration_ms=duration_ms,
                decode_ms=decode_ms,
                inference_ms=inference_ms,
                postprocess_ms=postprocess_ms,
                total_ms=total_ms,
                provider="local_whisper",
                engine=self.engine,
                device=self.device,
                model=self.model_name,
            )

        except Exception as whisper_err:
            logger.error(f"[LOCAL STT] pid={pid} Faster-Whisper inference failure: {whisper_err}", exc_info=True)
            return LocalVoiceTranscription(
                text="",
                error_code="STT_INFERENCE_FAILED",
                error=str(whisper_err),
                confidence=0.0,
                decode_ms=decode_ms,
                total_ms=(time.time() - t_start) * 1000.0,
            )

    def health(self) -> Dict[str, Any]:
        return {
            "provider": "local_whisper",
            "provider_id": hex(id(self)),
            "pid": os.getpid(),
            "available": self.ready,
            "engine": self.engine,
            "device": self.device,
            "model": self.model_name,
            "model_loaded": self.model_loaded,
            "selftest_passed": self.selftest_passed,
            "resident": self.model_loaded,
            "ready": self.ready,
            "ffmpeg_available": self.ffmpeg_available,
            "ffmpeg_path": self.ffmpeg_path,
            "ffmpeg_version": self.ffmpeg_version,
            "ctranslate2_version": CTRANSLATE2_VERSION,
            "tokenizers_version": TOKENIZERS_VERSION,
            "initialization_error": self.initialization_error,
        }


class LocalWhisperServerManager:
    """Backward Compatibility Wrapper: Delegates directly to unified LocalWhisperSTTProvider singleton."""

    @classmethod
    def get_instance(cls) -> LocalWhisperSTTProvider:
        return LocalWhisperSTTProvider.get_instance()

    @classmethod
    def reset_instance(cls) -> None:
        LocalWhisperSTTProvider.reset_instance()
