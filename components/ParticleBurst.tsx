"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

// Particle burst effect — golden sparks rising upward and fading
export function ParticleBurst({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    // Spawn particles from random positions along the bottom
    function spawn() {
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = height + 10;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6; // mostly upward
        const speed = 0.3 + Math.random() * 0.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 80 + Math.random() * 80,
          size: 1 + Math.random() * 2.5,
          hue: 35 + Math.random() * 20, // golden range
        });
      }
    }

    let spawnTimer = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      spawnTimer++;
      if (spawnTimer >= 8) {
        spawn();
        spawnTimer = 0;
      }

      // Update + draw
      particles = particles.filter((p) => p.life < p.maxLife);

      for (const p of particles) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.005; // slight upward acceleration (float)
        p.vx *= 0.998; // gentle drift

        const alpha = 1 - p.life / p.maxLife;
        const fadeIn = Math.min(1, p.life / 10);
        const opacity = alpha * fadeIn * 0.7;

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 80%, 55%, ${opacity * 0.3})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 70%, 45%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
