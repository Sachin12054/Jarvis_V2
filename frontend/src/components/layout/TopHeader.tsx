import React, { useEffect, useState, useRef } from 'react';
import { useJarvisStore } from '../../state/jarvisStore';
import { formatModelDisplayName } from '../../utils/modelNames';
import { SystemService, ModelStatus } from '../../services/systemService';

export const TopHeader: React.FC = () => {
  const { activeModel, systemMetrics } = useJarvisStore();
  const [modelStatus, setModelStatus] = useState<ModelStatus>({
    provider: 'ollama',
    model: activeModel,
    status: 'online',
  });
  const [monitorStatus, setMonitorStatus] = useState<string>('OFF');

  const systemServiceRef = useRef<SystemService>(new SystemService());

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      if (useJarvisStore.getState().currentState === 'thinking') {
        return;
      }
      const status = await systemServiceRef.current.getModelStatus();
      if (isMounted) setModelStatus(status);

      try {
        const res = await fetch('/api/v1/desktop/monitor/status');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setMonitorStatus(data?.monitor_state?.status || 'OFF');
        }
      } catch (err) {
        // Monitor endpoint fallback
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isSystemOnline = systemMetrics !== null;
  const isOllamaOnline = modelStatus.status === 'online';

  return (
    <header className="flex items-center justify-between px-5 py-2.5 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl shadow-2xl shrink-0 z-10 relative pointer-events-auto">
      {/* Left Title */}
      <div className="flex flex-col">
        <h1 className="font-hud text-2xl font-extrabold tracking-[3px] text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">
          JARVIS
        </h1>
        <span className="text-[10px] text-gray-400 tracking-[2px]">AI ASSISTANT SYSTEM</span>
      </div>

      {/* Center Status Badges */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-black/40 border border-[#00f0ff]/20 px-3.5 py-1.5 rounded-full text-xs">
          <span className="text-[11px] text-gray-400 tracking-wider">SYSTEM</span>
          {isSystemOnline ? (
            <span className="text-[#00ffaa] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]" /> ONLINE
            </span>
          ) : (
            <span className="text-[#ff5555] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5555] shadow-[0_0_8px_#ff5555]" /> OFFLINE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-[#00f0ff]/20 px-3.5 py-1.5 rounded-full text-xs">
          <span className="text-[11px] text-gray-400 tracking-wider">OLLAMA</span>
          {isOllamaOnline ? (
            <span className="text-[#00ffaa] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]" /> READY
            </span>
          ) : (
            <span className="text-[#ff7700] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] shadow-[0_0_8px_#ff7700]" /> UNREACHABLE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-[#00f0ff]/20 px-3.5 py-1.5 rounded-full text-xs">
          <span className="text-[11px] text-gray-400 tracking-wider">LIVE DESKTOP</span>
          {monitorStatus === 'ACTIVE' ? (
            <span className="text-[#00ffaa] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]" /> ACTIVE
            </span>
          ) : monitorStatus === 'PAUSED' ? (
            <span className="text-[#ffaa00] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa00] shadow-[0_0_8px_#ffaa00]" /> PAUSED
            </span>
          ) : (
            <span className="text-gray-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" /> OFF
            </span>
          )}
        </div>
      </div>

      {/* Right Active Model Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-black/40 border border-[#00f0ff]/20 px-3.5 py-1.5 rounded-full text-xs">
          <span className="text-[11px] text-gray-400 tracking-wider">ACTIVE MODEL</span>
          <span className="font-hud text-[#ff7700] font-bold tracking-wider uppercase">
            {formatModelDisplayName(activeModel)}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full border border-[#00f0ff]/30 flex items-center justify-center">
          <div className="w-3.5 h-3.5 border border-dashed border-[#00f0ff] rounded-full animate-spin" />
        </div>
      </div>
    </header>
  );
};
