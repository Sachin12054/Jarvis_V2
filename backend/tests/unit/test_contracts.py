import pytest
from pydantic import ValidationError
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    ExecutionResult,
    VerificationResult,
    JarvisResponse,
    InputChannel,
    TargetDevice,
    DecisionStrategy,
    ExecutionStatus,
    ResponseType,
)


def test_valid_text_request_creation():
    req = JarvisRequest(conversation_id="conv-123", raw_input="Hello Jarvis")
    assert req.conversation_id == "conv-123"
    assert req.raw_input == "Hello Jarvis"
    assert req.input_channel == InputChannel.TEXT
    assert req.target_device == TargetDevice.CURRENT
    assert req.request_id is not None
    assert req.turn_id is not None


def test_voice_request_creation():
    req = JarvisRequest(
        conversation_id="conv-voice",
        input_channel=InputChannel.VOICE,
        raw_input="Open Notepad",
        normalized_input="open notepad",
        confidence=0.98,
    )
    assert req.input_channel == InputChannel.VOICE
    assert req.normalized_input == "open notepad"
    assert req.confidence == 0.98


def test_target_device_values():
    req_laptop = JarvisRequest(conversation_id="c1", raw_input="x", target_device=TargetDevice.LAPTOP)
    req_phone = JarvisRequest(conversation_id="c2", raw_input="x", target_device=TargetDevice.PHONE)
    req_both = JarvisRequest(conversation_id="c3", raw_input="x", target_device=TargetDevice.BOTH)
    assert req_laptop.target_device == TargetDevice.LAPTOP
    assert req_phone.target_device == TargetDevice.PHONE
    assert req_both.target_device == TargetDevice.BOTH


def test_understanding_result():
    und = UnderstandingResult(
        intent="OPEN_APPLICATION",
        entities={"application": "Notepad"},
        target_device=TargetDevice.LAPTOP,
        confidence=0.95,
    )
    assert und.intent == "OPEN_APPLICATION"
    assert und.entities["application"] == "Notepad"
    assert und.requires_clarification is False


def test_ambiguous_understanding_result():
    und = UnderstandingResult(
        intent="SEND_MESSAGE",
        entities={"contact_name": "Arun"},
        ambiguity=True,
        requires_clarification=True,
        clarification_reason="Multiple matching contacts",
    )
    assert und.ambiguity is True
    assert und.requires_clarification is True
    assert und.clarification_reason == "Multiple matching contacts"


def test_decision_result_strategies():
    dec_direct = DecisionResult(strategy=DecisionStrategy.DIRECT_ACTION, selected_tool="launch_app")
    dec_tool = DecisionResult(strategy=DecisionStrategy.TOOL_CALL, selected_tool="calculate_route")
    dec_complex = DecisionResult(strategy=DecisionStrategy.COMPLEX_TASK, selected_model="qwen3-test:latest")
    assert dec_direct.strategy == DecisionStrategy.DIRECT_ACTION
    assert dec_tool.strategy == DecisionStrategy.TOOL_CALL
    assert dec_complex.strategy == DecisionStrategy.COMPLEX_TASK


def test_execution_result():
    exec_res = ExecutionResult(
        action_type="launch_app",
        target="Notepad",
        status=ExecutionStatus.EXECUTED,
        success=True,
        evidence={"pid": 1234},
        duration_ms=45.2,
    )
    assert exec_res.status == ExecutionStatus.EXECUTED
    assert exec_res.success is True
    assert exec_res.evidence["pid"] == 1234
    assert exec_res.duration_ms == 45.2


def test_verification_result():
    ver_res = VerificationResult(
        verified=True,
        status="SUCCESS",
        evidence={"window_found": True},
        verification_method="WINDOW_STATE",
    )
    assert ver_res.verified is True
    assert ver_res.status == "SUCCESS"
    assert ver_res.verification_method == "WINDOW_STATE"


def test_jarvis_response_with_results():
    req = JarvisRequest(conversation_id="conv-99", raw_input="Open Notepad")
    exec_res = ExecutionResult(action_type="launch_app", status=ExecutionStatus.EXECUTED, success=True)
    ver_res = VerificationResult(verified=True, status="SUCCESS")
    resp = JarvisResponse(
        request_id=req.request_id,
        turn_id=req.turn_id,
        message="Notepad has been opened.",
        response_type=ResponseType.ACTION,
        execution_result=exec_res,
        verification_result=ver_res,
        should_speak=True,
    )
    assert resp.request_id == req.request_id
    assert resp.turn_id == req.turn_id
    assert resp.execution_result.success is True
    assert resp.verification_result.verified is True
    assert resp.should_speak is True


def test_invalid_enum_rejection():
    with pytest.raises(ValidationError):
        JarvisRequest(conversation_id="c1", raw_input="test", input_channel="invalid_channel")
    with pytest.raises(ValidationError):
        DecisionResult(strategy="INVALID_STRATEGY")


def test_request_and_turn_id_propagation():
    req = JarvisRequest(conversation_id="conv-trace", raw_input="Trace me")
    resp = JarvisResponse(
        request_id=req.request_id,
        turn_id=req.turn_id,
        message="Traced",
    )
    assert resp.request_id == req.request_id
    assert resp.turn_id == req.turn_id
