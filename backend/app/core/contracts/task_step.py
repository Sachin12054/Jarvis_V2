import uuid
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from app.core.contracts.enums import TaskStepState
from app.core.contracts.execution import ExecutionResult
from app.core.contracts.verification import VerificationResult


class TaskStep(BaseModel):
    """Canonical TaskStep Contract for JARVIS V2."""

    step_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_id: str
    order: int = 1
    description: str
    capability: str
    arguments: Dict[str, Any] = Field(default_factory=dict)
    state: TaskStepState = TaskStepState.PENDING
    depends_on: List[str] = Field(default_factory=list)
    result: Optional[ExecutionResult] = None
    verification: Optional[VerificationResult] = None
    error: Optional[str] = None
    verification_required: bool = True
    assigned_model: Optional[str] = None
    shadow_model: Optional[str] = None
    shadow_confidence: Optional[float] = None
    start_time: Optional[float] = None
    completion_time: Optional[float] = None
    duration_ms: Optional[float] = None
    output_text: Optional[str] = None
