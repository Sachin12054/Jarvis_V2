from typing import Dict, Any, Optional
from pydantic import ValidationError
from app.core.logging import logger
from app.tools.registry import ToolRegistry
from app.tools.schemas import (
    PermissionLevel,
    ToolExecutionContext,
    ToolResult,
)


class ToolExecutor:
    """Safely executes registered tools with parameter validation, permission enforcement, and error isolation."""

    def __init__(self, registry: Optional[ToolRegistry] = None):
        self.registry = registry or ToolRegistry.get_instance()

    async def execute(
        self,
        tool_name: str,
        kwargs: Optional[Dict[str, Any]] = None,
        context: Optional[ToolExecutionContext] = None,
    ) -> ToolResult:
        """Executes a tool by name safely."""
        clean_name = tool_name.strip().lower()
        kwargs = kwargs or {}
        exec_context = context or ToolExecutionContext()

        logger.info(f"[TOOL] {clean_name} started")

        # 1. Tool discovery check
        tool = self.registry.get_tool(clean_name)
        if not tool:
            logger.warning(f"[TOOL] {clean_name} failed: Tool not found in registry")
            return ToolResult(
                success=False,
                tool=clean_name,
                data=None,
                error=f"Tool '{clean_name}' is not registered.",
            )

        # 2. Permission Level Enforcement
        if tool.permission == PermissionLevel.RESTRICTED:
            logger.warning(f"[TOOL] {clean_name} failed: RESTRICTED tool execution forbidden")
            return ToolResult(
                success=False,
                tool=clean_name,
                data=None,
                error=f"Execution forbidden: Tool '{clean_name}' has RESTRICTED permission level.",
            )

        # 3. Argument Validation against Pydantic schema
        validated_args = kwargs
        if tool.args_schema:
            try:
                validated_model = tool.args_schema(**kwargs)
                validated_args = validated_model.model_dump()
            except ValidationError as val_err:
                logger.warning(f"[TOOL] {clean_name} failed: Parameter validation error")
                return ToolResult(
                    success=False,
                    tool=clean_name,
                    data=None,
                    error=f"Argument validation error for tool '{clean_name}': {val_err}",
                )

        # 4. Safe Tool Execution
        try:
            result_data = await tool.run(exec_context, **validated_args)
            logger.info(f"[TOOL] {clean_name} completed")
            return ToolResult(
                success=True,
                tool=clean_name,
                data=result_data,
                error=None,
            )
        except Exception as err:
            logger.warning(f"[TOOL] {clean_name} failed: {err}")
            return ToolResult(
                success=False,
                tool=clean_name,
                data=None,
                error=f"Tool execution error: {str(err)}",
            )
