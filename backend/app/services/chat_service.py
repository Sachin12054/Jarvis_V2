from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.brain.orchestrator import JARVISOrchestrator
from app.conversation.history import HistoryFormatter
from app.conversation.manager import ConversationManager


class ChatService:
    """Application Service Layer bridging API controllers and brain orchestration."""

    def __init__(
        self,
        conversation_manager: Optional[ConversationManager] = None,
        orchestrator: Optional[JARVISOrchestrator] = None,
    ):
        self.conversation_manager = conversation_manager or ConversationManager()
        self.orchestrator = orchestrator or JARVISOrchestrator()

    async def handle_chat_request(
        self,
        db: AsyncSession,
        user_message: str,
        conversation_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Handles chat request business logic: session management, history loading, reasoning, and persistence."""
        # 1. Retrieve or create conversation session
        conversation = await self.conversation_manager.get_or_create_conversation(db, conversation_id)

        # 2. Fetch existing history before adding current message
        raw_history = await self.conversation_manager.get_recent_history(db, conversation.id)
        formatted_history = HistoryFormatter.to_llm_messages(raw_history)

        # 3. Store user message in database
        await self.conversation_manager.add_message(
            db=db,
            conversation_id=conversation.id,
            role="user",
            content=user_message,
        )

        # 4. Invoke Brain Orchestrator
        orchestration_result = await self.orchestrator.process_turn(
            user_message=user_message,
            history=formatted_history,
        )

        assistant_response = orchestration_result["response"]
        used_model = orchestration_result["model"]

        # 5. Store assistant response in database
        await self.conversation_manager.add_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=assistant_response,
            extra_metadata={"model": used_model},
        )

        return {
            "conversation_id": conversation.id,
            "message": assistant_response,
            "model": used_model,
        }
