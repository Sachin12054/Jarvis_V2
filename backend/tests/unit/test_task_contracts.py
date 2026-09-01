import pytest
from app.core.contracts import (
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
    ExecutionResult,
    ExecutionStatus,
)

def test_task_creation_defaults():
    t = Task(request_id="r1", turn_id="t1", objective="Build project")
    assert t.task_id is not None
    assert t.request_id == "r1"
    assert t.turn_id == "t1"
    assert t.objective == "Build project"
    assert t.state == TaskState.PENDING
    assert t.steps == []
    assert t.current_step_id is None

def test_task_step_creation():
    step = TaskStep(
        task_id="task-123",
        order=1,
        description="Search for files",
        capability="file_search",
        arguments={"pattern": "*.py"},
        depends_on=[],
    )
    assert step.step_id is not None
    assert step.task_id == "task-123"
    assert step.order == 1
    assert step.capability == "file_search"
    assert step.state == TaskStepState.PENDING
    assert step.arguments == {"pattern": "*.py"}

def test_task_step_with_execution_result():
    exec_res = ExecutionResult(action_type="file_search", status=ExecutionStatus.VERIFIED, success=True)
    step = TaskStep(
        task_id="t1",
        description="Verify search",
        capability="file_search",
        state=TaskStepState.COMPLETED,
        result=exec_res,
    )
    assert step.state == TaskStepState.COMPLETED
    assert step.result.success is True
