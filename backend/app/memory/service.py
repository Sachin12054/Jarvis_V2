import re
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging import logger
from app.database.models.memory import Memory
from app.memory.manager import MemoryManager
from app.schemas.memory import MemoryCreate

# Patterns for sensitive credentials that must NEVER be saved to memory
SENSITIVE_PATTERNS = [
    r'sk-[a-zA-Z0-9\-_]{16,}',               # OpenAI / Claude / API Key
    r'ghp_[a-zA-Z0-9]{30,}',                # GitHub Personal Access Token
    r'AKIA[0-9A-Z]{16}',                    # AWS Access Key ID
    r'bearer\s+[a-zA-Z0-9\-\._~\+\/]+=*',    # Bearer token
    r'password\s*[:=]\s*[^\s]+',            # Hardcoded password assignment
    r'api[_\-]?key\s*[:=]\s*[^\s]+',        # Generic API key assignment
]

# Rule-based patterns for explicit memory statements (order matters: specific -> general)
EXPLICIT_PATTERNS = [
    (r'(?:i\s+am\s+building|i\'m\s+building|i\s+am\s+working\s+on|i\'m\s+working\s+on|my\s+project\s+is)\s+(.+)', 'project', 0.85, 0.95),
    (r'(?:remember\s+(?:that\s+)?|store\s+(?:that\s+)?|save\s+(?:that\s+)?|note\s+(?:that\s+)?|my\s+name\s+is|call\s+me)\s+(?:called\s+)?(?:name[s\:]*\s+)?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)', 'factual', 0.95, 0.95),
    (r'(?:my\s+name\s+is|call\s+me)\s+(.+)', 'factual', 0.90, 0.95),
    (r'(?:i\s+prefer|i\s+like|my\s+preference\s+is|i\s+use)\s+(.+)', 'preference', 0.75, 0.90),
    (r'(?:always|never|make\s+sure\s+to)\s+(.+)', 'procedural', 0.80, 0.90),
    (r'(?:remember\s+(?:that\s+)?|store\s+(?:that\s+)?|save\s+(?:that\s+)?|note\s+(?:that\s+)?)(.+)', 'factual', 0.85, 0.90),
]

# Filler and non-memorable messages to reject immediately
NON_MEMORABLE_PATTERNS = [
    r'^\s*(?:hi|hello|hey|good morning|good evening|howdy|sup)\s*[\!\.\?]*$',
    r'^\s*(?:how are you|what\'s up|who are you|thanks|thank you|ok|okay|cool|got it)\s*[\!\.\?]*$',
    r'^\s*(?:/help|/status|/model|/metrics|/clear|/stop|/memory|/remember).*$',
]


