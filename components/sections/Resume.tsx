"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { experience, education, skills } from "@/data/content";

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540]">{number}</span>
      <div className="w-8 h-px bg-[#252118]" />
      <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#4A4540]">{label}</span>
    </div>
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: (typeof experience)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.43, 0.195, 0.02, 1] }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-[#252118]" />

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.12 + 0.2 }}
        className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full border-2 bg-[#0A0908]"
        style={{ borderColor: "var(--accent)" }}
      />

      {/* Content */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <h4 className="text-base font-semibold text-[#F5EFE8]">{item.role}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{item.company}</span>
            <span className="text-[#4A4540]">·</span>
            <span className="text-xs text-[#4A4540]">{item.location}</span>
          </div>
        </div>
        <span className="text-xs font-medium text-[#4A4540] bg-[#141210] px-3 py-1 rounded-full border border-[#252118] whitespace-nowrap self-start sm:self-auto">
          {item.period}
        </span>
      </div>

      <p className="text-sm text-[#8B8178] leading-relaxed mb-3">{item.description}</p>

      <ul className="space-y-1.5">
        {item.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#8B8178]">
            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "var(--accent)", opacity: 0.6 }} />
            {h}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function SkillGroup({ category, items, index }: { category: string; items: string[]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="p-5 rounded-xl border border-[#252118] bg-[#141210]/60"
    >
      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--accent)" }}>
        {category}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#0A0908] border border-[#252118] text-[#8B8178] hover:border-[#3a3020] hover:text-[#F5EFE8] transition-all duration-200 cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function EducationCard({ edu, index }: { edu: (typeof education)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="p-5 rounded-xl border border-[#252118] bg-[#141210]/60 flex items-start gap-4"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}
      >
        <span className="text-xs" style={{ color: "var(--accent)" }}>✦</span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[#F5EFE8]">{edu.degree}</h4>
        <p className="text-xs font-medium mt-0.5" style={{ color: "var(--accent)" }}>{edu.institution}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-[#4A4540]">{edu.period}</span>
          {edu.note && (
            <>
              <span className="text-[#4A4540]">·</span>
              <span className="text-[10px] text-[#8B8178]">{edu.note}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Resume() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const skillCategories = Object.entries(skills);

  return (
    <section id="resume" className="relative py-32 md:py-40">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0908]" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(91,174,204,0.04) 0%, transparent 50%)",
        }}
      />
      {/* Top border */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#252118] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel number="03" label="Experience" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5EFE8] leading-tight tracking-tight">
              Background &<br />
              <span className="italic" style={{ color: "var(--accent)" }}>Expertise</span>
            </h2>

            <button
              onClick={() => window.dispatchEvent(new Event("openResume"))}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 self-start md:self-auto"
              style={{ border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)", color: "var(--accent)" }}
            >
              <span>Download Resume</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
            </button>
          </motion.div>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,440px] gap-16 lg:gap-20">
          {/* Left: Experience timeline */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#4A4540] mb-8"
            >
              Work Experience
            </motion.h3>

            <div>
              {experience.map((item, i) => (
                <TimelineItem key={item.company} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Right: Education + Skills */}
          <div className="space-y-10">
            {/* Education */}
            <div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#4A4540] mb-5"
              >
                Education
              </motion.h3>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <EducationCard key={edu.institution} edu={edu} index={i} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#252118]" />

            {/* Skills */}
            <div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#4A4540] mb-5"
              >
                Skills & Tools
              </motion.h3>
              <div className="space-y-3">
                {skillCategories.map(([category, items], i) => (
                  <SkillGroup
                    key={category}
                    category={category}
                    items={items}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
