import time, asyncio, pytest
from unittest.mock import AsyncMock, MagicMock
from app.voice.contracts import VoiceState, VoiceStateMachine, VoiceSession, VoiceEvent, VoiceEventType, AudioChunk
from app.voice.session import VoiceSessionManager
from app.voice.tts_streamer import ThinkingStreamFilter, clean_tts_text, stream_chat_and_tts
from app.voice.stt_provider import evaluate_stt_quality, LocalVoiceTranscription
from app.voice.normalization import normalize_voice_command
from app.core.orchestrator import JarvisCoreOrchestrator
from app.core.contracts import JarvisRequest, JarvisResponse, DecisionStrategy

@pytest.mark.asyncio
async def test_end_to_end_voice_to_direct_action_path():
    raw_stt_text = "jarvis open chrome"
    norm_text, rule = normalize_voice_command(raw_stt_text)
    assert "Google Chrome" in norm_text or "chrome" in norm_text.lower()
    session_mgr = VoiceSessionManager()
    session = await session_mgr.create_session(conversation_id="conv-e2e-1")
    session, turn_id = await session_mgr.start_turn(session.session_id)
    req = JarvisRequest(raw_input=raw_stt_text, input_text=norm_text, conversation_id=session.conversation_id, turn_id=turn_id, channel="voice")
    assert req.conversation_id == "conv-e2e-1"
    assert req.turn_id == turn_id
    core = JarvisCoreOrchestrator()
    res = await core.process_request(req)
    assert res.request_id == req.request_id
    assert res.metadata.get("strategy") == DecisionStrategy.DIRECT_ACTION
    session = await session_mgr.transition_state(session.session_id, VoiceState.PROCESSING)
    session = await session_mgr.transition_state(session.session_id, VoiceState.THINKING)
    session = await session_mgr.transition_state(session.session_id, VoiceState.SPEAKING)
    assert session.state == VoiceState.SPEAKING
    session = await session_mgr.end_turn(session.session_id, turn_id=turn_id)
    assert session.state == VoiceState.IDLE

@pytest.mark.asyncio
async def test_end_to_end_voice_to_knowledge_query_path():
    session_mgr = VoiceSessionManager()
    session = await session_mgr.create_session(conversation_id="conv-kn-1")
    session, turn_id = await session_mgr.start_turn(session.session_id)
    req = JarvisRequest(raw_input="what is machine learning", input_text="what is machine learning", conversation_id=session.conversation_id, turn_id=turn_id, channel="voice")
    from app.brain.llm_manager import MockLLMProvider
    from app.core.knowledge.knowledge_handler import KnowledgeHandler
    core = JarvisCoreOrchestrator(knowledge_handler=KnowledgeHandler(llm_provider=MockLLMProvider()))
    res = await core.process_request(req)
    assert res.error is None
    assert len(res.message) > 0

@pytest.mark.asyncio
async def test_barge_in_and_instant_stop_integration():
    session_mgr = VoiceSessionManager()
    session = await session_mgr.create_session(conversation_id="conv-stop-1")
    session, turn1 = await session_mgr.start_turn(session.session_id)
    session = await session_mgr.transition_state(session.session_id, VoiceState.PROCESSING)
    session = await session_mgr.transition_state(session.session_id, VoiceState.THINKING)
    session = await session_mgr.transition_state(session.session_id, VoiceState.SPEAKING)
    session = await session_mgr.request_interruption(session.session_id, turn_id=turn1)
    assert session.state == VoiceState.IDLE
    assert session.active_turn_id is None
    session, turn2 = await session_mgr.start_turn(session.session_id)
    assert turn2 != turn1
    assert session.state == VoiceState.LISTENING

