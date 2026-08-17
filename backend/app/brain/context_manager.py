from typing import List, Dict, Any
from app.brain.prompt_manager import PromptManager


class ContextManager:
    """Assembles dialogue history, system prompts, and context limits for LLM input."""

    def __init__(self, prompt_manager: PromptManager | None = None):
        self.prompt_manager = prompt_manager or PromptManager()

    def prepare_messages(
        self,
        history: List[Dict[str, Any]],
        new_user_message: str,
        max_turns: int = 20,
    ) -> List[Dict[str, str]]:
        """Formats full message list for LLM providers including system prompt."""
        system_prompt = self.prompt_manager.get_system_prompt()

        formatted_messages: List[Dict[str, str]] = [
            {"role": "system", "content": system_prompt}
        ]

        # Truncate history to recent turns
        recent_history = history[-max_turns:] if len(history) > max_turns else history

        for msg in recent_history:
            formatted_messages.append({
                "role": msg["role"],
                "content": msg["content"],
            })

        # Append new user message if not already in history
        if not (history and history[-1].get("content") == new_user_message and history[-1].get("role") == "user"):
            formatted_messages.append({
                "role": "user",
                "content": new_user_message,
            })

        return formatted_messages
