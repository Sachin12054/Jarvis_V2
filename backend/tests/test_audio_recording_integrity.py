import pytest
from app.voice.stt_provider import LocalWhisperSTTProvider


@pytest.mark.asyncio
async def test_audio_recording_size_and_decode_integrity():
    """Phase 2 & 16: Tests audio payload size validation and structured decode error response."""
    stt = LocalWhisperSTTProvider.get_instance()

    # 1. Micro payload (< 300 bytes)
    micro_bytes = b"header_data_less_than_300_bytes"
    res1 = await stt.transcribe(micro_bytes, filename="micro.webm", capture_id="cap_test_micro")
    print(f"\n[AUDIO INTEGRITY TEST] Micro payload size={len(micro_bytes)} -> error_code='{res1.error_code}' retryable={res1.retryable}")
    assert res1.error_code == "AUDIO_INVALID"
    assert res1.retryable is True

    # 2. Corrupt EBML header payload (> 300 bytes of garbage)
    garbage_bytes = b"\x1a\x45\xdf\xa3" + (b"random_corrupt_data_garbage" * 30)
    res2 = await stt.transcribe(garbage_bytes, filename="corrupt.webm", capture_id="cap_test_corrupt")
    print(f"[AUDIO INTEGRITY TEST] Corrupt EBML size={len(garbage_bytes)} -> error_code='{res2.error_code}' retryable={res2.retryable}")
    assert res2.error_code == "AUDIO_INVALID"
    assert res2.retryable is True
