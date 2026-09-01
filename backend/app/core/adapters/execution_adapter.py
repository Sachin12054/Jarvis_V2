from typing import Optional
from app.core.contracts import ExecutionResult, ExecutionStatus
from app.execution.computer_gateway import ActionResult


class ExecutionAdapter:
    """Adapter to convert legacy CUA ActionResult and action dictionaries into canonical ExecutionResult objects."""

    @staticmethod
    def from_action_result(
        action_res: ActionResult,
        action_type: Optional[str] = None,
        duration_ms: float = 0.0,
    ) -> ExecutionResult:
        status = ExecutionStatus.REQUESTED
        if action_res.verified:
            status = ExecutionStatus.VERIFIED
        elif action_res.executed:
            status = ExecutionStatus.EXECUTED
        elif action_res.attempted:
            status = ExecutionStatus.STARTED
        if action_res.error:
            status = ExecutionStatus.FAILED

        error_code = None
        if action_res.error:
            err_upper = action_res.error.upper()
            if "DAEMON" in err_upper or "PIPE" in err_upper:
                error_code = "DAEMON_UNAVAILABLE"
            elif "TIMEOUT" in err_upper:
                error_code = "TIMEOUT"
            elif "TOOL" in err_upper:
                error_code = "CUA_TOOL_ERROR"
            else:
                error_code = "SUBPROCESS_EXECUTION_ERROR"

        return ExecutionResult(
            action_type=action_type or action_res.requested_action,
            target=str(action_res.evidence.get("target") or action_res.evidence.get("app_name") or ""),
            status=status,
            success=action_res.executed and not action_res.error,
            evidence=action_res.evidence,
            error_code=error_code,
            error_message=action_res.error,
            duration_ms=duration_ms,
        )
