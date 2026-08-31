import os
import fnmatch
from pathlib import Path
from typing import Tuple, Optional
from app.core.config import settings
from app.core.logging import logger

PROTECTED_PATTERNS = [
    ".env",
    ".env.*",
    "*.pem",
    "*.key",
    "id_rsa",
    "id_rsa.*",
    "id_ed25519",
    "id_ed25519.*",
    "credentials",
    "secrets",
    "secret.*",
    "token.*",
    "*.p12",
    "*.pfx",
]

# File extensions for common binary files
BINARY_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".tiff",
    ".exe", ".dll", ".so", ".dylib", ".bin", ".dat",
    ".zip", ".tar", ".gz", ".7z", ".rar",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".pyc", ".pyo", ".pyd", ".db", ".sqlite", ".sqlite3",
}


class WorkspacePathResolver:
    """Central path security and resolution engine ensuring safe, bounded workspace filesystem operations."""

    def __init__(self, workspace_root: Optional[str] = None):
        root_str = workspace_root or settings.JARVIS_WORKSPACE_ROOT
        self.workspace_root = Path(os.path.abspath(root_str)).resolve()

    def is_protected(self, target_path: Path) -> bool:
        """Checks if a file or directory matches protected file patterns."""
        name = target_path.name.lower()
        rel_path = self.to_relative_string(target_path).lower()

        for pattern in PROTECTED_PATTERNS:
            pattern_lower = pattern.lower()
            if fnmatch.fnmatch(name, pattern_lower) or fnmatch.fnmatch(rel_path, pattern_lower):
                return True
            if name.startswith(".env"):
                return True
        return False

    @staticmethod
    def is_binary_file(target_path: Path) -> bool:
        """Checks if a file has a known binary extension or binary content."""
        if target_path.suffix.lower() in BINARY_EXTENSIONS:
            return True
        return False

    def resolve_path(self, user_path: str = ".") -> Tuple[bool, Optional[Path], Optional[str]]:
        """Resolves user-supplied path string relative to workspace root and enforces security policies."""
        try:
            clean_str = user_path.strip()
            if not clean_str:
                clean_str = "."

            input_path = Path(clean_str)

            # If user provided absolute path
            if input_path.is_absolute():
                target_path = input_path.resolve()
            else:
                target_path = (self.workspace_root / input_path).resolve()

            # Security Check 1: Ensure path is within workspace_root
            try:
                # Python 3.9+ is_relative_to or commonpath check for Windows drive letters
                target_path.relative_to(self.workspace_root)
            except ValueError:
                logger.warning(f"[FILESYSTEM SECURITY] Traversal blocked: Path '{user_path}' resolves outside workspace root '{self.workspace_root}'")
                return False, None, "Access denied: Path resolves outside configured workspace root."

            # Security Check 2: Protected file policy
            if self.is_protected(target_path):
                logger.warning(f"[FILESYSTEM SECURITY] Protected file access blocked: '{self.to_relative_string(target_path)}'")
                return False, None, "Access denied: protected file policy."

            return True, target_path, None

        except Exception as err:
            logger.warning(f"[FILESYSTEM SECURITY] Resolution error for '{user_path}': {err}")
            return False, None, f"Invalid path resolution: {str(err)}"

    def to_relative_string(self, target_path: Path) -> str:
        """Converts absolute workspace path to user-friendly relative path using forward slashes."""
        try:
            rel = target_path.relative_to(self.workspace_root)
            return rel.as_posix() if str(rel) != "." else "."
        except ValueError:
            return target_path.as_posix()
