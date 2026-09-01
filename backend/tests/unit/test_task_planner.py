import inspect
import asyncio
import pytest
from app.core.contracts import (
    JarvisRequest,
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
)
from app.core.brain import TaskPlanner

def test_create_task_from_request():
    planner = TaskPlanner()
    req = JarvisRequest(conversation_id="conv-1", raw_input="Prepare RL project")
    task = planner.create_task(req)
    assert task.request_id == req.request_id
    assert task.turn_id == req.turn_id
    assert task.objective == "Prepare RL project"
    assert task.state == TaskState.PENDING

def test_plan_task_with_steps_and_ordering():
    planner = TaskPlanner()
    req = JarvisRequest(conversation_id="conv-1", raw_input="Prepare RL project")
    task = planner.create_task(req)

    step1 = TaskStep(task_id="", description="Search directory", capability="file_search")
    step2 = TaskStep(task_id="", description="Read config", capability="file_read", depends_on=[step1.step_id])

    planned_task = planner.plan_task(task, steps=[step1, step2])
    assert planned_task.state == TaskState.READY
    assert len(planned_task.steps) == 2
    assert planned_task.steps[0].order == 1
    assert planned_task.steps[1].order == 2
    assert planned_task.current_step_id == step1.step_id

def test_get_next_executable_step_with_dependencies():
    planner = TaskPlanner()
    req = JarvisRequest(conversation_id="conv-1", raw_input="Prepare RL project")
    task = planner.create_task(req)
    step1 = TaskStep(task_id="", description="Search directory", capability="file_search")
    step2 = TaskStep(task_id="", description="Read config", capability="file_read", depends_on=[step1.step_id])
    planner.plan_task(task, steps=[step1, step2])

    next_step = planner.get_next_executable_step(task)
    assert next_step.step_id == step1.step_id

    step1.state = TaskStepState.COMPLETED
    next_step_2 = planner.get_next_executable_step(task)
    assert next_step_2.step_id == step2.step_id

def test_empty_plan_handling():
    planner = TaskPlanner()
    req = JarvisRequest(conversation_id="conv-1", raw_input="Empty plan")
    task = planner.create_task(req)
    planned = planner.plan_task(task, steps=[])
    assert planned.state == TaskState.FAILED
    assert "Empty" in planned.metadata.get("error", "")

def test_task_cancellation():
    planner = TaskPlanner()
    req = JarvisRequest(conversation_id="conv-1", raw_input="Cancel task")
    task = planner.create_task(req)
    step1 = TaskStep(task_id="", description="Active step", capability="file_search", state=TaskStepState.RUNNING)
    step2 = TaskStep(task_id="", description="Pending step", capability="file_read", state=TaskStepState.PENDING)
    planner.plan_task(task, steps=[step1, step2])
    task.state = TaskState.RUNNING

    cancel_evt = asyncio.Event()
    cancel_evt.set()
    cancelled_task = planner.cancel_task(task, cancel_event=cancel_evt)
    assert cancelled_task.state == TaskState.CANCELLED
    assert step1.state == TaskStepState.CANCELLED
    assert step2.state == TaskStepState.SKIPPED

def test_architectural_boundary_no_infrastructure_imports():
    import app.core.brain.task_planner as tp_module
    import app.core.brain.task_state_machine as tsm_module
    source1 = inspect.getsource(tp_module)
    source2 = inspect.getsource(tsm_module)
    combined = (source1 + "\\n" + source2).lower()
    forbidden = ["import ollama", "import fastapi", "import whisper", "import kokoro", "import subprocess", "import pyautogui", "import pywinauto", "import win32"]
    for item in forbidden:
        assert item not in combined
