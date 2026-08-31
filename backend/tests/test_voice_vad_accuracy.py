import pytest
import numpy as np
from app.voice.stt_provider import LocalWhisperSTTProvider, evaluate_stt_quality


@pytest.mark.asyncio
async def test_silent_audio_rejection():
    """Phase 1 & 16: Verifies that near-zero energy audio or silence is rejected without creating turn execution."""
    stt = LocalWhisperSTTProvider.get_instance()
    
    # 0.5s of absolute silence
    silent_pcm = np.zeros(8000, dtype=np.float32)
    bytes_io = silent_pcm.tobytes()

    transcription = await stt.transcribe(bytes_io, filename="silent.raw", capture_id="test_silent")
    print(f"\n[VAD ACCURACY TEST] Silent input -> error_code='{transcription.error_code}' text='{transcription.text}'")
    assert transcription.error_code in ["AUDIO_SILENT", "AUDIO_INVALID"]
    assert transcription.text == ""


def test_vad_noise_floor_and_quality_evaluation():
    """Phase 1 & 4: Verifies noise floor quality statistics evaluation."""
    # 1. Repeated hallucinated word loops
    fake_segments = [
        type("Segment", (), {"text": "click click click click click click", "avg_logprob": -0.2, "no_speech_prob": 0.05, "compression_ratio": 1.1})()
    ]
    is_ok, reason, _ = evaluate_stt_quality(fake_segments, "click click click click click click", 1000.0)
    print(f"\n[HALLUCINATION GUARD TEST] Phrase='click click click...' -> ok={is_ok} reason='{reason}'")
    assert is_ok is False
    assert "REPETITION" in reason

    # 2. Valid fluent sentence
    valid_segments = [
        type("Segment", (), {"text": "Can you open Chrome?", "avg_logprob": -0.15, "no_speech_prob": 0.02, "compression_ratio": 1.0})()
    ]
    is_ok2, reason2, conf2 = evaluate_stt_quality(valid_segments, "Can you open Chrome?", 1200.0)
    print(f"[HALLUCINATION GUARD TEST] Valid phrase -> ok={is_ok2} reason='{reason2}' conf={conf2:.2f}")
    assert is_ok2 is True
    assert conf2 > 0.8
