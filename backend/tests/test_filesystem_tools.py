import os
import pytest
from pathlib import Path
from httpx import AsyncClient
from app.tools.builtin.filesystem_tools import (
    ListDirectoryTool,
    ReadFileTool,
    SearchFilesTool,
    FileInfoTool,
)
from app.tools.executor import ToolExecutor
from app.tools.registry import ToolRegistry
from app.tools.selector import DynamicToolSelector
from app.tools.schemas import PermissionLevel, ToolExecutionContext
from app.tools.workspace import WorkspacePathResolver


@pytest.fixture
def mock_workspace(tmp_path: Path) -> WorkspacePathResolver:
    """Creates a temporary isolated mock workspace root with sample files and folders for testing."""
    # Create directory structure
    (tmp_path / "backend" / "app").mkdir(parents=True, exist_ok=True)
    (tmp_path / "frontend" / "src").mkdir(parents=True, exist_ok=True)

    # Create text files
    (tmp_path / "README.md").write_text("# Mock Workspace Title\nWelcome to test workspace.", encoding="utf-8")
    (tmp_path / "backend" / "app" / "main.py").write_text("from fastapi import FastAPI\napp = FastAPI()\n", encoding="utf-8")
    (tmp_path / "backend" / "app" / "service.py").write_text("class MemoryService:\n    pass\n", encoding="utf-8")

    # Create protected files
    (tmp_path / ".env").write_text("SECRET_KEY=supersecret123\n", encoding="utf-8")
    (tmp_path / "backend" / "id_rsa").write_text("-----BEGIN PRIVATE KEY-----\nsecret\n", encoding="utf-8")

    # Create binary file
    (tmp_path / "image.png").write_bytes(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR")

    return WorkspacePathResolver(workspace_root=str(tmp_path))


@pytest.mark.asyncio
async def test_list_directory_workspace_root(mock_workspace: WorkspacePathResolver):
    """Tests listing files at workspace root."""
    tool = ListDirectoryTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path=".")
    assert "entries" in res
    names = [e["name"] for e in res["entries"]]
    assert "README.md" in names
    assert "backend" in names
    assert ".env" not in names  # Protected file filtered


@pytest.mark.asyncio
async def test_list_directory_subfolder(mock_workspace: WorkspacePathResolver):
    """Tests listing sub-directory entries."""
    tool = ListDirectoryTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="backend/app")
    assert res["path"] == "backend/app"
    names = [e["name"] for e in res["entries"]]
    assert "main.py" in names
    assert "service.py" in names


@pytest.mark.asyncio
async def test_read_file_allowed(mock_workspace: WorkspacePathResolver):
    """Tests reading an allowed text file within workspace."""
    tool = ReadFileTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="README.md")
    assert res["content"] is not None
    assert "Mock Workspace Title" in res["content"]
    assert res["truncated"] is False


@pytest.mark.asyncio
async def test_search_files_allowed(mock_workspace: WorkspacePathResolver):
    """Tests searching text content in workspace files."""
    tool = SearchFilesTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="MemoryService", path=".")
    assert res["total_matches"] >= 1
    m = res["matches"][0]
    assert "service.py" in m["relative_path"]
    assert "MemoryService" in m["line_content"]


@pytest.mark.asyncio
async def test_file_info_allowed(mock_workspace: WorkspacePathResolver):
    """Tests retrieving metadata for an allowed file."""
    tool = FileInfoTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="backend/app/main.py")
    assert res["exists"] is True
    assert res["type"] == "file"
    assert res["extension"] == ".py"
    assert res["is_protected"] is False


@pytest.mark.asyncio
async def test_security_reject_traversal(mock_workspace: WorkspacePathResolver):
    """Tests blocking ../ path traversal attacks."""
    tool = ReadFileTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="../../Windows/System32/drivers/etc/hosts")
    assert res["content"] is None
    assert "resolves outside configured workspace root" in res["error"]


@pytest.mark.asyncio
async def test_security_reject_absolute_path_outside(mock_workspace: WorkspacePathResolver):
    """Tests blocking absolute path queries outside workspace."""
    tool = ReadFileTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="C:\\Windows\\System32\\config\\SAM")
    assert res["content"] is None
    assert "resolves outside configured workspace root" in res["error"]


@pytest.mark.asyncio
async def test_security_reject_protected_env_and_keys(mock_workspace: WorkspacePathResolver):
    """Tests blocking access to protected .env and private key files."""
    tool = ReadFileTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res1 = await tool.run(ctx, path=".env")
    assert res1["content"] is None
    assert "protected file policy" in res1["error"]

    res2 = await tool.run(ctx, path="backend/id_rsa")
    assert res2["content"] is None
    assert "protected file policy" in res2["error"]


@pytest.mark.asyncio
async def test_binary_file_refusal(mock_workspace: WorkspacePathResolver):
    """Tests refusing to dump binary file contents into text output."""
    tool = ReadFileTool(resolver=mock_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="image.png")
    assert res["content"] is None
    assert "Binary or unsupported file type" in res["error"]


@pytest.mark.asyncio
async def test_read_file_truncation(tmp_path: Path):
    """Tests truncating files larger than max_bytes boundary."""
    large_file = tmp_path / "large.txt"
    large_file.write_text("A" * 2000, encoding="utf-8")
    resolver = WorkspacePathResolver(workspace_root=str(tmp_path))

    tool = ReadFileTool(resolver=resolver)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="large.txt", max_bytes=500)
    assert len(res["content"]) == 500
    assert res["truncated"] is True


@pytest.mark.asyncio
async def test_tool_permissions_are_safe():
    """Confirms all four filesystem tools have PermissionLevel.SAFE."""
    t1 = ListDirectoryTool()
    t2 = ReadFileTool()
    t3 = SearchFilesTool()
    t4 = FileInfoTool()

    assert t1.permission == PermissionLevel.SAFE
    assert t2.permission == PermissionLevel.SAFE
    assert t3.permission == PermissionLevel.SAFE
    assert t4.permission == PermissionLevel.SAFE


@pytest.mark.asyncio
async def test_api_discovery_exposes_filesystem_tools(async_client: AsyncClient):
    """Tests GET /api/v1/tools endpoint exposing new filesystem tools."""
    res = await async_client.get("/api/v1/tools")
    assert res.status_code == 200
    names = [t["name"] for t in res.json()]

    assert "list_directory" in names
    assert "read_file" in names
    assert "search_files" in names
    assert "file_info" in names


@pytest.mark.asyncio
async def test_dynamic_selection_for_list_directory():
    """Tests natural language selecting list_directory tool."""
    selector = DynamicToolSelector()
    res = await selector.select_and_execute_tool("Show me the files in backend/app")

    assert res is not None
    assert res.tool == "list_directory"


@pytest.mark.asyncio
async def test_dynamic_selection_for_read_file():
    """Tests natural language selecting read_file tool."""
    selector = DynamicToolSelector()
    res = await selector.select_and_execute_tool("Read backend/app/main.py")

    assert res is not None
    assert res.tool == "read_file"


@pytest.mark.asyncio
async def test_dynamic_selection_for_search_files():
    """Tests natural language selecting search_files tool."""
    selector = DynamicToolSelector()
    res = await selector.select_and_execute_tool("Find MemoryService in my project")

    assert res is not None
    assert res.tool == "search_files"


@pytest.mark.asyncio
async def test_dynamic_selection_for_file_info():
    """Tests natural language selecting file_info tool."""
    selector = DynamicToolSelector()
    res = await selector.select_and_execute_tool("What is the size of backend/app/main.py?")

    assert res is not None
    assert res.tool == "file_info"
