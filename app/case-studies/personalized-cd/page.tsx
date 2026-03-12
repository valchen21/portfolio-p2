/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const PURPLE       = "#8B60F0";
const PURPLE_LIGHT = "#AA88F8";

// Back tray: 1628px panel × 1394px tall, 72px spines — all proportional to W=320
const W = 320;
const H = Math.round(320 * 1394 / 1628); // ≈ 274px
const D = Math.round(320 * 72  / 1628); // ≈ 14px

// ─── TOC config ───────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: "overview",    label: "Overview" },
  { id: "inspiration", label: "Inspiration" },
  { id: "process",     label: "Process" },
  { id: "result",      label: "The Result" },
  { id: "reflection",  label: "Reflection" },
];

// ─── Sticky TOC ───────────────────────────────────────────────────────────────
function TableOfContents({ active }: { active: string }) {
  return (
    <nav className="sticky top-28 flex flex-col gap-0.5 w-48 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540] mb-4">
        Contents
      </p>
      {TOC_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex items-center gap-3 py-2 group"
            style={{ textDecoration: "none" }}
          >
            <span
              style={{
                display: "inline-block",
                height: 2,
                width: isActive ? 20 : 8,
                borderRadius: 99,
                background: isActive ? PURPLE_LIGHT : "#3A3530",
                transition: "width 0.25s, background 0.25s",
                flexShrink: 0,
              }}
            />
            <span
              className="text-sm leading-tight transition-colors duration-200"
              style={{ color: isActive ? "#F5EFE8" : "#8B8178" }}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  id,
  children,
  onVisible,
}: {
  id: string;
  children: React.ReactNode;
  onVisible: (id: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -50% 0px" });

  useEffect(() => {
    if (inView) onVisible(id);
  }, [inView, id, onVisible]);

  return (
    <section id={id} ref={ref} className="scroll-mt-28 mb-20">
      {children}
    </section>
  );
}

// ─── Label helper ─────────────────────────────────────────────────────────────
function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <p className="text-[10px] tracking-[0.25em] uppercase mb-5 flex items-center gap-3" style={{ color: PURPLE }}>
      <span style={{ color: "#3A3530" }}>{n}</span>
      {label}
    </p>
  );
}

// ─── Openable CD case ─────────────────────────────────────────────────────────
// Spine: left edge of tray (x=W in scene = pivot of outer rotateY).
// rotateY(-90deg) local + outer rotateY(90deg) = 0deg → faces viewer.
// Spine image = leftmost 72px of CD frame back.png via backgroundSize/Position.
function CDOpenable() {
  const [open, setOpen]       = useState(false);
  const [flipStep, setFlipStep] = useState(0); // 0=front, 1=spine, 2=back

  const ease   = "1s cubic-bezier(0.23, 1, 0.32, 1)";
  const flipY  = flipStep * 90;
  const isBack  = flipStep === 2;
  const isSpine = flipStep === 1;

  const flipLeft  = () => { setOpen(false); setFlipStep(s => Math.max(0, s - 1)); };
  const flipRight = () => { setOpen(false); setFlipStep(s => Math.min(2, s + 1)); };

  // Spine strip: leftmost 72px of the 1772px wide image, scaled to D wide
  const spineScale = Math.round(1772 / 72 * 100); // ≈ 2461%

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      {/* outer flip wrapper */}
      <div style={{ perspective: 4000, perspectiveOrigin: "50% 40%" }}>
        <div style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${flipY}deg)`,
          transition: `transform ${ease}`,
        }}>
          {/*
            Scene is always 2W wide.
            Closed: translate(-W/2) so only the right half (back tray) is centered.
            Open:   translate(0)    so the full 2W open case is centered.
          */}
          <div
            style={{
              position: "relative",
              width: W * 2,
              height: H,
              transformStyle: "preserve-3d",
              overflow: "visible",
              transform: open ? "translateX(0px)" : `translateX(${-W / 2}px)`,
              transition: `transform ${ease}`,
            }}
          >
            {/* Back tray — anchored to the RIGHT half */}
            <div
              style={{
                position: "absolute",
                left: W, top: 0,
                width: W, height: H,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front face of tray (visible when open) — disc */}
              <div style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                borderRadius: 2, overflow: "hidden",
                background: "#0e0c0a",
                boxShadow: "0 0 0 1px rgba(139,96,240,0.25), 0 0 18px rgba(139,96,240,0.15)",
              }}>
                <Image
                  src="/CD/CD Prototype Ver.png"
                  alt="CD disc in tray"
                  width={W} height={H}
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>

              {/* Back face of tray — exterior back, 72px spines cropped */}
              <div style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg) translateZ(1px)",
                borderRadius: 2, overflow: "hidden",
                boxShadow: "0 0 0 1px rgba(139,96,240,0.25), 0 0 18px rgba(139,96,240,0.15)",
              }}>
                <div style={{
                  position: "absolute",
                  width: Math.round(W * 1772 / 1628),
                  height: H,
                  left: -Math.round(W * 72 / 1628),
                  top: 0,
                }}>
                  <Image
                    src="/CD/CD frame back.png"
                    alt="CD back exterior"
                    width={1772} height={1394}
                    style={{ display: "block", width: "100%", height: "100%", objectFit: "fill" }}
                  />
                </div>
              </div>

              {/* Left spine face — visible at outer 90deg (binding) */}
              <div style={{
                position: "absolute",
                left: 0, top: 0,
                width: D, height: H,
                transform: "rotateY(-90deg)",
                transformOrigin: "left 50%",
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                overflow: "hidden",
                backgroundImage: "url('/CD/CD frame back.png')",
                backgroundSize: `${spineScale}% auto`,
                backgroundPosition: "0% 50%",
                backgroundRepeat: "no-repeat",
                boxShadow: "0 0 0 1px rgba(139,96,240,0.25), 0 0 18px rgba(139,96,240,0.15)",
              }} />
            </div>

            {/* Front cover — pivots at its LEFT edge = left:W in the scene */}
            <div
              onClick={() => { if (!isBack && !isSpine) setOpen(o => !o); }}
              style={{
                position: "absolute",
                left: W, top: 0,
                width: W, height: H,
                transformOrigin: "0% 50%",
                transform: open ? "rotateY(-168deg)" : "rotateY(0deg)",
                transition: `transform ${ease}`,
                transformStyle: "preserve-3d",
                cursor: (isBack || isSpine) ? "default" : "pointer",
              }}
            >
              {/* Outer face — front cover art */}
              <div style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                borderRadius: 2, overflow: "hidden",
                background: "#0e0c0a",
                boxShadow: "0 0 0 1px rgba(139,96,240,0.25), 0 0 18px rgba(139,96,240,0.15)",
              }}>
                <Image
                  src="/CD/cd-frame-front.png"
                  alt="CD front cover"
                  width={W} height={H}
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
                  priority
                />
                {!open && !isBack && !isSpine && (
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                    paddingBottom: 12,
                  }}>
                    <span style={{
                      fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)", userSelect: "none",
                    }}>click to open</span>
                  </div>
                )}
              </div>

              {/* Inner face — booklet/tracklist */}
              <div style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: 2, overflow: "hidden",
                background: "#0e0c0a",
                boxShadow: "0 0 0 1px rgba(139,96,240,0.25), 0 0 18px rgba(139,96,240,0.15)",
              }}>
                <Image
                  src="/CD/Tracklist Prototype Ver.png"
                  alt="Inside booklet"
                  width={W} height={H}
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center gap-6" style={{ minWidth: 200, justifyContent: "center" }}>
        {!open && flipStep > 0 ? (
          <button onClick={flipLeft} style={{
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#4A4540", background: "none", border: "none", cursor: "pointer",
            transition: "color 0.2s", width: 50,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#8B8178")}
            onMouseLeave={e => (e.currentTarget.style.color = "#4A4540")}
          >← flip</button>
        ) : !open ? <div style={{ width: 50 }} /> : null}

        <button
          onClick={() => { if (!isBack && !isSpine) setOpen(o => !o); }}
          disabled={isBack || isSpine}
          style={{
            fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
            color: open ? PURPLE_LIGHT : (isBack || isSpine) ? "#252118" : "#4A4540",
            background: "none", border: "none",
            cursor: (isBack || isSpine) ? "default" : "pointer",
            transition: "color 0.3s",
          }}
        >
          {open ? "close" : "open"}
        </button>

        {!open && flipStep < 2 ? (
          <button onClick={flipRight} style={{
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#4A4540", background: "none", border: "none", cursor: "pointer",
            transition: "color 0.2s", width: 50,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#8B8178")}
            onMouseLeave={e => (e.currentTarget.style.color = "#4A4540")}
          >flip →</button>
        ) : !open ? <div style={{ width: 50 }} /> : null}
      </div>
    </div>
  );
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.43, 0.195, 0.02, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── CD Cover (3D CSS box) ────────────────────────────────────────────────────
function CDCover() {
  const cardRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [tiltX,  setTiltX]  = useState(0);
  const [rotY,   setRotY]   = useState(0);
  const [glare,  setGlare]  = useState({ x: 50, y: 50, op: 0 });
  const [scrubbing, setScrubbing] = useState(false);

  const dragStart = useRef({ clientX: 0, rotY: 0 });

  const onScrubStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setScrubbing(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragStart.current = { clientX, rotY };
    e.preventDefault();
  }, [rotY]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!scrubbing || !trackRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const dx      = clientX - dragStart.current.clientX;
      const next = Math.min(360, Math.max(0, dragStart.current.rotY + dx));
      setRotY(next);
    };
    const onUp = () => setScrubbing(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchend",  onUp);
    };
  }, [scrubbing]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (scrubbing || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const py = (e.clientY - rect.top) / rect.height;
    setTiltX((py - 0.5) * -14);
    const px = (e.clientX - rect.left) / rect.width;
    setGlare({ x: px * 100, y: py * 100, op: 0.16 });
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setGlare({ x: 50, y: 50, op: 0 });
  };

  const thumbPct = (rotY / 360) * 100;

  const glareEl = (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.op}), transparent 60%)`,
    }} />
  );

  return (
    <div className="flex flex-col items-center gap-8 py-14">
      {/* 3D card */}
      <div style={{ perspective: 1200 }}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            position: "relative",
            width: W, height: H,
            transformStyle: "preserve-3d",
            transform: `rotateX(${tiltX}deg) rotateY(${rotY}deg)`,
            transition: scrubbing ? "none" : "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
            cursor: "default",
          }}
        >
          {/* FRONT */}
          <div style={{
            position: "absolute", width: W, height: H,
            transform: `translateZ(${D / 2}px)`,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            overflow: "hidden", borderRadius: 2,
          }}>
            <Image src="/CD/cd-frame-front.png?v=2" alt="CD Front" width={W} height={H}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} priority />
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: "linear-gradient(to right, rgba(0,0,0,0.45), transparent)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 14, background: "linear-gradient(to left, rgba(0,0,0,0.45), transparent)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.18)", pointerEvents: "none" }} />
            {glareEl}
          </div>

          {/* BACK */}
          <div style={{
            position: "absolute", width: W, height: H,
            transform: `rotateY(180deg) translateZ(${D / 2}px)`,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            overflow: "hidden", borderRadius: 2,
          }}>
            <Image src="/CD/CD frame back.png?v=2" alt="CD Back" width={W} height={H}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
            {glareEl}
          </div>

          {/* LEFT EDGE */}
          <div style={{
            position: "absolute", left: 0, top: 0, width: D, height: H,
            transform: `rotateY(-90deg) translateZ(${D / 2}px)`,
            backgroundImage: "url('/CD/CD frame back.png')",
            backgroundSize: `${Math.round(100 * 1772 / 72)}% auto`,
            backgroundPosition: "0% center",
            backgroundRepeat: "no-repeat",
          }} />

          {/* RIGHT EDGE */}
          <div style={{
            position: "absolute", left: W - D, top: 0, width: D, height: H,
            transform: `rotateY(90deg) translateZ(${D / 2}px)`,
            backgroundImage: "url('/CD/CD frame back.png')",
            backgroundSize: `${Math.round(100 * 1772 / 72)}% auto`,
            backgroundPosition: "100% center",
            backgroundRepeat: "no-repeat",
          }} />

          {/* TOP EDGE */}
          <div style={{
            position: "absolute", left: 0, top: 0, width: W, height: D,
            transform: `rotateX(90deg) translateZ(${D / 2}px)`,
            background: "linear-gradient(to right, #111018, #1a1628 50%, #111018)",
          }} />

          {/* BOTTOM EDGE */}
          <div style={{
            position: "absolute", left: 0, top: H - D, width: W, height: D,
            transform: `rotateX(-90deg) translateZ(${D / 2}px)`,
            background: "#111018",
          }} />
        </div>
      </div>

      {/* Scrubber */}
      <div className="flex flex-col items-center gap-3" style={{ width: W }}>
        <div className="flex justify-between w-full px-1">
          <span className="text-[10px] tracking-widest uppercase select-none" style={{ color: thumbPct < 50 ? "#8B8178" : "#4A4540" }}>front</span>
          <span className="text-[10px] tracking-widest uppercase select-none" style={{ color: thumbPct > 50 ? "#8B8178" : "#4A4540" }}>back</span>
        </div>

        <div
          ref={trackRef}
          onMouseDown={onScrubStart}
          onTouchStart={onScrubStart}
          style={{
            position: "relative",
            width: "100%",
            height: 32,
            display: "flex",
            alignItems: "center",
            cursor: scrubbing ? "grabbing" : "grab",
            userSelect: "none",
          }}
        >
          <div style={{
            position: "absolute", left: 0, right: 0,
            height: 4,
            background: "#1c1916",
            borderRadius: 99,
            overflow: "hidden",
          }}>
            <div style={{
              width: `${thumbPct}%`,
              height: "100%",
              background: "linear-gradient(to right, #3a2e28, #8B60F0)",
              borderRadius: 99,
              transition: scrubbing ? "none" : "width 0.05s",
            }} />
          </div>

          <div style={{
            position: "absolute",
            left: `calc(${thumbPct}% - 18px)`,
            width: 36, height: 20,
            borderRadius: 99,
            background: "#F5EFE8",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
            transition: scrubbing ? "none" : "left 0.05s",
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 1.5, height: 8, borderRadius: 1, background: "#8B8178", opacity: 0.6 }} />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-[#4A4540] tracking-widest uppercase select-none">drag to rotate</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PersonalizedCDPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const handleVisible = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#F5EFE8]">
      <div className="noise-overlay" aria-hidden="true" />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-0">
        <FadeUp>
          <Link href="/#projects" className="inline-flex items-center gap-2 text-[11px] text-[#4A4540] hover:text-[#8B8178] transition-colors mb-10">
            ← Back to all projects
          </Link>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: PURPLE }}>
            Creative · Product Design
          </p>
        </FadeUp>

        <FadeUp delay={0.14}>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Personalized CD
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-[#8B8178] text-lg leading-relaxed max-w-2xl mb-12">
            A gifting experience that revives the physical mixtape. Custom artwork, a handpicked tracklist, and a companion digital playlist.
          </p>
        </FadeUp>

        <FadeUp delay={0.28}>
          <div className="rounded-2xl border border-[#252118] overflow-hidden" style={{ background: "#0A0908" }}>
            <CDCover />
          </div>
        </FadeUp>
      </div>

      {/* Two-column case study */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-32 flex gap-14">
        {/* Content */}
        <div className="flex-1 min-w-0">

          <Section id="overview" onVisible={handleVisible}>
            <SectionLabel n="01" label="Overview" />
            <div className="grid grid-cols-3 gap-6 mb-10 pt-10 border-t border-[#1c1916]">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#4A4540] mb-2">Type</p>
                <p className="text-sm text-[#8B8178]">Physical Product</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#4A4540] mb-2">Tools</p>
                <p className="text-sm text-[#8B8178]">Figma · Photoshop · Canva</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#4A4540] mb-2">Output</p>
                <p className="text-sm text-[#8B8178]">1 physical album gift</p>
              </div>
            </div>
            <p className="text-[#F5EFE8] text-xl leading-relaxed mb-6">
              A physical mixtape I designed and produced for a close friend's birthday. We bonded over music, and I wanted to create something that felt intentional and personal. Not a playlist link. A real object you could hold.
            </p>
            <p className="text-[#8B8178] leading-relaxed mb-5">
              I collect CDs and care about music as a medium. Collecting was something my dad and I bonded over. We went CD shopping together a few times, went through his collection, and somewhere along the way I started my own. That relationship with physical music is part of what made this feel like the right gift.
            </p>
            <p className="text-[#8B8178] leading-relaxed">
              When her birthday came around, buying something felt too easy. I wanted to take one of my own cases and transform it into a completely custom album made specifically for her. Real tracklist, real artwork, real disc. The whole thing.
            </p>
          </Section>

          <Section id="inspiration" onVisible={handleVisible}>
            <SectionLabel n="02" label="Inspiration" />
            <p className="text-[#8B8178] leading-relaxed mb-8">
              Before touching any design tools, I spent time building a moodboard. The vibe I was going for: warm, nostalgic, personal. A big part of that was leaning into a scrapbook feel. I wanted the whole thing to feel tactile and handmade despite being designed entirely on a screen. Scrapbooking is great at that. It carries weight even when it's digital. Pinterest was the starting point.
            </p>

            {/* Pinterest screenshot */}
            <div className="rounded-xl overflow-hidden border border-[#1c1916] mb-6">
              <Image
                src="/CD/CD Pinterest.PNG"
                alt="Pinterest moodboard for the CD project"
                width={900}
                height={600}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </div>
            <p className="text-[11px] text-[#4A4540] tracking-wide mb-8">
              Pinterest moodboard — the reference folder that set the visual direction.
            </p>

            <p className="text-[#8B8178] leading-relaxed">
              The references helped me figure out color palette, typography feel, and the overall compositional style before I opened a single design file. Visual direction first. Design work second.
            </p>
          </Section>

          <Section id="process" onVisible={handleVisible}>
            <SectionLabel n="03" label="Process" />

            <div className="space-y-10">
              <div className="pl-5 border-l border-[#252118]">
                <p className="text-sm font-medium text-[#F5EFE8] mb-2">Music Curation</p>
                <p className="text-[#8B8178] text-sm leading-relaxed">
                  This came first. I put together a 15-song tracklist from songs I knew she loved, plus a few I thought she'd connect with. The goal wasn't just a playlist. It was a sequence. Something that felt like a cohesive record when listened to front to back. Once the tracklist was locked, the whole project had an emotional throughline to design around.
                </p>
                <p className="text-[#8B8178] text-sm leading-relaxed mt-3">
                  The CD includes a QR code that links to the original private playlist made specifically for her. That one is set to private out of respect for her. The playlist embedded below is a replica with the same tracklist, shared here so you can actually hear it.
                </p>
                {/* Spotify + receipt side by side */}
                <p className="text-[#4A4540] text-xs mt-3">
                  Tracklist visualized with{" "}
                  <a href="https://receiptify.herokuapp.com/" target="_blank" rel="noopener noreferrer"
                    className="underline hover:text-[#8B8178] transition-colors">
                    Receiptify
                  </a>
                </p>

                <div className="mt-4 flex gap-3 items-start" style={{ maxWidth: 680 }}>
                  <iframe
                    src="https://open.spotify.com/embed/playlist/1HjHR6uYJCbKoohDCmGTnf?utm_source=generator&theme=0"
                    width="575"
                    height="474"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: 12, border: "none", flexShrink: 0 }}
                  />
                  <Image
                    src="/CD/Receptify v2.png"
                    alt="Tracklist receipt"
                    width={340}
                    height={1008}
                    style={{ display: "block", width: 160, height: "auto", borderRadius: 8, flexShrink: 0 }}
                  />
                </div>
              </div>

              <div className="pl-5 border-l border-[#252118]">
                <p className="text-sm font-medium text-[#F5EFE8] mb-2">Asset Creation</p>
                <p className="text-[#8B8178] text-sm leading-relaxed">
                  I used Figma to experiment with layout and composition, Photoshop to clean up and manipulate images, and Canva for final assembly. Canva made printing exports straightforward, which is the main reason it was in the stack. Each tool had a specific job. Nothing was used for everything.
                </p>
              </div>

              <div className="pl-5 border-l border-[#252118]">
                <p className="text-sm font-medium text-[#F5EFE8] mb-2">Packaging Design</p>
                <p className="text-[#8B8178] text-sm leading-relaxed">
                  Every component of a jewel case has to be built separately: front cover, back tray with tracklist, inside panel, spine strips on both sides, and a custom disc face. The tricky part is that each piece uses different dimensions. The front insert, back insert, and spine strips all have specific measurements. Get them wrong and nothing fits once it's physically assembled.
                </p>
                <p className="text-[#8B8178] text-sm leading-relaxed mt-3">
                  Figuring out the exact measurements required and then designing to them precisely was the most technically demanding part of the whole project.
                </p>
              </div>

              <div className="pl-5 border-l border-[#252118]">
                <p className="text-sm font-medium text-[#F5EFE8] mb-2">Production</p>
                <p className="text-[#8B8178] text-sm leading-relaxed">
                  I printed the inserts through FedEx. It took 4 rounds to get the measurements exactly right. Small errors in sizing are very obvious once something is physically in your hands. Once the prints were correct, I cut each piece by hand and assembled everything inside the case. Then burned the tracklist onto a blank disc.
                </p>
                <p className="text-[#8B8178] text-sm leading-relaxed mt-3">
                  4 prints is the takeaway. For any future physical project: budget extra rounds for print calibration. What looks right on screen and what prints correctly are not the same thing.
                </p>
              </div>
            </div>
          </Section>

          <Section id="result" onVisible={handleVisible}>
            <SectionLabel n="04" label="The Result" />
            <p className="text-[#8B8178] leading-relaxed mb-10">
              The finished product: a fully custom jewel case with original artwork on every surface. Front cover, back tray with tracklist, interior booklet, custom disc. Not record store material, but it wasn't trying to be. It was made for one person and it was ready to give.
            </p>

            {/* 2×2 hi-fi grid */}
            <p className="text-sm font-medium text-[#F5EFE8] mb-4">High Fidelity</p>
            <div className="grid grid-cols-2 gap-3 mb-10">
              {[
                { src: "/CD/cd-frame-front.png",                          alt: "Front cover",                      w: 900, h: 900,  label: "Front cover" },
                { src: "/CD/CD frame back.png",                           alt: "Back tray with tracklist",         w: 900, h: 700,  label: "Back tray" },
                { src: "/CD/cd back of front booklet and tracklist.png",  alt: "Inside booklet panel",             w: 900, h: 600,  label: "Inside booklet" },
                { src: "/CD/the CD.png",                                  alt: "Custom printed disc",              w: 900, h: 600,  label: "The disc" },
              ].map(({ src, alt, w, h, label }) => (
                <div key={src}>
                  <div className="rounded-xl overflow-hidden border border-[#1c1916] mb-1.5">
                    <Image src={src} alt={alt} width={w} height={h}
                      style={{ display: "block", width: "100%", height: "auto" }} />
                  </div>
                  <p className="text-[11px] text-[#4A4540] tracking-wide">{label}</p>
                </div>
              ))}
            </div>

            {/* Interactive openable case */}
            <p className="text-sm font-medium text-[#F5EFE8] mb-1">The Real Thing</p>
            <p className="text-xs text-[#4A4540] mb-4">Open it. Flip it. This is the actual product. Recreated digitally of course.</p>
            <div className="rounded-2xl border border-[#252118] overflow-visible" style={{ background: "#0A0908" }}>
              <CDOpenable />
            </div>

            {/* Deliverables */}
            <p className="text-sm font-medium text-[#F5EFE8] mt-10 mb-4">Deliverables</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Custom front cover",
                "Back tray with tracklist",
                "Interior booklet artwork",
                "Custom printed disc",
              ].map(item => (
                <div key={item} className="px-4 py-3 rounded-lg border border-[#1c1916] text-sm text-[#8B8178]">
                  {item}
                </div>
              ))}
            </div>
          </Section>

          <Section id="reflection" onVisible={handleVisible}>
            <SectionLabel n="05" label="Reflection" />
            <p className="text-[#8B8178] leading-relaxed mb-6">
              This pushed me outside my usual workflow. Most things I build live on the internet. They're editable, iterative, forgiving. Physical production is none of those things. A wrong measurement means reprinting. Assembly requires patience. There's no undo.
            </p>
            <p className="text-[#8B8178] leading-relaxed mb-6">
              What I didn't expect: how much of the design problem was actually a production problem. Getting the artwork to look right on screen is one thing. Getting it to look right after printing, cutting, and fitting inside a plastic case is a completely different challenge. The gap between the two is real.
            </p>
            <p className="text-[#8B8178] leading-relaxed mb-6">
              What stuck with me most is how much weight a physical object carries when it's paired with something emotionally meaningful. A playlist is easy to ignore. Something you can hold is harder to forget.
            </p>
            <p className="text-[#8B8178] leading-relaxed mb-10">
              This was also just a genuinely unique experience. There aren't many projects where you go from a blank Figma canvas to something you can physically hand to someone. It taught me that stepping outside what I usually make isn't something to avoid. Some of the most interesting work happens when you're not sure if you know how to do it yet.
            </p>

            <div className="border-l-2 pl-5" style={{ borderColor: PURPLE }}>
              <p className="text-[#8B8178] text-sm leading-relaxed mb-3">
                I think that's why this project felt different from anything I'd made before. It started as an idea, became a design problem, and ended up as something real sitting in someone's hands. That's kind of the whole point, isn't it?
              </p>
              <p className="font-display text-xl italic leading-relaxed" style={{ color: "#F5EFE8" }}>
                "Everything you can imagine is real."
              </p>
              <p className="text-[11px] tracking-widest uppercase mt-2" style={{ color: PURPLE }}>
                Pablo Picasso
              </p>
            </div>
          </Section>

          <div className="pt-6 border-t border-[#1c1916]">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              style={{ color: PURPLE_LIGHT }}
            >
              ← Back to all projects
            </Link>
          </div>
        </div>

        {/* TOC */}
        <TableOfContents active={activeSection} />
      </div>
    </div>
  );
}
