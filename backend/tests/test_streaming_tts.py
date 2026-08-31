import pytest
from app.voice.kokoro_tts import LocalKokoroTTSService
from app.voice.tts_streamer import stream_chat_and_tts


@pytest.mark.asyncio
async def test_streaming_tts_chunk_synthesis():
    """Requirement Phase 3 & 7: Verifies phrase-level TTS chunk synthesis."""
    tts = LocalKokoroTTSService.get_instance()
    tts.initialize()

    async def sentence_stream():
        yield "Hello there! "
        yield "This is a real-time sentence chunking test. "
        yield "It synthesizes audio as soon as a punctuation mark appears."

    audio_chunks = []
    text_deltas = []

    async for event in stream_chat_and_tts(sentence_stream(), tts_service=tts, min_chunk_length=10):
        if event["type"] == "audio_chunk":
            audio_chunks.append(event)
        elif event["type"] == "text_delta":
            text_deltas.append(event["text"])

    print(f"\n[STREAMING TTS TEST] Generated {len(audio_chunks)} audio chunks across {len(text_deltas)} text deltas.")
    for idx, chunk in enumerate(audio_chunks):
        print(f"  Chunk #{idx+1}: text='{chunk['text']}' audio_b64_len={len(chunk['audio_b64'])} latency_ms={chunk['latency_ms']:.1f}ms")

    assert len(text_deltas) > 0
    if tts.is_configured():
        assert len(audio_chunks) > 0
