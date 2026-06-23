"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  c: string;
  rot: number;
  vr: number;
  life: number;
}

const COLORS = ["#C9A24B", "#E8CB85", "#37C871", "#E23B49", "#F4F0E6"];

/**
 * Exposes a global `window.lpConfetti(count)` function so any component
 * (slider hitting Day 30, spin wheel win, lead form success, etc.) can
 * trigger the celebration burst without needing shared React state.
 */
export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.rot += p.vr;
        p.life--;
        if (p.life <= 0 || p.y > canvas!.height + 40) {
          particles.splice(i, 1);
          continue;
        }
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.fillStyle = p.c;
        ctx!.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
        ctx!.restore();
      }
      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    }

    (window as any).lpConfetti = (n?: number) => {
      for (let i = 0; i < (n || 120); i++) {
        particlesRef.current.push({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 220,
          y: window.innerHeight / 3,
          vx: (Math.random() - 0.5) * 9,
          vy: Math.random() * -9 - 3,
          s: 6 + Math.random() * 7,
          c: COLORS[~~(Math.random() * COLORS.length)],
          rot: Math.random() * 6,
          vr: (Math.random() - 0.5) * 0.4,
          life: 120,
        });
      }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      delete (window as any).lpConfetti;
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
