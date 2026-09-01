from typing import Dict, Any, Optional
from app.core.contracts import JarvisRequest, InputChannel, TargetDevice
from app.schemas.chat import ChatRequest


class RequestAdapter:
    """Adapter to convert legacy/API request formats into canonical JarvisRequest objects."""

    @staticmethod
    def from_chat_request(
        chat_req: ChatRequest,
        channel: InputChannel = InputChannel.TEXT,
        turn_id: Optional[str] = None,
        target_device: TargetDevice = TargetDevice.CURRENT,
    ) -> JarvisRequest:
        return JarvisRequest(
            conversation_id=chat_req.conversation_id or "default-conversation",
            turn_id=turn_id or "",
            input_channel=channel,
            raw_input=chat_req.message,
            normalized_input=chat_req.message.strip(),
            target_device=target_device,
        )

    @staticmethod
    def from_voice_input(
        raw_text: str,
        conversation_id: str,
        turn_id: Optional[str] = None,
        normalized_text: Optional[str] = None,
        confidence: float = 1.0,
        target_device: TargetDevice = TargetDevice.CURRENT,
    ) -> JarvisRequest:
        return JarvisRequest(
            conversation_id=conversation_id,
            turn_id=turn_id or "",
            input_channel=InputChannel.VOICE,
            raw_input=raw_text,
            normalized_input=normalized_text or raw_text.strip().lower(),
            confidence=confidence,
            target_device=target_device,
        )

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> JarvisRequest:
        conv_id = data.get("conversation_id") or "default-conversation"
        raw_inp = data.get("raw_input") or data.get("message") or data.get("text") or ""
        norm_inp = data.get("normalized_input") or (raw_inp.strip() if raw_inp else None)
        chan = data.get("input_channel") or InputChannel.TEXT
        device = data.get("target_device") or TargetDevice.CURRENT
        return JarvisRequest(
            request_id=data.get("request_id") or "",
            conversation_id=conv_id,
            turn_id=data.get("turn_id") or "",
            input_channel=InputChannel(chan) if isinstance(chan, str) else chan,
            raw_input=raw_inp,
            normalized_input=norm_inp,
            language=data.get("language", "en"),
            intent=data.get("intent"),
            entities=data.get("entities", {}),
            target_device=TargetDevice(device) if isinstance(device, str) else device,
            confidence=float(data.get("confidence", 1.0)),
            context_info=data.get("context_info", {}),
        )
