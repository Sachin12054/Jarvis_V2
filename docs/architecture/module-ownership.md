# JARVIS Module Ownership Specification

### Perception Subsystem
- OWNS: Faster-Whisper STT, FFmpeg decoding, VAD energy monitoring
- USED BY: api/voice.py

### Execution Subsystem
- OWNS: ComputerUseGateway, CuaDriverClient, CUA Driver binary
- USED BY: command_router.py, agent.py

### Brain Subsystem
- OWNS: OllamaLLMProvider, ContextManager, JARVISOrchestrator
- USED BY: chat_service.py, agent.py