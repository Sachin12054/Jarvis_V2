import asyncio
from typing import Optional, Dict, Any
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    DecisionStrategy,
    ExecutionResult,
    VerificationResult,
    JarvisResponse,
    ResponseType,
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
)
from app.core.understanding import UnderstandingPipeline
from app.core.decision import DecisionGate
from app.core.execution import DirectActionExecutor
from app.core.knowledge import KnowledgeHandler
from app.core.tools import ToolHandler
from app.core.brain import TaskPlanner, TaskExecutionCoordinator
from app.core.brain.task_aggregator import TaskAggregator
from app.core.interaction import ClarificationManager
from app.core.model_router import (
    CanonicalModelRouter,
    ModelSelectionContextBuilder,
)


class JarvisCoreOrchestrator:
    """Unified Core Orchestrator for JARVIS V2.

    Coordinates the canonical pipeline:
    JarvisRequest -> UnderstandingPipeline -> DecisionGate -> ModelRouter -> Handlers/TaskBrain/Clarification -> JarvisResponse

    Contains zero direct infrastructure dependencies (no Ollama, Whisper, Kokoro, FastAPI, CUA Driver).
    """

    def __init__(
        self,
        executor: Optional[DirectActionExecutor] = None,
        knowledge_handler: Optional[KnowledgeHandler] = None,
        tool_handler: Optional[ToolHandler] = None,
        task_coordinator: Optional[TaskExecutionCoordinator] = None,
        clarification_manager: Optional[ClarificationManager] = None,
        planner: Optional[TaskPlanner] = None,
        model_router: Optional[CanonicalModelRouter] = None,
    ):
        self._executor = executor or DirectActionExecutor()
        self._knowledge_handler = knowledge_handler or KnowledgeHandler()
        self._tool_handler = tool_handler or ToolHandler()
        self._planner = planner or TaskPlanner()
        self._task_coordinator = task_coordinator or TaskExecutionCoordinator(planner=self._planner)
        self._clarification_manager = clarification_manager or ClarificationManager(planner=self._planner)
        self._model_router = model_router or CanonicalModelRouter()

    async def process_request(
        self,
        request: JarvisRequest,
        cancel_event: Optional[asyncio.Event] = None,
        event_callback: Optional[Any] = None,
        **kwargs,
    ) -> JarvisResponse:
        """Processes a canonical JarvisRequest through the core architecture pipeline."""

        # 0. Check for Active Pending Clarification
        pending_clarification = self._clarification_manager.get_pending_clarification(
            request_id=request.request_id,
            turn_id=request.turn_id,
        )

        if pending_clarification:
            success, ctx, resolved_val, task = self._clarification_manager.process_answer(
                user_answer=request.raw_input,
                clarification_id=pending_clarification.clarification_id,
                request_id=request.request_id,
                turn_id=request.turn_id,
            )

            if not success:
                if resolved_val == "CANCELLED":
                    return JarvisResponse(
                        request_id=request.request_id,
                        turn_id=request.turn_id,
                        message="Interaction cancelled by user.",
                        response_type=ResponseType.TEXT,
                        should_speak=request.input_channel.value == "voice",
                        should_display=True,
                        metadata={"conversation_id": request.conversation_id},
                    )
                return JarvisResponse(
                    request_id=request.request_id,
                    turn_id=request.turn_id,
                    message=f"Could not resolve clarification: {resolved_val}",
                    response_type=ResponseType.CLARIFICATION,
                    should_speak=request.input_channel.value == "voice",
                    should_display=True,
                    metadata={"conversation_id": request.conversation_id},
                )

            if task:
                executed_task = await self._task_coordinator.execute_task(task, cancel_event=cancel_event)
                return self._build_task_response(request, executed_task)

        # 1. Understanding Pipeline
        understanding: UnderstandingResult = UnderstandingPipeline.process(request)

        # 2. Decision Gate
        decision: DecisionResult = DecisionGate.evaluate(request, understanding)

        # 3. Handle DIRECT_ACTION Strategy (Fast-path: bypasses ModelRouter completely)
        if decision.strategy == DecisionStrategy.DIRECT_ACTION:
            context: Dict[str, Any] = {
                "request_id": request.request_id,
                "turn_id": request.turn_id,
                "application": understanding.entities.get("application"),
                "target": understanding.entities.get("raw_target"),
                "target_device": request.target_device.value,
            }
            exec_res, ver_res = await self._executor.execute(decision, context=context)

            msg = f"Executed direct action {understanding.intent}."
            if exec_res.success:
                app_name = understanding.entities.get("application") or understanding.entities.get("raw_target") or "Application"
                msg = f"{app_name} is now open and focused." if "OPEN" in understanding.intent else f"Action {understanding.intent} completed."
            elif exec_res.error_message:
                msg = f"Failed to execute {understanding.intent}: {exec_res.error_message}"

            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=msg,
                response_type=ResponseType.ACTION if exec_res.success else ResponseType.ERROR,
                execution_result=exec_res,
                verification_result=ver_res,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={"strategy": decision.strategy.value, "decision_id": decision.decision_id, "conversation_id": request.conversation_id},
                error=exec_res.error_message if not exec_res.success else None,
            )

        # 4. Canonical Model Routing for Cognitive Workload Strategies
        if decision.strategy in (
            DecisionStrategy.KNOWLEDGE_QUERY,
            DecisionStrategy.TOOL_CALL,
            DecisionStrategy.COMPLEX_TASK,
        ):
            sel_ctx = ModelSelectionContextBuilder.build(request, understanding, decision)
            route = self._model_router.route(sel_ctx)

            if not route.is_satisfied:
                return JarvisResponse(
                    request_id=request.request_id,
                    turn_id=request.turn_id,
                    message=f"Model routing failure: {route.reason}",
                    response_type=ResponseType.ERROR,
                    error=route.reason,
                    should_speak=request.input_channel.value == "voice",
                    should_display=True,
                    metadata={"strategy": decision.strategy.value, "conversation_id": request.conversation_id},
                )

            decision.selected_model = route.selected_model
            decision.fallbacks = route.fallbacks

        # 5. Handle KNOWLEDGE_QUERY Strategy
        if decision.strategy == DecisionStrategy.KNOWLEDGE_QUERY:
            resp = await self._knowledge_handler.handle_knowledge_query(
                request=request,
                understanding=understanding,
                decision=decision,
                cancel_event=cancel_event,
            )
            resp.metadata["conversation_id"] = request.conversation_id
            return resp

        # 6. Handle TOOL_CALL Strategy
        if decision.strategy == DecisionStrategy.TOOL_CALL:
            resp = await self._tool_handler.handle_tool_call(
                request=request,
                understanding=understanding,
                decision=decision,
            )
            resp.metadata["conversation_id"] = request.conversation_id
            return resp

        # 7. Handle CLARIFICATION Strategy
        if decision.strategy == DecisionStrategy.CLARIFICATION:
            missing_info = understanding.entities.get("missing_information", "target") if understanding.entities else "target"
            options = understanding.entities.get("options", []) if understanding.entities else []
            question = decision.reason or understanding.clarification_reason or f"Could you please specify the {missing_info}?"

            ctx = self._clarification_manager.create_clarification(
                request=request,
                question=question,
                missing_information=missing_info,
                candidate_options=options,
                decision=decision,
                understanding=understanding,
            )

            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=ctx.question,
                response_type=ResponseType.CLARIFICATION,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={"strategy": decision.strategy.value, "decision_id": decision.decision_id, "clarification_id": ctx.clarification_id, "conversation_id": request.conversation_id},
            )

        # 8. Handle CANCEL Strategy
        if decision.strategy == DecisionStrategy.CANCEL:
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message="Turn cancelled.",
                response_type=ResponseType.TEXT,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={"strategy": decision.strategy.value, "decision_id": decision.decision_id, "conversation_id": request.conversation_id},
            )

        # 9. Handle COMPLEX_TASK Strategy
        if decision.strategy == DecisionStrategy.COMPLEX_TASK:
            subtasks = understanding.entities.get("subtasks") if understanding.entities else None
            task = self._planner.decompose_complex_request(request, custom_subtasks=subtasks)

            async def _subtask_model_executor(step: TaskStep, ctx: Dict[str, Any]) -> str:
                # Execute subtask using per-subtask assigned model from BaselineAdaptivePolicy
                sub_req = JarvisRequest(
                    conversation_id=request.conversation_id,
                    request_id=request.request_id,
                    turn_id=request.turn_id,
                    raw_input=step.description,
                    input_channel=request.input_channel,
                )
                sub_und = UnderstandingResult(
                    intent="KNOWLEDGE_QUERY" if "code" not in step.capability.lower() else "CODING_TASK",
                    confidence=1.0,
                    entities={"prompt": step.description},
                )
                sub_dec = DecisionResult(
                    decision_id=f"dec_{step.step_id}",
                    strategy=DecisionStrategy.KNOWLEDGE_QUERY,
                    selected_model=step.assigned_model or "qwen3-test:latest",
                    reason=f"Subtask execution via {step.assigned_model}",
                )

                resp = await self._knowledge_handler.handle_knowledge_query(
                    request=sub_req,
                    understanding=sub_und,
                    decision=sub_dec,
                    cancel_event=cancel_event,
                )
                return resp.message

            executed_task = await self._task_coordinator.execute_task_dag(
                task,
                cancel_event=cancel_event,
                event_callback=kwargs.get("event_callback"),
                step_executor=_subtask_model_executor,
            )
            return self._build_task_response(request, executed_task)

        # 10. Handle NO_OP / Default Strategy
        return JarvisResponse(
            request_id=request.request_id,
            turn_id=request.turn_id,
            message="No action required.",
            response_type=ResponseType.TEXT,
            should_speak=False,
            should_display=True,
            metadata={"strategy": decision.strategy.value, "decision_id": decision.decision_id, "conversation_id": request.conversation_id},
        )

    def _build_task_response(self, request: JarvisRequest, task: Task) -> JarvisResponse:
        """Constructs a JarvisResponse from an executed Task."""
        if task.state == TaskState.WAITING:
            last_step = next((s for s in task.steps if s.step_id == task.current_step_id), None)
            missing_info = "target"
            options = []
            if last_step and last_step.result and last_step.result.evidence:
                missing_info = last_step.result.evidence.get("missing_information", "target")
                options = last_step.result.evidence.get("candidate_options", [])

            q_text = self._clarification_manager.generate_question(missing_info, options)
            ctx = self._clarification_manager.create_clarification(
                request=request,
                question=q_text,
                missing_information=missing_info,
                candidate_options=options,
                task=task,
                step=last_step,
            )
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=ctx.question,
                response_type=ResponseType.CLARIFICATION,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={"task_id": task.task_id, "clarification_id": ctx.clarification_id, "conversation_id": request.conversation_id},
            )

        if task.state == TaskState.COMPLETED:
            last_step = task.steps[-1] if task.steps else None
            exec_res = last_step.result if last_step else None
            ver_res = last_step.verification if last_step else None
            synth_message = TaskAggregator().aggregate_results(task)

            subtask_telemetry = [
                {
                    "step_id": s.step_id,
                    "description": s.description,
                    "assigned_model": s.assigned_model,
                    "shadow_model": s.shadow_model,
                    "shadow_confidence": s.shadow_confidence,
                    "start_time": s.start_time,
                    "completion_time": s.completion_time,
                    "duration_ms": s.duration_ms,
                    "state": s.state.value,
                }
                for s in task.steps
            ]

            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=synth_message,
                response_type=ResponseType.ACTION,
                execution_result=exec_res,
                verification_result=ver_res,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={
                    "task_id": task.task_id,
                    "state": task.state.value,
                    "conversation_id": request.conversation_id,
                    "subtasks": subtask_telemetry,
                },
            )

        err_msg = task.metadata.get("error") or f"Task execution finished in state {task.state.value}."
        return JarvisResponse(
            request_id=request.request_id,
            turn_id=request.turn_id,
            message=err_msg,
            response_type=ResponseType.ERROR if task.state == TaskState.FAILED else ResponseType.TEXT,
            should_speak=request.input_channel.value == "voice",
            should_display=True,
            metadata={"task_id": task.task_id, "state": task.state.value, "conversation_id": request.conversation_id},
            error=err_msg if task.state == TaskState.FAILED else None,
        )
