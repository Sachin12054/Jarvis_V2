import re
import os
import uuid
import time
from typing import List, Dict, Any, Optional
from app.agent.state import AgentPlan, TaskStep, GoalType, StepStatus
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentPlan, IntentDomain
from app.tools.registry import ToolRegistry
from app.core.logging import logger


class AgentPlanner:
    """Autonomous Goal Understanding & Multi-Step Planner for JARVIS Agent."""

    def __init__(self, tool_registry: Optional[ToolRegistry] = None):
        self.tool_registry = tool_registry or ToolRegistry.get_instance()

    def categorize_goal(self, user_message: str, intent_plan: Optional[IntentPlan] = None) -> GoalType:
        """Categorizes user input into explicit GoalType domain."""
        if intent_plan is None:
            intent_plan = IntentEngine.analyze(user_message)

        clean = user_message.strip().lower()

        # 1. Simple math or generic explanation -> QUESTION (No tools needed)
        if re.search(r'^\s*what\s+is\s+\d+\s*[\+\-\*\/]\s*\d+|\bexplain\b|\bhow\s+does\b|\bwhat\s+is\s+(?:rag|ai|llm)\b', clean):
            return GoalType.QUESTION

        # 2. Performance / Error / Failure Diagnosis -> DIAGNOSIS
        if re.search(r'\bslow\b|\bwhy\s+is\b|\bnot\s+working\b|\bfigure\s+it\s+out\b|\berror\b|\bcrash\b|\bissue\b', clean):
            return GoalType.DIAGNOSIS

        # 3. Environment Setup / Health Check -> OPEN_ENDED_GOAL or MULTI_STEP_TASK
        if re.search(r'\bget\s+my\s+.*ready\b|\benvironment\s+ready\b|\bset\s+up\b', clean):
            return GoalType.OPEN_ENDED_GOAL

        # 4. Multi-intent / Compound Goal -> MULTI_STEP_TASK
        if len(intent_plan.intents) > 1 or ("and" in clean and ("check" in clean or "open" in clean or "tell" in clean)):
            return GoalType.MULTI_STEP_TASK

        # 5. Direct GUI or App Action -> ACTION
        if any(i.domain in {IntentDomain.DESKTOP_ACTION, IntentDomain.TERMINAL_ACTION} for i in intent_plan.intents) or re.search(r'\b(?:open|launch|close|click|type)\b', clean):
            return GoalType.ACTION

        # 6. Development / Backend Startup -> DEVELOPMENT_TASK
        if re.search(r'\b(?:run|start)\s+(?:my\s+)?(?:jarvis\s+backend|backend|frontend)\b', clean):
            return GoalType.DEVELOPMENT_TASK

        # 7. Hardware / Metric Info -> INFORMATION_REQUEST
        if any(i.domain in {IntentDomain.SYSTEM_METRICS, IntentDomain.LOCATION, IntentDomain.SCREEN_INSPECTION, IntentDomain.PROCESS_MANAGEMENT} for i in intent_plan.intents):
            return GoalType.INFORMATION_REQUEST

        return GoalType.OPEN_ENDED_GOAL

    def build_plan(self, user_message: str, intent_plan: Optional[IntentPlan] = None) -> AgentPlan:
        """Constructs an autonomous, structured AgentPlan with TaskStep dependencies."""
        if intent_plan is None:
            intent_plan = IntentEngine.analyze(user_message)

        plan_id = f"plan_{uuid.uuid4().hex[:8]}"
        goal_type = self.categorize_goal(user_message, intent_plan)
        clean = user_message.strip().lower()

        logger.info(f"[AGENT] goal_detected='{user_message}' goal_type={goal_type.value}")

        steps: List[TaskStep] = []

        # A. Questions or Pure Explanations -> 0 tool steps
        if goal_type == GoalType.QUESTION:
            logger.info(f"[AGENT] plan_created id={plan_id} steps=0 (Question turn, no tools required)")
            return AgentPlan(plan_id=plan_id, goal=user_message, goal_type=goal_type, steps=[])

        # B. Laptop Performance Diagnosis Goal ("My laptop feels slow. Find out why.")
        if goal_type == GoalType.DIAGNOSIS and "slow" in clean:
            steps.append(TaskStep(
                step_id=1,
                description="Inspect hardware resource usage (CPU, RAM, GPU, Temperature)",
                tool_name="system_metrics",
                arguments={},
                permission_level="SAFE",
            ))
            steps.append(TaskStep(
                step_id=2,
                description="Retrieve top active Windows processes sorted by RAM and CPU consumption",
                tool_name="manage_process",
                arguments={"action": "list"},
                depends_on=[1],
                permission_level="SAFE",
            ))

        # C. Backend Failure Diagnosis Goal ("My JARVIS backend isn't working. Figure it out.")
        elif goal_type == GoalType.DIAGNOSIS and ("backend" in clean or "not working" in clean):
            steps.append(TaskStep(
                step_id=1,
                description="Check top active processes to see if Python / uvicorn backend process exists",
                tool_name="manage_process",
                arguments={"action": "list"},
                permission_level="SAFE",
            ))
            steps.append(TaskStep(
                step_id=2,
                description="Inspect active screen to check for visible backend errors or terminal logs",
                tool_name="inspect_screen",
                arguments={"query": user_message},
                depends_on=[1],
                permission_level="SAFE",
            ))

        # D. Environment Readiness Goal ("Get my JARVIS environment ready.")
        elif goal_type in {GoalType.OPEN_ENDED_GOAL, GoalType.MULTI_STEP_TASK} and "environment" in clean:
            steps.append(TaskStep(
                step_id=1,
                description="Check local Ollama service health and active LLM models",
                tool_name="ollama_status",
                arguments={},
                permission_level="SAFE",
            ))
            steps.append(TaskStep(
                step_id=2,
                description="Check overall system hardware metrics and available memory",
                tool_name="system_metrics",
                arguments={},
                permission_level="SAFE",
            ))
            steps.append(TaskStep(
                step_id=3,
                description="Inspect active processes to check running backend/frontend components",
                tool_name="manage_process",
                arguments={"action": "list"},
                depends_on=[1, 2],
                permission_level="SAFE",
            ))

        # E. GUI Interaction with Pre-Action Screen Perception ("Click the STOP button")
        elif "click" in clean and ("button" in clean or "run" in clean or "stop" in clean):
            target = "STOP" if "stop" in clean else ("RUN" if "run" in clean else "button")
            steps.append(TaskStep(
                step_id=1,
                description=f"Capture screen and locate '{target}' UI element bounds",
                tool_name="inspect_screen",
                arguments={"query": f"Locate '{target}' button"},
                permission_level="SAFE",
            ))
            steps.append(TaskStep(
                step_id=2,
                description=f"Perform semantic UI click on '{target}'",
                tool_name="desktop_action",
                arguments={"action": "click", "target": target},
                depends_on=[1],
                permission_level="CONFIRM",
            ))

        # F. Single App Launch / Control ("Open Chrome", "Launch PowerShell")
        elif goal_type == GoalType.ACTION and re.search(r'\b(?:open|launch|start)\s+(?:google\s+chrome|chrome|powershell|vs\s+code|git\s+bash|notepad)\b', clean):
            app_name = "chrome" if "chrome" in clean else ("powershell" if "powershell" in clean else ("vs code" if "code" in clean else ("git bash" if "git bash" in clean else "notepad")))
            steps.append(TaskStep(
                step_id=1,
                description=f"Launch application '{app_name}' and verify process startup",
                tool_name="launch_app",
                arguments={"app_name": app_name},
                permission_level="CONFIRM",
            ))

        # G. Process Management ("Show me what's running")
        elif any(i.domain == IntentDomain.PROCESS_MANAGEMENT for i in intent_plan.intents):
            steps.append(TaskStep(
                step_id=1,
                description="Retrieve active Windows processes with CPU and RAM memory usage",
                tool_name="manage_process",
                arguments={"action": "list"},
                permission_level="SAFE",
            ))

        # H. Screen Inspection ("What's on my screen?")
        elif any(i.domain == IntentDomain.SCREEN_INSPECTION for i in intent_plan.intents):
            steps.append(TaskStep(
                step_id=1,
                description="Capture desktop screen image and inspect visual UI elements",
                tool_name="inspect_screen",
                arguments={"query": user_message},
                permission_level="SAFE",
            ))

        # I. Terminal Execution ("Run my JARVIS backend")
        elif goal_type == GoalType.DEVELOPMENT_TASK or any(i.domain == IntentDomain.TERMINAL_ACTION for i in intent_plan.intents):
            cmd = "python -m uvicorn app.main:app --port 8000 --reload" if "backend" in clean else "npm run dev"
            steps.append(TaskStep(
                step_id=1,
                description=f"Execute terminal command '{cmd}' in PowerShell",
                tool_name="terminal_execute",
                arguments={"command": cmd, "shell": "powershell"},
                permission_level="CONFIRM",
            ))

        # J. Default Multi-Intent Steps
        else:
            step_idx = 1
            for item in intent_plan.intents:
                domain = item.domain
                if domain == IntentDomain.LOCATION:
                    steps.append(TaskStep(
                        step_id=step_idx,
                        description="Request device coordinates and reverse-geocode physical location",
                        tool_name="get_current_location",
                        arguments={},
                        permission_level="SAFE",
                    ))
                    step_idx += 1
                elif domain == IntentDomain.SYSTEM_METRICS:
                    steps.append(TaskStep(
                        step_id=step_idx,
                        description="Inspect real-time system resource metrics",
                        tool_name="system_metrics",
                        arguments={"metric": item.entities.get("metric", "cpu")},
                        permission_level="SAFE",
                    ))
                    step_idx += 1
                elif domain in {
                    IntentDomain.PROFILE_EDUCATION,
                    IntentDomain.PROFILE_IDENTITY,
                    IntentDomain.PROFILE_PROJECTS,
                    IntentDomain.PROFILE_INTERESTS,
                    IntentDomain.PROFILE_CAREER,
                }:
                    steps.append(TaskStep(
                        step_id=step_idx,
                        description=f"Retrieve structured user profile facts for {domain.value}",
                        tool_name="user_profile",
                        arguments={"domain": domain.value},
                        permission_level="SAFE",
                    ))
                    step_idx += 1

        agent_plan = AgentPlan(
            plan_id=plan_id,
            goal=user_message,
            goal_type=goal_type,
            steps=steps,
        )

        logger.info(f"[AGENT] plan_created id={plan_id} steps={[s.tool_name for s in steps]}")
        return agent_plan
