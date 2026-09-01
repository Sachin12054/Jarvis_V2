from typing import Optional, Dict, Any, List, Tuple
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
)
from app.core.brain.task_state_machine import TaskStateMachine
from app.core.brain.task_planner import TaskPlanner
from app.core.interaction.clarification_context import ClarificationContext
from app.core.interaction.clarification_resolver import ClarificationResolver, ResolutionResult


class ClarificationManager:
    """Canonical ClarificationManager for JARVIS V2 core interaction layer.

    Coordinates clarification detection, structured question generation,
    context tracking, answer processing, and task resumption.
    """

    def __init__(
        self,
        resolver: Optional[ClarificationResolver] = None,
        planner: Optional[TaskPlanner] = None,
    ):
        self.resolver = resolver or ClarificationResolver()
        self.planner = planner or TaskPlanner()
        self._active_clarifications: Dict[str, ClarificationContext] = {}
        self._task_clarification_map: Dict[str, str] = {}  # task_id -> clarification_id
        self._tasks: Dict[str, Task] = {}  # task_id -> Task instance

    def should_clarify(
        self,
        understanding: UnderstandingResult,
        user_preferences: Optional[Dict[str, Any]] = None,
        safe_defaults: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Determines whether clarification is required.

        Returns False if:
        - Entity is unambiguously resolved.
        - User preference or remembered preference is available.
        - Safe default option is available.
        """
        prefs = user_preferences or {}
        defaults = safe_defaults or {}
        intent_str = str(understanding.intent)

        # If user preference or remembered preference exists, no clarification needed
        if intent_str in prefs or understanding.confidence >= 0.95:
            return False

        # If a safe default exists for the entity, no clarification needed
        if intent_str in defaults:
            return False

        # Clarify if marked ambiguous or missing critical entity target
        if getattr(understanding, "ambiguity", False) or getattr(understanding, "requires_clarification", False):
            return True

        if not understanding.entities and understanding.confidence < 0.7:
            return True

        return False

    def generate_question(
        self,
        target: str,
        options: List[str],
        action_name: Optional[str] = None,
        default_option: Optional[str] = None,
    ) -> str:
        """Generates a clear, specific user-facing clarification question following minimum question principle."""
        if default_option:
            return f"Should I use {default_option} for {target}?"

        if len(options) == 2:
            opts_formatted = f"{options[0]} and {options[1]}"
            act_str = f" {action_name}" if action_name else ""
            return f"I found two choices for {target}: {opts_formatted}. Which one should I{act_str} use?"

        elif len(options) > 2:
            opts_formatted = ", ".join(options[:-1]) + f", and {options[-1]}"
            return f"I found multiple choices for {target}: {opts_formatted}. Which one would you prefer?"

        elif action_name:
            return f"Which {target} would you like me to {action_name}?"
        else:
            return f"Could you specify the {target}?"

    def create_clarification(
        self,
        request: JarvisRequest,
        question: str,
        missing_information: str,
        candidate_options: List[str],
        task: Optional[Task] = None,
        step: Optional[TaskStep] = None,
        decision: Optional[DecisionResult] = None,
        understanding: Optional[UnderstandingResult] = None,
        default_option: Optional[str] = None,
    ) -> ClarificationContext:
        """Creates a ClarificationContext, registers active tracking, and updates Task state to WAITING."""
        task_id = task.task_id if task else None
        step_id = step.step_id if step else (task.current_step_id if task else None)

        context = ClarificationContext(
            request_id=request.request_id,
            turn_id=request.turn_id,
            task_id=task_id,
            step_id=step_id,
            original_request=request,
            original_understanding=understanding,
            original_decision=decision,
            question=question,
            missing_information=missing_information,
            candidate_options=candidate_options,
            default_option=default_option,
        )

        self._active_clarifications[context.clarification_id] = context

        if task:
            self._task_clarification_map[task.task_id] = context.clarification_id
            self._tasks[task.task_id] = task

            # Transition task to WAITING state
            if task.state != TaskState.WAITING:
                TaskStateMachine.transition(task, TaskState.WAITING)

            # Ensure pending step remains pending for resumption
            if step:
                step.state = TaskStepState.PENDING

        return context

    def get_pending_clarification(
        self,
        clarification_id: Optional[str] = None,
        task_id: Optional[str] = None,
        request_id: Optional[str] = None,
        turn_id: Optional[str] = None,
    ) -> Optional[ClarificationContext]:
        """Retrieves a pending clarification context using matching identifiers."""
        if clarification_id and clarification_id in self._active_clarifications:
            return self._active_clarifications[clarification_id]

        if task_id and task_id in self._task_clarification_map:
            cid = self._task_clarification_map[task_id]
            return self._active_clarifications.get(cid)

        # Match by request_id / turn_id
        for ctx in self._active_clarifications.values():
            if ctx.status == "PENDING":
                if request_id and ctx.request_id == request_id:
                    return ctx
                if turn_id and ctx.turn_id and ctx.turn_id == turn_id:
                    return ctx

        return None

    def process_answer(
        self,
        user_answer: str,
        clarification_id: Optional[str] = None,
        task_id: Optional[str] = None,
        request_id: Optional[str] = None,
        turn_id: Optional[str] = None,
    ) -> Tuple[bool, Optional[ClarificationContext], Optional[str], Optional[Task]]:
        """Processes user answer against active clarification context.

        Returns (success: bool, context: ClarificationContext, resolved_value_or_error: str, task: Task)
        """
        ctx = self.get_pending_clarification(
            clarification_id=clarification_id,
            task_id=task_id,
            request_id=request_id,
            turn_id=turn_id,
        )

        if not ctx or ctx.status != "PENDING":
            return (False, None, "STALE_OR_UNKNOWN_CLARIFICATION", None)

        task = self._tasks.get(ctx.task_id) if ctx.task_id else None

        # Check for cancellation request
        if self.resolver.is_cancellation(user_answer):
            ctx.status = "CANCELLED"
            if task:
                self.planner.cancel_task(task)
            self._cleanup(ctx)
            return (False, ctx, "CANCELLED", task)

        # Resolve user answer
        res: ResolutionResult = self.resolver.resolve_answer(ctx, user_answer)

        if res.is_cancellation:
            ctx.status = "CANCELLED"
            if task:
                self.planner.cancel_task(task)
            self._cleanup(ctx)
            return (False, ctx, "CANCELLED", task)

        if not res.resolved or not res.selected_option:
            return (False, ctx, res.error_message or "UNRESOLVED_ANSWER", task)

        # Success resolution
        ctx.status = "RESOLVED"
        resolved_value = res.selected_option

        # Update associated TaskStep if present
        if task:
            step = None
            if ctx.step_id:
                step = next((s for s in task.steps if s.step_id == ctx.step_id), None)
            if not step and task.steps:
                step = next((s for s in task.steps if s.state == TaskStepState.PENDING), None)

            if step:
                step.arguments[ctx.missing_information] = resolved_value
                step.state = TaskStepState.PENDING  # Ready for ExecutionCoordinator resume

            # Transition task back to READY/RUNNING state for execution coordinator
            if task.state == TaskState.WAITING:
                TaskStateMachine.transition(task, TaskState.RUNNING)

        self._cleanup(ctx)
        return (True, ctx, resolved_value, task)

    def _cleanup(self, ctx: ClarificationContext) -> None:
        """Removes resolved/cancelled clarification from active tracking maps."""
        if ctx.clarification_id in self._active_clarifications:
            del self._active_clarifications[ctx.clarification_id]
        if ctx.task_id and ctx.task_id in self._task_clarification_map:
            del self._task_clarification_map[ctx.task_id]
