import uuid
import time
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
)


class ClarificationContext(BaseModel):
    """Canonical ClarificationContext for JARVIS V2 core interaction layer.

    Tracks state and metadata for pending clarification requests.
    """

    clarification_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    turn_id: Optional[str] = None
    task_id: Optional[str] = None
    step_id: Optional[str] = None
    original_request: Optional[JarvisRequest] = None
    original_understanding: Optional[UnderstandingResult] = None
    original_decision: Optional[DecisionResult] = None
    question: str
    missing_information: str
    candidate_options: List[str] = Field(default_factory=list)
    default_option: Optional[str] = None
    context_data: Dict[str, Any] = Field(default_factory=dict)
    created_at: float = Field(default_factory=time.time)
    status: str = "PENDING"  # PENDING, RESOLVED, EXPIRED, CANCELLED
