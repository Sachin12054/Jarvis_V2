from datetime import datetime
from typing import Optional, Dict, Any, List, Literal
from pydantic import BaseModel, Field, ConfigDict, field_validator

VALID_MEMORY_TYPES = {"factual", "preference", "project", "contextual", "procedural", "episodic"}
VALID_MEMORY_SOURCES = {"user_explicit", "inferred", "system"}

MemoryTypeEnum = Literal["factual", "preference", "project", "contextual", "procedural", "episodic"]
MemorySourceEnum = Literal["user_explicit", "inferred", "system"]


class MemoryCreate(BaseModel):
    """Schema for creating a new explicit memory record."""
    content: str = Field(..., min_length=1, description="Memory text content")
    memory_type: MemoryTypeEnum = Field(..., description="Type category of memory")
    user_id: Optional[str] = Field(default="local_user", description="User ID associated with memory")
    importance: float = Field(default=0.5, ge=0.0, le=1.0, description="Importance score between 0.0 and 1.0")
    confidence: float = Field(default=0.8, ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    source: MemorySourceEnum = Field(default="user_explicit", description="Source origin of memory")
    extra_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Metadata key-value pairs")

    @field_validator("content")
    @classmethod
    def validate_content_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Memory content must not be empty or whitespace-only.")
        return v.strip()


class MemoryUpdate(BaseModel):
    """Schema for updating an existing memory record."""
    content: Optional[str] = Field(default=None, min_length=1, description="Updated memory text content")
    memory_type: Optional[MemoryTypeEnum] = Field(default=None, description="Updated type category of memory")
    importance: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Updated importance score")
    confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Updated confidence score")
    source: Optional[MemorySourceEnum] = Field(default=None, description="Updated source origin")
    is_active: Optional[bool] = Field(default=None, description="Active status flag")
    extra_metadata: Optional[Dict[str, Any]] = Field(default=None, description="Updated metadata key-value pairs")

    @field_validator("content")
    @classmethod
    def validate_content_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Memory content must not be empty or whitespace-only.")
        return v.strip() if v else v


class MemoryResponse(BaseModel):
    """Pydantic schema for memory API response payload."""
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique memory UUID")
    user_id: str = Field(..., description="User ID associated with memory")
    memory_type: str = Field(..., description="Category type of memory")
    content: str = Field(..., description="Memory text content")
    normalized_content: str = Field(..., description="Normalized content for deduplication")
    importance: float = Field(..., description="Importance score (0.0 to 1.0)")
    confidence: float = Field(..., description="Confidence score (0.0 to 1.0)")
    source: str = Field(..., description="Source origin of memory")
    access_count: int = Field(..., description="Total access count")
    last_accessed_at: datetime = Field(..., description="Timestamp memory was last accessed")
    is_active: bool = Field(..., description="Active status flag")
    extra_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Metadata dictionary")
    created_at: datetime = Field(..., description="Timestamp memory was created")
    updated_at: datetime = Field(..., description="Timestamp memory was last updated")


class MemoryListResponse(BaseModel):
    """Pydantic schema for paginated list of memories."""
    total: int = Field(..., description="Total count of memories matching filter")
    items: List[MemoryResponse] = Field(..., description="List of memory items")
