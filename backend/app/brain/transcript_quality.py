import re
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field
from app.core.logging import logger


class TranscriptClassification(str, Enum):
    REAL_SPEECH = "REAL_SPEECH"
    WAKE_WORD_ONLY = "WAKE_WORD_ONLY"
    NON_SPEECH_EVENT = "NON_SPEECH_EVENT"
    LOW_CONFIDENCE = "LOW_CONFIDENCE"
    AMBIENT_SPEECH = "AMBIENT_SPEECH"


class QualityAnalysis(BaseModel):
    original_text: str
    cleaned_text: str
    classification: TranscriptClassification
    is_executable_command: bool
    is_wake_word: bool = False
    noise_artifacts_removed: List[str] = Field(default_factory=list)


class TranscriptQualityEngine:
    """Transcript Quality Layer: Sanitizes raw ElevenLabs STT transcripts and filters non-speech noise artifacts, bracketed events, and wake-word-only utterances."""

    NON_SPEECH_PATTERNS = [
        r'\[\s*(?:clicking|laughs|laughter|coughing|applause|music|silence|snort|sigh|noise)\s*\]',
        r'\(\s*(?:laughter|giggle|cough|sigh)\s*\)',
        r'^\s*[\.!\?\-\s]*$',
    ]

    WAKE_WORD_EXACT = [
        "jarvis", "javis", "hey jarvis", "ok jarvis"
    ]

    @classmethod
    def analyze(cls, text: str) -> QualityAnalysis:
        """Analyzes transcript quality and returns structured QualityAnalysis."""
        original = text.strip()
        cleaned = original
        removed_artifacts: List[str] = []

        for pattern in cls.NON_SPEECH_PATTERNS:
            matches = re.findall(pattern, cleaned, flags=re.IGNORECASE)
            if matches:
                removed_artifacts.extend(matches)
                cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE).strip()

        clean_lower = cleaned.lower().strip()

        if not clean_lower or len(clean_lower) == 0:
            logger.info(f"[QUALITY] non_speech_event_detected original='{original}'")
            return QualityAnalysis(
                original_text=original,
                cleaned_text="",
                classification=TranscriptClassification.NON_SPEECH_EVENT,
                is_executable_command=False,
                noise_artifacts_removed=removed_artifacts,
            )

        if clean_lower in cls.WAKE_WORD_EXACT:
            logger.info(f"[QUALITY] wake_word_only_detected word='{clean_lower}'")
            return QualityAnalysis(
                original_text=original,
                cleaned_text="Jarvis",
                classification=TranscriptClassification.WAKE_WORD_ONLY,
                is_executable_command=False,
                is_wake_word=True,
                noise_artifacts_removed=removed_artifacts,
            )

        if len(clean_lower) < 2:
            logger.info(f"[QUALITY] low_confidence_artifact text='{clean_lower}'")
            return QualityAnalysis(
                original_text=original,
                cleaned_text=cleaned,
                classification=TranscriptClassification.LOW_CONFIDENCE,
                is_executable_command=False,
                noise_artifacts_removed=removed_artifacts,
            )

        logger.info(f"[QUALITY] real_speech_verified text='{cleaned}'")
        return QualityAnalysis(
            original_text=original,
            cleaned_text=cleaned,
            classification=TranscriptClassification.REAL_SPEECH,
            is_executable_command=True,
            noise_artifacts_removed=removed_artifacts,
        )
