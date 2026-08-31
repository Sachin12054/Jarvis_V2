from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class MessageResponse(BaseModel):
    """Pydantic schema for individual message response payload."""
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique message UUID")
    conversation_id: str = Field(..., description="Parent conversation UUID")
    role: str = Field(..., description="Role of message sender (user or assistant)")
    content: str = Field(..., description="Message text content")
    extra_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Metadata dictionary")
    created_at: datetime = Field(..., description="Timestamp message was created")
    updated_at: datetime = Field(..., description="Timestamp message was last updated")


class ConversationSummary(BaseModel):
    """Pydantic schema for conversation summary in listing endpoint."""
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique conversation UUID")
    status: str = Field(..., description="Status of conversation session")
    created_at: datetime = Field(..., description="Timestamp session was created")
    updated_at: datetime = Field(..., description="Timestamp session was last updated")


class ConversationDetail(BaseModel):
    """Pydantic schema for detailed conversation view with messages."""
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique conversation UUID")
    status: str = Field(..., description="Status of conversation session")
    created_at: datetime = Field(..., description="Timestamp session was created")
    updated_at: datetime = Field(..., description="Timestamp session was last updated")
    messages: List[MessageResponse] = Field(default_factory=list, description="Chronological list of messages")


class ConversationDeleteResponse(BaseModel):
    """Pydantic schema for conversation deletion confirmation."""
    message: str = Field(..., description="Confirmation message")
    id: str = Field(..., description="ID of deleted conversation")
