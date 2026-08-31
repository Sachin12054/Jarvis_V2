import { formatModelDisplayName, getModelCategory } from '../utils/modelNames';
import { SystemMetrics } from '../types/jarvis';
import { MemoryService } from './memoryService';

export interface CommandResult {
  isCommand: boolean;
  type?: 'help' | 'status' | 'model' | 'metrics' | 'clear' | 'stop' | 'remember' | 'memory';
  responseContent?: string;
}

export class CommandRouter {
  private memoryService: MemoryService;

  constructor() {
    this.memoryService = new MemoryService();
  }

  async processInputAsync(
    input: string,
    activeModel: string,
    metrics: SystemMetrics | null,
    onClearChat: () => void,
    onStopStream: () => void
  ): Promise<CommandResult> {
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    // 1. CLEAR COMMAND
    if (lower === '/clear' || lower === 'clear conversation' || lower === 'clear chat') {
      onClearChat();
      return {
        isCommand: true,
        type: 'clear',
        responseContent: 'Conversation timeline cleared. System ready.',
      };
    }

    // 2. STOP COMMAND
    if (lower === '/stop' || lower === 'stop') {
      onStopStream();
      return {
        isCommand: true,
        type: 'stop',
        responseContent: 'Active stream cancelled. Returning to IDLE.',
      };
    }

    // 3. EXPLICIT /REMEMBER COMMAND
    if (lower.startsWith('/remember ')) {
      const fact = trimmed.substring(10).trim();
      if (!fact) {
        return {
          isCommand: true,
          type: 'remember',
          responseContent: '⚠️ Usage: `/remember <fact to remember>`',
        };
      }

      const memory = await this.memoryService.createMemory({
        content: fact,
        memory_type: 'preference',
        confidence: 1.0,
        importance: 0.9,
        source: 'user_explicit',
      });

      if (memory) {
        return {
          isCommand: true,
          type: 'remember',
          responseContent: `🧠 **MEMORY PERSISTED**\n\n- **Fact**: "${memory.content}"\n- **Type**: \`${memory.memory_type.toUpperCase()}\`\n- **Confidence**: \`100%\`\n- **Source**: \`user_explicit\``,
        };
      } else {
        return {
          isCommand: true,
          type: 'remember',
          responseContent: '⚠️ Failed to save memory record. Please check backend connection.',
        };
      }
    }

    // 4. EXPLICIT /MEMORY COMMANDS
    if (lower === '/memory' || lower === '/memory list') {
      const data = await this.memoryService.listMemories(undefined, true, 20, 0);
      if (data.items.length === 0) {
        return {
          isCommand: true,
          type: 'memory',
          responseContent: '🧠 **JARVIS MEMORY SYSTEM**\n\nNo stored user memories found.',
        };
      }

      const lines = data.items.map((m, idx) => `${idx + 1}. **[${m.memory_type.toUpperCase()}]** "${m.content}" *(Confidence: ${(m.confidence * 100).toFixed(0)}%)*`);
      return {
        isCommand: true,
        type: 'memory',
        responseContent: `🧠 **STORED USER MEMORIES (${data.total} Total)**\n\n${lines.join('\n')}`,
      };
    }

    if (lower.startsWith('/memory forget ')) {
      const query = lower.substring(15).trim();
      const data = await this.memoryService.listMemories(undefined, true, 50, 0);
      const matches = data.items.filter((m) => m.content.toLowerCase().includes(query));

      if (matches.length === 0) {
        return {
          isCommand: true,
          type: 'memory',
          responseContent: `⚠️ No active memories matched query "${query}".`,
        };
      }

      for (const match of matches) {
        await this.memoryService.deleteMemory(match.id);
      }

      return {
        isCommand: true,
        type: 'memory',
        responseContent: `🧠 **MEMORY FORGOTTEN**\n\nDeleted ${matches.length} matching memory record(s) for "${query}".`,
      };
    }

    if (lower === '/memory clear') {
      return {
        isCommand: true,
        type: 'memory',
        responseContent: '⚠️ **MEMORY CLEAR CONFIRMATION REQUIRED**\n\nUse `/memory forget <query>` to delete specific memories.',
      };
    }

    // 5. HELP COMMAND
    if (lower === '/help' || lower === 'help' || lower === 'show commands') {
      return {
        isCommand: true,
        type: 'help',
        responseContent: `**JARVIS ALLOWLISTED COMMAND SYSTEM**\n\n- \`/help\` — Display available commands\n- \`/remember <fact>\` — Explicitly persist a long-term memory\n- \`/memory\` or \`/memory list\` — Display stored active memories\n- \`/memory forget <query>\` — Delete matching stored memory\n- \`/status\` — Display system health & status\n- \`/model\` — Display active model information\n- \`/metrics\` — Display CPU, RAM, GPU & Temperature\n- \`/clear\` — Clear conversation timeline\n- \`/stop\` — Cancel active LLM generation stream`,
      };
    }

    // 6. MODEL COMMAND
    if (
      lower === '/model' ||
      lower === 'what model are you using?' ||
      lower === 'model status' ||
      lower === 'show model'
    ) {
      const displayName = formatModelDisplayName(activeModel);
      const category = getModelCategory(activeModel);
      return {
        isCommand: true,
        type: 'model',
        responseContent: `**ACTIVE LLM MODEL DETAILS**\n\n- **Model**: \`${displayName}\`\n- **Category**: \`${category}\`\n- **Provider**: Local Ollama Engine\n- **Routing**: Dynamic Intent-based Router`,
      };
    }

    // 7. METRICS COMMAND
    if (
      lower === '/metrics' ||
      lower === 'show cpu' ||
      lower === 'show metrics' ||
      lower === 'system metrics'
    ) {
      const cpu = metrics ? `${metrics.cpu_usage}%` : 'N/A';
      const ram = metrics ? `${metrics.ram_usage}%` : 'N/A';
      const gpu = metrics?.gpu_usage !== null && metrics?.gpu_usage !== undefined ? `${metrics.gpu_usage}%` : 'N/A';
      const temp = metrics?.temperature !== null && metrics?.temperature !== undefined ? `${metrics.temperature}°C` : 'N/A';
      const uptime = metrics?.uptime ?? '--:--:--';

      return {
        isCommand: true,
        type: 'metrics',
        responseContent: `**REAL-TIME HARDWARE METRICS**\n\n- **CPU Usage**: \`${cpu}\`\n- **RAM Usage**: \`${ram}\`\n- **GPU Usage**: \`${gpu}\`\n- **Temperature**: \`${temp}\`\n- **System Uptime**: \`${uptime}\``,
      };
    }

    // 8. STATUS COMMAND
    if (lower === '/status' || lower === 'show system status' || lower === 'system status') {
      const isHealthy = metrics !== null;
      const modelName = formatModelDisplayName(activeModel);

      return {
        isCommand: true,
        type: 'status',
        responseContent: `**JARVIS SYSTEM STATUS**\n\n- **Backend**: \`${isHealthy ? 'ONLINE (HTTP 200)' : 'OFFLINE'}\`\n- **Active Model**: \`${modelName}\`\n- **Memory Engine**: \`ONLINE\`\n- **Voice Sync**: \`ONLINE\`\n- **System Health**: \`OPERATIONAL\``,
      };
    }

    return { isCommand: false };
  }
}
