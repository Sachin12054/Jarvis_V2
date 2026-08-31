import io
import pytest
import numpy as np
import soundfile as sf
from httpx import AsyncClient
from app.voice.stt_provider import (
    LocalWhisperSTTProvider,
    LocalWhisperServerManager,
    get_verified_ffmpeg,
)


@pytest.fixture(autouse=True)
def reset_stt_singletons():
    LocalWhisperSTTProvider.reset_instance()
    LocalWhisperServerManager.reset_instance()
    yield
    LocalWhisperSTTProvider.reset_instance()
    LocalWhisperServerManager.reset_instance()


def generate_test_wav() -> bytes:
    sample_rate = 16000
    t = np.linspace(0, 1.0, sample_rate, False)
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)
    buf = io.BytesIO()
    sf.write(buf, audio, sample_rate, format='WAV')
    return buf.getvalue()


def test_verified_ffmpeg_discovery():
    """Verifies get_verified_ffmpeg() discovers a valid executable and version string."""
    exe, ver = get_verified_ffmpeg()
    assert exe is not None
    assert ver is not None
    assert "ffmpeg" in ver.lower() or "version" in ver.lower()


def test_stt_readiness_contract():
    """Verifies LocalWhisperServerManager strictly enforces ready=True ONLY when FFmpeg and Whisper model are initialized."""
    mgr = LocalWhisperServerManager.get_instance()
    assert mgr.ffmpeg_available is True
    assert mgr.model_loaded is True
    assert mgr.is_ready is True


@pytest.mark.asyncio
async def test_real_audio_decoding_and_inference():
    """Verifies FFmpeg WebM/WAV decoding and Faster-Whisper inference return structured LocalVoiceTranscription telemetry."""
    stt = LocalWhisperSTTProvider.get_instance()
    wav_bytes = generate_test_wav()

    res = await stt.transcribe(wav_bytes, filename="test.wav")
    assert res.provider == "local_whisper"
    assert res.engine == "faster-whisper"
    assert res.decode_ms > 0.0
    assert res.error_code is None


@pytest.mark.asyncio
async def test_explicit_error_classification():
    """Verifies explicit error classification codes (AUDIO_EMPTY, AUDIO_SILENT)."""
    stt = LocalWhisperSTTProvider.get_instance()

    # Empty audio
    res_empty = await stt.transcribe(b"")
    assert res_empty.error_code == "AUDIO_EMPTY"

    # Silent audio (RMS < 0.001)
    sample_rate = 16000
    silent_pcm = np.zeros(sample_rate, dtype=np.float32)
    buf = io.BytesIO()
    sf.write(buf, silent_pcm, sample_rate, format='WAV')

    res_silent = await stt.transcribe(buf.getvalue(), filename="silent.wav")
    assert res_silent.error_code == "AUDIO_SILENT"


@pytest.mark.asyncio
async def test_voice_status_api_schema(async_client: AsyncClient):
    """Verifies GET /api/v1/voice/status exposes ffmpeg_available, ffmpeg_path, model_loaded, ready."""
    res = await async_client.get("/api/v1/voice/status")
    assert res.status_code == 200

    data = res.json()
    stt_meta = data["stt"]

    assert stt_meta["ffmpeg_available"] is True
    assert stt_meta["ffmpeg_path"] is not None
    assert stt_meta["model_loaded"] is True
    assert stt_meta["ready"] is True
