from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.contracts.enums import TargetDevice


class UnderstandingResult(BaseModel):
    intent: str
    entities: Dict[str, Any] = Field(default_factory=dict)
    target_device: TargetDevice = TargetDevice.CURRENT
    confidence: float = 1.0
    ambiguity: bool = False
    requires_clarification: bool = False
    clarification_reason: Optional[str] = None
