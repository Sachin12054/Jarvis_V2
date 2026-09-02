from typing import Optional
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    DecisionStrategy,
)


class DecisionGate:
    """Deterministic, infrastructure-independent Decision Gate.

    Classifies a request + understanding result into a canonical DecisionStrategy
    without making network calls, invoking LLMs, executing desktop actions, or
    accessing external hardware.
    """

    DIRECT_ACTION_INTENTS = {
        "OPEN_APPLICATION",
        "CLOSE_APPLICATION",
        "FOCUS_WINDOW",
        "DESKTOP_ACTION",
        "STOP",
        "PAUSE",
        "RESUME",
    }

    TOOL_CALL_INTENTS = {
        "FILESYSTEM_SEARCH",
        "FILESYSTEM_READ",
        "FILESYSTEM_EDIT",
        "LOCATION",
        "MAPS_DIRECTIONS",
        "TERMINAL_ACTION",
        "QUERY_LIVE_DESKTOP_STATE",
        "WATCH_WINDOW",
        "WATCH_CONDITION",
    }

    KNOWLEDGE_QUERY_INTENTS = {
        "KNOWLEDGE_QUERY",
        "GENERAL_CHAT",
        "CODING_TASK",
        "DEEP_REASONING",
        "SYSTEM_METRICS",
        "SYSTEM_STATUS",
        "OLLAMA_STATUS",
        "PROFILE_IDENTITY",
        "PROFILE_EDUCATION",
        "PROFILE_PROJECTS",
        "PROFILE_INTERESTS",
        "PROFILE_CAREER",
    }

    COMPLEX_TASK_INTENTS = {
        "COMPLEX_TASK",
        "MULTI_STEP",
    }

    CONFIDENCE_THRESHOLD = 0.60

    @classmethod
    def evaluate(
        cls,
        request: JarvisRequest,
        understanding: UnderstandingResult,
    ) -> DecisionResult:
        """Evaluates JarvisRequest and UnderstandingResult to produce a DecisionResult."""
        intent_upper = (understanding.intent or "").strip().upper()

        # 1. Safety Check: Ambiguity or Low Confidence
        if (
            understanding.ambiguity
            or understanding.requires_clarification
            or understanding.confidence < cls.CONFIDENCE_THRESHOLD
        ):
            return DecisionResult(
                strategy=DecisionStrategy.CLARIFICATION,
                confidence=understanding.confidence,
                reason=understanding.clarification_reason or f"Request understanding is ambiguous or low confidence ({understanding.confidence:.2f})",
                requires_clarification=True,
            )

        # 2. Explicit Cancellation Intent
        if intent_upper in ("CANCEL", "ABORT"):
            return DecisionResult(
                strategy=DecisionStrategy.CANCEL,
                confidence=understanding.confidence,
                reason="User explicitly requested turn cancellation",
            )

        # 3. Direct Actions (Fast-path desktop / app actions)
        if intent_upper in cls.DIRECT_ACTION_INTENTS:
            selected_app = understanding.entities.get("application") or understanding.entities.get("target")
            return DecisionResult(
                strategy=DecisionStrategy.DIRECT_ACTION,
                confidence=understanding.confidence,
                reason=f"Direct action intent {intent_upper} classified for execution",
                selected_tool="launch_app" if intent_upper == "OPEN_APPLICATION" else "desktop_action",
            )

        # 4. Tool Calls
        if intent_upper in cls.TOOL_CALL_INTENTS:
            return DecisionResult(
                strategy=DecisionStrategy.TOOL_CALL,
                confidence=understanding.confidence,
                reason=f"Tool call intent {intent_upper} classified",
                selected_tool=understanding.entities.get("tool_name"),
            )

        # 5. Knowledge Queries
        if intent_upper in cls.KNOWLEDGE_QUERY_INTENTS:
            return DecisionResult(
                strategy=DecisionStrategy.KNOWLEDGE_QUERY,
                confidence=understanding.confidence,
                reason=f"Knowledge query intent {intent_upper} classified",
                selected_model="qwen3-test:latest",
            )

        # 6. Complex Multi-Step Tasks
        if intent_upper in cls.COMPLEX_TASK_INTENTS:
            return DecisionResult(
                strategy=DecisionStrategy.COMPLEX_TASK,
                confidence=understanding.confidence,
                reason=f"Complex task intent {intent_upper} classified",
                selected_model="qwen3-test:latest",
            )

        # 7. Default Fallback: Knowledge Query for general text, or NO_OP if empty
        if not intent_upper or intent_upper == "UNKNOWN":
            return DecisionResult(
                strategy=DecisionStrategy.NO_OP,
                confidence=0.0,
                reason="No recognized intent provided",
                requires_clarification=True,
            )

        return DecisionResult(
            strategy=DecisionStrategy.KNOWLEDGE_QUERY,
            confidence=understanding.confidence,
            reason=f"General conversational query with intent {intent_upper}",
            selected_model="qwen3-test:latest",
        )
