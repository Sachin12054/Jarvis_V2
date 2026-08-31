from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.logging import logger
from app.tools.base import BaseTool
from app.tools.diff import generate_unified_diff
from app.tools.pending_operations import PendingOperationManager
from app.tools.schemas import PermissionLevel, ToolCategory, ToolExecutionContext
from app.tools.workspace import WorkspacePathResolver

MAX_WRITE_BYTES = 1_048_576  # 1 MB limit for proposed file content


# Pydantic Input Parameter Schemas
class CreateFileArgs(BaseModel):
    path: str = Field(..., description="Workspace-relative file path to create")
    content: str = Field(..., description="Full text content for the new file")


class WriteFileArgs(BaseModel):
    path: str = Field(..., description="Workspace-relative file path to write/overwrite")
    content: str = Field(..., description="Full text content to write to the file")


class EditFileArgs(BaseModel):
    path: str = Field(..., description="Workspace-relative file path to modify")
    old_text: str = Field(..., min_length=1, description="Exact existing text block to replace")
    new_text: str = Field(..., description="New replacement text block")


# Tool Implementations
class CreateFileTool(BaseTool):
    """Tool that proposes creating a new workspace file with user confirmation."""

    name = "create_file"
    description = "Proposes creating a new text file inside the workspace. Requires explicit user confirmation."
    category = ToolCategory.FILE
    permission = PermissionLevel.CONFIRM
    args_schema = CreateFileArgs

    def __init__(
        self,
        resolver: Optional[WorkspacePathResolver] = None,
        op_manager: Optional[PendingOperationManager] = None,
    ):
        self.resolver = resolver or WorkspacePathResolver()
        self.op_manager = op_manager or PendingOperationManager.get_instance()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        user_path = kwargs.get("path", "")
        content = kwargs.get("content", "")

        if len(content.encode("utf-8")) > MAX_WRITE_BYTES:
            return {"error": f"Content exceeds max write limit of {MAX_WRITE_BYTES} bytes.", "confirmation_required": False}

        valid, target_path, err = self.resolver.resolve_path(user_path)
        if not valid or not target_path:
            return {"error": err, "confirmation_required": False}

        rel_path = self.resolver.to_relative_string(target_path)

        if target_path.exists():
            return {
                "error": f"File conflict: '{rel_path}' already exists. Use write_file or edit_file to modify existing files.",
                "confirmation_required": False,
            }

        diff, truncated = generate_unified_diff("", content, rel_path)
        op = self.op_manager.create_operation(
            tool_name=self.name,
            path=rel_path,
            old_content=None,
            new_content=content,
            diff=diff,
        )

        logger.info(f"[PROPOSAL] create_file operation {op.operation_id} created for '{rel_path}'")

        return {
            "status": "PROPOSED",
            "confirmation_required": True,
            "operation_id": op.operation_id,
            "tool_name": self.name,
            "path": rel_path,
            "diff": diff,
            "diff_truncated": truncated,
            "message": f"Proposed creating new file '{rel_path}'. Awaiting user confirmation.",
        }


class WriteFileTool(BaseTool):
    """Tool that proposes writing/overwriting a workspace file with user confirmation."""

    name = "write_file"
    description = "Proposes writing or overwriting a file inside the workspace. Requires explicit user confirmation."
    category = ToolCategory.FILE
    permission = PermissionLevel.CONFIRM
    args_schema = WriteFileArgs

    def __init__(
        self,
        resolver: Optional[WorkspacePathResolver] = None,
        op_manager: Optional[PendingOperationManager] = None,
    ):
        self.resolver = resolver or WorkspacePathResolver()
        self.op_manager = op_manager or PendingOperationManager.get_instance()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        user_path = kwargs.get("path", "")
        content = kwargs.get("content", "")

        if len(content.encode("utf-8")) > MAX_WRITE_BYTES:
            return {"error": f"Content exceeds max write limit of {MAX_WRITE_BYTES} bytes.", "confirmation_required": False}

        valid, target_path, err = self.resolver.resolve_path(user_path)
        if not valid or not target_path:
            return {"error": err, "confirmation_required": False}

        rel_path = self.resolver.to_relative_string(target_path)

        if self.resolver.is_binary_file(target_path):
            return {"error": "Modification rejected: binary or unsupported file type.", "confirmation_required": False}

        old_content: Optional[str] = None
        if target_path.exists():
            if target_path.is_dir():
                return {"error": f"Path '{rel_path}' is a directory, not a file.", "confirmation_required": False}
            try:
                old_content = target_path.read_text(encoding="utf-8", errors="replace")
            except Exception as read_err:
                return {"error": f"Failed to read existing file: {str(read_err)}", "confirmation_required": False}

        diff, truncated = generate_unified_diff(old_content or "", content, rel_path)
        op = self.op_manager.create_operation(
            tool_name=self.name,
            path=rel_path,
            old_content=old_content,
            new_content=content,
            diff=diff,
        )

        logger.info(f"[PROPOSAL] write_file operation {op.operation_id} created for '{rel_path}'")

        return {
            "status": "PROPOSED",
            "confirmation_required": True,
            "operation_id": op.operation_id,
            "tool_name": self.name,
            "path": rel_path,
            "diff": diff,
            "diff_truncated": truncated,
            "message": f"Proposed modifying file '{rel_path}'. Awaiting user confirmation.",
        }


