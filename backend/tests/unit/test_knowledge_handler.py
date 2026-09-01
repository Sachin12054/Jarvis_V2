import inspect
import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.core.contracts import (
    JarvisRequest,
    UnderstandingResult,
    DecisionResult,
    DecisionStrategy,
    ResponseType,
)
from app.core.knowledge import KnowledgeHandler, LLMProviderPort


@pytest.mark.asyncio
async def test_knowledge_handler_success():
    mock_provider = MagicMock(spec=LLMProviderPort)
    mock_provider.generate_response = AsyncMock(return_value="Machine learning is a field of AI.")
    handler = KnowledgeHandler(llm_provider=mock_provider)
    req = JarvisRequest(conversation_id="c1", raw_input="What is machine learning?")
    und = UnderstandingResult(intent="KNOWLEDGE_QUERY", entities={"query": "What is machine learning?"})
    dec = DecisionResult(strategy=DecisionStrategy.KNOWLEDGE_QUERY, selected_model="qwen3-test:latest")
    resp = await handler.handle_knowledge_query(req, und, dec)
    assert resp.response_type == ResponseType.TEXT
    assert resp.message == "Machine learning is a field of AI."
    assert resp.metadata["model"] == "qwen3-test:latest"
    mock_provider.generate_response.assert_called_once()


@pytest.mark.asyncio
async def test_knowledge_handler_cancellation():
    mock_provider = MagicMock(spec=LLMProviderPort)
    handler = KnowledgeHandler(llm_provider=mock_provider)
    req = JarvisRequest(conversation_id="c1", raw_input="What is machine learning?")
    und = UnderstandingResult(intent="KNOWLEDGE_QUERY")
    dec = DecisionResult(strategy=DecisionStrategy.KNOWLEDGE_QUERY)
    cancel_evt = asyncio.Event()
    cancel_evt.set()
    resp = await handler.handle_knowledge_query(req, und, dec, cancel_event=cancel_evt)
    assert "cancelled" in resp.message.lower()
    mock_provider.generate_response.assert_not_called()


@pytest.mark.asyncio
async def test_knowledge_handler_error_propagation():
    mock_provider = MagicMock(spec=LLMProviderPort)
    mock_provider.generate_response = AsyncMock(side_effect=RuntimeError("Ollama connection timeout"))
    handler = KnowledgeHandler(llm_provider=mock_provider)
    req = JarvisRequest(conversation_id="c1", raw_input="What is AI?")
    und = UnderstandingResult(intent="KNOWLEDGE_QUERY")
    dec = DecisionResult(strategy=DecisionStrategy.KNOWLEDGE_QUERY)
    resp = await handler.handle_knowledge_query(req, und, dec)
    assert resp.response_type == ResponseType.ERROR
    assert "Ollama connection timeout" in resp.message


@pytest.mark.asyncio
async def test_knowledge_handler_no_direct_infrastructure_imports():
    from app.core.knowledge import knowledge_handler as kh_module
    source_code = inspect.getsource(kh_module)
    forbidden = ["import ollama\\n", "import ollama ", "from ollama ", "import fastapi", "import whisper", "import kokoro", "import subprocess"]
    for item in forbidden:
        assert item not in source_code.lower()
