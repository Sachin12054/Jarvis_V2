import React, { useEffect, useRef } from 'react';

export const BrainMeshCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animId: number;

    const points = Array.from({ length: 70 }, () => {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const r = 40 + Math.random() * 8;
      return {
        x: r * Math.sin(v) * Math.cos(u),
        y: r * Math.sin(v) * Math.sin(u) * 0.7,
        z: r * Math.cos(v),
      };
    });

    const render = () => {
      time += 0.015;
      const { width, height } = canvas;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#ff7700';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';

      const projected = points.map((p) => {
        const rotY = p.x * Math.cos(time) - p.z * Math.sin(time);
        const rotZ = p.x * Math.sin(time) + p.z * Math.cos(time);
        const scale = 180 / (180 + rotZ);
        return {
          x: cx + rotY * scale,
          y: cy + p.y * scale,
          scale,
        };
      });

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

      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} width={220} height={120} className="w-full h-[120px]" />;
};
