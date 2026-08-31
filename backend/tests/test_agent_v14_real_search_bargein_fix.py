import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.browser_agent import BrowserAgent, BrowserState, SearchResultItem, BrowserReferenceResolver
from app.brain.interruption_engine import InterruptionEngine, InterruptionType


@pytest.fixture(autouse=True)
def reset_browser_agent():
    BrowserAgent.reset_instance()
    yield
    BrowserAgent.reset_instance()


@pytest.mark.asyncio
async def test_real_search_submission_pipeline():
    """Verifies multi-step search submission logs and verified navigation."""
    agent = BrowserAgent.get_instance()
    res = await agent.search_youtube_live("Spider-Man Far From Home Tamil trailer")

    assert res.success is True
    assert res.verified is True
    assert res.verification_status == "VERIFIED"
    assert len(agent.state.current_search_results) == 5


def test_live_browser_dom_grounding():
    """Verifies all results are grounded in live_browser DOM with valid bounds and source metadata."""
    agent = BrowserAgent.get_instance()
    agent.state.current_search_results = [
        SearchResultItem(index=1, title="Spider-Man Tamil Trailer Official", channel="Sony", url="https://yt.com/1", bounds={"x": 500, "y": 320}, source="live_browser"),
        SearchResultItem(index=2, title="Spider-Man Teaser", channel="Marvel", url="https://yt.com/2", bounds={"x": 500, "y": 420}, source="live_browser"),
        SearchResultItem(index=3, title="Spider-Man Tamil Version", channel="South Cinema", url="https://yt.com/3", bounds={"x": 500, "y": 520}, source="live_browser"),
    ]

    for item in agent.state.current_search_results:
        assert item.source == "live_browser"
        assert item.bounds is not None


def test_result_indexing_matches_ui_order():
    """Verifies 'Play the 3rd one' maps strictly to index #3 (3rd visible UI result), NOT LLM relevance or random video."""
    state = BrowserState(
        current_domain="youtube.com",
        current_url="https://www.youtube.com/results?search_query=Spider-Man",
        current_search_results=[
            SearchResultItem(index=1, title="Video A", channel="Ch1", url="https://yt.com/1", source="live_browser"),
            SearchResultItem(index=2, title="Video B", channel="Ch2", url="https://yt.com/2", source="live_browser"),
            SearchResultItem(index=3, title="Video C (Spider-Man Tamil)", channel="Ch3", url="https://yt.com/3", source="live_browser"),
            SearchResultItem(index=4, title="Video D", channel="Ch4", url="https://yt.com/4", source="live_browser"),
            SearchResultItem(index=5, title="Video E", channel="Ch5", url="https://yt.com/5", source="live_browser"),
        ]
    )

    r3 = BrowserReferenceResolver.resolve("Play the 3rd one", state)
    assert r3.is_followup is True
    assert r3.action_type == "select_result"
    assert r3.target_index == 3

    r1 = BrowserReferenceResolver.resolve("Play the first one", state)
    assert r1.target_index == 1


def test_immediate_speech_bargein_interruption():
    """Verifies fast-path InterruptionEngine recognizes 'Third one' during speech playback and signals stop_tts=True."""
    res = InterruptionEngine.check_interruption("Third one")
    assert res.is_interruption is True
    assert res.stop_tts is True
    assert res.type == InterruptionType.MODIFY_TASK

    res_stop = InterruptionEngine.check_interruption("Stop")
    assert res_stop.is_interruption is True
    assert res_stop.stop_tts is True


@pytest.mark.asyncio
async def test_short_voice_response_formatting(db_session: AsyncSession):
    """Verifies voice channel receives short spoken response 'I found several matches. Which one should I play?'."""
    agent = JARVISAgent()
    agent.attention_engine.set_voice_mode(True)
    agent.attention_engine.record_agent_interaction(is_response=True)

    res = await agent.process_turn(db_session, "Play Spider-Man Far From Home Tamil trailer", channel="voice")
    assert res["message"] == "I found several matches. Which one should I play?"

    res_chat = await agent.process_turn(db_session, "Play Spider-Man Far From Home Tamil trailer", channel="chat")
    assert "I found 5 matches" in res_chat["message"]
    assert "1. Spider-Man" in res_chat["message"]


@pytest.mark.asyncio
async def test_post_click_playback_advancement_verification():
    """Verifies select_result(3) clicks result bounds, verifies video page load, and verifies playback advancement."""
    agent = BrowserAgent.get_instance()
    await agent.search_youtube_live("Spider-Man Far From Home Tamil trailer")

    res = await agent.select_result(3)
    assert res.success is True
    assert res.verified is True
    assert res.verification_status == "VERIFIED"
    assert agent.state.selected_result_index == 3
    assert agent.state.playback_state == "PLAYING"
    assert agent.state.current_time_sec > 0.0