class MemoryService:
    """Intelligent Memory Service for extraction, quality filtering, multi-factor ranking, and context injection."""

    _instance: Optional["MemoryService"] = None

    def __init__(self, memory_manager: Optional[MemoryManager] = None):
        self.memory_manager = memory_manager or MemoryManager()
        self._in_memory_store: List[Dict[str, Any]] = []

    @classmethod
    def get_instance(cls) -> "MemoryService":
        if cls._instance is None:
            cls._instance = MemoryService()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    @staticmethod
    def contains_sensitive_data(text: str) -> bool:
        """Checks if text contains credentials, API keys, or private secrets."""
        for pattern in SENSITIVE_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False

    @staticmethod
    def is_non_memorable(text: str) -> bool:
        """Determines if user input is casual greeting, command, or generic filler not worth saving."""
        for pattern in NON_MEMORABLE_PATTERNS:
            if re.search(pattern, text.strip(), re.IGNORECASE):
                return True
        return False

    async def store_memory(
        self,
        user_id: str,
        fact: str,
        category: str = "preference",
        db: Optional[AsyncSession] = None,
    ) -> Optional[Memory]:
        """Stores explicit memory fact into DB or in-memory fallback."""
        self._in_memory_store.append({"user_id": user_id, "fact": fact, "category": category})
        create_schema = MemoryCreate(
            content=fact,
            memory_type=category,
            user_id=user_id,
            importance=0.90,
            confidence=0.95,
            source="user_explicit",
            extra_metadata={"extracted_at": datetime.now(timezone.utc).isoformat()},
        )
        if db:
            return await self.memory_manager.create_memory(db, create_schema)
        return None

    async def search_memory(
        self,
        user_id: str,
        query: str,
        db: Optional[AsyncSession] = None,
    ) -> List[Dict[str, Any]]:
        """Searches memory for query matches in DB or in-memory store."""
        if db:
            mems = await self.get_relevant_memories(db, user_query=query, user_id=user_id)
            if mems:
                return [{"fact": m.content, "type": m.memory_type} for m in mems]

        # In-memory fallback lookup
        query_words = set(re.findall(r'\w+', query.lower()))
        matched = []
        for item in self._in_memory_store:
            if item.get("user_id") == user_id:
                fact_words = set(re.findall(r'\w+', item["fact"].lower()))
                if query_words.intersection(fact_words):
                    matched.append(item)

        return matched

    async def extract_and_store_memories(
        self,
        db: AsyncSession,
        user_message: str,
        assistant_response: Optional[str] = None,
        user_id: str = "local_user",
    ) -> List[Memory]:
        """Extracts memorable facts from user dialogue turn and persists them cleanly."""
        saved_memories: List[Memory] = []

        try:
            if self.contains_sensitive_data(user_message):
                logger.info("[MEMORY] Sensitive credentials detected. Skipping extraction.")
                return []

            if self.is_non_memorable(user_message):
                return []

            clean_text = user_message.strip()

            # Name extraction helper specifically matching name statements
            name_match = re.search(r'(?:remember\s+(?:that\s+)?|store\s+(?:that\s+)?|save\s+(?:that\s+)?|my\s+name\s+is|call\s+me)\s+(?:name[s\:]*\s+)?([A-Z][a-zA-Z]+|\w+)', clean_text, re.IGNORECASE)
            if name_match and re.search(r'\bname\b|\bcall\b', clean_text, re.IGNORECASE):
                name_val = name_match.group(1).strip(".!?,")
                if len(name_val) >= 2 and name_val.lower() not in ["a", "an", "the", "building", "working"]:
                    fact = f"User's name is {name_val}."
                    create_schema = MemoryCreate(
                        content=fact,
                        memory_type="factual",
                        user_id=user_id,
                        importance=0.95,
                        confidence=0.95,
                        source="user_explicit",
                        extra_metadata={"extracted_at": datetime.now(timezone.utc).isoformat(), "key": "user_name"},
                    )
                    memory = await self.memory_manager.create_memory(db, create_schema)
                    saved_memories.append(memory)
                    logger.info(f"[MEMORY] Memory saved/reinforced: Name={name_val}")
                    return saved_memories

            # Explicit / Pattern-based Memory Extraction
            for pattern, mem_type, default_imp, default_conf in EXPLICIT_PATTERNS:
                match = re.search(pattern, clean_text, re.IGNORECASE)
                if match:
                    extracted_fact = clean_text

                    if default_imp < 0.35 or default_conf < 0.60:
                        continue

                    create_schema = MemoryCreate(
                        content=extracted_fact,
                        memory_type=mem_type,
                        user_id=user_id,
                        importance=default_imp,
                        confidence=default_conf,
                        source="user_explicit",
                        extra_metadata={"extracted_at": datetime.now(timezone.utc).isoformat()},
                    )

                    memory = await self.memory_manager.create_memory(db, create_schema)
                    saved_memories.append(memory)
                    logger.info(f"[MEMORY] Memory saved/reinforced: ID={memory.id}, type={memory.memory_type}")
                    break

        except Exception as err:
            logger.warning(f"[MEMORY] Memory extraction encountered non-fatal error: {err}")

        return saved_memories

    async def get_relevant_memories(
        self,
        db: AsyncSession,
        user_query: str,
        user_id: str = "local_user",
        top_k: int = 5,
    ) -> List[Memory]:
        """Retrieves and ranks active memories relevant to the user query."""
        try:
            items, _ = await self.memory_manager.list_memories(
                db=db,
                user_id=user_id,
                is_active=True,
                limit=100,
                offset=0,
            )

            if not items:
                return []

            query_lower = user_query.lower()
            query_words = set(re.findall(r'\w+', query_lower))

            scored_memories = []
            now = datetime.now(timezone.utc)

            is_name_query = bool(re.search(r'\b(?:what\s+is|what\'s|do\s+you\s+know|remember)\s+(?:my\s+)?name\b|\bwho\s+am\s+i\b', query_lower))

            for mem in items:
                mem_content_lower = mem.content.lower()
                mem_words = set(re.findall(r'\w+', mem.normalized_content))
                overlap = len(query_words.intersection(mem_words))
                keyword_score = min(1.0, overlap / max(1, len(query_words)))

                if is_name_query and ("name is" in mem_content_lower or mem.extra_metadata.get("key") == "user_name"):
                    keyword_score = 1.0

                created_dt = mem.created_at if mem.created_at.tzinfo else mem.created_at.replace(tzinfo=timezone.utc)
                days_old = (now - created_dt).total_seconds() / 86400.0
                recency_score = max(0.0, 1.0 - (days_old / 30.0))

                score = (
                    (keyword_score * 0.40) +
                    (mem.importance * 0.25) +
                    (mem.confidence * 0.20) +
                    (recency_score * 0.15)
                )

                if keyword_score > 0 or mem.importance >= 0.8:
                    scored_memories.append((score, mem))

            scored_memories.sort(key=lambda x: x[0], reverse=True)
            top_memories = [m for _, m in scored_memories[:top_k]]

            for m in top_memories:
                await self.memory_manager.get_memory(db, m.id, touch_access=True)

            return top_memories

        except Exception as err:
            logger.warning(f"[MEMORY] Memory retrieval encountered non-fatal error: {err}")
            return []

    def build_memory_context(self, memories: List[Memory]) -> str:
        """Formats retrieved memory facts into a clean system context block."""
        if not memories:
            return ""

        lines = ["[RELEVANT USER MEMORIES]"]
        for m in memories:
            lines.append(f"- [{m.memory_type.upper()}] {m.content}")

        return "\n".join(lines)
