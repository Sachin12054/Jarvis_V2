import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.chat import router as chat_router
from app.api.conversations import router as conversations_router
from app.api.desktop_monitoring import router as desktop_monitoring_router
from app.api.file_operations import router as file_operations_router
from app.api.gesture import router as gesture_router
from app.api.health import router as health_router
from app.api.memory import router as memory_router
from app.api.system import router as system_router
from app.api.tools import router as tools_router
from app.api.voice import router as voice_router
from app.core.config import settings
from app.core.exceptions import JarvisException
from app.core.logging import logger
from app.tools.registry import ToolRegistry
from app.voice.stt_provider import LocalWhisperSTTProvider
from app.voice.kokoro_tts import LocalKokoroTTSService


class EndpointFilter(logging.Filter):
    """Filter out routine system metrics polling requests from terminal logs."""
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/api/v1/system/metrics") == -1

logging.getLogger("uvicorn.access").addFilter(EndpointFilter())


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager: Performs STT & Kokoro TTS initialization before yield."""
    pid = os.getpid()
    ppid = getattr(os, "getppid", lambda: None)()

    logger.info(f"[LIFESPAN] pid={pid} ppid={ppid} Starting {settings.APP_NAME} v0.1 in [{settings.APP_ENV}] mode...")
    logger.info(f"LLM Provider configured: '{settings.LLM_PROVIDER}'")

    # FastAPI Lifespan Startup: Initialize Single Authoritative Local STT Singleton BEFORE yield
    logger.info(f"[LOCAL STT LIFESPAN] pid={pid} initialize_called=true")
    stt_provider = LocalWhisperSTTProvider.get_instance()
    stt_provider.initialize()
    app.state.local_stt = stt_provider
    logger.info(f"[LOCAL STT LIFESPAN] pid={pid} initialize_completed=true")

    logger.info(
        f"[LOCAL STT STARTUP DEBUG] pid={pid} "
        f"provider_id={hex(id(stt_provider))} "
        f"ffmpeg_available={stt_provider.ffmpeg_available} "
        f"ffmpeg_path='{stt_provider.ffmpeg_path}' "
        f"ffmpeg_version='{stt_provider.ffmpeg_version}' "
        f"model_name='{stt_provider.model_name}' "
        f"model_loaded={stt_provider.model_loaded} "
        f"whisper_model_is_none={stt_provider.whisper_model is None} "
        f"selftest_passed={stt_provider.selftest_passed} "
        f"ready={stt_provider.ready} "
        f"initialization_error='{stt_provider.initialization_error or 'None'}'"
    )

    # FastAPI Lifespan Startup: Initialize Single Authoritative Local Kokoro TTS Singleton BEFORE yield
    logger.info(f"[LOCAL KOKORO TTS LIFESPAN] pid={pid} initialize_called=true")
    tts_service = LocalKokoroTTSService.get_instance()
    tts_service.initialize()
    app.state.local_tts = tts_service
    logger.info(f"[LOCAL KOKORO TTS LIFESPAN] pid={pid} initialize_completed=true ready={tts_service.ready}")

    # Startup Verification: Confirm registered tools from global singleton registry
    reg = ToolRegistry.get_instance()
    tool_names = [t.name for t in reg.list_tools()]
    logger.info(f"[STARTUP] Verified {len(tool_names)} registered tools: {tool_names}")

    yield
    logger.info(f"[LIFESPAN] pid={pid} Shutting down {settings.APP_NAME}...")


app = FastAPI(
    title=settings.APP_NAME,
    description="JARVIS Core/Brain API Foundation",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(JarvisException)
async def jarvis_exception_handler(request: Request, exc: JarvisException):
    logger.error(f"JarvisException on {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "An internal server error occurred."},
    )


# Include Routers
app.include_router(health_router)
app.include_router(chat_router)
app.include_router(conversations_router)
app.include_router(memory_router)
app.include_router(system_router)
app.include_router(tools_router)
app.include_router(file_operations_router)
app.include_router(desktop_monitoring_router)
app.include_router(voice_router)
app.include_router(gesture_router)

# Mount Frontend Static Web Application
static_frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "static_frontend"))
raw_frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend"))

target_frontend_path = static_frontend_path if os.path.exists(static_frontend_path) else raw_frontend_path

if os.path.exists(target_frontend_path):
    app.mount("/app", StaticFiles(directory=target_frontend_path, html=True), name="frontend")

    @app.get("/")
    async def root():
        return FileResponse(os.path.join(target_frontend_path, "index.html"))
