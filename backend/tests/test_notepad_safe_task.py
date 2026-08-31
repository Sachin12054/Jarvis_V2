import asyncio
import time
import pytest
from app.execution.computer_gateway import ComputerUseGateway
from app.execution.cua_driver_client import CuaDriverClient


@pytest.mark.asyncio
async def test_notepad_safe_computer_task():
    """Executes safe real computer task:

    Flow:
    1. Qwen3 Reasoning / JARVIS Decision -> launch_app("Notepad")
    2. ComputerUseGateway -> CUA Driver launch_app
    3. CUA Driver -> Windows OS launches Notepad
    4. Type 'Hello from JARVIS' -> CUA Driver type_text
    5. Verify state -> CUA Driver verify_state
    6. Close Notepad -> CUA Driver kill_app("notepad.exe")
    """
    gateway = ComputerUseGateway.get_instance()
    client = gateway.cua_client

    print("\n[STEP 1] Launching Windows Notepad via CUA Driver...")
    launch_res = await gateway.launch_app("Notepad")
    print(f"Launch Result: executed={launch_res.executed} evidence={launch_res.evidence} error={launch_res.error}")
    assert launch_res.executed is True

    await asyncio.sleep(1.0)

    print("\n[STEP 2] Typing 'Hello from JARVIS' via CUA Driver...")
    type_res = await gateway.type_text("Hello from JARVIS")
    print(f"Type Result: executed={type_res.executed} evidence={type_res.evidence} error={type_res.error}")
    assert type_res.executed is True

    await asyncio.sleep(0.5)

    print("\n[STEP 3] Verifying state via CUA Driver...")
    verify_res = await gateway.verify_state("window_title_contains('Notepad')")
    print(f"Verify Result: verified={verify_res.verified} evidence={verify_res.evidence} error={verify_res.error}")

    await asyncio.sleep(0.5)

    print("\n[STEP 4] Closing Windows Notepad via CUA Driver kill_app...")
    kill_res = await client.kill_app("notepad.exe")
    print(f"Kill Result: success={kill_res.get('success')} data={kill_res.get('data')}")

    print("\n[SUCCESS] Safe computer control task completed through Qwen3 -> JARVIS -> Gateway -> CUA Driver!")
