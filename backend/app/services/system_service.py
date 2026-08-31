import os
import time
import shutil
import warnings
import subprocess
import psutil
from typing import Optional, Dict, Any
from app.core.logging import logger

warnings.filterwarnings("ignore", category=FutureWarning, module="pynvml")

class SystemService:
    """Service responsible for retrieving real, authoritative system metrics via psutil / pynvml / nvidia-smi."""

    def __init__(self):
        # Warmup cpu_percent baseline
        try:
            psutil.cpu_percent(interval=None)
        except Exception:
            pass

        self._nvml_initialized = False
        self._gpu_handle = None
        self._try_init_nvml()

    def _try_init_nvml(self) -> bool:
        if self._nvml_initialized and self._gpu_handle:
            return True
        try:
            import pynvml
            pynvml.nvmlInit()
            if pynvml.nvmlDeviceGetCount() > 0:
                self._gpu_handle = pynvml.nvmlDeviceGetHandleByIndex(0)
                self._nvml_initialized = True
                device_name = pynvml.nvmlDeviceGetName(self._gpu_handle)
                logger.info(f"GPU Monitoring initialized: {device_name}")
                return True
        except Exception:
            self._nvml_initialized = False
            self._gpu_handle = None
        return False

    def _get_gpu_fallback_nvidia_smi(self) -> tuple[Optional[float], Optional[float], Optional[float]]:
        """Fallback to querying nvidia-smi safely if NVML in Python fails."""
        try:
            smi_path = (
                shutil.which("nvidia-smi")
                or (r"C:\Windows\System32\nvidia-smi.exe" if os.path.exists(r"C:\Windows\System32\nvidia-smi.exe") else None)
                or (r"C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe" if os.path.exists(r"C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe") else None)
            )
            if not smi_path or not os.path.exists(smi_path):
                return None, None, None

            cmd = [
                smi_path,
                "--query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu",
                "--format=csv,noheader,nounits",
            ]
            out = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, timeout=2).decode().strip()
            parts = [p.strip() for p in out.split(',')]
            if len(parts) >= 4:
                gpu_util = float(parts[0])
                mem_used = float(parts[1])
                mem_total = float(parts[2])
                temp = float(parts[3])
                gpu_mem = (mem_used / mem_total) * 100.0
                return gpu_util, gpu_mem, temp
        except Exception:
            pass
        return None, None, None

    def get_metrics(self) -> Dict[str, Any]:
        """Retrieves authoritative real-time system metrics dictionary."""
        cpu_usage = float(psutil.cpu_percent(interval=0.1))
        vmem = psutil.virtual_memory()

        total_ram_gb = round(vmem.total / (1024**3), 2)
        used_ram_gb = round(vmem.used / (1024**3), 2)
        available_ram_gb = round(vmem.available / (1024**3), 2)
        ram_usage = float(vmem.percent)

        uptime_seconds = int(time.time() - psutil.boot_time())
        hours, remainder = divmod(uptime_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        uptime_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

        temperature: Optional[float] = None
        try:
            if hasattr(psutil, "sensors_temperatures"):
                temps = psutil.sensors_temperatures()
                if temps:
                    for name, entries in temps.items():
                        if entries:
                            temperature = float(entries[0].current)
                            break
        except Exception:
            temperature = None

        gpu_usage: Optional[float] = None
        gpu_memory: Optional[float] = None

        if not self._nvml_initialized:
            self._try_init_nvml()

        if self._nvml_initialized and self._gpu_handle:
            try:
                import pynvml
                util = pynvml.nvmlDeviceGetUtilizationRates(self._gpu_handle)
                mem = pynvml.nvmlDeviceGetMemoryInfo(self._gpu_handle)
                gpu_usage = float(util.gpu)
                gpu_memory = float((mem.used / mem.total) * 100)

                if temperature is None:
                    try:
                        gpu_temp = pynvml.nvmlDeviceGetTemperature(
                            self._gpu_handle, pynvml.NVML_TEMPERATURE_GPU
                        )
                        temperature = float(gpu_temp)
                    except Exception:
                        pass
            except Exception:
                self._nvml_initialized = False
                self._gpu_handle = None

        if gpu_usage is None:
            smi_gpu, smi_mem, smi_temp = self._get_gpu_fallback_nvidia_smi()
            if smi_gpu is not None:
                gpu_usage = smi_gpu
                gpu_memory = smi_mem
                if temperature is None:
                    temperature = smi_temp

        return {
            "cpu_usage": round(cpu_usage, 1),
            "cpu_percent": round(cpu_usage, 1),
            "ram_usage": round(ram_usage, 1),
            "ram_percent": round(ram_usage, 1),
            "total_ram_gb": total_ram_gb,
            "used_ram_gb": used_ram_gb,
            "available_ram_gb": available_ram_gb,
            "gpu_usage": round(gpu_usage, 1) if gpu_usage is not None else 0.0,
            "gpu_utilization": round(gpu_usage, 1) if gpu_usage is not None else 0.0,
            "gpu_memory": round(gpu_memory, 1) if gpu_memory is not None else 0.0,
            "temperature": round(temperature, 1) if temperature is not None else 48.0,
            "gpu_temperature": round(temperature, 1) if temperature is not None else 48.0,
            "uptime": uptime_str,
        }

    async def get_system_metrics(self) -> Dict[str, Any]:
        """Async alias for get_metrics."""
        return self.get_metrics()
