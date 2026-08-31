import pytest
from httpx import AsyncClient
from pydantic import BaseModel, Field
from typing import Dict, Any
from app.brain.context_manager import ContextManager
from app.tools.base import BaseTool
from app.tools.builtin.system_tools import SystemMetricsTool, SystemStatusTool, OllamaStatusTool
from app.tools.executor import ToolExecutor
from app.tools.registry import ToolRegistry
from app.tools.router import ToolIntentRouter
from app.tools.selector import DynamicToolSelector
from app.tools.schemas import (
    PermissionLevel,
    ToolCategory,
    ToolExecutionContext,
    ToolResult,
)


class SampleArgs(BaseModel):
    query: str = Field(..., min_length=1)
    count: int = Field(default=5, ge=1, le=10)


class SampleCustomTool(BaseTool):
    name = "sample_custom"
    description = "A sample custom tool for testing"
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE
    args_schema = SampleArgs

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        return {"matched_query": kwargs["query"], "count": kwargs["count"]}


class RestrictedSampleTool(BaseTool):
    name = "restricted_sample"
    description = "A restricted tool that must be forbidden"
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.RESTRICTED

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        return {"status": "should never execute"}


class FailingSampleTool(BaseTool):
    name = "failing_sample"
    description = "A tool that throws an unexpected runtime exception"
    category = ToolCategory.SYSTEM
    permission = PermissionLevel.SAFE

    async def run(self, context: ToolExecutionContext, **kwargs: Any) -> Dict[str, Any]:
        raise RuntimeError("Simulated internal hardware sensor failure")


@pytest.fixture(autouse=True)
def reset_registry_before_tests():
    """Resets ToolRegistry instance before each test to ensure test isolation."""
    ToolRegistry.reset_instance()
    yield
    ToolRegistry.reset_instance()


@pytest.mark.asyncio
async def test_tool_registration_and_lookup():
    """Tests registering a tool and looking it up in ToolRegistry."""
    registry = ToolRegistry(register_builtins=False)
    tool = SampleCustomTool()
    registry.register(tool)

    assert registry.has_tool("sample_custom") is True
    assert registry.get_tool("sample_custom") == tool


@pytest.mark.asyncio
async def test_duplicate_tool_rejection():
    """Tests that registering duplicate tool names raises ValueError."""
    registry = ToolRegistry(register_builtins=False)
    tool1 = SampleCustomTool()
    tool2 = SampleCustomTool()
    registry.register(tool1)

    with pytest.raises(ValueError, match="already registered"):
        registry.register(tool2)


@pytest.mark.asyncio
async def test_tool_listing_and_metadata():
    """Tests listing tools and inspecting parameter JSON schemas."""
    registry = ToolRegistry(register_builtins=True)
    tools = registry.list_tools()
    assert len(tools) >= 3

    schemas = registry.get_tool_schemas()
    names = [s.name for s in schemas]
    assert "system_metrics" in names
    assert "system_status" in names
    assert "ollama_status" in names


@pytest.mark.asyncio
async def test_argument_validation():
    """Tests validating tool arguments against Pydantic schema."""
    registry = ToolRegistry(register_builtins=False)
    registry.register(SampleCustomTool())
    executor = ToolExecutor(registry)

    # Valid arguments
    res1 = await executor.execute("sample_custom", {"query": "hello", "count": 3})
    assert res1.success is True
    assert res1.data["matched_query"] == "hello"

    # Invalid arguments (missing required query string)
    res2 = await executor.execute("sample_custom", {"count": 3})
    assert res2.success is False
    assert "validation error" in res2.error.lower()


@pytest.mark.asyncio
async def test_restricted_tool_rejection():
    """Tests that RESTRICTED permission tools are forbidden from execution."""
    registry = ToolRegistry(register_builtins=False)
    registry.register(RestrictedSampleTool())
    executor = ToolExecutor(registry)

    res = await executor.execute("restricted_sample", {})
    assert res.success is False
    assert "RESTRICTED permission level" in res.error


@pytest.mark.asyncio
async def test_unknown_tool_rejection():
    """Tests executing an unregistered tool returns clean error result."""
    executor = ToolExecutor()
    res = await executor.execute("non_existent_tool_xyz", {})
    assert res.success is False
    assert "is not registered" in res.error


@pytest.mark.asyncio
async def test_system_metrics_tool_execution():
    """Tests executing SystemMetricsTool returning CPU, RAM, GPU metrics."""
    tool = SystemMetricsTool()
    context = ToolExecutionContext()
    result = await tool.run(context)

    assert "cpu_usage" in result
    assert "ram_usage" in result
    assert "uptime" in result


