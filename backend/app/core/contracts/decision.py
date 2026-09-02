import uuid
from typing import Optional
from pydantic import BaseModel, Field
from app.core.contracts.enums import DecisionStrategy


class DecisionResult(BaseModel):
    decision_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    strategy: DecisionStrategy
    confidence: float = 1.0
    reason: Optional[str] = None
    selected_model: Optional[str] = None
    fallbacks: list[str] = Field(default_factory=list)
    selected_tool: Optional[str] = None
    requires_confirmation: bool = False
    requires_clarification: bool = False
