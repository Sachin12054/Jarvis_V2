import asyncio
import time
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.state import (
    AgentState,
    AgentStatus,
    StepStatus,
    TaskStep,
    EvaluationOutcome,
)
from app.core.logging import logger
from app.memory.profile import UserProfileService
from app.services.system_service import SystemService
from app.tools.executor import ToolExecutor
from app.tools.registry import ToolRegistry
from app.tools.schemas import ToolExecutionContext


class AgentExecutor:
    """Bounded multi-step autonomous agent executor with ToolExecutor routing, plan version validation, observation evaluation, and dynamic replanning."""

    def __init__(
        self,
        tool_executor: Optional[ToolExecutor] = None,
        system_service: Optional[SystemService] = None,
        user_profile_service: Optional[UserProfileService] = None,
    ):
        self.tool_executor = tool_executor or ToolExecutor(ToolRegistry.get_instance())
        self.system_service = system_service or SystemService()
        self.user_profile_service = user_profile_service or UserProfileService()

    def evaluate_step_observation(
        self,
        step: TaskStep,
        result_data: Dict[str, Any],
        success: bool,
    ) -> EvaluationOutcome:
        """Evaluates tool observation to determine outcome (COMPLETE, MORE_INFO, REPLAN, ASK_USER, FAIL)."""
        if not success:
            return EvaluationOutcome.FAIL

        tool_name = step.tool_name
        # 1. System metrics evaluation: Check if replanning is needed for RAM/CPU bottleneck
        if tool_name == "system_metrics":
            ram_pct = result_data.get("ram_usage", result_data.get("ram_percent", 0.0))
            cpu_pct = result_data.get("cpu_usage", result_data.get("cpu_percent", 0.0))
            if ram_pct > 80.0 or cpu_pct > 75.0:
                return EvaluationOutcome.REPLAN
            return EvaluationOutcome.MORE_INFORMATION_REQUIRED

        # 2. Manage process inspection evaluation
        if tool_name == "manage_process":
            procs = result_data.get("processes", [])
            if procs:
                return EvaluationOutcome.COMPLETE
            return EvaluationOutcome.MORE_INFORMATION_REQUIRED

        # 3. App Launch evaluation
        if tool_name == "launch_app":
            if result_data.get("verified"):
                return EvaluationOutcome.COMPLETE
            return EvaluationOutcome.FAIL

        return EvaluationOutcome.MORE_INFORMATION_REQUIRED

    async def execute_steps(
        self,
        db: AsyncSession,
        state: AgentState,
        steps: List[TaskStep],
    ) -> AgentState:
        """Executes task steps in a bounded autonomous loop with plan version validation and cancellation guards."""
        state.status = AgentStatus.EXECUTING
        current_steps = list(steps)

        while current_steps and state.current_step < state.max_agent_steps:
            # Stale Action Guard 1: Cancellation Check
            if state.is_cancelled:
                logger.info(f"[AGENT] step_execution_aborted reason='Active task is cancelled'")
                state.status = AgentStatus.CANCELLED
                break

            step = current_steps.pop(0)

            # Stale Action Guard 2: Plan Version Check
            if step.plan_version != state.plan_version:
                logger.info(f"[AGENT] step_skipped step_id={step.step_id} reason='Stale plan version {step.plan_version} != current {state.plan_version}'")
                step.status = StepStatus.SUPERSEDED
                continue

            state.current_step += 1
            step.status = StepStatus.RUNNING

            logger.info(f"[AGENT] step_started={state.current_step} desc='{step.description}' plan_version={step.plan_version}")
            logger.info(f"[AGENT] tool={step.tool_name}")

            try:
                # User Profile built-in domain lookup
                if step.tool_name == "user_profile":
                    domain_val = step.arguments.get("domain", "education")
                    if domain_val == "profile_education":
                        facts = await self.user_profile_service.get_education_facts(db, state.user_id)
                    elif domain_val == "profile_identity":
                        facts = await self.user_profile_service.get_identity_facts(db, state.user_id)
                    elif domain_val == "profile_projects":
                        facts = await self.user_profile_service.get_projects_facts(db, state.user_id)
                    elif domain_val == "profile_interests":
                        facts = await self.user_profile_service.get_interests_facts(db, state.user_id)
                    else:
                        facts = await self.user_profile_service.get_career_facts(db, state.user_id)

                    res_data = {"facts": facts, "domain": domain_val}
                    state.add_observation(tool_name=step.tool_name, result_data=res_data, success=True)
                    step.status = StepStatus.COMPLETED
                    step.result = res_data
                    state.completed_steps.append(step)

                    logger.info(f"[AGENT] step_completed={step.step_id} tool={step.tool_name}")
                    logger.info(f"[AGENT] observation_received tool={step.tool_name}")

                # Hardware System Metrics lookup
                elif step.tool_name == "system_metrics":
                    metrics = await self.system_service.get_system_metrics()
                    state.add_observation(tool_name=step.tool_name, result_data=metrics, success=True)
                    step.status = StepStatus.COMPLETED
                    step.result = metrics
                    state.completed_steps.append(step)

                    logger.info(f"[AGENT] step_completed={step.step_id} tool={step.tool_name}")
                    logger.info(f"[AGENT] observation_received tool={step.tool_name}")

                    # Evaluate observation for dynamic replanning
                    outcome = self.evaluate_step_observation(step, metrics, success=True)
                    if outcome == EvaluationOutcome.REPLAN and state.replan_count < state.max_replans:
                        state.replan_count += 1
                        logger.info(f"[AGENT] replan=true reason='High resource usage detected in system_metrics'")
                        # Dynamically append process inspection step
                        if not any(s.tool_name == "manage_process" for s in current_steps):
                            current_steps.append(TaskStep(
                                step_id=state.current_step + 10,
                                plan_version=state.plan_version,
                                description="Inspect top resource-consuming processes",
                                tool_name="manage_process",
                                arguments={"action": "list"},
                                permission_level="SAFE",
                            ))

                # All registered tools via ToolExecutor
                else:
                    ctx = ToolExecutionContext(user_id=state.user_id, channel=state.channel)
                    tool_res = await self.tool_executor.execute(step.tool_name, step.arguments, context=ctx)

                    if tool_res.success:
                        state.add_observation(tool_name=step.tool_name, result_data=tool_res.data, success=True)
                        step.status = StepStatus.COMPLETED
                        step.result = tool_res.data
                        state.completed_steps.append(step)

                        logger.info(f"[AGENT] step_completed={step.step_id} tool={step.tool_name}")
                        logger.info(f"[AGENT] observation_received tool={step.tool_name}")
                    else:
                        logger.warning(f"[AGENT] Tool '{step.tool_name}' failed: {tool_res.error}")
                        state.record_error(f"Tool {step.tool_name} error: {tool_res.error}")
                        state.add_observation(tool_name=step.tool_name, result_data={"error": tool_res.error}, success=False)
                        step.status = StepStatus.FAILED
                        step.error = tool_res.error
                        state.failed_steps.append(step)

            except Exception as err:
                logger.error(f"[AGENT] Unexpected step execution error: {err}")
                state.record_error(str(err))
                state.add_observation(tool_name=step.tool_name, result_data={"error": str(err)}, success=False)
                step.status = StepStatus.FAILED
                step.error = str(err)
                state.failed_steps.append(step)

        if state.is_cancelled:
            state.status = AgentStatus.CANCELLED
        else:
            state.status = AgentStatus.REASONING

        logger.info(f"[AGENT] goal_complete={not state.is_cancelled} completed_steps={len(state.completed_steps)}")
        return state
