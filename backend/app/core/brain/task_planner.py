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


from app.core.model_router.policy import BaselineAdaptivePolicy
from app.core.model_router.contracts import (
    ModelSelectionContext,
    TaskComplexity,
    InteractionChannel,
    ModelCapability,
)


class TaskPlanner:
    """Deterministic Task Planner and Coordinator for JARVIS V2.

    Decomposes complex requests into structured TaskStep DAGs with per-subtask
    model routing via BaselineAdaptivePolicy (production) and RLContextualBandit (shadow).
    """

    def __init__(self, policy: Optional[BaselineAdaptivePolicy] = None):
        self.policy = policy or BaselineAdaptivePolicy()

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

                # Perform per-subtask model routing if not already assigned
                if not step.assigned_model:
                    self._route_step_model(step)

            task.steps = steps

        if not task.steps:
            TaskStateMachine.transition(task, TaskState.FAILED)
            task.metadata["error"] = "Empty or invalid plan produced"
            return task

        task.current_step_id = task.steps[0].step_id
        TaskStateMachine.transition(task, TaskState.READY)
        return task

    def decompose_complex_request(
        self,
        request: JarvisRequest,
        custom_subtasks: Optional[List[Dict[str, Any]]] = None,
    ) -> Task:
        """Dynamically decomposes a complex multi-task request into a structured DAG of TaskSteps."""
        task = self.create_task(request)
        TaskStateMachine.transition(task, TaskState.PLANNING)

        steps: List[TaskStep] = []

        if custom_subtasks:
            # Explicit subtask definitions supplied by orchestrator/pipeline
            for idx, item in enumerate(custom_subtasks, start=1):
                s_id = item.get("step_id") or f"step_{idx}"
                desc = item.get("description") or f"Subtask {idx}"
                cap = item.get("capability") or "KNOWLEDGE_QUERY"
                deps = item.get("depends_on") or []
                args = item.get("arguments") or {}

                step = TaskStep(
                    step_id=s_id,
                    task_id=task.task_id,
                    order=idx,
                    description=desc,
                    capability=cap,
                    arguments=args,
                    depends_on=deps,
                )
                self._route_step_model(step, custom_complexity=item.get("complexity"))
                steps.append(step)
        else:
            # Rule-based dynamic decomposition derived from request text
            raw = request.raw_input or ""
            parsed_parts = [p.strip() for p in raw.split(" and ") if p.strip()]

            if len(parsed_parts) <= 1:
                parsed_parts = [p.strip() for p in raw.split(";") if p.strip()]

            if len(parsed_parts) <= 1:
                # Single objective task step
                step = TaskStep(
                    step_id="step_1",
                    task_id=task.task_id,
                    order=1,
                    description=raw,
                    capability="KNOWLEDGE_QUERY",
                    depends_on=[],
                )
                self._route_step_model(step)
                steps.append(step)
            else:
                # Multi-subtask decomposition
                for idx, part in enumerate(parsed_parts, start=1):
                    cap = "CODING_TASK" if any(w in part.lower() for w in ["code", "python", "function", "script"]) else "KNOWLEDGE_QUERY"
                    step = TaskStep(
                        step_id=f"step_{idx}",
                        task_id=task.task_id,
                        order=idx,
                        description=part,
                        capability=cap,
                        depends_on=[], # Default to parallel execution unless dependencies specified
                    )
                    self._route_step_model(step)
                    steps.append(step)

        task.steps = steps
        if not task.steps:
            TaskStateMachine.transition(task, TaskState.FAILED)
            task.metadata["error"] = "Failed to decompose request into valid subtasks"
            return task

        task.current_step_id = task.steps[0].step_id
        TaskStateMachine.transition(task, TaskState.READY)
        return task

    def _route_step_model(self, step: TaskStep, custom_complexity: Optional[str] = None) -> None:
        """Invokes BaselineAdaptivePolicy for production routing and RLContextualBandit for shadow recommendation."""
        req_coding = "code" in step.capability.lower() or "python" in step.description.lower()
        req_reasoning = "reason" in step.capability.lower() or "math" in step.description.lower()

        complexity = TaskComplexity.NORMAL
        if custom_complexity:
            try:
                complexity = TaskComplexity(custom_complexity)
            except ValueError:
                pass
        elif req_reasoning:
            complexity = TaskComplexity.DEEP_REASONING
        elif req_coding:
            complexity = TaskComplexity.NORMAL

        ctx = ModelSelectionContext(
            channel=InteractionChannel.CHAT,
            complexity=complexity,
            requires_coding=req_coding,
            requires_reasoning=req_reasoning,
        )

        route = self.policy.select_route(ctx)
        step.assigned_model = route.selected_model
        shadow_info = route.selection_metadata.get("shadow_recommendation", {})
        step.shadow_model = shadow_info.get("shadow_model_id")
        step.shadow_confidence = shadow_info.get("shadow_confidence")

    def get_executable_parallel_steps(self, task: Task) -> List[TaskStep]:
        """Returns ALL currently executable PENDING TaskSteps whose dependencies are COMPLETED."""
        if task.state in (TaskState.COMPLETED, TaskState.CANCELLED, TaskState.FAILED):
            return []

        completed_ids = {s.step_id for s in task.steps if s.state == TaskStepState.COMPLETED}
        executable: List[TaskStep] = []

        for step in task.steps:
            if step.state == TaskStepState.PENDING:
                dependencies_satisfied = all(dep in completed_ids for dep in step.depends_on)
                if dependencies_satisfied:
                    executable.append(step)
        return executable

    def get_next_executable_step(self, task: Task) -> Optional[TaskStep]:
        """Returns the next executable TaskStep (for single-step queries)."""
        parallel_steps = self.get_executable_parallel_steps(task)
        return parallel_steps[0] if parallel_steps else None

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

