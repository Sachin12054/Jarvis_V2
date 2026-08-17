from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")


class HealthResponse(BaseModel):
    status: str = "healthy"


class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None
