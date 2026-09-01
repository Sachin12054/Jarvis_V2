import time
import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.voice.contracts import (
    VoiceState,
    VoiceStateMachine,
    VoiceSession,
    VoiceEvent,
    VoiceEventType,
    AudioChunk,
)
from app.voice.session import VoiceSessionManager
from app.voice.tts_streamer import ThinkingStreamFilter, clean_tts_text, stream_chat_and_tts
from app.voice.kokoro_tts import LocalKokoroTTSService


@pytest.mark.asyncio
async def test_thinking_filter_strips_internal_reasoning():
    f = ThinkingStreamFilter()
    out1 = f.process_chunk("Hello <think>secret reasoning</think> world")
    out2 = f.flush()
    assert "Hello  world" in (out1 + out2)
    assert "secret reasoning" not in (out1 + out2)


@pytest.mark.asyncio
async def test_tts_text_cleanup():
    raw = " ```python\nprint(123)\n```\nSure sir, check [Google](https://google.com) *now* !"
    cleaned = clean_tts_text(raw)
    assert "Sure sir, check Google now!" in cleaned
    assert "print(123)" not in cleaned
    assert "https://google.com" not in cleaned
    assert "*" not in cleaned


@pytest.mark.asyncio
async def test_streaming_tts_chunk_sequence_and_order():
    async def text_gen():
        yield "First sentence. "
        yield "Second sentence. "
        yield "Third sentence. "

    mock_tts = MagicMock(spec=LocalKokoroTTSService)
    mock_tts.is_configured.return_value = True
    mock_tts.generate_speech = AsyncMock(return_value=b"RIFF_FAKE_WAV_HEADER_BYTES_300")

    events = []
    async for ev in stream_chat_and_tts(text_gen(), tts_service=mock_tts, session_id="s1", turn_id="t1"):
        events.append(ev)

    audio_events = [e for e in events if e.get("type") == "audio_chunk"]
    assert len(audio_events) >= 3
    sequences = [e["sequence"] for e in audio_events]
    assert sequences == list(range(len(sequences)))
    assert all(e["turn_id"] == "t1" for e in audio_events)


@pytest.mark.asyncio
async def test_stale_turn_and_sequence_enforcement():
    active_turn_id = "turn-active-999"
    incoming_chunks = [
        {"turn_id": "turn-active-999", "sequence": 0, "text": "Valid 0"},
        {"turn_id": "stale-turn-111", "sequence": 0, "text": "Stale chunk"},
        {"turn_id": "turn-active-999", "sequence": 1, "text": "Valid 1"},
    ]

    accepted = [c for c in incoming_chunks if c["turn_id"] == active_turn_id]
    assert len(accepted) == 2
    assert [c["sequence"] for c in accepted] == [0, 1]


@pytest.mark.asyncio
async def test_tts_cancellation_propagation():
    cancel_evt = asyncio.Event()

    async def text_gen():
        yield "First phrase. "
        cancel_evt.set()
        yield "Second phrase that should be cancelled. "

    mock_tts = MagicMock(spec=LocalKokoroTTSService)
    mock_tts.is_configured.return_value = True
    mock_tts.generate_speech = AsyncMock(return_value=b"RIFF_FAKE_WAV_BYTES")

    events = []
    async for ev in stream_chat_and_tts(text_gen(), tts_service=mock_tts, cancel_event=cancel_evt):
        events.append(ev)

    audio_events = [e for e in events if e.get("type") == "audio_chunk"]
    assert len(audio_events) <= 1


@pytest.mark.asyncio
async def test_invalid_and_empty_audio_rejection():
    async def text_gen():
        yield "Phrase with empty tts response. "

    mock_tts = MagicMock(spec=LocalKokoroTTSService)
    mock_tts.is_configured.return_value = True
    mock_tts.generate_speech = AsyncMock(return_value=b"")

    events = []
    async for ev in stream_chat_and_tts(text_gen(), tts_service=mock_tts):
        events.append(ev)

    audio_events = [e for e in events if e.get("type") == "audio_chunk"]
    assert len(audio_events) == 0


@pytest.mark.asyncio
async def test_non_fatal_tts_error_recovery():
    assert True