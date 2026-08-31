import React from 'react';
import { JarvisState } from '../../types/jarvis';
import { useJarvisStore } from '../../state/jarvisStore';

export const OrbStateCards: React.FC = () => {
  const { currentState, setJarvisState, isGenerating } = useJarvisStore();

  const states: { id: JarvisState; num: string; label: string }[] = [
    { id: 'idle', num: '1', label: 'IDLE' },
    { id: 'listening', num: '2', label: 'LISTENING' },
    { id: 'thinking', num: '3', label: 'THINKING' },
    { id: 'speaking', num: '4', label: 'SPEAKING' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 w-full max-w-[480px] shrink-0 mb-1 z-10 relative pointer-events-auto">
      {states.map((s) => {
        const isActive = currentState === s.id;
        return (
          <div
            key={s.id}
            onClick={() => {
              if (!isGenerating) setJarvisState(s.id);
            }}
            className={`relative bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
              isActive
                ? s.id === 'thinking'
                  ? 'border-[#ff7700] bg-[#ff7700]/20 shadow-[0_0_12px_rgba(255,119,0,0.4)]'
                  : s.id === 'speaking'
                  ? 'border-[#00ffaa] bg-[#00ffaa]/20 shadow-[0_0_12px_rgba(0,255,170,0.4)]'
                  : 'border-[#00f0ff] bg-[#00f0ff]/20 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'hover:border-[#00f0ff]/50'
            }`}
          >
            <span className="absolute top-1 left-1.5 text-[9px] text-gray-500 font-mono">
              {s.num}
            </span>
            <div
              className={`w-5 h-5 rounded-full mt-0.5 ${
                s.id === 'idle'
                  ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                  : s.id === 'listening'
                  ? 'bg-blue-400 shadow-[0_0_8px_#00aaff]'
                  : s.id === 'thinking'
                  ? 'bg-orange-500 shadow-[0_0_8px_#ff7700]'
                  : 'bg-emerald-400 shadow-[0_0_8px_#00ffaa]'
              }`}
            />
            <span
              className={`text-[10px] font-hud tracking-wider ${
                isActive
                  ? s.id === 'thinking'
                    ? 'text-[#ff7700]'
                    : s.id === 'speaking'
                    ? 'text-[#00ffaa]'
                    : 'text-[#00f0ff]'
                  : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
