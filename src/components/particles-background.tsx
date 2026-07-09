"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient floating particles background — adds a premium, alive feel
 * matching the crypto-app aesthetic the user uploaded.
 *
 * Renders soft glowing dots that drift slowly upward, with subtle
 * horizontal sway. Particle color follows the active accent theme by
 * reading the `data-theme` attribute on <html>.
 */
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let lastTheme = "";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Particle = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
      phase: number;
      tint: 0 | 1; // 0 = primary accent, 1 = secondary
    };

    function getColor(tint: 0 | 1): { core: string; glow: string } {
      const theme = document.documentElement.getAttribute("data-theme") || "orange";
      if (theme === "blue") {
        return tint === 0
          ? { core: "rgba(96, 165, 250, ", glow: "rgba(96, 165, 250, " } // blue
          : { core: "rgba(103, 232, 249, ", glow: "rgba(103, 232, 249, " }; // cyan
      }
      // orange theme
      return tint === 0
        ? { core: "rgba(251, 146, 60, ", glow: "rgba(251, 146, 60, " } // orange
        : { core: "rgba(253, 186, 116, ", glow: "rgba(253, 186, 116, " }; // amber
    }

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
      spawn();
    }

    function spawn() {
      const count = Math.min(40, Math.floor((width * height) / 40000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2.4 + 0.6,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -(Math.random() * 0.22 + 0.05),
          a: Math.random() * 0.35 + 0.08,
          phase: Math.random() * Math.PI * 2,
          tint: Math.random() < 0.5 ? 0 : 1,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const currentTheme = document.documentElement.getAttribute("data-theme") || "orange";
      if (currentTheme !== lastTheme) lastTheme = currentTheme;

      for (const p of particles) {
        p.x += p.vx + Math.sin(p.phase) * 0.06;
        p.y += p.vy;
        p.phase += 0.012;
        // wrap
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const { core, glow } = getColor(p.tint);
        const glowRadius = p.r * 6;

        // Soft glow halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, `${glow}${p.a * 0.6})`);
        grad.addColorStop(1, `${glow}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = `${core}${Math.min(1, p.a * 2.5)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.85 }}
    />
  );
}
