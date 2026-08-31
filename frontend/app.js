/**
 * JARVIS Engine — Interactive Central Orb & Real-Time SSE Stream Runtime
 * Strictly aligned with attached JARVIS HUD reference image.
 */

// State Enumeration
const JARVISState = {
  IDLE: "idle",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
};

/* ==========================================================================
   1. SINGLE CENTRAL JARVIS ORB CANVAS RENDERER
   ========================================================================== */
class OrbRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.currentState = JARVISState.IDLE;
    this.time = 0;
    this.audioAmplitude = 0;

    // Orb Colors per State
    this.colorSchemes = {
      [JARVISState.IDLE]: { core: "#00f0ff", outer: "rgba(0, 240, 255, 0.25)", accent: "#38bdf8" },
      [JARVISState.LISTENING]: { core: "#00aaff", outer: "rgba(0, 170, 255, 0.4)", accent: "#00ffff" },
      [JARVISState.THINKING]: { core: "#ff7700", outer: "rgba(0, 240, 255, 0.3)", accent: "#ffaa00" },
      [JARVISState.SPEAKING]: { core: "#00ffaa", outer: "rgba(0, 255, 170, 0.4)", accent: "#00f0ff" },
    };

    // Particle List for Holographic Ring
    this.particles = [];
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 80 + Math.random() * 40,
        speed: 0.005 + Math.random() * 0.015,
        size: 1 + Math.random() * 2,
      });
    }

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setState(newState) {
    if (Object.values(JARVISState).includes(newState)) {
      this.currentState = newState;
    }
  }

  setAudioAmplitude(amp) {
    this.audioAmplitude = amp;
  }

  animate() {
    this.time += 0.02;
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    const scheme = this.colorSchemes[this.currentState] || this.colorSchemes[JARVISState.IDLE];
    const isThinking = this.currentState === JARVISState.THINKING;
    const isListening = this.currentState === JARVISState.LISTENING;
    const isSpeaking = this.currentState === JARVISState.SPEAKING;

    // Amplitude reaction
    const ampBoost = this.audioAmplitude * 25;
    const pulseRadius = 90 + Math.sin(this.time * 2) * 5 + (isListening || isSpeaking ? ampBoost : 0);

    // 1. Outer Radial Aura
    const bgGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, pulseRadius + 70);
    bgGlow.addColorStop(0, scheme.outer);
    bgGlow.addColorStop(0.6, isThinking ? "rgba(255, 119, 0, 0.15)" : "rgba(0, 240, 255, 0.08)");
    bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bgGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseRadius + 70, 0, Math.PI * 2);
    ctx.fill();

    // 2. Concentric Holographic Outer Rings
    ctx.save();
    ctx.translate(cx, cy);

    // Ring 1 - Slow Outer Ring
    ctx.rotate(this.time * (isThinking ? 0.8 : 0.3));
    ctx.strokeStyle = scheme.accent;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, pulseRadius + 30, (pulseRadius + 30) * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Ring 2 - Counter Rotating Inner Ring
    ctx.rotate(-this.time * (isThinking ? 1.5 : 0.6));
    ctx.strokeStyle = isThinking ? "#ff7700" : "rgba(0, 240, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, pulseRadius + 15, (pulseRadius + 15) * 0.75, Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();

    // Ring 3 - Equatorial Ring
    ctx.rotate(this.time * 0.4);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(0, 0, pulseRadius + 5, pulseRadius + 5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    // 3. Central Glowing Energetic Orb Sphere
    const orbGlow = ctx.createRadialGradient(cx - 15, cy - 15, 5, cx, cy, pulseRadius);
    orbGlow.addColorStop(0, "#ffffff");
    orbGlow.addColorStop(0.35, scheme.core);
    orbGlow.addColorStop(0.7, isThinking ? "#ff5500" : "#0055ff");
    orbGlow.addColorStop(1, "rgba(0, 10, 30, 0.8)");

    ctx.fillStyle = orbGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    // Core Highlight Edge
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Orbital Particles
    ctx.fillStyle = scheme.accent;
    this.particles.forEach((p) => {
      p.angle += p.speed * (isThinking ? 2.5 : 1);
      const px = cx + Math.cos(p.angle) * p.radius;
      const py = cy + Math.sin(p.angle) * (p.radius * 0.5);

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(this.animate);
  }
}

/* ==========================================================================
   2. SIDEBAR 3D PARTICLE BRAIN CANVAS RENDERER
   ========================================================================== */
class BrainMeshRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.time = 0;
    this.points = [];

    // Generate hemisphere brain particle points
    for (let i = 0; i < 70; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const r = 40 + Math.random() * 8;
      this.points.push({
        x: r * Math.sin(v) * Math.cos(u),
        y: r * Math.sin(v) * Math.sin(u) * 0.7,
        z: r * Math.cos(v),
      });
    }

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate() {
    this.time += 0.015;
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#ff7700";
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";

    const projected = this.points.map((p) => {
      const rotY = p.x * Math.cos(this.time) - p.z * Math.sin(this.time);
      const rotZ = p.x * Math.sin(this.time) + p.z * Math.cos(this.time);
      const scale = 180 / (180 + rotZ);
      return {
        x: cx + rotY * scale,
        y: cy + p.y * scale,
        scale: scale,
      };
    });

    // Draw connecting neural lines
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 32) {
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    projected.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8 * p.scale, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(this.animate);
  }
}

