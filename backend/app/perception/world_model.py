import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.agent.os.gesture_service import GestureState


class DesktopState(BaseModel):
    active_application: Optional[str] = "Desktop"
    active_window: Optional[str] = "Desktop"
    window_handle: Optional[int] = None
    window_bounds: Dict[str, int] = Field(default_factory=lambda: {"x": 0, "y": 0, "w": 1920, "h": 1080})
    foreground_status: bool = True
    minimized_status: bool = False
    process_id: Optional[int] = None


class BrowserTab(BaseModel):
    tab_id: int
    window_id: Optional[int] = None
    title: str
    url: Optional[str] = None
    domain: Optional[str] = None
    active: bool = False
    visible: bool = True


class SearchResultItem(BaseModel):
    index: int
    title: str
    channel: str
    url: str
    bounds: Optional[Dict[str, int]] = None
    source: str = "live_browser"
    timestamp: float = Field(default_factory=time.time)
    confidence: float = 1.0


class BrowserState(BaseModel):
    browser_name: str = "Chrome"
    browser_window: Optional[str] = None
    tabs: List[BrowserTab] = Field(default_factory=list)
    active_tab: Optional[str] = None
    current_url: Optional[str] = None
    page_type: str = "unknown"  # "home" | "search_results" | "video_page" | "unknown"
    search_query: Optional[str] = None
    search_results: List[SearchResultItem] = Field(default_factory=list)
    selected_result_index: Optional[int] = None
    playback_state: str = "STOPPED"  # "NOT_LOADED" | "LOADED" | "PAUSED" | "PLAYING" | "ENDED" | "UNKNOWN"
    current_time_sec: float = 0.0


class FileState(BaseModel):
    current_directory: str = r"c:\Users\sachi\Desktop\Jarvis"
    current_file: Optional[str] = None
    opened_files: List[str] = Field(default_factory=list)
    recent_files: List[str] = Field(default_factory=list)
    project_context: Optional[str] = "JARVIS"


class SystemState(BaseModel):
    cpu_percent: float = 0.0
    ram_percent: float = 0.0
    gpu_percent: float = 0.0
    active_processes_count: int = 0
    backend_running: bool = True
    backend_port: int = 8000


class VoiceState(BaseModel):
    voice_mode: bool = False
    listening: bool = False
    speaking: bool = False
    thinking: bool = False
    acting: bool = False
    interrupted: bool = False


class PhoneState(BaseModel):
    connected_device: Optional[str] = None
    device_state: str = "DISCONNECTED"  # "CONNECTED" | "DISCONNECTED"
    application_context: Optional[str] = None


class TaskState(BaseModel):
    active_goal: Optional[str] = None
    task_id: Optional[str] = None
    plan_version: int = 1
    current_phase: str = "IDLE"  # "IDLE" | "PLANNING" | "EXECUTING" | "VERIFYING" | "AWAITING_CHOICE"
    pending_user_choice: bool = False
    pending_question: Optional[str] = None


class WorldState(BaseModel):
    """Central Persistent Working World Model representing real computer reality."""

    desktop: DesktopState = Field(default_factory=DesktopState)
    browser: BrowserState = Field(default_factory=BrowserState)
    files: FileState = Field(default_factory=FileState)
    system: SystemState = Field(default_factory=SystemState)
    voice: VoiceState = Field(default_factory=VoiceState)
    gesture: GestureState = Field(default_factory=GestureState)
    phone: PhoneState = Field(default_factory=PhoneState)
    task: TaskState = Field(default_factory=TaskState)
    timestamp: float = Field(default_factory=time.time)
    source_of_truth: str = "win32_os_and_live_browser"
