import base64
import json
import re
import time
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional, List
from app.core.logging import logger
from app.voice.kokoro_tts import LocalKokoroTTSService

THINKING_PATTERN = re.compile(r'<think>[\s\S]*?</think>', re.IGNORECASE)
SENTENCE_SPLIT_PATTERN = re.compile(r'([.!?:\n;]+)')


class ThinkingStreamFilter:
    """Filters out private internal <think>...</think> reasoning tags from LLM token stream."""

    def __init__(self):
        self.in_think = False
        self.buffer = ""

    def process_chunk(self, chunk: str) -> str:
        self.buffer += chunk
        output = []

        while self.buffer:
            if not self.in_think:
                start = self.buffer.find("<think>")
                if start != -1:
                    output.append(self.buffer[:start])
                    self.buffer = self.buffer[start + 7:]
                    self.in_think = True
                else:
                    output.append(self.buffer)
                    self.buffer = ""
            else:
                end = self.buffer.find("</think>")
                if end != -1:
                    self.buffer = self.buffer[end + 8:]
                    self.in_think = False
                else:
                    self.buffer = ""
                    break

        return "".join(output)

    def flush(self) -> str:
        if not self.in_think and self.buffer:
            res = self.buffer
            self.buffer = ""
            return res
        return ""


def clean_tts_text(text: str) -> str:
    """Cleans raw text for natural speech synthesis: removes markdown code blocks, links, formatting, and internal JSON."""
    if not text:
        return ""
    # Strip markdown code blocks ```...```
    cleaned = re.sub(r'```[\s\S]*?```', '', text)
    # Strip inline code `...`
    cleaned = re.sub(r'`[^`]+`', '', cleaned)
    # Strip markdown links [label](url) -> label
    cleaned = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', cleaned)
    # Strip formatting symbols (*, _, #)
    cleaned = re.sub(r'[*_#~]', '', cleaned)
    # Normalize spaces before punctuation
    cleaned = re.sub(r'\s+([,.!?])', r'\1', cleaned)
    # Strip json blocks {...} if standalone
    if cleaned.strip().startswith('{') and cleaned.strip().endswith('}'):
        cleaned = ""
    return cleaned.strip()


async def stream_chat_and_tts(
    text_stream: AsyncGenerator[str, None],
    tts_service: Optional[LocalKokoroTTSService] = None,
    min_chunk_length: int = 15,
    cancel_event: Optional[asyncio.Event] = None,
    session_id: Optional[str] = None,
    turn_id: Optional[str] = None,
) -> AsyncGenerator[Dict[str, Any], None]:
    """Consumes an LLM text delta stream, filters out internal thinking & markdown, accumulates phrases,
    synthesizes TTS chunks using Kokoro in strict sequence, and yields SSE event payloads.
    """
    filter_engine = ThinkingStreamFilter()
    accumulator = ""
    tts = tts_service or LocalKokoroTTSService.get_instance()
    t_start = time.time()
    first_token_sent = False
    first_audio_sent = False
    sequence = 0

    async for chunk in text_stream:
        if cancel_event and cancel_event.is_set():
            logger.info("[STREAMING TTS] Stream cancelled via cancel_event.")
            return

        clean_text = filter_engine.process_chunk(chunk)
        if not clean_text:
            continue

        if not first_token_sent:
            ttft_ms = (time.time() - t_start) * 1000.0
            logger.info(f"[STREAMING ENGINE TTFT] first_token_ms={ttft_ms:.1f}ms")
            first_token_sent = True

        yield {"type": "text_delta", "text": clean_text}
        accumulator += clean_text

        # Sentence/phrase boundary detection for TTS synthesis
        match = SENTENCE_SPLIT_PATTERN.search(accumulator)
        if match and len(accumulator) >= min_chunk_length:
            boundary_idx = match.end()
            raw_phrase = accumulator[:boundary_idx]
            accumulator = accumulator[boundary_idx:]

            phrase = clean_tts_text(raw_phrase)
            if phrase and tts.is_configured() and not (cancel_event and cancel_event.is_set()):
                t_tts0 = time.time()
                try:
                    audio_bytes = await tts.generate_speech(phrase)
                except Exception as tts_err:
                    logger.warning(f"[STREAMING TTS ERROR] Speech generation failed for phrase '{phrase}': {tts_err}")
                    audio_bytes = None

                if audio_bytes and len(audio_bytes) > 0 and not (cancel_event and cancel_event.is_set()):
                    b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
                    if not first_audio_sent:
                        first_audio_ms = (time.time() - t_start) * 1000.0
                        logger.info(f"[STREAMING TTS FIRST AUDIO] tts_first_audio_ms={first_audio_ms:.1f}ms")
                        first_audio_sent = True

                    yield {
                        "type": "audio_chunk",
                        "session_id": session_id,
                        "turn_id": turn_id,
                        "sequence": sequence,
                        "text": phrase,
                        "audio_b64": b64_audio,
                        "format": "wav",
                        "latency_ms": (time.time() - t_tts0) * 1000.0,
                    }
                    sequence += 1

    if cancel_event and cancel_event.is_set():
        return

    # Flush remaining buffer
    remaining_text = filter_engine.flush() + accumulator
    phrase = clean_tts_text(remaining_text)
    if phrase and tts.is_configured() and not (cancel_event and cancel_event.is_set()):
        t_tts0 = time.time()
        try:
            audio_bytes = await tts.generate_speech(phrase)
        except Exception as tts_err:
            logger.warning(f"[STREAMING TTS ERROR] Final phrase speech generation failed: {tts_err}")
            audio_bytes = None

        if audio_bytes and len(audio_bytes) > 0 and not (cancel_event and cancel_event.is_set()):
            b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
            yield {
                "type": "audio_chunk",
                "session_id": session_id,
                "turn_id": turn_id,
                "sequence": sequence,
                "text": phrase,
                "audio_b64": b64_audio,
                "format": "wav",
                "latency_ms": (time.time() - t_tts0) * 1000.0,
            }
            sequence += 1

    yield {"type": "done", "total_ms": (time.time() - t_start) * 1000.0}
