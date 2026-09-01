from typing import Protocol, Dict, Any, Optional, Tuple
from app.core.contracts import TaskStep, ExecutionResult, VerificationResult


class CapabilityHandler(Protocol):
    """Abstract interface protocol for executing a single capability step."""

    async def execute(
        self,
        step: TaskStep,
        context: Optional[Dict[str, Any]] = None,
    ) -> Tuple[ExecutionResult, VerificationResult]:
        ...


class CapabilityResolver:
    """Registry and resolver for abstract capability handlers in JARVIS V2."""

    def __init__(self):
        self._handlers: Dict[str, CapabilityHandler] = {}

    def register(self, capability_name: str, handler: CapabilityHandler) -> None:
        """Registers a capability handler by capability name."""
        clean_name = capability_name.strip().lower()
        self._handlers[clean_name] = handler

    def resolve(self, capability_name: str) -> Optional[CapabilityHandler]:
        """Resolves a registered capability handler."""
        clean_name = capability_name.strip().lower()
        return self._handlers.get(clean_name)

    def has_capability(self, capability_name: str) -> bool:
        """Checks if a capability handler is registered."""
        clean_name = capability_name.strip().lower()
        return clean_name in self._handlers
