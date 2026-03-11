"use client";

import { motion } from "framer-motion";
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

// Floating discipline card
function DisciplineTag({ label, delay, x, y }: { label: string; delay: number; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.43, 0.195, 0.02, 1] }}
      style={{ left: `${x}%`, top: `${y}%` }}
      className="absolute hidden lg:block"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide border border-[#252118] bg-[#141210]/80 backdrop-blur-sm text-[#8B8178] whitespace-nowrap"
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

const floatingTags = [
  { label: "Product Strategy", delay: 0.9, x: 2, y: 22 },
  { label: "Creative Direction", delay: 1.1, x: 74, y: 14 },
  { label: "Brand & Identity", delay: 1.3, x: 78, y: 72 },
  { label: "Growth & GTM", delay: 1.5, x: 1, y: 68 },
];

// Headline line — slides up one by one
function HeadlineLine({ text, delay, italic }: { text: string; delay: number; italic?: boolean }) {
  return (
    <div className="overflow-hidden">
      <motion.span
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: [0.43, 0.195, 0.02, 1] }}
        className={`block font-display text-[13vw] sm:text-[10vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[6.5vw] leading-[0.9] tracking-[-0.03em] font-bold ${
          italic ? "italic text-[#5BAECC]" : "text-[#F5EFE8]"
        }`}
      >
        {text}
      </motion.span>
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

      {/* Floating tags */}
      {floatingTags.map((tag) => (
        <DisciplineTag key={tag.label} {...tag} />
      ))}

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
          {lines.map((line, i) => (
            <HeadlineLine
              key={i}
              text={line}
              delay={0.35 + i * 0.15}
              italic={i === 1}
            />
          ))}
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
            onClick={() => window.open(siteConfig.resumeUrl, "_blank")}
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
