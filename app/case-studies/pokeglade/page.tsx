"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ─── TOC ──────────────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: "overview",  label: "Overview" },
  { id: "core-loop", label: "Core Loop" },
  { id: "origins",   label: "Origins" },
  { id: "traits",    label: "Traits" },
  { id: "evolution", label: "Evolution" },
  { id: "team",      label: "Team & AFK" },
  { id: "store",     label: "Store" },
  { id: "pokedex",   label: "Pokédex" },
  { id: "pvp",       label: "PVP & Social" },
  { id: "tech",      label: "Tech Stack" },
  { id: "changelog", label: "Changelog" },
];

const POKE_GREEN = "#4CAF7D";
const POKE_LIGHT = "#7ECDA0";

// ─── TOC sidebar ──────────────────────────────────────────────────────────────
function TableOfContents({ active }: { active: string }) {
  return (
    <nav className="sticky top-28 flex flex-col gap-0.5 w-48 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
      <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540] mb-4">
        Contents
      </p>
      {TOC_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex items-center gap-3 py-2 transition-all duration-200"
          >
            <span
              className="h-px transition-all duration-300 shrink-0"
              style={{ width: isActive ? "20px" : "8px", background: isActive ? POKE_GREEN : "#3A3530" }}
            />
            <span
              className="text-sm font-medium transition-colors duration-200 leading-tight"
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -50% 0px" });
  if (inView) onVisible(id);
  return (
    <section id={id} ref={ref} className="scroll-mt-28 mb-24">
      {children}
    </section>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-6 h-px" style={{ background: POKE_GREEN }} />
      <span className="text-[10px] font-medium tracking-[0.25em] uppercase" style={{ color: POKE_GREEN }}>
        {text}
      </span>
    </div>
  );
}

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.43, 0.195, 0.02, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatCard({
  stat,
  label,
  highlight,
  delay = 0,
}: {
  stat: string;
  label: string;
  highlight?: boolean;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.43, 0.195, 0.02, 1] }}
      className={`rounded-2xl border p-6 ${highlight ? "border-[#4CAF7D]/40 bg-[#0a1a10]" : "border-[#252118] bg-[#0f0d0b]"}`}
    >
      <p className="font-display text-4xl font-bold mb-2" style={{ color: highlight ? POKE_LIGHT : "#F5EFE8" }}>
        {stat}
      </p>
      <p className="text-[#8B8178] text-sm leading-relaxed">{label}</p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PokeGladeCaseStudy() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#F5EFE8]">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0A0908]/80 backdrop-blur-md border-b border-[#1E1B17]">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[#8B8178] hover:text-[#F5EFE8] transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>
        <span className="text-xs tracking-widest uppercase text-[#4A4540]">Arcade · PokeGlade</span>
        <div className="w-16" />
      </header>

      {/* ── Layout ── */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex gap-14">
        <div className="flex-1 min-w-0">

          {/* ════ OVERVIEW ════════════════════════════════ */}
          <Section id="overview" onVisible={setActiveSection}>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.43, 0.195, 0.02, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4CAF7D]/30 bg-[#4CAF7D]/[0.08] mb-8">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: POKE_GREEN }} />
                <span className="text-[11px] font-medium tracking-wide" style={{ color: POKE_LIGHT }}>
                  Alpha v0.1 · Browser-Based Idle Game
                </span>
              </div>

              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-[#F5EFE8] leading-tight tracking-tight mb-4">
                Poke<span className="italic" style={{ color: POKE_LIGHT }}>Glade</span>
              </h1>

              <p className="text-[#8B8178] text-lg leading-relaxed max-w-xl mb-12">
                A browser-based idle Pokémon adventure built entirely in vanilla JS —
                with a full physics-backed catch mini-game, 10 spawn origins, 50+ traits,
                real-time link trades, and async PVP.
              </p>

              <div className="flex flex-wrap gap-6 mb-16 pb-16 border-b border-[#252118]">
                {[
                  { label: "Stack",    value: "Vanilla JS · HTML · CSS" },
                  { label: "Data",     value: "PokéAPI + Supabase" },
                  { label: "Hosting",  value: "Vercel · pokeglade.site" },
                  { label: "Version",  value: "Alpha v0.1 (v0.5 internally)" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540]">{label}</span>
                    <span className="text-sm text-[#8B8178]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatCard stat="60+"  label="Git commits" delay={0.1} />
                <StatCard stat="5"    label="Major versions shipped" delay={0.2} />
                <StatCard stat="900"  label="PC box slots (30×30)" delay={0.3} />
                <StatCard stat="50+"  label="Unique traits in Distortion World" delay={0.4} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="rounded-2xl overflow-hidden border border-[#252118]"
              >
                <Image
                  src="/PokeGlade/PokeGlade Home Screen.jpg"
                  alt="PokeGlade Home Screen"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                  priority
                />
              </motion.div>
            </motion.div>
          </Section>

          {/* ════ CORE LOOP ═══════════════════════════════ */}
          <Section id="core-loop" onVisible={setActiveSection}>
            <SectionLabel text="Gameplay" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              Core Game Loop
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              A wild Pokémon spawns in your queue roughly every 60 seconds — faster as you hit
              milestones. Each encounter gives you three choices.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {[
                {
                  action: "FIGHT",
                  color: "#C45C5C",
                  icon: "⚔",
                  body: "Your lead Pokémon auto-battles the wild one. Your entire team earns EXP through an XP-All mechanic — the fastest way to level up passively.",
                  delay: 0,
                },
                {
                  action: "CATCH",
                  color: POKE_GREEN,
                  icon: "◎",
                  body: "A timing mini-game launches: land a bouncing marker inside a shrinking green zone across 3 shakes. Higher catch rate = wider zone. Better balls slow the marker down.",
                  delay: 0.1,
                },
                {
                  action: "SKIP",
                  color: "#6B6560",
                  icon: "→",
                  body: "Dismiss the encounter and wait for the next spawn. Useful when you're saving balls or holding out for rarer origins.",
                  delay: 0.2,
                },
              ].map((item) => (
                <FadeUp key={item.action} delay={item.delay}>
                  <div
                    className="rounded-2xl border bg-[#0f0d0b] p-7 h-full"
                    style={{ borderColor: `${item.color}40` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5"
                      style={{ background: `${item.color}20`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <p className="font-display text-lg font-bold mb-3" style={{ color: item.color }}>
                      {item.action}
                    </p>
                    <p className="text-[#8B8178] text-sm leading-relaxed">{item.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.2}>
              <div className="rounded-2xl overflow-hidden border border-[#252118]">
                <Image
                  src="/PokeGlade/PokeGlade Loading.png"
                  alt="PokeGlade Loading Screen"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                />
              </div>
            </FadeUp>
          </Section>

          {/* ════ ORIGINS ═════════════════════════════════ */}
          <Section id="origins" onVisible={setActiveSection}>
            <SectionLabel text="Spawn System" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              10 Origins
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              Every wild Pokémon rolls one of 10 origins at spawn. Origins tint the sprite in
              real-time via CSS filters and stack multiplicatively with Traits in battle.
              Rarity Charm divides the Normal pool by 4×.
            </p>

            <FadeUp>
              <div className="overflow-x-auto rounded-2xl border border-[#252118] mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#252118]">
                      <th className="p-4 text-left text-[#4A4540] font-medium">Origin</th>
                      <th className="p-4 text-left text-[#4A4540] font-medium">Rate</th>
                      <th className="p-4 text-left text-[#F5EFE8] font-semibold" style={{ background: `${POKE_GREEN}10` }}>Effect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { origin: "Normal",  rate: "62.5%", effect: "No bonus",                    color: "#8B8178" },
                      { origin: "Berserk", rate: "7%",    effect: "+25% ATK",                    color: "#C45C5C" },
                      { origin: "Armored", rate: "7%",    effect: "+25% DEF",                    color: "#7B8FAB" },
                      { origin: "Phantom", rate: "7%",    effect: "+25% SPD",                    color: "#9B7FD4" },
                      { origin: "Giant",   rate: "5%",    effect: "+25% HP · bigger sprite",     color: "#8B6B4A" },
                      { origin: "Arcane",  rate: "3%",    effect: "+25% Sp.ATK",                 color: "#5B9BD4" },
                      { origin: "Ancient", rate: "3%",    effect: "+25% Sp.DEF",                 color: "#4A8B6A" },
                      { origin: "Gilded",  rate: "3%",    effect: "1.5× earnings",               color: "#C4A44A" },
                      { origin: "Void",    rate: "2%",    effect: "+25% all stats",              color: "#6B5EA7" },
                      { origin: "Shiny",   rate: "0.5%",  effect: "+25% all stats · 2× earnings · shiny sprite", color: "#FFD700" },
                    ].map((row, i) => (
                      <motion.tr
                        key={row.origin}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="border-b border-[#252118] last:border-0"
                      >
                        <td className="p-4 bg-[#0f0d0b]">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
                            <span className="font-medium" style={{ color: row.color }}>{row.origin}</span>
                          </div>
                        </td>
                        <td className="p-4 bg-[#0f0d0b] text-[#8B8178] font-mono text-xs">{row.rate}</td>
                        <td className="p-4 bg-[#0f0d0b] text-[#8B8178] text-xs">{row.effect}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div
                className="p-5 rounded-xl border flex items-start gap-3"
                style={{ borderColor: `${POKE_GREEN}30`, background: "#0a1a10" }}
              >
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: POKE_GREEN }} />
                <p className="text-[#8B8178] text-sm leading-relaxed">
                  Origins are applied via CSS{" "}
                  <span className="text-[#F5EFE8] font-medium">filter/tint overlays</span> on the live
                  PokéAPI sprite — no pre-rendered assets needed. Void and Shiny are the only origins
                  that guarantee{" "}
                  <span style={{ color: POKE_LIGHT }} className="font-medium">31 IVs across all 6 stats</span>.
                </p>
              </div>
            </FadeUp>
          </Section>

          {/* ════ TRAITS ══════════════════════════════════ */}
          <Section id="traits" onVisible={setActiveSection}>
            <SectionLabel text="Distortion World" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              Trait System
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              Separate from Origins, every Pokémon has a hidden Trait rolled in Giratina&apos;s realm.
              6 tiers, 50+ unique traits — each with its own stat delta table. Costs ¥200k to reroll,
              with a slot-machine animation and IV locking for competitive optimization.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {[
                { tier: "Legendary", color: "#FFD700", desc: "Massive cross-stat boosts. Rarest outcome." },
                { tier: "Strong",    color: "#9B7FD4", desc: "Significant buff to 2–3 stats." },
                { tier: "Decent",    color: POKE_GREEN, desc: "Moderate gain, no downside." },
                { tier: "Mixed",     color: "#C4A44A", desc: "Notable buff offset by a minor penalty." },
                { tier: "Quirky",    color: "#7B8FAB", desc: "Minimal or lateral stat shifts." },
                { tier: "Negative",  color: "#C45C5C", desc: "Net stat loss. Reroll recommended." },
              ].map((tier, i) => (
                <FadeUp key={tier.tier} delay={i * 0.08}>
                  <div
                    className="rounded-xl border bg-[#0f0d0b] p-5"
                    style={{ borderColor: `${tier.color}30` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: tier.color }} />
                      <p className="text-sm font-semibold" style={{ color: tier.color }}>{tier.tier}</p>
                    </div>
                    <p className="text-[#8B8178] text-xs leading-relaxed">{tier.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              <FadeUp>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-4">Example Traits</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: "Apex",      delta: "+25% ATK · +20% Sp.ATK · +18% SPD" },
                      { name: "Reckless",  delta: "+18% ATK · −14% DEF" },
                      { name: "Obsessive", delta: "Dynamically boosts highest stat · penalizes lowest" },
                    ].map((t) => (
                      <div key={t.name} className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-[#F5EFE8]">{t.name}</span>
                        <span className="text-xs text-[#8B8178]">{t.delta}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <div className="rounded-2xl overflow-hidden border border-[#252118] h-full min-h-[200px] relative">
                  <Image
                    src="/PokeGlade/Distortion BG.png"
                    alt="Distortion World"
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-[#9B7FD4] mb-1">Giratina&apos;s Realm</p>
                      <p className="text-[#F5EFE8] font-semibold text-sm">Reroll traits · Lock IVs · Optimize builds</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </Section>

          {/* ════ EVOLUTION ═══════════════════════════════ */}
          <Section id="evolution" onVisible={setActiveSection}>
            <SectionLabel text="Progression" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              Evolution System
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              Full PokéAPI evolution chain integration — trigger evolutions directly from the PC box
              without returning to the team view.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              {[
                {
                  type: "Level Evolution",
                  badge: "EVO",
                  body: "An EVO badge appears on the team strip when a Pokémon hits its required level. One tap triggers the evolution sequence.",
                  color: POKE_GREEN,
                  delay: 0,
                },
                {
                  type: "Item Evolution",
                  badge: "ITEM",
                  body: "Fire Stones, Thunder Stones, trade items, and all standard held items — sourced from the store and applied directly in the PC.",
                  color: "#C4A44A",
                  delay: 0.1,
                },
                {
                  type: "Mega Evolution",
                  badge: "MEGA",
                  body: "91 Mega Stones sourced from Legends Z-A. One Mega per team enforced. CS:GO-style reel animation for Mega Stone Pack openings.",
                  color: "#9B7FD4",
                  delay: 0.2,
                },
                {
                  type: "Gigantamax",
                  badge: "G-MAX",
                  body: "G-Max Factor items for compatible species (Charizard, Meowth, Corviknight, etc.). One G-Max per team. Bulbagarden artwork sprites with shiny variant support.",
                  color: "#C45C5C",
                  delay: 0.3,
                },
                {
                  type: "Regional Forms",
                  badge: "FORM",
                  body: "Alolan, Galarian, and Hisuian variants available via a hardcoded lookup table — no API dependency for regional data.",
                  color: "#5B9BD4",
                  delay: 0.4,
                },
              ].map((evo) => (
                <FadeUp key={evo.type} delay={evo.delay}>
                  <div className="flex gap-5 p-6 rounded-2xl border border-[#252118] bg-[#0f0d0b] hover:border-[#4CAF7D]/25 transition-colors">
                    <div className="shrink-0">
                      <div
                        className="px-2 py-1 rounded text-[10px] font-bold font-mono"
                        style={{ background: `${evo.color}20`, color: evo.color }}
                      >
                        {evo.badge}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-[#F5EFE8] mb-1">{evo.type}</p>
                      <p className="text-[#8B8178] text-sm leading-relaxed">{evo.body}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ TEAM & AFK ══════════════════════════════ */}
          <Section id="team" onVisible={setActiveSection}>
            <SectionLabel text="Passive Systems" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              Team & AFK Income
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              Your 6-slot team earns coins passively — even while offline. Income rate is calculated
              per member: <span className="text-[#F5EFE8]">base stat total × level × origin/trait multipliers</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              <FadeUp>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-4">Offline Earnings</p>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: POKE_GREEN }} />
                      <div>
                        <p className="text-sm font-medium text-[#F5EFE8] mb-0.5">Standard</p>
                        <p className="text-xs text-[#8B8178]">50% rate · 5hr cap</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#FFD700" }} />
                      <div>
                        <p className="text-sm font-medium text-[#F5EFE8] mb-0.5">AFK Charm active</p>
                        <p className="text-xs text-[#8B8178]">100% rate · 10hr cap</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#5B9BD4" }} />
                      <div>
                        <p className="text-sm font-medium text-[#F5EFE8] mb-0.5">Welcome Back popup</p>
                        <p className="text-xs text-[#8B8178]">Shows offline earnings on return</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="rounded-2xl overflow-hidden border border-[#252118] h-full min-h-[220px] relative">
                  <Image
                    src="/PokeGlade/Nursery BG.png"
                    alt="Nursery / Training"
                    fill
                    className="object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-end p-6" style={{ background: "linear-gradient(to top, #0a1a10 0%, transparent 60%)" }}>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: POKE_LIGHT }}>Nursery</p>
                      <p className="text-[#F5EFE8] font-semibold text-sm">
                        Feed Oran Berries · Auto-feed every 3s · Spacebar shortcut
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.2}>
              <div className="p-5 rounded-xl border flex items-start gap-3" style={{ borderColor: `${POKE_GREEN}30`, background: "#0a1a10" }}>
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: POKE_GREEN }} />
                <p className="text-[#8B8178] text-sm leading-relaxed">
                  On page load, a{" "}
                  <span className="text-[#F5EFE8] font-medium">spawn catch-up engine</span> simulates every
                  encounter that should have occurred while offline (up to a 100k-iteration safety cap),
                  so the queue is always populated correctly on return.
                </p>
              </div>
            </FadeUp>
          </Section>

          {/* ════ STORE ═══════════════════════════════════ */}
          <Section id="store" onVisible={setActiveSection}>
            <SectionLabel text="Economy" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              Store
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              Spend your passive income on balls, packs, and permanent charms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {[
                {
                  category: "Poké Balls",
                  icon: "◎",
                  color: "#C45C5C",
                  items: ["Poké · Great · Ultra · Master Ball", "Each tier slows the catch-bar marker", "Master Ball guarantees a catch"],
                  delay: 0,
                },
                {
                  category: "Booster Packs",
                  icon: "▦",
                  color: "#C4A44A",
                  items: ["5 tiers: Common → Legendary", "CS:GO reel animation on open", "Upgrade chances per tier (e.g. Common has 0.1% shot at Legendary)"],
                  delay: 0.1,
                },
                {
                  category: "Evolution Items",
                  icon: "✦",
                  color: POKE_GREEN,
                  items: ["All standard stones & held items", "Mega Stone Packs (reel animation)", "Gigantamax Factor Packs"],
                  delay: 0.2,
                },
                {
                  category: "Charms",
                  icon: "★",
                  color: "#9B7FD4",
                  items: ["Egg Charm — 2× EXP", "Coin Charm — 2× money", "Rarity Charm — 4× rare origins", "AFK Charm — no offline penalty"],
                  delay: 0.3,
                },
              ].map((cat) => (
                <FadeUp key={cat.category} delay={cat.delay}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 h-full hover:border-[#4CAF7D]/25 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                        style={{ background: `${cat.color}20`, color: cat.color }}
                      >
                        {cat.icon}
                      </div>
                      <p className="font-semibold text-[#F5EFE8]">{cat.category}</p>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {cat.items.map((item) => (
                        <li key={item} className="flex gap-2 items-start">
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: cat.color }} />
                          <span className="text-[#8B8178] text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ POKÉDEX ═════════════════════════════════ */}
          <Section id="pokedex" onVisible={setActiveSection}>
            <SectionLabel text="Collection" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              Pokédex & Milestones
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              Every species ever caught is logged. Completion milestones unlock compounding rewards —
              making the Pokédex a core progression axis, not just a trophy case.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {[
                { reward: "Coin rewards",              desc: "Lump-sum payouts at key completion thresholds" },
                { reward: "Encounter rate boosts",     desc: "Pokémon spawn faster as your dex fills up" },
                { reward: "Income multipliers",        desc: "Passive team earnings scale with completion %" },
                { reward: "Rarity rate increases",     desc: "Higher odds of rare origins the more you catch" },
              ].map((item, i) => (
                <FadeUp key={item.reward} delay={i * 0.1}>
                  <div className="flex gap-4 p-5 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: POKE_GREEN }} />
                    <div>
                      <p className="text-sm font-semibold text-[#F5EFE8] mb-1">{item.reward}</p>
                      <p className="text-[#8B8178] text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl overflow-hidden border border-[#252118] relative" style={{ minHeight: 200 }}>
                  <Image
                    src="/PokeGlade/Tutorial Landscape.png"
                    alt="Professor Oak Tutorial"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 flex flex-col justify-center">
                  <p className="text-[10px] font-medium tracking-widest uppercase mb-3" style={{ color: POKE_GREEN }}>
                    First-Visit Experience
                  </p>
                  <p className="text-[#F5EFE8] font-semibold mb-2">Professor Oak Tutorial</p>
                  <p className="text-[#8B8178] text-sm leading-relaxed">
                    Dialogue-style walkthrough with full-body FRLG Oak artwork, covering the
                    spawn system, catch mini-game, and Origins — exactly like the main series.
                  </p>
                </div>
              </div>
            </FadeUp>
          </Section>

          {/* ════ PVP & SOCIAL ════════════════════════════ */}
          <Section id="pvp" onVisible={setActiveSection}>
            <SectionLabel text="Competitive & Social" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              PVP & Link Trade
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              Two multiplayer systems — one async, one real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <FadeUp>
                <div
                  className="rounded-2xl border p-7 h-full"
                  style={{ borderColor: `${POKE_GREEN}35`, background: "#0a1a10" }}
                >
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase mb-4" style={{ color: POKE_LIGHT }}>
                    Async PVP · League Points
                  </p>
                  <p className="font-display text-2xl font-bold text-[#F5EFE8] mb-3">Battle the Leaderboard</p>
                  <p className="text-[#8B8178] text-sm leading-relaxed mb-5">
                    Challenge any ranked player — your live team battles a snapshot of their saved
                    team. Win or lose LP based on result. Leaderboard resets weekly via a Vercel
                    serverless cron job at midnight Pacific.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Async battles", "LP leaderboard", "Weekly reset"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-[10px] font-medium border"
                        style={{ borderColor: `${POKE_GREEN}40`, color: POKE_LIGHT, background: `${POKE_GREEN}10` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-7 h-full">
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-4">
                    Real-Time · Link Trade
                  </p>
                  <p className="font-display text-2xl font-bold text-[#F5EFE8] mb-3">Trade with a Friend</p>
                  <p className="text-[#8B8178] text-sm leading-relaxed mb-5">
                    Two-player Pokémon trading via Supabase Realtime channels. Generate a room code,
                    both players select their Pokémon, confirm with a double-lock UI, and the trade
                    executes atomically.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Room codes", "Supabase Realtime", "Double-lock confirm"].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md text-[10px] font-medium border border-[#252118] text-[#6B6560] bg-[#141210]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </Section>

          {/* ════ TECH STACK ══════════════════════════════ */}
          <Section id="tech" onVisible={setActiveSection}>
            <SectionLabel text="Engineering" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              Tech Stack
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              No framework — the entire game runs on vanilla JS ES modules. A few notable
              engineering decisions underneath:
            </p>

            <FadeUp>
              <div className="overflow-x-auto rounded-2xl border border-[#252118] mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#252118]">
                      <th className="p-4 text-left text-[#4A4540] font-medium w-32">Layer</th>
                      <th className="p-4 text-left text-[#F5EFE8] font-semibold" style={{ background: `${POKE_GREEN}10` }}>Choice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { layer: "Frontend",    choice: "Vanilla JS (ES modules) · HTML · CSS" },
                      { layer: "Font",        choice: "Press Start 2P — pixel-retro aesthetic" },
                      { layer: "Pokémon Data",choice: "PokéAPI — sprites, stats, evolution chains, catch rates" },
                      { layer: "Auth + DB",   choice: "Supabase — auth, cloud save sync, PVP records" },
                      { layer: "Realtime",    choice: "Supabase Realtime — Link Trade channels" },
                      { layer: "Hosting",     choice: "Vercel + edge serverless (weekly LP cron reset)" },
                      { layer: "Persistence", choice: "localStorage (primary) + Supabase cloud save (sync every 30s)" },
                    ].map((row, i) => (
                      <motion.tr
                        key={row.layer}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="border-b border-[#252118] last:border-0"
                      >
                        <td className="p-4 bg-[#0f0d0b] text-[#4A4540] text-xs font-medium">{row.layer}</td>
                        <td className="p-4 bg-[#0f0d0b] text-[#8B8178] text-xs">{row.choice}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Spawn Catch-Up Engine",   body: "On page load, simulates every spawn that should have occurred offline (up to 100k iterations) so the queue is always correct on return.", delay: 0 },
                { title: "Migration-Forward Saves",  body: "Every loadState() handles multiple legacy formats — old origin names, pre-PC flat arrays — so saves never break across updates.", delay: 0.1 },
                { title: "Dev Mode",                 body: "Shift+~ opens a SHA-256 password-gated panel for spawning custom Pokémon with any origin or IVs during development.", delay: 0.2 },
                { title: "Type Background System",   body: "Each encounter stage gets a type-themed background CSS gradient based on the wild Pokémon's primary type — 18 types covered.", delay: 0.3 },
              ].map((note) => (
                <FadeUp key={note.title} delay={note.delay}>
                  <div className="rounded-xl border border-[#252118] bg-[#0f0d0b] p-5">
                    <p className="text-sm font-semibold text-[#F5EFE8] mb-2">{note.title}</p>
                    <p className="text-[#8B8178] text-xs leading-relaxed">{note.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ CHANGELOG ═══════════════════════════════ */}
          <Section id="changelog" onVisible={setActiveSection}>
            <SectionLabel text="Version History" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">
              Changelog
            </h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-12">
              60+ commits across 5 versions — from a bare spawn engine to a full social game with
              Mega Evolution, Gigantamax, and real-time trades.
            </p>

            <div className="relative flex flex-col gap-0">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#252118]" />

              {[
                {
                  version: "v0.1",
                  title: "Core Game",
                  color: "#8B8178",
                  highlights: [
                    "Spawn system with offline catch-up engine",
                    "Fight / Catch / Skip encounter flow",
                    "1v1 auto-battle with PokéAPI base stats",
                    "Catch mini-game: timing bar + shrinking zone",
                    "6-slot AFK team with passive coin income",
                    "Starter picker · Pokédex · basic store",
                    "Supabase auth + cloud save (30s sync)",
                  ],
                },
                {
                  version: "v0.2",
                  title: "Depth & New Player Experience",
                  color: POKE_GREEN,
                  highlights: [
                    "Professor Oak tutorial (FRLG dialogue style)",
                    "Distortion World — 50+ traits across 6 tiers, ¥200k reroll",
                    "Nursery: manual + auto Oran Berry feeding",
                    "Sound system — lo-fi Littleroot Town BGM + SFX",
                    "Mobile UX pass: safe area insets, larger catch zone",
                  ],
                },
                {
                  version: "v0.3",
                  title: "Progression & PVP",
                  color: "#5B9BD4",
                  highlights: [
                    "Async PVP + LP leaderboard",
                    "Weekly serverless LP reset via Vercel cron",
                    "Booster packs — 5 tiers with CS:GO-style animation",
                    "Pokédex milestones (coins, encounter boosts, income multipliers)",
                    "Origin system — 10 variants with CSS sprite filters",
                    "IV system — Void/Shiny guaranteed 31s; Distortion World IV rerolling",
                    "Offline income cap + AFK Charm",
                  ],
                },
                {
                  version: "v0.4",
                  title: "Mega Evolution & Responsive Polish",
                  color: "#9B7FD4",
                  highlights: [
                    "91 Mega Stones from Legends Z-A — MEGA badge on team strip",
                    "CS:GO reel animation for Mega Stone Pack opens",
                    "5-breakpoint responsive layouts (mobile → large desktop)",
                    "Link Trade — Supabase Realtime, room codes, double-lock confirm",
                    "PC Box expanded to 30 boxes × 30 slots with save migration",
                  ],
                },
                {
                  version: "v0.5",
                  title: "Gigantamax, PC QoL & Catch Chaining",
                  color: "#FFD700",
                  highlights: [
                    "Gigantamax system — G-MAX badge, one per team, shiny G-Max support",
                    "Chain catching: successful catch flows directly to next mini-game",
                    "PC QoL: nickname + evolve directly from box without team view",
                    "Wild level scaling: 3-dice max, Legendaries 65–75, Mythicals 45–55",
                    "Synthesized soft tap sound replacing button SFX",
                  ],
                },
              ].map((v, i) => (
                <FadeUp key={v.version} delay={i * 0.1}>
                  <div className="relative pl-12 pb-10">
                    <div
                      className="absolute left-0 w-10 h-10 rounded-full border-2 border-[#252118] bg-[#0A0908] flex items-center justify-center"
                      style={{ top: "2px" }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ background: v.color }} />
                    </div>
                    <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 hover:border-[#4CAF7D]/20 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                          style={{ background: `${v.color}20`, color: v.color }}
                        >
                          {v.version}
                        </span>
                        <p className="font-semibold text-[#F5EFE8]">{v.title}</p>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {v.highlights.map((h) => (
                          <li key={h} className="flex gap-2 items-start">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: v.color }} />
                            <span className="text-[#8B8178] text-xs leading-relaxed">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Closing */}
            <FadeUp delay={0.3}>
              <div className="pt-12 border-t border-[#252118] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="font-display text-2xl font-bold text-[#F5EFE8] mb-1">Play PokeGlade</p>
                  <p className="text-[#8B8178] text-sm">Live at pokeglade.site — no install required.</p>
                </div>
                <a
                  href="https://pokeglade.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-[#0A0908] transition-all duration-200 hover:opacity-90"
                  style={{ background: POKE_GREEN }}
                >
                  Play now →
                </a>
              </div>
            </FadeUp>
          </Section>

        </div>

        {/* ── TOC sidebar ── */}
        <aside className="hidden xl:block w-48 shrink-0">
          <TableOfContents active={activeSection} />
        </aside>
      </div>
    </div>
  );
}
