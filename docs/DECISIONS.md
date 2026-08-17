# JARVIS Architecture Decision Records (ADRs)

## ADR 001: Backend Stack Choice
- **Decision**: Use Python 3.12, FastAPI, Uvicorn, Pydantic v2, and SQLAlchemy 2.0 Async (`asyncpg`).
- **Rationale**: Provides native async capability, high-throughput I/O performance, automatic OpenAPI documentation, and seamless integration with Python AI libraries.

## ADR 002: Service Layer Separation
- **Decision**: Introduce a dedicated Application Service Layer (`ChatService`) between API routes (`app/api/chat.py`) and the JARVIS Orchestrator.
- **Rationale**: Keeps business logic strictly out of API controllers, allowing routes to focus purely on request validation, HTTP status mapping, and serialization. Enables reusing service components across alternative entry points (e.g. WebSocket, CLI, ambient voice daemon).

## ADR 003: LLM Provider Abstraction
- **Decision**: Define a formal `LLMProvider` abstract base class with concrete implementations for `MockLLMProvider`, `OpenAILLMProvider`, and `GeminiLLMProvider`.
- **Rationale**: Isolates model provider SDK dependencies behind a clean interface (`generate_response`). Allows switching providers seamlessly via the `LLM_PROVIDER` environment variable without changing core brain orchestration logic.

## ADR 004: Dual Database Testing Strategy
- **Decision**: Use PostgreSQL (`asyncpg`) for production/development runtime via Docker or local PostgreSQL, and `sqlite+aiosqlite` in-memory for unit testing.
- **Rationale**: Guarantees zero-dependency, ultra-fast local test execution with `pytest`, while preserving full production compatibility with PostgreSQL. Full PostgreSQL integration test suites will be added in a future phase.

## ADR 005: Strict Tool Execution & Permission Gate Architecture
- **Decision**: Architect future tool calling through a dedicated `Tool Registry`, `Permission Manager`, and `Tool Executor` chain rather than giving direct OS/shell access to LLM prompt completions.
- **Rationale**: Prevents prompt injection vulnerabilities, unauthorized payment execution, accidental file deletion, or unapproved phone calls.

## ADR 006: Non-Mandatory Docker for Local Development
- **Decision**: Support Docker Compose for containerized environments, but enable running JARVIS directly via standard Python 3.12 and Uvicorn (`python -m uvicorn app.main:app`).
- **Rationale**: Maximum developer flexibility and fast local iteration.
