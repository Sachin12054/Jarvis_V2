import json
import re
from typing import Optional, Dict, Any, List, Tuple
from pydantic import BaseModel, Field, ValidationError
from app.brain.llm_manager import LLMManager
from app.core.logging import logger
from app.tools.executor import ToolExecutor
from app.tools.registry import ToolRegistry
from app.tools.schemas import ToolResult, ToolExecutionContext, ToolMetadata, PermissionLevel

MAX_TOOL_CALLS = 3


class ToolCallSpec(BaseModel):
    """Specification of a tool call selected by LLM or intent router."""
    name: str = Field(..., description="Name of the selected tool")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Keyword arguments for tool execution")


class ToolSelectionResponse(BaseModel):
    """Structured response schema for tool selection evaluation."""
    tool_call: Optional[ToolCallSpec] = Field(default=None, description="Selected tool specification or null if no tool is required")


class DynamicToolSelector:
    """Intelligent Dynamic Tool Selector selecting registered tools based on natural-language user intent."""

    def __init__(
        self,
        registry: Optional[ToolRegistry] = None,
        executor: Optional[ToolExecutor] = None,
        llm_manager: Optional[LLMManager] = None,
    ):
        self.registry = registry or ToolRegistry.get_instance()
        self.executor = executor or ToolExecutor(self.registry)
        self.llm_manager = llm_manager or LLMManager()

    @staticmethod
    def match_natural_intent_heuristics(user_message: str) -> Optional[Tuple[str, Dict[str, Any]]]:
        """Fast natural-language intent matcher for system, filesystem, file modification, and location tools."""
        clean = user_message.strip().lower()

        # 0. Incoming Browser Geolocation Coordinates Match
        coord_match = re.search(r'latitude:\s*([\-0-9\.]+),\s*longitude:\s*([\-0-9\.]+)', user_message, re.IGNORECASE)
        if coord_match:
            try:
                lat = float(coord_match.group(1))
                lng = float(coord_match.group(2))
                acc_match = re.search(r'accuracy:\s*([0-9\.]+)', user_message, re.IGNORECASE)
                acc = float(acc_match.group(1)) if acc_match else None
                return ("get_current_location", {"latitude": lat, "longitude": lng, "accuracy": acc})
            except ValueError:
                pass

        # 1. Where am I / Location queries
        where_am_i_patterns = [
            r'where\s+am\s+i', r'show\s+my\s+(?:current\s+)?location', r'track\s+my\s+location',
            r'my\s+current\s+position', r'my\s+coordinates'
        ]
        for kw in where_am_i_patterns:
            if re.search(kw, clean):
                return ("get_current_location", {})

        # 2. Directions / Route queries
        route_match = re.search(r'(?:take\s+me\s+to|directions?\s+to|how\s+do\s+i\s+get\s+to|navigate\s+to)\s+([a-zA-Z0-9_\-\s\.\,]+)', clean, re.IGNORECASE)
        if route_match:
            dest = route_match.group(1).strip()
            return ("geocode_destination", {"destination": dest})

        # 3. Nearby place search queries
        places_match = re.search(r'find\s+(?:the\s+)?(?:nearest\s+)?([a-zA-Z0-9_\-\s]+)\s+near\s+me', clean, re.IGNORECASE)
        if places_match:
            poi = places_match.group(1).strip()
            return ("search_places", {"query": poi})

        # 4. Edit File Heuristics
        replace_match = re.search(r'(?:replace|change|swap)\s+[\'\"]?(.+?)[\'\"]?\s+(?:with|to)\s+[\'\"]?(.+?)[\'\"]?\s+in\s+([a-zA-Z0-9_\-\.\/\\]+)', user_message, re.IGNORECASE)
        if replace_match:
            old_t = replace_match.group(1).strip()
            new_t = replace_match.group(2).strip()
            filepath = replace_match.group(3).strip()
            return ("edit_file", {"path": filepath, "old_text": old_t, "new_text": new_t})

        # 5. Create File Heuristics
        create_match = re.search(r'create\s+(?:a\s+)?(?:new\s+)?file\s+([a-zA-Z0-9_\-\.\/\\]+)(?:\s+with\s+(?:content|code)\s+[\'\"]?(.+?)[\'\"]?)?', user_message, re.IGNORECASE)
        if create_match:
            filepath = create_match.group(1).strip()
            content = create_match.group(2).strip() if create_match.group(2) else ""
            return ("create_file", {"path": filepath, "content": content})

        # 6. Read File Heuristics
        read_match = re.search(r'(?:read|show|view|display|cat|contents?\s+of)\s+(?:file\s+)?([a-zA-Z0-9_\-\.\/\\]+\.[a-zA-Z0-9]+)', clean)
        if read_match and not clean.startswith("read_file"):
            target_path = read_match.group(1).strip()
            return ("read_file", {"path": target_path})

        # 7. List Directory Heuristics
        dir_match = re.search(r'(?:list|show|dir|ls|what\'?s inside)\s+(?:the\s+)?(?:files?\s+in\s+)?([a-zA-Z0-9_\-\.\/\\]+)', clean)
        if dir_match and not clean.startswith("list_directory"):
            target_dir = dir_match.group(1).strip()
            if target_dir in ["files", "directory", "folder", "project", "workspace"]:
                target_dir = "."
            return ("list_directory", {"path": target_dir})

        # 8. Search Files Content Heuristics
        search_match = re.search(r'(?:find|search|where is|locate)\s+([a-zA-Z0-9_\-\.]+)\s+(?:in|inside|across)\s+(?:my\s+)?(?:project|workspace|codebase|files)', clean)
        if search_match:
            search_query = search_match.group(1).strip()
            return ("search_files", {"query": search_query})

        # 9. File Info Heuristics
        info_match = re.search(r'(?:size|info|stat|metadata|details?)\s+(?:of|for)\s+([a-zA-Z0-9_\-\.\/\\]+)', clean)
        if info_match:
            target_path = info_match.group(1).strip()
            return ("file_info", {"path": target_path})

        # 10. Hardware metrics & load queries
        metrics_keywords = [
            r'heavy\s+load', r'laptop\s+under\s+load', r'computer\s+under\s+load',
            r'cpu\s+usage', r'ram\s+usage', r'memory\s+usage', r'gpu\s+usage',
            r'gpu\s+temp', r'gpu\s+temperature', r'overheating', r'system\s+performance',
            r'how\s+much\s+ram', r'how\s+much\s+cpu', r'system\s+metrics',
        ]
        for kw in metrics_keywords:
            if re.search(kw, clean):
                return ("system_metrics", {})

        # 11. System health & status queries
        status_keywords = [
            r'system\s+status', r'system\s+health', r'how\s+healthy\s+is\s+my\s+computer',
            r'overall\s+system\s+state',
        ]
        for kw in status_keywords:
            if re.search(kw, clean):
                return ("system_status", {})

        # 12. Ollama status queries
        ollama_keywords = [
            r'is\s+ollama\s+running', r'is\s+ollama\s+online', r'is\s+ollama\s+available',
            r'ollama\s+status', r'ollama\s+health',
        ]
        for kw in ollama_keywords:
            if re.search(kw, clean):
                return ("ollama_status", {})

        return None

    def build_selection_prompt(self, user_message: str) -> List[Dict[str, str]]:
        """Constructs compact structured JSON prompt for LLM tool selection evaluation."""
        schemas: List[ToolMetadata] = self.registry.get_tool_schemas()
        tool_descriptions = []
        for s in schemas:
            if s.permission == PermissionLevel.RESTRICTED:
                continue
            tool_descriptions.append(f"- {s.name}: {s.description}")

        tools_block = "\n".join(tool_descriptions) if tool_descriptions else "No tools available."

        system_instruction = f"""You are JARVIS's tool-selection controller.
Analyze the user's query and decide if any registered tool must be invoked to fetch real-time data, workspace files, location/maps data, or modify files.

REGISTERED TOOLS:
{tools_block}

RULES:
1. If the user query requires real-time hardware data, reading workspace files, location/maps info, directions, or modifying workspace files, return JSON:
{{"tool_call": {{"name": "<tool_name>", "arguments": {{"arg_name": "value"}}}}}}

2. If the user query is ordinary conversation, opinion, greeting, factual knowledge, or general explanation, return JSON:
{{"tool_call": null}}

Return ONLY valid JSON matching this schema. Do not include markdown codeblock wrappers or explanatory text."""

        return [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_message},
        ]

    async def select_and_execute_tool(
        self,
        user_message: str,
        context: Optional[ToolExecutionContext] = None,
    ) -> Optional[ToolResult]:
        """Dynamically evaluates user message intent, selects matching registered tool, and executes safely."""
        logger.info(f"[TOOL SELECTOR] Evaluating user intent for message: '{user_message[:60]}...'")

        # 1. Fast Natural Intent Heuristic Match
        heuristic_res = self.match_natural_intent_heuristics(user_message)
        if heuristic_res:
            tool_name, tool_args = heuristic_res
            if self.registry.has_tool(tool_name):
                logger.info(f"[TOOL SELECTOR] Heuristic match selected tool: '{tool_name}' with args {tool_args}")
                return await self.executor.execute(
                    tool_name=tool_name,
                    kwargs=tool_args,
                    context=context,
                )

        # 2. Dynamic LLM Intent Evaluation
        try:
            messages = self.build_selection_prompt(user_message)
            raw_response = await self.llm_manager.generate(messages=messages, timeout=5.0)

            clean_json = raw_response.strip()
            if clean_json.startswith("```"):
                clean_json = re.sub(r'^```(?:json)?\s*', '', clean_json)
                clean_json = re.sub(r'\s*```$', '', clean_json)

            data = json.loads(clean_json)
            parsed_response = ToolSelectionResponse(**data)

            if parsed_response.tool_call:
                selected_name = parsed_response.tool_call.name.strip().lower()
                selected_args = parsed_response.tool_call.arguments or {}

                if not self.registry.has_tool(selected_name):
                    logger.warning(f"[TOOL SELECTOR] Rejected tool selection '{selected_name}': Not registered in ToolRegistry.")
                    return None

                logger.info(f"[TOOL SELECTOR] LLM selected tool: '{selected_name}' with args {selected_args}")
                return await self.executor.execute(
                    tool_name=selected_name,
                    kwargs=selected_args,
                    context=context,
                )
            else:
                logger.info("[TOOL SELECTOR] No tool required for message.")
                return None

        except (json.JSONDecodeError, ValidationError) as parse_err:
            logger.warning(f"[TOOL SELECTOR] Failed to parse tool selection JSON: {parse_err}")
            return None
        except Exception as err:
            logger.warning(f"[TOOL SELECTOR] Tool selection evaluation error: {err}")
            return None
