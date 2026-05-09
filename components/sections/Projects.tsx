"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { projects } from "@/data/content";

// ─── Rotating CD preview (for personalized-cd card) ──────────────────────────
const CD_W = 100;
const CD_H = Math.round(100 * 1394 / 1628); // ≈ 86
const CD_D = Math.round(100 * 72  / 1628);  // ≈ 4

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
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const hasUrl = !!project.caseStudyUrl;

  const cardInner = (
    <div
      className={`relative h-full overflow-hidden rounded-2xl border border-[#252118] transition-all duration-500 ${
        hasUrl ? "cursor-pointer group-hover:border-[#3a3020]" : "cursor-default"
      }`}
      style={{
        background: `linear-gradient(135deg, #141210 0%, #0f0d0b 100%)`,
      }}
    >
      {/* Card gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-80 transition-opacity duration-500 ${hasUrl ? "group-hover:opacity-100" : ""}`}
      />

      {/* Hover glow */}
      {hasUrl && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${project.accentColor}18 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Visual panel */}
        <div
          className="relative h-44 lg:h-48 overflow-hidden border-b border-[#252118]"
          style={{ background: `linear-gradient(135deg, #0A0908 0%, #141210 100%)` }}
        >
          {project.id === "personalized-cd" ? (
            <RotatingCDPreview />
          ) : project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <>
              <div className="absolute inset-0 dot-grid opacity-50" />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${project.accentColor}30 0%, transparent 70%)`,
                  filter: "blur(12px)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display text-7xl font-bold leading-none opacity-[0.08]"
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

          {/* Status badge (top-right) */}
          {!hasUrl && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0A0908]/80 backdrop-blur-sm border border-[#252118]">
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#8B8178]">
                {project.id === "bereal" ? "In Progress" : "Coming Soon"}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 lg:p-7">
          {/* Number + category */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="font-display text-2xl font-bold leading-none select-none"
              style={{ color: `${project.accentColor}30` }}
            >
              {project.number}
            </span>
            <div className="h-px flex-1 max-w-[24px]" style={{ background: `${project.accentColor}30` }} />
            <span
              className="text-[10px] font-medium tracking-[0.2em] uppercase"
              style={{ color: project.accentColor }}
            >
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-2xl lg:text-[28px] font-bold text-[#F5EFE8] mb-2 leading-tight">
            {project.title}
          </h3>

          {/* Role */}
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.accentColor }} />
            <span className="text-[11px] font-medium text-[#8B8178]">{project.role}</span>
          </div>

          {/* Summary */}
          <p className="text-[#8B8178] text-sm leading-relaxed mb-4 line-clamp-3">
            {project.summary}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#0A0908]/60 border border-[#252118] text-[#8B8178]"
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-[#4A4540]">
                +{project.skills.length - 3}
              </span>
            )}
          </div>

          {/* CTA — pushes to bottom */}
          <div className="mt-auto pt-2">
            {hasUrl ? (
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 group-hover:gap-2.5"
                style={{ color: project.accentColor }}
              >
                View case study
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#4A4540]">
                Case study coming soon
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        {hasUrl && (
          <div
            className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
            style={{ background: `linear-gradient(90deg, transparent, ${project.accentColor}80, transparent)` }}
          />
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.43, 0.195, 0.02, 1] }}
      whileHover={hasUrl ? { y: -4 } : {}}
      className="group h-full"
    >
      {hasUrl ? (
        <Link href={project.caseStudyUrl!} className="block h-full">
          {cardInner}
        </Link>
      ) : (
        cardInner
      )}
    </motion.div>
  );
}

export default function Projects() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="relative py-32 md:py-40">
      {/* Section background */}
      <div className="absolute inset-0 bg-[#0A0908]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(91,174,204,0.06) 0%, transparent 60%)",
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
              Projects &
              <br />
              <span className="italic" style={{ color: "#5BAECC" }}>
                Case Studies
              </span>
            </h2>

            <p className="mt-4 text-[#8B8178] text-sm leading-relaxed">
              Some of my best work...
            </p>
          </motion.div>
        </div>

        {/* Project cards */}
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project as Project}
              index={i}
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
          Click any card to view the full case study
        </motion.p>
      </div>
    </section>
  );
}
