import asyncio, time, json, httpx

async def bench_quick(model, prompt):
    url = "http://localhost:11434/api/chat"
    payload = {"model": model, "messages": [{"role": "user", "content": prompt}], "stream": True, "options": {"temperature": 0.2}}
    t0 = time.time()
    ttft = None
    chunks = []
    eval_cnt, eval_dur = 0, 0
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            async with client.stream("POST", url, json=payload) as resp:
                async for line in resp.aiter_lines():
                    if not line.strip(): continue
                    d = json.loads(line)
                    c = d.get("message", {}).get("content", "")
                    if c and ttft is None: ttft = time.time()
                    if c: chunks.append(c)
                    if d.get("done"):
                        eval_cnt = d.get("eval_count", 0)
                        eval_dur = d.get("eval_duration", 0)
        t1 = time.time()
        ttft_ms = (ttft - t0)*1000.0 if ttft else (t1-t0)*1000.0
        tps = eval_cnt / (eval_dur/1e9) if eval_dur > 0 else 0.0
        out_sample = "".join(chunks).strip()[:40]
        print(f"[{model}] TTFT={ttft_ms:.1f}ms TPS={tps:.1f} Total={(t1-t0)*1000.0:.1f}ms output='{out_sample}...'", flush=True)
    except Exception as e:
        print(f"[{model}] Error: {e}", flush=True)

async def main():
    models = ["qwen3-test:latest", "qwen-coder-3b:latest", "gemma-3-4b:latest", "deepseek-r1-7b:latest", "qwen3-hermes:latest"]
    for m in models:
        await bench_quick(m, "What is 2 + 2? Answer in one sentence.")

if __name__ == "__main__":
    asyncio.run(main())
