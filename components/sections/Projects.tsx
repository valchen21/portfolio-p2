"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { projects, playProjects } from "@/data/content";
import { useMode } from "@/components/ModeContext";

// ─── Rotating CD preview (for personalized-cd card) ──────────────────────────
const CD_W = 130;
const CD_H = Math.round(130 * 1394 / 1628); // ≈ 111
const CD_D = Math.round(130 * 72  / 1628);  // ≈ 6

function RotatingCDPreview() {
  return (
    <div style={{ perspective: 800, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <motion.div
        style={{ transformStyle: "preserve-3d", width: CD_W, height: CD_H }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0,
          transform: `translateZ(${CD_D / 2}px)`,
          backfaceVisibility: "hidden",
          overflow: "hidden", borderRadius: 2,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/CD/cd-frame-front.png" alt="CD front" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Back */}
        <div style={{
          position: "absolute", inset: 0,
          transform: `rotateY(180deg) translateZ(${CD_D / 2}px)`,
          backfaceVisibility: "hidden",
          overflow: "hidden", borderRadius: 2,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/CD/CD frame back.png" alt="CD back" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Left edge */}
        <div style={{
          position: "absolute", left: 0, top: 0, width: CD_D, height: CD_H,
          transform: `rotateY(-90deg) translateZ(${CD_D / 2}px)`,
          backgroundImage: "url('/CD/CD frame back.png')",
          backgroundSize: `${Math.round(100 * 1772 / 72)}% auto`,
          backgroundPosition: "0% center",
        }} />
        {/* Right edge */}
        <div style={{
          position: "absolute", left: CD_W - CD_D, top: 0, width: CD_D, height: CD_H,
          transform: `rotateY(90deg) translateZ(${CD_D / 2}px)`,
          backgroundImage: "url('/CD/CD frame back.png')",
          backgroundSize: `${Math.round(100 * 1772 / 72)}% auto`,
          backgroundPosition: "100% center",
        }} />
        {/* Top edge */}
        <div style={{
          position: "absolute", left: 0, top: 0, width: CD_W, height: CD_D,
          transform: `rotateX(90deg) translateZ(${CD_D / 2}px)`,
          background: "#111018",
        }} />
        {/* Bottom edge */}
        <div style={{
          position: "absolute", left: 0, top: CD_H - CD_D, width: CD_W, height: CD_D,
          transform: `rotateX(-90deg) translateZ(${CD_D / 2}px)`,
          background: "#111018",
        }} />
      </motion.div>
    </div>
  );
}

// Section header
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540]">
        {number}
      </span>
      <div className="w-8 h-px bg-[#252118]" />
      <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540]">
        {label}
      </span>
    </div>
  );
}

interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  role: string;
  summary: string;
  problem: string;
  outcome: string;
  skills: string[];
  gradient: string;
  accentColor: string;
  accentLight: string;
  number: string;
  caseStudyUrl?: string;
  coverImage?: string;
}

