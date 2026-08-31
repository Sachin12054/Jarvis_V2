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


def check_cuda_available() -> bool:
    """Checks if CUDA GPU device is available and required cuBLAS DLLs are present on Windows."""
    if not CTRANSLATE2_AVAILABLE:
        return False
    try:
        # Check for cublas64_12.dll / cublas64_11.dll DLL availability
        has_cublas = False
        if shutil.which("cublas64_12.dll") or shutil.which("cublas64_11.dll"):
            has_cublas = True
        else:
            cuda_path = os.environ.get("CUDA_PATH", "")
            if cuda_path and (os.path.exists(os.path.join(cuda_path, "bin", "cublas64_12.dll")) or os.path.exists(os.path.join(cuda_path, "bin", "cublas64_11.dll"))):
                has_cublas = True

        if not has_cublas:
            logger.info("[STT DEVICE DIAGNOSTICS] cuBLAS DLLs (cublas64_12.dll) not found in system PATH. Selecting CPU for Faster-Whisper.")
            return False

        if hasattr(ctranslate2, "get_cuda_device_count"):
            return ctranslate2.get_cuda_device_count() > 0
    except Exception:
        pass
    return False


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
    compute_type: str = "default"
    model: str = "base.en"
    timestamp: float = Field(default_factory=time.time)
    error_code: Optional[str] = None
    error: Optional[str] = None
    retryable: bool = False


def evaluate_stt_quality(segments: list, raw_text: str, duration_ms: float) -> Tuple[bool, str, float]:
    """Phase 4: Evaluates Whisper segment statistics for hallucinations, repetition loops, and low confidence."""
    if not raw_text or not segments:
        return False, "EMPTY_TRANSCRIPT", 0.0

    words = raw_text.strip().split()
    if not words:
        return False, "NO_WORDS", 0.0

    # 1. Repetition Score (e.g. "click click click click click click" or repeated phrase loops)
    word_counts = {}
    for w in words:
        clean_w = w.lower().strip(".,!?")
        word_counts[clean_w] = word_counts.get(clean_w, 0) + 1

    max_repeat = max(word_counts.values()) if word_counts else 0
    repeat_ratio = max_repeat / len(words)

    if len(words) >= 4 and max_repeat >= 5 and repeat_ratio > 0.5:
        return False, f"REPETITION_HALLUCINATION (max_repeat={max_repeat})", 0.0

    # 2. Segment metrics
    logprobs = [getattr(s, 'avg_logprob', 0.0) for s in segments if hasattr(s, 'avg_logprob')]
    no_speech_probs = [getattr(s, 'no_speech_prob', 0.0) for s in segments if hasattr(s, 'no_speech_prob')]
    compression_ratios = [getattr(s, 'compression_ratio', 1.0) for s in segments if hasattr(s, 'compression_ratio')]

    avg_logprob = float(np.mean(logprobs)) if logprobs else -0.5
    max_no_speech = float(np.max(no_speech_probs)) if no_speech_probs else 0.0
    max_compression = float(np.max(compression_ratios)) if compression_ratios else 1.0

    # 3. Speech density / impossible words-per-second
    sec = duration_ms / 1000.0
    words_per_sec = len(words) / sec if sec > 0 else 0

    if words_per_sec > 8.5 and len(words) > 8:
        return False, f"IMPOSSIBLE_SPEECH_DENSITY (wps={words_per_sec:.1f})", 0.0

    if max_compression > 2.6:
        return False, f"EXCESSIVE_COMPRESSION_RATIO (ratio={max_compression:.2f})", 0.0

    if avg_logprob < -1.4:
        return False, f"LOW_AVERAGE_LOGPROB (logprob={avg_logprob:.2f})", 0.0

    if max_no_speech > 0.75:
        return False, f"HIGH_NO_SPEECH_PROB (no_speech={max_no_speech:.2f})", 0.0

    conf = float(np.exp(max(-2.0, avg_logprob))) * (1.0 - (max_no_speech * 0.5))
    conf = max(0.1, min(0.99, conf))

    return True, "PASSED", conf


