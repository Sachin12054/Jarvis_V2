import pytest
import asyncio
from unittest.mock import patch, MagicMock
from app.execution.cua_driver_client import CuaDriverClient, _run_subprocess_sync
from app.voice.normalization import normalize_voice_command


@pytest.mark.asyncio
async def test_subproc_execution_no_not_implemented_error():
    """Requirement 4 & 13: Regression test verifying subprocess execution never raises NotImplementedError on Windows Python 3.12."""
    client = CuaDriverClient()

    # Even under SelectorEventLoop or non-main threads, thread-pool Popen execution succeeds cleanly
    def mock_run_sync(cmd, input_bytes, timeout):
        return {
            "returncode": 0,
            "stdout": b'{"status": "ok"}',
            "stderr": b"",
            "error": None,
            "timeout": False,
        }

    with patch("app.execution.cua_driver_client._run_subprocess_sync", side_effect=mock_run_sync):
        res = await client._raw_call("list_windows", auto_start_daemon=False, auto_recover=False)
        assert res["success"] is True
        assert res["data"] == {"status": "ok"}
        assert res["error_category"] is None


@pytest.mark.asyncio
async def test_error_classification_diagnostics():
    """Requirement 11: Diagnostic error categorization distinguishing daemon unavailable vs subprocess execution error vs CUA tool error."""
    client = CuaDriverClient()

    # 1. Daemon unavailable
    def mock_daemon_not_running(cmd, input_bytes, timeout):
        return {
            "returncode": 1,
            "stdout": b"",
            "stderr": b"Cua Driver daemon is not running on pipe \\\\.\\pipe\\cua-driver",
            "error": None,
            "timeout": False,
        }

    client._daemon_spawn_failed = True  # Prevent auto-spawn attempt
    with patch("app.execution.cua_driver_client._run_subprocess_sync", side_effect=mock_daemon_not_running):
        res_daemon = await client._raw_call("list_windows", auto_start_daemon=False, auto_recover=False)
        assert res_daemon["success"] is False
        assert res_daemon["error_category"] == "DAEMON_UNAVAILABLE"

    # 2. Subprocess execution error (e.g. binary missing / permission error)
    def mock_subproc_err(cmd, input_bytes, timeout):
        return {
            "returncode": -1,
            "stdout": b"",
            "stderr": b"",
            "error": "FileNotFoundError: cua-driver.exe not found",
            "timeout": False,
        }

    with patch("app.execution.cua_driver_client._run_subprocess_sync", side_effect=mock_subproc_err):
        res_subproc = await client._raw_call("list_windows", auto_start_daemon=False, auto_recover=False)
        assert res_subproc["success"] is False
        assert res_subproc["error_category"] == "SUBPROCESS_EXECUTION_ERROR"

    # 3. CUA Tool Error (process executed, returned non-zero exit code without daemon warning)
    def mock_tool_err(cmd, input_bytes, timeout):
        return {
            "returncode": 2,
            "stdout": b"",
            "stderr": b"Invalid window handle specified",
            "error": None,
            "timeout": False,
        }

    with patch("app.execution.cua_driver_client._run_subprocess_sync", side_effect=mock_tool_err):
        res_tool = await client._raw_call("bring_to_front", {"window_id": 99999}, auto_start_daemon=False, auto_recover=False)
        assert res_tool["success"] is False
        assert res_tool["error_category"] == "CUA_TOOL_ERROR"


@pytest.mark.asyncio
async def test_no_infinite_daemon_spawn_loop():
    """Requirement 9: Prevents repeated daemon spawn attempts after a local subprocess-launch failure."""
    client = CuaDriverClient()
    client._daemon_checked = False
    client._daemon_spawn_failed = False

    def mock_fail_spawn(cmd):
        return False

    with patch("app.execution.cua_driver_client._spawn_daemon_sync", side_effect=mock_fail_spawn), \
         patch.object(client, "is_binary_available", return_value=True):
        
        ok = await client.ensure_daemon_running()
        assert ok is False
        assert client._daemon_spawn_failed is True

        # Second call must immediately return False without attempting spawn again
        with patch("app.execution.cua_driver_client._spawn_daemon_sync") as mock_spawn_again:
            ok2 = await client.ensure_daemon_running()
            assert ok2 is False
            mock_spawn_again.assert_not_called()


def test_wake_word_stripping_and_normalization():
    """Requirement 14 & 15: Verifies wake-word prefix removal ("Jaws", "Jarvis", "JARVIS,") while preserving application aliases."""
    test_cases = [
        ("Jaws Open Notepad", "Open Notepad.", "wake_word_strip+application_alias"),
        ("Jarvis Open Notepad", "Open Notepad.", "wake_word_strip+application_alias"),
        ("JARVIS, Open Notepad", "Open Notepad.", "wake_word_strip+application_alias"),
        ("hey jarvis open vs code", "Open Visual Studio Code.", "wake_word_strip+application_alias"),
        ("open not bad", "Open Notepad.", "application_alias"),
        ("open vs code", "Open Visual Studio Code.", "application_alias"),
        ("not bad", "Notepad.", "standalone_alias"),
    ]

    for raw, expected_norm, expected_rule in test_cases:
        norm, rule = normalize_voice_command(raw)
        print(f"\n[WAKE WORD TEST] raw='{raw}' -> norm='{norm}' rule='{rule}'")
        assert norm == expected_norm
        assert rule == expected_rule
