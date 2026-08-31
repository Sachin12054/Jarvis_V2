import os
import hashlib
import uuid
import shutil
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, Optional, Tuple, Any
from pydantic import BaseModel, Field
from app.core.logging import logger
from app.tools.workspace import WorkspacePathResolver


class PendingFileOperation(BaseModel):
    """Data model representing a pending file creation or modification operation awaiting user confirmation."""

    operation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tool_name: str = Field(..., description="Tool name: create_file, write_file, or edit_file")
    path: str = Field(..., description="Workspace-relative target path")
    old_content_hash: Optional[str] = Field(default=None, description="SHA256 hash of original file content before proposal")
    new_content_hash: str = Field(..., description="SHA256 hash of proposed file content")
    new_content: str = Field(..., description="Full proposed file content to write upon approval")
    diff: str = Field(..., description="Unified diff text string")
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    expires_at: str = Field(
        default_factory=lambda: (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
    )
    status: str = Field(default="PENDING", description="Status: PENDING, APPROVED, CANCELLED, EXPIRED, APPLIED, FAILED")


class PendingOperationManager:
    """Server-side manager storing and executing pending file operations after explicit user confirmation."""

    _instance: Optional["PendingOperationManager"] = None

    def __init__(self):
        self._operations: Dict[str, PendingFileOperation] = {}

    @classmethod
    def get_instance(cls) -> "PendingOperationManager":
        """Singleton instance accessor."""
        if cls._instance is None:
            cls._instance = PendingOperationManager()
        return cls._instance

    @staticmethod
    def calculate_hash(content: str) -> str:
        """Calculates SHA256 hash of a string."""
        return hashlib.sha256(content.encode("utf-8")).hexdigest()

    def create_operation(
        self,
        tool_name: str,
        path: str,
        old_content: Optional[str],
        new_content: str,
        diff: str,
    ) -> PendingFileOperation:
        """Creates and stores a new pending file operation."""
        old_hash = self.calculate_hash(old_content) if old_content is not None else None
        new_hash = self.calculate_hash(new_content)

        op = PendingFileOperation(
            tool_name=tool_name,
            path=path,
            old_content_hash=old_hash,
            new_content_hash=new_hash,
            new_content=new_content,
            diff=diff,
        )
        self._operations[op.operation_id] = op
        logger.info(f"[PENDING OPERATION] Created {op.operation_id} for tool '{tool_name}' on path '{path}'")
        return op

    def get_operation(self, operation_id: str) -> Optional[PendingFileOperation]:
        """Retrieves a pending operation by ID, checking expiration."""
        op = self._operations.get(operation_id)
        if not op:
            return None

        # Check expiration
        exp = datetime.fromisoformat(op.expires_at)
        if datetime.now(timezone.utc) > exp and op.status == "PENDING":
            op.status = "EXPIRED"
            logger.info(f"[PENDING OPERATION] Operation {operation_id} has expired.")

        return op

    def cancel_operation(self, operation_id: str) -> Tuple[bool, str]:
        """Cancels a pending operation."""
        op = self.get_operation(operation_id)
        if not op:
            return False, "Operation not found."

        if op.status != "PENDING":
            return False, f"Cannot cancel operation with status '{op.status}'."

        op.status = "CANCELLED"
        logger.info(f"[PENDING OPERATION] Cancelled operation {operation_id}")
        return True, "Operation cancelled successfully."

    def approve_and_apply(
        self,
        operation_id: str,
        resolver: Optional[WorkspacePathResolver] = None,
    ) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """Validates security, stale file state, creates backup, and atomically writes file content."""
        resolver = resolver or WorkspacePathResolver()
        op = self.get_operation(operation_id)

        if not op:
            return False, "Pending operation not found.", None

        if op.status == "EXPIRED":
            return False, "Operation has expired. Please request the change again.", None

        if op.status != "PENDING":
            return False, f"Operation cannot be applied because its status is '{op.status}'.", None

        # 1. Resolve path security
        valid, target_path, err = resolver.resolve_path(op.path)
        if not valid or not target_path:
            op.status = "FAILED"
            return False, f"Security check failed: {err}", None

        # 2. Check protected file policy
        if resolver.is_protected(target_path):
            op.status = "FAILED"
            return False, "Access denied: protected file policy.", None

        # 3. Stale File Detection (Re-verify original content hash)
        if target_path.exists():
            if target_path.is_dir():
                op.status = "FAILED"
                return False, f"Target path '{op.path}' is a directory, not a file.", None

            try:
                current_text = target_path.read_text(encoding="utf-8", errors="replace")
                current_hash = self.calculate_hash(current_text)
                if op.old_content_hash and current_hash != op.old_content_hash:
                    op.status = "FAILED"
                    logger.warning(f"[PENDING OPERATION] Aborted {operation_id}: File '{op.path}' changed externally since proposal.")
                    return False, "File changed externally since the proposed modification. Review required.", None
            except Exception as read_err:
                op.status = "FAILED"
                return False, f"Failed to read current file state: {str(read_err)}", None

        # 4. Create Workspace Backup before modification if file exists
        backup_path_str: Optional[str] = None
        if target_path.exists():
            try:
                backup_dir = resolver.workspace_root / ".jarvis" / "backups"
                backup_dir.mkdir(parents=True, exist_ok=True)
                timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S_%f")
                safe_name = target_path.name.replace(".", "_")
                backup_file = backup_dir / f"{timestamp}_{safe_name}.bak"
                shutil.copy2(target_path, backup_file)
                backup_path_str = resolver.to_relative_string(backup_file)
                logger.info(f"[BACKUP] Saved backup of '{op.path}' to '{backup_path_str}'")
            except Exception as backup_err:
                logger.warning(f"[BACKUP] Failed to create backup for '{op.path}': {backup_err}")

        # 5. Atomic Write Execution
        try:
            target_dir = target_path.parent
            target_dir.mkdir(parents=True, exist_ok=True)

            with tempfile.NamedTemporaryFile("w", dir=target_dir, delete=False, encoding="utf-8") as temp_f:
                temp_f.write(op.new_content)
                temp_f.flush()
                os.fsync(temp_f.fileno())
                temp_path = Path(temp_f.name)

            # Atomically replace target file
            os.replace(temp_path, target_path)

            op.status = "APPLIED"
            logger.info(f"[PENDING OPERATION] Successfully applied operation {operation_id} to '{op.path}'")

            return True, "File modification applied successfully.", {
                "operation_id": op.operation_id,
                "path": resolver.to_relative_string(target_path),
                "backup_path": backup_path_str,
                "tool_name": op.tool_name,
            }

        except Exception as write_err:
            op.status = "FAILED"
            logger.error(f"[PENDING OPERATION] Failed atomic write for {operation_id}: {write_err}")
            return False, f"Atomic file write failed: {str(write_err)}", None
