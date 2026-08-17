from typing import Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Schema for chat API request payload."""
    message: str = Field(..., min_length=1, description="User input message text")
    conversation_id: Optional[str] = Field(
        default=None,
        description="Optional existing conversation UUID to continue a session",
    )


class ChatResponse(BaseModel):
    """Schema for chat API response payload."""
    conversation_id: str = Field(..., description="Unique conversation session UUID")
    message: str = Field(..., description="JARVIS assistant response text")
    model: str = Field(..., description="Model used to generate the response")
