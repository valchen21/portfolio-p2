"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { about, siteConfig, marqueeItems } from "@/data/content";

// ─── Hobby popup data ─────────────────────────────────────────────────────────
type HobbyDetail = {
  desc: string;
  linkLabel?: string;
  href?: string;
  pokemon?: string[];
  pokemonLinks?: { name: string; href: string }[];
  image?: string;
};

const HOBBY_DETAILS: Record<string, HobbyDetail> = {
  "Vietnamese egg coffee": {
    desc: "THE best coffee and it always gets me going. Still trying to figure out how to make it at home.",
    linkLabel: "See the recipe →",
    href: "https://www.hummingbirdhigh.com/2022/05/vietnamese-egg-coffee.html",
    image: "/Landing Page/Egg Coffee.jpg",
  },
  "Wong Kar Wai films": {
    desc: "My favorite director from when my dad made me watch his films as a kid. Fell in love with the cinematography. It felt like looking at art.",
    linkLabel: "Watch this →",
    href: "https://www.youtube.com/watch?v=XNdalPtWBVw",
    image: "/Landing Page/wong kar wai.PNG",
  },
  "LEGOs": {
    desc: "I must have the Notre Dame set from Lego Architecture. Can't wait to fill my future home with these sets.",
    linkLabel: "The set →",
    href: "https://brickarchitect.com/2024/review-21061-notre-dame-lego-architecture/",
    image: "/Landing Page/Lego Set.png",
  },
  "Spotify playlists": {
    desc: "I love music, discovering new artists, and connecting with people through playlists. Check out what I've been listening to.",
    linkLabel: "My Spotify →",
    href: "https://open.spotify.com/user/blackheartzx?si=ed50f63291124c79",
  },
  "Bucket lists": {
    desc: "Always down for new things. I'm a firm believer in setting goals that drive purpose — if you have an idea, send it my way.",
    linkLabel: "Send me one →",
    href: "mailto:val.chen21@gmail.com",
  },
  "Pokémon": {
    desc: "Grew up playing it and have even caught them all in my time. My personal favorites are Piplup and Jirachi.",
    pokemon: ["piplup", "jirachi"],
    pokemonLinks: [
      { name: "piplup", href: "https://www.pokemon.com/us/pokedex/piplup" },
      { name: "jirachi", href: "https://www.pokemon.com/us/pokedex/jirachi" },
    ],
  },
};

function HobbyTag({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [sprites, setSprites] = useState<{ name: string; url: string }[]>([]);
  const details = HOBBY_DETAILS[label];
  const hasFetched = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleClick = () => {
    const next = !open;
    setOpen(next);
    if (next && details?.pokemon && !hasFetched.current) {
      hasFetched.current = true;
      Promise.all(
        details.pokemon.map((name) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((r) => r.json())
            .then((d) => ({ name, url: d.sprites.front_default as string }))
        )
      ).then(setSprites);
    }
  };

  if (!details) {
    return (
      <span className="hobby-tag px-3 py-1.5 rounded-full text-xs font-medium border border-[#252118] bg-[#0A0908] text-[#8B8178] transition-all duration-200">
        {label}
      </span>
    );
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={handleClick}
        className={`hobby-tag px-3 py-1.5 rounded-full text-xs font-medium border bg-[#0A0908] transition-all duration-200 cursor-pointer ${
          open
            ? "hobby-tag-active border-transparent text-[#F5EFE8]"
            : "border-[#252118] text-[#8B8178]"
        }`}
      >
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 8, scale: 0.97, x: "-50%" }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 mb-3 w-52 z-50"
          >
            <div className="rounded-xl border border-[#252118] bg-[#141210] overflow-hidden shadow-xl shadow-black/60">
              {/* 1:1 photo */}
              {details.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={details.image} alt={label} className="w-full aspect-square object-cover" />
              )}
              {/* Pokémon sprites */}
              {details.pokemon && (
                <div className="flex gap-2 pt-3 px-3.5 justify-center">
                  {sprites.length > 0
                    ? sprites.map((s) => {
                        const link = details.pokemonLinks?.find((l) => l.name === s.name);
                        const sprite = <img key={s.name} src={s.url} alt={s.name} width={96} height={96} style={{ imageRendering: "pixelated" }} />;
                        return link ? (
                          <a key={s.name} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-150">
                            {sprite}
                          </a>
                        ) : sprite;
                      })
                    : details.pokemon.map((name) => (
                        <div key={name} className="w-24 h-24 rounded-lg bg-[#0A0908] border border-[#252118] animate-pulse" />
                      ))}
                </div>
              )}
              <div className="p-3.5">
                <p className="text-xs text-[#8B8178] leading-relaxed mb-2.5">{details.desc}</p>
                {details.href && details.linkLabel && (
                  <a
                    href={details.href}
                    target={details.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium transition-colors duration-150"
                    style={{ color: "var(--accent)" }}
                  >
                    {details.linkLabel}
                  </a>
                )}
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#252118]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540]">{number}</span>
      <div className="w-8 h-px bg-[#252118]" />
      <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540]">{label}</span>
    </div>
  );
}

