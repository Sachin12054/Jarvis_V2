import re
from typing import Tuple, Optional
from app.core.logging import logger

APPLICATION_ALIASES = {
    "not bad": "Notepad",
    "note pad": "Notepad",
    "notepad": "Notepad",
    "google chrome": "Google Chrome",
    "chrome": "Google Chrome",
    "vs code": "Visual Studio Code",
    "visual studio code": "Visual Studio Code",
    "task manager": "Task Manager",
    "file explorer": "File Explorer",
    "calculator": "Calculator",
    "spotify": "Spotify",
    "youtube": "YouTube",
    "whatsapp": "WhatsApp",
    "settings": "Settings",
    "powerpoint": "PowerPoint",
    "word": "Word",
    "excel": "Excel",
}

COMMAND_PATTERNS = [
    re.compile(r'^(open|launch|start|bring up|switch to)\s+(.+)$', re.IGNORECASE),
    re.compile(r'^(close|quit|stop|exit)\s+(.+)$', re.IGNORECASE),
    re.compile(r'^(play|pause|resume)\s+(.+)$', re.IGNORECASE),
    re.compile(r'^(search|find|look up)\s+(.+)$', re.IGNORECASE),
]

WAKE_WORD_PATTERN = re.compile(r'^(?:jaws|jarvis|hey\s+jarvis|ok\s+jarvis|hi\s+jarvis)[,\s]+', re.IGNORECASE)


def normalize_voice_command(raw_text: str) -> Tuple[str, Optional[str]]:
    """Normalizes recognized speech text using conservative command-domain alias maps and wake-word stripping.
    
    Returns:
        Tuple[str, Optional[str]]: (normalized_text, rule_applied)
    """
    clean_text = raw_text.strip()
    if not clean_text:
        return clean_text, None

    # Step 1: Strip common wake-word prefixes ("Jaws", "Jarvis", "Hey Jarvis", "JARVIS,", etc.)
    wake_word_removed = False
    match_wake = WAKE_WORD_PATTERN.match(clean_text)
    if match_wake:
        clean_text = clean_text[match_wake.end():].strip()
        wake_word_removed = True

    if not clean_text:
        return raw_text.strip(), "wake_word_only"

    # Step 2: Match against known command structures (e.g. "open not bad", "launch chrome")
    clean_lower = clean_text.lower()
    for pattern in COMMAND_PATTERNS:
        match = pattern.match(clean_lower)
        if match:
            verb = match.group(1)
            target = match.group(2).strip()
            
            # Check target in alias map
            if target in APPLICATION_ALIASES:
                canonical_app = APPLICATION_ALIASES[target]
                normalized = f"{verb.capitalize()} {canonical_app}."
                rule = "wake_word_strip+application_alias" if wake_word_removed else "application_alias"
                logger.info(f"[VOICE NORMALIZATION] raw='{raw_text}' normalized='{normalized}' rule='{rule}'")
                return normalized, rule

    # Step 3: Match standalone application names (e.g. "not bad" -> "Notepad")
    clean_stripped = clean_lower.rstrip(".!?")
    if clean_stripped in APPLICATION_ALIASES:
        canonical_app = APPLICATION_ALIASES[clean_stripped]
        normalized = f"{canonical_app}."
        rule = "wake_word_strip+standalone_alias" if wake_word_removed else "standalone_alias"
        logger.info(f"[VOICE NORMALIZATION] raw='{raw_text}' normalized='{normalized}' rule='{rule}'")
        return normalized, rule

    if wake_word_removed:
        rule = "wake_word_strip"
        # Capitalize first letter if needed
        normalized = clean_text[0].upper() + clean_text[1:] if len(clean_text) > 0 else clean_text
        logger.info(f"[VOICE NORMALIZATION] raw='{raw_text}' normalized='{normalized}' rule='{rule}'")
        return normalized, rule

    return clean_text, None
