import pytest
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionStrategy,
    TargetDevice,
    InputChannel,
)
from app.core.understanding import UnderstandingPipeline
from app.core.decision import DecisionGate


def test_open_notepad_understanding():
    req = JarvisRequest(conversation_id="c1", raw_input="Open Notepad", target_device=TargetDevice.LAPTOP)
    und = UnderstandingPipeline.process(req)
    assert und.intent in ("OPEN_APPLICATION", "DESKTOP_ACTION")
    assert und.entities.get("application") == "Notepad"
    assert und.ambiguity is False


def test_open_chrome_understanding():
    req = JarvisRequest(conversation_id="c1", raw_input="Open Chrome")
    und = UnderstandingPipeline.process(req)
    assert und.intent in ("OPEN_APPLICATION", "DESKTOP_ACTION")
    assert und.entities.get("application") == "Google Chrome"


def test_stop_understanding():
    req = JarvisRequest(conversation_id="c1", raw_input="Stop", input_channel=InputChannel.VOICE)
    und = UnderstandingPipeline.process(req)
    assert und.intent == "STOP"
    assert und.ambiguity is False


def test_math_knowledge_query_understanding():
    req = JarvisRequest(conversation_id="c1", raw_input="What is 2 + 2?")
    und = UnderstandingPipeline.process(req)
    assert und.intent == "KNOWLEDGE_QUERY"
    assert und.entities["query"] == "What is 2 + 2?"


def test_filesystem_search_understanding():
    req = JarvisRequest(conversation_id="c1", raw_input="Search for pdf files")
    und = UnderstandingPipeline.process(req)
    assert und.intent in ("FILESYSTEM_SEARCH", "FILESYSTEM_READ", "GENERAL_CHAT")
    assert und.confidence > 0.0


def test_voice_normalized_wake_word_stripping():
    req = JarvisRequest(conversation_id="c1", raw_input="JARVIS Open Notepad", input_channel=InputChannel.VOICE)
    und = UnderstandingPipeline.process(req)
    assert und.intent in ("OPEN_APPLICATION", "DESKTOP_ACTION")
    assert und.entities.get("application") == "Notepad"


def test_voice_normalized_alias_mapping():
    req = JarvisRequest(conversation_id="c1", raw_input="open not bad", input_channel=InputChannel.VOICE)
    und = UnderstandingPipeline.process(req)
    assert und.intent in ("OPEN_APPLICATION", "DESKTOP_ACTION")
    assert und.entities.get("application") == "Notepad"


def test_ambiguous_entity_target_understanding():
    req = JarvisRequest(conversation_id="c1", raw_input="Open Arun")
    und = UnderstandingPipeline.process(req)
    assert und.intent in ("OPEN_APPLICATION", "DESKTOP_ACTION")
    assert und.ambiguity is True
    assert und.requires_clarification is True


def test_confidence_preservation():
    req = JarvisRequest(conversation_id="c1", raw_input="Open Notepad", confidence=0.45)
    und = UnderstandingPipeline.process(req)
    assert und.confidence == 0.45


def test_empty_request_unknown_understanding():
    req = JarvisRequest(conversation_id="c1", raw_input="")
    und = UnderstandingPipeline.process(req)
    assert und.intent == "UNKNOWN"
    assert und.ambiguity is True
    assert und.requires_clarification is True


def test_pipeline_feeding_into_decision_gate():
    req = JarvisRequest(conversation_id="c-chain", raw_input="Open Notepad", target_device=TargetDevice.LAPTOP)
    und = UnderstandingPipeline.process(req)
    dec = DecisionGate.evaluate(req, und)
    assert und.intent in ("OPEN_APPLICATION", "DESKTOP_ACTION")
    assert dec.strategy == DecisionStrategy.DIRECT_ACTION
