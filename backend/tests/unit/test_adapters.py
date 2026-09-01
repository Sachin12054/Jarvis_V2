import pytest
from app.schemas.chat import ChatRequest, ChatResponse
from app.brain.intent_schema import IntentDomain, IntentItem, IntentPlan
from app.execution.computer_gateway import ActionResult
from app.core.contracts import (
    InputChannel,
    TargetDevice,
    ExecutionStatus,
    ResponseType,
)
from app.core.adapters import (
    RequestAdapter,
    UnderstandingAdapter,
    ExecutionAdapter,
    VerificationAdapter,
    ResponseAdapter,
)


def test_chat_request_to_jarvis_request():
    chat_req = ChatRequest(message="Hello Jarvis", conversation_id="conv-101")
    req = RequestAdapter.from_chat_request(chat_req, turn_id="turn-abc")
    assert req.conversation_id == "conv-101"
    assert req.turn_id == "turn-abc"
    assert req.raw_input == "Hello Jarvis"
    assert req.input_channel == InputChannel.TEXT


def test_voice_input_to_jarvis_request():
    req = RequestAdapter.from_voice_input(
        raw_text="Open Notepad",
        conversation_id="conv-voice-1",
        turn_id="turn-v1",
        normalized_text="open notepad",
        confidence=0.97,
    )
    assert req.input_channel == InputChannel.VOICE
    assert req.raw_input == "Open Notepad"
    assert req.normalized_input == "open notepad"
    assert req.confidence == 0.97


def test_dict_to_jarvis_request_fallback():
    data = {"text": "Random query", "target_device": "laptop"}
    req = RequestAdapter.from_dict(data)
    assert req.raw_input == "Random query"
    assert req.target_device == TargetDevice.LAPTOP
    assert req.conversation_id == "default-conversation"


def test_intent_item_to_understanding_result():
    item = IntentItem(domain=IntentDomain.DESKTOP_ACTION, confidence=0.92, entities={"app": "chrome"})
    und = UnderstandingAdapter.from_intent_item(item)
    assert und.intent == "DESKTOP_ACTION"
    assert und.entities["app"] == "chrome"
    assert und.confidence == 0.92


def test_intent_plan_to_understanding_result():
    plan = IntentPlan(
        original_text="open notepad",
        normalized_text="open notepad",
        intents=[
            IntentItem(domain=IntentDomain.DESKTOP_ACTION, confidence=0.9),
            IntentItem(domain=IntentDomain.SYSTEM_STATUS, confidence=0.5),
        ],
    )
    und = UnderstandingAdapter.from_intent_plan(plan)
    assert und.intent == "DESKTOP_ACTION"
    assert und.ambiguity is True


def test_command_match_to_understanding_result():
    und = UnderstandingAdapter.from_command_match("open_notepad", entities={"target": "Notepad"})
    assert und.intent == "OPEN_NOTEPAD"
    assert und.entities["target"] == "Notepad"


def test_action_result_to_execution_result_verified():
    ar = ActionResult(
        requested_action="launch_app",
        executed=True,
        verified=True,
        evidence={"pid": 999},
    )
    er = ExecutionAdapter.from_action_result(ar, duration_ms=120.0)
    assert er.status == ExecutionStatus.VERIFIED
    assert er.success is True
    assert er.evidence["pid"] == 999
    assert er.duration_ms == 120.0


def test_action_result_to_execution_result_error_mapping():
    ar_daemon = ActionResult(requested_action="click", executed=False, verified=False, error="CUA daemon unavailable pipe error")
    er_daemon = ExecutionAdapter.from_action_result(ar_daemon)
    assert er_daemon.status == ExecutionStatus.FAILED
    assert er_daemon.error_code == "DAEMON_UNAVAILABLE"
    assert er_daemon.success is False


def test_action_result_to_verification_result():
    ar = ActionResult(requested_action="focus", executed=True, verified=True, evidence={"window": "Notepad"})
    vr = VerificationAdapter.from_action_result_verification(ar)
    assert vr.verified is True
    assert vr.status == "SUCCESS"
    assert vr.verification_method == "CUA_DESKTOP_STATE"


def test_chat_response_conversion():
    chat_res = ChatResponse(conversation_id="c-9", message="Response text", model="qwen3-test:latest")
    j_res = ResponseAdapter.from_chat_response(chat_res, request_id="req-1", turn_id="turn-1")
    assert j_res.request_id == "req-1"
    assert j_res.turn_id == "turn-1"
    assert j_res.message == "Response text"
    assert j_res.metadata["model"] == "qwen3-test:latest"

    back_chat = ResponseAdapter.to_chat_response(j_res)
    assert back_chat.conversation_id == "c-9"
    assert back_chat.message == "Response text"
    assert back_chat.model == "qwen3-test:latest"


def test_command_response_conversion():
    j_res = ResponseAdapter.from_command_response(
        message="App launched",
        request_id="r-5",
        turn_id="t-5",
        should_speak=True,
    )
    assert j_res.response_type == ResponseType.TEXT
    assert j_res.should_speak is True
    assert j_res.message == "App launched"
