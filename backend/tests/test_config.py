from app.core.config import Settings


def test_default_settings():
    """Verifies default setting values."""
    settings = Settings()
    assert settings.APP_NAME == "JARVIS"
    assert settings.LLM_PROVIDER in ["mock", "openai", "gemini", "ollama"]
    assert settings.OLLAMA_BASE_URL == "http://127.0.0.1:11434"
    assert settings.OLLAMA_MODEL == "deepseek-r1-7b:latest"
    assert settings.OLLAMA_CODING_MODEL == "qwen-coder-3b:latest"
    assert settings.OLLAMA_FAST_MODEL == "gemma-3-4b:latest"
    assert settings.OLLAMA_TIMEOUT == 300.0
    assert settings.LLM_TIMEOUT > 0
    assert settings.is_production is False
