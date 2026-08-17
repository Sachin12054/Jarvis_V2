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
    LLM_PROVIDER: str = Field(default="mock", description="Provider: mock, openai, gemini")
    LLM_API_KEY: Optional[str] = Field(default=None, description="API Key for the chosen provider")
    LLM_MODEL: str = Field(default="gpt-4o-mini", description="Model identifier")
    LLM_TIMEOUT: float = Field(default=30.0, description="Timeout in seconds for LLM calls")

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
