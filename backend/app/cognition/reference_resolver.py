import re
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.perception.world_model import WorldState, SearchResultItem
from app.core.logging import logger


class ResolvedReference(BaseModel):
    is_reference: bool
    reference_type: str  # "select_result" | "pause" | "resume" | "go_back" | "focus_app" | "none"
    target_index: Optional[int] = None
    target_app: Optional[str] = None
    reason: str


class ReferenceResolver:
    """Natural Reference Resolver: Maps conversational references (this, that, the first one, 3rd video, the window on the left) against WorldState and UI order."""

    @classmethod
    def resolve(cls, user_message: str, world_state: WorldState) -> ResolvedReference:
        clean = user_message.strip().lower()

        # 1. Media Control References
        if re.search(r'\b(?:pause|pause\s+it|pause\s+video|freeze)\b', clean):
            return ResolvedReference(is_reference=True, reference_type="pause", reason="User requested pause on active player")
        if re.search(r'\b(?:resume|play\s+again|unpause|continue)\b', clean):
            return ResolvedReference(is_reference=True, reference_type="resume", reason="User requested resume on active player")
        if re.search(r'\b(?:go\s+back|previous\s+page|back)\b', clean):
            return ResolvedReference(is_reference=True, reference_type="go_back", reason="User requested browser back navigation")

        # 2. Contextual UI Search Result References
        has_results = bool(world_state.browser.search_results or ("youtube.com" in (world_state.browser.current_url or "").lower()))

        if has_results:
            if re.search(r'\b(?:first|1st|number\s+1|result\s+1|option\s+1|first\s+one|first\s+video|1)\b', clean):
                return ResolvedReference(is_reference=True, reference_type="select_result", target_index=1, reason="Mapped 'first one' to result #1")
            if re.search(r'\b(?:second|2nd|number\s+2|result\s+2|option\s+2|second\s+one|second\s+video|2)\b', clean):
                return ResolvedReference(is_reference=True, reference_type="select_result", target_index=2, reason="Mapped 'second one' to result #2")
            if re.search(r'\b(?:third|3rd|number\s+3|result\s+3|option\s+3|third\s+one|the\s+3rd\s+video|3)\b', clean):
                return ResolvedReference(is_reference=True, reference_type="select_result", target_index=3, reason="Mapped 'third one' to result #3")
            if re.search(r'\b(?:fourth|4th|number\s+4|result\s+4|option\s+4|fourth\s+one|fourth\s+video|4)\b', clean):
                return ResolvedReference(is_reference=True, reference_type="select_result", target_index=4, reason="Mapped 'fourth one' to result #4")
            if re.search(r'\b(?:fifth|5th|number\s+5|result\s+5|option\s+5|fifth\s+one|fifth\s+video|5)\b', clean):
                return ResolvedReference(is_reference=True, reference_type="select_result", target_index=5, reason="Mapped 'fifth one' to result #5")
            if re.search(r'\b(?:official|official\s+one|official\s+trailer|sony|marvel)\b', clean):
                return ResolvedReference(is_reference=True, reference_type="select_result", target_index=1, reason="Mapped 'official one' to top official result")

        return ResolvedReference(is_reference=False, reference_type="none", reason="No contextual reference matched")
