import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import String, Text, Float, Integer, Boolean, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin, utc_now


class Memory(Base, TimestampMixin):
    """SQLAlchemy model representing a persistent long-term memory fact or user preference."""

    __tablename__ = "memories"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        default="local_user",
        nullable=False,
        index=True,
    )
    memory_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    normalized_content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    importance: Mapped[float] = mapped_column(
        Float,
        default=0.5,
        nullable=False,
    )
    confidence: Mapped[float] = mapped_column(
        Float,
        default=0.8,
        nullable=False,
    )
    source: Mapped[str] = mapped_column(
        String(50),
        default="user_explicit",
        nullable=False,
    )
    access_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    last_accessed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )
    extra_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        default=dict,
    )

    def __repr__(self) -> str:
        return f"<Memory(id={self.id}, type={self.memory_type}, user_id={self.user_id})>"
