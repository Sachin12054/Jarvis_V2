import pytest
from app.brain.interruption_engine import InterruptionEngine, InterruptionType


def test_barge_in_interruption_detection():
    """Requirement Phase 4 & 7: Verifies immediate voice barge-in and interruption handling."""
    stop_queries = ["stop", "stop speaking", "cancel", "shut up", "abort"]

    for q in stop_queries:
        res = InterruptionEngine.check_interruption(q)
        print(f"\n[BARGE-IN TEST] query='{q}' -> is_interruption={res.is_interruption} type={res.type}")
        assert res.is_interruption is True
        assert res.type in [InterruptionType.STOP_SPEAKING, InterruptionType.CANCEL_TASK]

    normal_query = "What is the capital of France?"
    res_normal = InterruptionEngine.check_interruption(normal_query)
    assert res_normal.is_interruption is False
