import React from 'react';

export interface SubtaskTelemetry {
  step_id: string;
  description: string;
  assigned_model: string;
  shadow_model?: string;
  shadow_confidence?: number;
  start_time?: number;
  completion_time?: number;
  duration_ms?: number;
  state: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
}

interface TaskGraphVisualizerProps {
  subtasks: SubtaskTelemetry[];
  objective?: string;
}

export const TaskGraphVisualizer: React.FC<TaskGraphVisualizerProps> = ({ subtasks, objective }) => {
  if (!subtasks || subtasks.length === 0) return null;

  return (
    <div className="my-4 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-slate-100 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">
            Parallel Task Orchestration Graph
          </span>
        </div>
        {objective && (
          <span className="text-xs text-slate-400 max-w-md truncate">
            {objective}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {subtasks.map((task, idx) => {
          const isRunning = task.state === 'running';
          const isCompleted = task.state === 'completed';
          const isFailed = task.state === 'failed';

          let stateColor = 'bg-slate-800 border-slate-700 text-slate-300';
          if (isRunning) stateColor = 'bg-blue-950/80 border-blue-500/60 text-blue-200 animate-pulse';
          if (isCompleted) stateColor = 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200';
          if (isFailed) stateColor = 'bg-rose-950/70 border-rose-500/50 text-rose-200';

          return (
            <div
              key={task.step_id || idx}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-all duration-200 ${stateColor}`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-cyan-400">Node {idx + 1}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded uppercase font-semibold text-[10px] ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isRunning
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {task.state}
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium line-clamp-2 mb-2">
                  {task.description}
                </p>
              </div>

              <div className="space-y-1 text-[11px] pt-2 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Authority:</span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    {task.assigned_model}
                  </span>
                </div>

                {task.shadow_model && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Shadow RL:</span>
                    <span className="font-mono text-purple-300">
                      {task.shadow_model} ({Math.round((task.shadow_confidence || 0) * 100)}%)
                    </span>
                  </div>
                )}

                {task.duration_ms !== undefined && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Duration:</span>
                    <span className="font-mono text-amber-300 font-medium">
                      {task.duration_ms.toFixed(1)}ms
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
