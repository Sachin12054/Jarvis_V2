# JARVIS v0.1 — Core/Brain Architecture & Foundation

JARVIS is a modular, production-grade personal AI assistant runtime built with **Python 3.12**, **FastAPI**, **Async SQLAlchemy 2.0**, and **Pydantic v2**. 

v0.1 establishes the clean text-based **Core/Brain** foundation, featuring provider-agnostic LLM abstractions, conversation session persistence, prompt identity management, application service layer separation, automated testing, and Docker environment configuration.

---

## 1. Current Capabilities (v0.1)

- 🧠 **Brain Orchestrator**: Manages turn-by-turn text dialogues, context assembly, and system identity injection.
- 🔌 **LLM Provider Abstraction**: Switchable LLM providers (`mock`, `openai`, `gemini`) via `.env` without modifying business logic.
- 💾 **Session & History Persistence**: Async database storage for conversations and messages using PostgreSQL (or in-memory SQLite for tests).
- ⚙️ **Service Layer Architecture**: Clean separation between API controllers (`app/api`), application business logic (`app/services`), and brain reasoning (`app/brain`).
- 🛑 **Safety & Extension Points**: Designed with future extension hooks for `ToolRegistry`, `PermissionManager`, and `ToolExecutor`. Direct LLM OS/filesystem/payment execution is strictly prohibited.
- 🧪 **Automated Testing Suite**: Fast, zero-dependency async test suite running against SQLite in-memory engine.
- 🐳 **Containerized & Local Execution**: Runs directly via Uvicorn/Python or containerized with Docker Compose (Docker is optional for local dev).

---

## 2. System Architecture

```text
User Request (REST API)
          │
          ▼
┌──────────────────┐
│   FastAPI API    │  (app/api/chat.py)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ Service Layer    │  (app/services/chat_service.py)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ Orchestrator     │  (app/brain/orchestrator.py)
└────┬─────────┬───┘
     │         │
     ▼         ▼
┌────────┐ ┌────────────────┐
│Context │ │ Prompt Manager │
│Manager │ │ (Identity)     │
└────┬───┘ └───────┬────────┘
     │             │
     └──────┬──────┘
            ▼
   ┌────────────────┐
   │  LLM Manager   │  (app/brain/llm_manager.py)
   └───────┬────────┘
           │
           ▼
   ┌────────────────┐
   │  LLM Provider  │  (Mock / OpenAI / Gemini)
   └────────────────┘
```

---

## 3. Requirements

- **Python 3.12+**
- **Pip / Virtualenv**
- **Docker & Docker Compose** (Optional for containerized PostgreSQL / API execution)

---

## 4. Local Installation & Setup

### Step 1: Clone & Environment Setup
```powershell
# Navigate to project directory
cd Jarvis

# Create a virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```

Default `.env` configuration:
```env
APP_NAME=JARVIS
APP_ENV=development
LOG_LEVEL=INFO
HOST=0.0.0.0
PORT=8000

DATABASE_URL=postgresql+asyncpg://jarvis_user:jarvis_password@localhost:5432/jarvis_db

LLM_PROVIDER=mock
LLM_API_KEY=your-api-key-here
LLM_MODEL=gpt-4o-mini
LLM_TIMEOUT=30
```

---

## 5. Local Ollama LLM Integration

JARVIS supports fully local, private LLM execution using **Ollama**.

### Step 1: Install & Start Ollama
Ensure Ollama is installed on your machine and the background service is running.

### Step 2: Verify Installed Local Models
List installed models:
```powershell
ollama list
```
Confirm the following models are installed:
- `deepseek-r1-7b:latest` (Default reasoning model)
- `qwen-coder-3b:latest` (Coding model)
- `gemma-3-4b:latest` (Fast/general model)

### Step 3: Verify Ollama Local HTTP API
Check server tags:
```powershell
curl http://127.0.0.1:11434/api/tags
```

### Step 4: Test Model Directly
Test model execution via terminal:
```powershell
ollama run deepseek-r1-7b:latest
```

### Step 5: Configure JARVIS for Ollama
In `.env`:
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=deepseek-r1-7b:latest
OLLAMA_CODING_MODEL=qwen-coder-3b:latest
OLLAMA_FAST_MODEL=gemma-3-4b:latest
OLLAMA_TIMEOUT=120
```
*Note: Ollama runs 100% locally and does not require an OpenAI or Gemini API key.*

### Step 6: Start JARVIS Backend & Test Chat Endpoint
Start the server:
```powershell
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Send a request to the chat API:
```http
POST http://127.0.0.1:8000/api/v1/chat
Content-Type: application/json

{
  "message": "Hello JARVIS"
}
```

---

## 6. Running JARVIS Locally

### Running Directly via Uvicorn (No Docker Required)
You can run the server directly using Uvicorn:
```powershell
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API Documentation will be available at:
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 6. Docker & Docker Compose Setup

To launch JARVIS with PostgreSQL containerized:
```powershell
docker-compose up --build
```
This starts:
1. `jarvis_postgres` (PostgreSQL 16 listening on port 5432 with health check)
2. `jarvis_api` (JARVIS FastAPI app listening on port 8000)

---

## 7. Database Migrations (Alembic)

Run database migrations to initialize PostgreSQL tables:
```powershell
cd backend
alembic upgrade head
```

To generate new migrations in future phases:
```powershell
alembic revision --autogenerate -m "Add new table"
```

---

## 8. Running Tests

Run the complete async unit test suite:
```powershell
cd backend
python -m pytest
```
*Note: The unit test suite automatically uses an isolated SQLite in-memory database (`sqlite+aiosqlite`) and mock LLM provider, requiring no external API keys or running database services.*

---

## 9. API Usage Examples

### Health Check Endpoint
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy"
}
```

### Chat Endpoint (New Conversation Session)
```http
POST /api/v1/chat
Content-Type: application/json

{
  "message": "Hello JARVIS, state your system purpose."
}
```
**Response:**
```json
{
  "conversation_id": "b1b7c3d1-4e2b-4a5f-8c3d-1a2b3c4d5e6f",
  "message": "Mock response from JARVIS to: 'Hello JARVIS, state your system purpose.'",
  "model": "gpt-4o-mini"
}
```

### Chat Endpoint (Continuing Session)
```http
POST /api/v1/chat
Content-Type: application/json

{
  "message": "What was my previous question?",
  "conversation_id": "b1b7c3d1-4e2b-4a5f-8c3d-1a2b3c4d5e6f"
}
```

---

## 10. Architectural Rules & Safety Constraints

1. **No Direct Execution**: The LLM never possesses direct access to operating system shells, payments, filesystem mutation, or network sockets.
2. **Permission Gate**: All future high-impact capabilities (tool execution, phone calls, web forms) must pass through an explicit Permission Gate requiring human confirmation.
3. **Layer Separation**: API routes are thin controllers. All business logic resides in `app/services` and `app/brain`.

---

## 11. Known Limitations (v0.1)

- Text-only dialogue via REST API.
- Future subsystems (Voice, Vision, Memory vector search, Tool execution, Phone, Booking) are intentionally not implemented yet.

---

## 12. Recommended Next Step

Proceed to **v0.2 — Voice Subsystem** or **v0.4 — Long-Term Memory (Pgvector)** as defined in [`docs/MASTER_SPEC.md`](file:///c:/Users/sachi/Desktop/Jarvis/docs/MASTER_SPEC.md).
