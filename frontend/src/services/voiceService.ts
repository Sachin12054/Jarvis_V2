import { JarvisState } from '../types/jarvis';

export interface VoiceCallbacks {
  onStateChange: (state: JarvisState) => void;
  onTranscript?: (transcript: string) => void;
  onAgentResponse?: (userText: string, agentReply: string, conversationId?: string, model?: string) => void;
  onError?: (error: string) => void;
  onTTSStatus?: (status: string) => void;
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'thinking' | 'speaking' | 'interrupting' | 'error';

interface AudioQueueItem {
  turnId: string;
  b64Data: string;
  text: string;
}

export class VoiceRecognitionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;

  // Web Audio Context & Analyser
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private vadInterval: number | null = null;
  private isAudioUnlocked = false;

  // Pre-roll Ring Buffer
  private preRollBuffer: Float32Array[] = [];
  private static readonly PRE_ROLL_MAX_FRAMES = 22; // ~350ms at 60fps analysis

  // VAD & Turn Finalization Constants
  private static readonly SILENCE_HANGOVER_MS = 1200; // 1.2s continuous silence completes turn
  private static readonly MIN_SPEECH_DURATION_MS = 500; // 0.5s minimum speech before turn completion
  private static readonly SAFETY_MAX_UTTERANCE_MS = 30000; // 30s maximum utterance duration limit
  private static readonly BARGE_IN_GUARD_MS = 600; // 600ms post-finalization guard window

  // State Management & Turn Tracking
  private isVoiceModeActive = false;
  private currentState: VoiceState = 'idle';
  private activeTurnId: string = '';
  private activeCaptureId: string = '';
  private activeAbortController: AbortController | null = null;

  // Audio Playback Queue
  private audioQueue: AudioQueueItem[] = [];
  private isPlayingQueue = false;

  // Adaptive VAD Calibration Parameters & Debouncing
  private noiseFloor = 8.0; // Out of 255
  private speechThreshold = 18.0;
  private silenceThreshold = 10.0;
  private silenceStartTimestamp: number | null = null;
  private speechStartTimestamp: number | null = null;
  private hasSpokenInCurrentTurn = false;
  private turnStartTimestamp = 0;
  private lastTurnFinalizedTimestamp = 0;
  private consecutiveSpeechFrames = 0;

  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  isVoiceMode(): boolean {
    return this.isVoiceModeActive;
  }

  getCurrentState(): VoiceState {
    return this.currentState;
  }

  private setVoiceState(state: VoiceState, callbacks?: VoiceCallbacks): void {
    this.currentState = state;
    if (callbacks?.onStateChange) {
      let jarvisState: JarvisState = 'idle';
      if (state === 'listening' || state === 'interrupting') jarvisState = 'listening';
      else if (state === 'processing' || state === 'thinking') jarvisState = 'thinking';
      else if (state === 'speaking') jarvisState = 'speaking';
      else if (state === 'error') jarvisState = 'error';

      callbacks.onStateChange(jarvisState);
    }
  }

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

