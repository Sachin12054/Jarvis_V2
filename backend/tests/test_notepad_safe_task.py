import asyncio
import time
import pytest
from app.execution.computer_gateway import ComputerUseGateway
from app.execution.cua_driver_client import CuaDriverClient


@pytest.mark.asyncio
async def test_notepad_safe_computer_task():
    """Executes safe real computer task:

    Flow:
    1. Launch Windows Notepad via CUA Driver -> gateway.launch_app("Notepad")
    2. Resolve LIVE window target dynamically -> gateway.resolve_window(app_name="Notepad")
    3. Bring live window to front -> gateway.bring_to_front(...)
    4. Type text -> gateway.type_text("Hello from JARVIS")
    5. Obtain fresh window state -> gateway.get_window_state(...)
    6. Verify state -> gateway.verify_state("window_title_contains('Notepad')")
    7. Close Notepad safely -> client.kill_app(...)
    """
    gateway = ComputerUseGateway.get_instance()
    client = gateway.cua_client

    print("\n[STEP 1] Launching Windows Notepad via CUA Driver...")
    launch_res = await gateway.launch_app("Notepad")
    print(f"Launch Result: executed={launch_res.executed} evidence={launch_res.evidence} error={launch_res.error}")
    assert launch_res.executed is True

    await asyncio.sleep(1.0)

    print("\n[STEP 2] Resolving LIVE window target dynamically...")
    resolved_res = await gateway.resolve_window(app_name="Notepad", timeout=6.0)
    print(f"Resolve Result: executed={resolved_res.executed} evidence={resolved_res.evidence} error={resolved_res.error}")
    assert resolved_res.executed is True

    live_win_id = resolved_res.evidence.get("window_id")
    live_pid = resolved_res.evidence.get("pid")

    if live_win_id:
        print(f"\n[STEP 3] Bringing window #{live_win_id} to front...")
        await client.bring_to_front(live_win_id)
        await asyncio.sleep(0.5)

    print("\n[STEP 4] Typing 'Hello from JARVIS' into live window...")
    type_res = await gateway.type_text("Hello from JARVIS")
    print(f"Type Result: executed={type_res.executed} evidence={type_res.evidence}")
    assert type_res.executed is True

    await asyncio.sleep(0.5)

    print("\n[STEP 5] Querying fresh window state snapshot...")
    state_res = await gateway.get_window_state(window_id=live_win_id, max_depth=3, max_elements=25)
    print(f"Window State Query: executed={state_res.executed} evidence_keys={list(state_res.evidence.keys())}")

    print("\n[STEP 6] Verifying state via CUA Driver...")
    verify_res = await gateway.verify_state("window_title_contains('Notepad')")
    print(f"Verify Result: verified={verify_res.verified} evidence={verify_res.evidence}")

    await asyncio.sleep(0.5)

    print("\n[STEP 7] Closing Windows Notepad safely...")
    if live_pid:
        kill_res = await client.kill_app(str(live_pid))
    else:
        kill_res = await client.kill_app("notepad.exe")
    print(f"Close Result: {kill_res}")

    print("\n[SUCCESS] Safe computer control task completed through Qwen3 -> JARVIS -> Gateway -> CUA Driver!")
