import inspect
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    DecisionStrategy,
    ExecutionStatus,
    ResponseType,
)
from app.core.tools import ToolHandler, ToolPort


@pytest.mark.asyncio
async def test_tool_handler_success():
    mock_port = MagicMock(spec=ToolPort)
    mock_port.execute_tool = AsyncMock(return_value={"output": "Found 3 files.", "files": ["a.txt", "b.txt"]})
    handler = ToolHandler(tool_port=mock_port)
    req = JarvisRequest(conversation_id="c1", raw_input="Search for text files")
    und = UnderstandingResult(intent="FILESYSTEM_SEARCH", entities={"tool_name": "file_search", "query": "*.txt"})
    dec = DecisionResult(strategy=DecisionStrategy.TOOL_CALL, selected_tool="file_search")
    resp = await handler.handle_tool_call(req, und, dec)
    assert resp.response_type == ResponseType.ACTION
    assert resp.execution_result.success is True
    assert resp.execution_result.status == ExecutionStatus.VERIFIED
    assert resp.verification_result.verified is True
    assert resp.message == "Found 3 files."
    mock_port.execute_tool.assert_called_once_with("file_search", {"tool_name": "file_search", "query": "*.txt"})


@pytest.mark.asyncio
async def test_tool_handler_failure():
    mock_port = MagicMock(spec=ToolPort)
    mock_port.execute_tool = AsyncMock(side_effect=ValueError("File not found"))
    handler = ToolHandler(tool_port=mock_port)
    req = JarvisRequest(conversation_id="c1", raw_input="Read invalid file")
    und = UnderstandingResult(intent="FILESYSTEM_READ", entities={"tool_name": "read_file", "path": "missing.txt"})
    dec = DecisionResult(strategy=DecisionStrategy.TOOL_CALL, selected_tool="read_file")
    resp = await handler.handle_tool_call(req, und, dec)
    assert resp.response_type == ResponseType.ERROR
    assert resp.execution_result.success is False
    assert resp.execution_result.status == ExecutionStatus.FAILED
    assert resp.execution_result.error_code == "TOOL_EXECUTION_FAILED"
    assert "File not found" in resp.message


@pytest.mark.asyncio
async def test_tool_handler_no_direct_os_automation_code():
    from app.core.tools import tool_handler as th_module
    source_code = inspect.getsource(th_module)
    forbidden = ["import pyautogui", "import pywinauto", "import win32", "import subprocess", "import selenium", "import playwright"]
    for item in forbidden:
        assert item not in source_code.lower()
