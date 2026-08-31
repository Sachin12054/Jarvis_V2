export type JarvisState = 'idle' | 'listening' | 'thinking' | 'acting' | 'speaking' | 'interrupted' | 'error';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: string;
}

export interface SystemMetrics {
  cpu_usage: number;
  ram_usage: number;
  gpu_usage: number | null;
  gpu_memory: number | null;
  temperature: number | null;
  uptime: string;
}

export interface SSEPayload {
  conversation_id?: string;
  chunk?: string;
  model?: string;
  done?: boolean;
}

export interface ConversationSummary {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StoredMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  extra_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages: StoredMessage[];
}

export type MemoryType = 'factual' | 'preference' | 'project' | 'contextual' | 'procedural' | 'episodic';
export type MemorySource = 'user_explicit' | 'inferred' | 'system';

export interface StoredMemory {
  id: string;
  user_id: string;
  memory_type: MemoryType;
  content: string;
  normalized_content: string;
  importance: number;
  confidence: number;
  source: MemorySource;
  access_count: number;
  last_accessed_at: string;
  is_active: boolean;
  extra_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MemoryCreatePayload {
  content: string;
  memory_type: MemoryType;
  user_id?: string;
  importance?: number;
  confidence?: number;
  source?: MemorySource;
  extra_metadata?: Record<string, any>;
}

export interface MemoryUpdatePayload {
  content?: string;
  memory_type?: MemoryType;
  importance?: number;
  confidence?: number;
  source?: MemorySource;
  is_active?: boolean;
  extra_metadata?: Record<string, any>;
}

export interface MemoryListResponse {
  total: number;
  items: StoredMemory[];
}
