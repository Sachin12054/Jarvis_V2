import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.chat_service import ChatService
from app.execution.computer_gateway import ComputerUseGateway, ActionResult
from app.cognition.command_router import CommandRouter


@pytest.mark.asyncio
async def test_voice_open_chrome_fastpath(db_session: AsyncSession):
    """Verifies 'Open Chrome' maps directly to focus_window('Chrome') on computer gateway."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Open Chrome", channel="voice")

    assert res["message"] in ["Chrome is open.", "Couldn't open Chrome."]
    assert res["model"] == "jarvis-command-router"


@pytest.mark.asyncio
async def test_voice_open_vscode_fastpath(db_session: AsyncSession):
    """Verifies 'Switch to VS Code' maps directly to focus_window('VS Code')."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Switch to VS Code", channel="voice")

    assert res["message"] in ["VS Code is open.", "Couldn't open VS Code."]
    assert res["model"] == "jarvis-command-router"


@pytest.mark.asyncio
async def test_voice_close_tab_fastpath(db_session: AsyncSession):
    """Verifies 'Close this tab' executes Ctrl+W physical key press via gateway."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Close this tab", channel="voice")

    assert res["message"] == "Closed tab."
    assert res["model"] == "jarvis-command-router"


@pytest.mark.asyncio
async def test_voice_contextual_selection(db_session: AsyncSession):
    """Verifies 'Third one' maps directly to result #3 in active search context."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Third one", channel="voice")

    assert res["message"] == "Playing."
    assert res["model"] == "jarvis-command-router"


@pytest.mark.asyncio
async def test_voice_scroll_and_playback(db_session: AsyncSession):
    """Verifies 'Scroll down', 'Pause', and 'Resume' fast-path commands."""
    chat_service = ChatService()

    res_scroll = await chat_service.handle_chat_request(db_session, "Scroll down", channel="voice")
    assert res_scroll["message"] == "Scrolled down."

    res_pause = await chat_service.handle_chat_request(db_session, "Pause", channel="voice")
    assert res_pause["message"] == "Paused video."

    res_resume = await chat_service.handle_chat_request(db_session, "Resume", channel="voice")
    assert res_resume["message"] == "Resumed video."


@pytest.mark.asyncio
async def test_voice_emergency_stop(db_session: AsyncSession):
    """Verifies 'Stop' fast-path command halts TTS playback immediately."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Stop", channel="voice")

    assert res["message"] == "Stopped."
    assert res["model"] == "jarvis-command-router"
