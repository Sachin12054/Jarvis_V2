import inspect
import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
    ExecutionResult,
    ExecutionStatus,
    VerificationResult,
)
from app.core.brain import TaskPlanner, CapabilityResolver, CapabilityHandler, TaskExecutionCoordinator
from app.core.interaction import ClarificationManager, ClarificationContext, ClarificationResolver


def test_should_clarify_logic():
    manager = ClarificationManager()

    # High confidence -> no clarification
    u_high = UnderstandingResult(raw_input="test", intent="GENERAL_QUERY", confidence=0.98)
    assert manager.should_clarify(u_high) is False

    # Preference present -> no clarification
    u_pref = UnderstandingResult(raw_input="test", intent="OPEN_APPLICATION", confidence=0.6)
    assert manager.should_clarify(u_pref, user_preferences={"OPEN_APPLICATION": "Chrome"}) is False

    # Safe default present -> no clarification
    assert manager.should_clarify(u_pref, safe_defaults={"OPEN_APPLICATION": "Chrome"}) is False

    # Ambiguous -> should clarify
    u_ambig = UnderstandingResult(raw_input="Message Arun", intent="OPEN_APPLICATION", ambiguity=True, confidence=0.6)
    assert manager.should_clarify(u_ambig) is True


def test_minimum_question_behavior():
    manager = ClarificationManager()
    q_two = manager.generate_question("contact", ["Arun College", "Arun Friend"], action_name="message")
    assert "two choices" in q_two
    assert "Arun College and Arun Friend" in q_two
    assert "message" in q_two

    q_def = manager.generate_question("browser", ["Chrome", "Edge"], default_option="Chrome")
    assert "Should I use Chrome" in q_def


def test_create_clarification_transitions_task_to_waiting():
    manager = ClarificationManager()
    planner = TaskPlanner()
    req = JarvisRequest(conversation_id="c1", raw_input="Message Arun")
    task = planner.create_task(req)
    step = TaskStep(task_id=task.task_id, description="Find Arun", capability="contact.search")
    planner.plan_task(task, steps=[step])

    ctx = manager.create_clarification(
        request=req,
        question="Which Arun?",
        missing_information="contact_target",
        candidate_options=["Arun College", "Arun Friend"],
        task=task,
        step=step,
    )

    assert ctx.task_id == task.task_id
    assert task.state == TaskState.WAITING
    assert step.state == TaskStepState.PENDING


def test_process_answer_success_and_task_running():
    manager = ClarificationManager()
    planner = TaskPlanner()
    req = JarvisRequest(conversation_id="c1", raw_input="Message Arun")
    task = planner.create_task(req)
    step = TaskStep(task_id=task.task_id, description="Find Arun", capability="contact.search")
    planner.plan_task(task, steps=[step])

    ctx = manager.create_clarification(
        request=req,
        question="Which Arun?",
        missing_information="contact_target",
        candidate_options=["Arun College", "Arun Friend"],
        task=task,
        step=step,
    )

    success, res_ctx, resolved_val, res_task = manager.process_answer(
        user_answer="College",
        task_id=task.task_id,
    )

    assert success is True
    assert resolved_val == "Arun College"
    assert res_task.state == TaskState.RUNNING
    assert step.arguments["contact_target"] == "Arun College"
    assert step.state == TaskStepState.PENDING


def test_stale_clarification_rejection():
    manager = ClarificationManager()
    success, ctx, err, task = manager.process_answer(
        user_answer="College",
        task_id="non_existent_task_id",
        request_id="non_existent_req_id",
    )

    assert success is False
    assert ctx is None
    assert err == "STALE_OR_UNKNOWN_CLARIFICATION"


def test_request_and_turn_and_task_isolation():
    manager = ClarificationManager()
    req1 = JarvisRequest(conversation_id="c1", request_id="req1", turn_id="t1", raw_input="Req 1")
    req2 = JarvisRequest(conversation_id="c1", request_id="req2", turn_id="t2", raw_input="Req 2")

    ctx1 = manager.create_clarification(
        request=req1,
        question="Q1?",
        missing_information="m1",
        candidate_options=["A", "B"],
    )

    ctx2 = manager.create_clarification(
        request=req2,
        question="Q2?",
        missing_information="m2",
        candidate_options=["X", "Y"],
    )

    pending1 = manager.get_pending_clarification(request_id="req1")
    assert pending1.clarification_id == ctx1.clarification_id

    pending2 = manager.get_pending_clarification(turn_id="t2")
    assert pending2.clarification_id == ctx2.clarification_id


def test_cancellation_while_waiting():
    manager = ClarificationManager()
    planner = TaskPlanner()
    req = JarvisRequest(conversation_id="c1", raw_input="Message Arun")
    task = planner.create_task(req)
    step = TaskStep(task_id=task.task_id, description="Find Arun", capability="contact.search")
    planner.plan_task(task, steps=[step])

    ctx = manager.create_clarification(
        request=req,
        question="Which Arun?",
        missing_information="contact_target",
        candidate_options=["Arun College", "Arun Friend"],
        task=task,
        step=step,
    )

    success, res_ctx, err, res_task = manager.process_answer(
        user_answer="never mind",
        task_id=task.task_id,
    )

    assert success is False
    assert err == "CANCELLED"
    assert res_task.state == TaskState.CANCELLED


