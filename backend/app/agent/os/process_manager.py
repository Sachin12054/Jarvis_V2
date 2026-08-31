import psutil
from typing import Dict, Any, List, Optional
from app.core.logging import logger


class ProcessManager:
    """Inspects running processes using real Windows OS psutil metrics and cleanly terminates approved processes."""

    def list_processes(self, limit: int = 10) -> Dict[str, Any]:
        """Lists top active processes sorted by memory consumption alongside authoritative system RAM metrics."""
        vmem = psutil.virtual_memory()
        system_ram_pct = round(vmem.percent, 1)
        system_used_gb = round(vmem.used / (1024**3), 2)
        system_total_gb = round(vmem.total / (1024**3), 2)

        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'memory_percent']):
            try:
                info = proc.info
                mem_info = info.get('memory_info')
                rss_mb = round(mem_info.rss / (1024**2), 1) if mem_info else 0.0
                mem_pct = round(info.get('memory_percent') or 0.0, 1)
                cpu_pct = round(info.get('cpu_percent') or 0.0, 1)

                processes.append({
                    "pid": info['pid'],
                    "name": info['name'],
                    "cpu_percent": cpu_pct,
                    "memory_mb": rss_mb,
                    "memory_percent": mem_pct,
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue

        # Sort by memory usage
        sorted_procs = sorted(processes, key=lambda x: x['memory_mb'], reverse=True)
        top_procs = sorted_procs[:limit]

        logger.info(f"[PROCESS MANAGER] Inspected {len(processes)} active processes. Top process: {top_procs[0]['name'] if top_procs else 'None'}")
        return {
            "status": "success",
            "system_ram_percent": system_ram_pct,
            "system_used_gb": system_used_gb,
            "system_total_gb": system_total_gb,
            "processes": top_procs,
        }

    def stop_process(self, process_name: str) -> Dict[str, Any]:
        """Stops approved application processes cleanly."""
        stopped = 0
        clean_name = process_name.strip().lower()

        for proc in psutil.process_iter(['pid', 'name']):
            try:
                if clean_name in proc.info['name'].lower():
                    proc.terminate()
                    stopped += 1
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue

        logger.info(f"[PROCESS MANAGER] Terminated {stopped} process instances for '{process_name}'")
        return {"success": stopped > 0, "stopped_count": stopped, "process_name": process_name}
