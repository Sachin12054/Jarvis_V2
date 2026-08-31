import re
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.logging import logger
from app.database.models.memory import Memory
from app.memory.manager import MemoryManager
from app.schemas.memory import MemoryCreate


DEFAULT_USER_PROFILE = {
    "identity": {
        "name": "Kishore Sachin J G"
    },
    "education": {
        "institution": "Amrita Vishwa Vidyapeetham",
        "degree": "B.Tech",
        "branch": "Computer Science and Engineering",
        "specialization": "AI Engineering",
        "graduation_year": 2027
    },
    "interests": [
        "Artificial Intelligence",
        "Machine Learning",
        "Generative AI",
        "NLP",
        "RAG",
        "Explainable AI",
        "AI agents"
    ],
    "projects": [
        "InterviewSense AI",
        "GeneCopilot AI",
        "JARVIS"
    ],
    "career": {
        "target": "AI/ML Engineer",
        "graduation_year": 2027
    }
}


class UserProfileService:
    """Manages structured user profile storage, retrieval, and domain-decoupled queries."""

    def __init__(self, memory_manager: Optional[MemoryManager] = None):
        self.memory_manager = memory_manager or MemoryManager()

    async def ensure_default_profile(self, db: AsyncSession, user_id: str = "local_user") -> None:
        """Ensures default structured profile facts are seeded in database for user."""
        try:
            items, _ = await self.memory_manager.list_memories(db=db, user_id=user_id, limit=100)
            existing_keys = set()
            for item in items:
                if item.extra_metadata and "profile_key" in item.extra_metadata:
                    existing_keys.add(item.extra_metadata["profile_key"])

            # 1. Identity Name
            if "name" not in existing_keys:
                await self.memory_manager.create_memory(
                    db,
                    MemoryCreate(
                        content=f"User's name is {DEFAULT_USER_PROFILE['identity']['name']}.",
                        memory_type="factual",
                        user_id=user_id,
                        importance=0.95,
                        confidence=0.95,
                        source="user_explicit",
                        extra_metadata={"profile_key": "name", "domain": "identity", "value": DEFAULT_USER_PROFILE["identity"]["name"]},
                    )
                )

            # 2. Education Profile
            if "education" not in existing_keys:
                edu = DEFAULT_USER_PROFILE["education"]
                fact = f"User is studying {edu['degree']} in {edu['branch']} with a specialization in {edu['specialization']} at {edu['institution']} (Graduation: {edu['graduation_year']})."
                await self.memory_manager.create_memory(
                    db,
                    MemoryCreate(
                        content=fact,
                        memory_type="factual",
                        user_id=user_id,
                        importance=0.95,
                        confidence=0.95,
                        source="user_explicit",
                        extra_metadata={
                            "profile_key": "education",
                            "domain": "education",
                            "institution": edu["institution"],
                            "degree": edu["degree"],
                            "branch": edu["branch"],
                            "specialization": edu["specialization"],
                            "graduation_year": edu["graduation_year"],
                        },
                    )
                )

            # 3. Interests
            if "interests" not in existing_keys:
                interests_str = ", ".join(DEFAULT_USER_PROFILE["interests"])
                await self.memory_manager.create_memory(
                    db,
                    MemoryCreate(
                        content=f"User's interests include: {interests_str}.",
                        memory_type="preference",
                        user_id=user_id,
                        importance=0.85,
                        confidence=0.90,
                        source="user_explicit",
                        extra_metadata={"profile_key": "interests", "domain": "interests", "list": DEFAULT_USER_PROFILE["interests"]},
                    )
                )

            # 4. Projects
            if "projects" not in existing_keys:
                projects_str = ", ".join(DEFAULT_USER_PROFILE["projects"])
                await self.memory_manager.create_memory(
                    db,
                    MemoryCreate(
                        content=f"User's projects include: {projects_str}.",
                        memory_type="project",
                        user_id=user_id,
                        importance=0.90,
                        confidence=0.95,
                        source="user_explicit",
                        extra_metadata={"profile_key": "projects", "domain": "projects", "list": DEFAULT_USER_PROFILE["projects"]},
                    )
                )

            # 5. Career Target
            if "career" not in existing_keys:
                car = DEFAULT_USER_PROFILE["career"]
                await self.memory_manager.create_memory(
                    db,
                    MemoryCreate(
                        content=f"User's target career role is {car['target']} (Graduation: {car['graduation_year']}).",
                        memory_type="procedural",
                        user_id=user_id,
                        importance=0.90,
                        confidence=0.95,
                        source="user_explicit",
                        extra_metadata={"profile_key": "career", "domain": "career", "target": car["target"], "graduation_year": car["graduation_year"]},
                    )
                )

        except Exception as err:
            logger.warning(f"[USER PROFILE] Default profile seeding error: {err}")

    # ==========================================
    # STRUCTURED FACT RETRIEVAL METHODS
    # ==========================================

    async def get_education_facts(self, db: AsyncSession, user_id: str = "local_user") -> Dict[str, Any]:
        """Retrieves structured education facts dictionary."""
        await self.ensure_default_profile(db, user_id)
        edu_mem = await self.get_education_memory(db, user_id)
        if edu_mem and edu_mem.extra_metadata:
            meta = edu_mem.extra_metadata
            return {
                "institution": meta.get("institution", "Amrita Vishwa Vidyapeetham"),
                "degree": meta.get("degree", "B.Tech"),
                "branch": meta.get("branch", "Computer Science and Engineering"),
                "specialization": meta.get("specialization", "AI Engineering"),
                "graduation_year": meta.get("graduation_year", 2027),
            }
        return DEFAULT_USER_PROFILE["education"]

    async def get_identity_facts(self, db: AsyncSession, user_id: str = "local_user") -> Dict[str, Any]:
        """Retrieves structured identity facts dictionary."""
        await self.ensure_default_profile(db, user_id)
        return {"name": DEFAULT_USER_PROFILE["identity"]["name"]}

    async def get_projects_facts(self, db: AsyncSession, user_id: str = "local_user") -> List[str]:
        """Retrieves structured project facts list."""
        await self.ensure_default_profile(db, user_id)
        items, _ = await self.memory_manager.list_memories(db=db, user_id=user_id, memory_type="project", limit=50)
        for item in items:
            if item.extra_metadata and item.extra_metadata.get("profile_key") == "projects":
                return item.extra_metadata["list"]
        return DEFAULT_USER_PROFILE["projects"]

    async def get_interests_facts(self, db: AsyncSession, user_id: str = "local_user") -> List[str]:
        """Retrieves structured interests facts list."""
        await self.ensure_default_profile(db, user_id)
        items, _ = await self.memory_manager.list_memories(db=db, user_id=user_id, memory_type="preference", limit=50)
        for item in items:
            if item.extra_metadata and item.extra_metadata.get("profile_key") == "interests":
                return item.extra_metadata["list"]
        return DEFAULT_USER_PROFILE["interests"]

    async def get_career_facts(self, db: AsyncSession, user_id: str = "local_user") -> Dict[str, Any]:
        """Retrieves structured career facts dictionary."""
        await self.ensure_default_profile(db, user_id)
        items, _ = await self.memory_manager.list_memories(db=db, user_id=user_id, memory_type="procedural", limit=50)
        for item in items:
            if item.extra_metadata and item.extra_metadata.get("profile_key") == "career":
                return {
                    "target": item.extra_metadata.get("target", "AI/ML Engineer"),
                    "graduation_year": item.extra_metadata.get("graduation_year", 2027),
                }
        return DEFAULT_USER_PROFILE["career"]

    # ==========================================
    # DOMAIN QUERY HANDLERS (COMPATIBILITY)
    # ==========================================

    async def get_education_memory(self, db: AsyncSession, user_id: str = "local_user") -> Optional[Memory]:
        """Retrieves active profile education memory for user."""
        items, _ = await self.memory_manager.list_memories(
            db=db,
            user_id=user_id,
            memory_type="factual",
            is_active=True,
            limit=50,
        )
        for item in items:
            if item.extra_metadata and item.extra_metadata.get("profile_key") == "education":
                return item
            if item.content and "amrita" in item.content.lower():
                return item
        return None

    async def handle_education_query(self, db: AsyncSession, user_message: str, user_id: str = "local_user") -> str:
        """Handles education domain queries strictly from profile memory."""
        facts = await self.get_education_facts(db, user_id)
        clean = user_message.strip().lower()

        if re.search(r'\bspecialization\b', clean):
            return f"Your specialization is {facts['specialization']}."

        if re.search(r'\bdegree\b', clean):
            return f"You're pursuing a {facts['degree']} in {facts['branch']} with a specialization in {facts['specialization']} at {facts['institution']}."

        if re.search(r'\bgraduate\b|\bgraduation\b', clean):
            return f"Your expected graduation year is {facts['graduation_year']}."

        return f"You're studying {facts['degree']} in {facts['branch']} with a specialization in {facts['specialization']} at {facts['institution']}."

    async def handle_identity_query(self, db: AsyncSession, user_message: str, user_id: str = "local_user") -> str:
        """Handles identity domain queries."""
        facts = await self.get_identity_facts(db, user_id)
        return f"Your name is {facts['name']}."

    async def handle_projects_query(self, db: AsyncSession, user_message: str, user_id: str = "local_user") -> str:
        """Handles project domain queries."""
        projs = await self.get_projects_facts(db, user_id)
        return f"You're currently working on projects including {', '.join(projs)}."

    async def handle_interests_query(self, db: AsyncSession, user_message: str, user_id: str = "local_user") -> str:
        """Handles interests domain queries."""
        ints = await self.get_interests_facts(db, user_id)
        return f"Your interests include {', '.join(ints)}."

    async def handle_career_query(self, db: AsyncSession, user_message: str, user_id: str = "local_user") -> str:
        """Handles career domain queries."""
        car = await self.get_career_facts(db, user_id)
        return f"You're aiming for a role as {car['target']} (Graduation: {car['graduation_year']})."
