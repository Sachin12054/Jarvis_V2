import re
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging import logger
from app.memory.service import MemoryService
from app.schemas.memory import MemoryCreate


class AgentLearningEngine:
    """Manages memory corrections, episodic event storage, and learning from user feedback."""

    def __init__(self, memory_service: Optional[MemoryService] = None):
        self.memory_service = memory_service or MemoryService()

    async def check_and_apply_user_correction(
        self,
        db: AsyncSession,
        user_message: str,
        user_id: str = "local_user",
    ) -> Optional[Dict[str, Any]]:
        """Detects contradiction/correction statements ('That's wrong, I study at Amrita') and updates memory."""
        clean = user_message.strip().lower()

        # Check for explicit correction patterns
        correction_match = re.search(r'\b(?:that\'s\s+wrong|no|incorrect|actually)\b.*?\b(?:i\s+study\s+at|i\'m\s+at|my\s+college\s+is)\s+(.+)', clean)
        if correction_match:
            new_inst = correction_match.group(1).strip().title()
            logger.info(f"[LEARNING ENGINE] Detected education profile correction to '{new_inst}'")

            # Store updated memory fact (source must be valid literal: 'user_explicit')
            await self.memory_service.memory_manager.create_memory(
                db,
                MemoryCreate(
                    content=f"User studies at {new_inst}.",
                    memory_type="factual",
                    user_id=user_id,
                    importance=0.98,
                    confidence=0.98,
                    source="user_explicit",
                    extra_metadata={"profile_key": "education", "institution": new_inst},
                )
            )
            return {"type": "correction", "key": "education", "value": new_inst}

        return None

    async def record_episodic_event(
        self,
        db: AsyncSession,
        event_description: str,
        importance: float = 0.85,
        user_id: str = "local_user",
        conversation_id: Optional[str] = None,
    ) -> None:
        """Stores a notable episodic memory event."""
        try:
            await self.memory_service.memory_manager.create_memory(
                db,
                MemoryCreate(
                    content=event_description,
                    memory_type="episodic",
                    user_id=user_id,
                    importance=importance,
                    confidence=0.95,
                    source="inferred",
                    extra_metadata={"conversation_id": conversation_id},
                )
            )
            logger.info(f"[LEARNING ENGINE] Recorded episodic event: '{event_description}'")
        except Exception as err:
            logger.warning(f"[LEARNING ENGINE] Failed to record episodic event: {err}")
