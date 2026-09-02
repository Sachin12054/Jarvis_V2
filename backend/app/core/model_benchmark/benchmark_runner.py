import time, json, asyncio, httpx
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class BenchmarkMetrics(BaseModel):
    model_name: str
    category: str
    prompt: str
    response_text: str = ""
    ttft_ms: float = 0.0
    total_ms: float = 0.0
    prompt_tokens: int = 0
    eval_tokens: int = 0
    tokens_per_sec: float = 0.0
    error: Optional[str] = None
    quality_score: float = 1.0

BENCHMARK_PROMPTS = [
    ("CATEGORY_A_FAST", "What is 2 + 2? Answer in one sentence."),
    ("CATEGORY_B_KNOWLEDGE", "Explain what machine learning is in simple terms."),
    ("CATEGORY_C_INSTRUCTIONS", "Give me exactly three short steps to create a Python virtual environment."),
    ("CATEGORY_D_REASONING", "If a task takes 20 minutes and starts at 3:40 PM, when will it finish?"),
    ("CATEGORY_E_MULTI_REASONING", "Explain the steps required to find why a Python program is producing a runtime error."),
    ("CATEGORY_F_CODING", "Write a small Python function that checks whether a number is prime."),
    ("CATEGORY_G_COMMAND", "Open Chrome and search for Spider-Man trailer."),
    ("CATEGORY_H_AMBIGUITY", "Message Arun that I'll come in three minutes."),
    ("CATEGORY_I_VOICE_FAST", "open chrome"),
    ("CATEGORY_I_VOICE_AMBIGUOUS", "not bad"),
    ("CATEGORY_I_VOICE_QUERY", "what's two plus two"),
]

class ModelBenchmarker:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url.rstrip("/")

    async def run_single_benchmark(self, model_name: str, category: str, prompt: str) -> BenchmarkMetrics:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": model_name,
            "messages": [{"role": "user", "content": prompt}],
            "stream": True,
            "options": {"temperature": 0.2},
        }
        t0 = time.time()
        first_token_time = None
        response_chunks = []
        eval_tokens = 0
        prompt_tokens = 0
        eval_duration_ns = 0
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream("POST", url, json=payload) as resp:
                    if resp.status_code != 200:
                        return BenchmarkMetrics(model_name=model_name, category=category, prompt=prompt, error=f"HTTP {resp.status_code}")
                    async for line in resp.aiter_lines():
                        if not line.strip(): continue
                        data = json.loads(line)
                        chunk_msg = data.get("message", {}).get("content", "")
                        if chunk_msg and first_token_time is None:
                            first_token_time = time.time()
                        if chunk_msg: response_chunks.append(chunk_msg)
                        if data.get("done"):
                            eval_tokens = data.get("eval_count", 0)
                            prompt_tokens = data.get("prompt_eval_count", 0)
                            eval_duration_ns = data.get("eval_duration", 0)
            t1 = time.time()
            ttft = (first_token_time - t0) * 1000.0 if first_token_time else (t1 - t0) * 1000.0
            total_ms = (t1 - t0) * 1000.0
            tps = (eval_tokens / (eval_duration_ns / 1e9)) if eval_duration_ns > 0 else (eval_tokens / (total_ms / 1000.0) if total_ms > 0 else 0.0)
            full_text = "".join(response_chunks).strip()
            return BenchmarkMetrics(model_name=model_name, category=category, prompt=prompt, response_text=full_text, ttft_ms=round(ttft, 2), total_ms=round(total_ms, 2), prompt_tokens=prompt_tokens, eval_tokens=eval_tokens, tokens_per_sec=round(tps, 2))
        except Exception as e:
            return BenchmarkMetrics(model_name=model_name, category=category, prompt=prompt, error=str(e))

    async def run_suite_for_models(self, model_names: List[str]) -> Dict[str, List[BenchmarkMetrics]]:
        results = {}
        for model in model_names:
            model_results = []
            for cat, prompt in BENCHMARK_PROMPTS:
                m = await self.run_single_benchmark(model, cat, prompt)
                model_results.append(m)
            results[model] = model_results
        return results
