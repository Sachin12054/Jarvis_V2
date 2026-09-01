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
)
from app.core.understanding import UnderstandingPipeline
from app.core.decision import DecisionGate
from app.core.execution import DirectActionExecutor


class JarvisCoreOrchestrator:
    """Unified Core Orchestrator for JARVIS V2.

    Coordinates the canonical pipeline:
    JarvisRequest to UnderstandingPipeline to DecisionGate to DirectActionExecutor to JarvisResponse

    Contains zero direct infrastructure dependencies (no Ollama, Whisper, Kokoro, FastAPI, CUA Driver).
    """

    def __init__(self, executor: Optional[DirectActionExecutor] = None):
        self._executor = executor or DirectActionExecutor()

    async def process_request(self, request: JarvisRequest) -> JarvisResponse:
        """Processes a canonical JarvisRequest through the core architecture pipeline."""

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
                metadata={"strategy": decision.strategy.value, "decision_id": decision.decision_id},
                error=exec_res.error_message if not exec_res.success else None,
            )

        # 4. Handle CLARIFICATION Strategy
        if decision.strategy == DecisionStrategy.CLARIFICATION:
            reason = decision.reason or understanding.clarification_reason or "Could you please clarify your request?"
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=reason,
                response_type=ResponseType.CLARIFICATION,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={"strategy": decision.strategy.value, "decision_id": decision.decision_id},
            )

        # 5. Handle CANCEL Strategy
        if decision.strategy == DecisionStrategy.CANCEL:
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message="Turn cancelled.",
                response_type=ResponseType.TEXT,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={"strategy": decision.strategy.value, "decision_id": decision.decision_id},
            )

        # 6. Handle Non-Connected Strategies (KNOWLEDGE_QUERY, TOOL_CALL, COMPLEX_TASK, NO_OP)
        strategy_name = decision.strategy.value
        return JarvisResponse(
            request_id=request.request_id,
            turn_id=request.turn_id,
            message=f"Strategy {strategy_name} is not yet connected to an execution handler in Core Orchestrator V2.",
            response_type=ResponseType.TEXT,
            should_speak=False,
            should_display=True,
            metadata={"strategy": strategy_name, "decision_id": decision.decision_id, "intent": understanding.intent},
        )
