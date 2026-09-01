import pytest
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionStrategy,
    TargetDevice,
    InputChannel,
)
from app.core.decision import DecisionGate


def test_open_application_to_direct_action():
    req = JarvisRequest(conversation_id="c1", raw_input="Open Notepad", target_device=TargetDevice.LAPTOP)
    und = UnderstandingResult(intent="OPEN_APPLICATION", entities={"application": "Notepad"}, confidence=0.95)
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy == DecisionStrategy.DIRECT_ACTION
    assert dec.selected_tool == "launch_app"
    assert dec.decision_id is not None
    assert dec.requires_clarification is False


def test_close_application_to_direct_action():
    req = JarvisRequest(conversation_id="c1", raw_input="Close Chrome")
    und = UnderstandingResult(intent="CLOSE_APPLICATION", entities={"application": "Chrome"}, confidence=0.95)
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy == DecisionStrategy.DIRECT_ACTION
    assert dec.selected_tool == "desktop_action"


def test_stop_to_direct_action():
    req = JarvisRequest(conversation_id="c1", raw_input="STOP", input_channel=InputChannel.VOICE)
    und = UnderstandingResult(intent="STOP", confidence=1.0)
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy == DecisionStrategy.DIRECT_ACTION


def test_knowledge_query_to_knowledge_query():
    req = JarvisRequest(conversation_id="c1", raw_input="What is machine learning?")
    und = UnderstandingResult(intent="KNOWLEDGE_QUERY", confidence=0.90)
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy == DecisionStrategy.KNOWLEDGE_QUERY
    assert dec.selected_model == "qwen3-test:latest"


def test_tool_intent_to_tool_call():
    req = JarvisRequest(conversation_id="c1", raw_input="Find python files")
    und = UnderstandingResult(intent="FILESYSTEM_SEARCH", entities={"tool_name": "file_search"}, confidence=0.88)
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy == DecisionStrategy.TOOL_CALL
    assert dec.selected_tool == "file_search"


def test_complex_task_to_complex_task():
    req = JarvisRequest(conversation_id="c1", raw_input="Refactor user service and run unit tests")
    und = UnderstandingResult(intent="COMPLEX_TASK", confidence=0.85)
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy == DecisionStrategy.COMPLEX_TASK
    assert dec.selected_model == "qwen3-test:latest"


def test_ambiguous_request_requires_clarification():
    req = JarvisRequest(conversation_id="c1", raw_input="Do it")
    und = UnderstandingResult(
        intent="DESKTOP_ACTION",
        confidence=0.9,
        ambiguity=True,
        requires_clarification=True,
        clarification_reason="Ambiguous action target",
    )
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy == DecisionStrategy.CLARIFICATION
    assert dec.requires_clarification is True
    assert "Ambiguous" in dec.reason


def test_low_confidence_physical_action_rejected():
    req = JarvisRequest(conversation_id="c1", raw_input="Delete file")
    und = UnderstandingResult(intent="OPEN_APPLICATION", confidence=0.40)
    dec = DecisionGate.evaluate(req, und)
    assert dec.strategy != DecisionStrategy.DIRECT_ACTION
    assert dec.strategy == DecisionStrategy.CLARIFICATION
    assert dec.requires_clarification is True


def test_decision_gate_preserves_request_context():
    req = JarvisRequest(
        request_id="req-99",
        conversation_id="c-99",
        turn_id="turn-99",
        raw_input="Show route",
        target_device=TargetDevice.PHONE,
    )
    und = UnderstandingResult(intent="MAPS_DIRECTIONS", confidence=0.95)
    dec = DecisionGate.evaluate(req, und)
    assert dec.decision_id is not None
    assert dec.strategy == DecisionStrategy.TOOL_CALL
