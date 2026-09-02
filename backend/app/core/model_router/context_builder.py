from typing import Optional, Dict, Any
from app.core.logging import logger
from app.core.contracts import JarvisRequest, UnderstandingResult, DecisionResult, DecisionStrategy
from app.core.model_router.contracts import (
    ModelSelectionContext,
    TaskComplexity,
    InteractionChannel,
)


class ModelSelectionContextBuilder:
    """Builds a canonical ModelSelectionContext from actual JARVIS Request, Understanding, and Decision objects."""

    @staticmethod
    def build(
        request: JarvisRequest,
        understanding: UnderstandingResult,
        decision: DecisionResult,
    ) -> ModelSelectionContext:
        entities = understanding.entities or {}

        # 1. Interaction Channel
        is_voice = (
            getattr(request.input_channel, "value", str(request.input_channel)).lower() == "voice"
            or getattr(request, "channel", "").lower() == "voice"
        )
        channel = InteractionChannel.VOICE if is_voice else InteractionChannel.CHAT

        # 2. Task Domain & Capabilities
        intent_upper = (understanding.intent or "").strip().upper()
        domain = entities.get("domain", "").lower()

        requires_coding = (
            intent_upper in ("CODING_TASK", "WRITE_CODE", "DEBUG_CODE", "IMPLEMENT_FEATURE")
            or bool(entities.get("requires_coding"))
            or domain == "coding"
        )
        requires_reasoning = (
            intent_upper in ("DEEP_REASONING", "LOGIC_PUZZLE", "MATH_REASONING", "COMPLEX_ANALYSIS")
            or bool(entities.get("requires_reasoning"))
            or domain == "reasoning"
        )
        requires_tool = (
            decision.strategy == DecisionStrategy.TOOL_CALL
            or intent_upper in (
                "FILESYSTEM_SEARCH",
                "FILESYSTEM_READ",
                "FILESYSTEM_EDIT",
                "LOCATION",
                "MAPS_DIRECTIONS",
                "TERMINAL_ACTION",
                "QUERY_LIVE_DESKTOP_STATE",
                "WATCH_WINDOW",
                "WATCH_CONDITION",
            )
            or bool(entities.get("requires_tool_calling"))
        )
        requires_vision = (
            intent_upper in ("SCREEN_UNDERSTANDING", "VISION_TASK")
            or bool(entities.get("requires_vision"))
        )

        # 3. Complexity mapping (Voice does NOT override task complexity)
        if requires_reasoning or intent_upper == "DEEP_REASONING" or entities.get("complexity") == "complex":
            complexity = TaskComplexity.DEEP_REASONING
        elif decision.strategy == DecisionStrategy.COMPLEX_TASK or intent_upper in ("MULTI_STEP", "COMPLEX_TASK"):
            complexity = TaskComplexity.COMPLEX
        elif entities.get("complexity") == "simple" or intent_upper in ("GREETING", "FAST_PATH", "SIMPLE_QUERY"):
            complexity = TaskComplexity.SIMPLE
        else:
            complexity = TaskComplexity.NORMAL

        req_tokens = int(entities.get("context_length", 4096))
        requires_long_ctx = bool(entities.get("requires_long_context")) or req_tokens > 32000

        latency_sens = is_voice or bool(entities.get("latency_sensitive")) or complexity == TaskComplexity.SIMPLE
        quality_prio = bool(entities.get("quality_priority")) or complexity in (TaskComplexity.DEEP_REASONING, TaskComplexity.COMPLEX)

        logger.info(
            f"[MODEL CONTEXT] channel={channel.value} complexity={complexity.value} "
            f"knowledge={intent_upper in ('KNOWLEDGE_QUERY', 'GENERAL_CHAT')} "
            f"reasoning={requires_reasoning} coding={requires_coding} tool={requires_tool}"
        )

        return ModelSelectionContext(
            channel=channel,
            complexity=complexity,
            intent=understanding.intent,
            requires_tool_calling=requires_tool,
            requires_vision=requires_vision,
            requires_coding=requires_coding,
            requires_reasoning=requires_reasoning,
            requires_long_context=requires_long_ctx,
            required_context_tokens=req_tokens,
            latency_sensitive=latency_sens,
            quality_priority=quality_prio,
            streaming_required=True,
            metadata={
                "request_id": request.request_id,
                "turn_id": request.turn_id,
                "strategy": decision.strategy.value if decision.strategy else "unknown",
            },
        )
