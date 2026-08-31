import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.cognition.cognitive_core import CognitiveCore
from app.cognition.reference_resolver import ReferenceResolver
from app.execution.computer_controller import ComputerController
from app.perception.browser_perception import BrowserPerception
from app.perception.desktop_perception import DesktopPerception
from app.perception.world_model import WorldState, SearchResultItem
from app.verification.action_verifier import ActionVerifier


@pytest.fixture(autouse=True)
def reset_cognitive_architecture():
    CognitiveCore.reset_instance()
    ComputerController.reset_instance()
    yield
    CognitiveCore.reset_instance()
    ComputerController.reset_instance()


def test_world_state_model_structure():
    """Verifies WorldState includes desktop, browser, files, system, voice, phone, and task sub-states."""
    state = WorldState()
    assert state.desktop is not None
    assert state.browser is not None
    assert state.files is not None
    assert state.system is not None
    assert state.voice is not None
    assert state.phone is not None
    assert state.task is not None
    assert state.source_of_truth == "win32_os_and_live_browser"


def test_desktop_and_browser_perception():
    """Verifies DesktopPerception and BrowserPerception inspect Win32 OS APIs and populate active state."""
    d_perc = DesktopPerception.get_instance()
    b_perc = BrowserPerception.get_instance()

    d_state = d_perc.perceive_desktop()
    b_state = b_perc.perceive_browser()

    assert d_state.active_application is not None
    assert d_state.active_window is not None
    assert b_state.browser_name in ["Chrome", "Browser"]


@pytest.mark.asyncio
async def test_unified_computer_controller():
    """Verifies ComputerController facade executes open_application, open_youtube_tab, search_youtube_live, and select_youtube_result."""
    controller = ComputerController.get_instance()

    res_app = await controller.open_application("Chrome")
    assert res_app.success is True
    assert res_app.verified is True

    res_yt = await controller.open_youtube_tab(force_new_tab=False)
    assert res_yt.success is True
    assert res_yt.verified is True

    res_srch = await controller.search_youtube_live("Spider-Man Far From Home Tamil trailer")
    assert res_srch.success is True
    assert res_srch.verified is True

    res_sel = await controller.select_youtube_result(3)
    assert res_sel.success is True
    assert res_sel.verified is True


def test_action_verifier_authoritative_proof():
    """Verifies ActionVerifier returns empirical verification proof for application launches and media playback."""
    verifier = ActionVerifier.get_instance()

    res_app = verifier.verify_application_launch("Chrome")
    assert res_app.verified is True
    assert res_app.status == "VERIFIED"

    res_pb = verifier.verify_browser_playback("PLAYING", 2.5)
    assert res_pb.verified is True
    assert res_pb.status == "VERIFIED"


@pytest.mark.asyncio
async def test_cognitive_core_loop_end_to_end():
    """Verifies CognitiveCore executes full PERCEIVE -> UNDERSTAND -> REASON -> PLAN -> ACT -> OBSERVE -> VERIFY loop."""
    core = CognitiveCore.get_instance()

    res = await core.process_goal("Open YouTube", channel="chat")
    assert res.action_executed is True
    assert res.verified is True
    assert "YouTube" in res.message or "navigated" in res.message.lower() or "open" in res.message.lower()


def test_natural_reference_resolution_against_world_state():
    """Verifies ReferenceResolver maps 'Play the 3rd one' to target_index=3 against active WorldState."""
    world = WorldState()
    world.browser.search_results = [
        SearchResultItem(index=1, title="A", channel="C1", url="https://yt.com/1"),
        SearchResultItem(index=2, title="B", channel="C2", url="https://yt.com/2"),
        SearchResultItem(index=3, title="C", channel="C3", url="https://yt.com/3"),
    ]

    ref = ReferenceResolver.resolve("Play the 3rd one", world)
    assert ref.is_reference is True
    assert ref.reference_type == "select_result"
    assert ref.target_index == 3
