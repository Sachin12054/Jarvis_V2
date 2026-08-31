import json
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.core.config import settings
from app.execution.cua_driver_client import CuaDriverClient
from app.execution.computer_gateway import ComputerUseGateway, ActionResult
from app.brain.llm_manager import OllamaLLMProvider


@pytest.mark.asyncio
async def test_ollama_model_configuration():
    """Requirement A: Test Ollama model and 16K context configuration settings."""
    assert settings.OLLAMA_MODEL == "qwen3-test:latest"
    assert settings.OLLAMA_CONTEXT_LENGTH == 16384
    assert settings.LLM_MODEL == "qwen3-test:latest"

    provider = OllamaLLMProvider()
    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"message": {"content": "Test response"}}
        mock_post.return_value = mock_response

        res = await provider.generate_response([{"role": "user", "content": "Hello"}])
        assert res == "Test response"

        # Verify num_ctx=16384 payload was sent
        call_kwargs = mock_post.call_args.kwargs
        payload = call_kwargs["json"]
        assert payload["model"] == "qwen3-test:latest"
        assert payload["options"]["num_ctx"] == 16384


@pytest.mark.asyncio
async def test_cua_driver_json_invocation():
    """Requirement B: Test CUA Driver stdin JSON invocation format."""
    client = CuaDriverClient.get_instance()

    with patch("asyncio.create_subprocess_exec", new_callable=AsyncMock) as mock_exec:
        mock_proc = MagicMock()
        mock_proc.communicate = AsyncMock(return_value=(b'{"status": "ok"}', b""))
        mock_proc.returncode = 0
        mock_exec.return_value = mock_proc

        with patch.object(client, "ensure_daemon_running", new_callable=AsyncMock, return_value=True):
            res = await client._raw_call("list_windows", {"test": "data"})
            assert res["success"] is True
            assert res["data"] == {"status": "ok"}

            # Verify stdin input json payload
            call_kwargs = mock_proc.communicate.call_args.kwargs
            input_bytes = call_kwargs["input"]
            parsed_input = json.loads(input_bytes.decode())
            assert parsed_input == {"test": "data"}


@pytest.mark.asyncio
async def test_cua_driver_list_windows():
    """Requirement C: Test list_windows tool call."""
    client = CuaDriverClient.get_instance()
    mock_windows_response = {"windows": [{"title": "Notepad", "pid": 1234}]}

    with patch.object(client, "_raw_call", new_callable=AsyncMock) as mock_raw:
        mock_raw.return_value = {"success": True, "data": mock_windows_response, "error": None}
        res = await client.list_windows()
        assert res["success"] is True
        assert "windows" in res["data"]


@pytest.mark.asyncio
async def test_cua_driver_launch_app():
    """Requirement D: Test launch_app tool call."""
    client = CuaDriverClient.get_instance()

    with patch.object(client, "_raw_call", new_callable=AsyncMock) as mock_raw:
        mock_raw.return_value = {"success": True, "data": {"pid": 5678, "aumid": "Microsoft.WindowsNotepad_8wekyb3d8bbwe!App"}, "error": None}
        res = await client.launch_app("Notepad")
        assert res["success"] is True
        mock_raw.assert_called_once_with("launch_app", {"name": "Notepad"})


@pytest.mark.asyncio
async def test_cua_driver_get_window_state():
    """Requirement E: Test bounded get_window_state tool call."""
    client = CuaDriverClient.get_instance()
    mock_tree = {"elements": [{"role": "window", "title": "Untitled - Notepad"}]}

    with patch.object(client, "_raw_call", new_callable=AsyncMock) as mock_raw:
        mock_raw.return_value = {"success": True, "data": mock_tree, "error": None}
        res = await client.get_window_state(window_id=101, max_depth=3, max_elements=20)
        assert res["success"] is True
        mock_raw.assert_called_once_with("get_window_state", {"max_depth": 3, "max_elements": 20, "window_id": 101})


@pytest.mark.asyncio
async def test_cua_driver_type_text():
    """Requirement F: Test type_text tool call."""
    client = CuaDriverClient.get_instance()

    with patch.object(client, "_raw_call", new_callable=AsyncMock) as mock_raw:
        mock_raw.return_value = {"success": True, "data": {"typed": True}, "error": None}
        res = await client.type_text("Hello from JARVIS")
        assert res["success"] is True
        mock_raw.assert_called_once_with("type_text", {"text": "Hello from JARVIS"})


@pytest.mark.asyncio
async def test_cua_driver_verify_state():
    """Requirement G: Test verify_state tool call."""
    client = CuaDriverClient.get_instance()

    with patch.object(client, "_raw_call", new_callable=AsyncMock) as mock_raw:
        mock_raw.return_value = {"success": True, "data": {"verified": True}, "error": None}
        res = await client.verify_state("window_contains('Hello from JARVIS')")
        assert res["success"] is True
        mock_raw.assert_called_once_with("verify_state", {"expect": "window_contains('Hello from JARVIS')"})


@pytest.mark.asyncio
async def test_jarvis_reasoning_to_gateway_loop():
    """Requirement H: Test JARVIS reasoning to gateway execution loop."""
    gateway = ComputerUseGateway.get_instance()

    with patch.object(gateway.cua_client, "launch_app", new_callable=AsyncMock) as mock_launch, \
         patch.object(gateway.cua_client, "type_text", new_callable=AsyncMock) as mock_type, \
         patch.object(gateway.cua_client, "verify_state", new_callable=AsyncMock) as mock_verify:

        mock_launch.return_value = {"success": True, "data": {"pid": 9999}}
        mock_type.return_value = {"success": True, "data": {"typed": True}}
        mock_verify.return_value = {"success": True, "data": {"verified": True}}

        # 1. Step 1: Launch Notepad
        res1 = await gateway.launch_app("Notepad")
        assert res1.executed is True
        assert res1.requested_action == "launch_app:Notepad"

        # 2. Step 2: Type text
        res2 = await gateway.type_text("Hello from JARVIS")
        assert res2.executed is True

        # 3. Step 3: Verify state
        res3 = await gateway.verify_state("text_exists('Hello from JARVIS')")
        assert res3.executed is True


@pytest.mark.asyncio
async def test_cua_driver_unavailable_error_handling():
    """Requirement I: Test CUA Driver unavailable graceful error handling."""
    client = CuaDriverClient.get_instance()

    with patch.object(client, "is_binary_available", return_value=False):
        res = await client.launch_app("Notepad")
        assert res["success"] is False
        assert "unavailable" in res["error"].lower()
