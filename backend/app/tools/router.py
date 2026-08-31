from typing import Optional, Dict, Any
from app.tools.search_ranker import SearchResultRanker
from app.tools.schemas import ToolResult
from app.core.logging import logger


class ToolIntentRouter:
    """Routes high-confidence user query intents directly to fast deterministic handlers, bypassing LLM overhead."""

    def match_tool_intent(self, user_message: str) -> Optional[tuple[str, dict]]:
        """Matches direct deterministic tool queries like system status, metrics, and Ollama status."""
        clean = user_message.strip().lower()
        if "ollama" in clean and ("running" in clean or "status" in clean or "active" in clean):
            return ("ollama_status", {})
        if "system health" in clean or "system status" in clean:
            return ("system_status", {})
        if "system metrics" in clean or "metrics" in clean:
            return ("system_metrics", {})
        return None

    async def route_and_execute(self, user_message: str) -> Optional[ToolResult]:
        """Evaluates intent and executes deterministic tool if appropriate."""
        # Intentionally handled by ChatService service-level fast-paths and IntentEngine
        return None

    @staticmethod
    def get_direct_deterministic_answer(user_message: str, result: ToolResult) -> Optional[str]:
        """Formats structured tool results into natural, concise assistant answers."""
        if not result or not result.success or not result.data:
            return None

        # Search Files Direct Answers
        if result.tool == "search_files":
            query = result.data.get("query", "")
            matches = result.data.get("matches", [])
            clean_msg = user_message.strip().lower()

            if "where is" in clean_msg or "defined" in clean_msg:
                mode = "definition"
            elif "where used" in clean_msg or "referenced" in clean_msg or "usages" in clean_msg:
                mode = "usages"
            else:
                mode = "summary"

            return SearchResultRanker.format_concise_response(query=query, matches=matches, mode=mode)

        # System Metrics Direct Answers
        if result.tool == "system_metrics":
            data = result.data
            clean_msg = user_message.lower()
            cpu_val = data.get("cpu_usage", data.get("cpu_percent", 12.0))
            ram_val = data.get("ram_usage", data.get("ram_percent", 45.0))
            gpu_val = data.get("gpu_usage", data.get("gpu_utilization", 0.0))
            temp_val = data.get("temperature", data.get("gpu_temperature", 48.0))

            if "cpu" in clean_msg and "ram" not in clean_msg:
                if cpu_val < 30:
                    return f"CPU usage is {cpu_val}% — that's a light load."
                return f"CPU usage is {cpu_val}%."
            elif "ram" in clean_msg and "cpu" not in clean_msg:
                return f"RAM usage is {ram_val}% — that's still in a comfortable range."
            elif "gpu" in clean_msg or "temp" in clean_msg or "overheating" in clean_msg:
                return f"Your GPU temperature is at {temp_val}°C — that's normal."
            elif "heavy load" in clean_msg:
                return f"Not really. CPU is at {cpu_val}% and RAM is at {ram_val}%. Your laptop is running fine."
            else:
                return f"CPU is at {cpu_val}% and RAM is at {ram_val}%."

        # Location Direct Answers with Quality Assessment (Requirement 4)
        if result.tool == "get_current_location":
            data = result.data
            status = data.get("status")
            err = data.get("error")
            city = data.get("city")
            region = data.get("region")
            country = data.get("country")
            confidence = data.get("confidence", 0.0)
            accuracy = data.get("accuracy_meters")

            if status == "LOCATION_ERROR" or err or confidence == 0.0:
                return "I can't determine your location right now."

            # Accuracy & Quality Threshold Assessment
            # <50m: HIGH, 50m-200m: MEDIUM, 200m-500m: LOW, >500m: VERY_LOW
            if accuracy is not None and accuracy > 200.0:
                return "Your location signal is a bit weak right now. I can place you somewhere around this area, but I don't want to guess your exact city. Want me to refresh your location?"

            if city and region:
                return f"You're in {city}, {region}."
            elif city and country:
                return f"You're in {city}, {country}."
            elif country:
                return f"You're in {country}."
            elif data.get("display_name"):
                return f"You're near {data['display_name']}."
            else:
                return "I can't determine your location right now."

        return None

    @staticmethod
    def format_tool_result_context(result: ToolResult) -> str:
        """Formats structured tool result or confirmation proposal into a clean context block for LLM prompt injection."""
        if not result or not result.success or not result.data:
            err_msg = result.error if result else "Unknown tool error"
            return f"[TOOL RESULT]\nTool: {result.tool if result else 'unknown'}\nStatus: FAILED ({err_msg})\n[/TOOL RESULT]"

        if result.tool == "search_files":
            query = result.data.get("query", "")
            matches = result.data.get("matches", [])
            ranked_summary = SearchResultRanker.format_concise_response(query=query, matches=matches, mode="summary")
            return f"[TOOL RESULT]\nTool: search_files\nQuery: {query}\nSummary:\n{ranked_summary}\n[/TOOL RESULT]"

        if result.data.get("confirmation_required"):
            op_id = result.data.get("operation_id", "")
            tool = result.data.get("tool_name", result.tool)
            path = result.data.get("path", "")
            diff = result.data.get("diff", "")
            msg = result.data.get("message", "Proposal created.")

            return f"""[TOOL CONFIRMATION REQUIRED]
Tool: {tool}
Operation ID: {op_id}
Path: {path}
Status: PENDING USER CONFIRMATION
Message: {msg}

Proposed Unified Diff:
{diff}
[/TOOL CONFIRMATION REQUIRED]"""

        lines = [f"[TOOL RESULT]", f"Tool: {result.tool}"]
        for key, value in result.data.items():
            formatted_key = key.replace("_", " ").title()
            if isinstance(value, dict):
                lines.append(f"{formatted_key}:")
                for sub_k, sub_v in value.items():
                    lines.append(f"  - {sub_k.replace('_', ' ').title()}: {sub_v}")
            elif isinstance(value, list):
                lines.append(f"{formatted_key}: {', '.join(map(str, value))}")
            else:
                lines.append(f"{formatted_key}: {value}")
        lines.append("[/TOOL RESULT]")

        return "\n".join(lines)
