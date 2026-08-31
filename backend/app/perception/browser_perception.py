import time
from typing import Dict, Any, List, Optional
from app.agent.os.browser_agent import BrowserAgent
from app.perception.world_model import BrowserState, BrowserTab, SearchResultItem
from app.core.logging import logger


class BrowserPerception:
    """Browser Perception Layer: Inspects active Chrome HWNDs, tabs, URL states, DOM page types, live search results, and player playback state."""

    _instance: Optional["BrowserPerception"] = None

    def __init__(self):
        self.browser_agent = BrowserAgent.get_instance()

    @classmethod
    def get_instance(cls) -> "BrowserPerception":
        if cls._instance is None:
            cls._instance = BrowserPerception()
        return cls._instance

    def perceive_browser(self) -> BrowserState:
        """Queries active BrowserAgent to return BrowserState."""
        agent_state = self.browser_agent.observe_current_page()

        tabs = [
            BrowserTab(
                tab_id=t.tab_id,
                window_id=t.window_id,
                title=t.title,
                url=t.url,
                domain=t.domain,
                active=t.active,
                visible=t.visible,
            )
            for t in self.browser_agent.list_tabs()
        ]

        results = [
            SearchResultItem(
                index=r.index,
                title=r.title,
                channel=r.channel,
                url=r.url,
                bounds=r.bounds,
                source=r.source,
                timestamp=r.timestamp,
            )
            for r in agent_state.current_search_results
        ]

        page_type = "unknown"
        if agent_state.current_url:
            url_clean = agent_state.current_url.lower()
            if "results?search_query=" in url_clean:
                page_type = "search_results"
            elif "watch?v=" in url_clean:
                page_type = "video_page"
            elif "youtube.com" in url_clean:
                page_type = "home"

        state = BrowserState(
            browser_name=agent_state.browser_name,
            browser_window=agent_state.current_window,
            tabs=tabs,
            active_tab=agent_state.current_tab,
            current_url=agent_state.current_url,
            page_type=page_type,
            search_query=agent_state.current_search_query,
            search_results=results,
            selected_result_index=agent_state.selected_result_index,
            playback_state=agent_state.playback_state,
            current_time_sec=agent_state.current_time_sec,
        )

        logger.info(f"[PERCEIVE] browser tab='{state.active_tab}' url='{state.current_url}' page_type='{page_type}' results_count={len(results)}")
        return state
