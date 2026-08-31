from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.agent.os.mouse_controller import RealMouseController, ElementBounds
from app.core.logging import logger


class UIElementInfo(BaseModel):
    element_type: str  # "button" | "input" | "tab" | "menu" | "link" | "unknown"
    label: str
    bounds: ElementBounds
    confidence: float = 0.90


class UIPerception:
    """Universal UI Perception Layer: Classifies buttons, search inputs, tabs, menus, links, and cards."""

    _instance: Optional["UIPerception"] = None

    def __init__(self):
        self.mouse_controller = RealMouseController.get_instance()

    @classmethod
    def get_instance(cls) -> "UIPerception":
        if cls._instance is None:
            cls._instance = UIPerception()
        return cls._instance

    def locate_ui_element(self, element_label: str) -> Optional[UIElementInfo]:
        """Locates UI element and classifies element type."""
        bounds = self.mouse_controller.locate_target_bounds(element_label)
        if not bounds:
            return None

        clean = element_label.lower()
        elem_type = "button"
        if "search" in clean or "input" in clean or "field" in clean:
            elem_type = "input"
        elif "tab" in clean:
            elem_type = "tab"
        elif "link" in clean:
            elem_type = "link"

        info = UIElementInfo(
            element_type=elem_type,
            label=element_label,
            bounds=bounds,
            confidence=bounds.confidence,
        )

        logger.info(f"[PERCEIVE] UI element label='{element_label}' type='{elem_type}' bounds=({bounds.x}, {bounds.y})")
        return info
