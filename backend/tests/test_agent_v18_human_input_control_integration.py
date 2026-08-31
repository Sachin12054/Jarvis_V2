import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.os.keyboard_controller import KeyboardController
from app.agent.os.mouse_controller import MouseController
from app.agent.os.gesture_service import GestureControlService, GestureInterpreter
from app.cognition.command_router import CommandRouter
from app.execution.computer_gateway import ComputerUseGateway, ActionResult
from app.perception.world_model import WorldState, GestureState


@pytest.fixture(autouse=True)
def reset_input_singletons():
    KeyboardController.reset_instance()
    MouseController.reset_instance()
    GestureControlService.reset_instance()
    ComputerUseGateway.reset_instance()
    yield
    KeyboardController.reset_instance()
    MouseController.reset_instance()
    GestureControlService.reset_instance()
    ComputerUseGateway.reset_instance()


def test_keyboard_controller_methods():
    """Verifies KeyboardController dispatches real physical key combinations using pynput/pyautogui."""
    kb = KeyboardController.get_instance()

    res_type = kb.type_text("Hello JARVIS")
    assert res_type["verified"] is True

    res_press = kb.press("enter")
    assert res_press["verified"] is True

    res_hotkey = kb.hotkey("ctrl", "c")
    assert res_hotkey["verified"] is True

    assert kb.copy()["verified"] is True
    assert kb.paste()["verified"] is True
    assert kb.undo()["verified"] is True


def test_mouse_controller_methods():
    """Verifies MouseController dispatches real cursor movement, click, double click, right click, scroll, and drag."""
    mouse = MouseController.get_instance()

    pos = mouse.get_position()
    assert "x" in pos
    assert "y" in pos

    res_move = mouse.move_to(500, 300)
    assert res_move["verified"] is True

    res_click = mouse.click(500, 300)
    assert res_click["verified"] is True

    res_right = mouse.right_click(500, 300)
    assert res_right["verified"] is True

    res_double = mouse.double_click(500, 300)
    assert res_double["verified"] is True

    res_scroll = mouse.scroll(-3)
    assert res_scroll["verified"] is True


def test_gesture_interpreter_classification():
    """Verifies GestureInterpreter maps landmarks to normalized gesture actions."""
    interpreter = GestureInterpreter()

    # Empty landmarks
    res = interpreter.classify_landmarks([])
    assert res["gesture"] == "NONE"

    # Mock landmark structure with 21 coordinates
    class Landmark:
        def __init__(self, x, y):
            self.x = x
            self.y = y

    # V Gesture (Index tip up y=0.1, Middle tip up y=0.1 apart)
    landmarks_v = [Landmark(0.5, 0.5) for _ in range(21)]
    landmarks_v[8] = Landmark(0.4, 0.1)   # index_tip
    landmarks_v[6] = Landmark(0.4, 0.3)   # index_pip
    landmarks_v[12] = Landmark(0.5, 0.1)  # middle_tip
    landmarks_v[10] = Landmark(0.5, 0.3)  # middle_pip

    classified = interpreter.classify_landmarks(landmarks_v)
    assert classified["gesture"] in ["V", "MOVE_CURSOR"]
    assert classified["action"] in ["MOVE_CURSOR", "NONE"]


def test_gesture_control_service_lifecycle():
    """Verifies GestureControlService default state is OFF, activates on demand, and safely shuts down."""
    service = GestureControlService.get_instance()

    assert service.state.enabled is False

    res_enable = service.enable_gesture_control()
    assert res_enable["enabled"] is True
    assert res_enable["status"] == "ACTIVE"

    res_disable = service.disable_gesture_control()
    assert res_disable["enabled"] is False
    assert res_disable["status"] == "OFF"


@pytest.mark.asyncio
async def test_gesture_voice_gateway_routing():
    """Verifies gesture activation voice commands and physical click commands route through CommandRouter & ComputerUseGateway."""
    routed_enable = await CommandRouter.route("Jarvis, enable gesture control")
    assert routed_enable.is_routed is True
    assert routed_enable.command_type == "enable_gesture"
    assert "activated" in routed_enable.response_message.lower()

    routed_click = await CommandRouter.route("click")
    assert routed_click.is_routed is True
    assert routed_click.command_type == "click"

    routed_disable = await CommandRouter.route("Disable gesture control")
    assert routed_disable.is_routed is True
    assert routed_disable.command_type == "disable_gesture"
    assert "disabled" in routed_disable.response_message.lower()


def test_world_state_gesture_integration():
    """Verifies WorldState contains GestureState metadata."""
    ws = WorldState()
    assert hasattr(ws, "gesture")
    assert isinstance(ws.gesture, GestureState)
    assert ws.gesture.enabled is False


@pytest.mark.asyncio
async def test_gesture_api_endpoints(async_client: AsyncClient):
    """Verifies HTTP GET/POST endpoints for gesture control status, enable, and disable."""
    res_status = await async_client.get("/api/v1/gesture/status")
    assert res_status.status_code == 200
    assert res_status.json()["enabled"] is False

    res_enable = await async_client.post("/api/v1/gesture/enable")
    assert res_enable.status_code == 200
    assert res_enable.json()["enabled"] is True

    res_disable = await async_client.post("/api/v1/gesture/disable")
    assert res_disable.status_code == 200
    assert res_disable.json()["enabled"] is False
