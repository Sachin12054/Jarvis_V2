import asyncio
import pytest
from app.api.voice import ACTIVE_TURNS, CancelVoiceTurnRequest, cancel_voice_turn
from app.brain.llm_manager import MockLLMProvider


@pytest.mark.asyncio
async def test_voice_turn_cancellation_endpoint():
    """Phase 8 & 9 & 16: Verifies turn cancellation registry and stream cancellation."""
    test_turn_id = "test_turn_12345"
    cancel_event = asyncio.Event()

    # Register active turn
    ACTIVE_TURNS[test_turn_id] = {
        "cancel_event": cancel_event,
        "created_at": 100.0,
        "capture_id": "cap_test_123",
    }

    assert cancel_event.is_set() is False

    # Invoke cancellation endpoint
    resp = await cancel_voice_turn(CancelVoiceTurnRequest(turn_id=test_turn_id))
    print(f"\n[TURN CANCEL TEST] cancel response={resp}")

    assert resp["success"] is True
    assert cancel_event.is_set() is True


@pytest.mark.asyncio
async def test_llm_stream_cancellation_on_cancel_event():
    """Phase 9 & 16: Verifies that Mock/Ollama stream raises CancelledError when cancel_event is set."""
    provider = MockLLMProvider()
    messages = [{"role": "user", "content": "Explain relativity"}]
    cancel_event = asyncio.Event()

    collected_chunks = []
    with pytest.raises(asyncio.CancelledError):
        async for chunk in provider.generate_response_stream(messages, cancel_event=cancel_event):
            collected_chunks.append(chunk)
            if len(collected_chunks) >= 2:
                cancel_event.set()

    print(f"\n[STREAM CANCEL TEST] Collected {len(collected_chunks)} chunks before CancelledError raised successfully.")