  async unlockBrowserAudio(): Promise<boolean> {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      silentAudio.volume = 0.01;
      await silentAudio.play().catch(() => {});

      this.isAudioUnlocked = true;
      console.log('[AUDIO] Browser AudioContext unlocked successfully.');
      return true;
    } catch (err) {
      console.warn('[AUDIO] Audio unlock warning:', err);
      return false;
    }
  }

  async startVoiceMode(callbacks: VoiceCallbacks, activeConversationId?: string | null): Promise<void> {
    if (this.isVoiceModeActive) return;

    this.isVoiceModeActive = true;
    this.stopSpeech();
    await this.unlockBrowserAudio();

    console.log('[VOICE STATE] Continuous Voice Mode activated.');
    await this.startTurnListening(callbacks, activeConversationId);
  }

  stopVoiceMode(): void {
    console.log('[VOICE STATE] Continuous Voice Mode deactivated.');
    this.isVoiceModeActive = false;
    this.stopSpeech();
    this.cancelActiveTurn('deactivate');
    this.stopVAD();
    this.stopMediaRecorder();

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((t) => t.stop());
      this.audioStream = null;
    }
    this.setVoiceState('idle');
  }

  stopSpeech(): void {
    this.audioQueue = [];
    this.isPlayingQueue = false;

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (err) {}
      this.currentAudioElement = null;
    }
  }

  private cancelActiveTurn(reason: string = 'user_action'): void {
    if (this.activeTurnId) {
      const turnToCancel = this.activeTurnId;
      console.log(`[VOICE CANCEL] reason='${reason}' turn_id='${turnToCancel}' aborting fetch and canceling turn...`);

      if (this.activeAbortController) {
        this.activeAbortController.abort();
        this.activeAbortController = null;
      }

      fetch('/api/v1/voice/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turn_id: turnToCancel }),
      }).catch((err) => console.warn('[VOICE CANCEL] Cancel POST warning:', err));
    }
  }

  private async startTurnListening(callbacks: VoiceCallbacks, activeConversationId?: string | null): Promise<void> {
    if (!this.isVoiceModeActive) return;

    this.activeTurnId = `turn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.activeCaptureId = `cap_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const currentTurnId = this.activeTurnId;
    const currentCaptureId = this.activeCaptureId;

    this.hasSpokenInCurrentTurn = false;
    this.silenceStartTimestamp = null;
    this.speechStartTimestamp = null;
    this.turnStartTimestamp = Date.now();
    this.consecutiveSpeechFrames = 0;
    this.preRollBuffer = [];

    try {
      if (!this.audioStream || !this.audioStream.active) {
        this.audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 16000,
          },
        });
      }

      const dataChunks: Blob[] = [];
      const mimeType = this.getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;

      const recorder = new MediaRecorder(this.audioStream, options);
      this.mediaRecorder = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          dataChunks.push(event.data);
        }
      };

      recorder.onstart = () => {
        if (this.activeTurnId !== currentTurnId) return;
        this.setVoiceState('listening', callbacks);
        console.log(`[VOICE VAD] capture_started=true capture_id='${currentCaptureId}' turn_id='${currentTurnId}' mime='${mimeType || 'default'}'`);
        this.startVAD(callbacks, activeConversationId);
      };

      recorder.onstop = async () => {
        if (this.activeTurnId !== currentTurnId) {
          console.log(`[VOICE VAD] Stale recorder.onstop ignored for turn_id='${currentTurnId}'`);
          return;
        }

        this.stopVAD();
        const recordingMime = mimeType || 'audio/webm';
        const finalBlob = new Blob(dataChunks, { type: recordingMime });
        const speechDurationMs = Date.now() - (this.speechStartTimestamp || this.turnStartTimestamp);

        console.log(`[VOICE VAD] capture_finished=true capture_id='${currentCaptureId}' blob_bytes=${finalBlob.size} speech_duration_ms=${speechDurationMs}`);

        if (finalBlob.size < 300 || !this.hasSpokenInCurrentTurn) {
          console.log('[VOICE VAD] Audio empty or near-zero energy. Restarting listener turn.');
          if (this.isVoiceModeActive) {
            setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 150);
          }
          return;
        }

        this.setVoiceState('processing', callbacks);
        await this.processAudioTurnStream(finalBlob, currentCaptureId, currentTurnId, callbacks, activeConversationId);
      };

      recorder.start(100);
    } catch (err: any) {
      console.error('[VOICE VAD] Microphone access error:', err);
      this.setVoiceState('error', callbacks);
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

      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 512;
      this.analyserNode.smoothingTimeConstant = 0.4;
      source.connect(this.analyserNode);

      const bufferLength = this.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let calibrationFrames = 0;
      let noiseSum = 0;

      this.vadInterval = window.setInterval(() => {
        if (!this.analyserNode) return;

        this.analyserNode.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // 1. Calibration (first 10 frames ~150ms)
        if (calibrationFrames < 10) {
          noiseSum += average;
          calibrationFrames++;
          if (calibrationFrames === 10) {
            this.noiseFloor = Math.max(5.0, noiseSum / 10.0);
            this.speechThreshold = Math.max(16.0, this.noiseFloor * 3.2);
            this.silenceThreshold = Math.max(8.0, this.speechThreshold * 0.55);
            console.log(`[VOICE VAD CALIBRATION] noise_floor=${this.noiseFloor.toFixed(1)} speech_threshold=${this.speechThreshold.toFixed(1)} silence_threshold=${this.silenceThreshold.toFixed(1)}`);
          }
          return;
        }

        // 2. Safety Maximum Utterance Duration Check (30 seconds limit)
        const elapsedSinceStart = Date.now() - this.turnStartTimestamp;
        if (elapsedSinceStart >= VoiceRecognitionService.SAFETY_MAX_UTTERANCE_MS && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          console.log(`[VOICE VAD] turn_finalized reason=safety_max_duration elapsed_ms=${elapsedSinceStart} capture_id='${this.activeCaptureId}'`);
          this.lastTurnFinalizedTimestamp = Date.now();
          this.stopMediaRecorder();
          return;
        }

        const isSpeakingNow = average > this.speechThreshold;

        // 3. BARGE-IN DETECTION DURING SPEAKING / THINKING / PROCESSING
        const timeSinceFinalized = Date.now() - this.lastTurnFinalizedTimestamp;
        const isOutsideGuardWindow = timeSinceFinalized > VoiceRecognitionService.BARGE_IN_GUARD_MS;

        if (isSpeakingNow && isOutsideGuardWindow && (this.currentState === 'speaking' || ((this.currentState === 'thinking' || this.currentState === 'processing') && timeSinceFinalized > 1000))) {
          console.log(`[VOICE CANCEL] reason=barge_in state='${this.currentState}' rms=${average.toFixed(1)} > threshold=${this.speechThreshold.toFixed(1)}`);
          
          this.stopSpeech();
          this.cancelActiveTurn('barge_in');
          this.setVoiceState('interrupting', callbacks);

          if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.stopMediaRecorder();
          }
          if (this.isVoiceModeActive) {
            setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 50);
          }
          return;
        }

        // 4. Standard Turn VAD Logic during LISTENING state
        if (isSpeakingNow) {
          this.consecutiveSpeechFrames++;
          if (this.consecutiveSpeechFrames >= 2) {
            if (!this.hasSpokenInCurrentTurn) {
              this.hasSpokenInCurrentTurn = true;
              this.speechStartTimestamp = Date.now();
              console.log(`[VOICE VAD] speech_started capture_id='${this.activeCaptureId}' timestamp_ms=${this.speechStartTimestamp}`);
            } else {
              const speechElapsed = Date.now() - (this.speechStartTimestamp || this.turnStartTimestamp);
              if (speechElapsed > 0 && speechElapsed % 3000 < 30) {
                console.log(`[VOICE VAD] speech_continues elapsed_ms=${speechElapsed} capture_id='${this.activeCaptureId}'`);
              }
            }
            this.silenceStartTimestamp = null;
          }
        } else {
          this.consecutiveSpeechFrames = 0;
          if (average < this.silenceThreshold && this.hasSpokenInCurrentTurn) {
            const speechDuration = Date.now() - (this.speechStartTimestamp || this.turnStartTimestamp);
            if (speechDuration >= VoiceRecognitionService.MIN_SPEECH_DURATION_MS) {
              if (!this.silenceStartTimestamp) {
                this.silenceStartTimestamp = Date.now();
                console.log(`[VOICE VAD] silence_started threshold=${this.silenceThreshold.toFixed(1)} capture_id='${this.activeCaptureId}'`);
              } else {
                const silenceDuration = Date.now() - this.silenceStartTimestamp;
                if (silenceDuration >= VoiceRecognitionService.SILENCE_HANGOVER_MS) {
                  console.log(`[VOICE VAD] turn_finalized silence_ms=${silenceDuration} speech_duration_ms=${speechDuration} capture_id='${this.activeCaptureId}'`);
                  this.lastTurnFinalizedTimestamp = Date.now();
                  this.stopMediaRecorder();
                }
              }
            }
          }
        }
      }, 20);
    } catch (err) {
      console.warn('[VOICE VAD] Audio Context Analyser setup warning:', err);
    }
  }

  private stopVAD(): void {
    if (this.vadInterval !== null) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
    if (this.analyserNode) {
      try { this.analyserNode.disconnect(); } catch (e) {}
      this.analyserNode = null;
    }
  }

  private stopMediaRecorder(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (err) {}
      this.mediaRecorder = null;
    }
  }

  private async processAudioTurnStream(
    audioBlob: Blob,
    captureId: string,
    turnId: string,
    callbacks: VoiceCallbacks,
    activeConversationId?: string | null,
    retryCount: number = 0
  ): Promise<void> {
    if (this.activeTurnId !== turnId) return;

    this.activeAbortController = new AbortController();
    const signal = this.activeAbortController.signal;

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'speech.webm');
      formData.append('turn_id', turnId);
      formData.append('capture_id', captureId);
      if (activeConversationId) {
        formData.append('conversation_id', activeConversationId);
      }

      console.log(`[VOICE STREAM] POST /api/v1/voice/stream capture_id='${captureId}' turn_id='${turnId}' size=${audioBlob.size} bytes...`);
      const response = await fetch('/api/v1/voice/stream', {
        method: 'POST',
        body: formData,
        signal,
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errJson = await response.json().catch(() => ({}));
          if (errJson.error_code === 'AUDIO_INVALID' && errJson.retryable && retryCount === 0) {
            console.warn(`[AUDIO RETRY] capture_id='${captureId}' audio_invalid reported. Retrying capture turn once...`);
            return this.startTurnListening(callbacks, activeConversationId);
          }
        }
        throw new Error(`HTTP ${response.status} error from voice stream server.`);
      }

      if (!response.body) throw new Error('Response body missing from stream endpoint.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let currentTranscript = '';

      while (true) {
        if (this.activeTurnId !== turnId) {
          console.log(`[VOICE STREAM] Stale turn reading aborted for turn_id='${turnId}'`);
          reader.cancel();
          break;
        }

        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const cleanLine = line.replace(/^data:\s*/, '').trim();
          if (!cleanLine) continue;

          try {
            const event = JSON.parse(cleanLine);
            if (event.turn_id && event.turn_id !== this.activeTurnId) continue;

            if (event.type === 'transcript') {
              currentTranscript = event.text || '';
              if (currentTranscript && callbacks.onTranscript) {
                callbacks.onTranscript(currentTranscript);
              }
            } else if (event.type === 'text_delta') {
              accumulatedText += event.text;
              this.setVoiceState('speaking', callbacks);
              if (callbacks.onAgentResponse) {
                callbacks.onAgentResponse(currentTranscript, accumulatedText, activeConversationId || undefined, 'qwen3-test:latest');
              }
            } else if (event.type === 'audio_chunk') {
              if (this.isVoiceModeActive) {
                this.enqueueAudioChunk(turnId, event.audio_b64, event.text, callbacks, activeConversationId);
              }
            } else if (event.type === 'interrupted') {
              console.log(`[VOICE STREAM] Turn interrupted event received for turn_id='${turnId}'`);
              break;
            } else if (event.type === 'done') {
              console.log(`[VOICE STREAM] Turn finished total_ms=${event.total_ms || 0}ms turn_id='${turnId}'`);
            }
          } catch (e) {
            console.warn('[VOICE STREAM] Event parse error:', e);
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log(`[VOICE STREAM] Fetch aborted for turn_id='${turnId}'`);
        return;
      }
      console.error('[VOICE STREAM] Turn processing error:', err);
      if (this.activeTurnId === turnId) {
        this.setVoiceState('error', callbacks);
        if (callbacks.onError) callbacks.onError(err.message || 'Error processing streaming audio turn.');
        if (this.isVoiceModeActive) {
          setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 1000);
        }
      }
    } finally {
      this.activeAbortController = null;
    }
  }

  private enqueueAudioChunk(turnId: string, b64Data: string, text: string, callbacks: VoiceCallbacks, activeConversationId?: string | null): void {
    if (turnId !== this.activeTurnId) return;

    this.audioQueue.push({ turnId, b64Data, text });
    if (!this.isPlayingQueue) {
      this.playNextInQueue(callbacks, activeConversationId);
    }
  }

  private async playNextInQueue(callbacks: VoiceCallbacks, activeConversationId?: string | null): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlayingQueue = false;
      if (this.currentState === 'speaking') {
        this.setVoiceState('listening', callbacks);
      }
      if (this.isVoiceModeActive) {
        setTimeout(() => this.startTurnListening(callbacks, activeConversationId), 20);
      }
      return;
    }

    const item = this.audioQueue.shift()!;
    if (item.turnId !== this.activeTurnId || !this.isVoiceModeActive) {
      this.isPlayingQueue = false;
      return;
    }

    this.isPlayingQueue = true;
    this.setVoiceState('speaking', callbacks);
    await this.playAudioBase64(item.b64Data, callbacks);
    this.playNextInQueue(callbacks, activeConversationId);
  }

  private playAudioBase64(b64Data: string, callbacks?: VoiceCallbacks): Promise<void> {
    return new Promise((resolve) => {
      try {
        const binary = atob(b64Data);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array.buffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        this.currentAudioElement = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          this.currentAudioElement = null;
          resolve();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          this.currentAudioElement = null;
          resolve();
        };

        audio.play().catch((err) => {
          console.warn('[AUDIO PLAY] Audio element play error:', err);
          URL.revokeObjectURL(url);
          this.currentAudioElement = null;
          resolve();
        });
      } catch (err) {
        console.error('[AUDIO PLAY] Exception:', err);
        resolve();
      }
    });
  }

  async speakDiagnosticTestText(text: string, callbacks?: VoiceCallbacks): Promise<void> {
    try {
      if (callbacks?.onTTSStatus) callbacks.onTTSStatus('Generating TTS test audio...');
      const response = await fetch('/api/v1/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('TTS test failed.');
      const blob = await response.blob();
      const b64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1] || '');
        };
        reader.readAsDataURL(blob);
      });
      if (callbacks?.onStateChange) callbacks.onStateChange('speaking');
      await this.playAudioBase64(b64, callbacks);
      if (callbacks?.onStateChange) callbacks.onStateChange('idle');
    } catch (err: any) {
      console.warn('[TTS TEST] Speaker test failed:', err);
      if (callbacks?.onStateChange) callbacks.onStateChange('idle');
    }
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();
