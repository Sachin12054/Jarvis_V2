import { ConversationSummary, ConversationDetail } from '../types/jarvis';

export class ConversationService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetches stored conversation session summaries ordered by updated_at descending.
   */
  async getConversations(limit: number = 50, offset: number = 0): Promise<ConversationSummary[]> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        console.warn(`[ConversationService] Failed to fetch conversations: ${response.statusText}`);
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('[ConversationService] Network error fetching conversations:', err);
      return [];
    }
  }

  /**
   * Fetches metadata and chronological message history for a specific conversation session.
   */
  async getConversationDetail(conversationId: string): Promise<ConversationDetail | null> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`);
      if (!response.ok) {
        console.warn(`[ConversationService] Failed to fetch session ${conversationId}: ${response.statusText}`);
        return null;
      }
      return await response.json();
    } catch (err) {
      console.warn(`[ConversationService] Network error fetching session ${conversationId}:`, err);
      return null;
    }
  }

  /**
   * Safely deletes a conversation session and all its associated messages.
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err) {
      console.warn(`[ConversationService] Network error deleting session ${conversationId}:`, err);
      return false;
    }
  }
}
