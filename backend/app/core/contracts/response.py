import uuid
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.contracts.enums import ResponseType
from app.core.contracts.execution import ExecutionResult
from app.core.contracts.verification import VerificationResult


class JarvisResponse(BaseModel):
    response_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    turn_id: str
    message: str
    response_type: ResponseType = ResponseType.TEXT
    execution_result: Optional[ExecutionResult] = None
    verification_result: Optional[VerificationResult] = None
    should_speak: bool = False
    should_display: bool = True
    metadata: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
