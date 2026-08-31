import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { JarvisState } from '../../types/jarvis';

/* ============================================================
   PUBLIC API
   ============================================================ */

export interface JarvisOrbHandle {
  setState: (state: JarvisState) => void;
  connectAudioStream: (stream: MediaStream) => void;
  triggerImpulse: () => void;
}

export interface JarvisOrbProps {
  state?: JarvisState;
  audioAmplitude?: number;
  audioStream?: MediaStream | null;
  className?: string;
  onClick?: () => void;
}

/* ============================================================
   STATE CONFIGS — Tuned for ambient full-screen presentation
   ============================================================ */

interface StateConfig {
  color: THREE.Color;
  radiusScale: number;   // multiplier on base R
  noiseAmp: number;      // fraction of R for noise displacement
  swirlSpeed: number;    // Y-rotation rad/s
  bloomStrength: number;
}

const STATE_CONFIGS: Record<JarvisState, StateConfig> = {
  idle: {
    color: new THREE.Color('#3B82F6'), // Electric Blue
    radiusScale: 1.0,
    noiseAmp: 0.04,
    swirlSpeed: 0.15,
    bloomStrength: 0.55,
  },
  listening: {
    color: new THREE.Color('#1E3A8A'), // Dark Navy / Deep Cyan-Blue
    radiusScale: 0.92,
    noiseAmp: 0.03,
    swirlSpeed: 0.35,
    bloomStrength: 0.6,
  },
  thinking: {
    color: new THREE.Color('#F97316'), // Energetic Amber Orange
    radiusScale: 1.04,
    noiseAmp: 0.10,
    swirlSpeed: 1.2,
    bloomStrength: 0.7,
  },
  acting: {
    color: new THREE.Color('#00F0FF'), // Electric Cyan / Action
    radiusScale: 1.08,
    noiseAmp: 0.12,
    swirlSpeed: 1.5,
    bloomStrength: 0.8,
  },
  speaking: {
    color: new THREE.Color('#4ADE80'), // Light Holographic Emerald Green
    radiusScale: 1.0,
    noiseAmp: 0.06,
    swirlSpeed: 0.25,
    bloomStrength: 0.6,
  },
  interrupted: {
    color: new THREE.Color('#FF6B6B'), // Coral Interrupted
    radiusScale: 0.95,
    noiseAmp: 0.14,
    swirlSpeed: 2.0,
    bloomStrength: 0.75,
  },
  error: {
    color: new THREE.Color('#EF4444'), // Crimson Red Error
    radiusScale: 1.0,
    noiseAmp: 0.15,
    swirlSpeed: 0.1,
    bloomStrength: 0.9,
  },
};

