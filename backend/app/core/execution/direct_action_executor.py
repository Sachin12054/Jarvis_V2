from typing import Tuple, Optional, Dict, Any
from app.core.contracts import (
    DecisionResult,
    DecisionStrategy,
    ExecutionResult,
    ExecutionStatus,
    VerificationResult,
)
from app.core.adapters import ExecutionAdapter, VerificationAdapter
from app.execution.computer_gateway import ComputerUseGateway, ActionResult


class DirectActionExecutor:
    """Canonical Direct Action Execution Engine.

    Consumes a DecisionResult and executes ONLY when DecisionResult.strategy == DIRECT_ACTION.
    All computer actions pass EXCLUSIVELY through ComputerUseGateway via CuaDriverClient.

    Non-direct strategies are safely rejected without invoking ComputerUseGateway.
    """

    def __init__(self, gateway: Optional[ComputerUseGateway] = None):
        self._gateway = gateway

    @property
    def gateway(self) -> ComputerUseGateway:
        if self._gateway is None:
            self._gateway = ComputerUseGateway.get_instance()
        return self._gateway

    async def execute(
        self,
        decision: DecisionResult,
        context: Optional[Dict[str, Any]] = None,
    ) -> Tuple[ExecutionResult, VerificationResult]:
        """Executes a DIRECT_ACTION DecisionResult and returns canonical ExecutionResult and VerificationResult."""
        context = context or {}

        # 1. Safety Check: Reject non-DIRECT_ACTION strategies
        if decision.strategy != DecisionStrategy.DIRECT_ACTION:
            exec_res = ExecutionResult(
                action_type=str(decision.selected_tool or decision.strategy.value),
                target=str(context.get("target") or ""),
                status=ExecutionStatus.CANCELLED if decision.strategy == DecisionStrategy.CANCEL else ExecutionStatus.FAILED,
                success=False,
                error_code="STRATEGY_REJECTED",
                error_message=f"DirectActionExecutor rejected non-direct strategy {decision.strategy.value}",
            )
            ver_res = VerificationResult(
                verified=False,
                status="REJECTED",
                confidence=1.0,
                verification_method="POLICY_GATE",
                error_code="NON_DIRECT_STRATEGY",
                details=f"Strategy {decision.strategy.value} is not executable by DirectActionExecutor",
            )
            return exec_res, ver_res

        # 2. Dispatch Direct Action based on selected_tool or decision reason
        selected_tool = (decision.selected_tool or "").lower()
        reason_str = (decision.reason or "").lower()
        target_app = str(context.get("application") or context.get("target") or "Notepad")

        action_result: ActionResult

        if selected_tool == "launch_app" or "open" in reason_str or "launch" in reason_str:
            action_result = await self.gateway.focus_window(target_app)
        elif selected_tool == "close_app" or "close" in reason_str:
            if "tab" in target_app.lower():
                action_result = await self.gateway.browser_close_tab()
            else:
                action_result = await self.gateway.hotkey(["alt", "f4"])
        elif selected_tool == "stop" or "stop" in reason_str:
            action_result = ActionResult(
                requested_action="stop",
                executed=True,
                verified=True,
                evidence={"message": "Playback or turn stop event triggered"},
            )
        elif selected_tool == "pause" or "pause" in reason_str:
            action_result = await self.gateway.pause_video()
        elif selected_tool == "resume" or "resume" in reason_str:
            action_result = await self.gateway.resume_video()
        elif selected_tool == "focus_window":
            action_result = await self.gateway.focus_window(target_app)
        else:
            action_result = await self.gateway.focus_window(target_app)

        # 3. Adapt ActionResult to ExecutionResult and VerificationResult using M1.2 adapters
        execution_res = ExecutionAdapter.from_action_result(action_result, action_type=action_result.requested_action)
        verification_res = VerificationAdapter.from_action_result_verification(action_result)

        return execution_res, verification_res
