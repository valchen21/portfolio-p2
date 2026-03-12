"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ─── TOC config ───────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: "overview",     label: "Overview" },
  { id: "origin",       label: "The Origin" },
  { id: "tech",         label: "Tech Stack" },
  { id: "algorithm",    label: "The Algorithm" },
  { id: "team-builder", label: "Team Builder" },
  { id: "pages",        label: "Pages" },
  { id: "share-card",   label: "Share Card" },
  { id: "design",       label: "Design Language" },
  { id: "data",         label: "Data Design" },
  { id: "reflection",   label: "Reflection" },
];

const PINK       = "#F0609E";
const PINK_LIGHT = "#F8A0C0";
const LIVE_URL   = "https://meloettify.online";

// PokeAPI official artwork CDN
const sprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const PKM = {
  meloetta:  { id: 648, name: "Meloetta"   },
  milotic:   { id: 350, name: "Milotic"    },
  gengar:    { id: 94,  name: "Gengar"     },
  sylveon:   { id: 700, name: "Sylveon"    },
  vaporeon:  { id: 134, name: "Vaporeon"   },
  toxtricity:{ id: 849, name: "Toxtricity" },
  eevee:     { id: 133, name: "Eevee"      },
  marshadow: { id: 802, name: "Marshadow"  },
  snorlax:   { id: 143, name: "Snorlax"    },
  arcanine:  { id: 59,  name: "Arcanine"   },
  swellow:   { id: 277, name: "Swellow"    },
};

function PokemonSprite({ id, name, size = 80, delay = 0 }: { id: number; name: string; size?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.43, 0.195, 0.02, 1] }}
      className="flex flex-col items-center gap-1"
    >
      <Image src={sprite(id)} alt={name} width={size} height={size} className="drop-shadow-lg" />
      <span className="text-[10px] font-medium text-[#4A4540] tracking-wide">{name}</span>
    </motion.div>
  );
}

function TableOfContents({ active }: { active: string }) {
  return (
    <nav className="sticky top-28 flex flex-col gap-0.5 w-48 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
      <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540] mb-4">Contents</p>
      {TOC_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-3 py-2 transition-all duration-200">
            <span className="h-px transition-all duration-300 shrink-0"
              style={{ width: isActive ? "20px" : "8px", background: isActive ? PINK : "#3A3530" }} />
            <span className="text-sm font-medium transition-colors duration-200 leading-tight"
              style={{ color: isActive ? "#F5EFE8" : "#8B8178" }}>
              {item.label}
            </span>
          </a>
        );
      })}
      <div className="mt-6 pt-5 border-t border-[#252118]">
        <Link href="/#projects" className="flex items-center gap-2 text-[11px] text-[#4A4540] hover:text-[#8B8178] transition-colors duration-200">
          <span>←</span><span>Back</span>
        </Link>
      </div>
    </nav>
  );
}

function Section({ id, children, onVisible }: { id: string; children: React.ReactNode; onVisible: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -50% 0px" });
  useEffect(() => { if (inView) onVisible(id); }, [inView, id, onVisible]);
  return <section id={id} ref={ref} className="scroll-mt-28 mb-24">{children}</section>;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-6 h-px" style={{ background: PINK }} />
      <span className="text-[10px] font-medium tracking-[0.25em] uppercase" style={{ color: PINK }}>{text}</span>
    </div>
  );
}

function StatCard({ stat, label, highlight, delay = 0 }: { stat: string; label: string; highlight?: boolean; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.43, 0.195, 0.02, 1] }}
      className={`rounded-2xl border p-6 ${highlight ? "border-[#F0609E]/30 bg-[#1a0d14]" : "border-[#252118] bg-[#0f0d0b]"}`}>
      <p className="font-display text-4xl font-bold mb-2" style={{ color: highlight ? PINK_LIGHT : "#F5EFE8" }}>{stat}</p>
      <p className="text-[#8B8178] text-sm leading-relaxed">{label}</p>
    </motion.div>
  );
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.43, 0.195, 0.02, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function TypeBadge({ type, color }: { type: string; color: string }) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
      {type}
    </span>
  );
}

function AlgorithmStep({ step, title, children, delay = 0 }: { step: string; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <FadeUp delay={delay}>
      <div className="flex gap-5 pb-10 last:pb-0 relative">
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
            style={{ background: `${PINK}18`, border: `1px solid ${PINK}40`, color: PINK }}>
            {step}
          </div>
          <div className="w-px flex-1 mt-2" style={{ background: "#252118" }} />
        </div>
        <div className="pt-1.5 pb-4">
          <h4 className="text-base font-semibold text-[#F5EFE8] mb-2">{title}</h4>
          <div className="text-[#8B8178] text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </FadeUp>
  );
}

