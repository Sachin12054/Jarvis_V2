from fastapi import APIRouter
from app.agent.os.live_desktop_monitor import LiveDesktopMonitorService, MonitorMode

router = APIRouter(prefix="/api/v1/desktop/monitor", tags=["Live Desktop Monitoring"])


@router.get("/status")
async def get_monitoring_status():
    """Returns current live desktop monitoring status and snapshot."""
    service = LiveDesktopMonitorService.get_instance()
    return {
        "monitor_state": service.state.model_dump(),
        "desktop_snapshot": service.current_desktop_state.model_dump(),
    }


@router.post("/start")
async def start_monitoring(mode: str = "CONTEXT", target_window: str = None, watch_condition: str = None):
    """Explicitly starts live desktop monitoring session."""
    service = LiveDesktopMonitorService.get_instance()
    m_mode = MonitorMode.WINDOW if mode == "WINDOW" else (MonitorMode.CONDITION if mode == "CONDITION" else MonitorMode.CONTEXT)
    state = await service.start_monitoring(mode=m_mode, target_window=target_window, watch_condition=watch_condition)
    return {"status": "success", "monitor_state": state.model_dump()}


@router.post("/stop")
async def stop_monitoring():
    """Explicitly stops live desktop monitoring session and cleans up resources."""
    service = LiveDesktopMonitorService.get_instance()
    state = await service.stop_monitoring()
    return {"status": "success", "monitor_state": state.model_dump()}


@router.post("/pause")
async def pause_monitoring():
    """Pauses active live desktop monitoring session."""
    service = LiveDesktopMonitorService.get_instance()
    state = await service.pause_monitoring()
    return {"status": "success", "monitor_state": state.model_dump()}


@router.post("/resume")
async def resume_monitoring():
    """Resumes paused live desktop monitoring session."""
    service = LiveDesktopMonitorService.get_instance()
    state = await service.resume_monitoring()
    return {"status": "success", "monitor_state": state.model_dump()}
