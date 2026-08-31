import { useRef } from 'react';
import { useJarvisStore } from '../state/jarvisStore';
import { SSEStreamClient } from '../services/sseClient';
import { CommandRouter } from '../services/commandRouter';

export function useJarvisStream() {
  const sseClientRef = useRef<SSEStreamClient>(new SSEStreamClient());
  const commandRouterRef = useRef<CommandRouter>(new CommandRouter());

  const {
    conversationId,
    activeModel,
    systemMetrics,
    setJarvisState,
    setActiveModel,
    setConversationId,
    addMessage,
    updateLastAssistantMessage,
    clearMessages,
    setIsGenerating,
    isGenerating,
  } = useJarvisStore();

  const stopStream = () => {
    sseClientRef.current.cancel();
    setIsGenerating(false);
    setJarvisState('idle');
  };

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isGenerating) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const isCoordinatePayload = userText.toLowerCase().includes('latitude:') && userText.toLowerCase().includes('longitude:');

    // 1. Check for allowlisted JARVIS commands (/help, /status, /model, /metrics, /clear, /stop, /remember, /memory)
    if (!isCoordinatePayload) {
      const cmdResult = await commandRouterRef.current.processInputAsync(
        userText,
        activeModel,
        systemMetrics,
        () => clearMessages(),
        () => stopStream()
      );

      if (cmdResult.isCommand) {
        if (cmdResult.type === 'clear' || cmdResult.type === 'stop') {
          return;
        }
        if (cmdResult.responseContent) {
          addMessage({
            id: `user-${Date.now()}`,
            role: 'user',
            content: userText,
            timestamp,
          });
          addMessage({
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: cmdResult.responseContent,
            timestamp,
            model: activeModel,
          });
          return;
        }
      }
    }

    // 2. Standard LLM / Location Chat Request
    // Do NOT display raw coordinate strings in the user's visible chat timeline
    if (!isCoordinatePayload) {
      addMessage({
        id: `user-${Date.now()}`,
        role: 'user',
        content: userText,
        timestamp,
      });
    }

    addMessage({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp,
    });

    setJarvisState('thinking');
    setIsGenerating(true);

    await sseClientRef.current.streamChat(userText, conversationId, {
      onStart: () => {},
      onChunk: (chunk, model, newConvId) => {
        if (newConvId) setConversationId(newConvId);
        if (model) setActiveModel(model);
        updateLastAssistantMessage(chunk, model);
      },
      onDone: (data) => {
        if (data.model) setActiveModel(data.model);
        if (data.conversation_id) setConversationId(data.conversation_id);
        setIsGenerating(false);
        setJarvisState('idle');
      },
      onError: (errorMsg) => {
        updateLastAssistantMessage(`\n\n⚠️ JARVIS Connection Error: ${errorMsg}`);
        setIsGenerating(false);
        setJarvisState('idle');
      },
    });
  };

  return {
    sendMessage,
    stopStream,
    isGenerating,
  };
}
