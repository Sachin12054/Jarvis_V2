import time
import math
from typing import Dict, Any, Optional, Tuple, List
from app.core.logging import logger
from app.core.model_router.contracts import (
    ModelSelectionContext,
    ModelRoute,
    TaskComplexity,
)
from app.core.model_router.router import CanonicalModelRouter


class RLContextualBanditShadow:
    """RL Contextual Bandit Policy operating strictly in SHADOW MODE.

    Computes non-authoritative model recommendations based on task context features
    (e.g., complexity, token estimate, required capabilities, channel) without altering
    production routing decisions.
    """

    def __init__(self):
        # Feature weights for candidate models in shadow mode
        self._weights: Dict[str, List[float]] = {
            "qwen3-test:latest": [1.0, 0.5, 0.2, 0.9],
            "qwen-coder-3b:latest": [0.2, 1.2, 0.1, 0.4],
            "deepseek-r1-7b:latest": [0.3, 0.4, 1.5, 0.3],
        }

    def predict_shadow_route(self, context: ModelSelectionContext) -> Dict[str, Any]:
        """Generates a shadow model recommendation and confidence score."""
        # Extract numerical feature vector [bias, coding_req, reasoning_req, voice_channel]
        f_coding = 1.0 if context.requires_coding else 0.0
        f_reasoning = 1.0 if (context.requires_reasoning or context.complexity == TaskComplexity.DEEP_REASONING) else 0.0
        f_voice = 1.0 if context.latency_sensitive else 0.0
        features = [1.0, f_coding, f_reasoning, f_voice]

        scores: Dict[str, float] = {}
        for model_id, weights in self._weights.items():
            dot = sum(w * f for w, f in zip(weights, features))
            scores[model_id] = dot

        best_model = max(scores, key=scores.get)
        max_score = scores[best_model]
        exp_sum = sum(math.exp(s - max_score) for s in scores.values())
        confidence = math.exp(0) / exp_sum if exp_sum > 0 else 0.33

        return {
            "shadow_model_id": best_model,
            "shadow_confidence": round(confidence, 3),
            "shadow_scores": {m: round(s, 2) for m, s in scores.items()},
            "policy_type": "RL_CONTEXTUAL_BANDIT_SHADOW",
            "authoritative": False,
        }


class BaselineAdaptivePolicy:
    """Production Routing Authority for JARVIS V2 Model Router.

    Combines CanonicalModelRouter for production model selection with an attached
    RLContextualBanditShadow for parallel shadow telemetry.
    """

    def __init__(self, canonical_router: Optional[CanonicalModelRouter] = None):
        self.router = canonical_router or CanonicalModelRouter()
        self.shadow_bandit = RLContextualBanditShadow()

    def select_route(self, context: ModelSelectionContext) -> ModelRoute:
        """Selects production ModelRoute via CanonicalModelRouter and attaches shadow RL metadata."""
        # 1. Production Model Selection (Baseline Adaptive Authority)
        production_route: ModelRoute = self.router.route(context)

        # 2. Shadow RL Recommendation (SHADOW ONLY - non-authoritative)
        shadow_result = self.shadow_bandit.predict_shadow_route(context)

        # Attach shadow telemetry to selection_metadata without modifying production route
        production_route.selection_metadata["shadow_recommendation"] = shadow_result
        production_route.selection_metadata["production_policy"] = "BASELINE_ADAPTIVE_POLICY"

        logger.info(
            f"[ROUTER POLICY] production_model='{production_route.selected_model}' "
            f"shadow_recommendation='{shadow_result['shadow_model_id']}' "
            f"shadow_confidence={shadow_result['shadow_confidence']}"
        )

        return production_route
