import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.app_discovery import AppDiscoveryService, ChromeProfile
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.window_verifier import WindowVerificationService
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain


@pytest.fixture(autouse=True)
def reset_singletons():
    AppDiscoveryService.reset_instance()
    WindowVerificationService.reset_instance()
    yield
    AppDiscoveryService.reset_instance()
    WindowVerificationService.reset_instance()


def test_open_chrome_intent_classification():
    """Verifies Open Chrome, Launch Chrome, Start Chrome, Bring up Chrome, and Open my browser route to DESKTOP_ACTION."""
    phrases = ["Open Chrome", "Launch Chrome", "Start Chrome", "Bring up Chrome", "Open my browser"]
    for phrase in phrases:
        plan = IntentEngine.analyze(phrase)
        domains = [i.domain for i in plan.intents]
        assert IntentDomain.DESKTOP_ACTION in domains, f"Phrase '{phrase}' did not route to DESKTOP_ACTION."


@pytest.mark.asyncio
async def test_open_chrome_does_not_ask_profile_clarification(db_session: AsyncSession, monkeypatch):
    """Verifies 'Open Chrome' directly launches/focuses Chrome without blocking or asking profile clarification."""
    agent = JARVISAgent()
    service = AppDiscoveryService.get_instance()

    # Mock multi-profile environment
    mock_profiles = [
        ChromeProfile(name="Personal", dir_name="Default"),
        ChromeProfile(name="College", dir_name="Profile 1"),
        ChromeProfile(name="Work", dir_name="Profile 2"),
    ]
    monkeypatch.setattr(service, "discover_chrome_profiles", lambda: mock_profiles)

    # Execute 'Open Chrome'
    res = await agent.process_turn(db_session, "Open Chrome", channel="chat")

    assert "message" in res
    assert "Which profile should I use?" not in res["message"]
    assert "Chrome is open" in res["message"] or "Chrome is already open" in res["message"]


@pytest.mark.asyncio
async def test_explicit_profile_request_asks_clarification(db_session: AsyncSession, monkeypatch):
    """Verifies explicit profile request 'Open my Gaming Chrome profile' triggers profile discovery and clarification."""
    agent = JARVISAgent()
    service = AppDiscoveryService.get_instance()

    mock_profiles = [
        ChromeProfile(name="Personal", dir_name="Default"),
        ChromeProfile(name="College", dir_name="Profile 1"),
        ChromeProfile(name="Work", dir_name="Profile 2"),
    ]
    monkeypatch.setattr(service, "discover_chrome_profiles", lambda: mock_profiles)

    res = await agent.process_turn(db_session, "Open my Gaming Chrome profile", channel="chat")

    assert "message" in res
    assert "Which one should I use?" in res["message"] or "I found 3 Chrome profiles" in res["message"]


def test_find_chrome_windows_helper():
    """Verifies WindowVerificationService.find_chrome_windows() returns structured window records."""
    verifier = WindowVerificationService.get_instance()
    windows = verifier.find_chrome_windows("chrome.exe")

    assert isinstance(windows, list)
    if windows:
        w = windows[0]
        assert "hwnd" in w
        assert "pid" in w
        assert "visible" in w
        assert "minimized" in w


def test_verify_chrome_foreground_helper():
    """Verifies WindowVerificationService.verify_chrome_foreground() returns verified dictionary."""
    verifier = WindowVerificationService.get_instance()
    res = verifier.verify_chrome_foreground()

    assert "verified" in res
    assert isinstance(res["verified"], bool)
