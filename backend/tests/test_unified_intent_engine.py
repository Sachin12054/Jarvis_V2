import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain, IntentPlan
from app.brain.normalizer import InputNormalizer
from app.services.chat_service import ChatService


# ==========================================
# 1. NORMALIZER TESTS
# ==========================================

def test_normalizer_filler_stripping():
    """Tests stripping wake words and filler words from voice input."""
    raw = "Hey Jarvis, uh, can you tell me where I am right now?"
    clean = InputNormalizer.normalize(raw)
    assert "hey jarvis" not in clean.lower()
    assert "uh" not in clean.lower()
    assert "right now" not in clean.lower()
    assert "where i am" in clean.lower() or "where am i" in clean.lower()


def test_normalizer_self_corrections():
    """Tests resolving mid-sentence speech self-corrections/repairs."""
    raw1 = "What's my CPU... no, I mean RAM usage?"
    clean1 = InputNormalizer.normalize(raw1)
    assert "ram usage" in clean1.lower()

    raw2 = "Where is my college—sorry, where do I study?"
    clean2 = InputNormalizer.normalize(raw2)
    assert "where do i study" in clean2.lower()

    raw3 = "Where am I, no wait, where am I studying?"
    clean3 = InputNormalizer.normalize(raw3)
    assert "where am i studying" in clean3.lower()


# ==========================================
# 2. TYPED CHAT INTENT TESTS
# ==========================================

def test_chat_single_intents():
    """Tests single-intent detection for typed chat queries."""
    p1 = IntentEngine.analyze("What is my name?", channel="chat")
    assert p1.intents[0].domain == IntentDomain.PROFILE_IDENTITY

    p2 = IntentEngine.analyze("Where do I study?", channel="chat")
    assert p2.intents[0].domain == IntentDomain.PROFILE_EDUCATION

    p3 = IntentEngine.analyze("Where am I?", channel="chat")
    assert p3.intents[0].domain == IntentDomain.LOCATION

    p4 = IntentEngine.analyze("What projects am I working on?", channel="chat")
    assert p4.intents[0].domain == IntentDomain.PROFILE_PROJECTS

    p5 = IntentEngine.analyze("What's my CPU usage?", channel="chat")
    assert p5.intents[0].domain == IntentDomain.SYSTEM_METRICS
    assert p5.intents[0].entities.get("metric") == "cpu"

    p6 = IntentEngine.analyze("Is Ollama running?", channel="chat")
    assert p6.intents[0].domain == IntentDomain.OLLAMA_STATUS


def test_chat_multi_intents():
    """Tests multi-intent detection for compound typed queries."""
    p1 = IntentEngine.analyze("Where am I and where do I study?", channel="chat")
    domains = [i.domain for i in p1.intents]
    assert IntentDomain.LOCATION in domains
    assert IntentDomain.PROFILE_EDUCATION in domains

    p2 = IntentEngine.analyze("What's my CPU usage and is Ollama running?", channel="chat")
    domains2 = [i.domain for i in p2.intents]
    assert IntentDomain.SYSTEM_METRICS in domains2
    assert IntentDomain.OLLAMA_STATUS in domains2


# ==========================================
# 3. ADDITIONAL MULTI-INTENT DOMAIN TESTS
# ==========================================

def test_where_do_i_study_and_what_projects():
    """Tests 'Where do I study and what projects am I working on?'."""
    plan = IntentEngine.analyze("Where do I study and what projects am I working on?", channel="chat")
    domains = [i.domain for i in plan.intents]
    assert IntentDomain.PROFILE_EDUCATION in domains
    assert IntentDomain.PROFILE_PROJECTS in domains


def test_whats_my_name_studying_working_on():
    """Tests 'What's my name, what am I studying, and what am I working on?'."""
    plan = IntentEngine.analyze("What's my name, what am I studying, and what am I working on?", channel="chat")
    domains = [i.domain for i in plan.intents]
    assert IntentDomain.PROFILE_IDENTITY in domains
    assert IntentDomain.PROFILE_EDUCATION in domains
    assert IntentDomain.PROFILE_PROJECTS in domains


def test_where_am_i_where_do_i_study_projects():
    """Tests 'Where am I, where do I study, and what projects am I working on?'."""
    plan = IntentEngine.analyze("Where am I, where do I study, and what projects am I working on?", channel="chat")
    domains = [i.domain for i in plan.intents]
    assert IntentDomain.LOCATION in domains
    assert IntentDomain.PROFILE_EDUCATION in domains
    assert IntentDomain.PROFILE_PROJECTS in domains


def test_cpu_usage_and_projects():
    """Tests 'What's my CPU usage and what projects am I working on?'."""
    plan = IntentEngine.analyze("What's my CPU usage and what projects am I working on?", channel="chat")
    domains = [i.domain for i in plan.intents]
    assert IntentDomain.SYSTEM_METRICS in domains
    assert IntentDomain.PROFILE_PROJECTS in domains


# ==========================================
# 4. VOICE TRANSCRIPTION TESTS
# ==========================================

