import React, { useEffect, useRef } from 'react';
import { TopHeader } from './components/layout/TopHeader';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightConversationPanel } from './components/layout/RightConversationPanel';
import { JarvisOrb } from './components/jarvis/JarvisOrb';
import { WaveformVisualizer } from './components/jarvis/WaveformVisualizer';
import { OrbStateCards } from './components/jarvis/OrbStateCards';
import { useJarvisStore } from './state/jarvisStore';
import { SystemService } from './services/systemService';
import { formatModelDisplayName } from './utils/modelNames';

export const App: React.FC = () => {
  const { currentState, activeModel, setSystemMetrics } = useJarvisStore();
  const systemServiceRef = useRef<SystemService>(new SystemService());

  // Periodic metrics polling (every 3 seconds, paused during 'thinking')
  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      if (useJarvisStore.getState().currentState === 'thinking') {
        return;
      }
      const metrics = await systemServiceRef.current.getSystemMetrics();
      if (isMounted) {
        setSystemMetrics(metrics);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [setSystemMetrics]);

  return (
    <div className="relative w-screen h-screen bg-[#050811] text-gray-100 font-sans select-none overflow-hidden">
      {/* 1. FIXED FULL-VIEWPORT AMBIENT 3D ORB BACKGROUND (Z-INDEX 0) */}
      <JarvisOrb state={currentState} />

      {/* 2. TRANSLUCENT GLASS FLOATING UI LAYOUT OVERLAY (Z-INDEX 10) */}
      <div className="relative z-10 w-full h-full flex flex-col p-3 gap-3 pointer-events-none overflow-hidden">
        {/* Top Header Panel */}
        <TopHeader />

        {/* Main 3-Column Content Grid */}
        <main className="flex-1 grid grid-cols-[240px_minmax(0,1fr)_440px] gap-3 min-h-0 min-w-0 overflow-hidden">
          {/* Left Sidebar Panel */}
          <LeftSidebar />

          {/* Center Panel Stack (Open HUD Space Floating Over Orb Background) */}
          <section className="relative flex flex-col items-center justify-between min-h-0 min-w-0 overflow-hidden py-2 pointer-events-none">
            {/* Top HUD Tagline */}
            <div className="bg-[#080e1a]/70 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 px-4 py-1 rounded-full pointer-events-auto shadow-lg">
              <span className="font-hud text-xs tracking-[4px] text-[#00f0ff]/70 uppercase">
                I AM ALL YOU NEED
              </span>
            </div>

            {/* Interactive Open Visual Portal (Passes Drag/Zoom to Orb) */}
            <div className="flex-1 w-full min-h-0 pointer-events-none" />

            {/* Bottom HUD Controls Stack (State Title, Waveform, Badge & Selector Cards) */}
            <div className="flex flex-col items-center gap-1.5 w-full pointer-events-none">
              {/* State Title & Active Model Badge */}
              <div className="flex flex-col items-center gap-0.5 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 px-6 py-2 rounded-xl pointer-events-auto shadow-xl">
                <div
                  className={`font-hud text-base font-bold tracking-[3px] uppercase transition-colors duration-300 ${
                    currentState === 'thinking'
                      ? 'text-[#ff7700] drop-shadow-[0_0_10px_rgba(255,119,0,0.6)]'
                      : currentState === 'speaking'
                      ? 'text-[#00ffaa] drop-shadow-[0_0_10px_rgba(0,255,170,0.7)]'
                      : 'text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                  }`}
                >
                  {currentState}
                </div>

                {currentState === 'thinking' && (
                  <div className="flex gap-1.5 my-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-ping delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-ping delay-300" />
                  </div>
                )}

                <span className="text-xs text-gray-400 font-sans">
                  {formatModelDisplayName(activeModel)}
                </span>
              </div>

              {/* Audio Waveform */}
              <div className="pointer-events-auto">
                <WaveformVisualizer active={currentState === 'speaking' || currentState === 'listening'} />
              </div>

              {/* System Online Badge */}
              <div className="bg-[#080e1a]/75 backdrop-blur-[14px] border border-[#00f0ff]/20 px-4 py-1 rounded-full text-[10px] tracking-widest text-gray-300 pointer-events-auto shadow-md">
                VOICE SYNCED · SYSTEM ONLINE
              </div>

              {/* 4 State Selector Cards */}
              <OrbStateCards />
            </div>
          </section>

          {/* Right Conversation Panel */}
          <RightConversationPanel />
        </main>
      </div>
    </div>
  );
};

export default App;
