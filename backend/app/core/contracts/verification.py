from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class VerificationResult(BaseModel):
    verified: bool = False
    status: str = "UNKNOWN"
    evidence: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = 1.0
    verification_method: Optional[str] = None
    error_code: Optional[str] = None
    details: Optional[str] = None