function ProjectCard({
  project,
  index,
  isExpanded,
  onToggle,
}: {
  project: Project;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  const handleClick = () => {
    onToggle();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.43, 0.195, 0.02, 1] }}
      className="group"
    >
      <motion.div
        layout
        onClick={handleClick}
        className={`relative overflow-hidden rounded-2xl border border-[#252118] cursor-pointer transition-all duration-500 ${
          isExpanded ? "border-[#3a3020]" : "hover:border-[#2e2820]"
        }`}
        style={{
          background: `linear-gradient(135deg, #141210 0%, #0f0d0b 100%)`,
        }}
        whileHover={!isExpanded ? { scale: 1.005 } : {}}
        transition={{ layout: { duration: 0.45, ease: [0.43, 0.195, 0.02, 1] } }}
      >
        {/* Card gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-80 transition-opacity duration-500 ${isExpanded ? "opacity-100" : "group-hover:opacity-90"}`}
        />

        {/* Accent glow on expand */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${isEven ? "80%" : "20%"} 40%, ${project.accentColor}15 0%, transparent 60%)`,
            }}
          />
        )}

        <div className="relative z-10 p-8 md:p-10">
          {/* Top row */}
          <div className={`flex items-start gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
            {/* Left: Text content */}
            <div className="flex-1 min-w-0">
              {/* Number + category */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="font-display text-4xl md:text-5xl font-bold leading-none select-none"
                  style={{ color: `${project.accentColor}25` }}
                >
                  {project.number}
                </span>
                <div className="h-px flex-1 max-w-[40px]" style={{ background: `${project.accentColor}30` }} />
                <span
                  className="text-[10px] font-medium tracking-[0.2em] uppercase"
                  style={{ color: project.accentColor }}
                >
                  {project.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5EFE8] mb-3 leading-tight">
                {project.title}
                {project.id === "bereal" && (
                  <span className="ml-3 text-base font-sans font-medium tracking-wide align-middle" style={{ color: project.accentColor, opacity: 0.7 }}>
                    (In Progress)
                  </span>
                )}
              </h3>

              {/* Role badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0908]/50 border border-[#252118] mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.accentColor }} />
                <span className="text-[11px] font-medium text-[#8B8178]">{project.role}</span>
              </div>

              {/* Summary */}
              <p className="text-[#8B8178] text-base leading-relaxed max-w-lg mb-6">
                {project.summary}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {project.skills.slice(0, isExpanded ? project.skills.length : 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#0A0908]/60 border border-[#252118] text-[#8B8178]"
                  >
                    {skill}
                  </span>
                ))}
                {!isExpanded && project.skills.length > 4 && (
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium text-[#4A4540]">
                    +{project.skills.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Visual panel */}
            <div className="hidden md:flex flex-col w-[220px] lg:w-[280px] shrink-0">
              {/* Cover image or abstract placeholder */}
              <div
                className="relative h-36 lg:h-44 rounded-xl overflow-hidden border border-[#252118]"
                style={{ background: `linear-gradient(135deg, #0A0908 0%, #141210 100%)` }}
              >
                {project.id === "personalized-cd" ? (
                  <RotatingCDPreview />
                ) : project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 dot-grid opacity-50" />
                    <motion.div
                      animate={isExpanded ? { scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] } : { scale: 1, opacity: 0.6 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${project.accentColor}30 0%, transparent 70%)`,
                        filter: "blur(12px)",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="font-display text-7xl font-bold leading-none opacity-[0.07]"
                        style={{ color: project.accentColor }}
                      >
                        {project.title.charAt(0)}
                      </span>
                    </div>
                    <div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full opacity-60"
                      style={{ background: project.accentColor }}
                    />
                  </>
                )}
              </div>

              {/* Click to expand hint */}
              <div className="mt-3 flex items-center justify-center">
                <span className="text-[10px] tracking-[0.15em] uppercase transition-colors duration-300"
                  style={{ color: isExpanded ? `${project.accentColor}80` : "#9B9188" }}>
                  {isExpanded ? "expanded" : "click to expand"}
                </span>
              </div>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.43, 0.195, 0.02, 1] }}
                className="overflow-hidden"
              >
                {project.id !== "bereal" && (
                  <div className="pt-8 mt-8 border-t border-[#252118] grid md:grid-cols-2 gap-8">
                    {/* Problem */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-4 h-px"
                          style={{ background: project.accentColor }}
                        />
                        <span
                          className="text-[10px] font-medium tracking-[0.2em] uppercase"
                          style={{ color: project.accentColor }}
                        >
                          The Problem
                        </span>
                      </div>
                      <p className="text-[#8B8178] text-sm leading-relaxed">{project.problem}</p>
                    </div>

                    {/* Outcome */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-4 h-px"
                          style={{ background: project.accentColor }}
                        />
                        <span
                          className="text-[10px] font-medium tracking-[0.2em] uppercase"
                          style={{ color: project.accentColor }}
                        >
                          Outcomes
                        </span>
                      </div>
                      <p className="text-[#8B8178] text-sm leading-relaxed">{project.outcome}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col items-center gap-3">
                  {project.caseStudyUrl ? (
                    <Link
                      href={project.caseStudyUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:brightness-110"
                      style={{
                        background: `${project.accentColor}18`,
                        border: `1px solid ${project.accentColor}40`,
                        color: project.accentColor,
                      }}
                    >
                      Check it out ↗
                    </Link>
                  ) : (
                    <span
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold tracking-wide cursor-default"
                      style={{
                        background: `rgba(74,69,64,0.08)`,
                        border: `1px solid rgba(74,69,64,0.2)`,
                        color: "#4A4540",
                      }}
                    >
                      Coming soon
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    className="text-[11px] text-[#4A4540] hover:text-[#8B8178] transition-colors duration-200 flex items-center gap-1"
                  >
                    Collapse ↑
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          initial={{ width: "0%" }}
          animate={isExpanded ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ background: `linear-gradient(90deg, transparent, ${project.accentColor}60, transparent)` }}
        />
      </motion.div>
    </motion.div>
  );
}

function ModeToggle() {
  const { isPlayMode, toggleMode, accentHex } = useMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-col items-end gap-3"
    >
      <p className="text-[11px] tracking-[0.2em] uppercase text-[#4A4540]">Switch view</p>
      <div className="flex items-center gap-5">
        <span
          className="text-sm font-medium transition-colors duration-300"
          style={{ color: !isPlayMode ? "#F5EFE8" : "#4A4540" }}
        >
          Work Mode
        </span>

        <button
          onClick={toggleMode}
          aria-label="Toggle work/play mode"
          className="relative w-[60px] h-[30px] rounded-full transition-colors duration-500 flex items-center flex-shrink-0"
          style={{ background: accentHex }}
        >
          <motion.div
            animate={{ x: isPlayMode ? 32 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="absolute w-[26px] h-[26px] rounded-full bg-white shadow-md"
          />
        </button>

        <span
          className="text-sm font-medium transition-colors duration-300"
          style={{ color: isPlayMode ? "#F5EFE8" : "#4A4540" }}
        >
          Play Mode
        </span>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const { isPlayMode } = useMode();

  const activeProjects = isPlayMode ? playProjects : projects;

  // Reset expanded card when switching modes
  const prevMode = useRef(isPlayMode);
  if (prevMode.current !== isPlayMode) {
    prevMode.current = isPlayMode;
    setExpanded(null);
  }

  const headingAccent = isPlayMode ? "#F0609E" : "#5BAECC";
  const bgTint = isPlayMode
    ? "radial-gradient(ellipse at 50% 0%, rgba(240,96,158,0.06) 0%, transparent 60%)"
    : "radial-gradient(ellipse at 50% 0%, rgba(91,174,204,0.06) 0%, transparent 60%)";

  return (
    <section id="projects" className="relative py-32 md:py-40">
      {/* Section background */}
      <div className="absolute inset-0 bg-[#0A0908]" />
      <div
        className="absolute inset-0 opacity-30 transition-all duration-700"
        style={{ background: bgTint }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div ref={headerRef} className="mb-20 flex items-end justify-between gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel number="02" label="Selected Work" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6"
            >
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5EFE8] leading-tight tracking-tight">
                {isPlayMode ? "Fun &" : "Projects &"}
                <br />
                <span className="italic transition-colors duration-500" style={{ color: headingAccent }}>
                  {isPlayMode ? "Side Quests" : "Case Studies"}
                </span>
              </h2>

              <p className="mt-4 text-[#8B8178] text-sm leading-relaxed">
                {isPlayMode ? "The fun stuff. Side quests, passion projects, and things I made just because..." : "Some of my best work..."}
              </p>
            </motion.div>
          </div>

          {/* Mode toggle — right side of header (desktop only) */}
          <div className="hidden md:block shrink-0 pb-1">
            <ModeToggle />
          </div>
        </div>

        {/* Project cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isPlayMode ? "play" : "work"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col gap-5"
          >
            {activeProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project as Project}
                index={i}
                isExpanded={expanded === project.id}
                onToggle={() => setExpanded(expanded === project.id ? null : project.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center text-[11px] tracking-[0.15em] uppercase text-[#4A4540]"
        >
          {isPlayMode ? "Passion projects · built for fun" : "Click to open case study · expand others for details"}
        </motion.p>
      </div>
    </section>
  );
}