@pytest.mark.asyncio
async def test_full_clarification_task_resumption_no_step_repeat():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    manager = ClarificationManager(planner=planner)

    executed_steps = []

    async def exec_step1(step, context=None):
        executed_steps.append("step1")
        return ExecutionResult(action_type="step1", success=True), VerificationResult(verified=True)

    async def exec_step2(step, context=None):
        executed_steps.append("step2")
        if "target" not in step.arguments:
            return (
                ExecutionResult(action_type="step2", success=True, evidence={"requires_clarification": True}),
                VerificationResult(verified=True),
            )
        return ExecutionResult(action_type="step2", success=True), VerificationResult(verified=True)

    h1 = MagicMock(spec=CapabilityHandler)
    h1.execute = exec_step1
    h2 = MagicMock(spec=CapabilityHandler)
    h2.execute = exec_step2

    resolver.register("cap1", h1)
    resolver.register("cap2", h2)

    req = JarvisRequest(conversation_id="c1", raw_input="Two step process")
    task = planner.create_task(req)
    s1 = TaskStep(task_id=task.task_id, step_id="s1", description="1", capability="cap1")
    s2 = TaskStep(task_id=task.task_id, step_id="s2", description="2", capability="cap2", depends_on=["s1"])
    planner.plan_task(task, steps=[s1, s2])

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)

    t1 = await coordinator.execute_task(task)
    assert t1.state == TaskState.WAITING
    assert executed_steps == ["step1", "step2"]

    ctx = manager.create_clarification(
        request=req,
        question="Which target?",
        missing_information="target",
        candidate_options=["Target A", "Target B"],
        task=t1,
        step=s2,
    )

    success, _, val, t_resumed = manager.process_answer("Target A", task_id=t1.task_id)
    assert success is True
    assert val == "Target A"
    assert s2.arguments["target"] == "Target A"

    t_final = await coordinator.execute_task(t_resumed)
    assert t_final.state == TaskState.COMPLETED
    assert s1.state == TaskStepState.COMPLETED
    assert s2.state == TaskStepState.COMPLETED

    assert executed_steps == ["step1", "step2", "step2"]


@pytest.mark.asyncio
async def test_repeated_sequential_clarifications():
    planner = TaskPlanner()
    resolver = CapabilityResolver()
    manager = ClarificationManager(planner=planner)

    async def exec_step(step, context=None):
        if "contact" not in step.arguments:
            return ExecutionResult(action_type="send", success=True, evidence={"requires_clarification": True}), VerificationResult(verified=True)
        if "message" not in step.arguments:
            return ExecutionResult(action_type="send", success=True, evidence={"requires_clarification": True}), VerificationResult(verified=True)
        return ExecutionResult(action_type="send", success=True), VerificationResult(verified=True)

    h = MagicMock(spec=CapabilityHandler)
    h.execute = exec_step
    resolver.register("send_msg", h)

    req = JarvisRequest(conversation_id="c1", raw_input="Send msg")
    task = planner.create_task(req)
    step = TaskStep(task_id=task.task_id, description="Send", capability="send_msg")
    planner.plan_task(task, steps=[step])

    coordinator = TaskExecutionCoordinator(planner=planner, resolver=resolver)

    t = await coordinator.execute_task(task)
    assert t.state == TaskState.WAITING

    ctx1 = manager.create_clarification(req, "Which Arun?", "contact", ["Arun College", "Arun Friend"], task=t, step=step)
    manager.process_answer("College", task_id=t.task_id)

    t = await coordinator.execute_task(t)
    assert t.state == TaskState.WAITING

    ctx2 = manager.create_clarification(req, "What message?", "message", [], task=t, step=step)
    manager.process_answer("I'll reach in 3 minutes", task_id=t.task_id)

    t_final = await coordinator.execute_task(t)
    assert t_final.state == TaskState.COMPLETED
    assert step.arguments["contact"] == "Arun College"
    assert step.arguments["message"] == "I'll reach in 3 minutes"


def test_architectural_boundary_no_infrastructure_imports():
    import app.core.interaction.clarification_context as cc
    import app.core.interaction.clarification_resolver as cr
    import app.core.interaction.clarification_manager as cm

    combined = (inspect.getsource(cc) + " " + inspect.getsource(cr) + " " + inspect.getsource(cm)).lower()
    forbidden = ["import ollama", "import fastapi", "import whisper", "import kokoro", "import subprocess", "import pyautogui", "import pywinauto", "import win32", "cua_driver", "computerusegateway"]
    for item in forbidden:
        assert item not in combined
