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


def normalize_voice_command(raw_text: str) -> Tuple[str, Optional[str]]:
    """Normalizes recognized speech text using conservative command-domain alias maps.
    
    Returns:
        Tuple[str, Optional[str]]: (normalized_text, rule_applied)
    """
    clean_text = raw_text.strip()
    if not clean_text:
        return clean_text, None

    # Check for direct or patterned application alias matches
    clean_lower = clean_text.lower()
    
    # 1. Match against known command structures (e.g. "open not bad", "launch chrome")
    for pattern in COMMAND_PATTERNS:
        match = pattern.match(clean_lower)
        if match:
            verb = match.group(1)
            target = match.group(2).strip()
            
            # Check target in alias map
            if target in APPLICATION_ALIASES:
                canonical_app = APPLICATION_ALIASES[target]
                normalized = f"{verb.capitalize()} {canonical_app}."
                logger.info(f"[VOICE NORMALIZATION] raw='{raw_text}' normalized='{normalized}' rule='application_alias'")
                return normalized, "application_alias"

    # 2. Match standalone application names (e.g. "not bad" -> "Notepad")
    clean_stripped = clean_lower.rstrip(".!?")
    if clean_stripped in APPLICATION_ALIASES:
        canonical_app = APPLICATION_ALIASES[clean_stripped]
        normalized = f"{canonical_app}."
        logger.info(f"[VOICE NORMALIZATION] raw='{raw_text}' normalized='{normalized}' rule='standalone_alias'")
        return normalized, "standalone_alias"

    return clean_text, None
