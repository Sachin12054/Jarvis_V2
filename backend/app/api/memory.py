from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import MemoryNotFoundError
from app.database.session import get_db
from app.memory.manager import MemoryManager
from app.memory.service import MemoryService
from app.schemas.common import ErrorResponse
from app.schemas.memory import (
    MemoryCreate,
    MemoryUpdate,
    MemoryResponse,
    MemoryListResponse,
)

router = APIRouter(prefix="/api/v1", tags=["Memory"])


def get_memory_manager() -> MemoryManager:
    return MemoryManager()


def get_memory_service() -> MemoryService:
    return MemoryService()


@router.post(
    "/memory",
    response_model=MemoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create or reinforce explicit long-term memory",
    responses={
        201: {"description": "Memory successfully created or reinforced"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def create_memory_endpoint(
    payload: MemoryCreate,
    db: AsyncSession = Depends(get_db),
    manager: MemoryManager = Depends(get_memory_manager),
):
    """Creates a new explicit long-term memory or reinforces an existing equivalent memory if duplicate exists."""
    memory = await manager.create_memory(db, payload)
    return memory


@router.get(
    "/memory",
    response_model=MemoryListResponse,
    summary="List stored memories with filtering and pagination",
    responses={
        200: {"description": "Paginated memory list with total count"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def list_memories_endpoint(
    memory_type: Optional[str] = Query(default=None, description="Filter by memory type (factual, preference, etc.)"),
    is_active: Optional[bool] = Query(default=True, description="Filter by active status"),
    user_id: str = Query(default="local_user", description="Filter by user ID"),
    limit: int = Query(default=50, ge=1, le=100, description="Pagination max items"),
    offset: int = Query(default=0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
    manager: MemoryManager = Depends(get_memory_manager),
):
    """Retrieves paginated stored memories matching criteria."""
    items, total = await manager.list_memories(
        db,
        user_id=user_id,
        memory_type=memory_type,
        is_active=is_active,
        limit=limit,
        offset=offset,
    )
    return MemoryListResponse(total=total, items=items)


@router.get(
    "/memory/search/relevant",
    response_model=List[MemoryResponse],
    summary="Retrieve and rank relevant memories for a query",
    responses={
        200: {"description": "Ranked top-K memories matching query context"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def get_relevant_memories_endpoint(
    q: str = Query(..., min_length=1, description="Query text to match relevant memories"),
    top_k: int = Query(default=5, ge=1, le=20, description="Max top ranked memories to return"),
    user_id: str = Query(default="local_user", description="Filter by user ID"),
    db: AsyncSession = Depends(get_db),
    service: MemoryService = Depends(get_memory_service),
):
    """Retrieves and ranks top-K memories relevant to query using multi-factor ranking algorithm."""
    memories = await service.get_relevant_memories(db, user_query=q, user_id=user_id, top_k=top_k)
    return memories


@router.get(
    "/memory/{memory_id}",
    response_model=MemoryResponse,
    summary="Get memory by ID (updates access count)",
    responses={
        200: {"description": "Memory details"},
        404: {"model": ErrorResponse, "description": "Memory not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def get_memory_endpoint(
    memory_id: str,
    db: AsyncSession = Depends(get_db),
    manager: MemoryManager = Depends(get_memory_manager),
):
    """Retrieves a memory record by ID and automatically updates access tracking metrics."""
    memory = await manager.get_memory(db, memory_id, touch_access=True)
    if not memory:
        raise MemoryNotFoundError(memory_id)
    return memory


@router.put(
    "/memory/{memory_id}",
    response_model=MemoryResponse,
    summary="Update memory record",
    responses={
        200: {"description": "Updated memory details"},
        404: {"model": ErrorResponse, "description": "Memory not found"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def update_memory_endpoint(
    memory_id: str,
    payload: MemoryUpdate,
    db: AsyncSession = Depends(get_db),
    manager: MemoryManager = Depends(get_memory_manager),
):
    """Updates fields of an existing memory record."""
    memory = await manager.update_memory(db, memory_id, payload)
    if not memory:
        raise MemoryNotFoundError(memory_id)
    return memory


@router.delete(
    "/memory/{memory_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete memory record",
    responses={
        200: {"description": "Memory successfully deleted"},
        404: {"model": ErrorResponse, "description": "Memory not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def delete_memory_endpoint(
    memory_id: str,
    db: AsyncSession = Depends(get_db),
    manager: MemoryManager = Depends(get_memory_manager),
):
    """Safely deletes a memory record by ID."""
    deleted = await manager.delete_memory(db, memory_id)
    if not deleted:
        raise MemoryNotFoundError(memory_id)
    return {"message": "Memory successfully deleted.", "id": memory_id}
