import { SystemMetrics } from '../types/jarvis';

export interface ModelStatus {
  provider: string;
  model: string;
  status: 'online' | 'offline';
}

export class SystemService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = window.location.origin.startsWith('http')
      ? window.location.origin
      : 'http://127.0.0.1:8000';
  }

  /**
   * Fetch real local machine metrics from GET /api/v1/system/metrics.
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/system/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('[SystemService] Fetching system metrics failed:', error);
      return {
        cpu_usage: 0.0,
        ram_usage: 0.0,
        gpu_usage: null,
        gpu_memory: null,
        temperature: null,
        uptime: '00:00:00',
      };
    }
  }

  /**
   * Fetch real-time Ollama LLM model status from GET /api/v1/system/model.
   */
  async getModelStatus(): Promise<ModelStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/system/model`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return {
        provider: 'ollama',
        model: 'gemma-3-4b:latest',
        status: 'offline',
      };
    }
  }
}
