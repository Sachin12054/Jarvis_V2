import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Mic, Cpu, Database, Wrench, Settings, Plus, Trash2, Clock, Loader2, Brain, RefreshCw } from 'lucide-react';
import { useJarvisStore } from '../../state/jarvisStore';
import { BrainMeshCanvas } from '../jarvis/BrainMeshCanvas';
import { formatModelDisplayName, getModelCategory } from '../../utils/modelNames';
import { ConversationService } from '../../services/conversationService';
import { MemoryService } from '../../services/memoryService';
import { StoredMemory } from '../../types/jarvis';

export const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const {
    activeModel,
    systemMetrics,
    conversationId,
    conversations,
    isLoadingConversations,
    setConversations,
    setIsLoadingConversations,
    removeConversationFromStore,
    loadConversationSession,
    resetActiveSession,
  } = useJarvisStore();

  const conversationServiceRef = useRef<ConversationService>(new ConversationService());
  const memoryServiceRef = useRef<MemoryService>(new MemoryService());

  const [storedMemories, setStoredMemories] = useState<StoredMemory[]>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);

  const navItems = [
    { id: 'chat', label: 'CHAT', icon: MessageSquare },
    { id: 'voice', label: 'VOICE', icon: Mic },
    { id: 'system', label: 'SYSTEM', icon: Cpu },
    { id: 'memory', label: 'MEMORY', icon: Database },
    { id: 'tools', label: 'TOOLS', icon: Wrench },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  // Fetch conversations from REST API
  const refreshConversations = async () => {
    setIsLoadingConversations(true);
    const list = await conversationServiceRef.current.getConversations(50, 0);
    setConversations(list);
    setIsLoadingConversations(false);
  };

  // Fetch memories from REST API
  const refreshMemories = async () => {
    setIsLoadingMemories(true);
    const data = await memoryServiceRef.current.listMemories(undefined, true, 50, 0);
    setStoredMemories(data.items || []);
    setIsLoadingMemories(false);
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      refreshConversations();
    } else if (activeTab === 'memory') {
      refreshMemories();
    }
  }, [activeTab, conversationId]);

  const handleSelectConversation = async (id: string) => {
    if (id === conversationId) return;
    const detail = await conversationServiceRef.current.getConversationDetail(id);
    if (detail) {
      loadConversationSession(detail);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const success = await conversationServiceRef.current.deleteConversation(id);
    if (success) {
      removeConversationFromStore(id);
    }
  };

  const handleDeleteMemory = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const success = await memoryServiceRef.current.deleteMemory(id);
    if (success) {
      setStoredMemories((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const isOnline = systemMetrics !== null;
  const cpu = systemMetrics ? systemMetrics.cpu_usage : 0;
  const ram = systemMetrics ? systemMetrics.ram_usage : 0;
  const gpu = systemMetrics?.gpu_usage ?? null;
  const temp = systemMetrics?.temperature ?? null;
  const uptime = systemMetrics?.uptime ?? '--:--:--';

  const displayName = formatModelDisplayName(activeModel);
  const category = getModelCategory(activeModel);

  return (
    <aside className="w-[240px] flex flex-col gap-3 shrink-0 z-10 relative pointer-events-auto h-full min-h-0 overflow-hidden">
      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-2.5 shadow-xl shrink-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  : 'text-gray-400 hover:bg-[#00f0ff]/5 hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Dynamic Content Panel based on Active Tab */}
      {activeTab === 'chat' ? (
        /* CONVERSATION HISTORY PANEL */
        <div className="flex-1 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col gap-2 min-h-0 overflow-hidden shadow-xl">
          {/* Header with New Chat Button */}
          <div className="flex items-center justify-between border-b border-[#00f0ff]/10 pb-2 shrink-0">
            <h3 className="font-hud text-xs tracking-widest text-gray-400">HISTORY</h3>
            <button
              onClick={resetActiveSession}
              className="flex items-center gap-1 bg-[#00f0ff]/10 border border-[#00f0ff]/40 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-semibold px-2 py-1 rounded-md transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            >
              <Plus className="w-3 h-3" />
              <span>NEW CHAT</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0">
            {isLoadingConversations ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#00f0ff]" />
                <span>Loading sessions...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-[11px] text-center p-3">
                <Clock className="w-5 h-5 text-gray-600 mb-1" />
                <span>No past sessions found.</span>
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = c.id === conversationId;
                const dateStr = new Date(c.updated_at).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                });
                const timeStr = new Date(c.updated_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectConversation(c.id)}
                    className={`group relative flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#00f0ff]/15 border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'bg-black/30 border-[#00f0ff]/10 text-gray-300 hover:border-[#00f0ff]/30 hover:bg-[#00f0ff]/5'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-hud font-bold tracking-wider truncate text-[11px]">
                        Session {c.id.substring(0, 8)}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        {dateStr} · {timeStr}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteConversation(e, c.id)}
                      title="Delete conversation"
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : activeTab === 'memory' ? (
        /* MEMORY STORE PANEL */
        <div className="flex-1 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col gap-2 min-h-0 overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#00f0ff]/10 pb-2 shrink-0">
            <h3 className="font-hud text-xs tracking-widest text-gray-400">MEMORY STORE</h3>
            <button
              onClick={refreshMemories}
              title="Refresh memories"
              className="p-1 bg-[#00f0ff]/10 border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded-md transition-all"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Stored Memories List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0">
            {isLoadingMemories ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#00f0ff]" />
                <span>Loading memories...</span>
              </div>
            ) : storedMemories.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-[11px] text-center p-3">
                <Brain className="w-5 h-5 text-gray-600 mb-1" />
                <span>No active memories stored. Use <code className="text-[#00f0ff]">/remember &lt;fact&gt;</code> to save one!</span>
              </div>
            ) : (
              storedMemories.map((m) => (
                <div
                  key={m.id}
                  className="group relative flex flex-col gap-1 p-2 rounded-lg border bg-black/40 border-[#00f0ff]/15 text-xs hover:border-[#00f0ff]/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[9px] font-bold text-[#ff7700] uppercase bg-[#ff7700]/10 px-1.5 py-0.5 rounded border border-[#ff7700]/30">
                      {m.memory_type}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono text-gray-400">
                        {(m.confidence * 100).toFixed(0)}%
                      </span>
                      <button
                        onClick={(e) => handleDeleteMemory(e, m.id)}
                        title="Forget memory"
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-400 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-200 font-sans leading-tight break-words">
                    {m.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* ACTIVE MODEL PANEL (for non-chat/memory tabs) */
        <div className="flex-1 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col gap-2 min-h-0 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-[#00f0ff]/10 pb-2 shrink-0">
            <h3 className="font-hud text-xs tracking-widest text-gray-400">ACTIVE MODEL</h3>
            <span className="text-[9px] font-mono text-[#ff7700] tracking-wider">{category}</span>
          </div>
          <div className="font-hud text-xs font-bold text-[#ff7700] tracking-wider uppercase mt-1 shrink-0">
            {displayName}
          </div>
          <div className="flex-1 flex items-center justify-center min-h-0">
            <BrainMeshCanvas />
          </div>
        </div>
      )}

      {/* System Overview Panel */}
      <div className="bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col gap-2 shadow-xl shrink-0">
        <div className="flex items-center justify-between border-b border-[#00f0ff]/10 pb-1.5">
          <h3 className="font-hud text-[11px] tracking-widest text-gray-400">SYSTEM OVERVIEW</h3>
          {isOnline ? (
            <span className="text-[9px] text-[#00ffaa] font-semibold" title="Real-time backend metrics stream">
              ● LIVE
            </span>
          ) : (
            <span className="text-[9px] text-[#ff5555] font-semibold" title="Backend offline">
              OFFLINE
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          {/* CPU Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[10px] w-8">CPU</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] transition-all duration-500"
                style={{ width: `${Math.min(Math.max(cpu, 0), 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-gray-200 w-8 text-right">
              {isOnline ? `${cpu}%` : '--'}
            </span>
          </div>

          {/* RAM Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[10px] w-8">RAM</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] transition-all duration-500"
                style={{ width: `${Math.min(Math.max(ram, 0), 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-gray-200 w-8 text-right">
              {isOnline ? `${ram}%` : '--'}
            </span>
          </div>

          {/* GPU Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[10px] w-8">GPU</span>
            {gpu !== null ? (
              <>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] transition-all duration-500"
                    style={{ width: `${Math.min(Math.max(gpu, 0), 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-gray-200 w-8 text-right">{gpu}%</span>
              </>
            ) : (
              <span className="font-mono text-[10px] text-gray-500 flex-1 text-right">N/A</span>
            )}
          </div>

          {/* TEMP Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[10px] w-8">TEMP</span>
            <span className="font-mono text-[10px] text-[#00f0ff]">
              {temp !== null ? `${temp}°C` : 'N/A'}
            </span>
          </div>

          {/* UPTIME Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[10px] w-8">UPTIME</span>
            <span className="font-mono text-[10px] text-[#00f0ff]">{uptime}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
