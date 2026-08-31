import difflib
from typing import Tuple

MAX_DIFF_BYTES = 524_288  # 512 KB


def generate_unified_diff(
    old_text: str,
    new_text: str,
    relative_path: str,
    max_bytes: int = MAX_DIFF_BYTES,
) -> Tuple[str, bool]:
    """Generates a clean unified diff string comparing old_text and new_text for relative_path."""
    old_lines = old_text.splitlines(keepends=True)
    new_lines = new_text.splitlines(keepends=True)

    diff_lines = list(
        difflib.unified_diff(
            old_lines,
            new_lines,
            fromfile=f"a/{relative_path}",
            tofile=f"b/{relative_path}",
            lineterm="\n",
        )
    )

    diff_str = "".join(diff_lines)
    if not diff_str and old_text != new_text:
        diff_str = f"--- a/{relative_path}\n+++ b/{relative_path}\n@@ -1 +1 @@\n- {old_text[:100]}\n+ {new_text[:100]}\n"

    truncated = False
    diff_bytes = diff_str.encode("utf-8")
    if len(diff_bytes) > max_bytes:
        diff_str = diff_bytes[:max_bytes].decode("utf-8", errors="ignore") + "\n... [DIFF TRUNCATED]"
        truncated = True

    return diff_str, truncated
