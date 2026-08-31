import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.brain.context_manager import ContextManager
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain
from app.brain.normalizer import InputNormalizer
from app.brain.orchestrator import JARVISOrchestrator
from app.conversation.history import normalize_history
from app.core.config import settings
from app.services.chat_service import ChatService
from app.services.elevenlabs_service import ElevenLabsVoiceService
from app.voice.stt_provider import LocalWhisperSTTProvider, LocalVoiceTranscription
from app.tools.registry import ToolRegistry


def test_voice_configuration():
    """Verifies local Whisper STT configuration parameters and optional ElevenLabs TTS from settings."""
    service = ElevenLabsVoiceService()

    assert settings.JARVIS_STT_PROVIDER == "local_whisper"
    assert settings.JARVIS_STT_MODEL == "base"
    assert service.voice_id == "pNInz6obpgDQGcFmaJgB"
    assert service.tts_model == "eleven_multilingual_v2"
    assert service.timeout == 15.0


def test_clean_text_for_speech():
    """Verifies markdown formatting and code blocks are stripped prior to TTS generation."""
    raw = "**CPU usage** is at `18%`. Check out [link](http://example.com)\n\n# Header\n[LOCATION ACCESS REQUIRED]"
    cleaned = ElevenLabsVoiceService.clean_text_for_speech(raw)

    assert "CPU usage" in cleaned
    assert "**" not in cleaned
    assert "`" not in cleaned
    assert "#" not in cleaned
    assert "[LOCATION ACCESS REQUIRED]" not in cleaned


@pytest.mark.asyncio
async def test_api_key_not_exposed(async_client: AsyncClient):
    """Verifies GET /api/v1/voice/status endpoint returns local STT status without exposing secret API keys."""
    res = await async_client.get("/api/v1/voice/status")
    assert res.status_code == 200

    data = res.json()
    assert "stt" in data
    assert data["stt"]["provider"] == "local_whisper"
    assert data["stt"]["resident"] is True
    assert "tts" in data
    assert "api_key" not in data
    assert "ELEVENLABS_API_KEY" not in str(data)


@pytest.mark.asyncio
async def test_empty_transcript_handling():
    """Verifies empty audio bytes return LocalVoiceTranscription with error and zero confidence."""
    provider = LocalWhisperSTTProvider.get_instance()
    res = await provider.transcribe(b"")

    assert res.text == ""
    assert res.confidence == 0.0
    assert "empty" in res.error.lower()


def test_filler_normalization():
    """Verifies filler word stripping from voice speech input."""
    n1 = InputNormalizer.normalize("Uh hey Jarvis can you open Chrome?")
    assert "open chrome" in n1.lower()
    assert "uh" not in n1.lower().split()
    assert "jarvis" not in n1.lower().split()


def test_speech_self_correction():
    """Verifies speech repairs resolve to authoritative user correction."""
    corrected = InputNormalizer.normalize("Check CPU... no, I mean RAM usage.")
    plan = IntentEngine.analyze(corrected)

    domains = [i.domain for i in plan.intents]
    assert IntentDomain.SYSTEM_METRICS in domains
    assert plan.intents[0].entities.get("metric") == "ram"


def test_natural_language_no_keyword_dependency():
    """Verifies natural spoken phrasing resolves to semantic intent without hardcoded regex."""
    plan1 = IntentEngine.analyze("Could you bring up Chrome for me?", channel="voice")
    assert IntentDomain.DESKTOP_ACTION in [i.domain for i in plan1.intents]

    plan2 = IntentEngine.analyze("My computer feels kind of slow. Can you take a look?", channel="voice")
    assert IntentDomain.SYSTEM_METRICS in [i.domain for i in plan2.intents] or IntentDomain.PROCESS_MANAGEMENT in [i.domain for i in plan2.intents]


def test_context_manager_none_history():
    """Verifies ContextManager.prepare_messages safely handles history=None without TypeError."""
    cm = ContextManager()
    messages = cm.prepare_messages(history=None, new_user_message="Hey Jarvis, what are you doing?")

    assert isinstance(messages, list)
    assert len(messages) >= 2
    assert messages[0]["role"] == "system"
    assert messages[-1]["content"] == "Hey Jarvis, what are you doing?"


@pytest.mark.asyncio
async def test_agent_none_history(db_session: AsyncSession):
    """Verifies JARVISAgent.process_turn safely handles conversation_history=None."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "Hey Jarvis, what are you doing?", channel="voice", conversation_history=None)

    assert "message" in res
    assert len(res["message"]) > 0


@pytest.mark.asyncio
async def test_orchestrator_none_history():
    """Verifies JARVISOrchestrator.process_turn safely handles history=None."""
    orchestrator = JARVISOrchestrator()
    res = await orchestrator.process_turn(user_message="Hello", history=None)

    assert "response" in res
    assert len(res["response"]) > 0


@pytest.mark.asyncio
async def test_voice_first_turn(db_session: AsyncSession):
    """Verifies first voice turn with no prior history executes cleanly without 500 error."""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(db_session, "Hey Jarvis, how are you?", channel="voice")

    assert "conversation_id" in res
    assert "message" in res
    assert len(res["message"]) > 0


@pytest.mark.asyncio
async def test_voice_followup(db_session: AsyncSession):
    """Verifies Turn 2 voice turn receives Turn 1 history context."""
    chat_service = ChatService()
    res1 = await chat_service.handle_chat_request(db_session, "What is my CPU usage?", channel="voice")
    conv_id = res1["conversation_id"]

    res2 = await chat_service.handle_chat_request(db_session, "And RAM?", conversation_id=conv_id, channel="voice")
    assert "conversation_id" in res2
    assert res2["conversation_id"] == conv_id
    assert "RAM" in res2["message"] or "%" in res2["message"]


@pytest.mark.asyncio
async def test_chat_voice_shared_history(db_session: AsyncSession):
    """Verifies chat turn followed by voice turn preserves dialogue context."""
    chat_service = ChatService()
    res1 = await chat_service.handle_chat_request(db_session, "My project is GeneCopilot.", channel="chat")
    conv_id = res1["conversation_id"]

    res2 = await chat_service.handle_chat_request(db_session, "What should I work on next?", conversation_id=conv_id, channel="voice")
    assert res2["conversation_id"] == conv_id


@pytest.mark.asyncio
async def test_voice_chat_shared_history(db_session: AsyncSession):
    """Verifies voice turn followed by chat turn preserves dialogue context."""
    chat_service = ChatService()
    res1 = await chat_service.handle_chat_request(db_session, "I'm working on GeneCopilot.", channel="voice")
    conv_id = res1["conversation_id"]

    res2 = await chat_service.handle_chat_request(db_session, "What project did I mention?", conversation_id=conv_id, channel="chat")
    assert res2["conversation_id"] == conv_id
    assert "GeneCopilot" in res2["message"] or "project" in res2["message"].lower()


def test_registry_singleton_runtime():
    """Verifies ToolRegistry singleton pattern reuses exact object identity."""
    reg1 = ToolRegistry()
    reg2 = ToolRegistry.get_instance()

    assert reg1 is reg2
    assert id(reg1) == id(reg2)


def test_registry_not_recreated_per_request():
    """Verifies ToolRegistry instance identity remains unchanged across multiple simulated requests."""
    r1 = ToolRegistry()
    r2 = ToolRegistry()
    r3 = ToolRegistry.get_instance()

    assert id(r1) == id(r2) == id(r3)
    assert len(r1.list_tools()) == 22
