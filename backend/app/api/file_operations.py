from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from app.tools.pending_operations import PendingOperationManager, PendingFileOperation

router = APIRouter(prefix="/api/v1/file-operations", tags=["file-operations"])


class FileOperationActionResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None


@router.get("/{operation_id}", response_model=PendingFileOperation)
async def get_pending_operation(operation_id: str):
    """Retrieves details of a pending file operation by ID."""
    manager = PendingOperationManager.get_instance()
    op = manager.get_operation(operation_id)
    if not op:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pending operation '{operation_id}' not found.",
        )
    return op


@router.post("/{operation_id}/approve", response_model=FileOperationActionResponse)
async def approve_file_operation(operation_id: str):
    """Approves and applies a pending file modification operation after security and stale-file checks."""
    manager = PendingOperationManager.get_instance()
    success, message, result_data = manager.approve_and_apply(operation_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )

    return FileOperationActionResponse(
        success=True,
        message=message,
        data=result_data,
    )


@router.post("/{operation_id}/cancel", response_model=FileOperationActionResponse)
async def cancel_file_operation(operation_id: str):
    """Cancels a pending file modification operation."""
    manager = PendingOperationManager.get_instance()
    success, message = manager.cancel_operation(operation_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )

    return FileOperationActionResponse(
        success=True,
        message=message,
        data=None,
    )