class LocalWhisperSTTProvider:
    """Unified 100% Local Speech-to-Text Provider: Single authoritative singleton managing FFmpeg WebM audio decoding and resident Faster-Whisper inference."""

    _instance: Optional["LocalWhisperSTTProvider"] = None

    def __init__(self):
        self.engine = getattr(settings, "JARVIS_STT_ENGINE", "faster-whisper")
        self.model_name = getattr(settings, "JARVIS_STT_MODEL", "base.en")
        self.requested_device = getattr(settings, "JARVIS_STT_DEVICE", "auto").lower()
        self.requested_compute = getattr(settings, "JARVIS_STT_COMPUTE_TYPE", "auto").lower()
        
        self.device = "CPU"
        self.compute_type = "default"
        self.cuda_available = False

        self.ffmpeg_path: Optional[str] = None
        self.ffmpeg_version: Optional[str] = None
        self.ffmpeg_available = False

        self.model_loaded = False
        self.selftest_passed = False
        self.whisper_model: Optional[Any] = None
        self.initialized = False
        self.initialization_error: Optional[str] = None
        self.load_time_ms = 0.0

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
        return bool(
            self.ffmpeg_available
            and self.model_loaded
            and self.selftest_passed
            and self.whisper_model is not None
        )

    @property
    def is_ready(self) -> bool:
        return self.ready

    def initialize(self) -> None:
        if self.initialized and self.ready:
            return

        pid = os.getpid()
        ppid = getattr(os, "getppid", lambda: None)()
        logger.info(f"[LOCAL STT LIFESPAN] pid={pid} ppid={ppid} initialize_called=true provider_id={hex(id(self))}")

        self.initialization_error = None
        self.cuda_available = check_cuda_available()

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

            self.initialized = True

            logger.info(
                f"[STT STARTUP DIAGNOSTICS] pid={pid} "
                f"model='{self.model_name}' "
                f"actual_device='{self.device}' "
                f"compute_type='{self.compute_type}' "
                f"cuda_available={self.cuda_available} "
                f"load_time_ms={self.load_time_ms:.1f}ms "
                f"ffmpeg_available={self.ffmpeg_available} "
                f"selftest_passed={self.selftest_passed} "
                f"ready={self.ready}"
            )

        except Exception as unhandled_err:
            tb_str = traceback.format_exc()
            self.initialization_error = f"{unhandled_err}\n{tb_str}"
            logger.error(f"[LOCAL STT CRITICAL INITIALIZATION FAILURE] pid={pid} error={unhandled_err}\n{tb_str}")
            self.model_loaded = False
            self.selftest_passed = False

    def _load_resident_model(self) -> None:
        """Loads Faster-Whisper model into memory with automatic CUDA -> CPU fallback."""
        pid = os.getpid()
        t0 = time.time()

        if not HAS_FASTER_WHISPER:
            err_msg = f"faster_whisper package import failed: {FASTER_WHISPER_IMPORT_ERROR or 'ImportError'}"
            self.initialization_error = err_msg
            logger.error(f"[LOCAL STT MODEL FAILURE] pid={pid} loaded=false object_present=false initialization_error='{err_msg}'")
            self.model_loaded = False
            self.whisper_model = None
            return

        should_try_cuda = (self.requested_device in ["cuda", "auto"]) and self.cuda_available

        if should_try_cuda:
            c_type = "float16" if self.requested_compute in ["auto", "float16"] else self.requested_compute
            try:
                logger.info(f"[LOCAL STT MODEL] pid={pid} model='{self.model_name}' device='CUDA' compute_type='{c_type}' loading=true...")
                model = WhisperModel(self.model_name, device="cuda", compute_type=c_type)
                
                # Test CUDA inference with synthetic PCM
                sample_rate = 16000
                t = np.linspace(0, 0.3, int(sample_rate * 0.3), False)
                synthetic_pcm = (0.5 * np.sin(2 * np.pi * 440 * t)).astype(np.float32)
                segments, _ = model.transcribe(synthetic_pcm, language="en", vad_filter=False)
                _ = list(segments)

                self.whisper_model = model
                self.device = "CUDA"
                self.compute_type = c_type
                self.model_loaded = True
                self.selftest_passed = True
                self.load_time_ms = (time.time() - t0) * 1000.0
                logger.info(f"[LOCAL STT MODEL SUCCESS] pid={pid} loaded=true device='CUDA' compute_type='{c_type}' load_time={self.load_time_ms:.1f}ms")
                return
            except Exception as cuda_err:
                logger.warning(f"[LOCAL STT MODEL CUDA FALLBACK] CUDA load/selftest attempt failed ({cuda_err}). Falling back to CPU...")

        # CPU Fallback (using compute_type="default")
        cpu_c_type = "default" if self.requested_compute in ["auto", "default"] else self.requested_compute
        try:
            logger.info(f"[LOCAL STT MODEL] pid={pid} model='{self.model_name}' device='CPU' compute_type='{cpu_c_type}' loading=true...")
            model = WhisperModel(self.model_name, device="cpu", compute_type=cpu_c_type)

            sample_rate = 16000
            t = np.linspace(0, 0.3, int(sample_rate * 0.3), False)
            synthetic_pcm = (0.5 * np.sin(2 * np.pi * 440 * t)).astype(np.float32)
            segments, _ = model.transcribe(synthetic_pcm, language="en", vad_filter=False)
            _ = list(segments)

            self.whisper_model = model
            self.device = "CPU"
            self.compute_type = cpu_c_type
            self.model_loaded = True
            self.selftest_passed = True
            self.load_time_ms = (time.time() - t0) * 1000.0
            logger.info(f"[LOCAL STT MODEL SUCCESS] pid={pid} loaded=true device='CPU' compute_type='{cpu_c_type}' load_time={self.load_time_ms:.1f}ms")
        except Exception as cpu_err:
            tb_str = traceback.format_exc()
            self.initialization_error = f"Faster-Whisper CPU load failed: {repr(cpu_err)}"
            logger.error(f"[LOCAL STT MODEL FAILURE] pid={pid} loaded=false initialization_error='{repr(cpu_err)}'\n{tb_str}")
            self.model_loaded = False
            self.whisper_model = None
            self.selftest_passed = False

    def _decode_audio_with_ffmpeg(self, audio_bytes: bytes, filename: str) -> Tuple[np.ndarray, float, float, float, float, Optional[str]]:
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
                return np.array([], dtype=np.float32), 0.0, 0.0, 0.0, decode_ms, f"EBML header / FFmpeg decode failure: {err_msg[:120]}"

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
        capture_id: Optional[str] = None,
    ) -> LocalVoiceTranscription:
        t_start = time.time()
        pid = os.getpid()
        cid = capture_id or f"cap_{int(t_start*1000)}"

        logger.info(f"[STT] pid={pid} capture_id='{cid}' provider=local_whisper audio_bytes={len(audio_bytes) if audio_bytes else 0} filename='{filename}' content_type='{content_type}'")

        if not audio_bytes or len(audio_bytes) < 300:
            logger.warning(f"[STT] pid={pid} capture_id='{cid}' Audio file empty or below minimum valid threshold ({len(audio_bytes) if audio_bytes else 0} bytes).")
            return LocalVoiceTranscription(
                text="",
                error_code="AUDIO_INVALID",
                error="Audio recording payload is incomplete or below valid threshold.",
                retryable=True,
                confidence=0.0,
                total_ms=(time.time() - t_start) * 1000.0,
            )

        if not self.ffmpeg_available:
            logger.error(f"[STT] pid={pid} capture_id='{cid}' STT Unavailable: FFmpeg binary is missing or unverified.")
            return LocalVoiceTranscription(
                text="",
                error_code="FFMPEG_MISSING",
                error="FFmpeg executable is missing or invalid on Windows backend.",
                confidence=0.0,
                total_ms=(time.time() - t_start) * 1000.0,
            )

        if not self.ready:
            logger.error(f"[STT] pid={pid} capture_id='{cid}' STT Unavailable: Local STT provider is not ready. detail='{self.initialization_error or 'Unknown'}'")
            return LocalVoiceTranscription(
                text="",
                error_code="STT_MODEL_NOT_READY",
                error=f"Local STT model or FFmpeg decoder is not ready: {self.initialization_error or 'Initialization incomplete'}",
                confidence=0.0,
                total_ms=(time.time() - t_start) * 1000.0,
            )

        pcm, duration_ms, rms, peak, decode_ms, err = self._decode_audio_with_ffmpeg(audio_bytes, filename)

        if len(pcm) == 0:
            logger.error(f"[AUDIO DECODE] pid={pid} capture_id='{cid}' Failed to decode PCM: {err}")
            return LocalVoiceTranscription(
                text="",
                error_code="AUDIO_INVALID",
                error=err or "FFmpeg failed to decode audio samples.",
                retryable=True,
                confidence=0.0,
                decode_ms=decode_ms,
                total_ms=(time.time() - t_start) * 1000.0,
            )

        if rms < 0.0015 or duration_ms < 150.0:
            logger.info(f"[AUDIO] pid={pid} capture_id='{cid}' output_samples={len(pcm)} rms={rms:.4f} peak={peak:.4f} speech_present=false")
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
                compute_type=self.compute_type,
                model=self.model_name,
            )

        logger.info(f"[AUDIO] pid={pid} capture_id='{cid}' output_samples={len(pcm)} rms={rms:.4f} peak={peak:.4f} speech_present=true")

        t_infer_start = time.time()

        initial_prompt = (
            "JARVIS, Notepad, Chrome, Google Chrome, Visual Studio Code, VS Code, "
            "YouTube, Spotify, WhatsApp, open, close, launch, click, type, "
            "search, play, pause, stop, cancel"
        )
        vad_params = dict(min_silence_duration_ms=450, speech_pad_ms=350)

        logger.info(
            f"[STT CONFIG] pid={pid} capture_id='{cid}' model='{self.model_name}' device='{self.device}' "
            f"compute_type='{self.compute_type}' language='en' beam_size=5 vad_filter=True condition_on_previous_text=False"
        )

        try:
            segments_gen, info = self.whisper_model.transcribe(
                pcm,
                beam_size=5,
                language="en",
                temperature=0.0,
                vad_filter=True,
                vad_parameters=vad_params,
                condition_on_previous_text=False,
                initial_prompt=initial_prompt,
            )
            segments = list(segments_gen)
            segment_texts = [seg.text.strip() for seg in segments if seg.text.strip()]
            raw_text = " ".join(segment_texts).strip()

            inference_ms = (time.time() - t_infer_start) * 1000.0

            # Phase 4: Evaluate STT quality statistics & hallucination guard
            is_acceptable, quality_reason, conf_score = evaluate_stt_quality(segments, raw_text, duration_ms)

            if not is_acceptable:
                logger.warning(f"[STT QUALITY REJECTED] pid={pid} capture_id='{cid}' reason='{quality_reason}' raw_text='{raw_text}'")
                return LocalVoiceTranscription(
                    text="I didn't catch that clearly. Please repeat.",
                    error_code="STT_UNCERTAIN",
                    error=f"STT quality check failed: {quality_reason}",
                    confidence=0.0,
                    duration_ms=duration_ms,
                    decode_ms=decode_ms,
                    inference_ms=inference_ms,
                    total_ms=(time.time() - t_start) * 1000.0,
                    provider="local_whisper",
                    engine=self.engine,
                    device=self.device,
                    compute_type=self.compute_type,
                    model=self.model_name,
                )

            # Apply command normalization (wake-word stripping & application alias mapping)
            from app.voice.normalization import normalize_voice_command
            normalized_text, norm_rule = normalize_voice_command(raw_text)

            t_post = time.time()
            postprocess_ms = (time.time() - t_post) * 1000.0
            total_ms = (time.time() - t_start) * 1000.0

            logger.info(f"[STT PERFORMANCE] pid={pid} capture_id='{cid}' decode_ms={decode_ms:.1f}ms inference_ms={inference_ms:.1f}ms total_ms={total_ms:.1f}ms confidence={conf_score:.2f}")
            logger.info(f"[STT RESULT] pid={pid} capture_id='{cid}' raw_text='{raw_text}' final_text='{normalized_text}' norm_rule='{norm_rule or 'none'}'")

            return LocalVoiceTranscription(
                text=normalized_text,
                language=getattr(info, "language", "en"),
                confidence=conf_score if normalized_text else 0.0,
                duration_ms=duration_ms,
                decode_ms=decode_ms,
                inference_ms=inference_ms,
                postprocess_ms=postprocess_ms,
                total_ms=total_ms,
                provider="local_whisper",
                engine=self.engine,
                device=self.device,
                compute_type=self.compute_type,
                model=self.model_name,
            )

        except Exception as whisper_err:
            logger.error(f"[STT INFERENCE EXCEPTION] pid={pid} capture_id='{cid}' error={whisper_err}", exc_info=True)
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
            "compute_type": self.compute_type,
            "cuda_available": self.cuda_available,
            "model": self.model_name,
            "model_loaded": self.model_loaded,
            "selftest_passed": self.selftest_passed,
            "load_time_ms": self.load_time_ms,
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
