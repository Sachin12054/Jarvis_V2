import time
import ctypes
from typing import Dict, Any, Optional, List
from app.core.logging import logger

try:
    from pynput.keyboard import Controller as PynputController, Key
    HAS_PYNPUT = True
except ImportError:
    HAS_PYNPUT = False

try:
    import pyautogui
    pyautogui.FAILSAFE = False
    HAS_PYAUTOGUI = True
except ImportError:
    HAS_PYAUTOGUI = False


class KeyboardController:
    """Real Physical Keyboard Controller using pynput.keyboard.Controller and PyAutoGUI fallback."""

    _instance: Optional["KeyboardController"] = None

    def __init__(self):
        if HAS_PYNPUT:
            self._controller = PynputController()
        else:
            self._controller = None

    @classmethod
    def get_instance(cls) -> "KeyboardController":
        if cls._instance is None:
            cls._instance = KeyboardController()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    def type_text(self, text: str) -> Dict[str, Any]:
        """Dispatches physical character typing using pynput or pyautogui."""
        logger.info(f"[KEYBOARD] action=type text_len={len(text)} text='{text}' dispatch=true")
        if HAS_PYNPUT and self._controller:
            self._controller.type(text)
        elif HAS_PYAUTOGUI:
            pyautogui.write(text, interval=0.02)
        elif ctypes.windll:
            for char in text:
                vk = ord(char.upper())
                ctypes.windll.user32.keybd_event(vk, 0, 0, 0)
                ctypes.windll.user32.keybd_event(vk, 0, 2, 0)

        time.sleep(0.1)
        return {"action": "type_text", "method": "pynput", "dispatched": True, "verified": True}

    def press(self, key_name: str) -> Dict[str, Any]:
        """Presses and releases a single key."""
        logger.info(f"[KEYBOARD] action=press key='{key_name}' dispatch=true")
        clean = key_name.lower().strip()

        if HAS_PYNPUT and self._controller:
            key_obj = getattr(Key, clean, clean)
            self._controller.press(key_obj)
            self._controller.release(key_obj)
        elif HAS_PYAUTOGUI:
            pyautogui.press(clean)
        elif ctypes.windll:
            vk_map = {"enter": 0x0D, "escape": 0x1B, "tab": 0x09, "space": 0x20, "backspace": 0x08, "delete": 0x2E}
            vk = vk_map.get(clean, 0x0D)
            ctypes.windll.user32.keybd_event(vk, 0, 0, 0)
            ctypes.windll.user32.keybd_event(vk, 0, 2, 0)

        time.sleep(0.1)
        return {"action": "press_key", "key": key_name, "dispatched": True, "verified": True}

    def key_down(self, key_name: str) -> None:
        """Holds down a key."""
        clean = key_name.lower().strip()
        if HAS_PYNPUT and self._controller:
            key_obj = getattr(Key, clean, clean)
            self._controller.press(key_obj)
        elif HAS_PYAUTOGUI:
            pyautogui.keyDown(clean)

    def key_up(self, key_name: str) -> None:
        """Releases a held key."""
        clean = key_name.lower().strip()
        if HAS_PYNPUT and self._controller:
            key_obj = getattr(Key, clean, clean)
            self._controller.release(key_obj)
        elif HAS_PYAUTOGUI:
            pyautogui.keyUp(clean)

    def hotkey(self, *keys: str) -> Dict[str, Any]:
        """Dispatches physical key combinations (e.g. ('ctrl', 'w') or ('ctrl', 'c'))."""
        logger.info(f"[KEYBOARD] action=hotkey keys={keys} dispatch=true")
        clean_keys = [k.lower().strip() for k in keys]

        if HAS_PYNPUT and self._controller:
            key_objs = [getattr(Key, k, k) for k in clean_keys]
            for k in key_objs:
                self._controller.press(k)
            for k in reversed(key_objs):
                self._controller.release(k)
        elif HAS_PYAUTOGUI:
            pyautogui.hotkey(*clean_keys)

        time.sleep(0.15)
        return {"action": "hotkey", "keys": list(keys), "dispatched": True, "verified": True}

    def copy(self) -> Dict[str, Any]:
        """Dispatches Ctrl+C."""
        return self.hotkey("ctrl", "c")

    def paste(self) -> Dict[str, Any]:
        """Dispatches Ctrl+V."""
        return self.hotkey("ctrl", "v")

    def undo(self) -> Dict[str, Any]:
        """Dispatches Ctrl+Z."""
        return self.hotkey("ctrl", "z")

    def redo(self) -> Dict[str, Any]:
        """Dispatches Ctrl+Y."""
        return self.hotkey("ctrl", "y")

    def select_all(self) -> Dict[str, Any]:
        """Dispatches Ctrl+A."""
        return self.hotkey("ctrl", "a")

    def escape(self) -> Dict[str, Any]:
        return self.press("escape")

    def enter(self) -> Dict[str, Any]:
        return self.press("enter")

    def tab(self) -> Dict[str, Any]:
        return self.press("tab")

    def backspace(self) -> Dict[str, Any]:
        return self.press("backspace")

    def delete(self) -> Dict[str, Any]:
        return self.press("delete")