function CodeLine({ file, lines, purpose }: { file: string; lines: string; purpose: string }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#252118] last:border-0">
      <span className="font-mono text-xs text-[#F0609E] w-48 shrink-0">{file}</span>
      <span className="font-mono text-xs text-[#F5EFE8] w-16 shrink-0 text-right">{lines}</span>
      <span className="text-xs text-[#8B8178]">{purpose}</span>
    </div>
  );
}

function SpotifyModal({ onClose, onContinue }: { onClose: () => void; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(10,9,8,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.43, 0.195, 0.02, 1] }}
        className="relative w-full max-w-md rounded-2xl border p-8"
        style={{ background: "#141210", borderColor: `${PINK}40` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-[#4A4540] hover:text-[#8B8178] transition-colors text-lg">✕</button>

        {/* Icon + heading */}
        <div className="flex items-start gap-4 mb-5">
          <Image src={sprite(PKM.milotic.id)} alt="Milotic" width={60} height={60} className="drop-shadow-lg shrink-0" />
          <div>
            <h3 className="font-display text-xl font-bold text-[#F5EFE8] mb-1">One quick thing</h3>
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: PINK }}>About the Spotify feature</p>
          </div>
        </div>

        <p className="text-[#8B8178] text-sm leading-relaxed mb-4">
          Spotify has gutted their API for independent developers. Unless I&apos;m backed by a corporation or business, I can only whitelist up to 25 users for the &quot;Connect with Spotify&quot; feature.
        </p>
        <p className="text-[#8B8178] text-sm leading-relaxed mb-6">
          The quiz is open to everyone though! If you want your actual Spotify data analyzed, reach out and I&apos;ll try to get you added.
        </p>

        {/* Contact */}
        <a href="mailto:val.chen21@gmail.com"
          className="flex items-center justify-center gap-2 w-full mb-6 py-2.5 rounded-full text-xs font-semibold border border-[#252118] text-[#8B8178] hover:text-[#F5EFE8] hover:border-[#3a3020] transition-all duration-200">
          val.chen21@gmail.com
        </a>

        <button
          onClick={onContinue}
          className="w-full py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:brightness-110"
          style={{ background: PINK, color: "#0A0908" }}
        >
          Got it, let&apos;s go ↗
        </button>
      </motion.div>
    </motion.div>
  );
}