/* ============================================================
   VERTEX SHADER — Controlled Simplex Noise & Audio Wave Sync
   ============================================================ */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uRadiusScale;
  uniform float uNoiseAmp;
  uniform float uSwirlSpeed;
  uniform float uAudioAmp;
  uniform float uState;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uImpulse;
  uniform float uBaseRadius;

  attribute float aPhase;
  attribute float aSize;
  attribute float aBand;

  varying vec3  vColor;
  varying float vAlpha;

  /* ---- Simplex 3-D noise ---- */
  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g, l.zxy);
    vec3 i2 = max(g, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0,i1.z,i2.z,1.0))
             + i.y + vec4(0.0,i1.y,i2.y,1.0))
             + i.x + vec4(0.0,i1.x,i2.x,1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0*x_);
    vec4 x = x_*ns.x + ns.yyyy;
    vec4 y = y_*ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.xxyy;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vec3 dir = normalize(position);
    float baseR = length(position);

    // 1. Noise displacement clamped relative to base radius
    float noiseVal = snoise(dir * 2.5 + vec3(uTime * 0.5));
    float maxDisplacement = uBaseRadius * uNoiseAmp;
    float radOffset = noiseVal * maxDisplacement;

    // 2. Idle breathing & state-dependent waves
    radOffset += sin(uTime * 1.3 + aPhase) * uBaseRadius * 0.02;

    if (uState > 0.5 && uState < 1.5) {
      radOffset += sin(uTime * 10.0 + aPhase * 3.0) * uBaseRadius * 0.015;
    }

    if (uState > 2.5) {
      float bandBoost = mix(uBass, uTreble, aBand);
      float wave = sin(baseR * 5.0 - uTime * 7.0 + aPhase)
                 * (uAudioAmp * 0.15 + bandBoost * 0.1) * uBaseRadius;
      radOffset += wave;
    }

    // Click impulse shockwave
    radOffset += sin(baseR * 8.0 - uTime * 12.0) * uImpulse * uBaseRadius * 0.2;

    // 3. Final radius composition
    float finalR = baseR * uRadiusScale + radOffset;
    vec3 finalPos = dir * finalR;

    // Global floating bobbing
    finalPos.y += sin(uTime * 1.0) * 0.08;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size — depth-scaled, conservatively clamped
    float depthSize = aSize * (90.0 / -mvPosition.z);
    gl_PointSize = clamp(depthSize, 0.8, 6.0);

    vColor = uColor + vec3(noiseVal * 0.04);
    vAlpha = 0.6 + sin(uTime * 2.0 + aPhase) * 0.12;

    if (uState > 1.5 && uState < 2.5) {
      vAlpha *= 0.65 + sin(uTime * 10.0 + aPhase * 6.0) * 0.35;
    }
  }
`;

/* ============================================================
   FRAGMENT SHADER — Additive Glow Point Sprite
   ============================================================ */

const fragmentShader = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float intensity = smoothstep(0.5, 0.0, dist);
    intensity = pow(intensity, 2.0);

    vec3 finalColor = mix(vColor, vec3(1.0), pow(intensity, 4.0) * 0.35);
    gl_FragColor = vec4(finalColor, intensity * vAlpha * 0.5);
  }
`;

/* ============================================================
   FULL-SCREEN AMBIENT ORB COMPONENT
   ============================================================ */

