import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.os.browser_agent import BrowserAgent, BrowserState, BrowserReferenceResolver, SearchResultItem


@pytest.fixture(autouse=True)
def reset_browser_agent():
    BrowserAgent.reset_instance()
    yield
    BrowserAgent.reset_instance()


def test_browser_reference_resolver():
    """Verifies BrowserReferenceResolver maps contextual phrases to active BrowserState results without new searches."""
    state = BrowserState(
        current_domain="youtube.com",
        current_url="https://www.youtube.com/results?search_query=Spider-Man",
        current_search_results=[
            SearchResultItem(index=1, title="Spider-Man Trailer 1", channel="Sony", url="https://youtube.com/watch?v=1"),
            SearchResultItem(index=2, title="Spider-Man Trailer 2", channel="Marvel", url="https://youtube.com/watch?v=2"),
        ]
    )

    r1 = BrowserReferenceResolver.resolve("Play the first video", state)
    assert r1.is_followup is True
    assert r1.action_type == "select_result"
    assert r1.target_index == 1

    r2 = BrowserReferenceResolver.resolve("No, play the second one", state)
    assert r2.is_followup is True
    assert r2.action_type == "select_result"
    assert r2.target_index == 2

    r3 = BrowserReferenceResolver.resolve("Pause", state)
    assert r3.is_followup is True
    assert r3.action_type == "pause"

    r4 = BrowserReferenceResolver.resolve("Resume", state)
    assert r4.is_followup is True
    assert r4.action_type == "resume"

    r5 = BrowserReferenceResolver.resolve("Go back", state)
    assert r5.is_followup is True
    assert r5.action_type == "go_back"


@pytest.mark.asyncio
async def test_multi_turn_youtube_search_and_followup_selection(db_session: AsyncSession):
    """Verifies multi-turn dialogue flow resolves 'Play the first video' to result #1 without triggering a new search."""
    agent = JARVISAgent()

    # Turn 1: Open YouTube
    res1 = await agent.process_turn(db_session, "Open YouTube.", channel="chat")
    assert "YouTube" in res1["message"] or "navigated" in res1["message"].lower()

    # Turn 2: Search for trailer
    res2 = await agent.process_turn(db_session, "Search for Spider-Man Far From Home Tamil trailer.", channel="chat")
    assert "found 5 matches" in res2["message"].lower() or "search results" in res2["message"].lower()

    # Turn 3: "Play the first video" -> Contextual follow-up (NO new search!)
    res3 = await agent.process_turn(db_session, "Play the first video.", channel="chat")
    assert "Playing video #1" in res3["message"] or "Official Trailer" in res3["message"]

    # Turn 4: "No, play the second one" -> Contextual follow-up
    res4 = await agent.process_turn(db_session, "No, play the second one.", channel="chat")
    assert "Playing video #2" in res4["message"] or "Teaser" in res4["message"]

    # Turn 5: "Pause"
    res5 = await agent.process_turn(db_session, "Pause.", channel="chat")
    assert "Paused video" in res5["message"]

    # Turn 6: "Resume"
    res6 = await agent.process_turn(db_session, "Resume.", channel="chat")
    assert "Resumed video" in res6["message"]
