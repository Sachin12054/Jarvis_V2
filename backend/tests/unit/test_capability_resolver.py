import pytest
from unittest.mock import AsyncMock, MagicMock
from app.core.contracts import ExecutionResult, VerificationResult
from app.core.brain import CapabilityResolver, CapabilityHandler

def test_register_and_resolve_capability():
    resolver = CapabilityResolver()
    mock_handler = MagicMock(spec=CapabilityHandler)
    resolver.register("desktop.open_app", mock_handler)

    assert resolver.has_capability("desktop.open_app") is True
    assert resolver.has_capability("DESKTOP.OPEN_APP") is True
    resolved = resolver.resolve("desktop.open_app")
    assert resolved is mock_handler

def test_unknown_capability_returns_none():
    resolver = CapabilityResolver()
    assert resolver.has_capability("unknown.capability") is False
    assert resolver.resolve("unknown.capability") is None
