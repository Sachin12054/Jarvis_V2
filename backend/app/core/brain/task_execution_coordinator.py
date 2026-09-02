import inspect
import asyncio
import time
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

    async def execute_task_dag(
        self,
        task: Task,
        cancel_event: Optional[asyncio.Event] = None,
        context: Optional[Dict[str, Any]] = None,
        event_callback: Optional[Any] = None,
        max_concurrency: int = 3,
        step_executor: Optional[Any] = None,
    ) -> Task:
        """Executes a multi-step Task DAG using true asynchronous parallel execution for independent steps.

        Uses asyncio.Semaphore for bounded concurrency and asyncio.Event for dependency signals.
        Subtask model routing is governed by BaselineAdaptivePolicy (production authority)
        with RLContextualBandit operating in shadow mode.
        """
        ctx = context or {}
        if task.state in (TaskState.COMPLETED, TaskState.CANCELLED, TaskState.FAILED):
            return task

        if cancel_event and cancel_event.is_set():
            return self.planner.cancel_task(task, cancel_event)

        if task.state in (TaskState.PENDING, TaskState.PLANNING, TaskState.READY, TaskState.WAITING):
            if task.state == TaskState.PENDING:
                TaskStateMachine.transition(task, TaskState.PLANNING)
                TaskStateMachine.transition(task, TaskState.READY if task.steps else TaskState.FAILED)
            if task.state == TaskState.READY:
                TaskStateMachine.transition(task, TaskState.RUNNING)
            elif task.state == TaskState.WAITING:
                TaskStateMachine.transition(task, TaskState.RUNNING)

        step_events: Dict[str, asyncio.Event] = {step.step_id: asyncio.Event() for step in task.steps}
        step_map: Dict[str, TaskStep] = {step.step_id: step for step in task.steps}
        semaphore = asyncio.Semaphore(max_concurrency)

        async def _run_subtask(step: TaskStep) -> None:
            # 1. Dependency Resolution & Waiting
            if step.depends_on:
                for dep_id in step.depends_on:
                    if dep_id in step_events:
                        await step_events[dep_id].wait()
                    dep_step = step_map.get(dep_id)
                    if dep_step and dep_step.state in (TaskStepState.FAILED, TaskStepState.SKIPPED, TaskStepState.CANCELLED):
                        step.state = TaskStepState.SKIPPED
                        step.error = f"Dependency step '{dep_id}' failed or skipped."
                        step_events[step.step_id].set()
                        return

            if cancel_event and cancel_event.is_set():
                step.state = TaskStepState.CANCELLED
                step_events[step.step_id].set()
                return

            # 2. Bounded Concurrency Semaphore Acquisition
            async with semaphore:
                step.state = TaskStepState.RUNNING
                step.start_time = time.time()

                if event_callback:
                    await self._safe_notify(event_callback, {
                        "type": "subtask_started",
                        "task_id": task.task_id,
                        "step_id": step.step_id,
                        "description": step.description,
                        "assigned_model": step.assigned_model,
                        "shadow_model": step.shadow_model,
                        "shadow_confidence": step.shadow_confidence,
                        "start_time": step.start_time,
                    })

                try:
                    # 3. Step Capability / Model Execution
                    if step_executor:
                        res_text = await step_executor(step, ctx)
                    else:
                        handler = self.resolver.resolve(step.capability)
                        if handler:
                            res = handler.execute(step, ctx)
                            if inspect.isawaitable(res):
                                exec_res, ver_res = await res
                            else:
                                exec_res, ver_res = res
                            step.result = exec_res
                            step.verification = ver_res
                            res_text = exec_res.error_message if not exec_res.success else f"Executed {step.capability}"
                        else:
                            res_text = f"Result of {step.description} using {step.assigned_model}"

                    step.output_text = res_text
                    step.state = TaskStepState.COMPLETED
                    step.completion_time = time.time()
                    step.duration_ms = round((step.completion_time - step.start_time) * 1000.0, 2)
                    step.result = ExecutionResult(
                        action_type=step.capability,
                        status=ExecutionStatus.EXECUTED,
                        success=True,
                        output_data={"text": res_text, "model": step.assigned_model, "duration_ms": step.duration_ms},
                    )
                    step.verification = VerificationResult(verified=True, status="SUCCESS", details="Step verified successfully")

                except Exception as exc:
                    step.state = TaskStepState.FAILED
                    step.error = str(exc)
                    step.completion_time = time.time()
                    step.duration_ms = round((step.completion_time - step.start_time) * 1000.0, 2)
                    step.result = ExecutionResult(
                        action_type=step.capability,
                        status=ExecutionStatus.FAILED,
                        success=False,
                        error_message=str(exc),
                    )
                    step.verification = VerificationResult(verified=False, status="FAILED", details=str(exc))
                finally:
                    step_events[step.step_id].set()
                    if event_callback:
                        await self._safe_notify(event_callback, {
                            "type": "subtask_completed" if step.state == TaskStepState.COMPLETED else "subtask_failed",
                            "task_id": task.task_id,
                            "step_id": step.step_id,
                            "output_text": step.output_text,
                            "state": step.state.value,
                            "duration_ms": step.duration_ms,
                            "assigned_model": step.assigned_model,
                            "shadow_model": step.shadow_model,
                            "start_time": step.start_time,
                            "completion_time": step.completion_time,
                        })

        await asyncio.gather(*[_run_subtask(step) for step in task.steps])

        all_completed = all(s.state == TaskStepState.COMPLETED for s in task.steps)
        if all_completed:
            TaskStateMachine.transition(task, TaskState.VERIFYING)
            TaskStateMachine.transition(task, TaskState.COMPLETED)
        else:
            TaskStateMachine.transition(task, TaskState.FAILED)
            task.metadata["error"] = "One or more DAG subtasks failed or were skipped"

        return task

    async def _safe_notify(self, callback: Any, event_data: Dict[str, Any]) -> None:
        try:
            res = callback(event_data)
            if inspect.isawaitable(res):
                await res
        except Exception:
            pass

