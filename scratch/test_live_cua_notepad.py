import asyncio
import os
import time
from app.voice.normalization import normalize_voice_command
from app.cognition.command_router import CommandRouter
from app.execution.computer_gateway import ComputerUseGateway


async def test_live_notepad():
    print("--- 1. Testing Voice Normalization Wake-Word Removal ---")
    raw_inputs = [
        "JARVIS Open Notepad",
        "Jaws Open Notepad",
        "Jarvis, open vs code",
        "open not bad",
    ]
    for raw in raw_inputs:
        norm, rule = normalize_voice_command(raw)
        print(f"  [NORM TEST] raw='{raw}' -> normalized='{norm}' rule='{rule}'")
        assert norm != ""

    print("\n--- 2. Executing Real Live CUA Driver Call ('Open Notepad.') ---")
    t0 = time.time()
    routed = await CommandRouter.route("Open Notepad.", channel="voice")
    dur_ms = (time.time() - t0) * 1000.0

    print(f"\n[LIVE CUA ROUTER RESULT]:")
    print(f"  is_routed: {routed.is_routed}")
    print(f"  priority: {routed.priority}")
    print(f"  command_type: {routed.command_type}")
    print(f"  response_message: {routed.response_message}")
    print(f"  total_latency_ms: {dur_ms:.1f}ms")

    action_res = routed.action_result
    if action_res:
        print(f"  action_result.executed: {action_res.executed}")
        print(f"  action_result.verified: {action_res.verified}")
        print(f"  action_result.evidence: {action_res.evidence}")
        print(f"  action_result.error: {action_res.error}")

    assert routed.is_routed is True
    assert routed.command_type == "open_notepad"
    assert action_res is not None
    assert action_res.executed is True
    print("\n>>> LIVE CUA DRIVER NOTEPAD VERIFICATION PASSED SUCCESSFULLY! <<<")


if __name__ == "__main__":
    asyncio.run(test_live_notepad())
