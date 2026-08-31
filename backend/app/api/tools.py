from typing import List
from fastapi import APIRouter, Depends
from app.tools.registry import ToolRegistry
from app.tools.schemas import ToolMetadata

router = APIRouter(prefix="/api/v1", tags=["Tools"])


def get_tool_registry() -> ToolRegistry:
    return ToolRegistry.get_instance()


@router.get(
    "/tools",
    response_model=List[ToolMetadata],
    summary="List registered tools and parameter specifications",
    responses={
        200: {"description": "List of available registered tool metadata"},
    },
)
async def list_registered_tools_endpoint(
    registry: ToolRegistry = Depends(get_tool_registry),
):
    """Retrieves metadata and parameter specifications for all registered safe tools."""
    return registry.get_tool_schemas()
