import re
from typing import Tuple, Optional


class InputNormalizer:
    """Normalizes voice transcriptions and chat inputs by stripping filler words and resolving self-corrections/repairs."""

    FILLER_PATTERNS = [
        r'\bhey\s+jarvis\b',
        r'\bok\s+jarvis\b',
        r'\bhi\s+jarvis\b',
        r'\bhello\s+jarvis\b',
        r'\bjarvis\b',
        r'\buh+\b',
        r'\bum+\b',
        r'\blike\b',
        r'\byou\s+know\b',
        r'\bkind\s+of\b',
        r'\bsort\s+of\b',
        r'\bcan\s+you\b',
        r'\bcould\s+you\b',
        r'\btell\s+me\b',
        r'\bplease\b',
        r'\bagain\b',
        r'\bright\s+now\b',
    ]

    @classmethod
    def resolve_self_correction(cls, text: str) -> str:
        """Resolves speech repairs and self-corrections where the user corrects themselves mid-sentence."""
        clean = text.strip()

        # Check for repair markers like "no, I mean", "no wait", "sorry,", "no,", "I mean"
        repair_match = re.search(
            r'^(?P<left>.*?)(?:\s*\.{2,}\s*|\s*[\,\-\—]\s*|\s+)(?:no\s+i\s+mean|no\s+wait|no\b|sorry|i\s+mean)\s*[\,\-]?\s*(?P<right>.*)$',
            clean,
            re.IGNORECASE
        )

        if repair_match:
            left = repair_match.group("left").strip()
            right = repair_match.group("right").strip()

            if not right:
                return left

            # Reconstruct prefix if right is just an entity (e.g. "RAM usage", "GPU temperature")
            left_prefix_match = re.match(r'^(what\'s\s+my|where\s+is\s+my|show\s+my|how\s+much)\s+(?:cpu|ram|gpu|load)', left, re.IGNORECASE)
            right_has_prefix = bool(re.match(r'^(where|what|when|how|show)\b', right, re.IGNORECASE))

            if left_prefix_match and not right_has_prefix:
                prefix_str = re.match(r'^(what\'s\s+my|where\s+is\s+my|show\s+my|how\s+much)\b', left, re.IGNORECASE).group(1)
                return f"{prefix_str} {right}"

            return right

        return clean

    @classmethod
    def normalize(cls, text: str) -> str:
        """Produces a clean normalized representation for intent classification."""
        if not text or not text.strip():
            return ""

        # 1. Resolve self-corrections/repairs first
        corrected = cls.resolve_self_correction(text)

        # 2. Lowercase & clean punctuation whitespace
        clean = corrected.lower().strip()

        # 3. Strip fillers & wake words
        for pat in cls.FILLER_PATTERNS:
            clean = re.sub(pat, ' ', clean, flags=re.IGNORECASE)

        # 4. Collapse extra whitespace
        clean = re.sub(r'\s+', ' ', clean).strip(' ,.?!-')

        return clean if clean else text.strip()
