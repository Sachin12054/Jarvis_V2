import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.core.logging import logger
from app.tools.base import BaseTool
from app.tools.schemas import PermissionLevel, ToolCategory, ToolExecutionContext
from app.tools.workspace import WorkspacePathResolver
from app.tools.search_backend import BaseSearchBackend, DirectorySearchBackend, MAX_SEARCH_FILE_BYTES, MAX_SEARCH_RESULTS

MAX_DIRECTORY_ENTRIES = 500
MAX_FILE_READ_BYTES = 1_048_576  # 1 MB


# Pydantic Input Argument Schemas
class ListDirectoryArgs(BaseModel):
    path: str = Field(default=".", description="Workspace-relative directory path to list")
    recursive: bool = Field(default=False, description="Whether to recursively traverse subdirectories")
    max_entries: int = Field(default=MAX_DIRECTORY_ENTRIES, ge=1, le=1000, description="Max entries to return")


class ReadFileArgs(BaseModel):
    path: str = Field(..., description="Workspace-relative text file path to read")
    max_bytes: int = Field(default=MAX_FILE_READ_BYTES, ge=1, le=2_097_152, description="Max bytes to read")


class SearchFilesArgs(BaseModel):
    query: str = Field(..., min_length=1, description="Text query to search for inside workspace text files")
    path: str = Field(default=".", description="Workspace-relative starting directory path")
    max_results: int = Field(default=MAX_SEARCH_RESULTS, ge=1, le=500, description="Max search result matches")


class FileInfoArgs(BaseModel):
    path: str = Field(..., description="Workspace-relative file or directory path")


# Tool Implementations
class ListDirectoryTool(BaseTool):
    """Tool that lists files and subdirectories safely within the JARVIS workspace."""

    name = "list_directory"
    description = "Lists files and subdirectories safely within the JARVIS workspace root."
    category = ToolCategory.FILE
    permission = PermissionLevel.SAFE
    args_schema = ListDirectoryArgs

    def __init__(self, resolver: Optional[WorkspacePathResolver] = None):
        self.resolver = resolver or WorkspacePathResolver()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        user_path = kwargs.get("path", ".")
        recursive = kwargs.get("recursive", False)
        max_entries = min(kwargs.get("max_entries", MAX_DIRECTORY_ENTRIES), MAX_DIRECTORY_ENTRIES)

        valid, target_path, err = self.resolver.resolve_path(user_path)
        if not valid or not target_path:
            return {"error": err, "entries": [], "truncated": False}

        if not target_path.exists():
            return {"error": f"Directory '{user_path}' does not exist.", "entries": [], "truncated": False}

        if not target_path.is_dir():
            return {"error": f"Path '{user_path}' is a file, not a directory.", "entries": [], "truncated": False}

        logger.info(f"[FILESYSTEM] list_directory path='{self.resolver.to_relative_string(target_path)}'")

        entries: List[Dict[str, Any]] = []
        truncated = False

        iterator = target_path.rglob("*") if recursive else target_path.iterdir()

        for item in iterator:
            if len(entries) >= max_entries:
                truncated = True
                break

            if self.resolver.is_protected(item):
                continue

            rel_p = self.resolver.to_relative_string(item)
            try:
                stat = item.stat()
                mod_time = datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat()
                entries.append({
                    "name": item.name,
                    "relative_path": rel_p,
                    "type": "directory" if item.is_dir() else "file",
                    "size": stat.st_size if item.is_file() else None,
                    "modified": mod_time,
                })
            except Exception:
                continue

        return {
            "path": self.resolver.to_relative_string(target_path),
            "entries": entries,
            "total_entries": len(entries),
            "truncated": truncated,
        }


