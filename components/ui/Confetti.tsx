"use client";

import { useEffect, useRef } from "react";
import { useMode } from "@/components/ModeContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotSpeed: number;
  w: number;
  h: number;
  color: string;
  opacity: number;
}

const PLAY_COLORS = ["#F0609E", "#FFD700", "#FF6B6B", "#A78BFA", "#34D399", "#60A5FA", "#FBBF24", "#FB923C"];
const WORK_COLORS = ["#5BAECC", "#7EC8E3", "#3A8FAD", "#A8D8E8", "#5BAECC", "#B0DCF0"];

export default function Confetti() {
  const { isPlayMode } = useMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const prevPlay = useRef(false);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }

  function runParticles(colors: string[], count: number, isPaper: boolean) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: -10 - Math.random() * 40,
      vx: (Math.random() - 0.5) * (isPaper ? 3 : 7),
      vy: Math.random() * (isPaper ? 2 : 3) + (isPaper ? 1.5 : 2),
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * (isPaper ? 0.07 : 0.18),
      w: isPaper ? Math.random() * 7 + 10 : Math.random() * 10 + 6,
      h: isPaper ? Math.random() * 10 + 14 : Math.random() * 5 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
    }));

    const ctx = canvas.getContext("2d")!;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.08;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height * 0.65) p.opacity -= 0.025;

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (alive) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    clearCanvas();
    rafRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    const wasPlay = prevPlay.current;
    prevPlay.current = isPlayMode;

    if (isPlayMode && !wasPlay) {
      runParticles(PLAY_COLORS, 140, false);
    } else if (!isPlayMode && wasPlay) {
      runParticles(WORK_COLORS, 80, true);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearCanvas();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}
