from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.chat import router as chat_router
from app.api.health import router as health_router
from app.core.config import settings
from app.core.exceptions import JarvisException
from app.core.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown logging."""
    logger.info(f"Starting {settings.APP_NAME} v0.1 in [{settings.APP_ENV}] mode...")
    logger.info(f"LLM Provider configured: '{settings.LLM_PROVIDER}'")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")


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
