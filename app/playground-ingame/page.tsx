"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  category: string;
  level: string;
  role: string;
  blurb: string;
  skills: string[];
  cover?: string;
  accent: string;
  accentLight: string;
  url: string | null;
  comingSoon?: boolean;
};

const projects: Project[] = [
  {
    id: "meloettify",
    name: "MELOETTIFY",
    category: "MUSIC TECH",
    level: "5,600",
    role: "Creator & Designer",
    blurb:
      "A web app that analyzes your Spotify listening history and assigns you a Pokemon representing your music taste. Built solo in vanilla JS with a custom scoring engine across 18 type definitions and 8 music dimensions.",
    skills: [
      "Vanilla JS",
      "Spotify API",
      "OAuth 2.0 (PKCE)",
      "Algorithm Design",
      "html2canvas",
      "Vite",
    ],
    cover: "/Meloettify/www.meloettify.online_.png",
    accent: "#F0609E",
    accentLight: "#F8A0C0",
    url: "/case-studies/meloettify",
  },
  {
    id: "cd",
    name: "MIXTAPE",
    category: "PHYSICAL PRODUCT",
    level: "0-1",
    role: "Product Designer",
    blurb:
      "A gifting experience that revives the physical mixtape. Custom artwork, handpicked tracklists, packaging, and a companion digital flow that lives at the intersection of tactile and digital.",
    skills: [
      "Brand Design",
      "Product Strategy",
      "Packaging",
      "Figma",
      "Creative Direction",
    ],
    cover: "/CD/the CD.png",
    accent: "#8B60F0",
    accentLight: "#AA88F8",
    url: "/case-studies/personalized-cd",
  },
  {
    id: "pokeglade",
    name: "POKEGLADE",
    category: "GAME DEV",
    level: "v0.5",
    role: "Creator & Engineer",
    blurb:
      "A browser-based idle Pokémon adventure in vanilla JS. Catch Pokémon with a timing mini-game, collect 10 spawn origins, reroll 50+ traits in the Distortion World, trade in real-time, and battle the leaderboard.",
    skills: [
      "Vanilla JS",
      "PokéAPI",
      "Supabase",
      "Supabase Realtime",
      "CSS Physics",
      "Vercel Edge",
    ],
    cover: "/PokeGlade/PokéGlade Icon.png",
    accent: "#4CAF7D",
    accentLight: "#7ECDA0",
    url: "/case-studies/pokeglade",
  },
  {
    id: "soon-2",
    name: "?? ??",
    category: "LOCKED",
    level: "??",
    role: "Coming soon",
    blurb: "A new project is loading. Insert coin and check back soon.",
    skills: [],
    accent: "#D4874A",
    accentLight: "#F5B17A",
    url: null,
    comingSoon: true,
  },
  {
    id: "soon-3",
    name: "?? ??",
    category: "LOCKED",
    level: "??",
    role: "Coming soon",
    blurb: "A new project is loading. Insert coin and check back soon.",
    skills: [],
    accent: "#7AC74C",
    accentLight: "#A8E580",
    url: null,
    comingSoon: true,
  },
];

