"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";

const ACCENT = "#D4874A";
const COIN_SIZE = 200;
const COIN_THICKNESS = 10;

function FloatingCoin() {
  return (
    <div
      style={{
        perspective: 900,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Soft floor glow */}
      <div
        style={{
          position: "absolute",
          bottom: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          width: COIN_SIZE * 0.85,
          height: 18,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${ACCENT}55 0%, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />

      {/* Bobbing wrapper */}
      <motion.div
        animate={{ y: [-7, 7, -7] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Spinning coin */}
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          style={{
            transformStyle: "preserve-3d",
            width: COIN_SIZE,
            height: COIN_SIZE,
            position: "relative",
          }}
        >
          {/* Front face */}
          <div
            className="font-display"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              transform: `translateZ(${COIN_THICKNESS / 2}px)`,
              backfaceVisibility: "hidden",
              background: `radial-gradient(circle at 32% 30%, #F4C77A 0%, #D4874A 55%, #8B5A30 100%)`,
              border: `2px solid #EFB97A`,
              boxShadow: `inset 0 0 18px rgba(0,0,0,0.35), 0 0 40px ${ACCENT}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 110,
              fontWeight: 700,
              color: "#5B3818",
              textShadow:
                "0 1px 0 rgba(255,255,255,0.35), 0 -1px 0 rgba(0,0,0,0.5)",
              lineHeight: 1,
              paddingBottom: 6,
            }}
          >
            $
          </div>

          {/* Back face */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              transform: `rotateY(180deg) translateZ(${COIN_THICKNESS / 2}px)`,
              backfaceVisibility: "hidden",
              background: `radial-gradient(circle at 32% 30%, #F4C77A 0%, #D4874A 55%, #8B5A30 100%)`,
              border: `2px solid #EFB97A`,
              boxShadow: `inset 0 0 18px rgba(0,0,0,0.35), 0 0 40px ${ACCENT}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 90,
              color: "#5B3818",
              textShadow:
                "0 1px 0 rgba(255,255,255,0.35), 0 -1px 0 rgba(0,0,0,0.5)",
              lineHeight: 1,
            }}
          >
            ★
          </div>

          {/* Edge rim (slight depth) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              transform: `translateZ(0)`,
              background: `linear-gradient(90deg, #8B5A30 0%, #D4874A 50%, #8B5A30 100%)`,
              boxShadow: `0 0 0 1px #6B4220`,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Playground() {
  return (
    <SectionWrapper
      id="playground"
      className="flex flex-col justify-center py-24 md:py-32"
    >
      <div className="w-full max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.43, 0.195, 0.02, 1] }}
          className="mb-14"
        >
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540]">
              03
            </span>
            <div className="w-8 h-px bg-[#252118]" />
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540]">
              Playground
            </span>
          </div>
          <h2 className="mt-6 font-display text-5xl md:text-6xl font-bold text-[#F5EFE8] leading-[1.05] tracking-tight">
            Insert coin.
          </h2>
          <p className="mt-4 text-[#8B8178] text-sm leading-relaxed max-w-md">
            A small detour from the work — drop a coin and see what happens.
          </p>
        </motion.div>

        {/* Editorial card with floating coin */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.43, 0.195, 0.02, 1] }}
        >
          <Link href="/play" className="group block">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-[#252118] group-hover:border-[#3a3020] transition-colors duration-500"
              style={{
                background: `linear-gradient(135deg, #141210 0%, #0f0d0b 100%)`,
              }}
            >
              {/* Hover accent glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 25% 50%, ${ACCENT}1A 0%, transparent 60%)`,
                }}
              />

              <div className="relative z-10 grid md:grid-cols-[2fr_3fr]">
                {/* Left: floating coin panel */}
                <div
                  className="relative h-64 md:h-auto md:min-h-[420px] overflow-hidden border-b md:border-b-0 md:border-r border-[#252118]"
                  style={{
                    background: `radial-gradient(ellipse at center, #1a1410 0%, #0a0908 85%)`,
                  }}
                >
                  {/* Subtle dot grid for texture */}
                  <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
                  <FloatingCoin />
                </div>

                {/* Right: editorial content */}
                <div className="relative p-8 md:p-14 lg:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: ACCENT }}
                    />
                    <span
                      className="text-[10px] font-medium tracking-[0.25em] uppercase"
                      style={{ color: ACCENT }}
                    >
                      Interactive Experience
                    </span>
                  </div>

                  <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5EFE8] mb-5 leading-[1.05]">
                    Enter the arcade.
                  </h3>

                  <p className="text-[#8B8178] text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                    A 3D arcade cabinet I built with Three.js. Toss a coin, watch it land, see what happens next.
                  </p>

                  <span
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 group-hover:gap-3"
                    style={{ color: ACCENT }}
                  >
                    Press start
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ACCENT}80, transparent)`,
                }}
              />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
