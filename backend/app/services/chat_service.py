import re
import asyncio
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
from app.core.contracts import JarvisRequest, JarvisResponse, InputChannel
from app.core.adapters import RequestAdapter, ResponseAdapter
from app.core.orchestrator import JarvisCoreOrchestrator
from app.schemas.chat import ChatRequest, ChatResponse
from app.core.logging import logger


class ChatService:
    """Application Service Layer bridging API controllers to canonical JarvisCoreOrchestrator."""

    def __init__(
        self,
        conversation_manager: Optional[ConversationManager] = None,
        orchestrator: Optional[JARVISOrchestrator] = None,
        memory_service: Optional[MemoryService] = None,
        user_profile_service: Optional[UserProfileService] = None,
        tool_router: Optional[ToolIntentRouter] = None,
        grounded_generator: Optional[GroundedResponseGenerator] = None,
        agent: Optional[JARVISAgent] = None,
        core_orchestrator: Optional[JarvisCoreOrchestrator] = None,
    ):
        self.conversation_manager = conversation_manager or ConversationManager()
        self.orchestrator = orchestrator or JARVISOrchestrator()
        self.memory_service = memory_service or MemoryService()
        self.user_profile_service = user_profile_service or UserProfileService(memory_manager=self.memory_service.memory_manager)
        self.tool_router = tool_router or ToolIntentRouter()
        self.grounded_generator = grounded_generator or GroundedResponseGenerator(user_profile_service=self.user_profile_service)
        self.agent = agent or JARVISAgent(grounded_generator=self.grounded_generator)
        self.core_orchestrator = core_orchestrator or JarvisCoreOrchestrator()

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
        """Handles chat request business logic via canonical JarvisCoreOrchestrator V2 runtime pipeline."""
        conversation = await self.conversation_manager.get_or_create_conversation(db, conversation_id)

        # 1. Casual Companion Greeting Fast-Path
        casual_reply = self.get_casual_companion_response(user_message)
        if casual_reply:
            await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="user", content=user_message)
            await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="assistant", content=casual_reply, extra_metadata={"model": "jarvis-companion", "channel": channel})
            return {"conversation_id": conversation.id, "message": casual_reply, "model": "jarvis-companion"}

        # 2. Convert incoming request to canonical JarvisRequest using RequestAdapter
        chat_req = ChatRequest(message=user_message, conversation_id=conversation.id)
        input_channel = InputChannel.VOICE if channel == "voice" else InputChannel.TEXT
        jarvis_req = RequestAdapter.from_chat_request(chat_req, channel=input_channel)

        # 3. Process request through canonical JarvisCoreOrchestrator (Single Brain Entry Point)
        jarvis_resp = await self.core_orchestrator.process_request(jarvis_req)

        # 4. Convert canonical JarvisResponse to API ChatResponse using ResponseAdapter
        chat_resp = ResponseAdapter.to_chat_response(jarvis_resp)

        # 5. Persist turn in database
        await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="user", content=user_message)
        await self.conversation_manager.add_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=chat_resp.message,
            extra_metadata={"model": chat_resp.model, "channel": channel, "response_type": jarvis_resp.response_type.value},
        )

        return {
            "conversation_id": conversation.id,
            "message": chat_resp.message,
            "model": chat_resp.model,
        }

    async def handle_chat_request_stream(
        self,
        db: AsyncSession,
        user_message: str,
        conversation_id: Optional[str] = None,
        channel: str = "chat",
        cancel_event: Optional[asyncio.Event] = None,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Handles chat request streaming real-time tokens via canonical JarvisCoreOrchestrator V2 runtime pipeline."""
        conversation = await self.conversation_manager.get_or_create_conversation(db, conversation_id)

        # 1. Casual Companion Greeting Fast-Path
        casual_reply = self.get_casual_companion_response(user_message)
        if casual_reply:
            await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="user", content=user_message)
            await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="assistant", content=casual_reply, extra_metadata={"model": "jarvis-companion", "channel": channel})
            yield {"conversation_id": conversation.id, "chunk": casual_reply, "model": "jarvis-companion"}
            return

        # 2. Convert incoming request to canonical JarvisRequest using RequestAdapter
        chat_req = ChatRequest(message=user_message, conversation_id=conversation.id)
        input_channel = InputChannel.VOICE if channel == "voice" else InputChannel.TEXT
        jarvis_req = RequestAdapter.from_chat_request(chat_req, channel=input_channel)

        # 3. Process request through canonical JarvisCoreOrchestrator
        jarvis_resp = await self.core_orchestrator.process_request(jarvis_req, cancel_event=cancel_event)

        # 4. Convert canonical JarvisResponse to API ChatResponse using ResponseAdapter
        chat_resp = ResponseAdapter.to_chat_response(jarvis_resp)

        # 5. Persist turn in database
        await self.conversation_manager.add_message(db=db, conversation_id=conversation.id, role="user", content=user_message)
        await self.conversation_manager.add_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=chat_resp.message,
            extra_metadata={"model": chat_resp.model, "channel": channel, "response_type": jarvis_resp.response_type.value},
        )

        yield {
            "conversation_id": conversation.id,
            "chunk": chat_resp.message,
            "model": chat_resp.model,
        }
