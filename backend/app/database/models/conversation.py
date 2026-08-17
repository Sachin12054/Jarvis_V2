import uuid
from typing import TYPE_CHECKING, List
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.database.models.message import Message


class Conversation(Base, TimestampMixin):
    """SQLAlchemy model representing a chat conversation session."""

    __tablename__ = "conversations"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="active",
        nullable=False,
        index=True,
    )

    # Relationships
    messages: Mapped[List["Message"]] = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    def __repr__(self) -> str:
        return f"<Conversation(id={self.id}, status={self.status})>"
