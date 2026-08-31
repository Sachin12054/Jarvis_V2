import re
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_system_metrics_endpoint():
    """Verify GET /api/v1/system/metrics returns HTTP 200 with valid schema and ranges."""
    response = client.get("/api/v1/system/metrics")
    assert response.status_code == 200

    data = response.json()

    # 1. Verify schema keys
    assert "cpu_usage" in data
    assert "ram_usage" in data
    assert "gpu_usage" in data
    assert "gpu_memory" in data
    assert "temperature" in data
    assert "uptime" in data

    # 2. Verify cpu_usage range
    assert isinstance(data["cpu_usage"], (int, float))
    assert 0.0 <= data["cpu_usage"] <= 100.0

    # 3. Verify ram_usage range
    assert isinstance(data["ram_usage"], (int, float))
    assert 0.0 <= data["ram_usage"] <= 100.0

    # 4. Verify uptime format (HH:MM:SS)
    assert isinstance(data["uptime"], str)
    assert re.match(r"^\d+:\d{2}:\d{2}$", data["uptime"]) is not None

    # 5. Verify optional hardware metrics (float or None)
    if data["gpu_usage"] is not None:
        assert isinstance(data["gpu_usage"], (int, float))
        assert 0.0 <= data["gpu_usage"] <= 100.0

    if data["gpu_memory"] is not None:
        assert isinstance(data["gpu_memory"], (int, float))
        assert 0.0 <= data["gpu_memory"] <= 100.0

    if data["temperature"] is not None:
        assert isinstance(data["temperature"], (int, float))
