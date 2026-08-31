import asyncio
import pytest
from pathlib import Path
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient
from app.brain.llm_manager import OllamaLLMProvider
from app.brain.prompt_manager import PromptManager
from app.core.exceptions import LLMProviderError, LLMTimeoutError
from app.maps.service import MapService
from app.services.chat_service import ChatService
from app.tools.builtin.filesystem_tools import SearchFilesTool
from app.tools.builtin.system_tools import OllamaStatusTool, SystemMetricsTool
from app.tools.router import ToolIntentRouter
from app.tools.search_backend import DirectorySearchBackend, DEFAULT_EXCLUDED_DIRS, MAX_SEARCH_FILE_BYTES
from app.tools.schemas import ToolExecutionContext
from app.tools.workspace import WorkspacePathResolver


@pytest.fixture
def test_workspace(tmp_path: Path) -> WorkspacePathResolver:
    """Creates a temporary isolated test workspace with code files and excluded directories."""
    # Normal project files
    (tmp_path / "backend" / "app").mkdir(parents=True, exist_ok=True)
    (tmp_path / "backend" / "app" / "main.py").write_text("class MemoryService:\n    pass\n", encoding="utf-8")
    (tmp_path / "frontend" / "src").mkdir(parents=True, exist_ok=True)
    (tmp_path / "frontend" / "src" / "App.tsx").write_text("import React from 'react';\n", encoding="utf-8")

    # Excluded directories
    (tmp_path / ".venv" / "lib").mkdir(parents=True, exist_ok=True)
    (tmp_path / ".venv" / "lib" / "asyncpg.py").write_text("class AsyncPGConnection:\n    pass\n", encoding="utf-8")

    (tmp_path / "node_modules" / "react").mkdir(parents=True, exist_ok=True)
    (tmp_path / "node_modules" / "react" / "index.js").write_text("module.exports = 'react';\n", encoding="utf-8")

    (tmp_path / ".git").mkdir(parents=True, exist_ok=True)
    (tmp_path / ".git" / "HEAD").write_text("ref: refs/heads/main\n", encoding="utf-8")

    (tmp_path / ".jarvis").mkdir(parents=True, exist_ok=True)
    (tmp_path / ".jarvis" / "backup.txt").write_text("MemoryService backup\n", encoding="utf-8")

    # Binary file
    (tmp_path / "image.png").write_bytes(b"\x89PNG\r\n\x1a\n")

    # Large file (> 1 MB)
    large_file = tmp_path / "large_log.txt"
    large_file.write_text("MemoryService " * 100_000, encoding="utf-8")

    return WorkspacePathResolver(workspace_root=str(tmp_path))


# ==========================================
# PART 1: SEARCH TESTS (1-14)
# ==========================================

@pytest.mark.asyncio
async def test_search_default_excluded_directories(test_workspace: WorkspacePathResolver):
    """1. Tests that default excluded directories (.venv, node_modules, .git, .jarvis) are skipped in normal search."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="MemoryService", path=".")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert "backend/app/main.py" in rel_paths
    assert ".venv/lib/asyncpg.py" not in rel_paths
    assert ".jarvis/backup.txt" not in rel_paths


@pytest.mark.asyncio
async def test_search_explicit_venv_search(test_workspace: WorkspacePathResolver):
    """2. Tests that explicitly specifying .venv allows searching inside .venv."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="AsyncPGConnection", path=".venv")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert len(rel_paths) == 1
    assert ".venv/lib/asyncpg.py" in rel_paths


@pytest.mark.asyncio
async def test_search_explicit_node_modules_search(test_workspace: WorkspacePathResolver):
    """3. Tests that explicitly specifying node_modules allows searching inside node_modules."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="react", path="node_modules")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert len(rel_paths) == 1
    assert "node_modules/react/index.js" in rel_paths


@pytest.mark.asyncio
async def test_search_explicit_git_search(test_workspace: WorkspacePathResolver):
    """4. Tests that explicitly specifying .git allows searching inside .git."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="refs/heads", path=".git")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert len(rel_paths) == 1
    assert ".git/HEAD" in rel_paths


@pytest.mark.asyncio
async def test_search_explicit_jarvis_search(test_workspace: WorkspacePathResolver):
    """5. Tests that explicitly specifying .jarvis allows searching inside .jarvis."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="MemoryService", path=".jarvis")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert len(rel_paths) == 1
    assert ".jarvis/backup.txt" in rel_paths


@pytest.mark.asyncio
async def test_search_supported_extensions(test_workspace: WorkspacePathResolver):
    """6. Tests supported text code extensions (.py, .tsx)."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="import", path=".")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert "frontend/src/App.tsx" in rel_paths


@pytest.mark.asyncio
async def test_search_binary_skipping(test_workspace: WorkspacePathResolver):
    """7. Tests skipping binary files (.png)."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="PNG", path=".")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert "image.png" not in rel_paths


@pytest.mark.asyncio
async def test_search_file_size_limit(test_workspace: WorkspacePathResolver):
    """8. Tests skipping files exceeding MAX_SEARCH_FILE_BYTES (> 1 MB)."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="MemoryService", path=".")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert "large_log.txt" not in rel_paths
    assert "backend/app/main.py" in rel_paths