function LiveButton({ size = "md", onClickOverride }: { size?: "sm" | "md" | "lg"; onClickOverride?: () => void }) {
  const padding = size === "lg" ? "px-8 py-4 text-sm" : size === "sm" ? "px-5 py-2.5 text-xs" : "px-7 py-3.5 text-sm";
  return (
    <button
      onClick={onClickOverride}
      className={`inline-flex items-center gap-2.5 rounded-full font-semibold tracking-wide transition-all duration-300 hover:brightness-110 hover:scale-[1.02] ${padding}`}
      style={{ background: PINK, color: "#0A0908" }}
    >
      <span>✦ Visit Meloettify</span>
      <span>↗</span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MeloettifyCaseStudy() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);

  const openLive = () => setShowSpotifyModal(true);
  const goToSite = () => { setShowSpotifyModal(false); window.open(LIVE_URL, "_blank", "noopener,noreferrer"); };

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#F5EFE8]">
      <div className="noise-overlay" aria-hidden="true" />

      <AnimatePresence>
        {showSpotifyModal && (
          <SpotifyModal onClose={() => setShowSpotifyModal(false)} onContinue={goToSite} />
        )}
      </AnimatePresence>

      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-[#252118]">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(240,96,158,0.12) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
          <FadeUp>
            <Link href="/#projects" className="inline-flex items-center gap-2 text-[11px] text-[#4A4540] hover:text-[#8B8178] transition-colors mb-8">
              ← Back to projects
            </Link>
          </FadeUp>

          <FadeUp delay={0.05}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background: PINK }} />
              <span className="text-[10px] font-medium tracking-[0.25em] uppercase" style={{ color: PINK }}>
                Creative · Music Tech · Solo Build
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6">
              Meloet<span style={{ color: PINK }} className="italic">tify</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.18}>
            <p className="text-xl text-[#8B8178] leading-relaxed max-w-2xl mb-10">
              A web app that analyzes your Spotify listening history and assigns you a Pokémon that represents your music taste. Real matching engine, real genre science, zero guessing.
            </p>
          </FadeUp>

          <FadeUp delay={0.22} className="flex flex-wrap gap-3 mb-10">
            <TypeBadge type="Vanilla JS" color={PINK} />
            <TypeBadge type="Vite" color={PINK} />
            <TypeBadge type="Spotify API" color={PINK} />
            <TypeBadge type="Last.fm API" color={PINK} />
            <TypeBadge type="Vercel" color={PINK} />
            <TypeBadge type="Solo Project" color={PINK} />
          </FadeUp>

          {/* Cover image */}
          <FadeUp delay={0.26}>
            <div className="relative rounded-2xl overflow-hidden border border-[#252118] mx-auto" style={{ maxWidth: 860 }}>
              <Image src="/Meloettify/www.meloettify.online_.png" alt="Meloettify cover"
                width={860} height={480} className="w-full h-auto" priority />
            </div>
          </FadeUp>

          {/* Live button — under cover */}
          <FadeUp delay={0.32} className="mt-8 mb-4 flex justify-center">
            <LiveButton size="lg" onClickOverride={openLive} />
          </FadeUp>

          {/* Pokémon showcase strip */}
          <FadeUp delay={0.4} className="mt-12">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-6 text-center">some of the pokémon waiting for you</p>
            <div className="flex flex-wrap justify-center gap-8">
              <PokemonSprite {...PKM.meloetta}   size={90} delay={0}    />
              <PokemonSprite {...PKM.milotic}    size={90} delay={0.06} />
              <PokemonSprite {...PKM.vaporeon}   size={90} delay={0.12} />
              <PokemonSprite {...PKM.sylveon}    size={90} delay={0.18} />
              <PokemonSprite {...PKM.gengar}     size={90} delay={0.24} />
              <PokemonSprite {...PKM.toxtricity} size={90} delay={0.30} />
              <PokemonSprite {...PKM.marshadow}  size={90} delay={0.36} />
              <PokemonSprite id={133} name="Eevee" size={90} delay={0.42} />
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex gap-16 lg:gap-24">
          <aside className="hidden lg:block shrink-0">
            <TableOfContents active={activeSection} />
          </aside>

          <main className="flex-1 min-w-0">

            {/* Overview */}
            <Section id="overview" onVisible={setActiveSection}>
              <SectionLabel text="Overview" />
              <FadeUp>
                <h2 className="font-display text-4xl font-bold text-[#F5EFE8] mb-6 leading-tight">
                  Your music taste,<br />
                  <span className="italic" style={{ color: PINK }}>as a Pokémon.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="text-[#8B8178] text-base leading-relaxed mb-6">
                  Meloettify takes your real Spotify data (your top 50 artists and top 50 tracks), runs it through a custom scoring engine, and assigns you a Pokémon that represents your music identity. Not a vibe quiz. Not a random generator. A real algorithm with genre science under the hood. It also comes with 18 customized Spotify playlists — one for every Pokémon type.
                </p>
                <p className="text-[#8B8178] text-base leading-relaxed mb-10">
                  The name blends <span style={{ color: PINK_LIGHT }}>Meloetta</span> (the music Pokémon) with Spotify. Pure vanilla JavaScript and a custom SPA router. No React, no framework, no shortcuts.
                </p>
              </FadeUp>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard stat="~5,600" label="Lines of code" highlight delay={0} />
                <StatCard stat="18"     label="Pokémon types fully defined" delay={0.05} />
                <StatCard stat="260"    label="Curated Pokémon in the database" delay={0.1} />
                <StatCard stat="6"      label="Pokémon assigned per user" delay={0.15} />
              </div>
            </Section>

            {/* Origin */}
            <Section id="origin" onVisible={setActiveSection}>
              <SectionLabel text="The Origin Story" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-6">
                  Two childhood obsessions,<br />
                  <span className="italic" style={{ color: PINK }}>finally merged.</span>
                </h2>
              </FadeUp>
              <div className="space-y-5 mb-8">
                <FadeUp delay={0.08}>
                  <div className="p-6 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                    <p className="text-[#8B8178] text-sm leading-relaxed">
                      Growing up, two things stuck with me: Pokémon and playlists. Not just listening to music. <em className="text-[#F5EFE8]">Curating</em> it. I have 100+ Spotify playlists, each built around a specific feeling or atmosphere rather than a genre. The philosophy: the feeling comes first.
                    </p>
                  </div>
                </FadeUp>
                <FadeUp delay={0.12}>
                  <div className="p-6 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                    <p className="text-[#8B8178] text-sm leading-relaxed">
                      At one point I actually completed the Pokédex and caught them all. It was a huge part of my childhood that stuck around for years. And then one day the question hit: <em style={{ color: PINK_LIGHT }}>what if these two things could live in the same place?</em>
                    </p>
                  </div>
                </FadeUp>
                <FadeUp delay={0.16}>
                  <div className="p-6 rounded-xl border" style={{ borderColor: `${PINK}30`, background: `${PINK}08` }}>
                    <p className="text-[#F5EFE8] text-sm leading-relaxed italic">
                      &quot;I wanted to take the way I naturally think about music and mix it with something I loved growing up. It started as a small passion project and turned into something real. A labor of love developed over weeks because I cared enough about both things to do them justice.&quot;
                    </p>
                  </div>
                </FadeUp>
              </div>
              <FadeUp delay={0.2}>
                <div className="flex items-center gap-6 p-6 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                  <Image src={sprite(PKM.meloetta.id)} alt="Meloetta" width={80} height={80} className="drop-shadow-lg shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5EFE8] mb-1">Why Meloetta?</h4>
                    <p className="text-xs text-[#8B8178] leading-relaxed">
                      Meloetta is the Melody Pokémon, a Normal/Psychic type whose song has the power to change the emotions of those who hear it. It was the obvious namesake. The name &quot;Meloettify&quot; basically wrote itself.
                    </p>
                  </div>
                </div>
              </FadeUp>
            </Section>

            {/* Tech Stack */}
            <Section id="tech" onVisible={setActiveSection}>
              <SectionLabel text="Tech Stack" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-4">
                  No framework. Just <span className="italic" style={{ color: PINK }}>code.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.08}>
                <p className="text-[#8B8178] text-sm leading-relaxed mb-8">
                  Built with zero frameworks. Pure vanilla JavaScript ES modules with a custom SPA router handling all navigation and state. A deliberate choice to stay close to the metal and understand every part of what was being built.
                </p>
              </FadeUp>
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {[
                  { name: "Vanilla JS ES Modules", desc: "No React, no Vue. Pure DOM manipulation with a custom-built SPA router." },
                  { name: "Vite",                  desc: "Build tool and dev server. Clean, fast, and minimal config." },
                  { name: "Spotify Web API",        desc: "OAuth PKCE flow. Fetches top 50 artists and top 50 tracks per user." },
                  { name: "Last.fm API",            desc: "Fallback crowd-sourced genre tags for artists not in the curated database." },
                  { name: "html2canvas",            desc: "In-browser DS trainer card generation. 1080x1920 PNG, downloadable." },
                  { name: "Vercel",                 desc: "Deployed with a custom vercel.json for SPA routing." },
                ].map((item, i) => (
                  <FadeUp key={item.name} delay={i * 0.05}>
                    <div className="p-5 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                      <h4 className="text-sm font-semibold mb-1" style={{ color: PINK_LIGHT }}>{item.name}</h4>
                      <p className="text-[#8B8178] text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
              <FadeUp delay={0.1}>
                <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4A4540] mb-4">Code scale</h3>
                <div className="rounded-xl border border-[#252118] bg-[#0f0d0b] px-6 py-2 overflow-x-auto">
                  <CodeLine file="style.css"               lines="1,407" purpose="All styling: dark theme, glassmorphism, type colors" />
                  <CodeLine file="src/pages/results.js"    lines="562"   purpose="Results page: hero card, team of 6, radar chart, share" />
                  <CodeLine file="src/data/pokemon-db.js"  lines="432"   purpose="Curated database of 260 Pokémon with traits and roles" />
                  <CodeLine file="src/engine/scoring.js"   lines="310"   purpose="The core matching algorithm" />
                  <CodeLine file="src/ui/share-card.js"    lines="355"   purpose="DS-style trainer card generation (1080x1920 PNG)" />
                  <CodeLine file="src/data/type-defs.js"   lines="239"   purpose="18 Pokémon type definitions with mood tags and genre keywords" />
                  <CodeLine file="src/main.js"             lines="262"   purpose="App orchestrator and SPA router" />
                  <CodeLine file="src/pages/landing.js"    lines="283"   purpose="Landing page with celebrity cards" />
                  <CodeLine file="src/data/artist-tags.js" lines="207"   purpose="Curated artist to mood tag database (~200 major artists)" />
                  <CodeLine file="..."                     lines="~800"  purpose="Auth, API, charts, quiz, manual input, components, modals" />
                  <div className="flex items-center gap-4 py-3 mt-1">
                    <span className="font-mono text-xs font-bold w-48 shrink-0" style={{ color: PINK }}>Total</span>
                    <span className="font-mono text-xs font-bold w-16 shrink-0 text-right" style={{ color: PINK }}>~5,655</span>
                    <span className="text-xs text-[#4A4540]">lines across 20+ files</span>
                  </div>
                </div>
              </FadeUp>
            </Section>

            {/* Algorithm */}
            <Section id="algorithm" onVisible={setActiveSection}>
              <SectionLabel text="The Algorithm" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-4">
                  Real genre science,<br />
                  <span className="italic" style={{ color: PINK }}>not a random quiz.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.08}>
                <p className="text-[#8B8178] text-sm leading-relaxed mb-10">
                  Three input paths feed one scoring engine. Every path converges on the same output: a primary type, secondary type, 8 dimension scores, and a matched Pokémon.
                </p>
              </FadeUp>
              <div>
                <AlgorithmStep step="1" title="Data Ingestion" delay={0}>
                  <p>Three possible paths:</p>
                  <ul className="mt-2 space-y-1 list-none">
                    <li className="flex gap-2"><span style={{ color: PINK }}>→</span><span><strong className="text-[#F5EFE8]">Spotify OAuth:</strong> fetches your real top 50 artists and top 50 tracks</span></li>
                    <li className="flex gap-2"><span style={{ color: PINK }}>→</span><span><strong className="text-[#F5EFE8]">Manual input:</strong> type artist names, fetched against Last.fm</span></li>
                    <li className="flex gap-2"><span style={{ color: PINK }}>→</span><span><strong className="text-[#F5EFE8]">Quiz:</strong> 10 atmospheric questions that map to mood tags</span></li>
                  </ul>
                </AlgorithmStep>
                <AlgorithmStep step="2" title="Tag Extraction" delay={0.05}>
                  <p>Each artist is converted to weighted mood tags via a priority chain:</p>
                  <ol className="mt-2 space-y-1 list-none">
                    <li className="flex gap-2"><span style={{ color: PINK }}>1.</span><span>Carefully curated <code className="text-xs bg-[#1a1510] px-1.5 py-0.5 rounded text-[#F0609E]">artist-tags.js</code> database covering ~200 major artists</span></li>
                    <li className="flex gap-2"><span style={{ color: PINK }}>2.</span><span>Last.fm API for crowd-sourced genre tags</span></li>
                    <li className="flex gap-2"><span style={{ color: PINK }}>3.</span><span>Spotify&apos;s own genre strings as a final fallback</span></li>
                  </ol>
                  <p className="mt-2">Tags include moods like: ethereal, nocturnal, explosive, melancholic, theatrical, dreamy.</p>
                </AlgorithmStep>
                <AlgorithmStep step="3" title="Scoring Engine (scoring.js)" delay={0.1}>
                  <p>Tags are scored against all 18 Pokémon type definitions. Three mechanics prevent boring results:</p>
                  <ul className="mt-2 space-y-1.5">
                    <li className="flex gap-2"><span style={{ color: PINK }}>→</span><span><strong className="text-[#F5EFE8]">Popularity weighting:</strong> niche genres (shoegaze, darkwave, witch house) score ×1.1; common genres (pop, rap, edm) score ×0.9</span></li>
                    <li className="flex gap-2"><span style={{ color: PINK }}>→</span><span><strong className="text-[#F5EFE8]">Diminishing returns:</strong> repeated hits to the same type decay [1.0, 0.85, 0.70, 0.60]</span></li>
                    <li className="flex gap-2"><span style={{ color: PINK }}>→</span><span><strong className="text-[#F5EFE8]">8 Music Dimensions:</strong> Energy, Darkness, Emotion, Chaos, Richness, Nostalgia, Underground, Danceability scored in parallel</span></li>
                  </ul>
                </AlgorithmStep>
                <AlgorithmStep step="4" title="Pokémon Selection (pokemon-picker.js)" delay={0.15}>
                  <p>Finds Pokémon in the database whose type combo matches your primary and secondary types, then ranks them by how many of your top mood tags match that Pokémon&apos;s trait list. Returns one Signature Pokémon: the closest match.</p>
                  <div className="mt-4 flex items-center gap-4 p-4 rounded-xl border border-[#252118] bg-[#141210]">
                    <Image src={sprite(PKM.milotic.id)} alt="Milotic" width={64} height={64} className="drop-shadow-lg shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[#F5EFE8]">Example: Water / Fairy type gets Milotic</p>
                      <p className="text-xs text-[#8B8178] mt-0.5">Graceful and emotionally vast. Your taste moves with undeniable beauty.</p>
                    </div>
                  </div>
                </AlgorithmStep>
              </div>
            </Section>

            {/* Team Builder */}
            <Section id="team-builder" onVisible={setActiveSection}>
              <SectionLabel text="Team Builder" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-4">
                  Everyone gets <span className="italic" style={{ color: PINK }}>six.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.08}>
                <p className="text-[#8B8178] text-sm leading-relaxed mb-8">
                  Beyond your Signature Pokémon, the team builder assigns 5 more, each one revealing a different dimension of your listening taste. One result would miss the nuance. Six tells the real story.
                </p>
              </FadeUp>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { role: "Core Identity",   desc: "Strongest type match, your main result",         color: PINK,       pkm: PKM.milotic   },
                  { role: "B-Side",          desc: "The secondary dimension of your sound",           color: "#9B7FD4",  pkm: PKM.gengar    },
                  { role: "Comfort Pick",    desc: "Warm, nostalgic, gentle tags",                    color: "#C4A44A",  pkm: PKM.snorlax   },
                  { role: "Hype Pick",       desc: "Bold, explosive, kinetic tags",                   color: "#CC5B7A",  pkm: PKM.arcanine  },
                  { role: "Sad Pick",        desc: "Melancholic, wistful, bittersweet tags",          color: "#4A8B6A",  pkm: PKM.swellow   },
                  { role: "Late Night Pick", desc: "Nocturnal, atmospheric, shadowy tags",            color: "#5BAECC",  pkm: PKM.marshadow },
                ].map((item, i) => (
                  <FadeUp key={item.role} delay={i * 0.05}>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                      <Image src={sprite(item.pkm.id)} alt={item.pkm.name} width={52} height={52} className="drop-shadow-lg shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold mb-0.5" style={{ color: item.color }}>{item.role}</h4>
                        <p className="text-xs text-[#8B8178]">{item.desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </Section>

            {/* Pages */}
            <Section id="pages" onVisible={setActiveSection}>
              <SectionLabel text="Pages & Features" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-8">
                  Built out end-to-end,<br />
                  <span className="italic" style={{ color: PINK }}>every screen.</span>
                </h2>
              </FadeUp>
              <div className="space-y-4">
                {[
                  { name: "Landing Page",           desc: "Three entry paths (Spotify / Quiz / Manual). Celebrity example cards with A$AP Rocky, Taylor Swift, Frank Ocean, Skrillex and more — added to give visitors a tangible feel for results before any real users could test it, acting as social proof through recognizable names. Full type grid showing all 18 types." },
                  { name: "How It Works",           desc: "Plain-language walkthrough of the algorithm, step by step, for users who want to understand what's actually happening with their data." },
                  { name: "About / Why It Was Made",desc: "A letter about growing up with Pokémon, obsessing over playlists, and why those two things belong together. Signs off as a Water type with Milotic as my partner Pokémon." },
                  { name: "Pokédex",                desc: "Browsable gallery of all 260 Pokémon in the database with type labels, traits, roles, and rarity tiers: common, signature, and legendary." },
                  { name: "Quiz",                   desc: "8 atmospheric questions with emoji answers that map directly to mood tags and feed the scoring engine." },
                  { name: "Results",                desc: "The payoff. Full type identity breakdown, Signature Pokémon with animated type-colored orbs, team of 6 with role explanations, radar chart across 8 music dimensions, professor narration paragraph, and share card generation." },
                ].map((page, i) => (
                  <FadeUp key={page.name} delay={i * 0.06}>
                    <div className="flex gap-5 p-5 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                      <div className="w-1 rounded-full shrink-0 self-stretch" style={{ background: `${PINK}40` }} />
                      <div>
                        <h4 className="text-sm font-semibold text-[#F5EFE8] mb-1.5">{page.name}</h4>
                        <p className="text-xs text-[#8B8178] leading-relaxed">{page.desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </Section>

            {/* Share Card */}
            <Section id="share-card" onVisible={setActiveSection}>
              <SectionLabel text="The Share Card" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-4">
                  A DS trainer card,<br />
                  <span className="italic" style={{ color: PINK }}>generated in-browser.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.08}>
                <p className="text-[#8B8178] text-sm leading-relaxed mb-8">
                  After getting results, users can generate a DS Pokémon trainer card styled to look like a real in-game card. Downloadable as a PNG to share on social media and built entirely in the browser with no server using html2canvas.
                </p>
              </FadeUp>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "Format",         value: "1080x1920 PNG, optimized for Stories" },
                  { label: "Trainer sprites",value: "6 options: Lucas, Dawn, Hilbert, Hilda, N, Cynthia" },
                  { label: "Card contents",  value: "Trainer sprite, Signature Pokémon, full team of 6, type badge, username" },
                  { label: "Rendering",      value: "html2canvas. No server, no upload, no data stored." },
                ].map((item, i) => (
                  <FadeUp key={item.label} delay={i * 0.05}>
                    <div className="p-4 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                      <p className="text-[10px] font-medium tracking-[0.15em] uppercase mb-1.5" style={{ color: PINK }}>{item.label}</p>
                      <p className="text-sm text-[#F5EFE8]">{item.value}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </Section>

            {/* Design Language */}
            <Section id="design" onVisible={setActiveSection}>
              <SectionLabel text="Design Language" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-4">
                  Type-colored,<br />
                  <span className="italic" style={{ color: PINK }}>glass everything.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.08}>
                <p className="text-[#8B8178] text-sm leading-relaxed mb-8">
                  1,407 lines of CSS. Every visual decision reinforces the idea that your result is personal and dynamic. The colors literally change based on who you are.
                </p>
              </FadeUp>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Dark theme only",        desc: "Near-black background (#0a0a14). No light mode. The aesthetic demands it." },
                  { label: "Animated orbs",          desc: "Blurred floating blobs behind your Pokémon that shift color to match your matched type." },
                  { label: "Glassmorphism",          desc: "Cards with backdrop-filter blur, giving depth without noise." },
                  { label: "Type-colored everything",desc: "Headers, badges, glows, and borders all inherit from your matched type's color hex." },
                  { label: "CSS-only animations",    desc: "No animation library. Pure CSS keyframes and transitions throughout." },
                  { label: "1,407 lines",            desc: "Every breakpoint, every hover state, every glow." },
                ].map((item, i) => (
                  <FadeUp key={item.label} delay={i * 0.05}>
                    <div className="p-5 rounded-xl border border-[#252118] bg-[#0f0d0b] h-full">
                      <h4 className="text-sm font-semibold mb-2" style={{ color: PINK_LIGHT }}>{item.label}</h4>
                      <p className="text-xs text-[#8B8178] leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </Section>

            {/* Data Design */}
            <Section id="data" onVisible={setActiveSection}>
              <SectionLabel text="Data Design" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-4">
                  260 Pokémon,<br />
                  <span className="italic" style={{ color: PINK }}>all carefully chosen.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.08}>
                <p className="text-[#8B8178] text-sm leading-relaxed mb-8">
                  Not all 1,000+ Pokémon. Only the ones that actually mean something to me. Every entry personally chosen, every flavor text deliberate and intentional. No procedural generation.
                </p>
              </FadeUp>
              <div className="space-y-3 mb-10">
                {[
                  { title: "Rarity tiers",     body: "Common, Signature, and Legendary. Legendaries are reserved only for truly extreme or distinctive listening profiles. Getting one means something." },
                  { title: "Trait vocabulary", body: "A canonical pool of 50+ mood descriptors that all Pokémon entries draw from. This shared vocabulary is what makes the matching engine coherent." },
                  { title: "18 type definitions", body: "Each type has a hex color, glow color, text color, mood tag set, vibe description, example artists, and genre keywords. All written with intention." },
                ].map((item, i) => (
                  <FadeUp key={item.title} delay={i * 0.06}>
                    <div className="p-5 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                      <h4 className="text-sm font-semibold text-[#F5EFE8] mb-2">{item.title}</h4>
                      <p className="text-xs text-[#8B8178] leading-relaxed">{item.body}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>

              {/* Celebrity cards */}
              <FadeUp delay={0.1}>
                <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4A4540] mb-4">Celebrity card examples</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { artist: "A$AP Rocky",  pkm: PKM.gengar,     type: "Ghost / Dark",     reason: "Dark, aggressive energy. Experimental, nocturnal, confrontational." },
                    { artist: "Taylor Swift", pkm: PKM.sylveon,   type: "Fairy",            reason: "Emotional, beloved, devastatingly effective. Fairy type was written for her." },
                    { artist: "Frank Ocean",  pkm: PKM.vaporeon,  type: "Water",            reason: "Fluid, introspective, deeply felt. Nostalgia and ache in every note." },
                    { artist: "Skrillex",     pkm: PKM.toxtricity,type: "Electric / Poison", reason: "Chaotic, electric, loud. Toxtricity literally plays guitar and screams." },
                    { artist: "The Beatles",  pkm: { id: 133, name: "Eevee" },  type: "Normal", reason: "Versatile, beloved, genre-defying across every era. The Pokémon of potential." },
                    { artist: "Nirvana",      pkm: PKM.marshadow, type: "Ghost / Fighting", reason: "Ghostly, volatile, culturally permanent. The ultimate underground legend." },
                  ].map((item, i) => (
                    <FadeUp key={item.artist} delay={i * 0.05}>
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                        <Image src={sprite(item.pkm.id)} alt={item.pkm.name} width={52} height={52} className="drop-shadow-lg shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-xs font-semibold text-[#F5EFE8]">{item.artist}</span>
                            <span className="text-[10px] text-[#4A4540]">→</span>
                            <span className="text-xs font-semibold" style={{ color: PINK }}>{item.pkm.name}</span>
                          </div>
                          <p className="text-[10px] text-[#4A4540] mb-1">{item.type}</p>
                          <p className="text-[11px] text-[#8B8178] leading-snug">{item.reason}</p>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </FadeUp>
            </Section>

            {/* Reflection */}
            <Section id="reflection" onVisible={setActiveSection}>
              <SectionLabel text="Reflection" />
              <FadeUp>
                <h2 className="font-display text-3xl font-bold text-[#F5EFE8] mb-6">
                  Built because it<br />
                  <span className="italic" style={{ color: PINK }}>had to exist.</span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.08}>
                <p className="text-[#8B8178] text-base leading-relaxed mb-5">
                  Meloettify wasn&apos;t built to impress anyone. It was built because the idea was too good to leave as just an idea. The tech stack was chosen deliberately — vanilla JS to stay close to the metal, keeping the whole thing transparent and understandable.
                </p>
                <p className="text-[#8B8178] text-base leading-relaxed mb-5">
                  What makes it interesting isn&apos;t the code scale. It&apos;s that every Pokémon description, every celebrity card justification, every type vibe was deliberate and intentional. The algorithm has a soul because I actually care about both things it&apos;s connecting.
                </p>
                <p className="text-[#8B8178] text-base leading-relaxed mb-8">
                  More than anything, it was an incredible way to grow as a developer. Learning is always faster when you&apos;re building something you actually care about — and caring deeply about both Pokémon and music meant I was genuinely excited to solve every problem that came up. The passion made the hard parts worth it.
                </p>
              </FadeUp>

              <FadeUp delay={0.12}>
                <div className="p-8 rounded-2xl border mb-8" style={{ borderColor: `${PINK}30`, background: `${PINK}08` }}>
                  <p className="font-display text-xl text-[#F5EFE8] leading-relaxed italic mb-4">
                    &quot;I hope it makes you smile, or at least makes you feel seen by your results.&quot;
                  </p>
                  <p className="text-xs text-[#4A4540]">from the Meloettify About page</p>
                </div>
              </FadeUp>

              {/* Val's result */}
              <FadeUp delay={0.16}>
                <div className="flex items-center gap-5 p-5 rounded-xl border border-[#252118] bg-[#0f0d0b] mb-10">
                  <Image src={sprite(PKM.milotic.id)} alt="Milotic" width={80} height={80} className="drop-shadow-lg shrink-0" />
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.15em] uppercase mb-1" style={{ color: PINK }}>My result</p>
                    <p className="text-base font-semibold text-[#F5EFE8]">Water / Fairy type. Milotic.</p>
                    <p className="text-xs text-[#8B8178] mt-1">&quot;Graceful and emotionally vast. Your taste moves with undeniable beauty.&quot;</p>
                  </div>
                </div>
              </FadeUp>

              {/* Trainer card */}
              <FadeUp delay={0.2}>
                <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4A4540] mb-5">my trainer card</h3>
                <div className="flex justify-center">
                  <div className="relative rounded-2xl overflow-hidden border border-[#252118]" style={{ maxWidth: 340 }}>
                    <Image
                      src="/Meloettify/Trainer Card.png"
                      alt="Val Chen's Meloettify trainer card"
                      width={340}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <p className="text-center text-[11px] text-[#4A4540] mt-3">Water / Fairy type · Milotic · meloettify.online</p>
              </FadeUp>

              {/* Bottom CTA */}
              <FadeUp delay={0.24} className="mt-14 flex flex-col items-center gap-4 text-center">
                <p className="text-[#8B8178] text-sm">What&apos;s your type?</p>
                <LiveButton size="lg" onClickOverride={openLive} />
                <Link href="/#projects" className="text-sm text-[#4A4540] hover:text-[#8B8178] transition-colors duration-200 mt-2">
                  ← Back to all projects
                </Link>
              </FadeUp>
            </Section>

          </main>
        </div>
      </div>
    </div>
  );
}
