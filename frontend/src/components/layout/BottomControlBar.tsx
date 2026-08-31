import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Square, Volume2, AlertCircle, Hand } from 'lucide-react';
import { useJarvisStore } from '../../state/jarvisStore';
import { useJarvisStream } from '../../hooks/useJarvisStream';
import { VoiceRecognitionService } from '../../services/voiceService';
import { ChatMessage } from '../../types/jarvis';

export const BottomControlBar: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [ttsNotice, setTtsNotice] = useState<string | null>(null);
  const [isTestingSpeaker, setIsTestingSpeaker] = useState(false);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [gestureNotice, setGestureNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const voiceServiceRef = useRef<VoiceRecognitionService>(new VoiceRecognitionService());

  const {
    currentState,
    conversationId,
    isGenerating,
    isListening,
    isSpeaking,
    isVoiceModeActive,
    setJarvisState,
    setIsListening,
    setIsSpeaking,
    setIsVoiceModeActive,
    addMessage,
    setConversationId,
    setActiveModel,
  } = useJarvisStore();

  const { sendMessage, stopStream } = useJarvisStream();

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    const text = inputText.trim();
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape' && (isGenerating || isVoiceModeActive)) {
      e.preventDefault();
      handleStop();
    }
  };

  const handleStop = () => {
    stopStream();
    voiceServiceRef.current.stopSpeech();
    if (isVoiceModeActive) {
      voiceServiceRef.current.stopVoiceMode();
      setIsVoiceModeActive(false);
    }
    setIsListening(false);
    setIsSpeaking(false);
    setJarvisState('idle');
    setTtsNotice(null);
    setIsTestingSpeaker(false);
  };

  const handleSpeakTest = async () => {
    setIsTestingSpeaker(true);
    setTtsNotice('Testing speaker playback...');
    await voiceServiceRef.current.speakDiagnosticTestText("Hello. This is JARVIS audio test.", {
      onStateChange: (state) => {
        setJarvisState(state);
        setIsSpeaking(state === 'speaking');
        if (state === 'idle') setIsTestingSpeaker(false);
      },
      onTTSStatus: (status) => setTtsNotice(status),
    });
    setIsTestingSpeaker(false);
  };

  const toggleGestureControl = async () => {
    try {
      const targetEndpoint = isGestureActive ? '/api/v1/gesture/disable' : '/api/v1/gesture/enable';
      const res = await fetch(targetEndpoint, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIsGestureActive(data.enabled);
        setGestureNotice(data.message || (data.enabled ? 'Gesture control ACTIVE' : 'Gesture control OFF'));
        setTimeout(() => setGestureNotice(null), 3000);
      }
    } catch (err) {
      console.error('[GESTURE] Toggle failed:', err);
    }
  };

  const toggleVoiceMode = async () => {
    const voice = voiceServiceRef.current;
    if (!voice.isSupported()) {
      alert('Microphone access is not supported in this browser environment.');
      return;
    }

    if (isVoiceModeActive) {
      // Deactivate Continuous Voice Mode
      voice.stopVoiceMode();
      setIsVoiceModeActive(false);
      setIsListening(false);
      setIsSpeaking(false);
      setJarvisState('idle');
      setTtsNotice(null);
    } else {
      // Activate Continuous Voice Mode
      setIsVoiceModeActive(true);
      setTtsNotice(null);
      voice.stopSpeech(); // Barge-in interruption if playing

      await voice.startVoiceMode(
        {
          onStateChange: (state) => {
            setJarvisState(state);
            setIsListening(state === 'listening');
            setIsSpeaking(state === 'speaking');
          },
          onTranscript: (userText) => {
            // Add User Voice turn into shared chat messages store
            const userMsg: ChatMessage = {
              id: `v_user_${Date.now()}`,
              role: 'user',
              content: userText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            };
            addMessage(userMsg);
          },
          onAgentResponse: (userText, agentReply, usedConvId, usedModel) => {
            if (usedConvId) setConversationId(usedConvId);
            if (usedModel) setActiveModel(usedModel);

            // Add Assistant Voice reply into shared chat messages store
            const assistantMsg: ChatMessage = {
              id: `v_asst_${Date.now()}`,
              role: 'assistant',
              content: agentReply,
              model: usedModel || 'jarvis-voice',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            };
            addMessage(assistantMsg);
          },
          onError: (err) => {
            console.warn('[VoiceMode] Error:', err);
            setJarvisState('error');
          },
          onTTSStatus: (notice) => {
            console.warn('[VoiceMode] TTS Notice:', notice);
            setTtsNotice(notice);
          },
        },
        conversationId
      );
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 56)}px`;
    }
  }, [inputText]);

  return (
    <div className="w-full shrink-0 flex flex-col gap-1.5 pt-2 mt-2 border-t border-[#00f0ff]/15">
      {/* Voice / Gesture Mode Status Indicator Banner */}
      {(isVoiceModeActive || isGestureActive || gestureNotice) && (
        <div className="w-full px-3 py-1 bg-[#0c1424]/90 border border-[#00f0ff]/40 rounded-lg flex items-center justify-between font-hud text-[10px] tracking-wider text-[#00f0ff] animate-pulse shadow-[0_0_12px_rgba(0,240,255,0.25)]">
          <div className="flex items-center gap-3">
            {isVoiceModeActive && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                <span>VOICE MODE ● {currentState.toUpperCase()}</span>
              </div>
            )}
            {isGestureActive && (
              <div className="flex items-center gap-1.5 text-[#00ffaa]">
                <Hand className="w-3 h-3 text-[#00ffaa]" />
                <span>GESTURE CONTROL ● ACTIVE</span>
              </div>
            )}
          </div>

          {gestureNotice ? (
            <span className="text-[#00ffaa] font-bold">{gestureNotice}</span>
          ) : ttsNotice ? (
            <div className="flex items-center gap-1 text-[#ffaa00] font-bold">
              <AlertCircle className="w-3 h-3" />
              <span>{ttsNotice}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-[9px]">Hands-Free Control (VAD / MediaPipe Active)</span>
          )}
        </div>
      )}

      <div className="w-full flex items-center gap-2">
        {/* Continuous Voice Mode Toggle Button */}
        <button
          onClick={toggleVoiceMode}
          className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 border shrink-0 transition-all duration-300 font-hud text-xs tracking-wider ${
            isVoiceModeActive
              ? 'bg-[#00f0ff]/25 border-[#00ffff] text-[#00ffff] shadow-[0_0_20px_rgba(0,240,255,0.8)] scale-105 animate-pulse'
              : 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/20 hover:border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
          }`}
          title={isVoiceModeActive ? 'Exit Continuous Voice Mode' : 'Enter Continuous Voice Mode (Hands-Free)'}
        >
          {isVoiceModeActive ? (
            <>
              <Volume2 className="w-4 h-4 text-[#00ffff] animate-bounce" />
              <span>VOICE MODE ACTIVE</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>VOICE MODE</span>
            </>
          )}
        </button>

        {/* Gesture Control Toggle Button */}
        <button
          onClick={toggleGestureControl}
          className={`px-2.5 py-1.5 rounded-full flex items-center gap-1 border shrink-0 transition-all font-hud text-[10px] tracking-wider ${
            isGestureActive
              ? 'bg-[#00ffaa]/25 border-[#00ffaa] text-[#00ffaa] shadow-[0_0_15px_rgba(0,255,170,0.6)] animate-pulse'
              : 'bg-[#00f0ff]/5 border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/15'
          }`}
          title="Toggle Hand Gesture Control (MediaPipe)"
        >
          <Hand className="w-3 h-3" />
          <span>GESTURE CONTROL {isGestureActive ? '● ACTIVE' : '● OFF'}</span>
        </button>

        {/* Independent Speaker Diagnostic Test Button */}
        <button
          onClick={handleSpeakTest}
          disabled={isTestingSpeaker || isVoiceModeActive}
          className="px-2.5 py-1.5 rounded-full flex items-center gap-1 border border-[#00f0ff]/30 bg-[#00f0ff]/5 text-[#00f0ff] hover:bg-[#00f0ff]/20 font-hud text-[10px] tracking-wider shrink-0 transition-all disabled:opacity-40"
          title="Direct Speaker Output Test (POST /api/v1/voice/speak)"
        >
          <Volume2 className="w-3 h-3" />
          <span>{isTestingSpeaker ? 'SPEAKING...' : 'SPEAK TEST'}</span>
        </button>

        {/* Text Command Input Box */}
        <div className="flex-1 bg-[#0c1424]/95 border border-[#00f0ff]/25 rounded-full px-3.5 py-1 flex items-center gap-2 shadow-lg focus-within:border-[#00f0ff] focus-within:shadow-[0_0_12px_rgba(0,240,255,0.35)] transition-all min-w-0">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isVoiceModeActive ? "Voice Mode listening... or type a message" : "Type a message or start Voice Mode..."}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-gray-100 text-xs resize-none max-h-14 leading-snug placeholder-gray-500 py-1"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isGenerating}
            className="w-7 h-7 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center hover:bg-[#00f0ff] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stop / Interrupt Button */}
        <button
          onClick={handleStop}
          disabled={!isGenerating && !isListening && !isSpeaking && !isVoiceModeActive && !isTestingSpeaker}
          className="w-9 h-9 rounded-full bg-[#ff7700]/15 border border-[#ff7700]/40 text-[#ff7700] flex flex-col items-center justify-center gap-0.5 font-hud text-[8px] tracking-wider hover:bg-[#ff7700]/25 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all shadow-[0_0_12px_rgba(255,119,0,0.3)]"
          title="Stop Speech / Voice Mode (Interrupt)"
        >
          <Square className="w-2.5 h-2.5 fill-current" />
          <span>STOP</span>
        </button>
      </div>
    </div>
  );
};
