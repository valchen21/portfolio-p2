"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BeamsBackground } from "@/components/ui/beams-background";
import Polaroid3D from "@/components/ui/Polaroid3D";

type Phase = "ready" | "spinning" | "free" | "developed" | "leaving";

// Instax Mini proportions: 54mm × 86mm card, 46mm × 62mm image area
const PHOTO_W = 230;
const PHOTO_H = 366;
const DEVELOP_DURATION = 2400; // ms

export default function EntranceIntro({
  onComplete,
  onLeaving,
}: {
  onComplete: () => void;
  onLeaving?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [developProgress, setDevelopProgress] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      const Ctx =
        typeof window !== "undefined"
          ? window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          : null;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const shutterAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio("/Landing%20Page/shutter%20sound.mp3");
    a.preload = "auto";
    a.volume = 0.8;
    shutterAudioRef.current = a;
  }, []);

  const playShutter = () => {
    const a = shutterAudioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {
      /* ignore */
    }
  };

  const playWhirr = (duration = 2.2) => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const len = Math.floor(ctx.sampleRate * duration);
    const noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 240;
    bp.Q.value = 7;

    // LFO modulates the band-pass to make a "motor" vibrato
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 13;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 55;
    lfo.connect(lfoGain);
    lfoGain.connect(bp.frequency);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.18, now + 0.18);
    env.gain.setValueAtTime(0.18, now + duration - 0.35);
    env.gain.linearRampToValueAtTime(0, now + duration);

    src.connect(bp);
    bp.connect(env);
    env.connect(ctx.destination);

    lfo.start(now);
    src.start(now);
    src.stop(now + duration);
    lfo.stop(now + duration);
  };

  const playChime = () => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [880, 1320]; // soft 5th
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      const start = now + i * 0.05;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.12, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.7);
    });
  };

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const milkOpacity = 1 - developProgress;
  const photoBlur = `blur(${(1 - developProgress) * 6}px)`;
  const photoSaturate = 0.2 + developProgress * 0.8;

  // Auto-develop in "free" phase
  useEffect(() => {
    if (phase !== "free") return;
    const start = performance.now();
    let raf: number;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / DEVELOP_DURATION);
      setDevelopProgress(t);
      if (t >= 1) {
        setPhase("developed");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // developed -> leaving (overlay fade-out triggers onComplete via onAnimationComplete)
  useEffect(() => {
    if (phase === "developed") {
      playChime();
      const t = setTimeout(() => setPhase("leaving"), 700);
      return () => clearTimeout(t);
    }
    if (phase === "leaving") {
      onLeaving?.();
    }
  }, [phase, onLeaving]);

  const handleOverlayClick = () => {
    if (phase === "ready") {
      setPhase("spinning");
    }
  };

  const handleSpinComplete = () => {
    if (phase === "spinning") {
      // Brief pause after lock, then shutter + photo emerges
      setTimeout(() => {
        playShutter();
        setTimeout(() => playWhirr(2.4), 120);
        setPhase("free");
      }, 1000);
    }
  };

  // Slot position in viewport coords (camera SVG centered, slot at SVG y=135 of 280-tall body)
  const SLOT_Y = -5;
  const PHOTO_HALF_H = PHOTO_H / 2;

  // Phase-driven photo target — opacity 0 in "ready"/"spinning" (camera-only), then emerges from slot
  const target =
    phase === "ready" || phase === "spinning"
      ? { x: 0, y: SLOT_Y + PHOTO_HALF_H, scale: 0.92, rotate: -1, opacity: 0 }
      : phase === "free"
      ? { x: 0, y: 0, scale: 1.05, rotate: 0, opacity: 1 }
      : phase === "developed"
      ? { x: 0, y: 0, scale: 1.12, rotate: 0, opacity: 1 }
      : { x: 0, y: 0, scale: 1.0, rotate: 0, opacity: 1 };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{
        background: "#0A0908",
        cursor: phase === "ready" ? "pointer" : "default",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "leaving" ? 0 : 1 }}
      transition={{ duration: 1.0, ease: [0.43, 0.195, 0.02, 1] }}
      onClick={handleOverlayClick}
      onAnimationComplete={() => {
        if (phase === "leaving") onComplete();
      }}
    >
      {/* Animated beams background */}
      <BeamsBackground intensity="strong" />

      {/* Camera — visible during ready + spinning, fades when photo emerges */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          opacity: phase === "ready" || phase === "spinning" ? 1 : 0,
          y: phase === "ready" || phase === "spinning" ? 0 : 20,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ zIndex: 1, pointerEvents: "none" }}
      >
        <Polaroid3D
          width={700}
          height={600}
          spin={phase === "spinning"}
          onSpinComplete={handleSpinComplete}
        />
      </motion.div>

      {/* Photo wrapper — stays centered, no fly-out */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          marginLeft: -PHOTO_W / 2,
          marginTop: -PHOTO_H / 2,
          width: PHOTO_W,
          height: PHOTO_H,
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {/* Inner phase motion — emerges from slot, scales/rotates */}
        <motion.div
          style={{
            width: "100%",
            height: "100%",
          }}
          initial={{ x: 0, y: SLOT_Y + PHOTO_HALF_H, scale: 0.92, rotate: -1, opacity: 0 }}
          animate={target}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 18,
            mass: 0.8,
          }}
        >
        <div
          style={{
            width: PHOTO_W,
            height: PHOTO_H,
            background: "#F5EFE8",
            padding: "17px 17px 85px 17px",
            borderRadius: 4,
            boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)",
            transform: phase === "ready" ? "rotate(-1deg)" : undefined,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              background: "#1a1815",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                filter: `${photoBlur} saturate(${photoSaturate})`,
                transition: "filter 0.15s linear",
              }}
            >
              <Image
                src="/Landing Page/In polaroid.jpg"
                alt="Val"
                fill
                sizes="230px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            {/* Milky undeveloped overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, #d6cfc4 0%, #b8b1a6 50%, #c9c2b6 100%)",
                opacity: milkOpacity,
                transition: "opacity 0.15s linear",
                mixBlendMode: "normal",
              }}
            />
            {/* Faint chemical splotches while developing */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.0) 0%, rgba(180,170,150,0.4) 60%, transparent 70%), radial-gradient(ellipse at 70% 65%, transparent 0%, rgba(120,110,95,0.3) 50%, transparent 70%)",
                opacity: milkOpacity * 0.8,
                transition: "opacity 0.15s linear",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 32,
              fontFamily: "Caveat, cursive",
              fontWeight: 600,
              color: "#0A0908",
              textAlign: "center",
              marginTop: 18,
              opacity: developProgress >= 1 ? 1 : 0,
              transition: "opacity 0.5s ease-out",
              lineHeight: 1,
            }}
          >
            Welcome!
          </div>
        </div>

        </motion.div>
      </div>

      {/* Hints */}
      <AnimatePresence mode="wait">
        {phase === "ready" && (
          <motion.div
            key="hint-click"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
          >
            <div className="text-[#F5EFE8] text-2xl md:text-3xl">
              click anywhere
            </div>
          </motion.div>
        )}
        {phase === "free" && developProgress < 1 && (
          <motion.div
            key="hint-developing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
          >
            <div className="text-[#F5EFE8] text-2xl md:text-3xl">
              developing…
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PolaroidCamera() {
  // Stylized SVG Polaroid OneStep-ish camera
  return (
    <svg
      width="320"
      height="280"
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}
    >
      {/* Body */}
      <rect x="20" y="30" width="280" height="220" rx="14" fill="#F5EFE8" />
      {/* Subtle body shading */}
      <rect x="20" y="30" width="280" height="220" rx="14" fill="url(#bodyShade)" />

      {/* Top dark band (lens housing) */}
      <rect x="20" y="30" width="280" height="100" rx="14" fill="#1a1815" />
      <rect x="20" y="120" width="280" height="10" fill="#1a1815" />

      {/* Rainbow stripe */}
      <rect x="32" y="240" width="22" height="4" fill="#E5474B" />
      <rect x="58" y="240" width="22" height="4" fill="#F5A623" />
      <rect x="84" y="240" width="22" height="4" fill="#F5D429" />
      <rect x="110" y="240" width="22" height="4" fill="#4CAF50" />
      <rect x="136" y="240" width="22" height="4" fill="#2196F3" />

      {/* Lens */}
      <circle cx="160" cy="80" r="38" fill="#0A0908" />
      <circle cx="160" cy="80" r="32" fill="#1a1815" stroke="#5BAECC" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="160" cy="80" r="22" fill="#000" />
      <circle cx="152" cy="72" r="6" fill="#5BAECC" fillOpacity="0.4" />

      {/* Viewfinder */}
      <rect x="56" y="66" width="34" height="28" rx="3" fill="#2a2520" stroke="#3a3530" />
      <rect x="60" y="70" width="26" height="20" rx="1" fill="#5BAECC" fillOpacity="0.2" />

      {/* Flash bar */}
      <rect x="220" y="60" width="60" height="14" rx="2" fill="#f5e9c8" />
      <rect x="222" y="62" width="56" height="10" rx="1" fill="#fff7d6" opacity="0.6" />

      {/* Shutter button */}
      <circle cx="262" cy="100" r="7" fill="#E5474B" />
      <circle cx="262" cy="100" r="5" fill="#c63d40" />

      {/* Slot at bottom (photo emerges from here) — positioned just behind the photo */}
      <rect x="50" y="135" width="220" height="6" rx="2" fill="#0A0908" />

      <defs>
        <linearGradient id="bodyShade" x1="0" y1="30" x2="0" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
      </defs>
    </svg>
  );
}
