import { create } from 'zustand';
import { JarvisState, ChatMessage, SystemMetrics, ConversationSummary, ConversationDetail } from '../types/jarvis';

interface JarvisStore {
  currentState: JarvisState;
  activeModel: string;
  conversationId: string | null;
  messages: ChatMessage[];
  systemMetrics: SystemMetrics | null;
  isGenerating: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isVoiceModeActive: boolean;

  // Persistent Conversation History State
  conversations: ConversationSummary[];
  isLoadingConversations: boolean;

  // Actions
  setJarvisState: (state: JarvisState) => void;
  setActiveModel: (model: string) => void;
  setConversationId: (id: string | null) => void;
  setSystemMetrics: (metrics: SystemMetrics) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (chunk: string, model?: string) => void;
  clearMessages: () => void;
  setIsGenerating: (generating: boolean) => void;
  setIsListening: (listening: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setIsVoiceModeActive: (active: boolean) => void;

  // Conversation History Actions
  setConversations: (conversations: ConversationSummary[]) => void;
  setIsLoadingConversations: (isLoading: boolean) => void;
  removeConversationFromStore: (id: string) => void;
  loadConversationSession: (detail: ConversationDetail) => void;
  resetActiveSession: () => void;
}

export const useJarvisStore = create<JarvisStore>((set) => ({
  currentState: 'idle',
  activeModel: 'gemma-3-4b:latest',
  conversationId: null,
  messages: [],
  systemMetrics: null,
  isGenerating: false,
  isListening: false,
  isSpeaking: false,
  isVoiceModeActive: false,

  conversations: [],
  isLoadingConversations: false,

  setJarvisState: (currentState) => set({ currentState }),
  setActiveModel: (activeModel) => set({ activeModel }),
  setConversationId: (conversationId) => set({ conversationId }),
  setSystemMetrics: (systemMetrics) => set({ systemMetrics }),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  updateLastAssistantMessage: (chunk, model) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
        messages[lastIndex] = {
          ...messages[lastIndex],
          content: messages[lastIndex].content + chunk,
          model: model || messages[lastIndex].model,
        };
      }
      return {
        messages,
        activeModel: model ? model.toLowerCase() : state.activeModel,
      };
    }),

  clearMessages: () => set({ messages: [] }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsListening: (isListening) => set({ isListening }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
  setIsVoiceModeActive: (isVoiceModeActive) => set({ isVoiceModeActive }),

  setConversations: (conversations) => set({ conversations }),
  setIsLoadingConversations: (isLoadingConversations) => set({ isLoadingConversations }),

  removeConversationFromStore: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      ...(state.conversationId === id ? { conversationId: null, messages: [] } : {}),
    })),

  loadConversationSession: (detail) => {
    const chatMessages: ChatMessage[] = (detail.messages || []).map((m) => {
      const date = new Date(m.created_at);
      const timeStr = isNaN(date.getTime())
        ? ''
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return {
        id: m.id,
        role: m.role,
        content: m.content,
        model: m.extra_metadata?.model,
        timestamp: timeStr,
      };
    });

    set({
      conversationId: detail.id,
      messages: chatMessages,
    });
  },

  resetActiveSession: () => set({ conversationId: null, messages: [] }),
}));
