from typing import List
from app.core.contracts import Task, TaskStep, TaskStepState


class TaskAggregator:
    """Synthesizes subtask execution results from completed Task DAGs into a unified response."""

    def aggregate_results(self, task: Task) -> str:
        """Combines subtask outputs into a structured, readable synthesized answer."""
        if not task.steps:
            return "No task steps were executed."

        completed_steps = [s for s in task.steps if s.state == TaskStepState.COMPLETED]
        if not completed_steps:
            return f"Task execution failed: {task.metadata.get('error', 'No steps completed successfully.')}"

        if len(completed_steps) == 1:
            return completed_steps[0].output_text or f"Completed {completed_steps[0].description}"

        parts: List[str] = [f"### Execution Summary for '{task.objective}'\n"]
        for idx, step in enumerate(completed_steps, start=1):
            model_badge = f"`[{step.assigned_model or 'Default'}]`"
            shadow_badge = f"`[Shadow: {step.shadow_model} ({step.shadow_confidence})]`" if step.shadow_model else ""
            duration_str = f"({step.duration_ms:.1f}ms)" if step.duration_ms is not None else ""

            parts.append(
                f"**Subtask {idx}**: {step.description} {model_badge} {shadow_badge} {duration_str}\n"
                f"{step.output_text or 'Done'}\n"
            )

        return "\n".join(parts)
