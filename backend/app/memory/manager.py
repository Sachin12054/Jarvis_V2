import re
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.base import utc_now
from app.database.models.memory import Memory
from app.schemas.memory import MemoryCreate, MemoryUpdate


class MemoryManager:
    """Manages creation, deduplication, retrieval, listing, update, access tracking, and deletion of memories."""

    @staticmethod
    def normalize_content(text: str) -> str:
        """Normalizes memory text content for deduplication (lowercased, collapsed whitespace)."""
        clean = text.strip().lower()
        return re.sub(r'\s+', ' ', clean)

    async def create_memory(self, db: AsyncSession, data: MemoryCreate) -> Memory:
        """Creates a memory record or reinforces an existing equivalent memory if duplicate exists."""
        norm_content = self.normalize_content(data.content)
        user_id = data.user_id or "local_user"

        # 1. Deduplication check: Search for active duplicate in same memory_type and user_id
        stmt = select(Memory).where(
            Memory.user_id == user_id,
            Memory.memory_type == data.memory_type,
            Memory.normalized_content == norm_content,
            Memory.is_active == True,
        )
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            # Reinforce existing memory instead of creating conflicting duplicate
            existing.confidence = max(existing.confidence, data.confidence)
            existing.importance = max(existing.importance, data.importance)
            existing.updated_at = utc_now()
            if data.extra_metadata:
                merged_metadata = dict(existing.extra_metadata or {})
                merged_metadata.update(data.extra_metadata)
                existing.extra_metadata = merged_metadata
            await db.flush()
            await db.refresh(existing)
            return existing

        # 2. Create new memory record
        memory = Memory(
            user_id=user_id,
            memory_type=data.memory_type,
            content=data.content.strip(),
            normalized_content=norm_content,
            importance=data.importance,
            confidence=data.confidence,
            source=data.source,
            extra_metadata=data.extra_metadata or {},
        )
        db.add(memory)
        await db.flush()
        await db.refresh(memory)
        return memory

    async def get_memory(
        self, db: AsyncSession, memory_id: str, touch_access: bool = True
    ) -> Optional[Memory]:
        """Retrieves a memory by ID. Automatically updates access count and last_accessed_at when touch_access is True."""
        stmt = select(Memory).where(Memory.id == memory_id)
        result = await db.execute(stmt)
        memory = result.scalar_one_or_none()

        if memory and touch_access:
            memory.access_count += 1
            memory.last_accessed_at = utc_now()
            await db.flush()

        return memory

    async def list_memories(
        self,
        db: AsyncSession,
        user_id: str = "local_user",
        memory_type: Optional[str] = None,
        is_active: Optional[bool] = True,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Memory], int]:
        """Retrieves paginated memory items with total count filtering by type and active state."""
        base_query = select(Memory).where(Memory.user_id == user_id)

        if memory_type:
            base_query = base_query.where(Memory.memory_type == memory_type)
        if is_active is not None:
            base_query = base_query.where(Memory.is_active == is_active)

        # Count total
        count_stmt = select(func.count()).select_from(base_query.subquery())
        count_res = await db.execute(count_stmt)
        total = count_res.scalar_one() or 0

        # Paginated items ordered by updated_at descending
        items_stmt = base_query.order_by(Memory.updated_at.desc()).limit(limit).offset(offset)
        items_res = await db.execute(items_stmt)
        items = list(items_res.scalars().all())

        return items, total

    async def update_memory(
        self, db: AsyncSession, memory_id: str, data: MemoryUpdate
    ) -> Optional[Memory]:
        """Updates an existing memory record without modifying access count."""
        memory = await self.get_memory(db, memory_id, touch_access=False)
        if not memory:
            return None

        if data.content is not None:
            memory.content = data.content.strip()
            memory.normalized_content = self.normalize_content(data.content)
        if data.memory_type is not None:
            memory.memory_type = data.memory_type
        if data.importance is not None:
            memory.importance = data.importance
        if data.confidence is not None:
            memory.confidence = data.confidence
        if data.source is not None:
            memory.source = data.source
        if data.is_active is not None:
            memory.is_active = data.is_active
        if data.extra_metadata is not None:
            memory.extra_metadata = data.extra_metadata

        memory.updated_at = utc_now()
        await db.flush()
        await db.refresh(memory)
        return memory

    async def delete_memory(self, db: AsyncSession, memory_id: str) -> bool:
        """Safely deletes a memory record by ID. Returns True if deleted, False if not found."""
        memory = await self.get_memory(db, memory_id, touch_access=False)
        if not memory:
            return False
        await db.delete(memory)
        await db.flush()
        return True