@pytest.mark.asyncio
async def test_rapid_consecutive_turns_isolation():
    session_mgr = VoiceSessionManager()
    session = await session_mgr.create_session(conversation_id="conv-rapid-1")
    session, turn1 = await session_mgr.start_turn(session.session_id)
    session = await session_mgr.end_turn(session.session_id, turn_id=turn1)
    session, turn2 = await session_mgr.start_turn(session.session_id)
    session = await session_mgr.end_turn(session.session_id, turn_id=turn2)
    session, turn3 = await session_mgr.start_turn(session.session_id)
    session = await session_mgr.end_turn(session.session_id, turn_id=turn3)
    assert len({turn1, turn2, turn3}) == 3
    assert session.state == VoiceState.IDLE

@pytest.mark.asyncio
async def test_interruption_followed_by_immediate_new_turn():
    session_mgr = VoiceSessionManager()
    session = await session_mgr.create_session(conversation_id="conv-imm-1")
    session, turnA = await session_mgr.start_turn(session.session_id)
    session = await session_mgr.transition_state(session.session_id, VoiceState.PROCESSING)
    session = await session_mgr.transition_state(session.session_id, VoiceState.THINKING)
    session = await session_mgr.transition_state(session.session_id, VoiceState.SPEAKING)
    session = await session_mgr.request_interruption(session.session_id, turn_id=turnA)
    session, turnB = await session_mgr.start_turn(session.session_id)
    assert turnB != turnA
    assert session.active_turn_id == turnB
    assert session.state == VoiceState.LISTENING

@pytest.mark.asyncio
async def test_stt_uncertainty_prevents_physical_execution():
    mock_seg = MagicMock()
    mock_seg.avg_logprob = -2.1
    mock_seg.no_speech_prob = 0.85
    mock_seg.compression_ratio = 1.0
    ok, reason, conf = evaluate_stt_quality([mock_seg], "muffled noise", 1500.0)
    assert ok is False
    req = JarvisRequest(raw_input="", input_text="", conversation_id="c-uncert", confidence=conf, channel="voice")
    core = JarvisCoreOrchestrator()
    res = await core.process_request(req)
    assert res.metadata.get("strategy") != DecisionStrategy.DIRECT_ACTION

@pytest.mark.asyncio
async def test_tts_failure_recovery_restores_session_state():
    session_mgr = VoiceSessionManager()
    session = await session_mgr.create_session(conversation_id="conv-tts-err")
    session, turn_id = await session_mgr.start_turn(session.session_id)
    session = await session_mgr.transition_state(session.session_id, VoiceState.PROCESSING)
    session = await session_mgr.transition_state(session.session_id, VoiceState.THINKING)
    session = await session_mgr.transition_state(session.session_id, VoiceState.SPEAKING)
    session = await session_mgr.end_turn(session.session_id, turn_id=turn_id)
    assert session.state == VoiceState.IDLE
    assert session.active_turn_id is None

@pytest.mark.asyncio
async def test_concurrent_session_isolation():
    mgr = VoiceSessionManager()
    sA = await mgr.create_session(conversation_id="conv-A")
    sB = await mgr.create_session(conversation_id="conv-B")
    sA, turnA = await mgr.start_turn(sA.session_id, turn_id="tA")
    sB, turnB = await mgr.start_turn(sB.session_id, turn_id="tB")
    sA = await mgr.request_interruption(sA.session_id, turn_id="tA")
    sB_refreshed = await mgr.get_session(sB.session_id)
    assert sA.state == VoiceState.IDLE
    assert sB_refreshed.state == VoiceState.LISTENING
    assert sB_refreshed.active_turn_id == "tB"

@pytest.mark.asyncio
async def test_full_id_propagation_contract():
    conversation_id = "conv-id-prop-200"
    turn_id = "turn-id-prop-300"
    req = JarvisRequest(raw_input="open notepad", input_text="open notepad", conversation_id=conversation_id, turn_id=turn_id, channel="voice")
    core = JarvisCoreOrchestrator()
    res = await core.process_request(req)
    assert res.turn_id == turn_id
    assert res.request_id == req.request_id
