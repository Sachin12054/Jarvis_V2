import re
from enum import Enum
from typing import Tuple, Dict, Any, Optional


class IntentDomain(str, Enum):
    LOCATION = "location"
    PROFILE_EDUCATION = "profile_education"
    PROFILE_IDENTITY = "profile_identity"
    PROFILE_PROJECTS = "profile_projects"
    PROFILE_INTERESTS = "profile_interests"
    PROFILE_CAREER = "profile_career"
    SYSTEM_METRICS = "system_metrics"
    FILESYSTEM = "filesystem"
    MIXED = "mixed"
    GENERAL_CHAT = "general_chat"


class IntentClassifier:
    """Classifies user dialogue turns into explicit, decoupled intent domains."""

    @staticmethod
    def classify_intent(user_message: str) -> IntentDomain:
        clean = user_message.strip().lower()

        # Education domain queries
        has_education_kw = bool(re.search(
            r'\bwhere\s+(?:am\s+i|do\s+i)\s+study\b|\bwhere\s+am\s+i\s+studying\b|\bwhere\s+do\s+i\s+go\s+to\s+(?:college|school|university)\b|\bwhat\s+(?:college|university)\b|\bdegree\b|\bspecialization\b|\bgraduate\b|\bgraduation\b|\bmy\s+college\b|\bmy\s+university\b',
            clean
        ))

        # Physical location queries
        has_location_kw = bool(re.search(
            r'\bwhere\s+am\s+i\b(?!\s+(?:studying|working|doing|learning))|\bwhat\s+city\b|\bcurrent\s+location\b|\bwhere\s+am\s+i\s+currently\b|\bshow\s+my\s+location\b',
            clean
        ))

        # 1. Mixed query check (e.g. "Where am I and where do I study?")
        if has_location_kw and has_education_kw:
            return IntentDomain.MIXED

        # 2. Education query (e.g. "Where am I studying?", "I'm in Madurai. Where do I study?")
        if has_education_kw:
            return IntentDomain.PROFILE_EDUCATION

        # 3. Location query (e.g. "Where am I?", "What city am I in?")
        if has_location_kw:
            return IntentDomain.LOCATION

        # 4. Identity query (e.g. "What is my name?", "Who am I?")
        if re.search(r'\bwhat\s+is\s+my\s+name\b|\bwhat\'s\s+my\s+name\b|\bwho\s+am\s+i\b', clean):
            return IntentDomain.PROFILE_IDENTITY

        # 5. Projects query (e.g. "What project am I building?", "What projects am I working on?")
        if re.search(r'\bwhat\s+(?:project|projects)\s+am\s+i\b|\bmy\s+projects\b', clean):
            return IntentDomain.PROFILE_PROJECTS

        # 6. Interests query (e.g. "What are my interests?", "What do I like?")
        if re.search(r'\bwhat\s+are\s+my\s+interests\b|\bmy\s+interests\b', clean):
            return IntentDomain.PROFILE_INTERESTS

        # 7. Career query (e.g. "What is my career target?", "What role am I aiming for?")
        if re.search(r'\bwhat\s+is\s+my\s+(?:career|target\s+role)\b|\bmy\s+career\b', clean):
            return IntentDomain.PROFILE_CAREER

        # 8. Hardware & Metrics
        if re.search(r'\bcpu\b|\bram\b|\bgpu\b|\bheavy\s+load\b|\bsystem\s+metrics\b', clean):
            return IntentDomain.SYSTEM_METRICS

        # 9. Filesystem / Codebase search
        if re.search(r'\bfind\b|\bsearch\b|\bread\s+file\b|\blist\s+dir\b', clean):
            return IntentDomain.FILESYSTEM

        return IntentDomain.GENERAL_CHAT
