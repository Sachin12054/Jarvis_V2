import json
import pytest
from app.voice.tts_streamer import ThinkingStreamFilter, stream_chat_and_tts


def test_thinking_stream_filter():
    """Verifies that private internal <think>...</think> reasoning blocks are stripped from user stream."""
    filter_engine = ThinkingStreamFilter()

    chunk1 = filter_engine.process_chunk("<think>This is internal reasoning.</think>Hello! ")
    chunk2 = filter_engine.process_chunk("How can I ")
    chunk3 = filter_engine.process_chunk("help you?")
    flush_res = filter_engine.flush()

    full_output = chunk1 + chunk2 + chunk3 + flush_res
    print(f"\n[THINKING FILTER RESULT]: '{full_output}'")

    assert "<think>" not in full_output
    assert "internal reasoning" not in full_output
    assert "Hello! How can I help you?" in full_output


@pytest.mark.asyncio
async def test_stream_chat_and_tts_engine():
    """Verifies that stream_chat_and_tts yields text deltas and done signal."""
    async def sample_llm_stream():
        yield "<think>Analyzing user query...</think>"
        yield "Sure, "
        yield "I am ready to help you with your task."

    events = []
    async for event in stream_chat_and_tts(sample_llm_stream()):
        events.append(event)
        print(f"\n[STREAM EVENT]: {event}")

    event_types = [e["type"] for e in events]
    assert "text_delta" in event_types
    assert "done" in event_types

    deltas = [e["text"] for e in events if e["type"] == "text_delta"]
    combined_text = "".join(deltas)
    assert "<think>" not in combined_text
    assert "Sure, I am ready to help you with your task." in combined_text
