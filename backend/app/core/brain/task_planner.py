import asyncio
import time
from typing import Optional, List, Dict, Any
from app.core.contracts import (
    JarvisRequest,
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
)
from app.core.brain.task_state_machine import TaskStateMachine


class TaskPlanner:
    """Deterministic Task Planner and Coordinator for JARVIS V2.

    Decomposes complex requests into structured TaskStep DAGs without
    invoking infrastructure primitives directly.
    """

    def create_task(self, request: JarvisRequest, objective: Optional[str] = None) -> Task:
        """Creates a new canonical Task instance from a JarvisRequest."""
        obj = objective or request.raw_input or "Execute task"
        return Task(
            request_id=request.request_id,
            turn_id=request.turn_id,
            objective=obj,
            state=TaskState.PENDING,
            steps=[],
            metadata={"conversation_id": request.conversation_id},
        )

    def plan_task(self, task: Task, steps: Optional[List[TaskStep]] = None) -> Task:
        """Populates a Task with an ordered list of TaskSteps and transitions state."""
        TaskStateMachine.transition(task, TaskState.PLANNING)

        if steps is not None:
            for idx, step in enumerate(steps, start=1):
                step.task_id = task.task_id
                step.order = idx
            task.steps = steps

        if not task.steps:
            TaskStateMachine.transition(task, TaskState.FAILED)
            task.metadata["error"] = "Empty or invalid plan produced"
            return task

        task.current_step_id = task.steps[0].step_id
        TaskStateMachine.transition(task, TaskState.READY)
        return task

    def get_next_executable_step(self, task: Task) -> Optional[TaskStep]:
        """Returns the next executable TaskStep whose dependencies are satisfied."""
        if task.state in (TaskState.COMPLETED, TaskState.CANCELLED, TaskState.FAILED):
            return None

        completed_ids = {s.step_id for s in task.steps if s.state == TaskStepState.COMPLETED}

        for step in task.steps:
            if step.state == TaskStepState.PENDING:
                dependencies_satisfied = all(dep in completed_ids for dep in step.depends_on)
                if dependencies_satisfied:
                    return step
        return None

    def cancel_task(self, task: Task, cancel_event: Optional[asyncio.Event] = None) -> Task:
        """Cancels an active task and updates all running and pending step states."""
        if cancel_event and not cancel_event.is_set():
            return task

        for step in task.steps:
            if step.state == TaskStepState.RUNNING:
                step.state = TaskStepState.CANCELLED
            elif step.state == TaskStepState.PENDING:
                step.state = TaskStepState.SKIPPED

        if task.state in (TaskState.READY, TaskState.RUNNING, TaskState.WAITING, TaskState.PLANNING, TaskState.PENDING):
            TaskStateMachine.transition(task, TaskState.CANCELLED)
        return task
