import pytest
from unittest.mock import patch, AsyncMock
from app.cognition.command_router import CommandRouter
from app.execution.computer_gateway import ActionResult, ComputerUseGateway


@pytest.mark.asyncio
async def test_fast_path_command_bypassing():
    """Requirement Phase 5 & 7: Verifies simple computer commands bypass long LLM planning loops."""
    mock_action_result = ActionResult(
        requested_action="mock",
        executed=True,
        verified=True,
        evidence={"status": "mocked"},
    )

    fast_commands = [
        ("Open Notepad", "open_notepad"),
        ("Open Chrome", "open_chrome"),
        ("Open Google Chrome", "open_chrome"),
        ("Open VS Code", "open_vscode"),
        ("Open Visual Studio Code", "open_vscode"),
        ("Close tab", "close_tab"),
        ("New tab", "new_tab"),
        ("Go back", "browser_back"),
        ("Pause video", "pause_video"),
        ("Resume video", "resume_video"),
        ("Stop", "stop"),
    ]

    with patch.object(ComputerUseGateway, "focus_window", new_callable=AsyncMock, return_value=mock_action_result), \
         patch.object(ComputerUseGateway, "browser_close_tab", new_callable=AsyncMock, return_value=mock_action_result), \
         patch.object(ComputerUseGateway, "browser_new_tab", new_callable=AsyncMock, return_value=mock_action_result), \
         patch.object(ComputerUseGateway, "browser_back", new_callable=AsyncMock, return_value=mock_action_result), \
         patch.object(ComputerUseGateway, "pause_video", new_callable=AsyncMock, return_value=mock_action_result), \
         patch.object(ComputerUseGateway, "resume_video", new_callable=AsyncMock, return_value=mock_action_result):

        for cmd_input, expected_type in fast_commands:
            routed = await CommandRouter.route(cmd_input, channel="voice")
            print(f"\n[FAST PATH TEST] input='{cmd_input}' -> routed={routed.is_routed} priority={routed.priority} type='{routed.command_type}'")
            assert routed.is_routed is True
            assert routed.command_type == expected_type
            assert routed.priority <= 2