export const JarvisOrb = forwardRef<JarvisOrbHandle, JarvisOrbProps>(
  ({ state = 'idle', audioAmplitude = 0, audioStream = null, className = '', onClick }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animIdRef = useRef<number | null>(null);
    const currentStateRef = useRef<JarvisState>(state);
    const amplitudeRef = useRef<number>(audioAmplitude);

    // Web Audio API
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);

    // Safe state config getter
    const getSafeConfig = (s: JarvisState): StateConfig => {
      return STATE_CONFIGS[s] || STATE_CONFIGS.idle;
    };

    // Lerped uniform values
    const currColorRef = useRef(getSafeConfig(state).color.clone());
    const currRadiusRef = useRef(getSafeConfig(state).radiusScale);
    const currNoiseRef = useRef(getSafeConfig(state).noiseAmp);
    const currSwirlRef = useRef(getSafeConfig(state).swirlSpeed);
    const currBloomRef = useRef(getSafeConfig(state).bloomStrength);
    const impulseRef = useRef(0);

    // Sync prop → ref
    useEffect(() => { currentStateRef.current = state; }, [state]);
    useEffect(() => { amplitudeRef.current = audioAmplitude; }, [audioAmplitude]);

    // Audio helpers
    const connectStreamInternal = (stream: MediaStream) => {
      try {
        if (!audioCtxRef.current) {
          const AC = window.AudioContext || (window as any).webkitAudioContext;
          audioCtxRef.current = new AC();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const src = ctx.createMediaStreamSource(stream);
        const an = ctx.createAnalyser();
        an.fftSize = 128;
        an.smoothingTimeConstant = 0.8;
        src.connect(an);
        analyserRef.current = an;
        dataArrayRef.current = new Uint8Array(an.frequencyBinCount);
      } catch (e) {
        console.warn('[JarvisOrb] Audio error:', e);
      }
    };

    useEffect(() => { if (audioStream) connectStreamInternal(audioStream); }, [audioStream]);

    const triggerImpulseInternal = () => { impulseRef.current = 1.0; };

    useImperativeHandle(ref, () => ({
      setState: (s: JarvisState) => { currentStateRef.current = s; },
      connectAudioStream: (s: MediaStream) => { connectStreamInternal(s); },
      triggerImpulse: () => { triggerImpulseInternal(); },
    }));

    /* --------------------------------------------------------
       THREE.JS FULL-VIEWPORT AMBIENT LAYER SETUP
       -------------------------------------------------------- */
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let w = window.innerWidth;
      let h = window.innerHeight;

      // 1. Scene & Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 200);
      camera.position.set(0, 0, 6.8);

      // 2. WebGL Renderer with Full Viewport & Capped Pixel Ratio
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;
      container.appendChild(renderer.domElement);

      // 3. Post-Processing Bloom Pass
      const composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      renderPass.clearColor = new THREE.Color(0x000000);
      renderPass.clearAlpha = 0;
      composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(w, h),
        0.55,
        0.4,
        0.25
      );
      composer.addPass(bloomPass);

      // 4. OrbitControls — Smooth Interaction on Open Background
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enableZoom = true;
      controls.minDistance = 3.5;
      controls.maxDistance = 18;
      controls.enablePan = true;
      controls.panSpeed = 0.4;
      controls.rotateSpeed = 0.5;
      controls.enableRotate = true;
      controls.autoRotate = false;
      controls.target.set(0, 0, 0);
      controls.update();

      // 5. Fibonacci Outer Shell (4,000 Points)
      const R = 1.5;
      const N = 4000;

      const positions = new Float32Array(N * 3);
      const phasesArr = new Float32Array(N);
      const sizesArr = new Float32Array(N);
      const bandsArr = new Float32Array(N);

      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;

        positions[i * 3]     = Math.cos(theta) * radiusAtY * R;
        positions[i * 3 + 1] = y * R;
        positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * R;

        phasesArr[i] = Math.random() * Math.PI * 2;
        sizesArr[i] = 1.0 + Math.random() * 1.2;
        bandsArr[i] = (y + 1) * 0.5;
      }

      const shellGeo = new THREE.BufferGeometry();
      shellGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      shellGeo.setAttribute('aPhase', new THREE.BufferAttribute(phasesArr, 1));
      shellGeo.setAttribute('aSize', new THREE.BufferAttribute(sizesArr, 1));
      shellGeo.setAttribute('aBand', new THREE.BufferAttribute(bandsArr, 1));

      const uniforms = {
        uTime: { value: 0 },
        uColor: { value: currColorRef.current },
        uRadiusScale: { value: 1.0 },
        uNoiseAmp: { value: 0.04 },
        uSwirlSpeed: { value: 0.15 },
        uAudioAmp: { value: 0 },
        uState: { value: 0 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uTreble: { value: 0 },
        uImpulse: { value: 0 },
        uBaseRadius: { value: R },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
      });

      const orbGroup = new THREE.Group();
      orbGroup.add(new THREE.Points(shellGeo, material));

      // 6. Inner Core Cluster (600 Points)
      const coreN = 600;
      const corePos = new Float32Array(coreN * 3);
      const corePh = new Float32Array(coreN);
      const coreSz = new Float32Array(coreN);
      const coreBn = new Float32Array(coreN);

      for (let i = 0; i < coreN; i++) {
        const u = Math.random(), v = Math.random();
        const t = u * 2 * Math.PI;
        const p = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * R * 0.45;
        corePos[i * 3]     = r * Math.sin(p) * Math.cos(t);
        corePos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
        corePos[i * 3 + 2] = r * Math.cos(p);
        corePh[i] = Math.random() * Math.PI * 2;
        coreSz[i] = 1.0 + Math.random() * 1.5;
        coreBn[i] = Math.random();
      }

      const coreGeo = new THREE.BufferGeometry();
      coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
      coreGeo.setAttribute('aPhase', new THREE.BufferAttribute(corePh, 1));
      coreGeo.setAttribute('aSize', new THREE.BufferAttribute(coreSz, 1));
      coreGeo.setAttribute('aBand', new THREE.BufferAttribute(coreBn, 1));
      orbGroup.add(new THREE.Points(coreGeo, material));

      // 7. HUD Orbiting Reticle Rings
      const ring1N = 180;
      const ring1Pos = new Float32Array(ring1N * 3);
      const ring1Ph = new Float32Array(ring1N);
      const ring1Sz = new Float32Array(ring1N);
      const ring1Bn = new Float32Array(ring1N);
      for (let i = 0; i < ring1N; i++) {
        const a = (i / ring1N) * Math.PI * 2;
        ring1Pos[i * 3]     = Math.cos(a) * R * 1.35;
        ring1Pos[i * 3 + 1] = 0;
        ring1Pos[i * 3 + 2] = Math.sin(a) * R * 1.35;
        ring1Ph[i] = a; ring1Sz[i] = 0.8; ring1Bn[i] = 0.5;
      }
      const ring1Geo = new THREE.BufferGeometry();
      ring1Geo.setAttribute('position', new THREE.BufferAttribute(ring1Pos, 3));
      ring1Geo.setAttribute('aPhase', new THREE.BufferAttribute(ring1Ph, 1));
      ring1Geo.setAttribute('aSize', new THREE.BufferAttribute(ring1Sz, 1));
      ring1Geo.setAttribute('aBand', new THREE.BufferAttribute(ring1Bn, 1));
      const ring1Mesh = new THREE.Points(ring1Geo, material);
      orbGroup.add(ring1Mesh);

      const ring2N = 150;
      const ring2Pos = new Float32Array(ring2N * 3);
      const ring2Ph = new Float32Array(ring2N);
      const ring2Sz = new Float32Array(ring2N);
      const ring2Bn = new Float32Array(ring2N);
      for (let i = 0; i < ring2N; i++) {
        const a = (i / ring2N) * Math.PI * 2;
        ring2Pos[i * 3]     = Math.cos(a) * R * 1.5;
        ring2Pos[i * 3 + 1] = Math.sin(a) * R * 1.5;
        ring2Pos[i * 3 + 2] = 0;
        ring2Ph[i] = a; ring2Sz[i] = 0.9; ring2Bn[i] = 0.8;
      }
      const ring2Geo = new THREE.BufferGeometry();
      ring2Geo.setAttribute('position', new THREE.BufferAttribute(ring2Pos, 3));
      ring2Geo.setAttribute('aPhase', new THREE.BufferAttribute(ring2Ph, 1));
      ring2Geo.setAttribute('aSize', new THREE.BufferAttribute(ring2Sz, 1));
      ring2Geo.setAttribute('aBand', new THREE.BufferAttribute(ring2Bn, 1));
      const ring2Mesh = new THREE.Points(ring2Geo, material);
      ring2Mesh.rotation.x = Math.PI / 3.5;
      ring2Mesh.rotation.y = Math.PI / 6;
      orbGroup.add(ring2Mesh);

      scene.add(orbGroup);

      // Click Impulse Handler
      const handleClick = () => {
        triggerImpulseInternal();
        if (onClick) onClick();
      };
      renderer.domElement.addEventListener('click', handleClick);

      // 8. Animation Render Loop with Visibility Throttle
      const clock = new THREE.Clock();
      const stateMap: Record<JarvisState, number> = {
        idle: 0,
        listening: 1,
        thinking: 2,
        acting: 2,
        speaking: 3,
        interrupted: 1,
        error: 0,
      };

      const animate = () => {
        if (document.visibilityState === 'hidden') return;
        animIdRef.current = requestAnimationFrame(animate);

        const dt = Math.min(clock.getDelta(), 0.033);
        const t = clock.getElapsedTime();
        const target = currentStateRef.current;
        const cfg = getSafeConfig(target);

        const speed = dt * 5.0;
        currColorRef.current.lerp(cfg.color, speed);
        currRadiusRef.current += (cfg.radiusScale - currRadiusRef.current) * speed;
        currNoiseRef.current += (cfg.noiseAmp - currNoiseRef.current) * speed;
        currSwirlRef.current += (cfg.swirlSpeed - currSwirlRef.current) * speed;
        currBloomRef.current += (cfg.bloomStrength - currBloomRef.current) * speed;
        impulseRef.current = Math.max(0, impulseRef.current - dt * 2.5);

        bloomPass.strength = currBloomRef.current;

        orbGroup.rotation.y += currSwirlRef.current * dt;
        ring1Mesh.rotation.y = t * 0.3;
        ring2Mesh.rotation.z = -t * 0.45;

        uniforms.uTime.value = t;
        uniforms.uColor.value.copy(currColorRef.current);
        uniforms.uRadiusScale.value = currRadiusRef.current;
        uniforms.uNoiseAmp.value = currNoiseRef.current;
        uniforms.uSwirlSpeed.value = 0;
        uniforms.uState.value = stateMap[target] ?? 0;
        uniforms.uImpulse.value = impulseRef.current;

        let amp = amplitudeRef.current, bass = 0, mid = 0, treble = 0;
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
          const bins = dataArrayRef.current;
          const len = bins.length;
          let s = 0, bS = 0, mS = 0, tS = 0;
          const bE = Math.floor(len * 0.25), mE = Math.floor(len * 0.65);
          for (let i = 0; i < len; i++) {
            const v = bins[i] / 255;
            s += v;
            if (i < bE) bS += v;
            else if (i < mE) mS += v;
            else tS += v;
          }
          amp = s / len;
          bass = bS / Math.max(1, bE);
          mid = mS / Math.max(1, mE - bE);
          treble = tS / Math.max(1, len - mE);
        } else if (target === 'speaking' || target === 'listening') {
          const tt = t * 5;
          amp = Math.max(0, Math.sin(tt) * 0.3 + Math.cos(tt * 1.7) * 0.25);
          bass = Math.abs(Math.sin(tt * 0.8)) * 0.35;
          mid = Math.abs(Math.cos(tt * 1.4)) * 0.3;
          treble = Math.abs(Math.sin(tt * 2.2)) * 0.2;
        }
        uniforms.uAudioAmp.value = amp;
        uniforms.uBass.value = bass;
        uniforms.uMid.value = mid;
        uniforms.uTreble.value = treble;

        controls.update();
        composer.render();
      };

      animate();

      // 9. Full Window Resize Listener
      const handleResize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        bloomPass.resolution.set(w, h);
      };

      window.addEventListener('resize', handleResize);

      // 10. Document Visibility Listener (Pause render loop when tab is hidden)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          if (animIdRef.current !== null) {
            cancelAnimationFrame(animIdRef.current);
            animIdRef.current = null;
          }
        } else {
          if (animIdRef.current === null) {
            clock.start();
            animate();
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // 11. Cleanup Lifecycle
      return () => {
        if (animIdRef.current !== null) cancelAnimationFrame(animIdRef.current);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        renderer.domElement.removeEventListener('click', handleClick);
        controls.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        shellGeo.dispose();
        coreGeo.dispose();
        ring1Geo.dispose();
        ring2Geo.dispose();
        material.dispose();
        renderer.dispose();
        composer.dispose();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        role="img"
        aria-label={`JARVIS Ambient Full-Screen 3D Orb Background — ${state.toUpperCase()}`}
        className={`fixed inset-0 w-screen h-screen z-0 pointer-events-auto overflow-hidden ${className}`}
        style={{ touchAction: 'none' }}
      />
    );
  }
);

JarvisOrb.displayName = 'JarvisOrb';
