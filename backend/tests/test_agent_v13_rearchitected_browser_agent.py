import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.browser_agent import BrowserAgent, BrowserState, TabInfo, SearchResultItem


@pytest.fixture(autouse=True)
def reset_browser_agent():
    BrowserAgent.reset_instance()
    yield
    BrowserAgent.reset_instance()


def test_list_tabs_and_tab_reuse():
    """Verifies list_tabs() enumerates tabs and resolve_youtube_tab() enforces tab reuse policy."""
    agent = BrowserAgent.get_instance()
    tabs = agent.list_tabs()

    assert isinstance(tabs, list)
    assert len(tabs) > 0
    assert isinstance(tabs[0], TabInfo)

    # Resolve existing YouTube tab
    res = agent.resolve_youtube_tab(force_new_tab=False)
    assert res["reused"] is True
    assert "YouTube is already open" in res["message"] or "navigated" in res["message"].lower()


def test_explicit_new_tab_request():
    """Verifies explicit new tab request spawns a new tab."""
    agent = BrowserAgent.get_instance()
    res = agent.resolve_youtube_tab(force_new_tab=True)
    assert res["reused"] is False
    assert "new tab" in res["message"].lower()


@pytest.mark.asyncio
async def test_live_search_mouse_keyboard_flow():
    """Verifies live search clicks search bar, types query, presses enter, and populates 5 indexed results."""
    agent = BrowserAgent.get_instance()
    res = await agent.search_youtube_live("Spider-Man Far From Home Tamil trailer")

    assert res.success is True
    assert res.verified is True
    assert len(agent.state.current_search_results) == 5
    assert agent.state.current_search_results[0].index == 1
    assert agent.state.current_search_results[0].channel == "Sony Pictures"


@pytest.mark.asyncio
async def test_result_selection_and_playback_verification():
    """Verifies select_result(1) clicks result bounds and verifies video loading and playback state."""
    agent = BrowserAgent.get_instance()
    await agent.search_youtube_live("Spider-Man Far From Home Tamil trailer")

    res = await agent.select_result(1)
    assert res.success is True
    assert res.verified is True
    assert agent.state.selected_result_index == 1
    assert agent.state.playback_state == "PLAYING"


@pytest.mark.asyncio
async def test_full_human_like_browser_workflow(db_session: AsyncSession):
    """Verifies complete multi-turn dialogue workflow: tab reuse -> live search -> result clarification -> selection -> pause -> resume -> new tab."""
    agent = JARVISAgent()

    # Turn 1: Open YouTube (Reuses existing tab)
    r1 = await agent.process_turn(db_session, "Open YouTube.", channel="chat")
    assert "already open" in r1["message"] or "navigated" in r1["message"].lower()

    # Turn 2: Search for Spider-Man (Types query & presents options)
    r2 = await agent.process_turn(db_session, "Search for Spider-Man Far From Home Tamil trailer.", channel="chat")
    assert "I found 5 matches" in r2["message"]
    assert "1. Spider-Man Far From Home Tamil Trailer Official Trailer" in r2["message"]

    # Turn 3: "First one" (Clicks result #1 & plays)
    r3 = await agent.process_turn(db_session, "First one.", channel="chat")
    assert "Playing video #1" in r3["message"]

    # Turn 4: "Pause"
    r4 = await agent.process_turn(db_session, "Pause.", channel="chat")
    assert "Paused video" in r4["message"]

    # Turn 5: "Resume"
    r5 = await agent.process_turn(db_session, "Resume.", channel="chat")
    assert "Resumed video" in r5["message"]

    # Turn 6: "Open YouTube in a new tab" (Spawns new tab)
    r6 = await agent.process_turn(db_session, "Open YouTube in a new tab.", channel="chat")
    assert "new tab" in r6["message"].lower()
