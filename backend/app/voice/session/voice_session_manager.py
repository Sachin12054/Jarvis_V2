import time
import uuid
import asyncio
from typing import Optional, Dict, Any, Tuple
from app.voice.contracts.voice_state import VoiceState, VoiceStateMachine, InvalidVoiceStateTransitionError
from app.voice.contracts.voice_session import VoiceSession
from app.voice.contracts.voice_event import VoiceEvent, VoiceEventType


class VoiceSessionManager:
    """Canonical Voice Session Lifecycle Manager.

    Coordinates voice session creation, retrieval, state transitions, turn tracking,
    concurrency locking, interruption handling, and error recovery.
    Contains zero infrastructure dependencies.
    """

    def __init__(self):
        self._sessions: Dict[str, VoiceSession] = {}
        self._lock = asyncio.Lock()

    async def create_session(
        self,
        conversation_id: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> VoiceSession:
        """Creates a new VoiceSession in IDLE state."""
        async with self._lock:
            session = VoiceSession(
                conversation_id=conversation_id,
                state=VoiceState.IDLE,
                metadata=metadata or {},
            )
            self._sessions[session.session_id] = session
            return session

    async def get_session(self, session_id: str) -> Optional[VoiceSession]:
        """Retrieves a VoiceSession by session_id."""
        async with self._lock:
            return self._sessions.get(session_id)

    async def transition_state(
        self,
        session_id: str,
        target_state: VoiceState,
    ) -> VoiceSession:
        """Transitions a VoiceSession state enforcing valid state transitions."""
        async with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                raise KeyError(f"VoiceSession {session_id} not found.")

            new_state = VoiceStateMachine.transition(session.state, target_state)
            session.state = new_state
            session.updated_at = time.time()
            return session

    async def start_turn(
        self,
        session_id: str,
        turn_id: Optional[str] = None,
    ) -> Tuple[VoiceSession, str]:
        """Starts a new voice interaction turn.

        Fails if an active turn is already in progress or state transition is invalid.
        """
        async with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                raise KeyError(f"VoiceSession {session_id} not found.")

            if session.active_turn_id is not None:
                raise RuntimeError(f"Session {session_id} already has active turn {session.active_turn_id}.")

            new_state = VoiceStateMachine.transition(session.state, VoiceState.LISTENING)
            t_id = turn_id or str(uuid.uuid4())
            session.state = new_state
            session.active_turn_id = t_id
            session.updated_at = time.time()
            return session, t_id

    async def end_turn(
        self,
        session_id: str,
        turn_id: str,
    ) -> VoiceSession:
        """Ends an active turn and resets session state to IDLE.

        Rejects stale turn updates if turn_id does not match active_turn_id.
        """
        async with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                raise KeyError(f"VoiceSession {session_id} not found.")

            if session.active_turn_id != turn_id:
                # Stale turn update rejection
                return session

            session.state = VoiceState.IDLE
            session.active_turn_id = None
            session.updated_at = time.time()
            return session

    async def request_interruption(
        self,
        session_id: str,
        turn_id: Optional[str] = None,
    ) -> VoiceSession:
        """Requests instant interruption, transitioning state to INTERRUPTING then IDLE."""
        async with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                raise KeyError(f"VoiceSession {session_id} not found.")

            if turn_id and session.active_turn_id and session.active_turn_id != turn_id:
                # Stale interruption request
                return session

            session.state = VoiceState.INTERRUPTING
            session.active_turn_id = None
            session.updated_at = time.time()
            session.state = VoiceState.IDLE
            return session

    async def cancel_session(self, session_id: str) -> VoiceSession:
        """Cancels active turn and resets session to IDLE."""
        async with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                raise KeyError(f"VoiceSession {session_id} not found.")

            session.state = VoiceState.IDLE
            session.active_turn_id = None
            session.updated_at = time.time()
            return session

    async def handle_error(
        self,
        session_id: str,
        error_message: str,
    ) -> VoiceSession:
        """Transitions session to ERROR state with error details."""
        async with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                raise KeyError(f"VoiceSession {session_id} not found.")

            session.state = VoiceState.ERROR
            session.active_turn_id = None
            session.metadata["last_error"] = error_message
            session.updated_at = time.time()
            return session

    async def recover_error(self, session_id: str) -> VoiceSession:
        """Recovers session from ERROR state back to IDLE."""
        async with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                raise KeyError(f"VoiceSession {session_id} not found.")

            if session.state == VoiceState.ERROR:
                session.state = VoiceState.IDLE
                session.updated_at = time.time()
            return session
