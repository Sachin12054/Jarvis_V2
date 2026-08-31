from fastapi import APIRouter
from app.agent.os.gesture_service import GestureControlService

router = APIRouter(prefix="/api/v1/gesture", tags=["Gesture Control"])


@router.get("/status")
async def get_gesture_status():
    """Returns current gesture control service status."""
    service = GestureControlService.get_instance()
    return service.get_status()


@router.post("/enable")
async def enable_gesture_control():
    """Enables real-time camera capture and MediaPipe gesture interpretation."""
    service = GestureControlService.get_instance()
    return service.enable_gesture_control()


@router.post("/disable")
async def disable_gesture_control():
    """Disables camera capture and stops background gesture processing."""
    service = GestureControlService.get_instance()
    return service.disable_gesture_control()
