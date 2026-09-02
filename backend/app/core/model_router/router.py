from typing import List, Optional, Protocol
from app.core.logging import logger
from app.core.model_router.contracts import (
    ModelSelectionContext,
    ModelProfile,
    ModelRoute,
    ModelCapability,
    TaskComplexity,
    InteractionChannel,
)
from app.core.model_router.registry import ModelRegistry


class ModelAvailabilityProvider(Protocol):
    """Protocol for optional runtime availability checking."""
    def is_model_available(self, model_id: str) -> bool:
        ...


class CanonicalModelRouter:
    """Canonical Model Router for JARVIS.

    Intelligently selects candidate LLM models based on task characteristics,
    hard capability requirements, soft preference scoring, and fallback eligibility.
    Contains zero direct infrastructure dependencies (no Ollama HTTP calls inside core router).
    """

    def __init__(
        self,
        registry: Optional[ModelRegistry] = None,
        availability_provider: Optional[ModelAvailabilityProvider] = None,
    ):
        self.registry = registry or ModelRegistry()
        self.availability_provider = availability_provider

    def route(self, context: ModelSelectionContext) -> ModelRoute:
        """Determines the optimal ModelRoute for a given ModelSelectionContext."""
        all_models = self.registry.list_models(enabled_only=True)
        if not all_models:
            return ModelRoute(
                selected_model="",
                provider="",
                fallbacks=[],
                reason="No models registered or enabled in registry",
                score=0.0,
                is_satisfied=False,
                context=context,
            )

        # Step 1: Hard Requirements Filtering
        valid_candidates: List[ModelProfile] = []
        rejection_reasons: List[str] = []

        for model in all_models:
            # Tool calling requirement
            if context.requires_tool_calling and not (
                model.has_tool_calling or ModelCapability.TOOL_CALLING in model.capabilities
            ):
                rejection_reasons.append(f"{model.model_id}: lacks tool calling capability")
                continue

            # Vision requirement
            if context.requires_vision and not (
                model.has_vision or ModelCapability.VISION in model.capabilities
            ):
                rejection_reasons.append(f"{model.model_id}: lacks vision capability")
                continue

            # Context size requirement
            if context.required_context_tokens > model.context_window:
                rejection_reasons.append(
                    f"{model.model_id}: window {model.context_window} < required {context.required_context_tokens}"
                )
                continue

            # Coding requirement
            if context.requires_coding and not (
                model.coding_score >= 0.5 or ModelCapability.CODING in model.capabilities
            ):
                rejection_reasons.append(f"{model.model_id}: insufficient coding capability")
                continue

            # Reasoning requirement
            if context.requires_reasoning and not (
                model.reasoning_score >= 0.5 or ModelCapability.REASONING in model.capabilities
            ):
                rejection_reasons.append(f"{model.model_id}: insufficient reasoning capability")
                continue

            # Long-context requirement
            if context.requires_long_context and not (
                model.context_window >= 65536 or ModelCapability.LONG_CONTEXT in model.capabilities
            ):
                rejection_reasons.append(f"{model.model_id}: lacks long-context capability")
                continue

            # Runtime availability filter (if availability_provider is supplied)
            if self.availability_provider is not None:
                if not self.availability_provider.is_model_available(model.model_id):
                    rejection_reasons.append(f"{model.model_id}: runtime reports model unavailable")
                    continue

            valid_candidates.append(model)

        if not valid_candidates:
            reason_str = f"No candidate model satisfied hard requirements. ({'; '.join(rejection_reasons)})"
            logger.warning(f"[CanonicalModelRouter] Routing failure: {reason_str}")
            return ModelRoute(
                selected_model="",
                provider="",
                fallbacks=[],
                reason=reason_str,
                score=0.0,
                is_satisfied=False,
                context=context,
            )

        # Step 2: Deterministic Soft Preference Scoring
        scored_candidates = []
        for model in valid_candidates:
            score = self._compute_score(model, context)
            scored_candidates.append((score, model))

        # Sort descending by score, tie-break alphabetically by model_id for strict determinism
        scored_candidates.sort(key=lambda item: (item[0], -ord(item[1].model_id[0]) if item[1].model_id else 0), reverse=True)

        primary_model = scored_candidates[0][1]
        primary_score = scored_candidates[0][0]

        fallbacks = [
            m[1].model_id for m in scored_candidates[1:] if m[1].fallback_eligible
        ]

        route_reason = (
            f"Selected '{primary_model.model_id}' (score={primary_score:.1f}) for "
            f"channel={context.channel.value}, complexity={context.complexity.value}"
        )
        logger.info(f"[CanonicalModelRouter] {route_reason}")

        return ModelRoute(
            selected_model=primary_model.model_id,
            provider=primary_model.provider,
            fallbacks=fallbacks,
            reason=route_reason,
            score=primary_score,
            is_satisfied=True,
            context=context,
            selection_metadata={
                "primary_display_name": primary_model.display_name,
                "context_window": primary_model.context_window,
                "scored_candidates_count": len(scored_candidates),
            },
        )

    def _compute_score(self, model: ModelProfile, context: ModelSelectionContext) -> float:
        """Computes a deterministic preference score for a model candidate."""
        # Base priority score (priority 10 -> base 90, priority 20 -> base 80)
        score = max(0.0, 100.0 - model.priority)

        # 1. Capability Precedence Boosts
        if context.requires_coding:
            if model.coding_score >= 0.8 or ModelCapability.CODING in model.capabilities:
                score += model.coding_score * 150.0

        if context.requires_reasoning or context.complexity == TaskComplexity.DEEP_REASONING:
            if model.reasoning_score >= 0.8 or ModelCapability.REASONING in model.capabilities:
                score += model.reasoning_score * 150.0

        # 2. General Knowledge / Non-Coding & Non-Reasoning Preference
        if not context.requires_coding and not context.requires_reasoning:
            if model.general_score >= 0.7:
                score += model.general_score * 30.0
            # Penalize specialized coding models for general non-coding queries so fast TTFT doesn't defeat general models
            if model.coding_score >= 0.9 and model.general_score < 0.6:
                score -= 30.0

        # 3. Simple Task / Voice Latency Preference (Soft Preference, does NOT override domain capabilities)
        if context.channel == InteractionChannel.VOICE or context.latency_sensitive:
            # Apply latency preference if not a deep reasoning / coding task
            if not context.requires_coding and not context.requires_reasoning:
                if model.empirical_ttft_ms is not None:
                    if model.empirical_ttft_ms < 200.0:
                        score += 20.0
                    elif model.empirical_ttft_ms < 400.0:
                        score += 10.0
                elif model.latency_tier == "low":
                    score += 15.0

        if context.complexity == TaskComplexity.SIMPLE:
            if model.latency_tier == "low" or (model.empirical_ttft_ms and model.empirical_ttft_ms < 300.0):
                score += 10.0

        # 4. Long Context Preference
        if context.requires_long_context or context.required_context_tokens > 32000:
            if model.context_window >= 131072:
                score += 40.0

        # 5. Quality Priority Preference
        if context.quality_priority:
            score += (model.reasoning_score + model.general_score) * 20.0

        return round(score, 2)
