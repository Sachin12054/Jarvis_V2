import inspect
import asyncio
import pytest
from app.voice.contracts import (
    VoiceState,
    VoiceStateMachine,
    InvalidVoiceStateTransitionError,
    VoiceEvent,
    VoiceEventType,
    AudioChunk,
    VoiceSession,
)
from app.voice.session import VoiceSessionManager


@pytest.mark.asyncio
async def test_session_creation_and_retrieval():
    mgr = VoiceSessionManager()
    session = await mgr.create_session(conversation_id="conv-v1")
    assert session.session_id is not None
    assert session.conversation_id == "conv-v1"
    assert session.state == VoiceState.IDLE

    retrieved = await mgr.get_session(session.session_id)
    assert retrieved is not None
    assert retrieved.session_id == session.session_id


@pytest.mark.asyncio
async def test_valid_state_transitions():
    mgr = VoiceSessionManager()
    s = await mgr.create_session(conversation_id="conv-v2")
    assert s.state == VoiceState.IDLE

    s = await mgr.transition_state(s.session_id, VoiceState.LISTENING)
    assert s.state == VoiceState.LISTENING

    s = await mgr.transition_state(s.session_id, VoiceState.PROCESSING)
    assert s.state == VoiceState.PROCESSING

    s = await mgr.transition_state(s.session_id, VoiceState.THINKING)
    assert s.state == VoiceState.THINKING

    s = await mgr.transition_state(s.session_id, VoiceState.SPEAKING)
    assert s.state == VoiceState.SPEAKING

    s = await mgr.transition_state(s.session_id, VoiceState.IDLE)
    assert s.state == VoiceState.IDLE


@pytest.mark.asyncio
async def test_invalid_state_transition_raises_error():
    mgr = VoiceSessionManager()
    s = await mgr.create_session(conversation_id="conv-v3")
    assert s.state == VoiceState.IDLE

    with pytest.raises(InvalidVoiceStateTransitionError):
        await mgr.transition_state(s.session_id, VoiceState.SPEAKING)


@pytest.mark.asyncio
async def test_start_and_end_turn():
    mgr = VoiceSessionManager()
    s = await mgr.create_session(conversation_id="conv-v4")
    s, turn_id = await mgr.start_turn(s.session_id, turn_id="turn-404")

    assert turn_id == "turn-404"
    assert s.active_turn_id == "turn-404"
    assert s.state == VoiceState.LISTENING

    s = await mgr.end_turn(s.session_id, turn_id="turn-404")
    assert s.state == VoiceState.IDLE
    assert s.active_turn_id is None


@pytest.mark.asyncio
async def test_duplicate_turn_prevention():
    mgr = VoiceSessionManager()
    s = await mgr.create_session(conversation_id="conv-v5")
    s, turn_id = await mgr.start_turn(s.session_id)

    with pytest.raises(RuntimeError):
        await mgr.start_turn(s.session_id)


@pytest.mark.asyncio
async def test_stale_turn_protection():
    mgr = VoiceSessionManager()
    s = await mgr.create_session(conversation_id="conv-v6")
    s, turn_id = await mgr.start_turn(s.session_id, turn_id="turn-606")

    # Attempt ending with mismatched turn_id
    s = await mgr.end_turn(s.session_id, turn_id="stale-turn-id")
    assert s.active_turn_id == "turn-606"
    assert s.state == VoiceState.LISTENING


@pytest.mark.asyncio
async def test_interruption_state():
    mgr = VoiceSessionManager()
    s = await mgr.create_session(conversation_id="conv-v7")
    s, turn_id = await mgr.start_turn(s.session_id)
    s = await mgr.transition_state(s.session_id, VoiceState.PROCESSING)
    s = await mgr.transition_state(s.session_id, VoiceState.THINKING)
    s = await mgr.transition_state(s.session_id, VoiceState.SPEAKING)

    s = await mgr.request_interruption(s.session_id, turn_id=turn_id)
    assert s.state == VoiceState.IDLE
    assert s.active_turn_id is None


@pytest.mark.asyncio
async def test_cancellation_and_error_recovery():
    mgr = VoiceSessionManager()
    s = await mgr.create_session(conversation_id="conv-v8")
    s, turn_id = await mgr.start_turn(s.session_id)
    s = await mgr.cancel_session(s.session_id)
    assert s.state == VoiceState.IDLE
    assert s.active_turn_id is None

    s = await mgr.handle_error(s.session_id, "Audio hardware disconnected")
    assert s.state == VoiceState.ERROR
    assert s.metadata.get("last_error") == "Audio hardware disconnected"

    s = await mgr.recover_error(s.session_id)
    assert s.state == VoiceState.IDLE


@pytest.mark.asyncio
async def test_concurrent_state_update_safety():
    mgr = VoiceSessionManager()
    s = await mgr.create_session(conversation_id="conv-v9")

    async def worker():
        s_worker = await mgr.get_session(s.session_id)
        return s_worker

    results = await asyncio.gather(*(worker() for _ in range(50)))
    assert len(results) == 50
    assert all(r.session_id == s.session_id for r in results)


def test_architectural_boundary_no_infrastructure_imports():
    import app.voice.contracts.voice_state as vs
    import app.voice.contracts.voice_event as ve
    import app.voice.contracts.audio_chunk as ac
    import app.voice.contracts.voice_session as v_sess
    import app.voice.session.voice_session_manager as vsm

    combined = (
        inspect.getsource(vs) + " " +
        inspect.getsource(ve) + " " +
        inspect.getsource(ac) + " " +
        inspect.getsource(v_sess) + " " +
        inspect.getsource(vsm)
    ).lower()

    forbidden = [
        "import ollama", "import whisper", "import kokoro", "import fastapi",
        "import pyautogui", "import pywinauto", "import win32", "import subprocess",
    ]
    for item in forbidden:
        assert item not in combined
