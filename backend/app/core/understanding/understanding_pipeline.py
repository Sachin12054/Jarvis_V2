import re
from typing import Dict, Any, Optional
from app.core.contracts import JarvisRequest, UnderstandingResult, TargetDevice
from app.voice.normalization import normalize_voice_command, APPLICATION_ALIASES
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain, IntentPlan
from app.core.adapters import UnderstandingAdapter


class UnderstandingPipeline:
    """Canonical JARVIS Understanding Pipeline.

    Given a JarvisRequest, determines user intent and entities,
    producing a canonical UnderstandingResult without making network calls,
    calling LLMs, or executing desktop actions.
    """

    FAST_PATH_EXACT = {
        "stop": "STOP",
        "cancel": "STOP",
        "stop speaking": "STOP",
        "shut up": "STOP",
        "pause": "PAUSE",
        "freeze": "PAUSE",
        "resume": "RESUME",
        "continue": "RESUME",
        "go back": "GO_BACK",
        "back": "GO_BACK",
        "close tab": "CLOSE_TAB",
    }

    APP_OPEN_KEYWORDS = ("open", "launch", "start", "bring up", "switch to")
    APP_CLOSE_KEYWORDS = ("close", "quit", "exit")
    COMPLEX_KEYWORDS = ("complex task", "multi step", "refactor database schema")

    TOOL_KEYWORDS = {
        "search for pdf files": ("FILESYSTEM_SEARCH", "file_search"),
        "search for text files": ("FILESYSTEM_SEARCH", "file_search"),
        "search for files": ("FILESYSTEM_SEARCH", "file_search"),
        "list directory": ("FILESYSTEM_READ", "list_directory"),
        "get location": ("LOCATION", "get_current_location"),
    }

    @classmethod
    def process(cls, request: JarvisRequest) -> UnderstandingResult:
        """Processes a JarvisRequest to produce a canonical UnderstandingResult."""
        raw_text = (request.raw_input or "").strip()
        normalized_text = (request.normalized_input or raw_text).strip()

        # Step 0: Empty Input Fallback
        if not raw_text and not normalized_text:
            return UnderstandingResult(
                intent="UNKNOWN",
                target_device=request.target_device,
                confidence=0.0,
                ambiguity=True,
                requires_clarification=True,
                clarification_reason="Empty input text",
            )

        # Step 1: Voice Normalization
        norm_text, norm_rule = normalize_voice_command(normalized_text or raw_text)
        text_to_parse = norm_text if norm_text else raw_text
        clean_lower = "".join(ch for ch in text_to_parse.lower() if ch.isalnum() or ch.isspace()).strip()
        clean_lower = re.sub(r"\s+", " ", clean_lower)

        # Step 2: Priority 1 - Exact Fast-Path Direct Commands
        if clean_lower in cls.FAST_PATH_EXACT:
            return UnderstandingResult(
                intent=cls.FAST_PATH_EXACT[clean_lower],
                entities={},
                target_device=request.target_device,
                confidence=request.confidence,
                ambiguity=False,
                requires_clarification=False,
            )

        # Step 3: Priority 1 - Application Launch and Close Commands
        tokens = clean_lower.split()
        if len(tokens) >= 2:
            verb = tokens[0]
            target_raw = " ".join(tokens[1:]).strip()
            if verb in cls.APP_OPEN_KEYWORDS or verb in cls.APP_CLOSE_KEYWORDS:
                canonical_app = APPLICATION_ALIASES.get(target_raw, target_raw.capitalize())
                intent_type = "CLOSE_APPLICATION" if verb in cls.APP_CLOSE_KEYWORDS else "OPEN_APPLICATION"
                is_ambiguous = target_raw.lower() in ("arun", "person", "someone", "something")
                return UnderstandingResult(
                    intent=intent_type,
                    entities={"application": canonical_app, "raw_target": target_raw},
                    target_device=request.target_device,
                    confidence=0.50 if is_ambiguous else request.confidence,
                    ambiguity=is_ambiguous,
                    requires_clarification=is_ambiguous,
                    clarification_reason="Target entity is ambiguous" if is_ambiguous else None,
                )

        # Step 4: Tool Keywords Recognition
        if clean_lower in cls.TOOL_KEYWORDS:
            intent_name, tool_name = cls.TOOL_KEYWORDS[clean_lower]
            return UnderstandingResult(
                intent=intent_name,
                entities={"tool_name": tool_name, "query": text_to_parse},
                target_device=request.target_device,
                confidence=request.confidence,
                ambiguity=False,
            )

        # Step 5: Complex Task Recognition
        if any(kw in clean_lower for kw in cls.COMPLEX_KEYWORDS):
            return UnderstandingResult(
                intent="COMPLEX_TASK",
                entities={"query": text_to_parse},
                target_device=request.target_device,
                confidence=request.confidence,
                ambiguity=False,
            )

        # Step 6: Priority 2 - Math or General Knowledge Query
        if any(clean_lower.startswith(q) for q in ["what is", "who is", "explain", "tell me about"]):
            return UnderstandingResult(
                intent="KNOWLEDGE_QUERY",
                entities={"query": text_to_parse},
                target_device=request.target_device,
                confidence=request.confidence,
                ambiguity=False,
            )

        # Step 7: Priority 3 - Structured Intent Recognition (IntentEngine)
        try:
            intent_plan: IntentPlan = IntentEngine.analyze(text_to_parse, channel=request.input_channel.value)
            if intent_plan and intent_plan.intents:
                und_result = UnderstandingAdapter.from_intent_plan(intent_plan, target_device=request.target_device)
                if request.confidence < 1.0:
                    und_result.confidence = min(und_result.confidence, request.confidence)
                return und_result
        except Exception:
            pass

        return UnderstandingResult(
            intent="GENERAL_CHAT",
            entities={"query": text_to_parse},
            target_device=request.target_device,
            confidence=request.confidence,
            ambiguity=False,
        )
