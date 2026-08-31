import os
import sys
import time
import asyncio
import numpy as np
import soundfile as sf
from app.voice.stt_provider import LocalWhisperSTTProvider
from app.core.logging import logger


def generate_test_wav_bytes() -> bytes:
    """Generates a 1-second 16kHz sine wave audio buffer for standalone STT verification."""
    sample_rate = 16000
    t = np.linspace(0, 1.0, sample_rate, False)
    # Generate 440 Hz tone with non-zero RMS
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)

    buf = io.BytesIO()
    sf.write(buf, audio, sample_rate, format='WAV')
    return buf.getvalue()


import io

async def run_standalone_stt_test(audio_file_path: str = None):
    """Standalone Local STT Test Utility: Tests WebM/WAV audio decoding and Faster-Whisper inference independently."""
    print("=" * 60)
    print("JARVIS STANDALONE LOCAL STT TEST UTILITY")
    print("=" * 60)

    stt = LocalWhisperSTTProvider.get_instance()
    health = stt.health()
    print(f"Health Status: {health}")

    if audio_file_path and os.path.exists(audio_file_path):
        print(f"Loading audio file: {audio_file_path}")
        with open(audio_file_path, "rb") as f:
            audio_bytes = f.read()
        filename = os.path.basename(audio_file_path)
    else:
        print("No audio file provided. Generating test WAV audio buffer...")
        audio_bytes = generate_test_wav_bytes()
        filename = "synthetic_test.wav"

    print(f"Testing local transcription for '{filename}' ({len(audio_bytes)} bytes)...")
    t0 = time.time()
    res = await stt.transcribe(audio_bytes, filename=filename)
    latency_ms = (time.time() - t0) * 1000.0

    print("-" * 60)
    print(f"Transcript Result: '{res.text}'")
    print(f"Provider: {res.provider} | Engine: {res.engine} | Device: {res.device} | Model: {res.model}")
    print(f"Confidence: {res.confidence} | Duration: {res.duration_ms:.1f}ms | Total Latency: {latency_ms:.1f}ms")
    print("=" * 60)

    if res.error:
        print(f"ERROR: {res.error}")
        sys.exit(1)
    else:
        print("LOCAL STT TEST SUCCESSFUL.")


if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else None
    asyncio.run(run_standalone_stt_test(filepath))
