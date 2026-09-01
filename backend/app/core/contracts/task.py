import time
import uuid
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from app.core.contracts.enums import TaskState
from app.core.contracts.task_step import TaskStep


class Task(BaseModel):
    """Canonical Task Contract for JARVIS V2."""

    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    turn_id: str
    objective: str
    state: TaskState = TaskState.PENDING
    steps: List[TaskStep] = Field(default_factory=list)
    current_step_id: Optional[str] = None
    created_at: float = Field(default_factory=time.time)
    updated_at: float = Field(default_factory=time.time)
    metadata: Dict[str, Any] = Field(default_factory=dict)
