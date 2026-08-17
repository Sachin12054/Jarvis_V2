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

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://jarvis_user:jarvis_password@localhost:5432/jarvis_db"

    # LLM Settings
    LLM_PROVIDER: str = Field(default="ollama", description="Provider: mock, openai, gemini, ollama")
    LLM_API_KEY: Optional[str] = Field(default=None, description="API Key for the chosen provider")
    LLM_MODEL: str = Field(default="deepseek-r1-7b:latest", description="Model identifier")
    LLM_TIMEOUT: float = Field(default=30.0, description="Timeout in seconds for LLM calls")

    # Ollama Local Settings
    OLLAMA_BASE_URL: str = Field(default="http://127.0.0.1:11434", description="Ollama local HTTP API base URL")
    OLLAMA_MODEL: str = Field(default="deepseek-r1-7b:latest", description="Default Ollama model")
    OLLAMA_CODING_MODEL: str = Field(default="qwen-coder-3b:latest", description="Ollama coding model")
    OLLAMA_FAST_MODEL: str = Field(default="gemma-3-4b:latest", description="Ollama fast model")
    OLLAMA_TIMEOUT: float = Field(default=120.0, description="Ollama request timeout in seconds")

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
