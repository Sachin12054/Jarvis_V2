import os
import sys
import asyncio
from app.main import app, lifespan


async def run_fastapi_lifespan_diagnostics():
    """Diagnostic utility that enters the actual FastAPI app lifespan and verifies app.state.local_stt."""
    print("=" * 70)
    print("JARVIS FASTAPI LIFESPAN STT DIAGNOSTIC UTILITY")
    print("=" * 70)
    print(f"Process PID           : {os.getpid()}")
    print(f"Python Executable     : {sys.executable}")
    print(f"Working Directory     : {os.getcwd()}")
    print("-" * 70)

    print("ENTERING FASTAPI LIFESPAN CONTEXT...")

    async with lifespan(app):
        print("LIFESPAN CONTEXT ENTERED SUCCESSFULLY.")
        stt = getattr(app.state, "local_stt", None)

        if stt is None:
            print("ERROR: app.state.local_stt is None!")
            sys.exit(1)

        print(f"App State STT Object ID : {hex(id(stt))}")
        print(f"FFmpeg Available        : {stt.ffmpeg_available}")
        print(f"FFmpeg Path             : {stt.ffmpeg_path}")
        print(f"Whisper Model Name      : {stt.model_name}")
        print(f"Whisper Model Loaded    : {stt.model_loaded}")
        print(f"Self-Test Passed        : {stt.selftest_passed}")
        print(f"Authoritative Ready     : {stt.ready}")
        print(f"Initialization Error    : {stt.initialization_error or 'None'}")
        print("=" * 70)

        if not stt.ready:
            print("FASTAPI LIFESPAN RESULT: STT NOT READY!")
            sys.exit(1)
        else:
            print("FASTAPI LIFESPAN RESULT: STT FULLY OPERATIONAL AND READY.")


if __name__ == "__main__":
    asyncio.run(run_fastapi_lifespan_diagnostics())
