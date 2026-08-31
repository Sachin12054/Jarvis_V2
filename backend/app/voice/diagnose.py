import os
import sys
import shutil
import subprocess
from app.voice.stt_provider import LocalWhisperSTTProvider


def run_runtime_diagnostics():
    """Runtime Diagnostic Utility: Prints Python environment, single STT singleton instance identity, FFmpeg path, and readiness status."""
    print("=" * 70)
    print("JARVIS LOCAL STT RUNTIME ENVIRONMENT DIAGNOSTICS")
    print("=" * 70)

    print(f"Python Executable     : {sys.executable}")
    print(f"Current Working Dir   : {os.getcwd()}")
    print(f"System PATH FFmpeg    : {shutil.which('ffmpeg')}")

    try:
        import imageio_ffmpeg
        imageio_exe = imageio_ffmpeg.get_ffmpeg_exe()
        print(f"imageio_ffmpeg exe    : {imageio_exe}")
        print(f"imageio_ffmpeg exists : {os.path.exists(imageio_exe)}")
    except Exception as err:
        print(f"imageio_ffmpeg error  : {err}")

    print("-" * 70)
    print("INITIALIZING SINGLETON LOCAL STT PROVIDER...")

    provider = LocalWhisperSTTProvider.get_instance()

    print(f"Provider Instance ID     : {hex(id(provider))}")
    print(f"FFmpeg Available         : {provider.ffmpeg_available}")
    print(f"FFmpeg Path              : {provider.ffmpeg_path}")
    print(f"FFmpeg Version           : {provider.ffmpeg_version}")
    print(f"Whisper Model Name       : {provider.model_name}")
    print(f"Whisper Model Loaded     : {provider.model_loaded}")
    print(f"Whisper Device           : {provider.device}")
    print(f"Self-Test Passed         : {provider.selftest_passed}")
    print(f"STT Authoritative Ready  : {provider.ready}")
    print("=" * 70)

    if not provider.ready:
        print("DIAGNOSTIC RESULT: STT NOT READY!")
        sys.exit(1)
    else:
        print("DIAGNOSTIC RESULT: STT OPERATIONAL AND READY.")


if __name__ == "__main__":
    run_runtime_diagnostics()
