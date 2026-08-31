import os
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, Any, List, Optional, Set
from app.core.logging import logger
from app.tools.workspace import WorkspacePathResolver, BINARY_EXTENSIONS

DEFAULT_EXCLUDED_DIRS: Set[str] = {
    ".venv",
    "venv",
    "node_modules",
    ".git",
    "dist",
    "build",
    ".cache",
    "__pycache__",
    ".jarvis",
    ".idea",
    ".vscode",
}

SUPPORTED_TEXT_EXTENSIONS: Set[str] = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".txt",
    ".yaml", ".yml", ".toml", ".sql", ".html", ".css", ".scss",
    ".xml", ".ini", ".cfg", ".env", ".example", ".sh", ".bat", ".ps1",
}

MAX_SEARCH_FILE_BYTES = 1_048_576  # 1 MB
MAX_SEARCH_RESULTS = 100


class BaseSearchBackend(ABC):
    """Abstract Base Class for Project Workspace Search Backends."""

    @abstractmethod
    def search(
        self,
        query: str,
        target_path: Path,
        resolver: WorkspacePathResolver,
        max_results: int = MAX_SEARCH_RESULTS,
        max_file_bytes: int = MAX_SEARCH_FILE_BYTES,
    ) -> Dict[str, Any]:
        """Executes search for a query string within target path."""
        pass


class DirectorySearchBackend(BaseSearchBackend):
    """Optimized iterative directory search backend using os.scandir for high performance."""

    def search(
        self,
        query: str,
        target_path: Path,
        resolver: WorkspacePathResolver,
        max_results: int = MAX_SEARCH_RESULTS,
        max_file_bytes: int = MAX_SEARCH_FILE_BYTES,
    ) -> Dict[str, Any]:
        if not query or not query.strip():
            return {"query": query, "matches": [], "total_matches": 0, "truncated": False}

        query_clean = query.strip()
        query_lower = query_clean.lower()
        matches: List[Dict[str, Any]] = []
        truncated = False
        visited_files: Set[str] = set()

        rel_target = resolver.to_relative_string(target_path).lower().strip("/\\")

        # Determine if target path explicitly targets a default-excluded directory
        target_parts = [p.lower() for p in Path(rel_target).parts]
        explicit_excluded_target = any(part in DEFAULT_EXCLUDED_DIRS for part in target_parts)

        # Iterative stack for DFS directory traversal avoiding deep recursion overhead
        dir_stack: List[Path] = [target_path] if target_path.is_dir() else []

        if target_path.is_file():
            self._search_single_file(
                target_path,
                query_lower,
                resolver,
                matches,
                visited_files,
                max_results,
                max_file_bytes,
            )
            return {
                "query": query_clean,
                "path": resolver.to_relative_string(target_path),
                "matches": matches,
                "total_matches": len(matches),
                "truncated": False,
            }

        while dir_stack and len(matches) < max_results:
            current_dir = dir_stack.pop()

            try:
                with os.scandir(current_dir) as entries:
                    for entry in entries:
                        if len(matches) >= max_results:
                            truncated = True
                            break

                        entry_name = entry.name
                        entry_name_lower = entry_name.lower()
                        entry_path = Path(entry.path)

                        if entry.is_dir(follow_symlinks=False):
                            # Skip default excluded directories UNLESS explicitly targeted
                            if not explicit_excluded_target and entry_name_lower in DEFAULT_EXCLUDED_DIRS:
                                continue
                            if entry_name_lower.startswith("."):
                                if not explicit_excluded_target and entry_name_lower != ".":
                                    continue

                            dir_stack.append(entry_path)

                        elif entry.is_file(follow_symlinks=False):
                            self._search_single_file(
                                entry_path,
                                query_lower,
                                resolver,
                                matches,
                                visited_files,
                                max_results,
                                max_file_bytes,
                            )

            except (PermissionError, OSError) as err:
                logger.warning(f"[SEARCH BACKEND] Cannot scan directory '{current_dir}': {err}")
                continue

        if len(matches) >= max_results:
            truncated = True

        return {
            "query": query_clean,
            "path": resolver.to_relative_string(target_path),
            "matches": matches,
            "total_matches": len(matches),
            "truncated": truncated,
        }

    def _search_single_file(
        self,
        file_path: Path,
        query_lower: str,
        resolver: WorkspacePathResolver,
        matches: List[Dict[str, Any]],
        visited_files: Set[str],
        max_results: int,
        max_file_bytes: int,
    ) -> None:
        real_path_str = str(file_path.resolve())
        if real_path_str in visited_files:
            return
        visited_files.add(real_path_str)

        # Skip protected files (.env secrets)
        if resolver.is_protected(file_path):
            return

        # Check binary file extension
        suffix = file_path.suffix.lower()
        if suffix in BINARY_EXTENSIONS:
            return

        # Filter supported extensions if known, or skip obvious binary suffixes
        if suffix and suffix not in SUPPORTED_TEXT_EXTENSIONS and suffix in BINARY_EXTENSIONS:
            return

        try:
            stat = file_path.stat()
            # File size limit check
            if stat.st_size > max_file_bytes:
                return
        except Exception:
            return

        rel_p = resolver.to_relative_string(file_path)

        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                for line_num, line in enumerate(f, start=1):
                    if len(matches) >= max_results:
                        break
                    if query_lower in line.lower():
                        matches.append({
                            "relative_path": rel_p,
                            "line_number": line_num,
                            "line_content": line.strip()[:200],
                        })
        except Exception as read_err:
            logger.debug(f"[SEARCH BACKEND] Skipped unreadable file '{rel_p}': {read_err}")
