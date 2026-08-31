import { StoredMemory, MemoryCreatePayload, MemoryUpdatePayload, MemoryListResponse } from '../types/jarvis';

export class MemoryService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  /**
   * Creates or reinforces an explicit long-term memory record.
   */
  async createMemory(payload: MemoryCreatePayload): Promise<StoredMemory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.warn('[MemoryService] Network error creating memory:', err);
      return null;
    }
  }

  /**
   * Fetches paginated stored memories matching criteria.
   */
  async listMemories(
    memoryType?: string,
    isActive: boolean = true,
    limit: number = 50,
    offset: number = 0
  ): Promise<MemoryListResponse> {
    try {
      const params = new URLSearchParams();
      if (memoryType) params.append('memory_type', memoryType);
      if (isActive !== undefined) params.append('is_active', String(isActive));
      params.append('limit', String(limit));
      params.append('offset', String(offset));

      const response = await fetch(`${this.baseUrl}/memory?${params.toString()}`);
      if (!response.ok) return { total: 0, items: [] };
      return await response.json();
    } catch (err) {
      console.warn('[MemoryService] Network error listing memories:', err);
      return { total: 0, items: [] };
    }
  }

  /**
   * Fetches memory record by ID (triggers access count increment).
   */
  async getMemory(memoryId: string): Promise<StoredMemory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/memory/${memoryId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.warn(`[MemoryService] Network error getting memory ${memoryId}:`, err);
      return null;
    }
  }

  /**
   * Updates an existing memory record by ID.
   */
  async updateMemory(memoryId: string, payload: MemoryUpdatePayload): Promise<StoredMemory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/memory/${memoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.warn(`[MemoryService] Network error updating memory ${memoryId}:`, err);
      return null;
    }
  }

  /**
   * Deletes a memory record by ID.
   */
  async deleteMemory(memoryId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/memory/${memoryId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err) {
      console.warn(`[MemoryService] Network error deleting memory ${memoryId}:`, err);
      return false;
    }
  }
}
