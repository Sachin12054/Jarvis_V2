# JARVIS -- Target Architecture Blueprint Document

**Date**: September 1, 2026
**Repository**: `Sachin12054/Jarvis`

---

## 1. Conceptual Target Flow

```
INPUT (Voice / Text)
  |
  v
PERCEPTION (Web Audio VAD / LocalWhisperSTTProvider)
  |
  v
UNDERSTANDING (InputNormalizer / CommandRouter Fast-Path)
  |
  +--> [Fast Path Direct Action]  -> ComputerUseGateway -> CuaDriverClient -> Windows
  |
  +--> [Reasoning / Q&A Task]    -> JARVISOrchestrator -> OllamaLLMProvider (Qwen3)
  |                                    -> ThinkingStreamFilter -> LocalKokoroTTS
  v
RESPONSE (SSE Text Deltas + 24kHz Audio WAV Queue)
```

---

## 2. Layer Responsibilities & Rules

1. **Perception**: Owns VAD energy sampling, WebM decoding via FFmpeg, and Faster-Whisper STT inference. Does not execute actions.
2. **Understanding & Routing**: Owns fast-path regex command matching and intent domain routing. Bypasses LLM for simple actions.
3. **Brain & Reasoning**: Owns dynamic context formatting (4000/8192/16384 tokens), prompt construction, and Ollama streaming. Does not handle raw audio or direct Win32 calls.
4. **Execution Gateway**: Owns desktop automation via exclusive CUA Driver (`cua-driver.exe`). PyAutoGUI, PyWinAuto, and PowerShell scripting are forbidden.
5. **Communication**: Owns phrase-chunked Kokoro TTS synthesis and frontend audio playback queue management.
6. **Memory**: Owns PostgreSQL/SQLite conversation history and user profile preferences.
