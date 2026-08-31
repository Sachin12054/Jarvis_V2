import { JarvisState } from '../types/jarvis';

export interface VoiceCallbacks {
  onStateChange: (state: JarvisState) => void;
  onTranscript?: (transcript: string) => void;
  onAgentResponse?: (userText: string, agentReply: string, conversationId?: string, model?: string) => void;
  onError?: (error: string) => void;
  onTTSStatus?: (status: string) => void;
}

export class VoiceRecognitionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;

  // Web Audio VAD & Audio Context
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private vadInterval: number | null = null;
  private isAudioUnlocked = false;

  // State Flags
  private isVoiceModeActive = false;
  private isListening = false;
  private isSpeaking = false;
  private isProcessing = false;

  // VAD Parameters
  private static readonly SILENCE_THRESHOLD = 12; // Out of 255
  private static readonly BARGE_IN_THRESHOLD = 28; // Higher threshold during TTS playback to avoid self-echo
  private static readonly SILENCE_DURATION_MS = 750; // 750ms silence finishes turn
  private silenceStartTimestamp: number | null = null;
  private hasSpokenInCurrentTurn = false;
  private turnStartTimestamp = 0;

  // Latency & Interruption Telemetry
  private turnTimings = {
    speechEnd: 0,
    sttDone: 0,
    agentDone: 0,
    ttsStart: 0,
    audioPlaybackStarted: 0,
    interruptDetected: 0,
    ttsStopped: 0,
  };

  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  isVoiceMode(): boolean {
    return this.isVoiceModeActive;
  }

  /**
   * Resolves supported mimeType for MediaRecorder on current browser platform.
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav',
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  }

  /**
   * Pre-unlocks browser audio context during user interaction gesture.
   */
  async unlockBrowserAudio(): Promise<boolean> {
    try {
      const stateBefore = this.audioContext ? this.audioContext.state : 'uninitialized';
      console.log(`[TTS DEBUG] audio_context_state_before=${stateBefore}`);

      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        console.log('[TTS DEBUG] audio_context_resume=initiating');
        await this.audioContext.resume();
      }

      const stateAfter = this.audioContext.state;
      console.log(`[TTS DEBUG] audio_context_state_after=${stateAfter}`);

      // Play 10ms silent Audio element to satisfy browser autoplay policy
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      silentAudio.volume = 0.01;
      await silentAudio.play().catch(() => {});

      this.isAudioUnlocked = true;
      console.log('[TTS DEBUG] audio_context_unlocked=true status=ACTIVE');
      return true;
    } catch (err) {
      console.warn('[TTS DEBUG] Audio unlock warning:', err);
      return false;
    }
  }

  async startVoiceMode(callbacks: VoiceCallbacks, activeConversationId?: string | null): Promise<void> {
    if (this.isVoiceModeActive) return;

    this.isVoiceModeActive = true;
    this.stopSpeech();

    // Unlock browser audio context on user gesture
    await this.unlockBrowserAudio();

    console.log('[VoiceV3] Continuous Voice Mode activated.');
    await this.startTurnListening(callbacks, activeConversationId);
  }

  stopVoiceMode(): void {
    console.log('[VoiceV3] Continuous Voice Mode deactivated.');
    this.isVoiceModeActive = false;
    this.stopSpeech();
    this.stopVAD();
    this.stopMediaRecorder();

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((t) => t.stop());
      this.audioStream = null;
    }
  }

  /**
   * Diagnostic Independent Speak Test helper
   */
  async speakDiagnosticTestText(text: string = "Hello. This is JARVIS audio test.", callbacks?: VoiceCallbacks): Promise<void> {
    console.log(`[TTS DEBUG] tts_request_started=true text="${text}" endpoint=/api/v1/voice/speak`);
    await this.unlockBrowserAudio();

    try {
      const response = await fetch('/api/v1/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      console.log(`[TTS DEBUG] http_status=${response.status}`);
      const contentType = response.headers.get('Content-Type') || 'audio/mpeg';
      console.log(`[TTS DEBUG] content_type=${contentType}`);

      if (!response.ok) {
        console.warn(`[TTS DEBUG] playback_failed reason=http_status_${response.status}`);
        if (callbacks?.onTTSStatus) callbacks.onTTSStatus(`HTTP ${response.status} error`);
        return;
      }

      const audioBlob = await response.blob();
      console.log(`[TTS DEBUG] audio_bytes=${audioBlob.size} blob_created=true type=${audioBlob.type}`);

      if (audioBlob.size === 0) {
        console.warn('[TTS DEBUG] playback_failed reason=empty_audio_bytes');
        if (callbacks?.onTTSStatus) callbacks.onTTSStatus('Empty audio bytes received');
        return;
      }

      await this.playAudioBlob(audioBlob, callbacks);
    } catch (err: any) {
      console.error('[TTS DEBUG] playback_failed reason=', err);
      if (callbacks?.onTTSStatus) callbacks.onTTSStatus('Playback error');
    }
  }

  private async startTurnListening(callbacks: VoiceCallbacks, activeConversationId?: string | null): Promise<void> {
    if (!this.isVoiceModeActive || this.isListening) return;

    this.audioChunks = [];
    this.hasSpokenInCurrentTurn = false;
    this.silenceStartTimestamp = null;
    this.turnStartTimestamp = Date.now();

    try {
      if (!this.audioStream || !this.audioStream.active) {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      const mimeType = this.getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      this.mediaRecorder = new MediaRecorder(this.audioStream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstart = () => {
        this.isListening = true;
        console.log(`[VOICE CAPTURE] speech_started=true mime_type='${mimeType || 'default'}'`);
        if (!this.isSpeaking && !this.isProcessing) {
          callbacks.onStateChange('listening');
        }
        this.startVAD(callbacks, activeConversationId);
      };

      this.mediaRecorder.onstop = async () => {
        this.isListening = false;
        this.stopVAD();

        const recordingMime = mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: recordingMime });
        const durationMs = Date.now() - this.turnStartTimestamp;

        console.log(`[VOICE CAPTURE] speech_ended=true blob_created=true mime_type='${recordingMime}' size_bytes=${audioBlob.size} duration_ms=${durationMs}`);

        // Do not upload empty or micro blobs (< 100 bytes)
        if (audioBlob.size < 100 || !this.hasSpokenInCurrentTurn) {
          console.log('[VOICE CAPTURE] Recording below minimum valid threshold (< 100 bytes or no speech). Restarting listener turn.');
          if (this.isVoiceModeActive) {
            setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 200);
          }
          return;
        }

        // Process audio turn
        this.isProcessing = true;
        callbacks.onStateChange('thinking');
        this.turnTimings.speechEnd = Date.now();

        await this.processAudioTurn(audioBlob, callbacks, activeConversationId);
      };

      this.mediaRecorder.start(100);
    } catch (err: any) {
      this.isListening = false;
      this.isVoiceModeActive = false;
      console.error('[VoiceV3] Microphone access error:', err);
      callbacks.onStateChange('error');
      if (callbacks.onError) callbacks.onError(err.message || 'Microphone access denied.');
    }
  }

  private startVAD(callbacks: VoiceCallbacks, activeConversationId?: string | null): void {
    if (!this.audioStream) return;

    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      source.connect(this.analyserNode);

      const bufferLength = this.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.stopVAD();

      this.vadInterval = window.setInterval(() => {
        if (!this.analyserNode || !this.isListening) return;

        this.analyserNode.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avgVolume = sum / bufferLength;

        const activeThreshold = this.isSpeaking
          ? VoiceRecognitionService.BARGE_IN_THRESHOLD
          : VoiceRecognitionService.SILENCE_THRESHOLD;

        // Speech Activity Check
        if (avgVolume > activeThreshold) {
          if (this.isSpeaking) {
            this.turnTimings.interruptDetected = Date.now();
            console.log('[INTERRUPT] detected type=STOP_SPEAKING (Barge-in VAD)');
            this.stopSpeech();
            this.turnTimings.ttsStopped = Date.now();
            callbacks.onStateChange('interrupted');
          }

          if (!this.hasSpokenInCurrentTurn) {
            this.hasSpokenInCurrentTurn = true;
            console.log('[VOICE CAPTURE] User speech detected by VAD.');
          }
          this.silenceStartTimestamp = null;
        } else if (this.hasSpokenInCurrentTurn) {
          if (this.silenceStartTimestamp === null) {
            this.silenceStartTimestamp = Date.now();
          } else if (Date.now() - this.silenceStartTimestamp > VoiceRecognitionService.SILENCE_DURATION_MS) {
            console.log(`[VOICE CAPTURE] Natural silence detected (${VoiceRecognitionService.SILENCE_DURATION_MS}ms). Finalizing turn.`);
            this.silenceStartTimestamp = null;
            this.stopMediaRecorder();
          }
        }
      }, 50);
    } catch (err) {
      console.warn('[VoiceV3] VAD setup warning:', err);
    }
  }

  private stopVAD(): void {
    if (this.vadInterval !== null) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
  }

  private stopMediaRecorder(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (err) {
        console.warn('[VoiceV3] Error stopping MediaRecorder:', err);
      }
    }
  }

  private async processAudioTurn(audioBlob: Blob, callbacks: VoiceCallbacks, activeConversationId?: string | null): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'speech.webm');
      if (activeConversationId) {
        formData.append('conversation_id', activeConversationId);
      }

      console.log(`[VOICE CAPTURE] Uploading turn audio (${audioBlob.size} bytes)...`);
      const response = await fetch('/api/v1/voice/transcribe', {
        method: 'POST',
        body: formData,
      });

      console.log(`[VOICE CAPTURE] Server response status=${response.status}`);
      this.turnTimings.sttDone = Date.now();

      if (response.ok) {
        const data = await response.json();

        // Handle STT Infrastructure Error response
        if (data?.success === false) {
          const errDetail = data?.message || 'Speech recognition unavailable.';
          console.warn(`[VoiceV3] STT Infrastructure Error: ${data?.error_type} - ${errDetail}`);
          this.isProcessing = false;
          callbacks.onStateChange('error');
          if (callbacks.onError) callbacks.onError(`Speech Error (${data?.error_type}): ${errDetail}`);
          if (callbacks.onTTSStatus) callbacks.onTTSStatus(`STT Error: ${data?.error_type}`);
          if (this.isVoiceModeActive) {
            setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 1500);
          }
          return;
        }

        if (data?.ignored) {
          console.log('[VoiceV3] Turn ignored by AttentionEngine.');
          this.isProcessing = false;
          if (this.isVoiceModeActive) {
            setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 200);
          }
          return;
        }

        const transcript = data?.transcription?.text || '';
        const agentResponseObj = data?.agent_response || {};
        const agentReply = agentResponseObj.message || '';
        const usedConvId = agentResponseObj.conversation_id || activeConversationId;
        const usedModel = agentResponseObj.model || 'jarvis-voice';
        const audioB64 = data?.tts_audio_b64 || '';
        const stopTTSRequested = data?.agent_response?.stop_tts || false;

        this.turnTimings.agentDone = Date.now();

        if (stopTTSRequested) {
          console.log('[INTERRUPT] current_goal_cancelled stop_tts=true');
          this.stopSpeech();
        }

        if (transcript) {
          console.log(`[VoiceV3] STT Transcript: "${transcript}"`);
          if (callbacks.onTranscript) callbacks.onTranscript(transcript);
        }

        if (agentReply) {
          console.log('[TTS DEBUG] response_text_received=true');
          if (callbacks.onAgentResponse) {
            callbacks.onAgentResponse(transcript, agentReply, usedConvId, usedModel);
          }
        }

        if (audioB64 && (this.isVoiceModeActive || this.isProcessing) && !stopTTSRequested) {
          this.turnTimings.ttsStart = Date.now();
          console.log(`[TTS DEBUG] audio_bytes=${audioB64.length}`);
          await this.playAudioBase64(audioB64, callbacks, usedConvId);
        } else {
          this.isProcessing = false;
          if (this.isVoiceModeActive) {
            setTimeout(() => this.startTurnListening(callbacks, usedConvId), 200);
          }
        }
      } else {
        console.warn('[TTS DEBUG] Transcribe endpoint HTTP error:', response.status);
        this.isProcessing = false;
        callbacks.onStateChange('error');
        if (callbacks.onError) callbacks.onError(`HTTP ${response.status} error from transcription server.`);
        if (this.isVoiceModeActive) {
          setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 1000);
        }
      }
    } catch (err: any) {
      console.error('[TTS DEBUG] Turn processing error:', err);
      this.isProcessing = false;
      callbacks.onStateChange('error');
      if (callbacks.onError) callbacks.onError(err.message || 'Error processing audio turn.');
      if (this.isVoiceModeActive) {
        setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 1000);
      }
    }
  }

  private playAudioBlob(blob: Blob, callbacks?: VoiceCallbacks, activeConversationId?: string | null): Promise<void> {
    return new Promise((resolve) => {
      this.stopSpeech();

      try {
        this.currentObjectUrl = URL.createObjectURL(blob);
        const audio = new Audio(this.currentObjectUrl);
        this.currentAudioElement = audio;

        audio.muted = false;
        audio.volume = 1.0;

        audio.onplaying = () => {
          this.isSpeaking = true;
          if (callbacks) callbacks.onStateChange('speaking');
          this.turnTimings.audioPlaybackStarted = Date.now();

          const totalLatency = this.turnTimings.audioPlaybackStarted - this.turnTimings.speechEnd;
          const agentLatency = this.turnTimings.agentDone - this.turnTimings.sttDone;
          const ttsLatency = this.turnTimings.audioPlaybackStarted - this.turnTimings.ttsStart;

          console.log(`[TTS DEBUG] playback_started=true total_latency_ms=${totalLatency}ms (agent_latency=${agentLatency}ms, tts_latency=${ttsLatency}ms)`);
        };

        const cleanupAndFinish = () => {
          this.isSpeaking = false;
          this.isProcessing = false;
          if (this.currentObjectUrl) {
            URL.revokeObjectURL(this.currentObjectUrl);
            this.currentObjectUrl = null;
          }
          this.currentAudioElement = null;

          if (this.isVoiceModeActive) {
            console.log('[TTS DEBUG] playback_ended=true. Resuming LISTENING for next turn.');
            setTimeout(() => this.startTurnListening(callbacks!, activeConversationId), 200);
          } else {
            if (callbacks) callbacks.onStateChange('idle');
          }
          resolve();
        };

        audio.onended = () => {
          cleanupAndFinish();
        };

        audio.onerror = (e) => {
          console.warn('[TTS DEBUG] Playback error:', e);
          if (callbacks?.onTTSStatus) callbacks.onTTSStatus('TTS playback failed');
          cleanupAndFinish();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[TTS DEBUG] Play error:', err);
            if (callbacks?.onTTSStatus) callbacks.onTTSStatus('SPEAKER ACCESS REQUIRED');
            cleanupAndFinish();
          });
        }
      } catch (err) {
        console.warn('[TTS DEBUG] Playback exception:', err);
        this.isSpeaking = false;
        this.isProcessing = false;
        if (this.isVoiceModeActive && callbacks) {
          setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 200);
        }
        resolve();
      }
    });
  }

  private playAudioBase64(b64Data: string, callbacks: VoiceCallbacks, activeConversationId?: string | null): Promise<void> {
    try {
      const binaryString = window.atob(b64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes.buffer], { type: 'audio/mpeg' });
      return this.playAudioBlob(blob, callbacks, activeConversationId);
    } catch (err) {
      console.warn('[TTS DEBUG] Base64 decode error:', err);
      this.isSpeaking = false;
      this.isProcessing = false;
      if (this.isVoiceModeActive) {
        setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 200);
      }
      return Promise.resolve();
    }
  }

  stopSpeech(): void {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (err) {
        // Ignore
      }
      this.currentAudioElement = null;
    }

    if (this.currentObjectUrl) {
      try {
        URL.revokeObjectURL(this.currentObjectUrl);
      } catch (err) {
        // Ignore
      }
      this.currentObjectUrl = null;
    }

    this.isSpeaking = false;
    console.log('[TTS DEBUG] playback_stopped=true');
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