/* ==========================================================================
   3. AUDIO WAVEFORM CANVAS RENDERER
   ========================================================================== */
class WaveformRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.time = 0;
    this.active = false;
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setActive(active) {
    this.active = active;
  }

  animate() {
    this.time += 0.05;
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = this.active ? "#00ffaa" : "rgba(0, 240, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const bars = 48;
    const spacing = width / bars;

    for (let i = 0; i < bars; i++) {
      const x = i * spacing;
      const h = this.active
        ? Math.sin(this.time + i * 0.3) * 14 + Math.random() * 8
        : Math.sin(this.time + i * 0.2) * 4 + 2;

      ctx.moveTo(x, cy - h / 2);
      ctx.lineTo(x, cy + h / 2);
    }

    ctx.stroke();
    requestAnimationFrame(this.animate);
  }
}

/* ==========================================================================
   4. VOICE CONTROLLER (Browser SpeechRecognition Abstraction)
   ========================================================================== */
class VoiceController {
  constructor(onSpeechResult, onStateChange) {
    this.onSpeechResult = onSpeechResult;
    this.onStateChange = onStateChange;
    this.recognition = null;
    this.isListening = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStateChange(JARVISState.LISTENING);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          this.onSpeechResult(transcript);
        }
      };

      this.recognition.onerror = (err) => {
        console.warn("[VoiceController] Speech recognition error:", err);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  toggleListening() {
    if (!this.recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn("[VoiceController] Could not start recognition:", err);
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.onStateChange(JARVISState.IDLE);
    }
  }
}

/* ==========================================================================
   5. REAL-TIME SSE STREAM CLIENT & MAIN APP ORCHESTRATION
   ========================================================================== */
class JarvisStreamClient {
  constructor() {
    this.baseUrl = window.location.origin.startsWith("http") ? window.location.origin : "http://127.0.0.1:8000";
    this.conversationId = null;
    this.abortController = null;
    this.isGenerating = false;
  }

