import os
import json
import shutil
import psutil
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.core.logging import logger
from app.memory.service import MemoryService


class ChromeProfile(BaseModel):
    name: str
    dir_name: str
    source: str = "chrome_local_state"
    confidence: float = 0.98


class AppDiscoveryResult(BaseModel):
    app_name: str
    executable_path: Optional[str] = None
    is_ambiguous: bool = False
    profiles: List[ChromeProfile] = Field(default_factory=list)
    clarification_question: Optional[str] = None
    selected_profile: Optional[str] = None


class AppDiscoveryService:
    """Application & Profile Discovery Service: Enforces Zero Fabrication Policy by querying real Windows OS and Chrome Local State metadata."""

    _instance: Optional["AppDiscoveryService"] = None

    def __init__(self, memory_service: Optional[MemoryService] = None):
        self.memory_service = memory_service or MemoryService.get_instance()

    @classmethod
    def get_instance(cls) -> "AppDiscoveryService":
        if cls._instance is None:
            cls._instance = AppDiscoveryService()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        cls._instance = None

    def discover_chrome_profiles(self) -> List[ChromeProfile]:
        """Queries actual Chrome Local State JSON metadata and running OS processes without hardcoding fictitious profiles."""
        discovered_profiles: List[ChromeProfile] = []

        # 1. Query Chrome Local State Metadata File on Windows
        local_app_data = os.getenv("LOCALAPPDATA", "")
        if local_app_data:
            local_state_path = os.path.join(local_app_data, "Google", "Chrome", "User Data", "Local State")
            if os.path.exists(local_state_path):
                try:
                    with open(local_state_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    info_cache = data.get("profile", {}).get("info_cache", {})
                    for dir_name, p_info in info_cache.items():
                        prof_name = p_info.get("name", dir_name)
                        discovered_profiles.append(
                            ChromeProfile(
                                name=prof_name,
                                dir_name=dir_name,
                                source="chrome_local_state",
                                confidence=0.98,
                            )
                        )
                    if discovered_profiles:
                        logger.info(f"[DESKTOP] Discovered {len(discovered_profiles)} actual Chrome profiles from Local State.")
                        return discovered_profiles
                except Exception as err:
                    logger.warning(f"[DESKTOP] Error reading Chrome Local State JSON: {err}")

        # 2. Inspect Running OS Chrome Processes for --profile-directory
        try:
            for proc in psutil.process_iter(['name', 'cmdline']):
                if proc.info['name'] and 'chrome' in proc.info['name'].lower():
                    cmdline = proc.info.get('cmdline') or []
                    for arg in cmdline:
                        if arg.startswith('--profile-directory='):
                            p_dir = arg.split('=', 1)[1].strip('"\'')
                            discovered_profiles.append(
                                ChromeProfile(
                                    name=p_dir,
                                    dir_name=p_dir,
                                    source="chrome_process",
                                    confidence=0.90,
                                )
                            )
                            break
                    if discovered_profiles:
                        break
        except Exception:
            pass

        # 3. Default OS Single Profile Fallback if no extra metadata found
        if not discovered_profiles:
            discovered_profiles.append(
                ChromeProfile(
                    name="Default",
                    dir_name="Default",
                    source="os_default_profile",
                    confidence=0.75,
                )
            )

        return discovered_profiles

    async def resolve_application_request(
        self,
        requested_app: str,
        user_message: str = "",
        user_id: str = "local_user",
    ) -> AppDiscoveryResult:
        """Resolves requested application using zero fabrication evidence."""
        app_clean = requested_app.strip().lower()

        if "chrome" in app_clean or "browser" in app_clean:
            profiles = self.discover_chrome_profiles()
            profile_names = [p.name for p in profiles]

            # If only 1 profile exists on the system, there is no ambiguity!
            if len(profiles) <= 1:
                return AppDiscoveryResult(
                    app_name="Chrome",
                    executable_path="chrome.exe",
                    is_ambiguous=False,
                    profiles=profiles,
                    selected_profile=profiles[0].name,
                )

            # Check if user message explicitly specifies profile (e.g. "college chrome")
            for p in profiles:
                if p.name.lower() in user_message.lower():
                    logger.info(f"[APP DISCOVERY] Explicit profile matched in query: '{p.name}'")
                    return AppDiscoveryResult(
                        app_name="Chrome",
                        executable_path="chrome.exe",
                        is_ambiguous=False,
                        profiles=profiles,
                        selected_profile=p.name,
                    )

            # Check long-term memory for learned user preference
            memories = await self.memory_service.search_memory(user_id=user_id, query="chrome profile preference")
            for mem in memories:
                fact = mem.get("fact", "").lower()
                for p in profiles:
                    if p.name.lower() in fact:
                        logger.info(f"[APP DISCOVERY] Learned memory preference matched: '{p.name}'")
                        return AppDiscoveryResult(
                            app_name="Chrome",
                            executable_path="chrome.exe",
                            is_ambiguous=False,
                            profiles=profiles,
                            selected_profile=p.name,
                        )

            # Multiple actual profiles exist without a learned preference: Ask clarification
            clarification = f"I found {len(profiles)} Chrome profiles: {', '.join(profile_names)}. Which one should I use?"
            logger.info(f"[APP DISCOVERY] Profile ambiguity detected for Chrome: {profile_names}")

            return AppDiscoveryResult(
                app_name="Chrome",
                executable_path="chrome.exe",
                is_ambiguous=True,
                profiles=profiles,
                clarification_question=clarification,
            )

        # Standard OS Application Lookup via PATH / Common Locations
        exec_path = shutil.which(app_clean)
        return AppDiscoveryResult(
            app_name=requested_app,
            executable_path=exec_path or requested_app,
            is_ambiguous=False,
        )

    async def save_profile_preference(self, user_id: str, app_name: str, profile_name: str) -> None:
        """Stores learned user profile preference into long-term memory."""
        pref_fact = f"User prefers {profile_name} {app_name} profile for development and browsing."
        await self.memory_service.store_memory(user_id=user_id, fact=pref_fact, category="preference")
        logger.info(f"[APP DISCOVERY] Learned preference saved to memory: '{pref_fact}'")
