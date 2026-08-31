import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.agent import JARVISAgent
from app.agent.executor import AgentExecutor
from app.agent.planner import AgentPlanner
from app.agent.state import AgentState, AgentStatus, GoalType, StepStatus, EvaluationOutcome, TaskStep
from app.brain.intent_engine import IntentEngine


def test_goal_understanding():
    """Verifies AgentPlanner.categorize_goal categorizes goals into explicit GoalType domains."""
    planner = AgentPlanner()

    # Question / Explanation
    g1 = planner.categorize_goal("What is 12 * 15?", IntentEngine.analyze("What is 12 * 15?"))
    assert g1 == GoalType.QUESTION

    # Diagnosis
    g2 = planner.categorize_goal("My laptop feels slow. Find out why.", IntentEngine.analyze("My laptop feels slow. Find out why."))
    assert g2 == GoalType.DIAGNOSIS

    # Action
    g3 = planner.categorize_goal("Open Chrome", IntentEngine.analyze("Open Chrome"))
    assert g3 == GoalType.ACTION

    # Multi-Step Task
    g4 = planner.categorize_goal("Check backend status and tell me RAM usage and open Chrome", IntentEngine.analyze("Check backend status and tell me RAM usage and open Chrome"))
    assert g4 == GoalType.MULTI_STEP_TASK

    # Open-Ended Goal
    g5 = planner.categorize_goal("Get my JARVIS environment ready.", IntentEngine.analyze("Get my JARVIS environment ready."))
    assert g5 == GoalType.OPEN_ENDED_GOAL


def test_simple_question_no_tool():
    """Verifies questions generate 0 tool steps."""
    planner = AgentPlanner()
    plan = planner.build_plan("What is RAG?", IntentEngine.analyze("What is RAG?"))

    assert plan.goal_type == GoalType.QUESTION
    assert len(plan.steps) == 0


def test_action_requires_tool():
    """Verifies single actions generate appropriate tool steps."""
    planner = AgentPlanner()
    plan = planner.build_plan("Open Chrome", IntentEngine.analyze("Open Chrome"))

    assert plan.goal_type == GoalType.ACTION
    assert len(plan.steps) == 1
    assert plan.steps[0].tool_name == "launch_app"


def test_laptop_diagnosis_plan():
    """Verifies 'My laptop feels slow. Find out why.' generates multi-step diagnosis plan."""
    planner = AgentPlanner()
    plan = planner.build_plan("My laptop feels slow. Find out why.", IntentEngine.analyze("My laptop feels slow. Find out why."))

    assert plan.goal_type == GoalType.DIAGNOSIS
    assert len(plan.steps) == 2
    assert plan.steps[0].tool_name == "system_metrics"
    assert plan.steps[1].tool_name == "manage_process"


def test_backend_diagnosis_plan():
    """Verifies 'My JARVIS backend isn't working. Figure it out.' generates backend diagnosis plan."""
    planner = AgentPlanner()
    plan = planner.build_plan("My JARVIS backend isn't working. Figure it out.", IntentEngine.analyze("My JARVIS backend isn't working. Figure it out."))

    assert plan.goal_type == GoalType.DIAGNOSIS
    assert len(plan.steps) == 2
    assert plan.steps[0].tool_name == "manage_process"
    assert plan.steps[1].tool_name == "inspect_screen"


def test_environment_startup_plan():
    """Verifies 'Get my JARVIS environment ready.' generates multi-component check plan."""
    planner = AgentPlanner()
    plan = planner.build_plan("Get my JARVIS environment ready.", IntentEngine.analyze("Get my JARVIS environment ready."))

    assert plan.goal_type == GoalType.OPEN_ENDED_GOAL
    assert len(plan.steps) == 3
    assert plan.steps[0].tool_name == "ollama_status"
    assert plan.steps[1].tool_name == "system_metrics"
    assert plan.steps[2].tool_name == "manage_process"


def test_observation_evaluation_replan():
    """Verifies AgentExecutor evaluates system metrics observation and triggers replan on high RAM usage."""
    executor = AgentExecutor()
    step = TaskStep(step_id=1, description="Check system metrics", tool_name="system_metrics")

    # Normal RAM usage -> MORE_INFORMATION_REQUIRED
    o1 = executor.evaluate_step_observation(step, {"ram_usage": 45.0}, success=True)
    assert o1 == EvaluationOutcome.MORE_INFORMATION_REQUIRED

    # High RAM usage (88%) -> REPLAN
    o2 = executor.evaluate_step_observation(step, {"ram_usage": 88.0}, success=True)
    assert o2 == EvaluationOutcome.REPLAN


@pytest.mark.asyncio
async def test_agent_end_to_end_goal_turn(db_session: AsyncSession):
    """Verifies JARVISAgent autonomous turn execution for 'My laptop feels slow. Find out why.'."""
    agent = JARVISAgent()
    res = await agent.process_turn(db_session, "My laptop feels slow. Find out why.", channel="chat")

    assert "message" in res
    assert len(res["message"]) > 0
    assert "RAM" in res["message"] or "CPU" in res["message"] or "system" in res["message"].lower()
