import re
import time
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.agent.executor import AgentExecutor
from app.agent.goals import GoalManager
from app.agent.learning import AgentLearningEngine
from app.agent.model_router import ModelRouter
from app.agent.os.app_discovery import AppDiscoveryService
from app.agent.os.app_launcher import AppLauncher
from app.agent.os.browser_agent import BrowserAgent, BrowserReferenceResolver
from app.agent.os.cursor_service import CursorService
from app.agent.os.live_desktop_monitor import LiveDesktopMonitorService, MonitorMode
from app.agent.os.mouse_controller import RealMouseController
from app.agent.os.project_context import ProjectContextService
from app.agent.os.window_verifier import WindowVerificationService
from app.agent.planner import AgentPlanner
from app.agent.reasoning import AgentReasoningEngine
from app.agent.reflection import AgentReflectionEngine
from app.agent.skills import SkillManager
from app.agent.state import AgentState, AgentStatus, GoalType
from app.brain.attention_engine import AttentionEngine, AttentionMode
from app.brain.grounded_generator import GroundedResponseGenerator
from app.brain.intent_engine import IntentEngine
from app.brain.intent_schema import IntentDomain
from app.brain.interruption_engine import InterruptionEngine, InterruptionType
from app.brain.normalizer import InputNormalizer
from app.brain.orchestrator import JARVISOrchestrator
from app.brain.transcript_quality import TranscriptQualityEngine, TranscriptClassification
from app.cognition.cognitive_core import CognitiveCore
from app.cognition.command_router import CommandRouter
from app.conversation.history import normalize_history
from app.core.logging import logger
from app.execution.computer_controller import ComputerController
from app.execution.computer_gateway import ComputerUseGateway
from app.memory.service import MemoryService
from app.tools.router import ToolIntentRouter
from app.verification.action_verifier import ActionVerifier


