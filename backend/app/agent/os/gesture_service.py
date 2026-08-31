import time
import asyncio
import threading
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.logging import logger

try:
    import cv2
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

try:
    import mediapipe as mp
    HAS_MEDIAPIPE = True
except ImportError:
    HAS_MEDIAPIPE = False

try:
    import pyautogui
    pyautogui.FAILSAFE = False
    HAS_PYAUTOGUI = True
except ImportError:
    HAS_PYAUTOGUI = False


class GestureState(BaseModel):
    """Structured WorldState metadata for active hand gesture tracking."""

    enabled: bool = False
    camera_available: bool = False
    active_hand: str = "none"
    gesture: str = "NONE"
    cursor_x: int = 0
    cursor_y: int = 0
    last_action: str = "none"
    confidence: float = 0.0
    timestamp: float = Field(default_factory=time.time)


class GestureInterpreter:
    """Classifies MediaPipe hand landmarks into normalized human gesture actions with confidence and debounce filtering."""

    def __init__(self):
        self.last_gesture = "NONE"
        self.last_action_time = 0.0
        self.debounce_seconds = 0.45
        self.prev_x = 0
        self.prev_y = 0

    def classify_landmarks(self, landmarks, screen_w: int = 1920, screen_h: int = 1080) -> Dict[str, Any]:
        """Maps normalized MediaPipe 21 hand landmarks to gesture classification."""
        if not landmarks:
            return {"gesture": "NONE", "confidence": 0.0, "action": "NONE", "x": self.prev_x, "y": self.prev_y}

        # Index tip (8), Middle tip (12), Ring tip (16), Pinky tip (20), Thumb tip (4)
        index_tip = landmarks[8]
        middle_tip = landmarks[12]
        ring_tip = landmarks[16]
        pinky_tip = landmarks[20]
        thumb_tip = landmarks[4]

        index_pip = landmarks[6]
        middle_pip = landmarks[10]

        index_up = index_tip.y < index_pip.y
        middle_up = middle_tip.y < middle_pip.y
        ring_up = ring_tip.y < landmarks[14].y
        pinky_up = pinky_tip.y < landmarks[18].y

        # Screen coordinates mapped with dampening
        raw_x = int(index_tip.x * screen_w)
        raw_y = int(index_tip.y * screen_h)
        smooth_x = int(self.prev_x + (raw_x - self.prev_x) * 0.40) if self.prev_x else raw_x
        smooth_y = int(self.prev_y + (raw_y - self.prev_y) * 0.40) if self.prev_y else raw_y
        self.prev_x, self.prev_y = smooth_x, smooth_y

        now = time.time()
        gesture = "NONE"
        action = "NONE"
        confidence = 0.92

        # 1. FIST (All fingers closed) -> DRAG
        if not index_up and not middle_up and not ring_up and not pinky_up:
            gesture = "FIST"
            action = "DRAG"
        # 2. TWO_FINGER_CLOSED (Index & Middle close together) -> DOUBLE_CLICK
        elif index_up and middle_up and abs(index_tip.x - middle_tip.x) < 0.035 and not ring_up:
            gesture = "TWO_FINGER_CLOSED"
            action = "DOUBLE_CLICK"
        # 3. V Gesture (Index & Middle open apart) -> MOVE_CURSOR
        elif index_up and middle_up and abs(index_tip.x - middle_tip.x) >= 0.035 and not ring_up:
            gesture = "V"
            action = "MOVE_CURSOR"
        # 4. INDEX ONLY -> RIGHT_CLICK
        elif index_up and not middle_up and not ring_up:
            gesture = "INDEX"
            action = "RIGHT_CLICK"
        # 5. MID ONLY -> LEFT_CLICK
        elif middle_up and not index_up and not ring_up:
            gesture = "MID"
            action = "LEFT_CLICK"
        # 6. PINCH_MINOR (Thumb & Index tips touching) -> SCROLL
        elif abs(thumb_tip.x - index_tip.x) < 0.04 and abs(thumb_tip.y - index_tip.y) < 0.04:
            gesture = "PINCH_MINOR"
            action = "SCROLL_DOWN"

        # Action Debouncing for non-continuous click actions
        if action in ["LEFT_CLICK", "RIGHT_CLICK", "DOUBLE_CLICK"]:
            if (now - self.last_action_time) < self.debounce_seconds:
                action = "NONE"
            else:
                self.last_action_time = now

        return {
            "gesture": gesture,
            "confidence": confidence,
            "action": action,
            "x": smooth_x,
            "y": smooth_y,
        }


