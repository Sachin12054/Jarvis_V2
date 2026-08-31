import os
import time
import asyncio
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Response, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.logging import logger
from app.database.session import get_db
from app.services.chat_service import ChatService
from app.services.elevenlabs_service import ElevenLabsVoiceService
from app.voice.stt_provider import LocalWhisperSTTProvider, LocalVoiceTranscription
from app.voice.kokoro_tts import LocalKokoroTTSService

router = APIRouter(prefix="/api/v1/voice", tags=["Voice Interface"])


class SpeakRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None


def get_stt_provider(request: Request) -> LocalWhisperSTTProvider:
    """Helper to retrieve the single application lifespan STT provider instance."""
    provider = getattr(request.app.state, "local_stt", None)
    if provider is None:
        logger.warning(f"[LOCAL STT WARNING] pid={os.getpid()} app.state.local_stt missing, falling back to singleton")
        provider = LocalWhisperSTTProvider.get_instance()
    assert provider is not None, "STT_NOT_INITIALIZED: LocalWhisperSTTProvider instance missing"
    return provider


def get_tts_service(request: Request):
    """Helper to retrieve application lifespan TTS service (Kokoro Local or ElevenLabs)."""
    provider_type = getattr(settings, "TTS_PROVIDER", "kokoro").lower()
    if provider_type == "kokoro":
        service = getattr(request.app.state, "local_tts", None)
        if service is None:
            service = LocalKokoroTTSService.get_instance()
        return service
    else:
        return ElevenLabsVoiceService()


@router.get("/status")
async def get_voice_status(request: Request):
    """Returns local STT provider status and TTS configuration from application state."""
    stt_provider = get_stt_provider(request)
    tts_service = get_tts_service(request)
    pid = os.getpid()

    stt_health = stt_provider.health()
    logger.info(f"[LOCAL STT STATUS REQUEST] pid={pid} stt_ready={stt_health.get('ready')}")

    if hasattr(tts_service, "health"):
        tts_health = tts_service.health()
    else:
        tts_health = {
            "provider": "elevenlabs",
            "available": tts_service.is_configured(),
            "voice_id": tts_service.voice_id,
            "model": tts_service.tts_model,
        }

    return {
        "stt": stt_health,
        "tts": tts_health,
    }


@router.post("/test-stt")
async def test_stt_endpoint(request: Request, file: UploadFile = File(...)):
    """Direct Audio Test Endpoint: Accepts a WAV or WebM audio recording and transcribes locally via application lifespan Faster-Whisper model."""
    stt_provider = get_stt_provider(request)
    audio_bytes = await file.read()
    pid = os.getpid()

    logger.info(f"[LOCAL STT TEST REQUEST INSTANCE] pid={pid} provider_id={hex(id(stt_provider))} ready={stt_provider.ready}")

    transcription = await stt_provider.transcribe(
        audio_bytes=audio_bytes,
        filename=file.filename or "test.wav",
        content_type=file.content_type or "audio/wav",
    )

    if transcription.error_code and transcription.error_code != "AUDIO_SILENT":
        return {
            "success": False,
            "error_type": transcription.error_code,
            "message": transcription.error,
            "transcription": transcription.model_dump(),
        }

    return {
        "success": True,
        "text": transcription.text,
        "latency_ms": transcription.total_ms,
        "transcription": transcription.model_dump(),
    }