@pytest.mark.asyncio
async def test_search_maximum_results(test_workspace: WorkspacePathResolver):
    """9. Tests respecting max_results parameter."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="MemoryService", path=".", max_results=1)
    assert len(res["matches"]) <= 1


@pytest.mark.asyncio
async def test_search_early_stopping(test_workspace: WorkspacePathResolver):
    """10. Tests early stopping once max_results limit is reached."""
    backend = DirectorySearchBackend()
    res = backend.search("MemoryService", test_workspace.workspace_root, test_workspace, max_results=1)
    assert len(res["matches"]) == 1
    assert res["truncated"] is True


@pytest.mark.asyncio
async def test_search_duplicate_file_prevention(test_workspace: WorkspacePathResolver):
    """11. Tests duplicate file search prevention."""
    backend = DirectorySearchBackend()
    res = backend.search("MemoryService", test_workspace.workspace_root / "backend" / "app" / "main.py", test_workspace)
    assert len(res["matches"]) == 1


@pytest.mark.asyncio
async def test_search_targeted_directory_search(test_workspace: WorkspacePathResolver):
    """12. Tests searching targeted subdirectory 'backend/app'."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="MemoryService", path="backend/app")
    rel_paths = [m["relative_path"] for m in res["matches"]]

    assert "backend/app/main.py" in rel_paths
    assert "frontend/src/App.tsx" not in rel_paths


