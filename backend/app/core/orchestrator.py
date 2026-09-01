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
from app.core.interaction import ClarificationManager


class JarvisCoreOrchestrator:
    """Unified Core Orchestrator for JARVIS V2.

    Coordinates the canonical pipeline:
    JarvisRequest to UnderstandingPipeline to DecisionGate to Handlers/TaskBrain/Clarification to JarvisResponse

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
    ):
        self._executor = executor or DirectActionExecutor()
        self._knowledge_handler = knowledge_handler or KnowledgeHandler()
        self._tool_handler = tool_handler or ToolHandler()
        self._planner = planner or TaskPlanner()
        self._task_coordinator = task_coordinator or TaskExecutionCoordinator(planner=self._planner)
        self._clarification_manager = clarification_manager or ClarificationManager(planner=self._planner)

    async def process_request(
        self,
        request: JarvisRequest,
        cancel_event: Optional[asyncio.Event] = None,
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

        # 3. Handle DIRECT_ACTION Strategy
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

        # 4. Handle KNOWLEDGE_QUERY Strategy
        if decision.strategy == DecisionStrategy.KNOWLEDGE_QUERY:
            resp = await self._knowledge_handler.handle_knowledge_query(
                request=request,
                understanding=understanding,
                decision=decision,
                cancel_event=cancel_event,
            )
            resp.metadata["conversation_id"] = request.conversation_id
            return resp

        # 5. Handle TOOL_CALL Strategy
        if decision.strategy == DecisionStrategy.TOOL_CALL:
            resp = await self._tool_handler.handle_tool_call(
                request=request,
                understanding=understanding,
                decision=decision,
            )
            resp.metadata["conversation_id"] = request.conversation_id
            return resp

        # 6. Handle CLARIFICATION Strategy
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

        # 7. Handle CANCEL Strategy
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

        # 8. Handle COMPLEX_TASK Strategy
        if decision.strategy == DecisionStrategy.COMPLEX_TASK:
            task = self._planner.create_task(request)
            capability = understanding.entities.get("capability") or request.raw_input
            step = TaskStep(
                task_id=task.task_id,
                description=request.raw_input,
                capability=capability,
                arguments=understanding.entities,
            )
            self._planner.plan_task(task, steps=[step])

            executed_task = await self._task_coordinator.execute_task(task, cancel_event=cancel_event)
            return self._build_task_response(request, executed_task)

        # 9. Handle NO_OP / Default Strategy
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

            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message="Task completed successfully.",
                response_type=ResponseType.ACTION,
                execution_result=exec_res,
                verification_result=ver_res,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={"task_id": task.task_id, "state": task.state.value, "conversation_id": request.conversation_id},
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
