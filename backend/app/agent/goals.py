import time
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional
from app.core.logging import logger


@dataclass
class Goal:
    goal_id: str
    title: str
    description: str
    status: str = "in_progress"  # in_progress, completed, paused
    priority: int = 1
    subtasks: List[str] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)


class GoalManager:
    """Tracks active user goals and recommends prioritized next actions."""

    def __init__(self):
        self._goals: Dict[str, Goal] = {}
        self._seed_default_goals()

    def _seed_default_goals(self) -> None:
        """Seeds default user goals for placement prep and AI projects."""
        g1 = Goal(
            goal_id="g1",
            title="Prepare GeneCopilot for Review",
            description="Complete genomic copilot dataset, VEP, ClinVar, ML pipeline, SHAP, and RAG presentation.",
            status="in_progress",
            priority=1,
            subtasks=["dataset", "VEP", "ClinVar", "ML", "SHAP", "RAG", "presentation"],
        )
        g2 = Goal(
            goal_id="g2",
            title="JARVIS AI Agent Evolution",
            description="Evolve JARVIS into a V5 cognitive, local-first master personal AI agent.",
            status="in_progress",
            priority=1,
            subtasks=["cognitive_brain", "memory_v2", "os_agent", "location_confidence", "phone_integration"],
        )
        self._goals[g1.goal_id] = g1
        self._goals[g2.goal_id] = g2

    def get_active_goals(self) -> List[Goal]:
        """Returns list of active goals."""
        return [g for g in self._goals.values() if g.status == "in_progress"]

    def recommend_next_task(self) -> str:
        """Recommends next task based on goal priority and subtask completion state."""
        active = self.get_active_goals()
        if not active:
            return "All current goals are up to date! What would you like to focus on next?"

        top_goal = sorted(active, key=lambda x: x.priority)[0]
        return f"Based on your current goal '{top_goal.title}', the next focus is: {top_goal.subtasks[0] if top_goal.subtasks else 'review progress'}."
