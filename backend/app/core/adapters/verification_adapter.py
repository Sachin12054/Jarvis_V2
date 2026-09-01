from typing import Dict, Any, Optional
from app.core.contracts import VerificationResult
from app.execution.computer_gateway import ActionResult


class VerificationAdapter:
    """Adapter to extract and format verification outcomes into canonical VerificationResult objects."""

    @staticmethod
    def from_action_result_verification(
        action_res: ActionResult,
        verification_method: str = "CUA_DESKTOP_STATE",
    ) -> VerificationResult:
        return VerificationResult(
            verified=action_res.verified,
            status="SUCCESS" if action_res.verified else ("FAILED" if action_res.error else "UNVERIFIED"),
            evidence=action_res.evidence,
            confidence=1.0 if action_res.verified else 0.5,
            verification_method=verification_method,
            error_code="UNVERIFIED_ACTION" if not action_res.verified and not action_res.error else None,
            details=action_res.error,
        )

    @staticmethod
    def from_evidence(
        verified: bool,
        status: str,
        evidence: Optional[Dict[str, Any]] = None,
        method: Optional[str] = None,
        error_code: Optional[str] = None,
    ) -> VerificationResult:
        return VerificationResult(
            verified=verified,
            status=status,
            evidence=evidence or {},
            confidence=1.0 if verified else 0.5,
            verification_method=method or "CUSTOM",
            error_code=error_code,
        )
