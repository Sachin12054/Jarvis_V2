from app.core.config import Settings


def test_default_settings():
    """Verifies default setting values."""
    settings = Settings()
    assert settings.APP_NAME == "JARVIS"
    assert settings.LLM_PROVIDER in ["mock", "openai", "gemini"]
    assert settings.LLM_TIMEOUT > 0
    assert settings.is_production is False
