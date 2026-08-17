from typing import List, Dict, Any
from app.database.models.message import Message


class HistoryFormatter:
    """Formats and orders conversation messages for LLM context assembly."""

    @staticmethod
    def to_llm_messages(messages: List[Message]) -> List[Dict[str, Any]]:
        """Converts database Message objects to standard dictionary format [role, content]."""
        llm_messages = []
        for msg in messages:
            llm_messages.append({
                "role": msg.role,
                "content": msg.content,
            })
        return llm_messages
