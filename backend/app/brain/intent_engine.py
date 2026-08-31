import re
from typing import List, Dict, Any, Optional
from app.brain.intent_schema import IntentDomain, IntentItem, IntentPlan
from app.brain.normalizer import InputNormalizer
from app.core.logging import logger


class IntentEngine:
    """Unified Intent Engine with Real Screen Perception, Desktop Controls, and Live Monitoring."""

    @classmethod
    def analyze(
        cls,
        user_message: str,
        channel: str = "chat",
        conversation_history: Optional[List[Dict[str, Any]]] = None,
    ) -> IntentPlan:
        """Analyzes dialogue input, normalizes speech/chat text, extracts entities, and builds a multi-intent execution plan."""
        normalized = InputNormalizer.normalize(user_message)
        original = user_message.strip()

        # 1. Check for short contextual follow-ups using conversation history
        contextual_intent = cls._check_contextual_followup(normalized, conversation_history)
        if contextual_intent:
            plan = IntentPlan(
                channel=channel,
                original_text=original,
                normalized_text=normalized,
                intents=[contextual_intent],
            )
            cls._log_plan_debug(plan)
            return plan

        # 2. Multi-intent clause segmentation
        clauses = cls._segment_clauses(normalized)

        intents: List[IntentItem] = []
        seen_domains = set()
        priority_counter = 1

        for clause in clauses:
            detected = cls._detect_clause_intents(clause)
            for item in detected:
                if item.domain not in seen_domains:
                    item.priority = priority_counter
                    priority_counter += 1
                    intents.append(item)
                    seen_domains.add(item.domain)

        # Fallback to General Chat if no specific intent recognized
        if not intents:
            intents.append(IntentItem(domain=IntentDomain.GENERAL_CHAT, confidence=0.70, priority=1))

        plan = IntentPlan(
            channel=channel,
            original_text=original,
            normalized_text=normalized,
            intents=intents,
        )

        cls._log_plan_debug(plan)
        return plan

    @classmethod
    def _segment_clauses(cls, text: str) -> List[str]:
        """Segments compound sentences into distinct logical clauses."""
        parts = re.split(r'\b(?:and|also|plus|then)\b|[\;\,\?]', text, flags=re.IGNORECASE)
        clauses = [p.strip() for p in parts if p.strip()]
        return clauses if clauses else [text]

    @classmethod
    def _check_contextual_followup(
        cls,
        normalized: str,
        conversation_history: Optional[List[Dict[str, Any]]],
    ) -> Optional[IntentItem]:
        """Resolves short contextual follow-ups using recent dialogue turn history."""
        if not conversation_history:
            return None

        clean = normalized.lower().strip()

        # Follow-up: "And RAM?" / "And the RAM?"
        if re.search(r'^(?:and|how\s+about|what\s+about)\s+(?:the\s+)?ram\b|\bram\b$', clean):
            return IntentItem(domain=IntentDomain.SYSTEM_METRICS, entities={"metric": "ram"}, priority=1)

        # Follow-up: "And GPU?"
        if re.search(r'^(?:and|how\s+about|what\s+about)\s+(?:the\s+)?gpu\b', clean):
            return IntentItem(domain=IntentDomain.SYSTEM_METRICS, entities={"metric": "gpu"}, priority=1)

        return None

    @classmethod
    def _detect_clause_intents(cls, clause: str) -> List[IntentItem]:
        """Detects domain intents with strict Live Desktop & Visual Screen Perception precedence."""
        clean = clause.lower().strip()
        items: List[IntentItem] = []

        # 1. Stop Monitoring
        if re.search(r'\b(?:stop\s+monitoring|stop\s+watching|turn\s+off\s+screen\s+monitoring|stop\s+screen\s+monitoring)\b', clean):
            items.append(IntentItem(domain=IntentDomain.STOP_LIVE_DESKTOP_MONITORING))
            return items

        # 2. Pause Monitoring
        if re.search(r'\b(?:pause\s+screen\s+monitoring|pause\s+monitoring)\b', clean):
            items.append(IntentItem(domain=IntentDomain.PAUSE_LIVE_DESKTOP_MONITORING))
            return items

        # 3. Resume Monitoring
        if re.search(r'\b(?:resume\s+screen\s+monitoring|resume\s+monitoring)\b', clean):
            items.append(IntentItem(domain=IntentDomain.RESUME_LIVE_DESKTOP_MONITORING))
            return items

        # 4. Start Monitoring
        if re.search(r'\b(?:monitor\s+my\s+screen|start\s+monitoring\s+my\s+screen|watch\s+my\s+screen|keep\s+an\s+eye\s+on\s+my\s+screen|watch\s+what\s+i\'m\s+doing)\b', clean):
            items.append(IntentItem(domain=IntentDomain.START_LIVE_DESKTOP_MONITORING))
            return items

        # 5. Cursor Target Query ("What am I pointing at?")
        if re.search(r'\b(?:what\s+am\s+i\s+pointing\s+at|what\'s\s+under\s+my\s+cursor|where\s+is\s+my\s+cursor\s+pointing)\b', clean):
            items.append(IntentItem(domain=IntentDomain.QUERY_CURSOR_TARGET))
            return items

        # 6. Watch Window Mode
        if re.search(r'\b(?:watch\s+this\s+window|watch\s+active\s+window)\b', clean):
            items.append(IntentItem(domain=IntentDomain.WATCH_WINDOW))
            return items

        # 7. Watch Condition Mode
        cond_match = re.search(r'\b(?:tell\s+me\s+when|when)\s+(.+)', clean)
        if cond_match and not re.search(r'\b(?:graduate|study|do\s+i)\b', clean):
            cond_text = cond_match.group(1).strip()
            items.append(IntentItem(domain=IntentDomain.WATCH_CONDITION, entities={"condition": cond_text}))
            return items

        # 8. Real Screen Inspection Intent ("What am I seeing?", "What do you see?", "What is on my screen?", "Find the STOP button")
        screen_patterns = [
            r'\b(?:what\s+am\s+i\s+seeing|what\s+do\s+you\s+see|what\s+is\s+on\s+(?:my\s+)?screen|what\'s\s+on\s+(?:my\s+)?screen|what\'s\s+in\s+front\s+of\s+me|describe\s+what\'s\s+open|what\'s\s+happening\s+on\s+my\s+screen)\b',
            r'\b(?:find|locate|search\s+for)\s+the\s+([a-z0-9_\-\s]+)\s+button\b',
            r'\b(?:what\s+does\s+this\s+button\s+do|what\s+is\s+this|look\s+at\s+this)\b'
        ]
        for p in screen_patterns:
            btn_match = re.search(p, clean)
            if btn_match:
                target_btn = btn_match.group(1) if btn_match.lastindex and btn_match.lastindex >= 1 else None
                items.append(IntentItem(domain=IntentDomain.SCREEN_INSPECTION, entities={"target_element": target_btn} if target_btn else {}))
                return items

        # 9. Mouse Click / GUI Interaction ("Click the STOP button", "Click Run")
        click_match = re.search(r'\b(?:click|press)\s+(?:the\s+)?([a-z0-9_\-\s]+)(?:\s+button)?\b', clean)
        if click_match and not re.search(r'\b(?:open|launch|start)\b', clean):
            target_elem = click_match.group(1).strip()
            items.append(IntentItem(domain=IntentDomain.DESKTOP_ACTION, entities={"action": "click", "target_element": target_elem}))
            return items

        # 10. Query Live Desktop State ("What am I doing?")
        if re.search(r'\b(?:what\s+am\s+i\s+doing|what\s+am\s+i\s+looking\s+at)\b', clean):
            items.append(IntentItem(domain=IntentDomain.QUERY_LIVE_DESKTOP_STATE))
            return items

        GUI_TERMS_REGEX = r'\b(?:button|window|screen|dialog|menu|field|textbox|input|icon|tab|link|error|popup|terminal|run|stop|close|submit|ok|cancel)\b'
        has_gui_term = bool(re.search(GUI_TERMS_REGEX, clean))

        # 11. General Desktop Action Domain ("Open Chrome", "Launch Chrome", "Start Chrome", "Bring up Chrome", "Open my browser", "Open my Gaming profile")
        if re.search(r'\b(?:open|launch|start|bring\s+up|open\s+up|switch\s+to|focus|close)\b.*\b(?:google\s+chrome|chrome|powershell|vs\s+code|visual\s+studio\s+code|git\s+bash|notepad|explorer|application|app|browser|profile|account)\b', clean):
            items.append(IntentItem(domain=IntentDomain.DESKTOP_ACTION, confidence=0.99, priority=1))

        # 12. Process Management Domain
        if re.search(r'\b(?:what\'s\s+running|what\s+processes|which\s+processes|which\s+apps|show\s+(?:me\s+)?what\'s\s+running|show\s+processes|process\s+list|using\s+my\s+cpu|using\s+my\s+ram)\b', clean):
            items.append(IntentItem(domain=IntentDomain.PROCESS_MANAGEMENT))

        # 13. Terminal Action Domain
        if re.search(r'\b(?:run|start)\s+(?:my\s+)?(?:jarvis\s+backend|jarvis\s+frontend|backend|frontend)\b|\b(?:in|using)\s+(?:powershell|bash|cmd|terminal)\b', clean):
            items.append(IntentItem(domain=IntentDomain.TERMINAL_ACTION))

        # 14. System Metrics & Ollama
        if re.search(r'\bollama\b', clean):
            items.append(IntentItem(domain=IntentDomain.OLLAMA_STATUS))

        has_cpu = bool(re.search(r'\bcpu\b', clean))
        has_ram = bool(re.search(r'\bram\b|\bmemory\b', clean))
        has_gpu_temp = bool(re.search(r'\bgpu\s+temp\b|\bgpu\s+temperature\b|\boverheating\b', clean))
        has_gpu = bool(re.search(r'\bgpu\b', clean))

        if (has_cpu or has_ram or has_gpu or has_gpu_temp or re.search(r'\bsystem\s+metrics\b|\blaptop\s+load\b|\bcomputer\s+feels\s+(?:kind\s+of\s+)?slow\b|\blaptop\s+feels\s+slow\b', clean)) and IntentDomain.PROCESS_MANAGEMENT not in [i.domain for i in items]:
            metric_val = "gpu_temp" if has_gpu_temp else ("cpu" if has_cpu else ("ram" if has_ram else ("gpu" if has_gpu else "system")))
            items.append(IntentItem(domain=IntentDomain.SYSTEM_METRICS, entities={"metric": metric_val}))

        # 15. Profile Domains
        if re.search(r'\b(?:where|what)\s+(?:am\s+i|do\s+i|i)\s+study\b|\bstudy\b|\bstudying\b|\bspecialization\b|\bdegree\b|\bgraduate\b|\bgraduation\b|\bcollege\b|\buniversity\b', clean):
            items.append(IntentItem(domain=IntentDomain.PROFILE_EDUCATION))

        if re.search(r'\bwhat\s+is\s+my\s+name\b|\bwhat\'s\s+my\s+name\b|\bwho\s+am\s+i\b', clean):
            items.append(IntentItem(domain=IntentDomain.PROFILE_IDENTITY))

        if re.search(r'\bprojects?\b|\bworking\s+on\b|\bbuilding\b', clean):
            items.append(IntentItem(domain=IntentDomain.PROFILE_PROJECTS))

        if re.search(r'\bwhat\s+are\s+my\s+interests\b|\bmy\s+interests\b', clean):
            items.append(IntentItem(domain=IntentDomain.PROFILE_INTERESTS))

        if re.search(r'\bwhat\s+is\s+my\s+(?:career|target\s+role)\b|\bwhat\s+am\s+i\s+preparing\s+for\b|\bmy\s+career\b|\bpreparing\s+for\b', clean):
            items.append(IntentItem(domain=IntentDomain.PROFILE_CAREER))

        # 16. Location
        if re.search(r'\bwhere\s+am\s+i\b(?!\s+(?:studying|working|doing|learning))|\bwhat\s+city\b|\bcurrent\s+location\b|\bwhere\s+am\s+i\s+currently\b|\bshow\s+my\s+location\b', clean):
            items.append(IntentItem(domain=IntentDomain.LOCATION))

        # 17. Filesystem Search (ONLY if not a GUI/Screen/Monitor query)
        if not has_gui_term and IntentDomain.SCREEN_INSPECTION not in [i.domain for i in items]:
            if re.search(r'\b(?:find\s+file|find\s+directory|search\s+files|read\s+file|list\s+dir|\.py|\.json|\.txt|\.md)\b', clean) or (re.search(r'\bfind\b', clean) and not has_gui_term):
                items.append(IntentItem(domain=IntentDomain.FILESYSTEM_SEARCH))

        return items

    @classmethod
    def _log_plan_debug(cls, plan: IntentPlan) -> None:
        """Logs structured debug plan context for engine diagnostics."""
        domains_list = [i.domain.value for i in plan.intents]
        logger.info(f"[INTENT] channel={plan.channel} original='{plan.original_text}' domains={domains_list}")
