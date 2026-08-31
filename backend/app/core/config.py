import os
import logging
from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "JARVIS"
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Workspace Settings
    JARVIS_WORKSPACE_ROOT: str = Field(
        default_factory=lambda: os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")),
        description="Root directory for safe workspace filesystem tools"
    )

    # Map & Location Settings
    JARVIS_MAP_PROVIDER: str = Field(default="openstreetmap", description="Map provider: openstreetmap, demo, google")
    JARVIS_MAP_API_KEY: Optional[str] = Field(default=None, description="API Key for map provider (if required)")

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://jarvis_user:jarvis_password@localhost:5432/jarvis_db"

    # LLM Settings
    LLM_PROVIDER: str = Field(default="ollama", description="Provider: mock, openai, gemini, ollama")
    LLM_API_KEY: Optional[str] = Field(default=None, description="API Key for the chosen provider")
    LLM_MODEL: str = Field(default="deepseek-r1-7b:latest", description="Model identifier")
    LLM_TIMEOUT: float = Field(default=30.0, description="Timeout in seconds for LLM calls")

    # Local Whisper Speech-to-Text (STT) Settings
    JARVIS_STT_PROVIDER: str = Field(default="local_whisper", description="STT Provider: local_whisper")
    JARVIS_STT_MODEL: str = Field(default="tiny", description="Local Whisper model: tiny, base, small, medium")
    JARVIS_STT_ENGINE: str = Field(default="faster-whisper", description="Local STT engine: faster-whisper")
    JARVIS_STT_DEVICE: str = Field(default="cpu", description="Device: auto, cuda, cpu")
    JARVIS_STT_PORT: int = Field(default=8001, description="Localhost Whisper server port")

    # Local Text-to-Speech (TTS) Settings - Kokoro-82M
    TTS_PROVIDER: str = Field(default="kokoro", description="Default TTS provider: kokoro, elevenlabs")
    KOKORO_MODEL: str = Field(default="Kokoro-82M", description="Kokoro TTS model name")
    KOKORO_VOICE: str = Field(default="am_adam", description="Default Kokoro voice: am_adam (deep male)")
    KOKORO_SPEED: float = Field(default=1.0, description="Kokoro playback speed multiplier")
    KOKORO_DEVICE: str = Field(default="cpu", description="Execution device: auto, cuda, cpu")

    # ElevenLabs Voice Integration Settings (Legacy/Fallback)
    ELEVENLABS_API_KEY: Optional[str] = Field(default=None, description="API Key for ElevenLabs TTS")
    ELEVENLABS_VOICE_ID: str = Field(default="pNInz6obpgDQGcFmaJgB", description="Voice ID for ElevenLabs TTS")
    ELEVENLABS_TTS_MODEL: str = Field(default="eleven_multilingual_v2", description="TTS model for ElevenLabs")
    ELEVENLABS_TIMEOUT: float = Field(default=15.0, description="Timeout in seconds for ElevenLabs API calls")

    # Ollama Local Settings & Explicit Timeouts
    OLLAMA_BASE_URL: str = Field(default="http://127.0.0.1:11434", description="Ollama local HTTP API base URL")
    OLLAMA_MODEL: str = Field(default="deepseek-r1-7b:latest", description="Default Ollama model")
    OLLAMA_CODING_MODEL: str = Field(default="qwen-coder-3b:latest", description="Ollama coding model")
    OLLAMA_FAST_MODEL: str = Field(default="gemma-3-4b:latest", description="Ollama fast model")
    OLLAMA_TIMEOUT: float = Field(default=300.0, description="Ollama overall timeout in seconds")
    OLLAMA_CONNECT_TIMEOUT: float = Field(default=5.0, description="Ollama HTTP connection timeout in seconds")
    OLLAMA_READ_TIMEOUT: float = Field(default=120.0, description="Ollama HTTP read timeout in seconds")

    # JARVIS Identity
    JARVIS_IDENTITY_NAME: str = "JARVIS"

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() == "production"

    @property
    def parsed_log_level(self) -> int:
        return getattr(logging, self.LOG_LEVEL.upper(), logging.INFO)


settings = Settings()