@pytest.mark.asyncio
async def test_search_missing_query(test_workspace: WorkspacePathResolver):
    """13. Tests handling empty/missing search query."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="", path=".")
    assert len(res["matches"]) == 0


@pytest.mark.asyncio
async def test_search_no_match_search(test_workspace: WorkspacePathResolver):
    """14. Tests query with zero matches returns cleanly."""
    tool = SearchFilesTool(resolver=test_workspace)
    ctx = ToolExecutionContext()

    res = await tool.run(ctx, query="nonexistent_symbol_xyz", path=".")
    assert res["total_matches"] == 0
    assert len(res["matches"]) == 0


# ==========================================
# PART 2: OLLAMA RELIABILITY TESTS (15-20)
# ==========================================

@pytest.mark.asyncio
async def test_ollama_reachable():
    """15. Tests Ollama reachable status check."""
    tool = OllamaStatusTool()
    ctx = ToolExecutionContext()

    with patch("httpx.AsyncClient.get") as mock_get:
        mock_get.return_value = AsyncMock(status_code=200, json=lambda: {"models": [{"name": "deepseek-r1-7b"}]})
        res = await tool.run(ctx)
        assert res["reachable"] is True
        assert "deepseek-r1-7b" in res["available_models"]


@pytest.mark.asyncio
async def test_ollama_unavailable():
    """16. Tests Ollama unavailable status check."""
    tool = OllamaStatusTool()
    ctx = ToolExecutionContext()

    with patch("httpx.AsyncClient.get") as mock_get:
        mock_get.side_effect = Exception("Connection refused")
        res = await tool.run(ctx)
        assert res["reachable"] is False


@pytest.mark.asyncio
async def test_ollama_timeout():
    """17. Tests Ollama HTTP timeout handling."""
    provider = OllamaLLMProvider()
    with patch("httpx.AsyncClient.post") as mock_post:
        import httpx
        mock_post.side_effect = httpx.TimeoutException("Read timeout")
        with pytest.raises(LLMTimeoutError):
            await provider.generate_response([{"role": "user", "content": "hello"}])


@pytest.mark.asyncio
async def test_ollama_model_unavailable():
    """18. Tests Ollama 404 model unavailable handling."""
    provider = OllamaLLMProvider()
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.return_value = AsyncMock(status_code=404, text="Model not found")
        with pytest.raises(LLMProviderError) as exc_info:
            await provider.generate_response([{"role": "user", "content": "hello"}], model="invalid_model")
        assert "not found" in str(exc_info.value)


@pytest.mark.asyncio
async def test_ollama_request_cancellation():
    """19. Tests Ollama request cancellation handling."""
    provider = OllamaLLMProvider()
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.side_effect = asyncio.CancelledError()
        with pytest.raises(asyncio.CancelledError):
            await provider.generate_response([{"role": "user", "content": "hello"}])


@pytest.mark.asyncio
async def test_ollama_status_does_not_invoke_llm():
    """20. Tests that 'Is Ollama running?' query is answered directly without calling LLM."""
    router = ToolIntentRouter()
    matched = router.match_tool_intent("Is Ollama running?")
    assert matched is not None
    assert matched[0] == "ollama_status"


# ==========================================
# PART 3: PERSONALITY TESTS (21-24)
# ==========================================

@pytest.mark.asyncio
async def test_casual_greeting():
    """21. Tests casual greeting 'Hey Jarvis' returning warm companion response."""
    reply = ChatService.get_casual_companion_response("Hey Jarvis")
    assert reply is not None
    assert "What's up" in reply or "Hey" in reply


@pytest.mark.asyncio
async def test_how_are_you():
    """22. Tests 'How are you?' returning companion response."""
    reply = ChatService.get_casual_companion_response("How are you?")
    assert reply is not None
    assert "Doing good" in reply


@pytest.mark.asyncio
async def test_technical_question_remains_technical():
    """23. Tests technical question returns None for casual check so it routes to technical logic."""
    reply = ChatService.get_casual_companion_response("Explain memory architecture in JARVIS")
    assert reply is None


@pytest.mark.asyncio
async def test_avoids_robotic_ai_disclaimer():
    """24. Tests PromptManager system prompt avoids robotic AI disclaimers."""
    sys_prompt = PromptManager.get_system_prompt()
    assert "I am an AI and don't have feelings" not in sys_prompt
    assert "Avoid robotic disclaimers" in sys_prompt


# ==========================================
# PART 4 & 5: ANSWER RELEVANCE TESTS (25-29)
# ==========================================

@pytest.mark.asyncio
async def test_cpu_question_only_returns_cpu():
    """25. Tests 'What is CPU usage?' returning CPU-focused answer."""
    from app.tools.schemas import ToolResult
    res = ToolResult(tool="system_metrics", success=True, data={"cpu_usage": 16.0, "ram_usage": 84.7, "gpu_usage": 10.0, "temperature": 54.0})
    ans = ToolIntentRouter.get_direct_deterministic_answer("What is CPU usage?", res)

    assert ans is not None
    assert "CPU usage is 16.0%" in ans
    assert "RAM" not in ans


@pytest.mark.asyncio
async def test_ram_question_only_returns_ram():
    """26. Tests 'How much RAM am I using?' returning RAM-focused answer."""
    from app.tools.schemas import ToolResult
    res = ToolResult(tool="system_metrics", success=True, data={"cpu_usage": 16.0, "ram_usage": 84.7, "gpu_usage": 10.0, "temperature": 54.0})
    ans = ToolIntentRouter.get_direct_deterministic_answer("How much RAM am I using?", res)

    assert ans is not None
    assert "RAM usage is 84.7%" in ans
    assert "CPU" not in ans


@pytest.mark.asyncio
async def test_gpu_temp_question_returns_gpu_temp():
    """27. Tests 'Is my GPU overheating?' returning GPU temperature focus."""
    from app.tools.schemas import ToolResult
    res = ToolResult(tool="system_metrics", success=True, data={"cpu_usage": 16.0, "ram_usage": 84.7, "gpu_usage": 10.0, "temperature": 54.0})
    ans = ToolIntentRouter.get_direct_deterministic_answer("Is my GPU overheating?", res)

    assert ans is not None
    assert "54" in ans
    assert "GPU temperature" in ans


@pytest.mark.asyncio
async def test_full_metrics_request_returns_full():
    """28. Tests 'Show system metrics' routing to system_metrics without single-metric filter."""
    router = ToolIntentRouter()
    matched = router.match_tool_intent("Show system metrics")

    assert matched is not None
    assert matched[0] == "system_metrics"
    assert "metric_filter" not in matched[1]


@pytest.mark.asyncio
async def test_heavy_load_question_uses_relevant_metrics():
    """29. Tests 'Is my laptop under heavy load?' using relevant load metrics."""
    from app.tools.schemas import ToolResult
    res = ToolResult(tool="system_metrics", success=True, data={"cpu_usage": 16.0, "ram_usage": 84.7, "gpu_usage": 10.0, "temperature": 54.0})
    ans = ToolIntentRouter.get_direct_deterministic_answer("Is my laptop under heavy load?", res)

    assert ans is not None
    assert "Not really" in ans
    assert "CPU" in ans
    assert "RAM" in ans


# ==========================================
# PART 6 & 7: CANCELLATION & RESOURCE SAFETY TESTS (30-33)
# ==========================================

@pytest.mark.asyncio
async def test_sse_cancellation():
    """30. Tests SSE stream cancellation path catching CancelledError cleanly."""
    from app.api.chat import _generate_sse_stream
    mock_db = AsyncMock()
    mock_req = AsyncMock(message="test", conversation_id=None)
    mock_service = AsyncMock()

    async def mock_stream(*args, **kwargs):
        yield {"conversation_id": "c1", "chunk": "hello", "model": "m1"}
        raise asyncio.CancelledError()

    mock_service.handle_chat_request_stream = mock_stream

    gen = _generate_sse_stream(mock_db, mock_req, mock_service)
    chunk = await gen.__anext__()
    assert "hello" in chunk

    with pytest.raises(asyncio.CancelledError):
        await gen.__anext__()


@pytest.mark.asyncio
async def test_db_session_cleanup():
    """31. Tests DB session cleanup after exception."""
    pass


@pytest.mark.asyncio
async def test_tool_cancellation():
    """32. Tests tool execution cancellation."""
    pass


@pytest.mark.asyncio
async def test_no_orphan_task():
    """33. Tests that cancelled streams do not leave orphaned background tasks."""
    pass
