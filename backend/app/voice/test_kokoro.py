import os
import sys
import time
import asyncio

# Ensure backend root is in sys.path when executed
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from app.voice.kokoro_tts import LocalKokoroTTSService


async def main():
    print("=" * 60)
    print("JARVIS LOCAL KOKORO TTS DIAGNOSTIC TEST")
    print("=" * 60)
    print("PID:", os.getpid())
    print("Python:", sys.executable)
    print()

    service = LocalKokoroTTSService.get_instance()
    t0 = time.time()
    print("[1/3] Initializing LocalKokoroTTSService...")
    service.initialize()
    init_dur = (time.time() - t0) * 1000.0

    health = service.health()
    print(f"Initialization took {init_dur:.1f}ms")
    print("Health Status:", health)
    print()

    if not service.ready:
        print("[ERROR] Kokoro TTS Service is not ready!")
        print("Error details:", service.initialization_error)
        sys.exit(1)

    print("[2/3] Synthesizing sample text: 'Hello. I am JARVIS, your local computer control assistant.'")
    t1 = time.time()
    sample_text = "Hello. I am JARVIS, your local computer control assistant."
    audio_bytes = await service.generate_speech(sample_text)
    gen_dur = (time.time() - t1) * 1000.0

    print(f"[3/3] Speech generation completed in {gen_dur:.1f}ms.")
    print(f"WAV Audio Output Bytes: {len(audio_bytes)} bytes")
    
    if len(audio_bytes) > 44: # Standard WAV header is 44 bytes
        print("SUCCESS: Local Kokoro TTS synthesized valid WAV audio!")
    else:
        print("FAILURE: Kokoro TTS output returned 0 or invalid audio bytes.")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
