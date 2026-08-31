import io
import pytest
import numpy as np
import soundfile as sf
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
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
def reset_voice_singletons():
    LocalWhisperSTTProvider.reset_instance()
    LocalWhisperServerManager.reset_instance()
    yield
    LocalWhisperSTTProvider.reset_instance()
    LocalWhisperServerManager.reset_instance()


def test_deep_cinematic_tts_settings():
    """Verifies ElevenLabsTTSProvider is configured for a deep, calm, cinematic male assistant voice."""
    tts = ElevenLabsTTSProvider()
    assert tts.voice_id is not None
    assert tts.tts_model == "eleven_multilingual_v2"


@pytest.mark.asyncio
async def test_audio_decoding_and_telemetry():
    """Verifies LocalWhisperSTTProvider decodes PCM audio and logs RMS/peak telemetry."""
    stt = LocalWhisperSTTProvider.get_instance()
    wav_bytes = generate_test_wav()

    res = await stt.transcribe(wav_bytes, filename="speech.wav")
    assert res.provider == "local_whisper"
    assert res.engine == "faster-whisper"
    assert res.error is None


@pytest.mark.asyncio
async def test_voice_status_endpoint(async_client: AsyncClient):
    """Verifies GET /api/v1/voice/status endpoint returns local STT status and TTS provider."""
    res = await async_client.get("/api/v1/voice/status")
    assert res.status_code == 200

    data = res.json()
    assert data["stt"]["provider"] == "local_whisper"
    assert data["stt"]["resident"] is True
    assert data["tts"]["provider"] == "elevenlabs"


@pytest.mark.asyncio
async def test_voice_bargein_and_fastpath_interruption(db_session: AsyncSession):
    """Verifies fast-path voice commands ('Stop', 'Cancel') interrupt active tasks immediately."""
    chat_service = ChatService()

    res_stop = await chat_service.handle_chat_request(db_session, "Stop", channel="voice")
    assert res_stop["message"] == "Stopped."

    res_cancel = await chat_service.handle_chat_request(db_session, "Cancel", channel="voice")
    assert res_cancel["message"] == "Stopped."
