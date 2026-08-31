import os
import ctypes
from PIL import Image

def win32_gdi_screenshot(output_path: str):
    user32 = ctypes.windll.user32
    gdi32 = ctypes.windll.gdi32

    width = user32.GetSystemMetrics(0)
    height = user32.GetSystemMetrics(1)

    hdeskdc = user32.GetDC(0)
    hmemdc = gdi32.CreateCompatibleDC(hdeskdc)
    hbitmap = gdi32.CreateCompatibleBitmap(hdeskdc, width, height)

    gdi32.SelectObject(hmemdc, hbitmap)
    gdi32.BitBlt(hmemdc, 0, 0, width, height, hdeskdc, 0, 0, 0x00CC0020)

    # Convert BITMAP to PIL Image
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
    bmi.biHeight = -height  # Top-down
    bmi.biPlanes = 1
    bmi.biBitCount = 32
    bmi.biCompression = 0

    buffer = ctypes.create_string_buffer(width * height * 4)
    gdi32.GetDIBits(hmemdc, hbitmap, 0, height, buffer, ctypes.byref(bmi), 0)

    image = Image.frombytes('RGBA', (width, height), buffer, 'raw', 'BGRA')
    image.save(output_path, 'PNG')

    # Cleanup
    gdi32.DeleteObject(hbitmap)
    gdi32.DeleteDC(hmemdc)
    user32.ReleaseDC(0, hdeskdc)
    return width, height

if __name__ == "__main__":
    w, h = win32_gdi_screenshot("test_cap_out.png")
    print(f"Captured {w}x{h} -> exists: {os.path.exists('test_cap_out.png')}")
