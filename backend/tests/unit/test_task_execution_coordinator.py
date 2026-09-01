import inspect
import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.core.contracts import (
    JarvisRequest,
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
    ExecutionResult,
    ExecutionStatus,
    VerificationResult,
)
from app.core.brain import TaskPlanner, CapabilityResolver, CapabilityHandler, TaskExecutionCoordinator


def make_dummy_handler(success=True, verified=True, requires_clarification=False, error_msg=None):
    mock = MagicMock(spec=CapabilityHandler)
    exec_res = ExecutionResult(
        action_type="test_action",
        status=ExecutionStatus.VERIFIED if (success and verified) else ExecutionStatus.FAILED,
        success=success,
        error_message=error_msg,
        evidence={"requires_clarification": True} if requires_clarification else {},
    )
    ver_res = VerificationResult(
        verified=verified,
        status="SUCCESS" if verified else "FAILED",
        details=error_msg,
    )
    mock.execute = AsyncMock(return_value=(exec_res, ver_res))
    return mock


@pytest.mark.asyncio
async def test_single_step_task_success():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    handler = make_dummy_handler(success=True, verified=True)
    resolver.register("file_search", handler)

    req = JarvisRequest(conversation_id="c1", raw_input="Search files")
    task = planner.create_task(req)
    step = TaskStep(task_id=task.task_id, description="Search", capability="file_search")
    planner.plan_task(task, steps=[step])

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    executed_task = await coordinator.execute_task(task)

    assert executed_task.state == TaskState.COMPLETED
    assert step.state == TaskStepState.COMPLETED
    assert step.result.success is True
    assert step.verification.verified is True


@pytest.mark.asyncio
async def test_dependent_steps_execute_in_correct_order():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    call_order = []

    async def exec_a(step, context=None):
        call_order.append("A")
        return ExecutionResult(action_type="cap_a", success=True), VerificationResult(verified=True)

    async def exec_b(step, context=None):
        call_order.append("B")
        return ExecutionResult(action_type="cap_b", success=True), VerificationResult(verified=True)

    h_a = MagicMock(spec=CapabilityHandler)
    h_a.execute = exec_a
    h_b = MagicMock(spec=CapabilityHandler)
    h_b.execute = exec_b
    resolver.register("cap_a", h_a)
    resolver.register("cap_b", h_b)

    req = JarvisRequest(conversation_id="c1", raw_input="Dependent steps")
    task = planner.create_task(req)
    step_a = TaskStep(task_id=task.task_id, step_id="sa", description="A", capability="cap_a")
    step_b = TaskStep(task_id=task.task_id, step_id="sb", description="B", capability="cap_b", depends_on=["sa"])
    planner.plan_task(task, steps=[step_a, step_b])

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    executed_task = await coordinator.execute_task(task)

    assert executed_task.state == TaskState.COMPLETED
    assert call_order == ["A", "B"]


@pytest.mark.asyncio
async def test_unknown_capability_structured_failure():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    req = JarvisRequest(conversation_id="c1", raw_input="Unknown capability")
    task = planner.create_task(req)
    s1 = TaskStep(task_id=task.task_id, description="Unknown", capability="non_existent")
    planner.plan_task(task, steps=[s1])

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    res = await coordinator.execute_task(task)
    assert res.state == TaskState.FAILED
    assert s1.state == TaskStepState.FAILED
    assert s1.result.error_code == "UNKNOWN_CAPABILITY"


@pytest.mark.asyncio
async def test_execution_failure_halts_dependent_steps():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    h_fail = make_dummy_handler(success=False, error_msg="Connection failed")
    h_next = make_dummy_handler()
    resolver.register("cap_fail", h_fail)
    resolver.register("cap_next", h_next)

    req = JarvisRequest(conversation_id="c1", raw_input="Failure halt")
    task = planner.create_task(req)
    s1 = TaskStep(task_id=task.task_id, step_id="s1", description="Fail", capability="cap_fail")
    s2 = TaskStep(task_id=task.task_id, step_id="s2", description="Next", capability="cap_next", depends_on=["s1"])
    planner.plan_task(task, steps=[s1, s2])

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    res = await coordinator.execute_task(task)
    assert res.state == TaskState.FAILED
    assert s1.state == TaskStepState.FAILED
    assert s2.state == TaskStepState.PENDING
    h_next.execute.assert_not_called()


@pytest.mark.asyncio
async def test_verification_failure_prevents_completion():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    h_unverif = make_dummy_handler(success=True, verified=False, error_msg="Assertion unverified")
    resolver.register("cap_unverif", h_unverif)

    req = JarvisRequest(conversation_id="c1", raw_input="Unverified")
    task = planner.create_task(req)
    s1 = TaskStep(task_id=task.task_id, description="Unverified", capability="cap_unverif")
    planner.plan_task(task, steps=[s1])

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    res = await coordinator.execute_task(task)
    assert res.state == TaskState.FAILED
    assert s1.state == TaskStepState.FAILED


@pytest.mark.asyncio
async def test_cancellation_before_execution():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    h = make_dummy_handler()
    resolver.register("cap1", h)

    req = JarvisRequest(conversation_id="c1", raw_input="Cancel early")
    task = planner.create_task(req)
    s1 = TaskStep(task_id=task.task_id, description="1", capability="cap1")
    planner.plan_task(task, steps=[s1])

    cancel_evt = asyncio.Event()
    cancel_evt.set()

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    res = await coordinator.execute_task(task, cancel_event=cancel_evt)
    assert res.state == TaskState.CANCELLED
    h.execute.assert_not_called()


@pytest.mark.asyncio
async def test_clarification_causes_waiting_and_resume():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    h_clarif = make_dummy_handler(success=True, verified=True, requires_clarification=True)
    resolver.register("cap_clarif", h_clarif)

    req = JarvisRequest(conversation_id="c1", raw_input="Ambiguous entity")
    task = planner.create_task(req)
    s1 = TaskStep(task_id=task.task_id, description="Clarify", capability="cap_clarif")
    planner.plan_task(task, steps=[s1])

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)
    res = await coordinator.execute_task(task)
    assert res.state == TaskState.WAITING

    h_normal = make_dummy_handler(success=True, verified=True, requires_clarification=False)
    resolver.register("cap_clarif", h_normal)
    res_resumed = await coordinator.execute_task(res)
    assert res_resumed.state == TaskState.COMPLETED


@pytest.mark.asyncio
async def test_architectural_boundary_no_infrastructure_imports():
    import app.core.brain.task_execution_coordinator as tec_module
    import app.core.brain.capability_resolver as cr_module
    source1 = inspect.getsource(tec_module)
    source2 = inspect.getsource(cr_module)
    combined = (source1 + " " + source2).lower()
    forbidden = ["import ollama", "import fastapi", "import whisper", "import kokoro", "import subprocess", "import pyautogui", "import pywinauto", "import win32", "cua_driver", "computerusegateway"]
    for item in forbidden:
        assert item not in combined
