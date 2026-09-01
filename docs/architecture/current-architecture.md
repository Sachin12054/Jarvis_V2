# JARVIS -- Current Architecture Analysis Document

**Date**: September 1, 2026
**Repository**: `Sachin12054/Jarvis`

---

## 1. Current System Flow

```
USER (Voice / Text)
  |
  +--> [Voice Path] Web Audio VAD -> MediaRecorder -> POST /api/v1/voice/stream
  |                     -> LocalWhisperSTTProvider (FFmpeg S16LE -> Faster-Whisper base.en)
  |                     -> quality_evaluation & normalization
  |                     -> CommandRouter Fast-Path (Priority 0/1)
  |                     -> ChatService -> JARVISAgent -> Ollama (qwen3-test:latest)
  |                     -> ThinkingStreamFilter -> LocalKokoroTTSService (24kHz WAV)
  |                     -> SSE Stream -> Frontend Audio Playback Queue
  |
  +--> [Text Path]  POST /api/v1/chat/stream -> ChatService -> JARVISAgent -> Ollama
```

---

## 2. Key Subsystem Analysis

### A. Voice Subsystem
- STT Provider: `LocalWhisperSTTProvider` resident Faster-Whisper `base.en` (CPU/CUDA float16).
- TTS Streaming: `LocalKokoroTTSService` generating real-time 24kHz WAV chunks.
- Interruption / Barge-in: Web Audio API VAD in frontend + `POST /api/v1/voice/cancel` + `ACTIVE_TURNS` registry.

### B. Brain & Reasoning
- Primary LLM: `qwen3-test:latest` via Ollama (`http://localhost:11434`).
- Context Window: 16,384 tokens with `asyncio.Lock()` concurrency guard.
- God Class: `JARVISAgent` in `backend/app/agent/agent.py` instantiates 25 sub-engines in constructor.

### C. Desktop Execution
- Backend Engine: Exclusive CUA Driver (`cua-driver.exe` via Named Pipe `\\.\pipe\cua-driver`).
- Subprocess Invocation: `CuaDriverClient` uses `subprocess.Popen` inside `asyncio.to_thread` for Python 3.12 compatibility.
- Obsolete Code: pyautogui, pywinauto, direct Win32 writing, and PowerShell scripting are obsolete.

---

## 3. Discovered Architectural Problems

1. **God Object `JARVISAgent`**: 25 sub-engines instantiated simultaneously.
2. **Duplicated Router Layers**: Overlapping logic in `CommandRouter`, `ModelRouter`, `ToolIntentRouter`.
3. **Obsolete Root Directory**: Vestigial `/app` folder at root level.
4. **Tightly Bound Perception & API**: Audio streaming and SSE formatting coupled directly inside `api/voice.py`.
