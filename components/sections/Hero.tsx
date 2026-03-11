"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { siteConfig, disciplines } from "@/data/content";

function scrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Animated gradient orbs
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-100" />

      {/* Blue orb — top right */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(91,174,204,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Cooler orb — bottom left */}
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-48 -left-40 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(91,174,204,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Subtle center warmth */}
      <motion.div
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
        style={{
          background: "radial-gradient(ellipse, rgba(91,174,204,0.05) 0%, transparent 65%)",
          filter: "blur(30px)",
        }}
      />

      {/* Horizon line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, #252118 40%, #5BAECC22 55%, #252118 70%, transparent 100%)" }}
      />
    </div>
  );
}

// ── 8-ball physics bubbles ────────────────────────────────────────────────────

const BUBBLES = [
  { label: "Product",  color: "#5BAECC" }, // teal
  { label: "Growth",   color: "#D4874A" }, // amber
  { label: "Design",   color: "#9B7FD4" }, // violet
  { label: "Strategy", color: "#4A8B6A" }, // green
  { label: "Brand",    color: "#CC5B7A" }, // rose
  { label: "Culture",  color: "#C4A44A" }, // gold
];
const BUBBLE_LABELS = BUBBLES.map((b) => b.label);
const R = 48; // radius px
const FRICTION = 0.987;
const RESTITUTION = 0.60;

interface BallState {
  x: number; y: number;
  vx: number; vy: number;
  rotX: number; rotY: number; // cumulative 3D rotation in degrees
  dragging: boolean;
  dragOffsetX: number; dragOffsetY: number;
}

const RAD_TO_DEG = 180 / Math.PI;

function FloatingBubbles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elRefs   = useRef<(HTMLDivElement | null)[]>([]); // outer wrapper (translate)
  const sphereRefs = useRef<(HTMLDivElement | null)[]>([]); // inner sphere (rotate)
  const balls = useRef<BallState[]>([]);
  const rafId = useRef<number | null>(null);
  const ptrHistory = useRef<{ x: number; y: number; t: number }[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const seeds = [
      { x: W * 0.08, y: H * 0.18 },
      { x: W * 0.84, y: H * 0.13 },
      { x: W * 0.80, y: H * 0.48 },
      { x: W * 0.87, y: H * 0.78 },
      { x: W * 0.10, y: H * 0.75 },
      { x: W * 0.54, y: H * 0.88 },
    ];

    balls.current = seeds.map(({ x, y }) => ({
      x, y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      rotX: Math.random() * 360,
      rotY: Math.random() * 360,
      dragging: false,
      dragOffsetX: 0, dragOffsetY: 0,
    }));

    // Set initial DOM positions
    balls.current.forEach((b, i) => {
      const el = elRefs.current[i];
      const sp = sphereRefs.current[i];
      if (el) el.style.transform = `translate(${b.x - R}px, ${b.y - R}px)`;
      if (sp) sp.style.transform = `perspective(200px) rotateX(${b.rotX}deg) rotateY(${b.rotY}deg)`;
    });

    const tick = () => {
      const cW = container.clientWidth;
      const cH = container.clientHeight;
      const bs = balls.current;

      for (let i = 0; i < bs.length; i++) {
        if (bs[i].dragging) continue;
        bs[i].vx *= FRICTION;
        bs[i].vy *= FRICTION;
        bs[i].x += bs[i].vx;
        bs[i].y += bs[i].vy;

        // Rolling rotation: angular velocity = linear velocity / R
        bs[i].rotX += (bs[i].vy / R) * RAD_TO_DEG;
        bs[i].rotY -= (bs[i].vx / R) * RAD_TO_DEG;

        // Wall bounce
        if (bs[i].x < R)      { bs[i].x = R;      bs[i].vx =  Math.abs(bs[i].vx) * RESTITUTION; }
        if (bs[i].x > cW - R) { bs[i].x = cW - R; bs[i].vx = -Math.abs(bs[i].vx) * RESTITUTION; }
        if (bs[i].y < R)      { bs[i].y = R;       bs[i].vy =  Math.abs(bs[i].vy) * RESTITUTION; }
        if (bs[i].y > cH - R) { bs[i].y = cH - R;  bs[i].vy = -Math.abs(bs[i].vy) * RESTITUTION; }
      }

      // Ball-ball elastic collisions
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const dx = bs[j].x - bs[i].x;
          const dy = bs[j].y - bs[i].y;
          const distSq = dx * dx + dy * dy;
          const minDist = R * 2;

          if (distSq < minDist * minDist && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) / 2;

            if (!bs[i].dragging) { bs[i].x -= nx * overlap; bs[i].y -= ny * overlap; }
            if (!bs[j].dragging) { bs[j].x += nx * overlap; bs[j].y += ny * overlap; }

            const dvx = bs[i].vx - bs[j].vx;
            const dvy = bs[i].vy - bs[j].vy;
            const dot = dvx * nx + dvy * ny;

            if (dot > 0) {
              const imp = dot * RESTITUTION;
              if (!bs[i].dragging) { bs[i].vx -= imp * nx; bs[i].vy -= imp * ny; }
              if (!bs[j].dragging) { bs[j].vx += imp * nx; bs[j].vy += imp * ny; }
            }
          }
        }
      }

      // Update DOM
      for (let i = 0; i < bs.length; i++) {
        if (!bs[i].dragging) {
          const el = elRefs.current[i];
          const sp = sphereRefs.current[i];
          if (el) el.style.transform = `translate(${bs[i].x - R}px, ${bs[i].y - R}px)`;
          if (sp) sp.style.transform = `perspective(200px) rotateX(${bs[i].rotX}deg) rotateY(${bs[i].rotY}deg)`;
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    // Staggered fade-in
    BUBBLE_LABELS.forEach((_, i) => {
      setTimeout(() => {
        const el = elRefs.current[i];
        if (el) el.style.opacity = "1";
      }, 900 + i * 130);
    });

    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  const onPointerDown = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const b = balls.current[i];
    b.dragging = true;
    b.vx = 0;
    b.vy = 0;
    b.dragOffsetX = (e.clientX - rect.left) - b.x;
    b.dragOffsetY = (e.clientY - rect.top)  - b.y;
    ptrHistory.current = [{ x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() }];
    const el = elRefs.current[i];
    if (el) { el.style.zIndex = "50"; el.style.cursor = "grabbing"; }
  };

  const onPointerMove = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const b = balls.current[i];
    if (!b.dragging) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;

    // Spin from drag motion
    const dx = lx - b.dragOffsetX - b.x;
    const dy = ly - b.dragOffsetY - b.y;
    b.rotX += (dy / R) * RAD_TO_DEG;
    b.rotY -= (dx / R) * RAD_TO_DEG;

    b.x = lx - b.dragOffsetX;
    b.y = ly - b.dragOffsetY;
    ptrHistory.current.push({ x: lx, y: ly, t: performance.now() });
    if (ptrHistory.current.length > 6) ptrHistory.current.shift();

    const el = elRefs.current[i];
    const sp = sphereRefs.current[i];
    if (el) el.style.transform = `translate(${b.x - R}px, ${b.y - R}px)`;
    if (sp) sp.style.transform = `perspective(200px) rotateX(${b.rotX}deg) rotateY(${b.rotY}deg)`;
  };

  const onPointerUp = (i: number) => (_e: React.PointerEvent<HTMLDivElement>) => {
    const b = balls.current[i];
    if (!b.dragging) return;
    b.dragging = false;

    const pts = ptrHistory.current;
    if (pts.length >= 2) {
      const first = pts[0];
      const last  = pts[pts.length - 1];
      const dt = (last.t - first.t) / 1000;
      if (dt > 0.01) {
        const cap = 28;
        b.vx = Math.max(-cap, Math.min(cap, (last.x - first.x) / dt / 60));
        b.vy = Math.max(-cap, Math.min(cap, (last.y - first.y) / dt / 60));
      }
    }
    ptrHistory.current = [];

    const el = elRefs.current[i];
    if (el) { el.style.zIndex = "20"; el.style.cursor = "grab"; }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 hidden lg:block"
      style={{ zIndex: 15, pointerEvents: "none" }}
    >
      {BUBBLES.map(({ label, color }, i) => (
        <div
          key={label}
          ref={(el) => { elRefs.current[i] = el; }}
          onPointerDown={onPointerDown(i)}
          onPointerMove={onPointerMove(i)}
          onPointerUp={onPointerUp(i)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: R * 2,
            height: R * 2,
            opacity: 0,
            transition: "opacity 0.5s ease",
            cursor: "grab",
            pointerEvents: "auto",
            touchAction: "none",
            userSelect: "none",
            zIndex: 20,
          }}
        >
          {/* 3D rotating sphere surface — color stripe rolls with ball */}
          <div
            ref={(el) => { sphereRefs.current[i] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `
                linear-gradient(135deg,
                  ${color}44 0%,
                  ${color}22 25%,
                  transparent 45%,
                  transparent 55%,
                  ${color}11 75%,
                  transparent 100%
                ),
                radial-gradient(circle at 58% 62%, rgba(0,0,0,0.55) 0%, transparent 60%),
                #141210
              `,
              boxShadow: `inset 0 0 0 1px ${color}33, 0 6px 28px rgba(0,0,0,0.6), 0 0 20px ${color}22`,
            }}
          />

          {/* Fixed specular highlight — stays in screen space */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `
                radial-gradient(circle at 30% 26%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 28%, transparent 50%),
                radial-gradient(circle at 68% 72%, ${color}18 0%, transparent 40%)
              `,
              pointerEvents: "none",
            }}
          />

          {/* Label — always faces camera */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: color,
                textAlign: "center",
                lineHeight: 1.2,
                textShadow: `0 0 12px ${color}66`,
              }}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const PHRASES = [
  "people love.",
  "people use.",
  "people share.",
  "people obsess over.",
  "people come back to.",
  "people talk about.",
  "people build with.",
  "people remember.",
  "people can't ignore.",
  "people care about.",
];

