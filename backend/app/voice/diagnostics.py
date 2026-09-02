import time
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class VoiceTurnDiagnostics(BaseModel):
    turn_id: str
    capture_id: str = ""
    timestamps: Dict[str, float] = Field(default_factory=dict)
    latencies_ms: Dict[str, float] = Field(default_factory=dict)

    def mark(self, event_name: str, timestamp_val: Optional[float] = None) -> float:
        ts = timestamp_val if timestamp_val is not None else time.time()
        self.timestamps[event_name] = ts
        return ts

    def calculate_latencies(self) -> Dict[str, float]:
        ts = self.timestamps
        calc = {}
        if "speech_detected" in ts and "speech_ended" in ts:
            calc["speech_duration_ms"] = (ts["speech_ended"] - ts["speech_detected"]) * 1000.0
        if "speech_ended" in ts and "stt_started" in ts:
            calc["vad_to_stt_delay_ms"] = (ts["stt_started"] - ts["speech_ended"]) * 1000.0
        if "stt_started" in ts and "stt_completed" in ts:
            calc["stt_latency_ms"] = (ts["stt_completed"] - ts["stt_started"]) * 1000.0
        if "understanding_started" in ts and "understanding_completed" in ts:
            calc["understanding_latency_ms"] = (ts["understanding_completed"] - ts["understanding_started"]) * 1000.0
        if "decision_started" in ts and "decision_completed" in ts:
            calc["decision_latency_ms"] = (ts["decision_completed"] - ts["decision_started"]) * 1000.0
        if "llm_started" in ts and "first_token" in ts:
            calc["llm_ttft_ms"] = (ts["first_token"] - ts["llm_started"]) * 1000.0
        if "tts_started" in ts and "first_audio_generated" in ts:
            calc["tts_first_audio_latency_ms"] = (ts["first_audio_generated"] - ts["tts_started"]) * 1000.0
        if "speech_ended" in ts and "first_audio_played" in ts:
            calc["total_time_to_first_audio_ms"] = (ts["first_audio_played"] - ts["speech_ended"]) * 1000.0
        if "speech_ended" in ts and "turn_completed" in ts:
            calc["total_turn_latency_ms"] = (ts["turn_completed"] - ts["speech_ended"]) * 1000.0
        if "interruption_detected" in ts and "audio_stopped" in ts:
            calc["barge_in_to_audio_stop_latency_ms"] = (ts["audio_stopped"] - ts["interruption_detected"]) * 1000.0
        if "cancel_sent" in ts and "cancel_acknowledged" in ts:
            calc["cancellation_completion_latency_ms"] = (ts["cancel_acknowledged"] - ts["cancel_sent"]) * 1000.0
        self.latencies_ms = calc
        return calc
