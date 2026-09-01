from typing import Dict, Any, Optional
from app.core.contracts import UnderstandingResult, TargetDevice
from app.brain.intent_schema import IntentItem, IntentPlan


class UnderstandingAdapter:
    """Adapter to convert legacy intent items/plans and command matches into canonical UnderstandingResult objects."""

    @staticmethod
    def from_intent_item(
        item: IntentItem,
        target_device: TargetDevice = TargetDevice.CURRENT,
    ) -> UnderstandingResult:
        return UnderstandingResult(
            intent=item.domain.value if hasattr(item.domain, "value") else str(item.domain),
            entities=item.entities,
            target_device=target_device,
            confidence=item.confidence,
            ambiguity=False,
            requires_clarification=False,
        )

    @staticmethod
    def from_intent_plan(
        plan: IntentPlan,
        target_device: TargetDevice = TargetDevice.CURRENT,
    ) -> UnderstandingResult:
        if not plan.intents:
            return UnderstandingResult(
                intent="UNKNOWN",
                target_device=target_device,
                confidence=0.0,
                ambiguity=True,
            )
        primary_intent = plan.intents[0]
        return UnderstandingResult(
            intent=primary_intent.domain.value if hasattr(primary_intent.domain, "value") else str(primary_intent.domain),
            entities=primary_intent.entities,
            target_device=target_device,
            confidence=primary_intent.confidence,
            ambiguity=len(plan.intents) > 1,
            requires_clarification=False,
        )

    @staticmethod
    def from_command_match(
        command_type: str,
        entities: Optional[Dict[str, Any]] = None,
        confidence: float = 1.0,
        target_device: TargetDevice = TargetDevice.CURRENT,
    ) -> UnderstandingResult:
        return UnderstandingResult(
            intent=command_type.upper(),
            entities=entities or {},
            target_device=target_device,
            confidence=confidence,
            ambiguity=False,
            requires_clarification=False,
        )
