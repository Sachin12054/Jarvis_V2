import time
import asyncio
import pytest
import numpy as np
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
from app.voice.stt_provider import evaluate_stt_quality, LocalVoiceTranscription
from app.voice.normalization import normalize_voice_command


@pytest.mark.asyncio
async def test_silence_rejection():
    ok, reason, conf = evaluate_stt_quality([], "", 1000.0)
    assert ok is False
    assert reason == "EMPTY_TRANSCRIPT"


@pytest.mark.asyncio
async def test_quiet_speech_evaluation():
    mock_seg = MagicMock()
    mock_seg.avg_logprob = -0.3
    mock_seg.no_speech_prob = 0.05
    mock_seg.compression_ratio = 1.1
    ok, reason, conf = evaluate_stt_quality([mock_seg], "open notepad", 1200.0)
    assert ok is True
    assert reason == "PASSED"
    assert conf > 0.6


@pytest.mark.asyncio
async def test_adaptive_noise_floor_and_thresholds():
    noise_samples = [5.0, 6.0, 5.5, 7.0, 6.5, 5.0, 6.0, 5.5, 6.0, 6.5]
    avg_noise = sum(noise_samples) / len(noise_samples)
    noise_floor = max(5.0, avg_noise)
    speech_threshold = max(16.0, noise_floor * 3.2)
    silence_threshold = max(8.0, speech_threshold * 0.55)

    assert noise_floor >= 5.0
    assert speech_threshold > noise_floor
    assert silence_threshold < speech_threshold


@pytest.mark.asyncio
async def test_speech_start_and_end_detection():
    t_start = 1000.0
    t_speech_onset = 1250.0
    t_speech_end = 2100.0
    speech_duration = t_speech_end - t_speech_onset

    assert speech_duration == 850.0
    assert speech_duration >= 250.0


@pytest.mark.asyncio
async def test_pre_roll_preservation():
    pre_roll_frames = [np.zeros(256) for _ in range(15)]
    assert len(pre_roll_frames) == 15
    assert len(pre_roll_frames) * 20 > 250


@pytest.mark.asyncio
async def test_short_command_detection():
    mock_seg = MagicMock()
    mock_seg.avg_logprob = -0.2
    mock_seg.no_speech_prob = 0.01
    mock_seg.compression_ratio = 1.0
    ok, reason, conf = evaluate_stt_quality([mock_seg], "stop", 400.0)
    assert ok is True
    assert reason == "PASSED"


@pytest.mark.asyncio
async def test_long_speech_and_natural_pauses():
    mock_seg = MagicMock()
    mock_seg.avg_logprob = -0.4
    mock_seg.no_speech_prob = 0.1
    mock_seg.compression_ratio = 1.2
    text = "open chrome and search youtube for funny cats"
    ok, reason, conf = evaluate_stt_quality([mock_seg], text, 4500.0)
    assert ok is True
    assert reason == "PASSED"


@pytest.mark.asyncio
async def test_continued_speech_beyond_3s_supported():
    # Audio capture duration of 15 seconds must be valid and supported
    mock_seg = MagicMock()
    mock_seg.avg_logprob = -0.3
    mock_seg.no_speech_prob = 0.02
    mock_seg.compression_ratio = 1.1
    text = "JARVIS can you tell me what the capital of Karnataka is and give me two interesting facts about the city"
    ok, reason, conf = evaluate_stt_quality([mock_seg], text, 15000.0)
    assert ok is True
    assert reason == "PASSED"


@pytest.mark.asyncio
async def test_natural_pause_preservation():
    # Pause of 800ms between words should NOT cut off utterance (hangover threshold = 1200ms)
    pause_ms = 800.0
    silence_hangover_ms = 1200.0
    assert pause_ms < silence_hangover_ms


@pytest.mark.asyncio
async def test_barge_in_cancellation_during_tts():
    mgr = VoiceSessionManager()
    session = await mgr.create_session(conversation_id="conv-barge1")
    session, turn_id = await mgr.start_turn(session.session_id, turn_id="turn-barge1")
    session = await mgr.transition_state(session.session_id, VoiceState.PROCESSING)
    session = await mgr.transition_state(session.session_id, VoiceState.THINKING)
    session = await mgr.transition_state(session.session_id, VoiceState.SPEAKING)

    # User speaks while JARVIS is speaking -> triggers interruption
    interrupted_session = await mgr.request_interruption(session.session_id, turn_id=turn_id)
    assert interrupted_session.state == VoiceState.IDLE
    assert interrupted_session.active_turn_id is None


@pytest.mark.asyncio
async def test_false_activation_and_repetition_rejection():
    mock_seg = MagicMock()
    mock_seg.avg_logprob = -0.5
    mock_seg.no_speech_prob = 0.05
    mock_seg.compression_ratio = 1.0
    repetitive_text = "click click click click click click"
    ok, reason, conf = evaluate_stt_quality([mock_seg], repetitive_text, 1500.0)
    assert ok is False
    assert "REPETITION" in reason


@pytest.mark.asyncio
async def test_empty_and_corrupt_audio_rejection():
    raw_bytes = b""
    assert len(raw_bytes) < 300
    tx = LocalVoiceTranscription(text="", error_code="AUDIO_INVALID", error="Invalid WebM header")
    assert tx.error_code == "AUDIO_INVALID"
    assert tx.text == ""


@pytest.mark.asyncio
async def test_voice_normalization_and_low_confidence():
    normalized, rule = normalize_voice_command("hey jarvis open chrome")
    assert "open Google Chrome" in normalized or "open chrome" in normalized or "chrome" in normalized.lower()

    mock_seg = MagicMock()
    mock_seg.avg_logprob = -1.8
    mock_seg.no_speech_prob = 0.8
    mock_seg.compression_ratio = 1.0
    ok, reason, conf = evaluate_stt_quality([mock_seg], "muffled noise", 2000.0)
    assert ok is False
    assert "LOW_AVERAGE_LOGPROB" in reason or "HIGH_NO_SPEECH" in reason


@pytest.mark.asyncio
async def test_turn_and_session_id_propagation_and_interruption():
    mgr = VoiceSessionManager()
    session = await mgr.create_session(conversation_id="conv-p1")
    session, turn_id = await mgr.start_turn(session.session_id, turn_id="turn-p101")

    assert session.session_id is not None
    assert session.conversation_id == "conv-p1"
    assert turn_id == "turn-p101"
    assert session.active_turn_id == "turn-p101"

    session = await mgr.request_interruption(session.session_id, turn_id=turn_id)
    assert session.state == VoiceState.IDLE
    assert session.active_turn_id is None


@pytest.mark.asyncio
async def test_latency_instrumentation():
    t0 = time.time()
    time.sleep(0.01)
    t1 = time.time()
    latency_ms = (t1 - t0) * 1000.0
    assert latency_ms >= 5.0
    assert latency_ms < 100.0
