import time
from typing import Optional, Dict, Any, Protocol
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    ExecutionResult,
    ExecutionStatus,
    VerificationResult,
    JarvisResponse,
    ResponseType,
)
from app.core.adapters import ExecutionAdapter, VerificationAdapter


class ToolPort(Protocol):
    """Abstract port interface for tool execution."""
    async def execute_tool(self, tool_name: str, kwargs: Dict[str, Any]) -> Any:
        ...


class ToolHandler:
    """Core Tool Execution Handler.

    Coordinates canonical tool execution requests through a ToolPort boundary.
    Contains zero direct OS, filesystem, or browser automation implementation code.
    """

    def __init__(self, tool_port: Optional[ToolPort] = None):
        self._tool_port = tool_port

    @property
    def tool_port(self) -> Optional[ToolPort]:
        if self._tool_port is None:
            try:
                from app.tools.registry import ToolRegistry

                class RegistryToolPort:
                    async def execute_tool(self, tool_name: str, kwargs: Dict[str, Any]) -> Any:
                        reg = ToolRegistry.get_instance()
                        tool = reg.get_tool(tool_name)
                        if not tool:
                            raise ValueError(f"Tool {tool_name} is not registered in ToolRegistry.")
                        return await tool.execute(**kwargs)

                self._tool_port = RegistryToolPort()
            except Exception:
                self._tool_port = None
        return self._tool_port

    async def handle_tool_call(
        self,
        request: JarvisRequest,
        understanding: UnderstandingResult,
        decision: DecisionResult,
    ) -> JarvisResponse:
        """Executes a TOOL_CALL decision and returns a canonical JarvisResponse with ExecutionResult."""
        tool_name = (
            decision.selected_tool
            or understanding.entities.get("tool_name")
            or understanding.intent.lower()
        )

        if not self.tool_port:
            exec_res = ExecutionResult(
                action_type=tool_name,
                status=ExecutionStatus.FAILED,
                success=False,
                error_code="TOOL_REGISTRY_UNAVAILABLE",
                error_message="ToolRegistry port is not available.",
            )
            ver_res = VerificationResult(verified=False, status="FAILED")
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message="Tool execution failed: ToolRegistry port unavailable.",
                response_type=ResponseType.ERROR,
                execution_result=exec_res,
                verification_result=ver_res,
                error="TOOL_REGISTRY_UNAVAILABLE",
            )

        start_time = time.time()
        tool_kwargs = understanding.entities or {}

        try:
            result_data = await self.tool_port.execute_tool(tool_name, tool_kwargs)
            duration_ms = (time.time() - start_time) * 1000.0

            evidence = result_data if isinstance(result_data, dict) else {"result": str(result_data)}
            exec_res = ExecutionResult(
                action_type=tool_name,
                target=str(tool_kwargs.get("target") or tool_kwargs.get("path") or ""),
                status=ExecutionStatus.VERIFIED,
                success=True,
                evidence=evidence,
                duration_ms=duration_ms,
            )
            ver_res = VerificationResult(
                verified=True,
                status="SUCCESS",
                evidence=evidence,
                verification_method="TOOL_EXECUTION",
            )

            msg = f"Tool {tool_name} executed successfully."
            if isinstance(result_data, dict) and "output" in result_data:
                msg = str(result_data["output"])

            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=msg,
                response_type=ResponseType.ACTION,
                execution_result=exec_res,
                verification_result=ver_res,
                should_speak=request.input_channel.value == "voice",
                should_display=True,
                metadata={"tool_name": tool_name},
            )
        except Exception as exc:
            duration_ms = (time.time() - start_time) * 1000.0
            exec_res = ExecutionResult(
                action_type=tool_name,
                status=ExecutionStatus.FAILED,
                success=False,
                error_code="TOOL_EXECUTION_FAILED",
                error_message=str(exc),
                duration_ms=duration_ms,
            )
            ver_res = VerificationResult(
                verified=False,
                status="FAILED",
                error_code="TOOL_EXECUTION_FAILED",
                details=str(exc),
            )
            return JarvisResponse(
                request_id=request.request_id,
                turn_id=request.turn_id,
                message=f"Tool {tool_name} execution failed: {str(exc)}",
                response_type=ResponseType.ERROR,
                execution_result=exec_res,
                verification_result=ver_res,
                error=str(exc),
                metadata={"tool_name": tool_name},
            )