class ReadFileTool(BaseTool):
    """Tool that reads UTF-8 text file contents safely within the JARVIS workspace."""

    name = "read_file"
    description = "Reads a text file inside the JARVIS workspace and returns its contents."
    category = ToolCategory.FILE
    permission = PermissionLevel.SAFE
    args_schema = ReadFileArgs

    def __init__(self, resolver: Optional[WorkspacePathResolver] = None):
        self.resolver = resolver or WorkspacePathResolver()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        user_path = kwargs.get("path", "")
        max_bytes = min(kwargs.get("max_bytes", MAX_FILE_READ_BYTES), MAX_FILE_READ_BYTES)

        valid, target_path, err = self.resolver.resolve_path(user_path)
        if not valid or not target_path:
            return {"error": err, "content": None, "truncated": False}

        if not target_path.exists():
            return {"error": f"File '{user_path}' does not exist.", "content": None, "truncated": False}

        if target_path.is_dir():
            return {"error": f"Path '{user_path}' is a directory, not a file.", "content": None, "truncated": False}

        if self.resolver.is_binary_file(target_path):
            return {
                "path": self.resolver.to_relative_string(target_path),
                "error": "Binary or unsupported file type; content was not read.",
                "content": None,
                "truncated": False,
            }

        logger.info(f"[FILESYSTEM] read_file path='{self.resolver.to_relative_string(target_path)}'")

        try:
            file_size = target_path.stat().st_size
            with open(target_path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read(max_bytes)

            truncated = file_size > max_bytes

            return {
                "path": self.resolver.to_relative_string(target_path),
                "content": content,
                "size": file_size,
                "read_bytes": len(content.encode("utf-8")),
                "truncated": truncated,
                "encoding": "utf-8",
            }
        except Exception as read_err:
            return {"error": f"Failed to read file: {str(read_err)}", "content": None, "truncated": False}


class SearchFilesTool(BaseTool):
    """Tool that searches for text content within workspace text files using optimized DirectorySearchBackend."""

    name = "search_files"
    description = "Searches text content inside workspace text files for a query string."
    category = ToolCategory.FILE
    permission = PermissionLevel.SAFE
    args_schema = SearchFilesArgs

    def __init__(
        self,
        resolver: Optional[WorkspacePathResolver] = None,
        search_backend: Optional[BaseSearchBackend] = None,
    ):
        self.resolver = resolver or WorkspacePathResolver()
        self.search_backend = search_backend or DirectorySearchBackend()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        query = kwargs.get("query", "")
        user_path = kwargs.get("path", ".")
        max_results = min(kwargs.get("max_results", MAX_SEARCH_RESULTS), MAX_SEARCH_RESULTS)

        valid, target_path, err = self.resolver.resolve_path(user_path)
        if not valid or not target_path:
            return {"error": err, "matches": [], "truncated": False}

        if not target_path.exists():
            return {"error": f"Search path '{user_path}' does not exist.", "matches": [], "truncated": False}

        logger.info(f"[FILESYSTEM] search_files query='{query}' path='{self.resolver.to_relative_string(target_path)}'")

        return self.search_backend.search(
            query=query,
            target_path=target_path,
            resolver=self.resolver,
            max_results=max_results,
        )


class FileInfoTool(BaseTool):
    """Tool that returns metadata for a file or directory inside the JARVIS workspace."""

    name = "file_info"
    description = "Returns metadata (size, type, modification time, extension) for a workspace file or directory."
    category = ToolCategory.FILE
    permission = PermissionLevel.SAFE
    args_schema = FileInfoArgs

    def __init__(self, resolver: Optional[WorkspacePathResolver] = None):
        self.resolver = resolver or WorkspacePathResolver()

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        user_path = kwargs.get("path", "")
        valid, target_path, err = self.resolver.resolve_path(user_path)

        if not valid or not target_path:
            return {"error": err, "exists": False}

        if not target_path.exists():
            return {
                "path": user_path,
                "exists": False,
                "error": f"Path '{user_path}' does not exist.",
            }

        logger.info(f"[FILESYSTEM] file_info path='{self.resolver.to_relative_string(target_path)}'")

        stat = target_path.stat()
        mod_time = datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat()

        return {
            "path": self.resolver.to_relative_string(target_path),
            "exists": True,
            "type": "directory" if target_path.is_dir() else "file",
            "size": stat.st_size if target_path.is_file() else None,
            "modified": mod_time,
            "extension": target_path.suffix if target_path.is_file() else None,
            "is_protected": self.resolver.is_protected(target_path),
        }