def test_voice_intents_matching_chat():
    """Tests voice transcriptions classifying identically to typed chat."""
    v1 = IntentEngine.analyze("Hey Jarvis, what's my name again?", channel="voice")
    assert v1.intents[0].domain == IntentDomain.PROFILE_IDENTITY

    v2 = IntentEngine.analyze("Jarvis where am I right now?", channel="voice")
    assert v2.intents[0].domain == IntentDomain.LOCATION

    v3 = IntentEngine.analyze("Uh can you tell me where I study?", channel="voice")
    assert v3.intents[0].domain == IntentDomain.PROFILE_EDUCATION

    v4 = IntentEngine.analyze("What's my CPU... no I mean RAM usage", channel="voice")
    assert v4.intents[0].domain == IntentDomain.SYSTEM_METRICS
    assert v4.intents[0].entities.get("metric") == "ram"

    v5 = IntentEngine.analyze("Where am I and where do I study again?", channel="voice")
    domains5 = [i.domain for i in v5.intents]
    assert IntentDomain.LOCATION in domains5
    assert IntentDomain.PROFILE_EDUCATION in domains5

    v6 = IntentEngine.analyze("What's my college—sorry, what degree am I doing?", channel="voice")
    assert v6.intents[0].domain == IntentDomain.PROFILE_EDUCATION


# ==========================================
# 5. FOLLOW-UP & CORRECTION TESTS
# ==========================================

def test_followup_queries():
    """Tests contextual follow-up questions using dialogue history."""
    history = [{"role": "user", "content": "What's my CPU usage?"}, {"role": "assistant", "content": "CPU usage is 12%."}]
    p1 = IntentEngine.analyze("And RAM?", channel="chat", conversation_history=history)
    assert p1.intents[0].domain == IntentDomain.SYSTEM_METRICS
    assert p1.intents[0].entities.get("metric") == "ram"

    p2 = IntentEngine.analyze("When do I graduate?", channel="chat")
    assert p2.intents[0].domain == IntentDomain.PROFILE_EDUCATION


def test_self_correction_override():
    """Tests that corrected right-side intent overrides abandoned left-side phrase."""
    p1 = IntentEngine.analyze("What's my CPU... no, GPU temperature?", channel="voice")
    assert p1.intents[0].domain == IntentDomain.SYSTEM_METRICS
    assert p1.intents[0].entities.get("metric") == "gpu_temp"

    p2 = IntentEngine.analyze("Where am I—sorry, where do I study?", channel="voice")
    assert p2.intents[0].domain == IntentDomain.PROFILE_EDUCATION


# ==========================================
# 6. CRITICAL MULTI-INTENT BUG VERIFICATION
# ==========================================

@pytest.mark.asyncio
async def test_madurai_education_and_projects_bug_fix(db_session: AsyncSession):
    """Verifies fix for user bug:
    'Hey Jarvis, I'm in Madurai right now, where do I study again and what projects am I working on?'

    Expected intents: PROFILE_EDUCATION and PROFILE_PROJECTS.
    Response must contain BOTH Amrita Vishwa Vidyapeetham AND InterviewSense AI / GeneCopilot AI / JARVIS.
    Madurai must NOT cause location-based hallucination.
    """
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(
        db_session,
        user_message="Hey Jarvis, I'm in Madurai right now, where do I study again and what projects am I working on?",
        channel="voice",
    )

    msg = res["message"]
    assert "Amrita Vishwa Vidyapeetham" in msg
    assert "InterviewSense AI" in msg or "JARVIS" in msg
    assert "Gandhigram" not in msg


@pytest.mark.asyncio
async def test_critical_test_19_madurai_voice_isolation(db_session: AsyncSession):
    """Critical Test 19: Voice prompt 'Hey Jarvis, I'm in Madurai right now. Where do I study and what am I studying?'"""
    chat_service = ChatService()
    res = await chat_service.handle_chat_request(
        db_session,
        user_message="Hey Jarvis, I'm in Madurai right now. Where do I study and what am I studying?",
        channel="voice",
    )

    msg = res["message"]
    assert "Amrita Vishwa Vidyapeetham" in msg
    assert "B.Tech" in msg
    assert "AI Engineering" in msg
    assert "Gandhigram" not in msg


@pytest.mark.asyncio
async def test_critical_test_20_quad_intent_execution(db_session: AsyncSession):
    """Critical Test 20: Quad-intent voice prompt"""
    plan = IntentEngine.analyze(
        user_message="Hey Jarvis, where am I, what do I study, what projects am I working on, and what am I preparing for?",
        channel="voice",
    )

    domains = [i.domain for i in plan.intents]
    assert IntentDomain.LOCATION in domains
    assert IntentDomain.PROFILE_EDUCATION in domains
    assert IntentDomain.PROFILE_PROJECTS in domains
    assert IntentDomain.PROFILE_CAREER in domains

    chat_service = ChatService()
    res = await chat_service.handle_chat_request(
        db_session,
        user_message="Hey Jarvis, where am I, what do I study, what projects am I working on, and what am I preparing for?",
        channel="voice",
    )

    msg = res["message"]
    assert "Location access is required" in msg
    assert "Amrita Vishwa Vidyapeetham" in msg
    assert "InterviewSense AI" in msg or "JARVIS" in msg
    assert "AI/ML Engineer" in msg
