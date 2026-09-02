from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ModelCapability(str, Enum):
    COMPLETION = "completion"
    TOOL_CALLING = "tool_calling"
    VISION = "vision"
    CODING = "coding"
    REASONING = "reasoning"
    LONG_CONTEXT = "long_context"


class TaskComplexity(str, Enum):
    SIMPLE = "simple"
    NORMAL = "normal"
    COMPLEX = "complex"
    DEEP_REASONING = "deep_reasoning"


class InteractionChannel(str, Enum):
    VOICE = "voice"
    CHAT = "chat"
    API = "api"
    SYSTEM = "system"


class ModelSelectionContext(BaseModel):
    """Encapsulates request/task characteristics for model selection."""
    channel: InteractionChannel = InteractionChannel.CHAT
    complexity: TaskComplexity = TaskComplexity.NORMAL
    intent: Optional[str] = None
    requires_tool_calling: bool = False
    requires_vision: bool = False
    requires_coding: bool = False
    requires_reasoning: bool = False
    requires_long_context: bool = False
    required_context_tokens: int = 4096
    latency_sensitive: bool = False
    quality_priority: bool = False
    streaming_required: bool = True
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ModelProfile(BaseModel):
    """Static capability and performance profile of an LLM model candidate."""
    model_id: str
    display_name: str
    provider: str = "ollama"
    capabilities: List[ModelCapability] = Field(default_factory=list)
    context_window: int = 32768
    has_tool_calling: bool = False
    has_vision: bool = False
    coding_score: float = 0.5
    reasoning_score: float = 0.5
    general_score: float = 0.5
    latency_tier: str = "medium"  # low, medium, high
    empirical_ttft_ms: Optional[float] = None
    empirical_tps: Optional[float] = None
    enabled: bool = True
    priority: int = 100
    fallback_eligible: bool = True


class ModelRoute(BaseModel):
    """Structured decision output produced by the canonical ModelRouter."""
    selected_model: str
    provider: str
    fallbacks: List[str] = Field(default_factory=list)
    reason: str
    score: float = 0.0
    is_satisfied: bool = True
    context: Optional[ModelSelectionContext] = None
    selection_metadata: Dict[str, Any] = Field(default_factory=dict)