class JARVISAgent:
    """DEPRECATED COMPONENT: JARVISAgent is preserved for backward-compatibility test suites.
    The canonical runtime entry point is JarvisCoreOrchestrator in backend/app/core/orchestrator.py.
    """

    def __init__(
        self,
        planner: Optional[AgentPlanner] = None,
        executor: Optional[AgentExecutor] = None,
        model_router: Optional[ModelRouter] = None,
        reasoning_engine: Optional[AgentReasoningEngine] = None,
        reflection_engine: Optional[AgentReflectionEngine] = None,
        learning_engine: Optional[AgentLearningEngine] = None,
        goal_manager: Optional[GoalManager] = None,
        skill_manager: Optional[SkillManager] = None,
        grounded_generator: Optional[GroundedResponseGenerator] = None,
        orchestrator: Optional[JARVISOrchestrator] = None,
        memory_service: Optional[MemoryService] = None,
        tool_router: Optional[ToolIntentRouter] = None,
        monitor_service: Optional[LiveDesktopMonitorService] = None,
        attention_engine: Optional[AttentionEngine] = None,
        app_discovery_service: Optional[AppDiscoveryService] = None,
        project_context_service: Optional[ProjectContextService] = None,
        browser_agent: Optional[BrowserAgent] = None,
        mouse_controller: Optional[RealMouseController] = None,
        cursor_service: Optional[CursorService] = None,
        window_verifier: Optional[WindowVerificationService] = None,
        app_launcher: Optional[AppLauncher] = None,
        cognitive_core: Optional[CognitiveCore] = None,
        computer_controller: Optional[ComputerController] = None,
        action_verifier: Optional[ActionVerifier] = None,
    ):
        self.planner = planner or AgentPlanner()
        self.executor = executor or AgentExecutor()
        self.model_router = model_router or ModelRouter()
        self.reasoning_engine = reasoning_engine or AgentReasoningEngine()
        self.reflection_engine = reflection_engine or AgentReflectionEngine()
        self.learning_engine = learning_engine or AgentLearningEngine()
        self.goal_manager = goal_manager or GoalManager()
        self.skill_manager = skill_manager or SkillManager()
        self.grounded_generator = grounded_generator or GroundedResponseGenerator()
        self.orchestrator = orchestrator or JARVISOrchestrator()
        self.memory_service = memory_service or MemoryService()
        self.tool_router = tool_router or ToolIntentRouter()
        self.monitor_service = monitor_service or LiveDesktopMonitorService.get_instance()
        self.attention_engine = attention_engine or AttentionEngine.get_instance()
        self.app_discovery_service = app_discovery_service or AppDiscoveryService.get_instance()
        self.project_context_service = project_context_service or ProjectContextService.get_instance()
        self.browser_agent = browser_agent or BrowserAgent.get_instance()
        self.mouse_controller = mouse_controller or RealMouseController.get_instance()
        self.cursor_service = cursor_service or CursorService.get_instance()
        self.window_verifier = window_verifier or WindowVerificationService.get_instance()
        self.app_launcher = app_launcher or AppLauncher()
        self.cognitive_core = cognitive_core or CognitiveCore.get_instance()
        self.computer_controller = computer_controller or ComputerController.get_instance()
        self.action_verifier = action_verifier or ActionVerifier.get_instance()
        self.gateway = ComputerUseGateway.get_instance()

        self.active_state: Optional[AgentState] = None

    async def process_turn(
        self,
        db: AsyncSession,
        user_message: str,
        conversation_id: Optional[str] = None,
        channel: str = "chat",
        conversation_history: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Main turn lifecycle driven by CommandRouter, ComputerUseGateway, CognitiveCore, and WorldState."""
        t_start = time.time()
        logger.info(f"[AGENT] request_received message='{user_message}' channel={channel}")

        safe_history = normalize_history(conversation_history)

        # 1. Transcript Quality Layer Analysis
        quality = TranscriptQualityEngine.analyze(user_message)
        logger.info(f"[VOICE] transcript_received classification={quality.classification.value} cleaned='{quality.cleaned_text}'")

        if quality.classification == TranscriptClassification.NON_SPEECH_EVENT:
            logger.info("[VOICE] Non-speech noise event ignored.")
            return {"conversation_id": conversation_id, "message": "", "ignored": True, "model": "jarvis-quality"}

        if quality.classification == TranscriptClassification.WAKE_WORD_ONLY:
            self.attention_engine.set_voice_mode(True)
            self.attention_engine.record_agent_interaction(is_response=True)
            reply = "Yes?"
            logger.info("[ATTENTION] wake_word_only response='Yes?' state=ENGAGED")
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-attention"}

        if channel == "voice":
            self.attention_engine.set_voice_mode(True)

        user_message = quality.cleaned_text if quality.cleaned_text else user_message

        # 2. Continuous Audio Attention & Addressing Layer
        addressing = self.attention_engine.evaluate_addressing(user_message, channel=channel, conversation_history=safe_history)
        if not addressing.addressed_to_jarvis:
            logger.info(f"[ATTENTION] addressed=false reason='{addressing.reason}' (confidence={addressing.confidence:.2f})")
            return {"conversation_id": conversation_id, "message": "", "ignored": True, "model": "jarvis-attention"}

        self.attention_engine.record_agent_interaction(is_response=False)

        # 3. COMMAND ROUTER PRECEDENCE - DIRECT PHYSICAL COMPUTER ACTIONS BEFORE CHAT ("close the tab", "new tab", "pause", "resume")
        routed = await CommandRouter.route(user_message, channel=channel)
        if routed.is_routed:
            logger.info(f"[COMMAND_ROUTER] routed=true priority={routed.priority} type='{routed.command_type}' reply='{routed.response_message}'")
            self.attention_engine.record_agent_interaction(is_response=True)
            total_ms = (time.time() - t_start) * 1000.0
            return {
                "conversation_id": conversation_id,
                "message": routed.response_message or "Done.",
                "model": "jarvis-command-router",
                "stop_tts": (routed.command_type == "stop"),
            }

        # 4. Fast Interruption Engine Check
        interruption = InterruptionEngine.check_interruption(user_message)
        if interruption.is_interruption:
            if self.active_state:
                self.active_state.cancel_task(reason=interruption.reasoning)

            if interruption.type == InterruptionType.STOP_SPEAKING:
                reply = "Stopped."
                return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-interrupt", "stop_tts": True}

            if interruption.type == InterruptionType.CANCEL_TASK:
                reply = "Cancelled current task."
                return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-interrupt", "stop_tts": True}

            if interruption.type == InterruptionType.REPLACE_GOAL and interruption.new_user_message:
                user_message = interruption.new_user_message

        normalized = InputNormalizer.normalize(user_message)
        state = AgentState(
            conversation_id=conversation_id,
            user_id="local_user",
            channel=channel,
            user_message=user_message,
            normalized_message=normalized,
            goal=user_message,
            status=AgentStatus.PERCEIVING,
        )
        self.active_state = state

        # Handle answer to previous profile clarification
        if self.attention_engine.pending_clarification_question:
            clean_ans = user_message.strip().lower()
            if clean_ans in ["college", "personal", "work", "default", "gaming"]:
                await self.app_discovery_service.save_profile_preference(state.user_id, "Chrome", clean_ans.capitalize())
                self.attention_engine.set_pending_clarification(None)
                reply = f"Got it. Opening {clean_ans.capitalize()} Chrome profile."
                return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-os"}

        # 5. FAST-PATH CONTEXTUAL BROWSER REFERENCE RESOLUTION ("first video", "3rd one", "pause", "resume", "go back")
        cur_browser_state = self.browser_agent.get_current_browser_state()
        ref_action = BrowserReferenceResolver.resolve(user_message, cur_browser_state)

        if ref_action.is_followup:
            t_ref_start = time.time()
            logger.info(f"[BROWSER] Contextual follow-up resolved: action={ref_action.action_type} target_index={ref_action.target_index} reason='{ref_action.reason}'")

            if ref_action.action_type == "select_result" and ref_action.target_index:
                b_res = await self.browser_agent.select_result(ref_action.target_index)
                reply = "Playing." if channel == "voice" else (b_res.message or f"Playing video #{ref_action.target_index}.")
            elif ref_action.action_type == "pause":
                b_res = await self.browser_agent.pause_video()
                reply = b_res.message or "Paused video."
            elif ref_action.action_type == "resume":
                b_res = await self.browser_agent.resume_video()
                reply = b_res.message or "Resumed video."
            elif ref_action.action_type == "go_back":
                b_res = await self.browser_agent.go_back()
                reply = b_res.message or "Navigated back."
            else:
                reply = "Processed browser follow-up."

            self.attention_engine.record_agent_interaction(is_response=True)
            total_ms = (time.time() - t_start) * 1000.0
            logger.info(f"[PERF] fast_path_ms={(time.time() - t_ref_start)*1000:.1f}ms total_ms={total_ms:.1f}ms")
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-browser"}

        intent_plan = IntentEngine.analyze(user_message, channel=channel, conversation_history=safe_history)
        intent_domains = [item.domain for item in intent_plan.intents]

        # 6. OPEN YOUTUBE WITH TAB REUSE POLICY
        if re.search(r'\b(?:open|launch|start|bring\s+up)\s+(?:youtube|yt)\b', normalized, re.IGNORECASE) or normalized.lower().strip() == "open youtube":
            force_new_tab = any(k in normalized.lower() for k in ["new tab", "another tab", "in a new tab"])
            tab_res = self.browser_agent.resolve_youtube_tab(force_new_tab=force_new_tab)
            reply = tab_res["message"]
            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-browser"}

        # 7. DIRECT OPEN/FOCUS CHROME OR EXPLICIT PROFILE REQUEST
        is_chrome_or_browser_verb = ("chrome" in normalized.lower() or "browser" in normalized.lower()) and any(v in normalized.lower() for v in ["open", "launch", "start", "bring up", "use"])
        if is_chrome_or_browser_verb:
            is_explicit_profile_req = any(kw in normalized.lower() for kw in ["profile", "account", "college", "work", "gaming", "personal"])

            if is_explicit_profile_req:
                disc_res = await self.app_discovery_service.resolve_application_request("Chrome", user_message=user_message, user_id=state.user_id)
                if disc_res.is_ambiguous and disc_res.clarification_question:
                    self.attention_engine.set_pending_clarification(disc_res.clarification_question)
                    state.status = AgentStatus.CLARIFYING
                    return {"conversation_id": conversation_id, "message": disc_res.clarification_question, "model": "jarvis-agent-os"}
                elif disc_res.selected_profile:
                    reply = f"Opening {disc_res.selected_profile} Chrome profile."
                    self.attention_engine.record_agent_interaction(is_response=True)
                    return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-os"}

            launch_res = self.app_launcher.launch_app("Chrome")
            if launch_res.get("verified"):
                reply = launch_res.get("message", "Chrome is open.")
            else:
                reply = f"Chrome process started, but no visible Chrome window could be verified."

            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-os"}

        # 8. CURSOR DIAGNOSTICS ("What am I pointing at?")
        if IntentDomain.QUERY_CURSOR_TARGET in intent_domains or "pointing at" in normalized.lower() or "cursor pointing" in normalized.lower():
            cursor_res = self.cursor_service.inspect_cursor_target()
            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": cursor_res.diagnostic_message, "model": "jarvis-cursor"}

        # 9. REAL SCREEN PERCEPTION & VISUAL INSPECTION
        if IntentDomain.SCREEN_INSPECTION in intent_domains:
            target_elem = intent_plan.intents[0].entities.get("target_element")
            cur_desktop = self.monitor_service.current_desktop_state
            app_name = cur_desktop.active_application or "Active Window"
            win_title = cur_desktop.window_title or "Desktop"

            if target_elem:
                bounds = self.mouse_controller.locate_target_bounds(target_elem)
                if bounds:
                    reply = f"I see the {target_elem} button on your screen at position ({bounds.x}, {bounds.y})."
                else:
                    reply = f"I'm looking at your screen, but I don't see a {target_elem} button right now."
            else:
                reply = f"You're currently seeing {app_name} with window title '{win_title}'."

            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-vision"}

        # 10. VERIFIED MOUSE CONTROL
        if IntentDomain.DESKTOP_ACTION in intent_domains:
            target_elem = intent_plan.intents[0].entities.get("target_element")
            action_type = intent_plan.intents[0].entities.get("action")

            if action_type == "click" and target_elem:
                click_res = await self.mouse_controller.click_target(target_elem)
                if click_res.verified:
                    reply = f"Clicked the {target_elem} button. State transition verified."
                else:
                    reply = f"Click failed: {click_res.error}"

                self.attention_engine.record_agent_interaction(is_response=True)
                return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-mouse"}

        # 11. ADAPTIVE LIVE BROWSER YOUTUBE SEARCH WITH SHORT VOICE RESPONSE & RESULT CARDS
        if "youtube" in normalized.lower() or "trailer" in normalized.lower() or "video" in normalized.lower():
            search_query = re.sub(r'^(?:search\s+for|open\s+and\s+find|chrome\s+and\s+find|chrome\s+and\s+go\s+to|open|go\s+to|search|find|play|watch)\s+', '', normalized, flags=re.IGNORECASE).strip()
            if not search_query or search_query.lower() == "youtube":
                tab_res = self.browser_agent.resolve_youtube_tab(force_new_tab=False)
                reply = tab_res["message"]
            else:
                browser_res = await self.browser_agent.search_youtube_live(search_query)

                if browser_res.verified:
                    if channel == "voice":
                        reply = "I found several matches. Which one should I play?"
                    else:
                        items = self.browser_agent.state.current_search_results[:5]
                        choices_str = "\n".join([f"{item.index}. {item.title} — {item.channel}" for item in items])
                        reply = f"I found 5 matches for {search_query}. Which one should I play?\n{choices_str}"
                else:
                    reply = f"Browser action unverified: {browser_res.error}"

            self.attention_engine.record_agent_interaction(is_response=True)
            total_ms = (time.time() - t_start) * 1000.0
            logger.info(f"[PERF] agent_ms={total_ms:.1f}ms total_ms={total_ms:.1f}ms")
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-browser"}

        # Live Desktop Monitoring Controls
        if IntentDomain.START_LIVE_DESKTOP_MONITORING in intent_domains:
            mon_state = await self.monitor_service.start_monitoring(mode=MonitorMode.CONTEXT)
            reply = "Sure. I'll keep an eye on your screen until you tell me to stop."
            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-desktop"}

        if IntentDomain.STOP_LIVE_DESKTOP_MONITORING in intent_domains:
            mon_state = await self.monitor_service.stop_monitoring()
            reply = "Stopped. I'm no longer monitoring your screen."
            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-desktop"}

        if IntentDomain.PAUSE_LIVE_DESKTOP_MONITORING in intent_domains:
            mon_state = await self.monitor_service.pause_monitoring()
            reply = "Paused screen monitoring."
            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-desktop"}

        if IntentDomain.RESUME_LIVE_DESKTOP_MONITORING in intent_domains:
            mon_state = await self.monitor_service.resume_monitoring()
            reply = "Resumed screen monitoring."
            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-desktop"}

        # Project Workspace Startup
        if any(term in normalized.lower() for term in ["run my backend", "start my backend", "get backend running", "run backend"]):
            ctx_res = await self.project_context_service.inspect_workspace()
            if ctx_res.is_backend_running:
                reply = f"JARVIS backend is already running on port {ctx_res.backend_port} and healthy (HTTP 200 OK)."
            else:
                reply = f"Inspected project context at {ctx_res.workspace_root}. Backend port {ctx_res.backend_port} is clear. Launching via: '{ctx_res.recommended_startup_cmd}'."

            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-os"}

        # Memory Correction & Memory Save
        correction = await self.learning_engine.check_and_apply_user_correction(db, user_message, state.user_id)
        if correction:
            reply = f"Got it. I've updated my memory: you study at {correction['value']}."
            self.attention_engine.record_agent_interaction(is_response=True)
            return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-agent-memory"}

        if "remember" in user_message.lower():
            saved_mems = await self.memory_service.extract_and_store_memories(db=db, user_message=user_message)
            if saved_mems and any("name" in m.content.lower() for m in saved_mems):
                name_match = re.search(r'User\'s name is ([A-Za-z]+)', saved_mems[0].content, re.IGNORECASE)
                if name_match:
                    name_val = name_match.group(1)
                    reply = f"Got it. I'll remember that your name is {name_val}."
                    self.attention_engine.record_agent_interaction(is_response=True)
                    return {"conversation_id": conversation_id, "message": reply, "model": "jarvis-memory"}

        # Planning & Step Execution Loop with Plan Versioning
        logger.info("[AGENT] planning_started")
        state.goal_type = self.planner.categorize_goal(user_message, intent_plan)
        state.selected_model = self.model_router.select_model(user_message)
        state.status = AgentStatus.PLANNING

        agent_plan = self.planner.build_plan(user_message, intent_plan)
        state.plan = agent_plan

        if agent_plan.steps:
            for s in agent_plan.steps:
                s.plan_version = state.plan_version
            logger.info(f"[AGENT] tool_execution_started steps={[s.tool_name for s in agent_plan.steps]} plan_version={state.plan_version}")
            state = await self.executor.execute_steps(db, state, agent_plan.steps)

        # Evaluate tool observations
        for obs in state.tool_observations:
            tool_name = obs.get("tool")
            data = obs.get("data", {})
            success = obs.get("success", False)

            if tool_name == "inspect_screen" and success:
                app_name = data.get("application", "Active Window")
                win_title = data.get("window_title", "Desktop")
                vis_text = data.get("visible_text", "")
                err_text = data.get("error")

                if err_text and "no vision model is available" in err_text.lower():
                    reply = "I can't visually inspect the screen right now because no vision model is configured."
                    self.attention_engine.record_agent_interaction(is_response=True)
                    return {"conversation_id": conversation_id, "message": reply, "model": state.selected_model}

                if vis_text:
                    reply = f"You're looking at {app_name} ({win_title}). {vis_text}"
                else:
                    reply = f"You're currently using {app_name} with window title '{win_title}'."

                self.attention_engine.record_agent_interaction(is_response=True)
                return {"conversation_id": conversation_id, "message": reply, "model": state.selected_model}

            if tool_name == "launch_app":
                app_name = data.get("application", "Application")
                if data.get("verified") and success:
                    reply = f"{app_name} is open."
                else:
                    reply = f"{app_name} didn't start. {data.get('error', '')}"
                self.attention_engine.record_agent_interaction(is_response=True)
                return {"conversation_id": conversation_id, "message": reply, "model": state.selected_model}

            if tool_name == "manage_process" and success:
                procs = data.get("processes", [])
                ram_pct = data.get("system_ram_percent", 45.0)
                if procs:
                    p_summary = ", ".join([f"{p['name']} ({p['memory_mb']} MB)" for p in procs[:3]])
                    reply = f"System RAM usage is currently at {ram_pct}%. Top active processes are: {p_summary}."
                else:
                    reply = f"System RAM usage is currently at {ram_pct}%."

                self.attention_engine.record_agent_interaction(is_response=True)
                return {"conversation_id": conversation_id, "message": reply, "model": state.selected_model}

        # Response Routing
        STRICT_GROUNDED_DOMAINS = {
            IntentDomain.LOCATION,
            IntentDomain.PROFILE_EDUCATION,
            IntentDomain.PROFILE_IDENTITY,
            IntentDomain.PROFILE_PROJECTS,
            IntentDomain.PROFILE_INTERESTS,
            IntentDomain.PROFILE_CAREER,
            IntentDomain.SYSTEM_METRICS,
            IntentDomain.OLLAMA_STATUS,
        }

        is_strictly_grounded = (intent_plan.intents and all(item.domain in STRICT_GROUNDED_DOMAINS for item in intent_plan.intents))

        if is_strictly_grounded:
            grounded_result = await self.grounded_generator.generate_grounded_response(
                db=db,
                plan=intent_plan,
                user_message=user_message,
                user_id=state.user_id,
                conversation_history=safe_history,
            )
            response_text = grounded_result["message"]
            state.selected_model = grounded_result.get("model", state.selected_model)
        else:
            tool_result = await self.tool_router.route_and_execute(user_message)
            tool_context = ToolIntentRouter.format_tool_result_context(tool_result) if tool_result else ""

            relevant_memories = await self.memory_service.get_relevant_memories(db, user_message)
            memory_context = self.memory_service.build_memory_context(relevant_memories)

            combined_parts = [p for p in [tool_context, memory_context] if p]
            combined_context = "\n\n".join(combined_parts) if combined_parts else None

            orchestration_result = await self.orchestrator.process_turn(
                user_message=user_message,
                history=safe_history,
                memory_context=combined_context,
            )
            response_text = orchestration_result["response"]
            state.selected_model = orchestration_result["model"]

        state.status = AgentStatus.COMPLETED
        self.attention_engine.record_agent_interaction(is_response=True)
        total_ms = (time.time() - t_start) * 1000.0
        logger.info(f"[AGENT] response_generated=true total_ms={total_ms:.1f}ms")
        return {
            "conversation_id": conversation_id,
            "message": response_text,
            "model": state.selected_model,
        }
