import time
import uuid
from enum import Enum
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from pydantic import BaseModel, Field


class AgentStatus(str, Enum):
    IDLE = "idle"
    PASSIVE_LISTENING = "passive_listening"
    ACTIVE_CONVERSATION = "active_conversation"
    PERCEIVING = "perceiving"
    PLANNING = "planning"
    EXECUTING = "executing"
    TASK_EXECUTION = "task_execution"
    REASONING = "reasoning"
    VERBALIZING = "verbalizing"
    SPEAKING = "speaking"
    INTERRUPTED = "interrupted"
    LEARNING = "learning"
    WAITING_CONFIRMATION = "waiting_confirmation"
    CLARIFYING = "clarifying"
    CANCELLED = "cancelled"
    SUPERSEDED = "superseded"
    COMPLETED = "completed"
    FAILED = "failed"


class GoalType(str, Enum):
    QUESTION = "QUESTION"
    INFORMATION_REQUEST = "INFORMATION_REQUEST"
    DIAGNOSIS = "DIAGNOSIS"
    ACTION = "ACTION"
    MULTI_STEP_TASK = "MULTI_STEP_TASK"
    PROJECT_TASK = "PROJECT_TASK"
    DEVELOPMENT_TASK = "DEVELOPMENT_TASK"
    MONITORING = "MONITORING"
    OPEN_ENDED_GOAL = "OPEN_ENDED_GOAL"


class StepStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"
    CANCELLED = "CANCELLED"
    SUPERSEDED = "SUPERSEDED"
    WAITING_CONFIRMATION = "WAITING_CONFIRMATION"


class EvaluationOutcome(str, Enum):
    COMPLETE = "COMPLETE"
    MORE_INFORMATION_REQUIRED = "MORE_INFORMATION_REQUIRED"
    REPLAN = "REPLAN"
    ASK_USER = "ASK_USER"
    FAIL = "FAIL"


class TaskStep(BaseModel):
    step_id: int
    plan_version: int = 1
    description: str
    tool_name: str
    arguments: Dict[str, Any] = Field(default_factory=dict)
    depends_on: List[int] = Field(default_factory=list)
    permission_level: str = "SAFE"
    status: StepStatus = StepStatus.PENDING
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

    @property
    def completed(self) -> bool:
        return self.status == StepStatus.COMPLETED

    @completed.setter
    def completed(self, value: bool) -> None:
        self.status = StepStatus.COMPLETED if value else StepStatus.PENDING


class AgentPlan(BaseModel):
    plan_id: str = Field(default_factory=lambda: f"plan_{uuid.uuid4().hex[:8]}")
    goal_id: str = Field(default_factory=lambda: f"goal_{uuid.uuid4().hex[:8]}")
    goal: str
    plan_version: int = 1
    goal_type: GoalType = GoalType.OPEN_ENDED_GOAL
    steps: List[TaskStep] = Field(default_factory=list)
    created_at: float = Field(default_factory=time.time)
    status: StepStatus = StepStatus.PENDING

    def __len__(self) -> int:
        return len(self.steps)

    def __getitem__(self, index: int) -> TaskStep:
        return self.steps[index]

    def __iter__(self):
        return iter(self.steps)


@dataclass
class AgentState:
    """Master cognitive state tracking goal, intent, plan, versioning, cancellation, observations, and verification."""

    conversation_id: Optional[str] = None
    user_id: str = "local_user"
    channel: str = "chat"
    user_message: str = ""
    normalized_message: str = ""

    goal_id: str = field(default_factory=lambda: f"goal_{uuid.uuid4().hex[:8]}")
    goal: Optional[str] = None
    plan_version: int = 1
    goal_type: GoalType = GoalType.OPEN_ENDED_GOAL
    current_step: int = 0
    plan: Optional[AgentPlan] = None

    completed_steps: List[TaskStep] = field(default_factory=list)
    failed_steps: List[TaskStep] = field(default_factory=list)

    tool_observations: List[Dict[str, Any]] = field(default_factory=list)
    observations: List[Dict[str, Any]] = field(default_factory=list)

    required_information: List[str] = field(default_factory=list)
    missing_information: List[str] = field(default_factory=list)

    system_observation: Optional[Dict[str, Any]] = None
    location_observation: Optional[Dict[str, Any]] = None

    replan_count: int = 0
    agent_step_count: int = 0
    max_agent_steps: int = 5
    max_replans: int = 3

    selected_model: str = "gemma-3-4b:latest"
    confirmation_required: bool = False
    pending_operation: Optional[Dict[str, Any]] = None

    is_cancelled: bool = False
    cancel_reason: Optional[str] = None

    success: bool = False
    failure_reason: Optional[str] = None

    status: AgentStatus = AgentStatus.IDLE
    errors: List[str] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)

    def add_observation(self, tool_name: str, result_data: Dict[str, Any], success: bool = True) -> None:
        """Adds a structured tool observation to the agent state."""
        obs = {
            "tool": tool_name,
            "data": result_data,
            "success": success,
            "step": self.current_step,
            "plan_version": self.plan_version,
            "timestamp": time.time(),
        }
        self.tool_observations.append(obs)
        self.observations.append(obs)
        self.updated_at = time.time()

    def record_error(self, err_msg: str) -> None:
        """Records an execution error safely without breaking state."""
        self.errors.append(err_msg)
        self.updated_at = time.time()

    def cancel_task(self, reason: str = "User cancelled active goal.") -> None:
        """Marks the current task and plan version as cancelled."""
        self.is_cancelled = True
        self.cancel_reason = reason
        self.status = AgentStatus.CANCELLED
        if self.plan:
            self.plan.status = StepStatus.CANCELLED
        self.updated_at = time.time()

    def increment_plan_version(self) -> int:
        """Increments plan version to prevent stale step execution."""
        self.plan_version += 1
        if self.plan:
            self.plan.plan_version = self.plan_version
        self.updated_at = time.time()
        return self.plan_version
