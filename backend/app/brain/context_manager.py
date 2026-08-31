from typing import List, Dict, Any, Optional
from app.brain.prompt_manager import PromptManager
from app.conversation.history import normalize_history


class ContextManager:
    """Assembles dialogue history, system prompts, relevant memory injection, and context limits for LLM input."""

    def __init__(self, prompt_manager: Optional[PromptManager] = None):
        self.prompt_manager = prompt_manager or PromptManager()

    def prepare_messages(
        self,
        history: Optional[List[Dict[str, Any]]] = None,
        new_user_message: str = "",
        max_turns: int = 20,
        memory_context: Optional[str] = None,
    ) -> List[Dict[str, str]]:
        """Formats full message list for LLM providers including system prompt and relevant memory context."""
        system_prompt = self.prompt_manager.get_system_prompt()

        if memory_context:
            system_prompt = f"{system_prompt}\n\n{memory_context}"

        formatted_messages: List[Dict[str, str]] = [
            {"role": "system", "content": system_prompt}
        ]

        # Canonical normalization: guarantee history_list is always a valid List[Dict[str, Any]]
        history_list = normalize_history(history)

        # Truncate history to recent turns
        recent_history = history_list[-max_turns:] if len(history_list) > max_turns else history_list

        for msg in recent_history:
            if "role" in msg and "content" in msg:
                formatted_messages.append({
                    "role": msg["role"],
                    "content": msg["content"],
                })

        # Append new user message if non-empty and not already in history
        if new_user_message and new_user_message.strip():
            if not (history_list and history_list[-1].get("content") == new_user_message and history_list[-1].get("role") == "user"):
                formatted_messages.append({
                    "role": "user",
                    "content": new_user_message,
                })

        return formatted_messages
