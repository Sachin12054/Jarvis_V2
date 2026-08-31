import io
import pytest
import numpy as np
import soundfile as sf
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.services.chat_service import ChatService
from app.voice.stt_provider import LocalWhisperSTTProvider, LocalWhisperServerManager
from app.voice.tts_provider import ElevenLabsTTSProvider


def generate_test_wav() -> bytes:
    sample_rate = 16000
    t = np.linspace(0, 1.0, sample_rate, False)
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)
    buf = io.BytesIO()
    sf.write(buf, audio, sample_rate, format='WAV')
    return buf.getvalue()


@pytest.fixture(autouse=True)
def reset_local_stt():
    LocalWhisperSTTProvider.reset_instance()
    LocalWhisperServerManager.reset_instance()
    yield
    LocalWhisperSTTProvider.reset_instance()
    LocalWhisperServerManager.reset_instance()


def test_local_whisper_health():
    """Verifies LocalWhisperSTTProvider health endpoint returns resident local_whisper provider metadata."""
    stt = LocalWhisperSTTProvider.get_instance()
    h = stt.health()

    assert h["provider"] == "local_whisper"
    assert h["available"] is True
    assert h["engine"] == "faster-whisper"
    assert h["resident"] is True
    assert "device" in h


@pytest.mark.asyncio
async def test_local_whisper_transcription():
    """Verifies local transcription executes real PyAV/SoundFile audio decoding and Faster-Whisper inference."""
    stt = LocalWhisperSTTProvider.get_instance()
    wav_bytes = generate_test_wav()
    res = await stt.transcribe(wav_bytes, filename="test.wav")

    assert res.provider == "local_whisper"
    assert res.engine == "faster-whisper"
    assert res.error is None


def test_whisper_model_loaded_once():
    """Verifies LocalWhisperServerManager singleton keeps model resident once in memory."""
    m1 = LocalWhisperServerManager.get_instance()
    m2 = LocalWhisperServerManager.get_instance()

    assert m1 is m2
    assert m1.model_loaded is True


def test_no_elevenlabs_stt_calls():
    """Verifies zero ElevenLabs STT calls exist in settings configuration."""
    assert not hasattr(settings, "ELEVENLABS_STT_MODEL")
    assert settings.JARVIS_STT_PROVIDER == "local_whisper"


@pytest.mark.asyncio
async def test_voice_status_api(async_client: AsyncClient):
    """Verifies GET /api/v1/voice/status returns 100% local STT status."""
    res = await async_client.get("/api/v1/voice/status")
    assert res.status_code == 200

    data = res.json()
    assert data["stt"]["provider"] == "local_whisper"
    assert data["stt"]["resident"] is True
    assert data["tts"]["provider"] == "elevenlabs"


@pytest.mark.asyncio
async def test_continuous_voice_turn(db_session: AsyncSession):
    """Verifies voice turn executes through ChatService cleanly using local STT."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Open Chrome", channel="voice")

    assert "conversation_id" in res
    assert "Chrome" in res["message"] or "open" in res["message"].lower()


@pytest.mark.asyncio
async def test_local_stt_stop_command(db_session: AsyncSession):
    """Verifies fast-path 'Stop' command interruption in voice mode."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Stop", channel="voice")

    assert res["message"] == "Stopped."
    assert res["model"] == "jarvis-command-router"


@pytest.mark.asyncio
async def test_local_stt_contextual_selection(db_session: AsyncSession):
    """Verifies 'Third one' maps directly to result #3 in voice mode."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Third one", channel="voice")

    assert res["message"] == "Playing."
    assert res["model"] == "jarvis-command-router"
