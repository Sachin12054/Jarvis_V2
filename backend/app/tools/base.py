from abc import ABC, abstractmethod
from typing import Optional, Type, Dict, Any
from pydantic import BaseModel
from app.tools.schemas import (
    PermissionLevel,
    ToolCategory,
    ToolExecutionContext,
    ToolMetadata,
    ToolResult,
)


class BaseTool(ABC):
    """Abstract Base Class for all JARVIS tool implementations."""

    name: str
    description: str
    category: ToolCategory = ToolCategory.SYSTEM
    permission: PermissionLevel = PermissionLevel.SAFE
    args_schema: Optional[Type[BaseModel]] = None

    def get_metadata(self) -> ToolMetadata:
        """Returns tool metadata including JSON Schema parameters."""
        param_schema: Dict[str, Any] = {}
        if self.args_schema:
            param_schema = self.args_schema.model_json_schema()

        return ToolMetadata(
            name=self.name,
            description=self.description,
            category=self.category,
            permission=self.permission,
            parameters=param_schema,
        )

    @abstractmethod
    async def run(
        self,
        context: ToolExecutionContext,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Internal execution logic implemented by specific tool classes."""
        pass
