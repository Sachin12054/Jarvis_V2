from typing import Dict, List, Optional
from app.core.config import settings
from app.core.model_router.contracts import ModelProfile, ModelCapability


class ModelRegistry:
    """Central registry of configured model profiles and their static capabilities."""

    def __init__(self):
        self._models: Dict[str, ModelProfile] = {}
        self._load_default_profiles()

    def _load_default_profiles(self) -> None:
        """Populates default local Ollama model profiles based on M3.1 benchmarks."""
        # 1. Primary General / Long-Context Candidate: qwen3-test:latest (or qwen3:4b)
        general_id = getattr(settings, "OLLAMA_MODEL", "qwen3-test:latest")
        self.register_model(
            ModelProfile(
                model_id=general_id,
                display_name="Qwen3 4B (JARVIS Core)",
                provider="ollama",
                capabilities=[
                    ModelCapability.COMPLETION,
                    ModelCapability.TOOL_CALLING,
                    ModelCapability.REASONING,
                    ModelCapability.LONG_CONTEXT,
                ],
                context_window=262144,
                has_tool_calling=True,
                has_vision=False,
                coding_score=0.80,
                reasoning_score=0.85,
                general_score=0.85,
                latency_tier="low",
                empirical_ttft_ms=280.0,
                empirical_tps=31.2,
                enabled=True,
                priority=10,
            )
        )

        # 2. Fast / Coding Candidate: qwen-coder-3b:latest
        coder_id = getattr(settings, "OLLAMA_CODING_MODEL", "qwen-coder-3b:latest")
        self.register_model(
            ModelProfile(
                model_id=coder_id,
                display_name="Qwen Coder 3B",
                provider="ollama",
                capabilities=[
                    ModelCapability.COMPLETION,
                    ModelCapability.CODING,
                ],
                context_window=32768,
                has_tool_calling=False,
                has_vision=False,
                coding_score=0.95,
                reasoning_score=0.65,
                general_score=0.75,
                latency_tier="low",
                empirical_ttft_ms=120.0,
                empirical_tps=42.5,
                enabled=True,
                priority=20,
            )
        )

        # 3. Fast General Candidate: gemma-3-4b:latest
        fast_id = getattr(settings, "OLLAMA_FAST_MODEL", "gemma-3-4b:latest")
        if fast_id not in self._models:
            self.register_model(
                ModelProfile(
                    model_id=fast_id,
                    display_name="Gemma 3 4B",
                    provider="ollama",
                    capabilities=[
                        ModelCapability.COMPLETION,
                    ],
                    context_window=131072,
                    has_tool_calling=False,
                    has_vision=False,
                    coding_score=0.70,
                    reasoning_score=0.75,
                    general_score=0.85,
                    latency_tier="low",
                    empirical_ttft_ms=260.0,
                    empirical_tps=34.8,
                    enabled=True,
                    priority=20,
                )
            )

        # 4. Deep Reasoning Candidate: deepseek-r1-7b:latest
        self.register_model(
            ModelProfile(
                model_id="deepseek-r1-7b:latest",
                display_name="DeepSeek R1 7B",
                provider="ollama",
                capabilities=[
                    ModelCapability.COMPLETION,
                    ModelCapability.REASONING,
                ],
                context_window=131072,
                has_tool_calling=False,
                has_vision=False,
                coding_score=0.85,
                reasoning_score=0.98,
                general_score=0.88,
                latency_tier="medium",
                empirical_ttft_ms=650.0,
                empirical_tps=14.2,
                enabled=True,
                priority=20,
            )
        )

    def register_model(self, profile: ModelProfile) -> None:
        """Registers or updates a model profile in the registry."""
        self._models[profile.model_id] = profile

    def get_model(self, model_id: str) -> Optional[ModelProfile]:
        """Retrieves a model profile by identifier."""
        return self._models.get(model_id)

    def list_models(self, enabled_only: bool = True) -> List[ModelProfile]:
        """Lists registered models."""
        if enabled_only:
            return [m for m in self._models.values() if m.enabled]
        return list(self._models.values())

    def update_empirical_metrics(
        self,
        model_id: str,
        ttft_ms: Optional[float] = None,
        tps: Optional[float] = None,
    ) -> bool:
        """Updates empirical benchmark metadata for a registered model."""
        profile = self._models.get(model_id)
        if not profile:
            return False
        if ttft_ms is not None:
            profile.empirical_ttft_ms = ttft_ms
        if tps is not None:
            profile.empirical_tps = tps
        return True
