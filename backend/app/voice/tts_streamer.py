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


async def stream_chat_and_tts(
    text_stream: AsyncGenerator[str, None],
    tts_service: Optional[LocalKokoroTTSService] = None,
    min_chunk_length: int = 15,
) -> AsyncGenerator[Dict[str, Any], None]:
    """Consumes an LLM text delta stream, filters out internal thinking, accumulates phrases,
    synthesizes TTS chunks using Kokoro, and yields SSE event payloads.
    """
    filter_engine = ThinkingStreamFilter()
    accumulator = ""
    tts = tts_service or LocalKokoroTTSService.get_instance()
    t_start = time.time()
    first_token_sent = False
    first_audio_sent = False

    async for chunk in text_stream:
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
            phrase = accumulator[:boundary_idx].strip()
            accumulator = accumulator[boundary_idx:]

            if phrase and tts.is_configured():
                t_tts0 = time.time()
                audio_bytes = await tts.generate_speech(phrase)
                if audio_bytes:
                    b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
                    if not first_audio_sent:
                        first_audio_ms = (time.time() - t_start) * 1000.0
                        logger.info(f"[STREAMING TTS FIRST AUDIO] tts_first_audio_ms={first_audio_ms:.1f}ms")
                        first_audio_sent = True

                    yield {
                        "type": "audio_chunk",
                        "text": phrase,
                        "audio_b64": b64_audio,
                        "format": "wav",
                        "latency_ms": (time.time() - t_tts0) * 1000.0,
                    }

    # Flush remaining buffer
    remaining_text = filter_engine.flush() + accumulator
    if remaining_text.strip() and tts.is_configured():
        phrase = remaining_text.strip()
        t_tts0 = time.time()
        audio_bytes = await tts.generate_speech(phrase)
        if audio_bytes:
            b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
            yield {
                "type": "audio_chunk",
                "text": phrase,
                "audio_b64": b64_audio,
                "format": "wav",
                "latency_ms": (time.time() - t_tts0) * 1000.0,
            }

    yield {"type": "done", "total_ms": (time.time() - t_start) * 1000.0}
