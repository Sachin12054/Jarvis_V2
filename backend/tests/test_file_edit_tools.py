import pytest
from pathlib import Path
from httpx import AsyncClient
from app.tools.builtin.file_edit_tools import CreateFileTool, WriteFileTool, EditFileTool
from app.tools.pending_operations import PendingOperationManager
from app.tools.schemas import PermissionLevel, ToolExecutionContext
from app.tools.workspace import WorkspacePathResolver


@pytest.fixture
def mock_edit_workspace(tmp_path: Path) -> WorkspacePathResolver:
    """Creates isolated test workspace with sample files for file modification testing."""
    (tmp_path / "backend" / "app").mkdir(parents=True, exist_ok=True)
    (tmp_path / "README.md").write_text("# Project Title\nOriginal content.\n", encoding="utf-8")
    (tmp_path / "backend" / "app" / "main.py").write_text("def greeting():\n    return 'Hello'\n", encoding="utf-8")
    (tmp_path / "ambiguous.py").write_text("print('test')\nprint('test')\n", encoding="utf-8")
    (tmp_path / ".env").write_text("SECRET=123\n", encoding="utf-8")
    (tmp_path / "image.png").write_bytes(b"\x89PNG\r\n\x1a\n")

    return WorkspacePathResolver(workspace_root=str(tmp_path))


@pytest.mark.asyncio
async def test_tool_permissions_are_confirm():
    """Confirms all file edit tools report PermissionLevel.CONFIRM."""
    t1 = CreateFileTool()
    t2 = WriteFileTool()
    t3 = EditFileTool()

    assert t1.permission == PermissionLevel.CONFIRM
    assert t2.permission == PermissionLevel.CONFIRM
    assert t3.permission == PermissionLevel.CONFIRM


@pytest.mark.asyncio
async def test_create_file_proposal(mock_edit_workspace: WorkspacePathResolver):
    """Tests create_file proposing a change while leaving the target file UNCHANGED before approval."""
    tool = CreateFileTool(resolver=mock_edit_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="new_file.py", content="print('hello world')")
    assert res["status"] == "PROPOSED"
    assert res["confirmation_required"] is True
    assert "operation_id" in res

    # CRITICAL CONFIRMATION BOUNDARY CHECK: Target file MUST NOT exist yet
    target_file = mock_edit_workspace.workspace_root / "new_file.py"
    assert target_file.exists() is False


@pytest.mark.asyncio
async def test_create_file_approval(mock_edit_workspace: WorkspacePathResolver):
    """Tests approving a create_file pending operation creating the file."""
    tool = CreateFileTool(resolver=mock_edit_workspace)
    manager = PendingOperationManager.get_instance()
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="created.txt", content="created content")
    op_id = res["operation_id"]

    success, msg, data = manager.approve_and_apply(op_id, resolver=mock_edit_workspace)
    assert success is True
    assert "applied successfully" in msg.lower()

    target_file = mock_edit_workspace.workspace_root / "created.txt"
    assert target_file.exists() is True
    assert target_file.read_text(encoding="utf-8") == "created content"


@pytest.mark.asyncio
async def test_create_file_cancellation(mock_edit_workspace: WorkspacePathResolver):
    """Tests cancelling a create_file pending operation."""
    tool = CreateFileTool(resolver=mock_edit_workspace)
    manager = PendingOperationManager.get_instance()
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="cancelled.txt", content="some data")
    op_id = res["operation_id"]

    success, msg = manager.cancel_operation(op_id)
    assert success is True

    op = manager.get_operation(op_id)
    assert op.status == "CANCELLED"

    target_file = mock_edit_workspace.workspace_root / "cancelled.txt"
    assert target_file.exists() is False


@pytest.mark.asyncio
async def test_create_file_conflict(mock_edit_workspace: WorkspacePathResolver):
    """Tests create_file returning a conflict error if file already exists."""
    tool = CreateFileTool(resolver=mock_edit_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="README.md", content="conflict content")
    assert res["confirmation_required"] is False
    assert "already exists" in res["error"].lower()


@pytest.mark.asyncio
async def test_edit_file_proposal_and_approval(mock_edit_workspace: WorkspacePathResolver):
    """Tests edit_file proposing diff, leaving file UNCHANGED, then applying after approval."""
    tool = EditFileTool(resolver=mock_edit_workspace)
    manager = PendingOperationManager.get_instance()
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="backend/app/main.py", old_text="return 'Hello'", new_text="return 'Hello Sachin'")
    assert res["status"] == "PROPOSED"
    assert res["confirmation_required"] is True
    op_id = res["operation_id"]

    # File UNCHANGED before approval
    main_file = mock_edit_workspace.workspace_root / "backend" / "app" / "main.py"
    assert "return 'Hello'" in main_file.read_text(encoding="utf-8")

    # Approve operation
    success, msg, data = manager.approve_and_apply(op_id, resolver=mock_edit_workspace)
    assert success is True
    assert "return 'Hello Sachin'" in main_file.read_text(encoding="utf-8")

    # Verify backup creation
    backup_dir = mock_edit_workspace.workspace_root / ".jarvis" / "backups"
    assert backup_dir.exists() is True
    backups = list(backup_dir.glob("*.bak"))
    assert len(backups) >= 1


