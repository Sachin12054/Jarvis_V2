import re
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple


class SearchResultRanker:
    """Classifies and ranks search matches into Primary Implementation, Important References, Tests, and Other."""

    @staticmethod
    def classify_and_rank(query: str, matches: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not matches:
            return {
                "query": query,
                "primary": [],
                "references": [],
                "tests": [],
                "other": [],
                "total_matches": 0,
            }

        query_clean = query.strip()
        query_lower = query_clean.lower()

        primary: List[Dict[str, Any]] = []
        references: List[Dict[str, Any]] = []
        tests: List[Dict[str, Any]] = []
        other: List[Dict[str, Any]] = []

        seen_files: Set = set()

        for match in matches:
            rel_p = match.get("relative_path", "")
            rel_lower = rel_p.lower()
            line_content = match.get("line_content", "")
            line_lower = line_content.lower()

            filename = Path(rel_p).name.lower()
            stem = Path(rel_p).stem.lower()

            # Definition indicators in code lines
            is_definition = bool(re.search(
                rf'\b(?:class|def|function|interface|type|const|let|var|export\s+class|export\s+function|export\s+const|export\s+interface)\s+{re.escape(query_lower)}\b',
                line_lower
            ))

            # Is exact filename or stem match
            is_filename_match = stem == query_lower or filename == query_lower

            # Classification logic
            if "test" in rel_lower or "spec" in rel_lower or rel_lower.startswith("tests/"):
                tests.append(match)
            elif is_definition or is_filename_match:
                primary.append(match)
            elif rel_lower.endswith((".py", ".ts", ".tsx", ".js", ".jsx")):
                references.append(match)
            else:
                other.append(match)

        # Fallback: if no primary definition was detected, use first non-test source file match as primary
        if not primary and references:
            primary.append(references.pop(0))

        return {
            "query": query_clean,
            "primary": primary,
            "references": references,
            "tests": tests,
            "other": other,
            "total_matches": len(matches),
        }

    @classmethod
    def format_concise_response(
        self,
        query: str,
        matches: List[Dict[str, Any]],
        mode: str = "summary",  # summary, definition, usages, exhaustive
        max_primary: int = 3,
        max_refs: int = 5,
    ) -> str:
        """Formats classified search results into a clean, concise companion response."""
        if not matches:
            return f"No matches found for '{query}' in the workspace."

        ranked = self.classify_and_rank(query, matches)
        total = ranked["total_matches"]

        # 1. Exhaustive mode: user explicitly asked "Show all MemoryService matches"
        if mode == "exhaustive":
            lines = [f"Found {total} match{'es' if total != 1 else ''} for `{query}`:"]
            for m in matches[:30]:
                lines.append(f"- `{m['relative_path']}:{m['line_number']}`: {m['line_content']}")
            if total > 30:
                lines.append(f"\n*(Showing top 30 of {total} total matches)*")
            return "\n".join(lines)

        # 2. Definition mode: "Where is MemoryService defined?"
        if mode == "definition":
            if ranked["primary"]:
                p = ranked["primary"][0]
                return f"`{query}` is defined in:\n`{p['relative_path']}` (line {p['line_number']}: `{p['line_content']}`)"
            elif ranked["references"]:
                p = ranked["references"][0]
                return f"`{query}` is referenced in:\n`{p['relative_path']}` (line {p['line_number']}: `{p['line_content']}`)"
            return f"No definition found for `{query}`."

        # 3. Usages mode: "Where is MemoryService used?"
        if mode == "usages":
            usage_files = []
            for m in ranked["references"] + ranked["tests"]:
                if m["relative_path"] not in usage_files:
                    usage_files.append(m["relative_path"])
            if usage_files:
                lines = [f"`{query}` is referenced in:"]
                for f in usage_files[:max_refs]:
                    lines.append(f"- `{f}`")
                if len(usage_files) > max_refs:
                    lines.append(f"*(and {len(usage_files) - max_refs} more files)*")
                return "\n".join(lines)
            return f"No usage references found for `{query}`."

        # 4. Default Summary mode: "Find MemoryService in my project"
        lines = []
        if ranked["primary"]:
            lines.append("Found the main implementation:")
            for p in ranked["primary"][:max_primary]:
                lines.append(f"`{p['relative_path']}`")

        ref_files = []
        for m in ranked["references"]:
            p_file = m["relative_path"]
            if p_file not in [p["relative_path"] for p in ranked["primary"]] and p_file not in ref_files:
                ref_files.append(p_file)

        if ref_files:
            lines.append("\nIt's also referenced in:")
            for rf in ref_files[:max_refs]:
                lines.append(f"- `{rf}`")

        if ranked["primary"]:
            lines.append("\nWant me to open the implementation?")

        return "\n".join(lines) if lines else f"Found {total} matches for `{query}`."
