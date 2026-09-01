import pytest
from app.core.contracts import Task, TaskState
from app.core.brain import TaskStateMachine, InvalidStateTransitionError

def test_valid_state_transitions():
    t = Task(request_id="r1", turn_id="t1", objective="Multi-step goal")
    assert t.state == TaskState.PENDING

    TaskStateMachine.transition(t, TaskState.PLANNING)
    assert t.state == TaskState.PLANNING

    TaskStateMachine.transition(t, TaskState.READY)
    assert t.state == TaskState.READY

    TaskStateMachine.transition(t, TaskState.RUNNING)
    assert t.state == TaskState.RUNNING

    TaskStateMachine.transition(t, TaskState.VERIFYING)
    assert t.state == TaskState.VERIFYING

    TaskStateMachine.transition(t, TaskState.COMPLETED)
    assert t.state == TaskState.COMPLETED

def test_invalid_state_transitions():
    t = Task(request_id="r1", turn_id="t1", objective="Goal")
    with pytest.raises(InvalidStateTransitionError):
        TaskStateMachine.transition(t, TaskState.COMPLETED)

    t.state = TaskState.COMPLETED
    with pytest.raises(InvalidStateTransitionError):
        TaskStateMachine.transition(t, TaskState.RUNNING)

    t.state = TaskState.CANCELLED
    with pytest.raises(InvalidStateTransitionError):
        TaskStateMachine.transition(t, TaskState.READY)

def test_failed_reset_transition():
    t = Task(request_id="r1", turn_id="t1", objective="Goal", state=TaskState.FAILED)
    TaskStateMachine.transition(t, TaskState.PENDING)
    assert t.state == TaskState.PENDING
