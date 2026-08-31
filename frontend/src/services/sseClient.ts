import { SSEPayload } from '../types/jarvis';

export interface SSECallbacks {
  onStart?: () => void;
  onChunk: (chunk: string, model?: string, conversationId?: string) => void;
  onDone: (data: SSEPayload) => void;
  onError: (errorMsg: string) => void;
}

export class SSEStreamClient {
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor() {
    this.baseUrl = window.location.origin.startsWith('http')
      ? window.location.origin
      : 'http://127.0.0.1:8000';
  }

  async streamChat(
    message: string,
    conversationId: string | null,
    callbacks: SSECallbacks
  ): Promise<void> {
    const { onStart, onChunk, onDone, onError } = callbacks;

    this.abortController = new AbortController();

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        let errText = `HTTP Error ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error) errText = errData.error;
        } catch (_) {}
        throw new Error(errText);
      }

      onStart?.();

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body stream unreadable.');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Retain incomplete trailing line

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line || !line.startsWith('data: ')) continue;

          const dataStr = line.slice(6).trim();
          if (!dataStr) continue;

          try {
            const data: SSEPayload = JSON.parse(dataStr);
            if (data.done) {
              onDone(data);
              return;
            }

            if (data.chunk) {
              onChunk(data.chunk, data.model, data.conversation_id);
            }
          } catch (jsonErr) {
            console.warn('[SSEStreamClient] JSON parse error:', jsonErr);
          }
        }
      }

      // Handle remaining buffer line if any
      if (buffer.trim().startsWith('data: ')) {
        const dataStr = buffer.trim().slice(6).trim();
        if (dataStr) {
          try {
            const data: SSEPayload = JSON.parse(dataStr);
            if (data.done) onDone(data);
            else if (data.chunk) onChunk(data.chunk, data.model, data.conversation_id);
          } catch (_) {}
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        onDone({ done: true });
      } else {
        onError(err.message || 'Failed to stream response from backend.');
      }
    } finally {
      this.abortController = null;
    }
  }

  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}
