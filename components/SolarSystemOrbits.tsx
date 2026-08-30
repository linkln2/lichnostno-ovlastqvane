"use client";

import { useEffect, useRef } from "react";

// Realistic solar system orbits behind the holy caduceus
export function SolarSystemOrbits({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let time = 0;
    let orbitRadii: number[] = [];
    let stars: { x: number; y: number; size: number; alpha: number }[] = [];

    const orbits = [
      { speed: 0.02, size: 3.5, color: "#60a5fa", trail: 8 },
      { speed: 0.014, size: 5, color: "#fbbf24", trail: 10 },
      { speed: 0.01, size: 5.5, color: "#3b82f6", trail: 12 },
      { speed: 0.0075, size: 4, color: "#f97316", trail: 14 },
      { speed: 0.004, size: 8, color: "#d2b48c", trail: 18 },
      { speed: 0.0028, size: 6.5, color: "#facc15", trail: 22 },
      { speed: 0.0018, size: 4.5, color: "#67e8f9", trail: 26 },
    ];

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      cy = height / 2;

      const maxR = Math.min(width, height) / 2 - 20;
      orbitRadii = orbits.map((_, i) => 30 + (maxR - 30) * ((i + 1) / orbits.length));

      // Regenerate stars
      stars = [];
      for (let i = 0; i < 80; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.5 + Math.random() * 1.2,
          alpha: 0.2 + Math.random() * 0.5,
        });
      }
    }

    resize();
    window.addEventListener("resize", resize);

    function drawDashedOrbit(r: number) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.setLineDash([3, 5]);
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function drawCenterSun() {
      if (!ctx) return;
      const sunR = Math.min(width, height) * 0.045;
      // Outer glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 3);
      gradient.addColorStop(0, "rgba(251, 191, 36, 0.5)");
      gradient.addColorStop(0.5, "rgba(251, 191, 36, 0.12)");
      gradient.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Sun body
      const body = ctx.createRadialGradient(cx - sunR * 0.3, cy - sunR * 0.3, 0, cx, cy, sunR);
      body.addColorStop(0, "#fef3c7");
      body.addColorStop(0.5, "#fbbf24");
      body.addColorStop(1, "#d97706");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
      ctx.fill();
    }

    function hexToRgba(hex: string, alpha: number) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function drawPlanet(
      angle: number,
      r: number,
      size: number,
      color: string,
      trail: number,
    ) {
      if (!ctx) return;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      // Orbit trail
      for (let i = 0; i < trail; i++) {
        const tAngle = angle - i * 0.025;
        const tx = cx + Math.cos(tAngle) * r;
        const ty = cy + Math.sin(tAngle) * r;
        const alpha = (1 - i / trail) * 0.35;
        ctx.fillStyle = hexToRgba(color, alpha);
        ctx.beginPath();
        ctx.arc(tx, ty, size * (1 - i / (trail * 1.5)), 0, Math.PI * 2);
        ctx.fill();
      }

      // Glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3.5);
      gradient.addColorStop(0, hexToRgba(color, 0.5));
      gradient.addColorStop(0.5, hexToRgba(color, 0.18));
      gradient.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet body
      const body = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
      body.addColorStop(0, "#ffffff");
      body.addColorStop(0.4, color);
      body.addColorStop(1, color);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Stars
      for (const star of stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      drawCenterSun();

      // Orbits
      for (const r of orbitRadii) {
        drawDashedOrbit(r);
      }

      // Planets
      for (let i = 0; i < orbits.length; i++) {
        const o = orbits[i];
        const r = orbitRadii[i];
        const angle = time * o.speed;
        drawPlanet(angle, r, o.size, o.color, o.trail);
      }

      time++;
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
