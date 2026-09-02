import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useJarvisStore } from '../../state/jarvisStore';
import { MarkdownContent } from '../chat/MarkdownContent';
import { formatModelDisplayName } from '../../utils/modelNames';
import { BottomControlBar } from './BottomControlBar';
import { TaskGraphVisualizer } from '../jarvis/TaskGraphVisualizer';

export const RightConversationPanel: React.FC = () => {
  const { messages, isGenerating } = useJarvisStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  const handleScroll = () => {
    const elem = scrollRef.current;
    if (!elem) return;
    const isAtBottom = elem.scrollHeight - elem.scrollTop - elem.clientHeight < 60;
    setIsUserScrolledUp(!isAtBottom);
  };

  const scrollToBottom = () => {
    const elem = scrollRef.current;
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
      setIsUserScrolledUp(false);
    }
  };

  useEffect(() => {
    if (!isUserScrolledUp && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, isUserScrolledUp]);

  return (
    <aside className="w-[440px] shrink-0 h-full flex flex-col min-h-0 min-w-0 overflow-hidden bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-4 relative shadow-2xl z-10 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#00f0ff]/10 pb-2.5 shrink-0">
        <h3 className="font-hud text-xs tracking-widest text-gray-400">CONVERSATION</h3>
        <span className="text-[#00ffaa] text-xs font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]" /> LIVE
        </span>
      </div>

      {/* Message Stream Timeline */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto pr-1.5 mt-2.5 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <span className="font-hud text-xs tracking-wider mb-2">SYSTEM READY</span>
            <p className="text-xs">Ask JARVIS anything to start the real-time conversation.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isLast = index === messages.length - 1;
            const showModelTag = !isUser && msg.model && !msg.model.startsWith('jarvis-');

            return (
              <div
                key={msg.id}
                className={`p-3 rounded-xl border text-sm transition-all duration-200 w-full max-w-full break-words [overflow-wrap:anywhere] ${
                  isUser
                    ? 'bg-[#0e1c36]/85 border-[#38bdf8]/40 shadow-md'
                    : 'bg-[#091120]/90 border-[#00f0ff]/30 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-hud font-bold tracking-wider ${
                        isUser ? 'text-[#00f0ff]' : 'text-[#60a5fa]'
                      }`}
                    >
                      {isUser ? 'YOU' : 'JARVIS'}
                    </span>
                    {showModelTag && (
                      <span className="text-[9px] font-mono text-[#ff7700] bg-[#ff7700]/15 border border-[#ff7700]/40 px-1.5 py-0.5 rounded">
                        {formatModelDisplayName(msg.model!)}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-[10px]">{msg.timestamp}</span>
                </div>

                <div className="text-gray-100 font-sans leading-relaxed">
                  {msg.subtasks && msg.subtasks.length > 0 && (
                    <TaskGraphVisualizer subtasks={msg.subtasks} />
                  )}
                  <MarkdownContent content={msg.content} />
                  {!isUser && isLast && isGenerating && (
                    <span className="inline-block w-2 h-4 bg-[#00f0ff] ml-1 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Scroll Down Indicator */}
      {isUserScrolledUp && isGenerating && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-16 right-6 bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-[#00f0ff] hover:text-black transition-all"
        >
          <span>NEW RESPONSE</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Chat Command Input Control Bar in Right Corner */}
      <BottomControlBar />
    </aside>
  );
};
