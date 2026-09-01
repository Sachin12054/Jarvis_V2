import inspect
import asyncio
from typing import Optional, Dict, Any, Tuple
from app.core.contracts import (
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
    ExecutionResult,
    ExecutionStatus,
    VerificationResult,
)
from app.core.brain.task_planner import TaskPlanner
from app.core.brain.task_state_machine import TaskStateMachine
from app.core.brain.capability_resolver import CapabilityResolver, CapabilityHandler


class TaskExecutionCoordinator:
    """Generic Task Execution Coordinator for JARVIS V2.

    Coordinates task step lifecycle, capability resolution, verification checks,
    and state machine transitions without directly importing infrastructure dependencies.
    """

    def __init__(
        self,
        planner: Optional[TaskPlanner] = None,
        resolver: Optional[CapabilityResolver] = None,
    ):
        self.planner = planner or TaskPlanner()
        self.resolver = resolver or CapabilityResolver()

    async def execute_task(
        self,
        task: Task,
        cancel_event: Optional[asyncio.Event] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Task:
        """Executes a Task step-by-step through resolved capabilities until completion, failure, cancellation, or waiting."""
        ctx = context or {}

        # Terminal state check
        if task.state in (TaskState.COMPLETED, TaskState.CANCELLED, TaskState.FAILED):
            return task

        # Initial cancellation check
        if cancel_event and cancel_event.is_set():
            return self.planner.cancel_task(task, cancel_event)

        # Transition task state to RUNNING if ready or waiting
        if task.state in (TaskState.PENDING, TaskState.PLANNING, TaskState.READY, TaskState.WAITING):
            if task.state == TaskState.PENDING:
                TaskStateMachine.transition(task, TaskState.PLANNING)
                TaskStateMachine.transition(task, TaskState.READY if task.steps else TaskState.FAILED)
            if task.state == TaskState.READY:
                TaskStateMachine.transition(task, TaskState.RUNNING)
            elif task.state == TaskState.WAITING:
                TaskStateMachine.transition(task, TaskState.RUNNING)

        while task.state == TaskState.RUNNING:
            # Step cancellation check
            if cancel_event and cancel_event.is_set():
                return self.planner.cancel_task(task, cancel_event)

            step: Optional[TaskStep] = self.planner.get_next_executable_step(task)

            if step is None:
                # Check if all steps are completed
                all_completed = all(s.state == TaskStepState.COMPLETED for s in task.steps)
                if all_completed and task.steps:
                    TaskStateMachine.transition(task, TaskState.VERIFYING)
                    TaskStateMachine.transition(task, TaskState.COMPLETED)
                else:
                    # Blocked by unfulfilled dependencies or empty steps
                    TaskStateMachine.transition(task, TaskState.FAILED)
                    task.metadata["error"] = "Task blocked by incomplete dependencies or empty plan"
                break

            # Resolve Capability
            handler: Optional[CapabilityHandler] = self.resolver.resolve(step.capability)
            if not handler:
                step.state = TaskStepState.FAILED
                step.error = f"Capability {step.capability} is unknown or not registered."
                step.result = ExecutionResult(
                    action_type=step.capability,
                    status=ExecutionStatus.FAILED,
                    success=False,
                    error_code="UNKNOWN_CAPABILITY",
                    error_message=step.error,
                )
                step.verification = VerificationResult(verified=False, status="FAILED", details=step.error)
                TaskStateMachine.transition(task, TaskState.FAILED)
                task.metadata["error"] = step.error
                break

            # Update step state & current step
            task.current_step_id = step.step_id
            step.state = TaskStepState.RUNNING

            try:
                # Execute capability handler (supports both async and sync returns)
                res = handler.execute(step, ctx)
                if inspect.isawaitable(res):
                    exec_res, ver_res = await res
                else:
                    exec_res, ver_res = res

                step.result = exec_res
                step.verification = ver_res

                # Check for clarification request
                if exec_res.evidence and exec_res.evidence.get("requires_clarification"):
                    step.state = TaskStepState.PENDING
                    TaskStateMachine.transition(task, TaskState.WAITING)
                    break

                if exec_res.success and ver_res.verified:
                    step.state = TaskStepState.COMPLETED
                else:
                    step.state = TaskStepState.FAILED
                    step.error = exec_res.error_message or ver_res.details or "Execution or verification failed"
                    TaskStateMachine.transition(task, TaskState.FAILED)
                    task.metadata["error"] = step.error
                    break

            except Exception as exc:
                step.state = TaskStepState.FAILED
                step.error = str(exc)
                step.result = ExecutionResult(
                    action_type=step.capability,
                    status=ExecutionStatus.FAILED,
                    success=False,
                    error_code="STEP_EXECUTION_EXCEPTION",
                    error_message=str(exc),
                )
                step.verification = VerificationResult(verified=False, status="FAILED", details=str(exc))
                TaskStateMachine.transition(task, TaskState.FAILED)
                task.metadata["error"] = str(exc)
                break

            # Post-step cancellation check
            if cancel_event and cancel_event.is_set():
                return self.planner.cancel_task(task, cancel_event)

        return task
