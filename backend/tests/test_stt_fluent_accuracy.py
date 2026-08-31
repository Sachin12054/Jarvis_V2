import pytest
from app.voice.normalization import normalize_voice_command
from app.voice.stt_provider import evaluate_stt_quality


def test_fluent_speech_normalization_and_accuracy():
    """Phase 3, 5, 16: Tests fluent sentence normalization, wake-word removal, and accuracy."""
    fluent_cases = [
        ("Hey Jarvis, open Notepad.", "Open Notepad.", "wake_word_strip"),
        ("JARVIS, open Visual Studio Code.", "Open Visual Studio Code.", "wake_word_strip"),
        ("Can you open Chrome?", "Can you open Chrome?", None),
        ("Jarvis, what is the capital of Australia?", "What is the capital of Australia?", "wake_word_strip"),
        ("open not bad", "Open Notepad.", "application_alias"),
        ("open vs code", "Open Visual Studio Code.", "application_alias"),
    ]

    for raw, expected_norm, expected_rule in fluent_cases:
        norm, rule = normalize_voice_command(raw)
        print(f"\n[FLUENT STT TEST] raw='{raw}' -> norm='{norm}' rule='{rule}'")
        assert norm == expected_norm
        assert rule == expected_rule


def test_stt_quality_hallucination_rejection():
    """Phase 4 & 16: Verifies suspicious/hallucinated text rejection."""
    # Low logprob rejection
    low_logprob_segs = [
        type("Segment", (), {"text": "open button here here to get you done", "avg_logprob": -1.8, "no_speech_prob": 0.4, "compression_ratio": 1.2})()
    ]
    is_ok, reason, _ = evaluate_stt_quality(low_logprob_segs, "open button here here to get you done", 2000.0)
    print(f"\n[STT REJECTION TEST] Low logprob -> ok={is_ok} reason='{reason}'")
    assert is_ok is False
    assert "LOW_AVERAGE_LOGPROB" in reason or "REPETITION" in reason