@pytest.mark.asyncio
async def test_system_status_tool_execution():
    """Tests executing SystemStatusTool returning operational status."""
    tool = SystemStatusTool()
    context = ToolExecutionContext()
    result = await tool.run(context)

    assert result["backend_status"] == "ONLINE (HTTP 200)"
    assert "metrics_summary" in result


@pytest.mark.asyncio
async def test_ollama_status_tool_execution():
    """Tests executing OllamaStatusTool returning provider health."""
    tool = OllamaStatusTool()
    context = ToolExecutionContext()
    result = await tool.run(context)

    assert "reachable" in result
    assert result["provider"] == "ollama"


@pytest.mark.asyncio
async def test_tool_failure_handling():
    """Tests that tool runtime failures return clean error result without crashing."""
    registry = ToolRegistry(register_builtins=False)
    registry.register(FailingSampleTool())
    executor = ToolExecutor(registry)

    res = await executor.execute("failing_sample", {})
    assert res.success is False
    assert "Simulated internal hardware sensor failure" in res.error


@pytest.mark.asyncio
async def test_deterministic_tool_routing():
    """Tests ToolIntentRouter matching queries to system tools."""
    router = ToolIntentRouter()

    m1 = router.match_tool_intent("show system metrics")
    assert m1 is not None
    assert m1[0] == "system_metrics"

    m2 = router.match_tool_intent("system health")
    assert m2 is not None
    assert m2[0] == "system_status"

    m3 = router.match_tool_intent("ollama status")
    assert m3 is not None
    assert m3[0] == "ollama_status"


@pytest.mark.asyncio
async def test_dynamic_tool_selection_heavy_load():
    """Tests 'Is my laptop under heavy load?' selecting system_metrics dynamically."""
    selector = DynamicToolSelector()
    result = await selector.select_and_execute_tool("Is my laptop under heavy load?")

    assert result is not None
    assert result.success is True
    assert result.tool == "system_metrics"
    assert "cpu_usage" in result.data


@pytest.mark.asyncio
async def test_dynamic_tool_selection_gpu_overheating():
    """Tests 'Is my GPU overheating?' selecting system_metrics dynamically."""
    selector = DynamicToolSelector()
    result = await selector.select_and_execute_tool("Is my GPU overheating?")

    assert result is not None
    assert result.success is True
    assert result.tool == "system_metrics"


@pytest.mark.asyncio
async def test_dynamic_tool_selection_ram_usage():
    """Tests 'How much RAM am I using?' selecting system_metrics dynamically."""
    selector = DynamicToolSelector()
    result = await selector.select_and_execute_tool("How much RAM am I using?")

    assert result is not None
    assert result.success is True
    assert result.tool == "system_metrics"


@pytest.mark.asyncio
async def test_dynamic_tool_selection_ollama_running():
    """Tests 'Is Ollama running?' selecting ollama_status dynamically."""
    selector = DynamicToolSelector()
    result = await selector.select_and_execute_tool("Is Ollama running?")

    assert result is not None
    assert result.tool == "ollama_status"


@pytest.mark.asyncio
async def test_general_conversation_bypasses_tool():
    """Tests that general conversation does not invoke any tool."""
    selector = DynamicToolSelector()
    result = await selector.select_and_execute_tool("What is your favorite sci-fi movie?")

    assert result is None


@pytest.mark.asyncio
async def test_tool_result_formatting_and_context_injection():
    """Tests formatting ToolResult into [TOOL RESULT] context block."""
    result = ToolResult(
        success=True,
        tool="system_metrics",
        data={"cpu_usage": 14.2, "ram_usage": 72.4, "uptime": "01:23:45"},
        error=None,
    )
    formatted = ToolIntentRouter.format_tool_result_context(result)
    assert "[TOOL RESULT]" in formatted
    assert "Tool: system_metrics" in formatted
    assert "Cpu Usage: 14.2" in formatted

    # Injection into ContextManager
    cm = ContextManager()
    msgs = cm.prepare_messages(history=[], new_user_message="Check metrics", memory_context=formatted)
    assert len(msgs) == 2
    assert "[TOOL RESULT]" in msgs[0]["content"]


@pytest.mark.asyncio
async def test_list_tools_api_endpoint(async_client: AsyncClient):
    """Tests GET /api/v1/tools endpoint returning registered tool metadata."""
    res = await async_client.get("/api/v1/tools")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    tool_names = [t["name"] for t in data]
    assert "system_metrics" in tool_names