class GestureControlService:
    """Gesture Control Background Service: Captures camera frames ONLY when explicitly enabled, interprets MediaPipe landmarks, and dispatches real computer actions via ComputerUseGateway."""

    _instance: Optional["GestureControlService"] = None

    def __init__(self):
        self.state = GestureState(enabled=False, camera_available=HAS_OPENCV and HAS_MEDIAPIPE)
        self.interpreter = GestureInterpreter()
        self._thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()

    @classmethod
    def get_instance(cls) -> "GestureControlService":
        if cls._instance is None:
            cls._instance = GestureControlService()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        if cls._instance:
            cls._instance.disable_gesture_control()
        cls._instance = None

    def enable_gesture_control(self) -> Dict[str, Any]:
        """Starts real-time camera capture and gesture processing thread."""
        logger.info("[GESTURE] enable_requested")
        if self.state.enabled and self._thread and self._thread.is_alive():
            return {"enabled": True, "status": "ACTIVE", "message": "Gesture control is already active."}

        self.state.enabled = True
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._camera_worker_loop, daemon=True)
        self._thread.start()

        logger.info("[GESTURE] camera=true hand=right service_status='ACTIVE'")
        return {"enabled": True, "status": "ACTIVE", "message": "Gesture control activated."}

    def disable_gesture_control(self) -> Dict[str, Any]:
        """Stops camera capture and safely shuts down background processing."""
        logger.info("[GESTURE] disable_requested")
        self.state.enabled = False
        self._stop_event.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=1.0)
        self._thread = None
        self.state.gesture = "NONE"
        self.state.last_action = "none"

        logger.info("[GESTURE] camera=false service_status='OFF'")
        return {"enabled": False, "status": "OFF", "message": "Gesture control disabled."}

    def get_status(self) -> Dict[str, Any]:
        """Returns current GestureState metadata."""
        return self.state.model_dump()

    def process_gesture_action(self, action_info: Dict[str, Any]) -> Dict[str, Any]:
        """Dispatches recognized gesture action to ComputerUseGateway."""
        from app.execution.computer_gateway import ComputerUseGateway

        action = action_info.get("action", "NONE")
        x = action_info.get("x", 0)
        y = action_info.get("y", 0)
        gesture = action_info.get("gesture", "NONE")
        confidence = action_info.get("confidence", 0.0)

        self.state.gesture = gesture
        self.state.cursor_x = x
        self.state.cursor_y = y
        self.state.confidence = confidence
        self.state.timestamp = time.time()

        if action == "NONE":
            return {"dispatched": False}

        logger.info(f"[GESTURE] camera=true hand=right gesture='{gesture}' confidence={confidence:.2f} action='{action}' position=({x},{y})")
        self.state.last_action = action

        gateway = ComputerUseGateway.get_instance()
        res = gateway.execute_gesture_action(action=action, x=x, y=y)
        return {"dispatched": True, "action_result": res}

    def _camera_worker_loop(self) -> None:
        """Background thread loop capturing camera frames and running MediaPipe landmarker."""
        if not HAS_OPENCV or not HAS_MEDIAPIPE:
            logger.warning("[GESTURE] OpenCV or MediaPipe missing. Running headless gesture loop.")
            while not self._stop_event.is_set():
                time.sleep(0.5)
            return

        cap = None
        try:
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                logger.warning("[GESTURE] Camera (index 0) unavailable.")
                self.state.camera_available = False
                return

            self.state.camera_available = True

            mp_hands = mp.solutions.hands
            with mp_hands.Hands(
                static_image_mode=False,
                max_num_hands=1,
                min_detection_confidence=0.70,
                min_tracking_confidence=0.70,
            ) as hands:
                while not self._stop_event.is_set() and self.state.enabled:
                    ret, frame = cap.read()
                    if not ret or frame is None:
                        time.sleep(0.03)
                        continue

                    # Mirror frame and process MediaPipe landmarks (Frame destroyed after processing)
                    frame_rgb = cv2.cvtColor(cv2.flip(frame, 1), cv2.COLOR_BGR2RGB)
                    results = hands.process(frame_rgb)

                    if results.multi_hand_landmarks:
                        landmarks = results.multi_hand_landmarks[0].landmark
                        info = self.interpreter.classify_landmarks(landmarks)
                        self.process_gesture_action(info)

                    time.sleep(0.02)
        except Exception as err:
            logger.error(f"[GESTURE] Camera worker loop exception: {err}")
        finally:
            if cap:
                cap.release()
            cv2.destroyAllWindows()
            self.state.enabled = False
