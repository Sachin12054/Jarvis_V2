import pytest
from unittest.mock import patch, AsyncMock
from app.voice.normalization import normalize_voice_command
from app.execution.computer_gateway import ActionResult, ComputerUseGateway


def test_voice_command_normalization_cases():
    """Requirement Phase 1 & 7: Test deterministic STT normalization mapping."""
    test_cases = [
        ("open not bad", "Open Notepad.", "application_alias"),
        ("open note pad", "Open Notepad.", "application_alias"),
        ("open notepad", "Open Notepad.", "application_alias"),
        ("launch chrome", "Launch Google Chrome.", "application_alias"),
        ("open google chrome", "Open Google Chrome.", "application_alias"),
        ("open vs code", "Open Visual Studio Code.", "application_alias"),
        ("not bad", "Notepad.", "standalone_alias"),
        ("note pad", "Notepad.", "standalone_alias"),
        ("What is the weather today?", "What is the weather today?", None),
        ("Search for artificial intelligence", "Search for artificial intelligence", None),
    ]

    for raw_input, expected_normalized, expected_rule in test_cases:
        norm_text, rule = normalize_voice_command(raw_input)
        print(f"\n[STT NORM TEST] raw='{raw_input}' -> norm='{norm_text}' rule='{rule}'")
        assert norm_text == expected_normalized
        assert rule == expected_rule


@pytest.mark.asyncio
async def test_command_router_accuracy_on_normalized_speech():
    """Verifies that normalized speech commands correctly trigger CommandRouter fast path."""
    from app.cognition.command_router import CommandRouter

    mock_action_result = ActionResult(
        requested_action="mock",
        executed=True,
        verified=True,
        evidence={"status": "mocked"},
    )

    with patch.object(ComputerUseGateway, "focus_window", new_callable=AsyncMock, return_value=mock_action_result):
        res1 = await CommandRouter.route("Open Notepad.")
        assert res1.is_routed is True
        assert res1.command_type == "open_notepad"

        res2 = await CommandRouter.route("Open Google Chrome.")
        assert res2.is_routed is True
        assert res2.command_type == "open_chrome"

        res3 = await CommandRouter.route("Open Visual Studio Code.")
        assert res3.is_routed is True
        assert res3.command_type == "open_vscode"
