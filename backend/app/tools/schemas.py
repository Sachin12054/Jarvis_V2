from datetime import datetime, timezone
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class PermissionLevel(str, Enum):
    """Permission level for tool execution safety."""
    SAFE = "safe"             # Read-only, non-destructive tools
    CONFIRM = "confirm"       # Interactive / User confirmation required before execution
    RESTRICTED = "restricted" # High risk / Destructive tools (Forbidden)


class ToolCategory(str, Enum):
    """Categorized domain for registered tools."""
    SYSTEM = "system"
    MEMORY = "memory"
    FILE = "file"
    WEB = "web"
    AUTOMATION = "automation"


class ToolExecutionContext(BaseModel):
    """Context information passed to tool execution."""
    user_id: str = Field(default="local_user", description="Active user ID")
    conversation_id: Optional[str] = Field(default=None, description="Active conversation session ID")
    request_id: Optional[str] = Field(default=None, description="Unique turn request ID")
    permission_level: PermissionLevel = Field(default=PermissionLevel.SAFE, description="Caller granted permission level")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Execution timestamp")


class ToolMetadata(BaseModel):
    """Exposed metadata and JSON parameter schema for tool discovery."""
    name: str = Field(..., description="Unique name identifier of the tool")
    description: str = Field(..., description="Human-readable tool description")
    category: ToolCategory = Field(default=ToolCategory.SYSTEM, description="Tool category")
    permission: PermissionLevel = Field(default=PermissionLevel.SAFE, description="Permission safety level")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="JSON Schema parameter specifications")


class ToolResult(BaseModel):
    """Structured result returned by tool execution."""
    success: bool = Field(..., description="Whether execution completed without error")
    tool: str = Field(..., description="Tool name executed")
    data: Optional[Dict[str, Any]] = Field(default=None, description="Structured result data")
    error: Optional[str] = Field(default=None, description="Error message if execution failed")
