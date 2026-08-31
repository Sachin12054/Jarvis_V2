from typing import List, Dict, Any
from app.database.models.message import Message


def normalize_history(history: Any) -> List[Dict[str, Any]]:
    """Canonical history contract helper: Converts any input (None, tuple, list) into a valid List[Dict[str, Any]]."""
    if not history or not isinstance(history, (list, tuple)):
        return []
    return [m for m in history if isinstance(m, dict)]


class HistoryFormatter:
    """Formats and orders conversation messages for LLM context assembly."""

    @staticmethod
    def to_llm_messages(messages: List[Message]) -> List[Dict[str, Any]]:
        """Converts database Message objects to standard dictionary format [role, content]."""
        if not messages:
            return []
        llm_messages = []
        for msg in messages:
            llm_messages.append({
                "role": msg.role,
                "content": msg.content,
            })
        return llm_messages
