import uuid
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.contracts.enums import ExecutionStatus


class ExecutionResult(BaseModel):
    action_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    action_type: str
    target: Optional[str] = None
    status: ExecutionStatus = ExecutionStatus.REQUESTED
    success: bool = False
    evidence: Dict[str, Any] = Field(default_factory=dict)
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    duration_ms: float = 0.0