@router.post("/transcribe")
async def transcribe_and_process_voice(
    request: Request,
    file: Optional[UploadFile] = File(None),
    transcript_text: Optional[str] = Form(None),
    conversation_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """Voice turn endpoint: Accepts microphone audio recording, transcribes 100% LOCALLY via LocalWhisperSTTProvider, processes via ChatService, and returns local Kokoro TTS audio."""
    stt_provider = get_stt_provider(request)
    tts_service = get_tts_service(request)
    start_time = time.time()
    pid = os.getpid()

    logger.info(f"[LOCAL STT REQUEST INSTANCE] pid={pid} provider_id={hex(id(stt_provider))} ready={stt_provider.ready} conversation_id={conversation_id}")

    # Step 1: 100% Local STT Transcription
    if transcript_text and transcript_text.strip():
        transcription = LocalVoiceTranscription(
            text=transcript_text.strip(),
            provider="client_fallback",
            confidence=0.99,
        )
    elif file:
        audio_bytes = await file.read()
        transcription = await stt_provider.transcribe(
            audio_bytes=audio_bytes,
            filename=file.filename or "speech.webm",
            content_type=file.content_type or "audio/webm",
        )
    else:
        raise HTTPException(status_code=400, detail="Either audio file or transcript_text must be provided.")

    # Structured error handling for infrastructure failures
    if transcription.error_code and transcription.error_code != "AUDIO_SILENT":
        logger.error(f"[VOICE API] pid={pid} STT Failure: code={transcription.error_code} detail={transcription.error}")
        return {
            "success": False,
            "error_type": transcription.error_code,
            "message": f"Voice input is temporarily unavailable: {transcription.error}",
            "transcription": transcription.model_dump(),
            "agent_response": None,
        }

    if not transcription.text and not transcript_text:
        # Audio is silent or non-speech turn
        logger.info(f"[VOICE API] pid={pid} Audio is silent or non-speech turn.")
        return {
            "success": True,
            "transcription": transcription.model_dump(),
            "agent_response": None,
            "message": "",
        }

    # Step 2: Route through ChatService to JARVISAgent
    logger.info(f"[VOICE] pid={pid} agent_processing_started text='{transcription.text}' conversation_id='{conversation_id}'")
    chat_service = ChatService()

    try:
        chat_res = await chat_service.handle_chat_request(
            db=db,
            user_message=transcription.text,
            conversation_id=conversation_id,
            channel="voice",
        )
        logger.info(f"[VOICE] pid={pid} agent_processing_completed model='{chat_res.get('model')}'")
    except Exception as err:
        logger.error(f"[VOICE] pid={pid} agent_processing_failed reason='{err}'", exc_info=True)
        return {
            "success": False,
            "error_type": "AGENT_PROCESSING_ERROR",
            "message": f"JARVIS processing error: {str(err)}",
            "transcription": transcription.model_dump(),
            "agent_response": None,
        }

    response_text = chat_res.get("message", "")

    # Step 3: Generate TTS audio stream for response text if configured
    tts_audio_b64 = ""
    tts_format = "wav" if getattr(settings, "TTS_PROVIDER", "kokoro").lower() == "kokoro" else "mp3"
    
    if response_text and tts_service.is_configured():
        try:
            audio_bytes = await tts_service.generate_speech(response_text)
            if audio_bytes:
                import base64
                tts_audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
        except Exception as err:
            logger.warning(f"[VOICE API] pid={pid} TTS generation warning: {err}")

    total_latency_ms = (time.time() - start_time) * 1000
    logger.info(f"[VOICE API] pid={pid} Voice turn completed: input='{transcription.text}' latency_ms={total_latency_ms:.1f}")

    return {
        "success": True,
        "transcription": transcription.model_dump(),
        "agent_response": chat_res,
        "tts_audio_b64": tts_audio_b64,
        "tts_format": tts_format,
        "latency_ms": total_latency_ms,
    }


@router.post("/speak")
async def generate_speech_endpoint(request: Request, payload: SpeakRequest):
    """Text-to-Speech (TTS) endpoint: Converts response text to audio stream via Local Kokoro TTS or ElevenLabs."""
    tts_service = get_tts_service(request)
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text payload cannot be empty.")

    audio_bytes = await tts_service.generate_speech(payload.text, voice_id=payload.voice_id)
    if not audio_bytes:
        logger.warning("[VOICE API] TTS speech generation returned empty bytes.")
        return Response(content=b"", media_type="audio/wav", headers={"X-Voice-Status": "UNAVAILABLE"})

    media_type = "audio/wav" if getattr(settings, "TTS_PROVIDER", "kokoro").lower() == "kokoro" else "audio/mpeg"
    return Response(content=audio_bytes, media_type=media_type)


ACTIVE_TURNS: Dict[str, Dict[str, Any]] = {}


class CancelVoiceTurnRequest(BaseModel):
    turn_id: str


@router.post("/cancel")
async def cancel_voice_turn(payload: CancelVoiceTurnRequest):
    """Phase 8: Voice Turn Cancellation Endpoint: Signals active turn cancel_event and halts LLM/TTS generation."""
    turn_id = payload.turn_id
    pid = os.getpid()

    if turn_id in ACTIVE_TURNS:
        context = ACTIVE_TURNS[turn_id]
        cancel_event: asyncio.Event = context.get("cancel_event")
        if cancel_event:
            cancel_event.set()
        logger.info(f"[VOICE CANCEL ENDPOINT] pid={pid} turn_id='{turn_id}' cancel_event_signaled=true")
        return {"success": True, "message": "Voice turn cancelled.", "turn_id": turn_id}

    logger.info(f"[VOICE CANCEL ENDPOINT] pid={pid} turn_id='{turn_id}' not active or already completed")
    return {"success": True, "message": "Turn not active or already completed.", "turn_id": turn_id}


@router.post("/stream")
async def stream_voice_turn(
    request: Request,
    file: Optional[UploadFile] = File(None),
    transcript_text: Optional[str] = Form(None),
    conversation_id: Optional[str] = Form(None),
    turn_id: Optional[str] = Form(None),
    capture_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """Real-time Voice turn streaming endpoint: Transcribes 100% LOCALLY, processes through JARVIS streaming brain,
    and yields incremental text deltas and phrase-chunked Kokoro TTS audio chunks via Server-Sent Events (SSE).
    """
    import base64
    import json
    import uuid
    from fastapi.responses import JSONResponse, StreamingResponse
    from app.cognition.command_router import CommandRouter

    stt_provider = get_stt_provider(request)
    tts_service = get_tts_service(request)
    t_start = time.time()
    pid = os.getpid()

    active_turn_id = turn_id or f"turn_{int(t_start*1000)}_{uuid.uuid4().hex[:6]}"
    active_capture_id = capture_id or f"cap_{int(t_start*1000)}"

    # Register active turn context for cancellation
    cancel_event = asyncio.Event()
    ACTIVE_TURNS[active_turn_id] = {
        "cancel_event": cancel_event,
        "created_at": t_start,
        "capture_id": active_capture_id,
    }

    try:
        if transcript_text and transcript_text.strip():
            transcription = LocalVoiceTranscription(
                text=transcript_text.strip(),
                provider="client_fallback",
                confidence=0.99,
            )
        elif file:
            audio_bytes = await file.read()

            # Phase 2: Validate Blob size
            if not audio_bytes or len(audio_bytes) < 300:
                logger.warning(f"[AUDIO DECODE REJECTED] pid={pid} capture_id='{active_capture_id}' size={len(audio_bytes)} below valid threshold")
                return JSONResponse(
                    status_code=400,
                    content={
                        "ok": False,
                        "error_code": "AUDIO_INVALID",
                        "capture_id": active_capture_id,
                        "retryable": True,
                        "message": "Audio recording incomplete or below valid threshold.",
                    },
                )

            transcription = await stt_provider.transcribe(
                audio_bytes=audio_bytes,
                filename=file.filename or "speech.webm",
                content_type=file.content_type or "audio/webm",
                capture_id=active_capture_id,
            )
        else:
            raise HTTPException(status_code=400, detail="Either audio file or transcript_text must be provided.")

        # Phase 2: Decode / Audio Error handling
        if transcription.error_code == "AUDIO_INVALID":
            logger.error(f"[AUDIO DECODE REJECTED] pid={pid} capture_id='{active_capture_id}' error='{transcription.error}'")
            return JSONResponse(
                status_code=400,
                content={
                    "ok": False,
                    "error_code": "AUDIO_INVALID",
                    "capture_id": active_capture_id,
                    "retryable": True,
                    "message": transcription.error or "Audio decode failed.",
                },
            )

        async def sse_event_generator():
            try:
                # Emit initial transcript event
                yield f"data: {json.dumps({'type': 'transcript', 'turn_id': active_turn_id, 'capture_id': active_capture_id, 'text': transcription.text, 'stt_ms': transcription.total_ms, 'confidence': transcription.confidence, 'error_code': transcription.error_code})}\n\n"

                if cancel_event.is_set():
                    yield f"data: {json.dumps({'type': 'interrupted', 'turn_id': active_turn_id, 'total_ms': (time.time() - t_start) * 1000.0})}\n\n"
                    return

                if not transcription.text:
                    yield f"data: {json.dumps({'type': 'done', 'turn_id': active_turn_id, 'total_ms': (time.time() - t_start) * 1000.0})}\n\n"
                    return

                # Phase 4: Handle STT Uncertainty safely (do not execute fast-path commands on suspicious text)
                if transcription.error_code == "STT_UNCERTAIN":
                    uncertain_reply = "I didn't catch that clearly. Please repeat."
                    logger.warning(f"[VOICE STT UNCERTAIN] pid={pid} turn_id='{active_turn_id}' replying with retry prompt")
                    yield f"data: {json.dumps({'type': 'text_delta', 'turn_id': active_turn_id, 'text': uncertain_reply})}\n\n"
                    if tts_service.is_configured():
                        audio_bytes = await tts_service.generate_speech(uncertain_reply)
                        if audio_bytes:
                            b64 = base64.b64encode(audio_bytes).decode("utf-8")
                            yield f"data: {json.dumps({'type': 'audio_chunk', 'turn_id': active_turn_id, 'text': uncertain_reply, 'audio_b64': b64, 'format': 'wav'})}\n\n"
                    yield f"data: {json.dumps({'type': 'done', 'turn_id': active_turn_id, 'total_ms': (time.time() - t_start) * 1000.0})}\n\n"
                    return

                # Phase 13: Fast-Path Command Routing
                routed = await CommandRouter.route(transcription.text, channel="voice")
                if routed.is_routed:
                    reply = routed.response_message or "Done."
                    logger.info(f"[VOICE STREAM FAST PATH] pid={pid} turn_id='{active_turn_id}' type='{routed.command_type}' reply='{reply}'")
                    yield f"data: {json.dumps({'type': 'text_delta', 'turn_id': active_turn_id, 'text': reply})}\n\n"

                    if tts_service.is_configured() and not cancel_event.is_set():
                        audio_bytes = await tts_service.generate_speech(reply)
                        if audio_bytes and not cancel_event.is_set():
                            b64 = base64.b64encode(audio_bytes).decode("utf-8")
                            yield f"data: {json.dumps({'type': 'audio_chunk', 'turn_id': active_turn_id, 'text': reply, 'audio_b64': b64, 'format': 'wav'})}\n\n"

                    yield f"data: {json.dumps({'type': 'done', 'turn_id': active_turn_id, 'total_ms': (time.time() - t_start) * 1000.0})}\n\n"
                    return

                # Qwen3 Reasoning LLM Stream with Phrase-Chunked TTS
                chat_service = ChatService()

                async def raw_text_stream():
                    async for data in chat_service.handle_chat_request_stream(
                        db=db,
                        user_message=transcription.text,
                        conversation_id=conversation_id,
                        channel="voice",
                        cancel_event=cancel_event,
                    ):
                        if cancel_event.is_set():
                            logger.info(f"[VOICE CHAT CANCELLED] turn_id='{active_turn_id}'")
                            break
                        chunk = data.get("chunk", "")
                        if chunk:
                            yield chunk

                from app.voice.tts_streamer import stream_chat_and_tts
                async for event in stream_chat_and_tts(raw_text_stream(), tts_service=tts_service, cancel_event=cancel_event):
                    if cancel_event.is_set():
                        yield f"data: {json.dumps({'type': 'interrupted', 'turn_id': active_turn_id, 'total_ms': (time.time() - t_start) * 1000.0})}\n\n"
                        return
                    event["turn_id"] = active_turn_id
                    yield f"data: {json.dumps(event)}\n\n"

            finally:
                ACTIVE_TURNS.pop(active_turn_id, None)

        return StreamingResponse(
            sse_event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
                "X-Turn-ID": active_turn_id,
            },
        )
    except Exception as err:
        ACTIVE_TURNS.pop(active_turn_id, None)
        raise err