// Marquee strip
function MarqueeStrip({ reverse = false }: { reverse?: boolean }) {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="flex overflow-hidden py-4">
      <motion.div
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 shrink-0"
      >
        {items.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center gap-6 shrink-0">
            <span className="text-sm font-medium text-[#4A4540] whitespace-nowrap">{item}</span>
            <span className="text-lg leading-none" style={{ color: "var(--accent)", opacity: 0.4 }}>✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function PrincipleCard({
  principle,
  index,
}: {
  principle: (typeof about.principles)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group p-5 rounded-xl border border-[#252118] bg-[#141210]/40 hover:bg-[#141210]/80 hover:border-[#2e2820] transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <span
          className="font-display text-2xl font-bold leading-none mt-0.5 select-none transition-colors duration-300"
          style={{ color: "var(--accent)", opacity: 0.2 }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h4 className="text-sm font-semibold text-[#F5EFE8] mb-1.5">{principle.label}</h4>
          <p className="text-sm text-[#8B8178] leading-relaxed">{principle.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

const ABOUT_PHOTOS = [
  "/Landing Page/About 1.jpg",
  "/Landing Page/About 2 (1).jpg",
  "/Landing Page/About 3.jpg",
];

function PhotoCarousel() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + ABOUT_PHOTOS.length) % ABOUT_PHOTOS.length);
  const next = () => setIdx(i => (i + 1) % ABOUT_PHOTOS.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.43, 0.195, 0.02, 1] }}
      className="flex flex-col gap-3"
    >
      {/* Photo */}
      <div className="rounded-2xl overflow-hidden border border-[#252118]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ABOUT_PHOTOS[idx]}
              alt={`Val Chen ${idx + 1}`}
              className="w-full h-auto block"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={prev}
          className="text-[11px] tracking-widest uppercase text-[#4A4540] hover:text-[#8B8178] transition-colors"
        >
          ← prev
        </button>
        <div className="flex gap-1.5">
          {ABOUT_PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 16 : 6,
                height: 4,
                borderRadius: 99,
                background: i === idx ? "var(--accent)" : "#252118",
                transition: "width 0.3s, background 0.3s",
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="text-[11px] tracking-widest uppercase text-[#4A4540] hover:text-[#8B8178] transition-colors"
        >
          next →
        </button>
      </div>
    </motion.div>
  );
}

export default function About() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const quoteY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 md:py-40">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0908]" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 80% 30%, rgba(91,174,204,0.05) 0%, transparent 55%)",
        }}
      />
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#252118] to-transparent" />

      {/* Marquee strip — top */}
      <div className="relative z-10 overflow-hidden border-y border-[#252118] bg-[#0d0b0a] mb-20 md:mb-28">
        <MarqueeStrip />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel number="04" label="About" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5EFE8] leading-tight tracking-tight"
          >
            Beyond <span className="italic" style={{ color: "var(--accent)" }}>the screen</span>
          </motion.h2>
        </div>

        {/* Main two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Left: Pull quote + bio */}
          <div>
            {/* Pull quote */}
            <motion.div
              style={{ y: quoteY }}
              className="mb-10"
            >
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.43, 0.195, 0.02, 1] }}
                className="relative"
              >
                {/* Quote mark */}
                <span className="absolute -top-4 -left-2 font-display text-7xl leading-none select-none" style={{ color: "var(--accent)", opacity: 0.1 }}>
                  &ldquo;
                </span>
                <p className="font-display text-xl md:text-2xl font-medium text-[#F5EFE8] leading-snug pl-4 border-l-2" style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)" }}>
                  {about.pullQuote}
                </p>
              </motion.div>
            </motion.div>

            {/* Bio paragraphs */}
            <div className="space-y-5">
              {about.bio.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="text-base text-[#8B8178] leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 p-5 rounded-xl border border-[#252118] bg-[#141210]/40"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4A4540]">
                  Outside work
                </h4>
                <span className="text-[10px] text-[#3A3530] italic">click to explore</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {about.interests.map((interest) => (
                  <HobbyTag key={interest} label={interest} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Photo carousel */}
          <PhotoCarousel />
        </div>

        {/* Looking for section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border border-[#252118] p-8 md:p-12"
          style={{
            background: "linear-gradient(135deg, #141210 0%, #1a1612 50%, #141210 100%)",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 70% 50%, rgba(91,174,204,0.08) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#4A8B6A]"
                />
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#4A8B6A]">
                  Open to opportunities
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-[#F5EFE8] mb-3 leading-snug">
                What I&apos;m looking for
              </h3>
              <p className="text-[#8B8178] text-sm leading-relaxed max-w-lg">
                {about.lookingFor}
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full text-[#0A0908] text-sm font-semibold transition-all duration-300"
                style={{ background: "var(--accent)" }}
              >
                <span>{siteConfig.email}</span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
                style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
              >
                <span>LinkedIn</span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">↗</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
