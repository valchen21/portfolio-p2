"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { projects } from "@/data/content";

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
  const router = useRouter();

  const handleClick = () => {
    if (project.caseStudyUrl) {
      router.push(project.caseStudyUrl);
    } else {
      onToggle();
    }
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
          background: `linear-gradient(135deg, ${project.gradient.includes("from-") ? "" : ""}#141210 0%, #0f0d0b 100%)`,
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
                {project.coverImage ? (
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

              {/* Expand hint */}
              <motion.div
                animate={{ opacity: isExpanded ? 0 : 1 }}
                className="mt-4 flex items-center gap-2 justify-end"
              >
                <span className="text-[11px] text-[#4A4540] font-medium">
                  {project.caseStudyUrl ? "View case study" : "Expand"}
                </span>
                <div
                  className="w-6 h-6 rounded-full border border-[#252118] flex items-center justify-center"
                  style={{ borderColor: `${project.accentColor}30` }}
                >
                  <span style={{ color: project.accentColor }} className="text-[10px]">
                    {project.caseStudyUrl ? "↗" : "+"}
                  </span>
                </div>
              </motion.div>
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

                <div className="mt-6 flex items-center justify-between">
                  {project.caseStudyUrl ? (
                    <Link
                      href={project.caseStudyUrl}
                      className="group/btn inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
                      style={{ color: project.accentColor }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View full case study
                      <span className="group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                  ) : (
                    <button
                      className="group/btn inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
                      style={{ color: project.accentColor }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Full case study coming soon
                      <span className="group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
                    </button>
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

export default function Projects() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="relative py-32 md:py-40">
      {/* Section background */}
      <div className="absolute inset-0 bg-[#0A0908]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(91,174,204,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div ref={headerRef} className="mb-20">
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
              Projects &<br />
              <span className="italic text-[#5BAECC]">Case Studies</span>
            </h2>

            <p className="mt-4 text-[#8B8178] text-sm leading-relaxed">
              Some of my best work...
            </p>
          </motion.div>
        </div>

        {/* Project cards */}
        <div className="flex flex-col gap-5">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              isExpanded={expanded === project.id}
              onToggle={() => setExpanded(expanded === project.id ? null : project.id)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center text-[11px] tracking-[0.15em] uppercase text-[#4A4540]"
        >
          Click to open case study · expand others for details
        </motion.p>
      </div>
    </section>
  );
}