export default function ProjectSelectPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const current = projects[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        k === "arrowup" ||
        k === "arrowleft" ||
        k === "w" ||
        k === "a"
      ) {
        setIndex((i) => (i - 1 + projects.length) % projects.length);
        e.preventDefault();
        return;
      }
      if (
        k === "arrowdown" ||
        k === "arrowright" ||
        k === "s" ||
        k === "d"
      ) {
        setIndex((i) => (i + 1) % projects.length);
        e.preventDefault();
        return;
      }
      if (k === "e" || k === "enter" || k === " ") {
        const p = projects[index];
        if (p.url) router.push(p.url);
        e.preventDefault();
        return;
      }
      if (k === "escape") {
        router.push("/#playground");
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, router]);

  return (
    <main
      className="fixed inset-0 overflow-y-auto overflow-x-hidden flex flex-col select-none"
      style={{
        background: "#050304",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Ambient bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, ${current.accent}1a 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, ${current.accentLight}10 0%, transparent 55%)
          `,
          transition: "background 400ms ease",
        }}
      />

      {/* Top HUD */}
      <header className="relative z-20 px-6 pt-5 pb-3 flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/#playground"
          className="text-[10px] tracking-[0.2em] text-[#888] hover:text-white transition-colors"
        >
          {"<"} EXIT
        </Link>
        <div
          className="text-[10px] tracking-[0.25em]"
          style={{
            color: "#F8A0C0",
            textShadow: "0 0 6px rgba(248,160,192,0.5)",
          }}
        >
          ★ SELECT YOUR PROJECT ★
        </div>
        <div className="text-[8px] tracking-[0.25em] text-[#666]">
          ↑ ↓ BROWSE
        </div>
      </header>

      {/* Main viewport — top-anchored, expands downward */}
      <section className="relative z-10 flex-1 flex justify-center items-start px-6 pt-4 pb-24">
        <PartyMenuView
          projects={projects}
          index={index}
          setIndex={setIndex}
          onConfirm={() => current.url && router.push(current.url)}
        />
      </section>

      {/* CRT overlays */}
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.14) 3px)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Bottom HUD */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-center gap-5 text-[8px] tracking-[0.2em] text-[#666]" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(5,3,4,0.8) 60%, #050304 100%)" }}>
        <span>↑ ↓ BROWSE</span>
        <span style={{ color: current.accent }}>E SELECT</span>
        <span>ESC EXIT</span>
      </footer>
    </main>
  );
}

// ─── Party Menu View ───────────────────────────────────────────────────────
function PartyMenuView({
  projects,
  index,
  setIndex,
  onConfirm,
}: {
  projects: Project[];
  index: number;
  setIndex: (i: number) => void;
  onConfirm: () => void;
}) {
  const current = projects[index];
  return (
    <div
      className="w-full max-w-5xl"
      style={{
        background: "linear-gradient(180deg, #14060a 0%, #0a0508 100%)",
        border: `2px solid ${current.accent}`,
        boxShadow: `0 0 28px ${current.accent}40, inset 0 0 16px ${current.accent}1a`,
        transition: "border-color 320ms ease, box-shadow 320ms ease",
      }}
    >
      <div className="grid md:grid-cols-[260px_1fr] items-start">
        {/* Left: Party list — fixed width, content does not stretch with detail */}
        <aside
          className="p-5 border-r"
          style={{
            borderColor: `${current.accent}40`,
            transition: "border-color 320ms ease",
          }}
        >
          <div
            className="text-[9px] tracking-[0.25em] mb-4 pb-3 border-b"
            style={{
              color: current.accent,
              borderColor: `${current.accent}33`,
              transition: "color 320ms ease, border-color 320ms ease",
            }}
          >
            ★ PARTY
          </div>
          <ul className="flex flex-col gap-1.5">
            {projects.map((p, i) => {
              const active = i === index;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => setIndex(i)}
                    className="w-full flex items-center gap-3 py-2 px-2 text-left transition-all"
                    style={{
                      background: active ? `${p.accent}1a` : "transparent",
                      borderLeft: `3px solid ${active ? p.accent : "transparent"}`,
                    }}
                  >
                    <span
                      className="text-[9px] w-3 shrink-0"
                      style={{ color: active ? p.accent : "transparent" }}
                    >
                      ▶
                    </span>
                    <span
                      className="rounded-full shrink-0"
                      style={{
                        width: 8,
                        height: 8,
                        background: p.accent,
                        boxShadow: active
                          ? `0 0 6px ${p.accent}`
                          : "none",
                      }}
                    />
                    <span
                      className="text-[10px] tracking-[0.15em] truncate"
                      style={{
                        color: active ? "#F5EFE8" : "#888",
                      }}
                    >
                      {p.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right: Detail — top-anchored, grows downward only */}
        <div
          key={current.id}
          className="p-6 md:p-8 self-start"
          style={{ animation: "party-fade 280ms ease" }}
        >
          <div
            className="text-[9px] tracking-[0.25em] mb-2"
            style={{
              color: current.accentLight,
              textShadow: `0 0 6px ${current.accent}`,
            }}
          >
            ★ {current.category} ★
          </div>
          <h2
            className="leading-tight mb-4"
            style={{
              fontSize: 26,
              color: "#F5EFE8",
              textShadow: `2px 2px 0 ${current.accent}, 0 0 14px ${current.accent}`,
            }}
          >
            {current.name}
          </h2>

          <div className="flex gap-4 mb-5">
            {/* Mini portrait */}
            <div
              className="relative shrink-0 overflow-hidden"
              style={{
                width: 120,
                height: 120,
                background: current.comingSoon
                  ? `repeating-linear-gradient(45deg, #1a0e1a 0 8px, #221324 8px 16px)`
                  : "#0a0508",
                border: `1px solid ${current.accent}80`,
                boxShadow: `inset 0 0 12px ${current.accent}40`,
              }}
            >
              {current.cover ? (
                <Image
                  src={current.cover}
                  alt={current.name}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-[34px]"
                    style={{
                      color: current.accent,
                      textShadow: `0 0 10px ${current.accent}`,
                    }}
                  >
                    ?
                  </span>
                </div>
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.22) 3px)",
                }}
              />
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 gap-2 self-start">
              <Stat
                label="LV."
                value={current.level}
                color={current.accent}
              />
              <Stat
                label="ROLE"
                value={current.role}
                color={current.accent}
                small
              />
            </div>
          </div>

          <SectionLabel text="BIO" color={current.accent} />
          <p
            className="mt-2 mb-5 text-[#bbb]"
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: 17,
              lineHeight: 1.35,
            }}
          >
            {current.blurb}
          </p>

          {current.skills.length > 0 && (
            <>
              <SectionLabel text="SKILLS" color={current.accent} />
              <ul className="mt-2 mb-6 grid grid-cols-2 gap-y-1.5 gap-x-3">
                {current.skills.map((s) => (
                  <li
                    key={s}
                    className="text-[#bbb] flex items-center gap-2"
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: 16,
                    }}
                  >
                    <span style={{ color: current.accent }}>◆</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {current.comingSoon ? (
            <span
              className="inline-block text-[9px] tracking-[0.2em] px-4 py-2.5"
              style={{
                color: current.accentLight,
                border: `1px dashed ${current.accent}`,
              }}
            >
              LOCKED · INSERT COIN
            </span>
          ) : (
            <button
              onClick={onConfirm}
              className="text-[9px] tracking-[0.2em] px-5 py-2.5 transition-all hover:brightness-125"
              style={{
                background: current.accent,
                color: "#0a0508",
                boxShadow: `0 0 12px ${current.accent}`,
              }}
            >
              [E] VIEW CASE STUDY
            </button>
          )}

          <style jsx>{`
            @keyframes party-fade {
              from {
                opacity: 0;
                transform: translateY(4px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

// ─── Shared bits ────────────────────────────────────────────────────────────
function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="block w-3 h-px" style={{ background: color }} />
      <span
        className="text-[8px] tracking-[0.3em]"
        style={{ color, textShadow: `0 0 4px ${color}` }}
      >
        {text}
      </span>
      <span className="block flex-1 h-px" style={{ background: `${color}33` }} />
    </div>
  );
}

function Stat({
  label,
  value,
  color,
  small,
}: {
  label: string;
  value: string;
  color: string;
  small?: boolean;
}) {
  return (
    <div
      className="px-3 py-2"
      style={{
        background: "rgba(0,0,0,0.4)",
        border: `1px solid ${color}40`,
      }}
    >
      <div
        className="text-[7px] tracking-[0.25em] mb-1"
        style={{ color: `${color}` }}
      >
        {label}
      </div>
      <div
        className="text-[#F5EFE8]"
        style={{
          fontFamily: small ? "'VT323', monospace" : "'Press Start 2P', monospace",
          fontSize: small ? 16 : 13,
          letterSpacing: small ? "0.02em" : "0.05em",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
