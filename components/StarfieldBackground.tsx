"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  flashTimer: number;
  color: string;      // star tint
  glowColor: string;  // glow tint
};

type Comet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  headColor: string;
  tailColor: string;
};

// Star color palette — mostly white, some tinted
const STAR_COLORS = [
  { color: "255, 255, 255", glow: "200, 210, 255" }, // white-blue (most common)
  { color: "255, 255, 255", glow: "200, 210, 255" },
  { color: "255, 255, 255", glow: "200, 210, 255" },
  { color: "255, 255, 255", glow: "200, 210, 255" },
  { color: "255, 240, 200", glow: "255, 200, 120" }, // warm yellow
  { color: "200, 220, 255", glow: "120, 160, 255" }, // blue
  { color: "255, 200, 200", glow: "255, 120, 120" }, // red-orange
  { color: "220, 200, 255", glow: "160, 120, 255" }, // purple
  { color: "200, 255, 220", glow: "100, 255, 160" }, // green-teal
];

// Comet color palettes
const COMET_COLORS = [
  { head: "255, 255, 240", tail: "200, 180, 255" }, // white-purple
  { head: "255, 240, 200", tail: "255, 160, 80" },  // amber
  { head: "200, 220, 255", tail: "100, 160, 255" }, // blue
  { head: "255, 200, 220", tail: "255, 100, 160" }, // pink
  { head: "220, 255, 220", tail: "100, 255, 160" }, // green
];

// Cosmic background: milky way, colored twinkling stars, occasional flashes + comets
export function StarfieldBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let comets: Comet[] = [];
    let time = 0;
    let cometCooldown = 600; // ~10s until first comet at 60fps

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.floor((width * height) / 5500), 220);
      stars = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const milkyWayDist = milkyWayDistance(x, y);
        const inMilkyWay = milkyWayDist < 80;
        const milkyWayBoost = inMilkyWay ? 1.4 + (1 - milkyWayDist / 80) * 0.6 : 1;
        const palette = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

        stars.push({
          x,
          y,
          r: (Math.random() * 1.2 + 0.3) * milkyWayBoost,
          baseAlpha: (0.12 + Math.random() * 0.45) * milkyWayBoost,
          twinkleSpeed: 0.3 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          flashTimer: 0,
          color: palette.color,
          glowColor: palette.glow,
        });
      }
    }

    function milkyWayDistance(x: number, y: number): number {
      const angle = -0.35;
      const cx = width * 0.5;
      const cy = height * 0.45;
      const dx = x - cx;
      const dy = y - cy;
      return Math.abs(dx * Math.sin(angle) - dy * Math.cos(angle));
    }

    function drawMilkyWay() {
      if (!ctx) return;
      const angle = -0.35;
      const cx = width * 0.5;
      const cy = height * 0.45;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      const bandWidth = 180;
      const gradient = ctx.createLinearGradient(0, -bandWidth, 0, bandWidth);
      gradient.addColorStop(0, "rgba(60, 40, 100, 0)");
      gradient.addColorStop(0.3, "rgba(80, 50, 130, 0.04)");
      gradient.addColorStop(0.5, "rgba(120, 80, 160, 0.07)");
      gradient.addColorStop(0.7, "rgba(80, 50, 130, 0.04)");
      gradient.addColorStop(1, "rgba(60, 40, 100, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(-width, -bandWidth, width * 2, bandWidth * 2);

      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 120);
      coreGrad.addColorStop(0, "rgba(200, 180, 255, 0.05)");
      coreGrad.addColorStop(1, "rgba(200, 180, 255, 0)");
      ctx.fillStyle = coreGrad;
      ctx.fillRect(-150, -150, 300, 300);

      ctx.restore();
    }

    function spawnComet() {
      const fromLeft = Math.random() > 0.5;
      const speed = 3 + Math.random() * 3;
      const angle = fromLeft
        ? (Math.PI / 4) + (Math.random() - 0.5) * 0.3
        : (3 * Math.PI / 4) + (Math.random() - 0.5) * 0.3;
      const palette = COMET_COLORS[Math.floor(Math.random() * COMET_COLORS.length)];

      comets.push({
        x: fromLeft ? -50 : width + 50,
        y: Math.random() * height * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 80 + Math.random() * 40,
        size: 1.5 + Math.random() * 1,
        headColor: palette.head,
        tailColor: palette.tail,
      });
    }

    function drawComet(c: Comet) {
      if (!ctx) return;
      const alpha = c.life < 10 ? c.life / 10 : c.life > c.maxLife - 15 ? (c.maxLife - c.life) / 15 : 1;

      // Tail
      const tailLen = 60;
      const tailX = c.x - c.vx * tailLen / 4;
      const tailY = c.y - c.vy * tailLen / 4;
      const gradient = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(${c.headColor}, ${0.7 * alpha})`);
      gradient.addColorStop(0.5, `rgba(${c.tailColor}, ${0.2 * alpha})`);
      gradient.addColorStop(1, `rgba(${c.tailColor}, 0)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = c.size;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Head glow
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size * 4);
      glow.addColorStop(0, `rgba(${c.headColor}, ${0.6 * alpha})`);
      glow.addColorStop(1, `rgba(${c.headColor}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = `rgba(${c.headColor}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      drawMilkyWay();

      // Stars
      for (const s of stars) {
        let alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(time * 0.001 * s.twinkleSpeed + s.phase));

        if (s.flashTimer > 0) {
          alpha = Math.min(1, alpha + s.flashTimer / 30);
          s.flashTimer--;
        } else if (Math.random() < 0.0002) {
          // slightly lower flash chance
          s.flashTimer = 30;
        }

        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Colored glow for brighter/flashing stars
        if (s.r > 1 || s.flashTimer > 0) {
          const glowAlpha = (s.flashTimer > 0 ? 0.3 : 0.08) * alpha;
          ctx.fillStyle = `rgba(${s.glowColor}, ${glowAlpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * (s.flashTimer > 0 ? 5 : 3), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Comets — longer intervals: every ~15-30 seconds
      cometCooldown--;
      if (cometCooldown <= 0 && comets.length < 2) {
        spawnComet();
        cometCooldown = 900 + Math.random() * 900; // ~15-30s at 60fps
      }

      comets = comets.filter((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.life++;
        drawComet(c);
        return c.life < c.maxLife && c.x > -100 && c.x < width + 100 && c.y < height + 100;
      });

      time++;
      rafRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
