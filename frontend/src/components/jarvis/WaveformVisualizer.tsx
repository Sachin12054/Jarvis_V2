import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  active: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef<boolean>(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animId: number;

    const render = () => {
      time += 0.05;
      const { width, height } = canvas;
      const cy = height / 2;
      const isActive = activeRef.current;

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = isActive ? '#00ffaa' : 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      const bars = 48;
      const spacing = width / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * spacing;
        const h = isActive
          ? Math.sin(time + i * 0.3) * 14 + Math.random() * 8
          : Math.sin(time + i * 0.2) * 4 + 2;

        ctx.moveTo(x, cy - h / 2);
        ctx.lineTo(x, cy + h / 2);
      }

      ctx.stroke();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full max-w-[480px] h-[40px] flex items-center justify-center my-1.5">
      <canvas ref={canvasRef} width={480} height={40} className="w-full h-full" />
    </div>
  );
};
