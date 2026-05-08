"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PlaygroundIngame() {
  return (
    <main className="relative min-h-screen w-full bg-[#0A0908] flex flex-col items-center justify-center overflow-hidden py-16">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          href="/#playground"
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-[#252118] bg-[#141210]/80 backdrop-blur-sm text-[#8B8178] hover:text-[#F5EFE8] hover:border-[#3a3530] text-xs font-medium tracking-[0.18em] uppercase transition-all duration-200"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
            ←
          </span>
          Back
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center px-6 mb-10"
      >
        <div className="text-[11px] tracking-[0.35em] uppercase text-[#8B8178] mb-4">
          Playground · In-game
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-[#F5EFE8] tracking-tight">
          More coming soon.
        </h1>
        <p className="mt-5 text-[#8B8178] text-base md:text-lg max-w-xl mx-auto">
          You can play the actual OutRun game right now while I move things around.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl overflow-hidden border border-[#252118] shadow-[0_30px_80px_rgba(0,0,0,0.45)] relative max-w-full"
        style={{ width: 960, height: 570 }}
      >
        <iframe
          src="https://funhtml5games.com?embed=outrun"
          style={{
            width: 960,
            height: 720,
            border: "none",
            display: "block",
            position: "absolute",
            top: -150,
            left: 0,
          }}
          frameBorder="0"
          scrolling="no"
          title="OutRun"
          allow="autoplay; fullscreen"
        />
      </motion.div>
    </main>
  );
}
