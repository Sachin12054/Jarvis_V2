import os
import glob
import time
import base64
import ctypes
from typing import Dict, Any, Optional
from PIL import Image
from app.core.logging import logger


class ScreenCaptureService:
    """Screen Capture Service: Captures active desktop screen or active window on demand via mss, Win32 GDI, or PIL."""

    def __init__(self, capture_dir: str = "app/brain/scratch"):
        self.capture_dir = capture_dir
        os.makedirs(self.capture_dir, exist_ok=True)
        self._last_capture: Optional[Dict[str, Any]] = None
        self._last_capture_time: float = 0.0

    def cleanup_temp_screenshots(self, max_files: int = 10) -> None:
        """Cleans up old temporary screenshot files from scratch storage."""
        try:
            files = sorted(
                glob.glob(os.path.join(self.capture_dir, "screen_capture_*.png")),
                key=os.path.getmtime
            )
            if len(files) > max_files:
                for f in files[:-max_files]:
                    try:
                        os.remove(f)
                    except Exception:
                        pass
        except Exception as err:
            logger.warning(f"[SCREEN CAPTURE] Cleanup warning: {err}")

    def capture_screen(
        self,
        mode: str = "full_screen",
        force_refresh: bool = False,
        min_interval_seconds: float = 0.25,  # 250ms max TTL for fresh screen queries
    ) -> Dict[str, Any]:
        """Captures desktop screen image on demand while ensuring freshness for visual queries."""
        logger.info("[VISION] capture_requested=true")
        now = time.time()

        if not force_refresh and self._last_capture and (now - self._last_capture_time) < min_interval_seconds:
            logger.info("[SCREEN CAPTURE] Returning cached fresh screen capture (<250ms).")
            return self._last_capture

        self.cleanup_temp_screenshots(max_files=10)
        timestamp = now
        file_path = os.path.join(self.capture_dir, f"screen_capture_{int(timestamp * 1000)}.png")
        width, height = 0, 0
        captured = False

        # Method 1: mss package
        try:
            import mss
            with mss.mss() as sct:
                monitor = sct.monitors[1] if len(sct.monitors) > 1 else sct.monitors[0]
                sct_img = sct.grab(monitor)
                img = Image.frombytes("RGB", sct_img.size, sct_img.bgra, "raw", "BGRX")
                width, height = img.size
                img.save(file_path, "PNG")
                captured = True
        except Exception as err:
            logger.warning(f"[SCREEN CAPTURE] mss capture attempt failed: {err}")

        # Method 2: Win32 GDI ctypes fallback
        if not captured:
            try:
                width, height = self._win32_gdi_capture(file_path)
                captured = True
            except Exception as err:
                logger.warning(f"[SCREEN CAPTURE] Win32 GDI capture attempt failed: {err}")

        # Method 3: PIL ImageGrab fallback
        if not captured:
            try:
                from PIL import ImageGrab
                img = ImageGrab.grab()
                width, height = img.size
                img.save(file_path, "PNG")
                captured = True
            except Exception as err:
                logger.warning(f"[SCREEN CAPTURE] PIL ImageGrab capture failed: {err}")

        if not captured or not os.path.exists(file_path):
            logger.error("[SCREEN CAPTURE] All screen capture mechanisms failed.")
            return {
                "timestamp": timestamp,
                "mode": mode,
                "width": 0,
                "height": 0,
                "file_path": "",
                "base64_image": "",
                "status": "error",
                "error": "Screen capture failed on current display context.",
            }

        # Encode base64 for vision models
        with open(file_path, "rb") as f:
            b64_data = base64.b64encode(f.read()).decode("utf-8")

        res = {
            "timestamp": timestamp,
            "mode": mode,
            "width": width,
            "height": height,
            "file_path": file_path,
            "base64_image": b64_data,
            "status": "captured",
        }
        self._last_capture = res
        self._last_capture_time = now

        # Perception verification log requirement
        logger.info("[VISION] screenshot_captured=true")
        logger.info(f"[VISION] capture_timestamp={timestamp}")
        logger.info(f"[VISION] screen_width={width}")
        logger.info(f"[VISION] screen_height={height}")
        return res

    def _win32_gdi_capture(self, output_path: str) -> tuple[int, int]:
        """Performs raw Win32 GDI BitBlt screen capture via ctypes."""
        user32 = ctypes.windll.user32
        gdi32 = ctypes.windll.gdi32

        width = user32.GetSystemMetrics(0)
        height = user32.GetSystemMetrics(1)

        hdeskdc = user32.GetDC(0)
        hmemdc = gdi32.CreateCompatibleDC(hdeskdc)
        hbitmap = gdi32.CreateCompatibleBitmap(hdeskdc, width, height)

        gdi32.SelectObject(hmemdc, hbitmap)
        gdi32.BitBlt(hmemdc, 0, 0, width, height, hdeskdc, 0, 0, 0x00CC0020)

        class BITMAPINFOHEADER(ctypes.Structure):
            _fields_ = [
                ('biSize', ctypes.c_uint32),
                ('biWidth', ctypes.c_int32),
                ('biHeight', ctypes.c_int32),
                ('biPlanes', ctypes.c_uint16),
                ('biBitCount', ctypes.c_uint16),
                ('biCompression', ctypes.c_uint32),
                ('biSizeImage', ctypes.c_uint32),
                ('biXPelsPerMeter', ctypes.c_int32),
                ('biYPelsPerMeter', ctypes.c_int32),
                ('biClrUsed', ctypes.c_uint32),
                ('biClrImportant', ctypes.c_uint32),
            ]

        bmi = BITMAPINFOHEADER()
        bmi.biSize = ctypes.sizeof(BITMAPINFOHEADER)
        bmi.biWidth = width
        bmi.biHeight = -height
        bmi.biPlanes = 1
        bmi.biBitCount = 32
        bmi.biCompression = 0

        buffer = ctypes.create_string_buffer(width * height * 4)
        gdi32.GetDIBits(hmemdc, hbitmap, 0, height, buffer, ctypes.byref(bmi), 0)

        image = Image.frombytes('RGBA', (width, height), buffer, 'raw', 'BGRA')
        image.save(output_path, 'PNG')

        gdi32.DeleteObject(hbitmap)
        gdi32.DeleteDC(hmemdc)
        user32.ReleaseDC(0, hdeskdc)
        return width, height
