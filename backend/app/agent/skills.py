import time
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional
from app.core.logging import logger


@dataclass
class Skill:
    skill_id: str
    name: str
    description: str
    version: str = "1.0"
    permission_required: str = "SAFE"
    steps: List[Dict[str, Any]] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)


class SkillManager:
    """Manages reusable, versioned, permission-controlled agent skills."""

    def __init__(self):
        self._skills: Dict[str, Skill] = {}
        self._seed_default_skills()

    def _seed_default_skills(self) -> None:
        """Seeds default reusable skills."""
        s1 = Skill(
            skill_id="diagnose_laptop_performance",
            name="diagnose_laptop_performance",
            description="Inspects CPU, RAM, GPU, and process metrics to identify performance bottlenecks.",
            permission_required="SAFE",
            steps=[
                {"tool": "system_metrics", "args": {}},
                {"action": "reason_bottleneck"},
            ],
        )
        s2 = Skill(
            skill_id="start_jarvis_environment",
            name="start_jarvis_environment",
            description="Inspects workspace, verifies environment, and launches backend/frontend processes.",
            permission_required="CONFIRM",
            steps=[
                {"tool": "file_info", "args": {"path": "."}},
                {"action": "check_health"},
            ],
        )
        self._skills[s1.name] = s1
        self._skills[s2.name] = s2

    def get_skill(self, name: str) -> Optional[Skill]:
        """Retrieves a registered skill by name."""
        return self._skills.get(name.strip().lower())

    def list_skills(self) -> List[Skill]:
        """Returns list of registered skills."""
        return list(self._skills.values())