@pytest.mark.asyncio
async def test_stale_file_detection(mock_edit_workspace: WorkspacePathResolver):
    """Tests that modifying file externally after proposal causes approval to ABORT with stale error."""
    tool = EditFileTool(resolver=mock_edit_workspace)
    manager = PendingOperationManager.get_instance()
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="README.md", old_text="Original content.", new_text="New proposed content.")
    op_id = res["operation_id"]

    # External modification
    readme_file = mock_edit_workspace.workspace_root / "README.md"
    readme_file.write_text("# Project Title\nExternal edit happened!\n", encoding="utf-8")

    # Attempt approval
    success, msg, data = manager.approve_and_apply(op_id, resolver=mock_edit_workspace)
    assert success is False
    assert "File changed externally" in msg


@pytest.mark.asyncio
async def test_security_reject_protected_files_modification(mock_edit_workspace: WorkspacePathResolver):
    """Tests blocking file modification tools on protected files (.env)."""
    t1 = CreateFileTool(resolver=mock_edit_workspace)
    t2 = WriteFileTool(resolver=mock_edit_workspace)
    t3 = EditFileTool(resolver=mock_edit_workspace)
    ctx = ToolExecutionContext()

    res1 = await t1.run(ctx, path=".env.secret", content="data")
    assert res1["confirmation_required"] is False
    assert "protected file policy" in res1["error"]

    res2 = await t2.run(ctx, path=".env", content="data")
    assert res2["confirmation_required"] is False
    assert "protected file policy" in res2["error"]

    res3 = await t3.run(ctx, path=".env", old_text="SECRET", new_text="PUBLIC")
    assert res3["confirmation_required"] is False
    assert "protected file policy" in res3["error"]


@pytest.mark.asyncio
async def test_security_reject_traversal_modification(mock_edit_workspace: WorkspacePathResolver):
    """Tests blocking traversal attacks in file modification tools."""
    tool = WriteFileTool(resolver=mock_edit_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="../../Windows/System32/hacked.txt", content="malicious")
    assert res["confirmation_required"] is False
    assert "resolves outside configured workspace root" in res["error"]


@pytest.mark.asyncio
async def test_edit_file_ambiguous_text_rejection(mock_edit_workspace: WorkspacePathResolver):
    """Tests edit_file rejecting edits where old_text occurs multiple times."""
    tool = EditFileTool(resolver=mock_edit_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, path="ambiguous.py", old_text="print('test')", new_text="print('replaced')")
    assert res["confirmation_required"] is False
    assert "Ambiguous edit" in res["error"]


@pytest.mark.asyncio
async def test_api_file_operations_endpoints(async_client: AsyncClient):
    """Tests GET, POST /approve, and POST /cancel file operation REST API endpoints."""
    manager = PendingOperationManager.get_instance()
    op = manager.create_operation(
        tool_name="create_file",
        path="api_test.txt",
        old_content=None,
        new_content="api content",
        diff="--- a/api_test.txt\n+++ b/api_test.txt\n@@ -0,0 +1 @@\n+api content\n",
    )

    # 1. GET detail
    res1 = await async_client.get(f"/api/v1/file-operations/{op.operation_id}")
    assert res1.status_code == 200
    assert res1.json()["operation_id"] == op.operation_id

    # 2. POST approve
    res2 = await async_client.post(f"/api/v1/file-operations/{op.operation_id}/approve")
    assert res2.status_code == 200
    assert res2.json()["success"] is True

    # 3. POST cancel (already applied)
    res3 = await async_client.post(f"/api/v1/file-operations/{op.operation_id}/cancel")
    assert res3.status_code == 400


@pytest.mark.asyncio
async def test_dynamic_selection_for_file_modification_tools(mock_edit_workspace: WorkspacePathResolver):
    """Tests DynamicToolSelector recognizing file creation and modification intents."""
    tool_edit = EditFileTool(resolver=mock_edit_workspace)
    tool_create = CreateFileTool(resolver=mock_edit_workspace)

    # Test edit proposal on mock workspace file
    res1 = await tool_edit.run(ToolExecutionContext(), path="backend/app/main.py", old_text="return 'Hello'", new_text="return 'Hello Sachin'")
    assert res1["status"] == "PROPOSED"
    assert res1["confirmation_required"] is True

    # Test create proposal on mock workspace
    res2 = await tool_create.run(ToolExecutionContext(), path="backend/app/new_demo.py", content="print('demo')")
    assert res2["status"] == "PROPOSED"
    assert res2["confirmation_required"] is True