  async sendStream(message, handlers) {
    const { onStart, onChunk, onDone, onError } = handlers;

    if (this.isGenerating) return;
    this.isGenerating = true;
    this.abortController = new AbortController();

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          conversation_id: this.conversationId,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        let errText = `HTTP Error ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error) errText = errData.error;
        } catch (_) {}
        throw new Error(errText);
      }

      onStart();

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // Retain incomplete tail line

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line || !line.startsWith("data: ")) continue;

          const dataStr = line.slice(6).trim();
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);
            if (data.conversation_id) {
              this.conversationId = data.conversation_id;
            }

            if (data.done) {
              onDone(data);
              break;
            }

            if (data.chunk) {
              onChunk(data.chunk, data.model, this.conversationId);
            }
          } catch (jsonErr) {
            console.warn("[JARVIS Stream] JSON parse error:", jsonErr);
          }
        }
      }

      if (buffer.trim().startsWith("data: ")) {
        const dataStr = buffer.trim().slice(6).trim();
        if (dataStr) {
          try {
            const data = JSON.parse(dataStr);
            if (data.done) onDone(data);
            else if (data.chunk) onChunk(data.chunk, data.model, this.conversationId);
          } catch (_) {}
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("[JARVIS Stream] Aborted by user");
        onDone({ aborted: true });
      } else {
        onError(err.message || "Connection to backend failed.");
      }
    } finally {
      this.isGenerating = false;
      this.abortController = null;
    }
  }

  stop() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}

/* ==========================================================================
   DOM BOOTSTRAP
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const orbRenderer = new OrbRenderer("jarvisOrbCanvas");
  new BrainMeshRenderer("brainCanvas");
  const waveformRenderer = new WaveformRenderer("waveformCanvas");

  const streamClient = new JarvisStreamClient();

  // Elements
  const topActiveModel = document.getElementById("topActiveModel");
  const sidebarModelName = document.getElementById("sidebarModelName");
  const orbStateTitle = document.getElementById("orbStateTitle");
  const orbStateModel = document.getElementById("orbStateModel");
  const stateDots = document.getElementById("stateDots");
  const chatMessages = document.getElementById("chatMessages");
  const cmdInput = document.getElementById("cmdInput");
  const sendBtn = document.getElementById("sendBtn");
  const stopBtn = document.getElementById("stopBtn");
  const micBtn = document.getElementById("micBtn");

  // State Preview Cards
  const stateCards = {
    [JARVISState.IDLE]: document.getElementById("cardIdle"),
    [JARVISState.LISTENING]: document.getElementById("cardListening"),
    [JARVISState.THINKING]: document.getElementById("cardThinking"),
    [JARVISState.SPEAKING]: document.getElementById("cardSpeaking"),
  };

  function updateJARVISState(newState, modelName = null) {
    orbRenderer.setState(newState);
    waveformRenderer.setActive(newState === JARVISState.SPEAKING || newState === JARVISState.LISTENING);

    // Update orb state text
    orbStateTitle.textContent = newState.toUpperCase();
    orbStateTitle.className = `state-title ${newState}`;

    if (newState === JARVISState.THINKING) {
      stateDots.style.display = "flex";
    } else {
      stateDots.style.display = "none";
    }

    if (modelName) {
      const upperModel = modelName.toUpperCase();
      topActiveModel.textContent = upperModel;
      sidebarModelName.textContent = upperModel;
      orbStateModel.textContent = modelName;
    }

    // Highlight active state preview card at bottom of center panel
    Object.keys(stateCards).forEach((key) => {
      if (stateCards[key]) {
        stateCards[key].classList.toggle("active", key === newState);
      }
    });
  }

  // Voice Controller Setup
  const voiceController = new VoiceController(
    (speechText) => {
      cmdInput.value = speechText;
      handleSendMessage();
    },
    (voiceState) => {
      updateJARVISState(voiceState);
      if (micBtn) {
        micBtn.classList.toggle("listening", voiceState === JARVISState.LISTENING);
      }
    }
  );

  if (micBtn) {
    micBtn.addEventListener("click", () => voiceController.toggleListening());
  }

  // State Card Clicks for Manual State Inspection
  Object.keys(stateCards).forEach((stateKey) => {
    if (stateCards[stateKey]) {
      stateCards[stateKey].addEventListener("click", () => {
        if (!streamClient.isGenerating) {
          updateJARVISState(stateKey);
        }
      });
    }
  });

  // Tab Nav Clicks
  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      navBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Input Auto-Height
  cmdInput.addEventListener("input", () => {
    cmdInput.style.height = "auto";
    cmdInput.style.height = `${Math.min(cmdInput.scrollHeight, 80)}px`;
  });

  cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  sendBtn.addEventListener("click", handleSendMessage);
  stopBtn.addEventListener("click", () => streamClient.stop());

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getCurrentTimeString() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function handleSendMessage() {
    const text = cmdInput.value.trim();
    if (!text || streamClient.isGenerating) return;

    // Append User Message Card
    appendUserCard(text);

    cmdInput.value = "";
    cmdInput.style.height = "auto";

    // Set Orb to THINKING State
    updateJARVISState(JARVISState.THINKING);

    // Toggle Input Buttons
    sendBtn.disabled = true;
    stopBtn.disabled = false;

    // Create Single Assistant Card Element
    const assistantCard = createAssistantCard();
    chatMessages.appendChild(assistantCard.row);
    scrollToBottom();

    streamClient.sendStream(text, {
      onStart: () => {},
      onChunk: (chunk, model) => {
        if (model) {
          updateJARVISState(JARVISState.THINKING, model);
        }
        // Append chunk to the single assistant card
        assistantCard.contentElem.textContent += chunk;
        scrollToBottom();
      },
      onDone: (data) => {
        sendBtn.disabled = false;
        stopBtn.disabled = true;
        updateJARVISState(JARVISState.IDLE, data.model);

        // Remove cursor caret
        if (assistantCard.cursorElem) {
          assistantCard.cursorElem.remove();
        }

        // Render Markdown tables / formatting if present
        renderFormattedContent(assistantCard.contentElem);
      },
      onError: (errMsg) => {
        sendBtn.disabled = false;
        stopBtn.disabled = true;
        updateJARVISState(JARVISState.IDLE);
        if (assistantCard.cursorElem) assistantCard.cursorElem.remove();
        assistantCard.contentElem.innerHTML = `<span style="color: #ff5555;">⚠️ ${errMsg}</span>`;
      },
    });
  }

  function appendUserCard(text) {
    const row = document.createElement("div");
    row.className = "chat-card user";
    row.innerHTML = `
      <div class="card-header">
        <span class="card-author">YOU</span>
        <span class="card-time">${getCurrentTimeString()}</span>
      </div>
      <div class="card-content"></div>
    `;
    row.querySelector(".card-content").textContent = text;
    chatMessages.appendChild(row);
  }

  function createAssistantCard() {
    const row = document.createElement("div");
    row.className = "chat-card assistant";
    row.innerHTML = `
      <div class="card-header">
        <span class="card-author">JARVIS</span>
        <span class="card-time">${getCurrentTimeString()}</span>
      </div>
      <div class="card-content"></div>
      <span class="blinking-cursor"></span>
    `;

    return {
      row: row,
      contentElem: row.querySelector(".card-content"),
      cursorElem: row.querySelector(".blinking-cursor"),
    };
  }

  function renderFormattedContent(elem) {
    const rawText = elem.textContent;
    // Format simple markdown table if detected
    if (rawText.includes("|")) {
      const lines = rawText.split("\n");
      let inTable = false;
      let htmlAcc = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("|") && line.endsWith("|")) {
          if (!inTable) {
            inTable = true;
            htmlAcc.push("<table>");
          }
          const cells = line.split("|").slice(1, -1).map((c) => c.trim());
          if (line.includes("---")) continue; // Skip separator line

          const tag = htmlAcc.length === 1 ? "th" : "td";
          htmlAcc.push("<tr>" + cells.map((c) => `<${tag}>${c}</${tag}>`).join("") + "</tr>");
        } else {
          if (inTable) {
            inTable = false;
            htmlAcc.push("</table>");
          }
          htmlAcc.push(line);
        }
      }
      if (inTable) htmlAcc.push("</table>");
      elem.innerHTML = htmlAcc.join("<br>");
    }
  }

  // Initial State Setup
  updateJARVISState(JARVISState.IDLE, "gemma-3-4b:latest");
});
