import time
import asyncio
import pytest
from app.core.contracts import (
    JarvisRequest,
    Task,
    TaskStep,
    TaskState,
    TaskStepState,
    InputChannel,
)
from app.core.brain.task_planner import TaskPlanner
from app.core.brain.task_execution_coordinator import TaskExecutionCoordinator
from app.core.brain.task_aggregator import TaskAggregator
from app.core.model_router.policy import BaselineAdaptivePolicy, RLContextualBanditShadow
from app.core.model_router.contracts import ModelSelectionContext, TaskComplexity, InteractionChannel


@pytest.mark.asyncio
async def test_baseline_policy_and_shadow_rl():
    policy = BaselineAdaptivePolicy()
    ctx = ModelSelectionContext(
        channel=InteractionChannel.CHAT,
        complexity=TaskComplexity.NORMAL,
        requires_coding=True,
    )
    route = policy.select_route(ctx)
    assert route.is_satisfied is True
    # Production authority selects coding model
    assert route.selected_model == "qwen-coder-3b:latest"
    # Shadow recommendation attached without modifying production route
    shadow = route.selection_metadata.get("shadow_recommendation")
    assert shadow is not None
    assert shadow["authoritative"] is False
    assert shadow["policy_type"] == "RL_CONTEXTUAL_BANDIT_SHADOW"
    assert "shadow_model_id" in shadow
    assert "shadow_confidence" in shadow


def test_dynamic_task_decomposition():
    planner = TaskPlanner()
    req = JarvisRequest(
        conversation_id="conv-1",
        raw_input="Explain computing in simple terms and write a Python function for Fibonacci numbers",
    )
    task = planner.decompose_complex_request(req)
    assert len(task.steps) == 2
    assert "Explain computing" in task.steps[0].description
    assert "Fibonacci" in task.steps[1].description

    # Verify per-subtask model routing
    assert task.steps[0].assigned_model == "qwen3-test:latest"
    assert task.steps[1].assigned_model == "qwen-coder-3b:latest"
    assert task.steps[0].shadow_model is not None
    assert task.steps[1].shadow_model is not None


@pytest.mark.asyncio
async def test_true_async_parallel_execution_independent_subtasks():
    planner = TaskPlanner()
    coordinator = TaskExecutionCoordinator(planner=planner)

    req = JarvisRequest(conversation_id="conv-par", raw_input="Parallel test")
    task = planner.create_task(request=req, objective="Parallel Execution Test")

    # Define 4 independent subtasks (no dependencies)
    steps = [
        TaskStep(step_id="T1", task_id=task.task_id, description="Task 1", capability="KNOWLEDGE_QUERY"),
        TaskStep(step_id="T2", task_id=task.task_id, description="Task 2", capability="KNOWLEDGE_QUERY"),
        TaskStep(step_id="T3", task_id=task.task_id, description="Task 3", capability="CODING_TASK"),
        TaskStep(step_id="T4", task_id=task.task_id, description="Task 4", capability="KNOWLEDGE_QUERY"),
    ]
    planner.plan_task(task, steps=steps)

    start_times = {}
    completion_times = {}

    async def mock_executor(step: TaskStep, ctx: dict) -> str:
        s_time = time.time()
        start_times[step.step_id] = s_time
        await asyncio.sleep(0.2) # Simulate 200ms workload
        c_time = time.time()
        completion_times[step.step_id] = c_time
        return f"Completed {step.step_id}"

    t0 = time.time()
    res_task = await coordinator.execute_task_dag(task, step_executor=mock_executor, max_concurrency=4)
    t1 = time.time()

    total_duration = t1 - t0

    assert res_task.state == TaskState.COMPLETED
    assert all(s.state == TaskStepState.COMPLETED for s in res_task.steps)

    # Verify true parallel execution overlap:
    # All 4 subtasks started almost simultaneously (start time spread < 50ms)
    min_start = min(start_times.values())
    max_start = max(start_times.values())
    assert (max_start - min_start) < 0.05

    # Total duration is close to 0.2s (parallel), NOT 0.8s (sequential)
    assert total_duration < 0.35


@pytest.mark.asyncio
async def test_dependency_aware_dag_execution():
    planner = TaskPlanner()
    coordinator = TaskExecutionCoordinator(planner=planner)

    req = JarvisRequest(conversation_id="conv-dag", raw_input="DAG test")
    task = planner.create_task(request=req, objective="DAG Execution Test")

    # DAG Topology:
    # T1 ──┐
    #      ├──→ T3 ──→ T4
    # T2 ──┘
    steps = [
        TaskStep(step_id="T1", task_id=task.task_id, description="Independent 1", capability="KNOWLEDGE_QUERY", depends_on=[]),
        TaskStep(step_id="T2", task_id=task.task_id, description="Independent 2", capability="KNOWLEDGE_QUERY", depends_on=[]),
        TaskStep(step_id="T3", task_id=task.task_id, description="Dependent on T1, T2", capability="CODING_TASK", depends_on=["T1", "T2"]),
        TaskStep(step_id="T4", task_id=task.task_id, description="Dependent on T3", capability="KNOWLEDGE_QUERY", depends_on=["T3"]),
    ]
    planner.plan_task(task, steps=steps)

    start_times = {}
    completion_times = {}

    async def mock_executor(step: TaskStep, ctx: dict) -> str:
        start_times[step.step_id] = time.time()
        await asyncio.sleep(0.1)
        completion_times[step.step_id] = time.time()
        return f"Output of {step.step_id}"

    res_task = await coordinator.execute_task_dag(task, step_executor=mock_executor, max_concurrency=4)

    assert res_task.state == TaskState.COMPLETED

    # 1. T1 and T2 executed concurrently
    assert abs(start_times["T1"] - start_times["T2"]) < 0.03

    # 2. T3 started ONLY AFTER T1 and T2 completed
    assert start_times["T3"] >= completion_times["T1"] - 0.005
    assert start_times["T3"] >= completion_times["T2"] - 0.005

    # 3. T4 started ONLY AFTER T3 completed
    assert start_times["T4"] >= completion_times["T3"] - 0.005


def test_task_result_aggregation():
    aggregator = TaskAggregator()
    task = Task(
        request_id="req-1",
        turn_id="turn-1",
        objective="Multi-step test",
        steps=[
            TaskStep(
                step_id="T1",
                task_id="t1",
                description="Subtask 1",
                capability="KNOWLEDGE_QUERY",
                assigned_model="qwen3-test:latest",
                shadow_model="deepseek-r1-7b:latest",
                shadow_confidence=0.85,
                state=TaskStepState.COMPLETED,
                output_text="Result 1",
                duration_ms=120.5,
            ),
            TaskStep(
                step_id="T2",
                task_id="t1",
                description="Subtask 2",
                capability="CODING_TASK",
                assigned_model="qwen-coder-3b:latest",
                shadow_model="qwen3-test:latest",
                shadow_confidence=0.90,
                state=TaskStepState.COMPLETED,
                output_text="Result 2",
                duration_ms=150.0,
            ),
        ],
    )

    aggregated_text = aggregator.aggregate_results(task)
    assert "Subtask 1" in aggregated_text
    assert "Subtask 2" in aggregated_text
    assert "qwen3-test:latest" in aggregated_text
    assert "qwen-coder-3b:latest" in aggregated_text
    assert "Result 1" in aggregated_text
    assert "Result 2" in aggregated_text
