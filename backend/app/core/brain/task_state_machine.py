import time
from typing import Set, Dict
from app.core.contracts.enums import TaskState
from app.core.contracts.task import Task


class InvalidStateTransitionError(ValueError):
    """Raised when an invalid task state transition is attempted."""
    pass


class TaskStateMachine:
    """Deterministic State Machine enforcing valid Task state transitions."""

    VALID_TRANSITIONS: Dict[TaskState, Set[TaskState]] = {
        TaskState.PENDING: {TaskState.PLANNING},
        TaskState.PLANNING: {TaskState.READY, TaskState.FAILED},
        TaskState.READY: {TaskState.RUNNING, TaskState.WAITING, TaskState.CANCELLED, TaskState.FAILED},
        TaskState.RUNNING: {
            TaskState.VERIFYING,
            TaskState.COMPLETED,
            TaskState.FAILED,
            TaskState.CANCELLED,
            TaskState.WAITING,
        },
        TaskState.WAITING: {TaskState.RUNNING, TaskState.CANCELLED, TaskState.FAILED},
        TaskState.VERIFYING: {TaskState.COMPLETED, TaskState.FAILED, TaskState.RUNNING},
        TaskState.FAILED: {TaskState.PENDING},
        TaskState.COMPLETED: set(),
        TaskState.CANCELLED: set(),
    }

    @classmethod
    def transition(cls, task: Task, target_state: TaskState) -> Task:
        """Enforces and executes state transition on a Task."""
        current_state = task.state
        if current_state == target_state:
            return task

        allowed = cls.VALID_TRANSITIONS.get(current_state, set())
        if target_state not in allowed:
            raise InvalidStateTransitionError(
                f"Cannot transition Task {task.task_id} from state {current_state.value} to {target_state.value}."
            )

        task.state = target_state
        task.updated_at = time.time()
        return task
