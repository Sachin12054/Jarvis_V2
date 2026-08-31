import re
from typing import Optional, Dict, Any, AsyncGenerator, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.brain.grounded_generator import GroundedResponseGenerator
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain, IntentPlan
from app.brain.orchestrator import JARVISOrchestrator
from app.conversation.history import HistoryFormatter
from app.conversation.manager import ConversationManager
from app.core.config import settings
from app.memory.profile import UserProfileService
from app.memory.service import MemoryService
from app.tools.router import ToolIntentRouter
from app.core.logging import logger


class ChatService:
    """Application Service Layer bridging API controllers, tool execution, memory intelligence, and brain orchestration."""

    def __init__(
        self,
        conversation_manager: Optional[ConversationManager] = None,
        orchestrator: Optional[JARVISOrchestrator] = None,
        memory_service: Optional[MemoryService] = None,
        user_profile_service: Optional[UserProfileService] = None,
        tool_router: Optional[ToolIntentRouter] = None,
        grounded_generator: Optional[GroundedResponseGenerator] = None,
        agent: Optional[JARVISAgent] = None,
    ):
        self.conversation_manager = conversation_manager or ConversationManager()
        self.orchestrator = orchestrator or JARVISOrchestrator()
        self.memory_service = memory_service or MemoryService()
        self.user_profile_service = user_profile_service or UserProfileService(memory_manager=self.memory_service.memory_manager)
        self.tool_router = tool_router or ToolIntentRouter()
        self.grounded_generator = grounded_generator or GroundedResponseGenerator(user_profile_service=self.user_profile_service)
        self.agent = agent or JARVISAgent(grounded_generator=self.grounded_generator)

    @staticmethod
    def get_casual_companion_response(user_message: str) -> Optional[str]:
        """Returns warm, conversational companion responses for casual greetings."""
        clean = user_message.strip().lower()

        if re.search(r'^\s*hey\s+jarvis\s*[\!\.]*\s*$', clean):
            return "Hey! Everything's running smoothly. What are we working on?"
        if re.search(r'^\s*(?:hey\s+jarvis\,?\s*)?how\s+are\s+you\??\s*$', clean):
            return "Doing good. Everything's running smoothly. What's up?"
        if re.search(r'^\s*(?:what\s+are\s+you\s+doing|what\'s\s+up)\??\s*$', clean):
            return "Just waiting for you to give me something interesting to work on."

        return None

    async def handle_chat_request(
        self,
        db: AsyncSession,
        user_message: str,
        conversation_id: Optional[str] = None,
        channel: str = "chat",
    ) -> Dict[str, Any]:
        """Handles chat request business logic via JARVIS V5 Master Personal AI Agent runtime."""
        conversation = await self.conversation_manager.get_or_create_conversation(db, conversation_id)

        # 1. Fetch Recent History for Contextual Resolution
        raw_history = await self.conversation_manager.get_recent_history(db, conversation.id)
        formatted_history = HistoryFormatter.to_llm_messages(raw_history)

        if channel == "voice":
            logger.info(f"[VOICE] history_loaded count={len(formatted_history)}")

        # 2. Casual Companion Greeting Fast-Path
        casual_reply = self.get_casual_companion_response(user_message)
        if casual_reply:
            await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="user", content=user_message)
            await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="assistant", content=casual_reply, extra_metadata={"model": "jarvis-companion", "channel": channel})
            return {"conversation_id": conversation.id, "message": casual_reply, "model": "jarvis-companion"}

        # 3. Log incoming browser coordinates if present
        coord_match = re.search(r'latitude:\s*([\-0-9\.]+),\s*longitude:\s*([\-0-9\.]+)', user_message, re.IGNORECASE)
        if coord_match:
            lat = coord_match.group(1)
            lng = coord_match.group(2)
            acc_match = re.search(r'accuracy:\s*([0-9\.]+)', user_message, re.IGNORECASE)
            acc = acc_match.group(1) if acc_match else "0"
            logger.info(f"[LOCATION DEBUG] Received browser coordinates lat={lat} lng={lng} accuracy={acc}")
            logger.info("[LOCATION DEBUG] Routing to get_current_location")

        # 4. Invoke JARVIS V5 Master Personal AI Agent Turn
        agent_result = await self.agent.process_turn(
            db=db,
            user_message=user_message,
            conversation_id=conversation.id,
            channel=channel,
            conversation_history=formatted_history,
        )

        reply_text = agent_result["message"]
        used_model = agent_result.get("model", "gemma-3-4b:latest")

        await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="user", content=user_message)
        await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="assistant", content=reply_text, extra_metadata={"model": used_model, "channel": channel})

        return {
            "conversation_id": conversation.id,
            "message": reply_text,
            "model": used_model,
        }

    async def handle_chat_request_stream(
        self,
        db: AsyncSession,
        user_message: str,
        conversation_id: Optional[str] = None,
        channel: str = "chat",
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Handles chat request streaming real-time tokens."""
        conversation = await self.conversation_manager.get_or_create_conversation(db, conversation_id)

        # 1. Fetch Recent History for Contextual Resolution
        raw_history = await self.conversation_manager.get_recent_history(db, conversation.id)
        formatted_history = HistoryFormatter.to_llm_messages(raw_history)

        if channel == "voice":
            logger.info(f"[VOICE] history_loaded count={len(formatted_history)}")

        # 2. Casual Companion Greeting Fast-Path
        casual_reply = self.get_casual_companion_response(user_message)
        if casual_reply:
            await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="user", content=user_message)
            await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="assistant", content=casual_reply, extra_metadata={"model": "jarvis-companion", "channel": channel})
            yield {"conversation_id": conversation.id, "chunk": casual_reply, "model": "jarvis-companion"}
            return

        # 3. Log incoming browser coordinates if present
        coord_match = re.search(r'latitude:\s*([\-0-9\.]+),\s*longitude:\s*([\-0-9\.]+)', user_message, re.IGNORECASE)
        if coord_match:
            lat = coord_match.group(1)
            lng = coord_match.group(2)
            acc_match = re.search(r'accuracy:\s*([0-9\.]+)', user_message, re.IGNORECASE)
            acc = acc_match.group(1) if acc_match else "0"
            logger.info(f"[LOCATION DEBUG] Received browser coordinates lat={lat} lng={lng} accuracy={acc}")
            logger.info("[LOCATION DEBUG] Routing to get_current_location")

        # 4. Invoke Agent Turn
        agent_result = await self.agent.process_turn(
            db=db,
            user_message=user_message,
            conversation_id=conversation.id,
            channel=channel,
            conversation_history=formatted_history,
        )

        reply_text = agent_result["message"]
        used_model = agent_result.get("model", "gemma-3-4b:latest")

        await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="user", content=user_message)
        await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="assistant", content=reply_text, extra_metadata={"model": used_model, "channel": channel})

        yield {
            "conversation_id": conversation.id,
            "chunk": reply_text,
            "model": used_model,
        }
