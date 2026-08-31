import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.cursor_service import CursorService
from app.agent.os.window_verifier import WindowVerificationService
from app.brain.attention_engine import AttentionEngine, AttentionMode
from app.brain.transcript_quality import TranscriptQualityEngine, TranscriptClassification


@pytest.fixture(autouse=True)
def reset_feature4_1_singletons():
    """Resets AttentionEngine, CursorService, and WindowVerificationService before each test."""
    AttentionEngine.reset_instance()
    CursorService.reset_instance()
    WindowVerificationService.reset_instance()
    yield
    AttentionEngine.reset_instance()
    CursorService.reset_instance()
    WindowVerificationService.reset_instance()


def test_transcript_quality_noise_filtering():
    """Verifies bracketed noise events ([clicking], [laughs]) are classified as NON_SPEECH_EVENT and rejected."""
    res1 = TranscriptQualityEngine.analyze("[clicking]")
    assert res1.classification == TranscriptClassification.NON_SPEECH_EVENT
    assert res1.is_executable_command is False

    res2 = TranscriptQualityEngine.analyze("[laughs]")
    assert res2.classification == TranscriptClassification.NON_SPEECH_EVENT
    assert res2.is_executable_command is False


def test_transcript_quality_wake_word_only():
    """Verifies single wake word 'Javis' or 'Hey Jarvis' classifies to WAKE_WORD_ONLY."""
    res1 = TranscriptQualityEngine.analyze("Javis")
    assert res1.classification == TranscriptClassification.WAKE_WORD_ONLY
    assert res1.is_wake_word is True

    res2 = TranscriptQualityEngine.analyze("Hey Jarvis")
    assert res2.classification == TranscriptClassification.WAKE_WORD_ONLY
    assert res2.is_wake_word is True


@pytest.mark.asyncio
async def test_continuous_voice_attention_without_wake_word(db_session: AsyncSession):
    """Verifies that once Voice Mode is active and engaged, subsequent turns (Open Chrome, Go to YouTube) do NOT require wake word repeat."""
    agent = JARVISAgent()
    engine = AttentionEngine.get_instance()

    # Turn 1: Wake word 'Javis' activates engagement
    res1 = await agent.process_turn(db_session, "Javis", channel="voice")
    assert res1["message"] == "Yes?"
    assert engine.mode == AttentionMode.ENGAGED

    # Turn 2: 'Open Chrome' without wake word
    res2 = await agent.process_turn(db_session, "Open Chrome", channel="voice")
    assert res2.get("ignored") is not True
    assert len(res2["message"]) > 0

    # Turn 3: 'Go to YouTube' without wake word
    res3 = await agent.process_turn(db_session, "Go to YouTube", channel="voice")
    assert res3.get("ignored") is not True
    assert "YouTube" in res3["message"] or "opened" in res3["message"].lower()


def test_win32_window_verification_contract():
    """Verifies WindowVerificationService returns structured verification result with window_found, window_visible, and window_foreground fields."""
    verifier = WindowVerificationService.get_instance()
    res = verifier.verify_application_foreground("Chrome", expected_executable="chrome.exe")

    assert res.application == "Chrome"
    assert res.process_name == "chrome.exe"
    assert isinstance(res.window_found, bool)
    assert isinstance(res.window_visible, bool)
    assert isinstance(res.window_foreground, bool)


def test_cursor_position_diagnostics_fallback():
    """Verifies CursorService retrieves mouse position via 5-level fallback hierarchy without returning 'I can't access your cursor'."""
    service = CursorService.get_instance()
    res = service.inspect_cursor_target()

    assert res.success is True
    assert res.x >= 0
    assert res.y >= 0
    assert "can see where your cursor is" in res.diagnostic_message or "Your cursor is at" in res.diagnostic_message


def test_app_launcher_verification_contract():
    """Verifies AppLauncher returns verified foreground status contract."""
    launcher = AppLauncher()
    res = launcher.launch_app("Chrome")

    assert "success" in res
    assert "verified" in res
    assert res["application"] == "Chrome"
