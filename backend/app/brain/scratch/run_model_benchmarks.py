import asyncio, json
from app.core.model_benchmark.benchmark_runner import ModelBenchmarker

async def main():
    benchmarker = ModelBenchmarker()
    target_models = [
        "qwen3-test:latest",
        "qwen-coder-3b:latest",
        "gemma-3-4b:latest",
        "deepseek-r1-7b:latest",
        "qwen3-hermes:latest",
    ]
    print("[BENCHMARK START] Running benchmarks for models:", target_models)
    results = await benchmarker.run_suite_for_models(target_models)
    serializable = {}
    for model, metrics_list in results.items():
        serializable[model] = [m.model_dump() for m in metrics_list]
    with open("backend/app/brain/scratch/benchmark_results.json", "w") as f:
        json.dump(serializable, f, indent=2)
    print("[BENCHMARK COMPLETE] Saved to backend/app/brain/scratch/benchmark_results.json")

if __name__ == "__main__":
    asyncio.run(main())