class EditFileTool(BaseTool):
    """Tool that proposes replacing a single exact text block in a workspace file with user confirmation."""

    name = "edit_file"
    description = "Proposes replacing a specific text block inside a workspace file. Requires explicit user confirmation."
    category = ToolCategory.FILE
    permission = PermissionLevel.CONFIRM
    args_schema = EditFileArgs

    def __init__(
        self,
        resolver: Optional[WorkspacePathResolver] = None,
        op_manager: Optional[PendingOperationManager] = None,
    ):
        self.resolver = resolver or WorkspacePathResolver()
        self.op_manager = op_manager or PendingOperationManager.get_instance()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        user_path = kwargs.get("path", "")
        old_text = kwargs.get("old_text", "")
        new_text = kwargs.get("new_text", "")

        if not old_text:
            return {"error": "old_text parameter cannot be empty.", "confirmation_required": False}

        valid, target_path, err = self.resolver.resolve_path(user_path)
        if not valid or not target_path:
            return {"error": err, "confirmation_required": False}

        rel_path = self.resolver.to_relative_string(target_path)

        if not target_path.exists():
            return {"error": f"File '{rel_path}' does not exist.", "confirmation_required": False}

        if target_path.is_dir():
            return {"error": f"Path '{rel_path}' is a directory, not a file.", "confirmation_required": False}

        if self.resolver.is_binary_file(target_path):
            return {"error": "Modification rejected: binary or unsupported file type.", "confirmation_required": False}

        try:
            old_content = target_path.read_text(encoding="utf-8", errors="replace")
        except Exception as read_err:
            return {"error": f"Failed to read file: {str(read_err)}", "confirmation_required": False}

        count = old_content.count(old_text)
        if count == 0:
            return {
                "error": f"Target text 'old_text' was not found in file '{rel_path}'. Please check exact spacing/indentation.",
                "confirmation_required": False,
            }

        if count > 1:
            return {
                "error": f"Ambiguous edit: 'old_text' occurs {count} times in file '{rel_path}'. Please provide a larger unique surrounding code block.",
                "confirmation_required": False,
            }

        new_content = old_content.replace(old_text, new_text, 1)

        if len(new_content.encode("utf-8")) > MAX_WRITE_BYTES:
            return {"error": f"Resulting file content exceeds max limit of {MAX_WRITE_BYTES} bytes.", "confirmation_required": False}

        diff, truncated = generate_unified_diff(old_content, new_content, rel_path)
        op = self.op_manager.create_operation(
            tool_name=self.name,
            path=rel_path,
            old_content=old_content,
            new_content=new_content,
            diff=diff,
        )

        logger.info(f"[PROPOSAL] edit_file operation {op.operation_id} created for '{rel_path}'")

        return {
            "status": "PROPOSED",
            "confirmation_required": True,
            "operation_id": op.operation_id,
            "tool_name": self.name,
            "path": rel_path,
            "diff": diff,
            "diff_truncated": truncated,
            "message": f"Proposed code edit in file '{rel_path}'. Awaiting user confirmation.",
        }
