import re
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.core.interaction.clarification_context import ClarificationContext


class ResolutionResult(BaseModel):
    """Structured resolution result from ClarificationResolver."""

    resolved: bool
    selected_option: Optional[str] = None
    error_message: Optional[str] = None
    confidence: float = 1.0
    is_cancellation: bool = False
    is_confirmation: bool = False
    confirmation_value: Optional[bool] = None


class ClarificationResolver:
    """Canonical ClarificationResolver for JARVIS V2 core interaction layer.

    Interprets user answers against candidate options deterministically.
    Supports index selection (1, 2, "first", "second"), string matching,
    and yes/no confirmation responses.
    """

    CANCEL_KEYWORDS = {"stop", "cancel", "never mind", "nevermind", "forget it", "abort", "quit"}
    YES_KEYWORDS = {"yes", "yeah", "yep", "sure", "ok", "okay", "true", "correct", "do it", "y"}
    NO_KEYWORDS = {"no", "nope", "nah", "false", "incorrect", "don't", "dont", "n"}

    ORDINAL_MAP = {
        "first": 0,
        "1st": 0,
        "first one": 0,
        "the first": 0,
        "the first one": 0,
        "second": 1,
        "2nd": 1,
        "second one": 1,
        "the second": 1,
        "the second one": 1,
        "third": 2,
        "3rd": 2,
        "third one": 2,
        "the third": 2,
        "the third one": 2,
        "fourth": 3,
        "4th": 3,
        "fourth one": 3,
        "the fourth": 3,
        "the fourth one": 3,
        "fifth": 4,
        "5th": 4,
        "fifth one": 4,
        "the fifth": 4,
        "the fifth one": 4,
    }

    def is_cancellation(self, text: str) -> bool:
        """Check if raw user text indicates intent to cancel."""
        cleaned = text.strip().lower()
        return cleaned in self.CANCEL_KEYWORDS or any(
            cleaned.startswith(kw) for kw in ["stop ", "cancel "]
        )

    def resolve_answer(
        self,
        context: ClarificationContext,
        user_answer: str,
    ) -> ResolutionResult:
        """Resolves a raw user answer against the options in the ClarificationContext."""
        if not user_answer or not user_answer.strip():
            return ResolutionResult(
                resolved=False,
                error_message="Empty answer provided.",
            )

        raw = user_answer.strip()
        cleaned = raw.lower()

        # Check for cancellation
        if self.is_cancellation(raw):
            return ResolutionResult(
                resolved=False,
                is_cancellation=True,
                error_message="User requested cancellation.",
            )

        # Check for Yes / No confirmation questions
        if self._is_confirmation_context(context, cleaned):
            return self._resolve_confirmation(cleaned)

        options = context.candidate_options
        if not options:
            # Free-form answer resolution
            return ResolutionResult(
                resolved=True,
                selected_option=raw,
                confidence=1.0,
            )

        # 1. Index / Ordinal Matching
        idx = self._parse_index(cleaned, len(options))
        if idx is not None and 0 <= idx < len(options):
            return ResolutionResult(
                resolved=True,
                selected_option=options[idx],
                confidence=1.0,
            )

        # 2. Exact Option Name Match (case-insensitive)
        for opt in options:
            if opt.strip().lower() == cleaned:
                return ResolutionResult(
                    resolved=True,
                    selected_option=opt,
                    confidence=1.0,
                )

        # 3. Substring / Token Matching
        matches = []
        for opt in options:
            opt_lower = opt.lower()
            if cleaned in opt_lower or opt_lower in cleaned:
                matches.append(opt)

        if len(matches) == 1:
            return ResolutionResult(
                resolved=True,
                selected_option=matches[0],
                confidence=0.9,
            )
        elif len(matches) > 1:
            return ResolutionResult(
                resolved=False,
                error_message=f"Ambiguous response matches multiple candidate options: {matches}",
            )

        # 4. Unmatched / Invalid Answer
        return ResolutionResult(
            resolved=False,
            error_message=f"Could not match '{raw}' to candidate options {options}.",
        )

    def _is_confirmation_context(self, context: ClarificationContext, cleaned_answer: str) -> bool:
        """Determines if the clarification context represents a boolean yes/no question."""
        options_lower = [o.lower().strip() for o in context.candidate_options]
        if set(options_lower) in ({"yes", "no"}, {"y", "n"}, {"true", "false"}):
            return True
        if cleaned_answer in self.YES_KEYWORDS or cleaned_answer in self.NO_KEYWORDS:
            if not context.candidate_options or all(
                cleaned_answer != o.lower().strip() for o in context.candidate_options
            ):
                return True
        return False

    def _resolve_confirmation(self, cleaned: str) -> ResolutionResult:
        """Resolves confirmation answers (yes / no)."""
        if cleaned in self.YES_KEYWORDS:
            return ResolutionResult(
                resolved=True,
                selected_option="yes",
                is_confirmation=True,
                confirmation_value=True,
            )
        elif cleaned in self.NO_KEYWORDS:
            return ResolutionResult(
                resolved=True,
                selected_option="no",
                is_confirmation=True,
                confirmation_value=False,
            )
        return ResolutionResult(
            resolved=False,
            error_message=f"Unrecognized confirmation response: '{cleaned}'",
        )

    def _parse_index(self, cleaned: str, total_options: int) -> Optional[int]:
        """Parses numeric or ordinal index from text."""
        if cleaned in self.ORDINAL_MAP:
            return self.ORDINAL_MAP[cleaned]

        match = re.search(r"\b(\d+)\b", cleaned)
        if match:
            num = int(match.group(1))
            if 1 <= num <= total_options:
                return num - 1

        for prefix in ["option", "choice", "number", "#"]:
            if prefix in cleaned:
                match_prefix = re.search(r"\d+", cleaned)
                if match_prefix:
                    num = int(match_prefix.group(0))
                    if 1 <= num <= total_options:
                        return num - 1

        return None
