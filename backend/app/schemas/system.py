from pydantic import BaseModel
from typing import Optional

class SystemMetricsResponse(BaseModel):
    cpu_usage: float
    ram_usage: float
    gpu_usage: Optional[float] = None
    gpu_memory: Optional[float] = None
    temperature: Optional[float] = None
    uptime: str

class ModelStatusResponse(BaseModel):
    provider: str
    model: str
    status: str
