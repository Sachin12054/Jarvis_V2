# JARVIS System Architecture & Extension Points (v0.1)

## 1. Overview

JARVIS v0.1 establishes the foundational Core/Brain architecture. The design strictly separates API handling, business service logic, orchestration, prompt management, context preparation, LLM provider routing, and database persistence.

---

## 2. Request & Execution Flow

```text
HTTP Client (REST API)
          │
          ▼
┌──────────────────┐
│   FastAPI API    │  (backend/app/api/chat.py)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ Service Layer    │  (backend/app/services/chat_service.py)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ Orchestrator     │  (backend/app/brain/orchestrator.py)
└────┬─────────┬───┘
     │         │
     │         ├────────────────────────┐
     ▼         ▼                        ▼
┌────────┐ ┌────────────────┐ ┌──────────────────┐
│Context │ │ Prompt Manager │ │ Tool Registry    │
│Manager │ │ (Identity)     │ │ Extension Point  │
└────┬───┘ └───────┬────────┘ └─────────┬────────┘
     │             │                    │
     └──────┬──────┘                    ▼
            ▼                   ┌──────────────────┐
   ┌────────────────┐           │ Permission Gate  │
   │  LLM Manager   │           │ Extension Point  │
   └───────┬────────┘           └─────────┬────────┘
           │                              │
           ▼                              ▼
   ┌────────────────┐           ┌──────────────────┐
   │  LLM Provider  │           │ Tool Executor    │
   │(Mock/OpenAI/..)│           │ Extension Point  │
   └────────────────┘           └──────────────────┘
```

---

## 3. Core Modules & Responsibilities

### 3.1 API Layer (`app/api`)
- Input validation via Pydantic schemas.
- Route declaration (`/health`, `/api/v1/chat`).
- Translates service responses to API HTTP responses. BUSINESS LOGIC IS NOT PERMITTED HERE.

### 3.2 Service Layer (`app/services`)
- `ChatService`: Coordinates database transactions, session lookup, and invocation of the orchestrator.

### 3.3 Brain Module (`app/brain`)
- `JARVISOrchestrator`: Central brain runtime. Routes formatted messages to LLMManager. Designed with clean extension points for ToolRegistry and PermissionManager.
- `LLMManager`: Factory & router for LLM provider instances.
- `LLMProvider` (Interface): Standard abstraction for `generate_response()`. Implemented by `MockLLMProvider`, `OpenAILLMProvider`, and `GeminiLLMProvider`.
- `PromptManager`: Constructs JARVIS identity system prompts.
- `ContextManager`: Prepares conversation turns and truncates context windows cleanly.

### 3.4 Conversation Module (`app/conversation`)
- `ConversationManager`: Database CRUD operations for conversations and messages. Maintains strict chronological message ordering.

### 3.5 Database Module (`app/database`)
- SQLAlchemy 2.0 Async Engine with `AsyncSession`.
- `Conversations` & `Messages` models using UUIDs and timestamps.
- Alembic database migration management.

---

## 4. Safety & Tool Execution Extension Points

### Future Tool & Permission Architecture
Future versions will execute tools via the following chain:

```text
LLM Request -> Tool Registry -> Risk Assessment -> Permission Gate -> User Confirmation -> Tool Executor -> External Action
```

- **Rule**: High-impact operations (file modification, payments, phone calls, web forms) must NEVER be directly executed by an LLM prompt.
- **Rule**: Every tool execution must go through explicit confirmation gates.
- **Rule**: Non-mandatory local dev allows running JARVIS directly via Python/Uvicorn without Docker, while supporting Docker Compose for containerized environments.