// Headline line — slides up one by one
function HeadlineLine({ text, delay, italic }: { text: string; delay: number; italic?: boolean }) {
  return (
    <div className="overflow-visible pb-2">
      <motion.span
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: [0.43, 0.195, 0.02, 1] }}
        className={`block font-display text-[13vw] sm:text-[10vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[6.5vw] leading-[1.05] tracking-[-0.03em] font-bold ${
          italic ? "italic text-[#5BAECC]" : "text-[#F5EFE8]"
        }`}
      >
        {text}
      </motion.span>
    </div>
  );
}

// Rotating second line — 3D drum roll downward
function RotatingPhrase({ delay }: { delay: number }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setAnimating(true);
    }, (delay + 1.5) * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!animating) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [animating]);

  return (
    <div className="overflow-visible pb-2" style={{ perspective: "600px" }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: [0.43, 0.195, 0.02, 1] }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            initial={animating ? { rotateX: -90, opacity: 0 } : false}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "block", transformOrigin: "50% 50%" }}
            className="font-display text-[13vw] sm:text-[10vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[6.5vw] leading-[1.05] tracking-[-0.03em] font-bold italic text-[#5BAECC]"
          >
            {PHRASES[index]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const lines = siteConfig.headline.split("\n");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <HeroBackground />

      {/* 8-ball physics bubbles */}
      <FloatingBubbles />

      {/* Handwriting note */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.8, ease: [0.43, 0.195, 0.02, 1] }}
        className="absolute hidden lg:block pointer-events-none"
        style={{ left: "68%", top: "60%", zIndex: 20 }}
      >
        <Image
          src="/Landing Page/Handwriting Note.png"
          alt="Handwriting note"
          width={600}
          height={300}
          className="w-[340px] h-auto"
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#5BAECC]" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#8B8178]">
            {siteConfig.role}
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mb-10">
          <HeadlineLine text={lines[0]} delay={0.35} />
          <RotatingPhrase delay={0.50} />
        </div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="max-w-xl text-base md:text-lg text-[#8B8178] leading-relaxed mb-12"
        >
          {siteConfig.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => scrollTo("#projects")}
            className="group relative overflow-hidden px-7 py-3.5 rounded-full bg-[#5BAECC] text-[#0A0908] text-sm font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_0_40px_rgba(91,174,204,0.35)]"
          >
            <span className="relative z-10">View Work</span>
            <motion.div
              className="absolute inset-0 bg-[#7ECDE6]"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            <span className="relative z-10 ml-2 group-hover:translate-x-0.5 transition-transform duration-200 inline-block">↓</span>
          </button>

          <button
            onClick={() => window.dispatchEvent(new Event("openResume"))}
            className="px-7 py-3.5 rounded-full border border-[#252118] text-[#F5EFE8]/70 text-sm font-medium tracking-wide hover:border-[#5BAECC]/50 hover:text-[#F5EFE8] hover:bg-[#141210] transition-all duration-300"
          >
            Resume ↗
          </button>
        </motion.div>

        {/* Discipline tags — mobile strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex flex-wrap gap-2 lg:hidden"
        >
          {disciplines.map((d) => (
            <span
              key={d}
              className="px-3 py-1.5 rounded-full text-[11px] font-medium border border-[#252118] bg-[#141210]/60 text-[#8B8178]"
            >
              {d}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-[#5BAECC]/60 to-transparent"
        />
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#4A4540]">Scroll</span>
      </motion.div>
    </section>
  );
}
