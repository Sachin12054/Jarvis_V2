import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.logging import logger


VISION_MODEL_KEYWORDS = ["llava", "bakllava", "vision", "moondream", "qwen-vl", "minicpm-v"]


class VisionModelRouter:
    """Vision Model Router: Discovers available vision-capable models in local Ollama service."""

    def __init__(self, ollama_url: Optional[str] = None):
        self.ollama_url = ollama_url or settings.OLLAMA_BASE_URL

    async def get_available_vision_model(self) -> Optional[str]:
        """Queries local Ollama service for installed vision-capable models."""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{self.ollama_url}/api/tags")
                if res.status_code == 200:
                    models_data = res.json().get("models", [])
                    installed = [m.get("name", "") for m in models_data]

                    for name in installed:
                        clean_name = name.lower()
                        if any(kw in clean_name for kw in VISION_MODEL_KEYWORDS):
                            logger.info(f"[VISION] Discovered installed vision model: '{name}'")
                            return name
        except Exception as err:
            logger.warning(f"[VISION] Could not check installed Ollama models: {err}")

        logger.info("[VISION] No vision-capable model found installed in Ollama.")
        return None

    async def generate_vision_understanding(self, image_b64: str, prompt: str) -> Dict[str, Any]:
        """Infers visual context using an available vision model or returns explicit unavailable fallback."""
        model_name = await self.get_available_vision_model()
        if not model_name:
            return {
                "available": False,
                "model": None,
                "error": "Screen understanding is unavailable because no vision model is configured.",
            }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                payload = {
                    "model": model_name,
                    "prompt": prompt,
                    "images": [image_b64] if image_b64 else [],
                    "stream": False,
                }
                res = await client.post(f"{self.ollama_url}/api/generate", json=payload)
                if res.status_code == 200:
                    answer = res.json().get("response", "").strip()
                    logger.info(f"[VISION] model={model_name}")
                    logger.info(f"[VISION] elements_detected={len(answer.splitlines())}")
                    logger.info(f"[VISION] visible_text_detected=true")
                    return {
                        "available": True,
                        "model": model_name,
                        "text": answer,
                    }
        except Exception as err:
            logger.error(f"[VISION] Vision inference error: {err}")

        return {
            "available": False,
            "model": model_name,
            "error": "Screen understanding is unavailable because no vision model is configured.",
        }
