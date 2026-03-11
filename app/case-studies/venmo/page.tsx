"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ─── TOC config ───────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: "overview",    label: "Overview" },
  { id: "team",        label: "The Team" },
  { id: "context",     label: "Context" },
  { id: "market",      label: "Market Size" },
  { id: "segmentation",label: "Segmentation" },
  { id: "competitive", label: "Competitive" },
  { id: "swot",        label: "SWOT" },
  { id: "surveys",     label: "User Surveys" },
  { id: "interviews",  label: "User Interviews" },
  { id: "affinity",    label: "Affinity Mapping" },
  { id: "personas",    label: "User Personas" },
  { id: "problem",     label: "Problem" },
  { id: "ideation",    label: "Ideation" },
  { id: "lofi",        label: "Lo-fi Prototypes" },
  { id: "solution",    label: "Solution" },
  { id: "designsystem",label: "Design System" },
  { id: "positioning", label: "Positioning" },
  { id: "gtm",         label: "Go-To-Market" },
  { id: "kpis",        label: "KPIs" },
  { id: "okrs",        label: "OKRs" },
  { id: "conclusion",  label: "Conclusion" },
];

const VENMO_BLUE  = "#3D95CE";
const VENMO_LIGHT = "#7ECDE6";

// ─── Sticky TOC ───────────────────────────────────────────────────────────────
function TableOfContents({ active }: { active: string }) {
  return (
    <nav className="sticky top-28 flex flex-col gap-0.5 w-44 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
      <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#4A4540] mb-3">
        Contents
      </p>
      {TOC_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex items-center gap-2.5 py-[3px] transition-all duration-200"
          >
            <span
              className="h-px transition-all duration-300 shrink-0"
              style={{ width: isActive ? "18px" : "6px", background: isActive ? VENMO_BLUE : "#3A3530" }}
            />
            <span
              className="text-[11px] font-medium transition-colors duration-200 leading-tight"
              style={{ color: isActive ? VENMO_LIGHT : "#6B6560" }}
            >
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

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, children, onVisible }: { id: string; children: React.ReactNode; onVisible: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -50% 0px" });
  useEffect(() => { if (inView) onVisible(id); }, [inView, id, onVisible]);
  return <section id={id} ref={ref} className="scroll-mt-28 mb-24">{children}</section>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-6 h-px" style={{ background: VENMO_BLUE }} />
      <span className="text-[10px] font-medium tracking-[0.25em] uppercase" style={{ color: VENMO_BLUE }}>{text}</span>
    </div>
  );
}

function StatCard({ stat, label, highlight, delay = 0 }: { stat: string; label: string; highlight?: boolean; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.43, 0.195, 0.02, 1] }}
      className={`rounded-2xl border p-6 ${highlight ? "border-[#3D95CE]/40 bg-[#0d1929]" : "border-[#252118] bg-[#0f0d0b]"}`}>
      <p className="font-display text-4xl font-bold mb-2" style={{ color: highlight ? VENMO_LIGHT : "#F5EFE8" }}>{stat}</p>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VenmoCaseStudy() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#F5EFE8]">
      <div className="noise-overlay" aria-hidden="true" />

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-[#252118] bg-[#0A0908]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/#projects" className="flex items-center gap-2 text-[12px] text-[#6B6560] hover:text-[#8B8178] transition-colors">
            <span>←</span><span>Portfolio</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: VENMO_BLUE }}>V</div>
            <span className="font-display font-semibold text-[#F5EFE8] hidden sm:block">Venmo Storefronts</span>
          </div>
          <div className="text-[11px] text-[#4A4540] hidden md:block">Product Space Fellowship · 2025</div>
        </div>
      </nav>

      {/* ── Layout ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32 flex gap-14">
        <div className="flex-1 min-w-0">

          {/* ════ OVERVIEW ════════════════════════════════ */}
          <Section id="overview" onVisible={setActiveSection}>
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.43, 0.195, 0.02, 1] }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3D95CE]/30 bg-[#3D95CE]/[0.08] mb-8">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: VENMO_BLUE }} />
                <span className="text-[11px] font-medium tracking-wide" style={{ color: VENMO_LIGHT }}>Product Space Fellowship · PM Capstone</span>
              </div>
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-[#F5EFE8] leading-tight tracking-tight mb-4">
                Venmo<br /><span className="italic" style={{ color: VENMO_LIGHT }}>Storefronts</span>
              </h1>
              <p className="text-[#8B8178] text-lg leading-relaxed max-w-xl mb-12">
                Redesigning the small-business payment experience on Venmo — reducing friction,
                building trust, and giving buyers the confidence to pay.
              </p>
              <div className="flex flex-wrap gap-6 mb-16 pb-16 border-b border-[#252118]">
                {[
                  { label: "Role",     value: "Product Manager" },
                  { label: "Timeline", value: "10 weeks · 2025" },
                  { label: "Team",     value: "Val Chen, Sophia Furnival, Seth San Miguel" },
                  { label: "Methods",  value: "User Surveys · Interviews · Figma" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540]">{label}</span>
                    <span className="text-sm text-[#8B8178]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatCard stat="40"  label="User surveys"                           delay={0.1} />
                <StatCard stat="15"  label="User interviews"                        delay={0.2} />
                <StatCard stat="$450M" label="Serviceable obtainable market"        delay={0.3} />
                <StatCard stat="3"   label="Core pain points solved"                delay={0.4} />
              </div>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="rounded-2xl overflow-hidden border border-[#252118]">
                <Image
                  src="/Venmo Storefronts Cover.png"
                  alt="Venmo Storefronts Cover"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                  priority
                />
              </motion.div>
            </motion.div>
          </Section>

          {/* ════ TEAM ════════════════════════════════════ */}
          <Section id="team" onVisible={setActiveSection}>
            <SectionLabel text="The Team" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: "Val Chen",        role: "Product Manager",  desc: "Led research coordination, synthesized user insights, wrote the PRD, and directed the overall product vision." },
                { name: "Seth San Miguel", role: "Product Designer", desc: "Owned interaction design, wireframes, and the high-fidelity Figma prototype." },
                { name: "Sophia Furnival", role: "Product Marketer", desc: "Shaped the go-to-market narrative, competitive positioning, and stakeholder communication." },
              ].map((m, i) => (
                <FadeUp key={m.name} delay={i * 0.12}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 hover:border-[#3D95CE]/30 transition-colors duration-300 h-full">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-lg font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${VENMO_BLUE}60, ${VENMO_BLUE}30)` }}>
                      {m.name.charAt(0)}
                    </div>
                    <p className="font-semibold text-[#F5EFE8] mb-1">{m.name}</p>
                    <p className="text-[11px] font-medium tracking-wide uppercase mb-3" style={{ color: VENMO_BLUE }}>{m.role}</p>
                    <p className="text-[#8B8178] text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ CONTEXT / OPPORTUNITY ═══════════════════ */}
          <Section id="context" onVisible={setActiveSection}>
            <SectionLabel text="Problem Context" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">Opportunity</h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-8">
              Digital payment apps like Venmo are becoming the go-to alternative to cash for
              transactions between friends and smaller-scale vendors.
            </p>
            <FadeUp>
              <div className="p-6 rounded-2xl border border-[#3D95CE]/25 bg-[#0d1929] mb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 80% 50%, ${VENMO_BLUE}40, transparent 60%)` }} />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: VENMO_BLUE }} />
                  <p className="text-[#F5EFE8] leading-relaxed">
                    Venmo offers a blend of{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">convenience</span> and{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">social engagement</span> for
                    people handling their finances — making it uniquely positioned to serve small businesses.
                  </p>
                </div>
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: "↔", text: "Send and receive payments between friends and businesses" },
                { icon: "÷", text: "Split bills and request money with personalized notes and emojis" },
                { icon: "🏦", text: "Link bank accounts or cards for quick, secure transfers" },
                { icon: "🏪", text: "Pay with Venmo at participating businesses using QR codes" },
              ].map((item, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-4 p-5 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                      style={{ background: `${VENMO_BLUE}20`, color: VENMO_LIGHT }}>{item.icon}</div>
                    <p className="text-[#8B8178] text-sm leading-relaxed">{item.text}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ MARKET SIZE ═════════════════════════════ */}
          <Section id="market" onVisible={setActiveSection}>
            <SectionLabel text="Market Size" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-2 leading-tight">$100 Est. Annual Revenue Per User</h2>
            <p className="text-[#8B8178] text-sm mb-10">TAM / SAM / SOM analysis for Venmo Storefronts</p>

            {/* TAM SAM SOM visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                { ring: "TAM", size: "$21B",  label: "Worldwide Digitally-Oriented Micro, Small, and Medium Enterprises (MSMEs)", color: VENMO_LIGHT, opacity: "30" },
                { ring: "SAM", size: "$4.4B", label: "US MSMEs in Digitally-Oriented Industries",                                  color: VENMO_BLUE,  opacity: "50" },
                { ring: "SOM", size: "$450M", label: "Small Business Owners on Venmo",                                             color: VENMO_BLUE,  opacity: "100" },
              ].map((item, i) => (
                <FadeUp key={item.ring} delay={i * 0.12}>
                  <div className={`rounded-2xl border p-6 text-center ${i === 2 ? "border-[#3D95CE]/50 bg-[#0d1929]" : "border-[#252118] bg-[#0f0d0b]"}`}>
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-white text-sm"
                      style={{ background: `${item.color}${item.opacity}` }}>
                      {item.ring}
                    </div>
                    <p className="font-display text-3xl font-bold mb-2" style={{ color: i === 2 ? VENMO_LIGHT : "#F5EFE8" }}>{item.size}</p>
                    <p className="text-[#8B8178] text-xs leading-relaxed">{item.label}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.3}>
              <div className="p-5 rounded-xl border border-[#3D95CE]/20 bg-[#0d1929] flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: VENMO_BLUE }} />
                <p className="text-[#8B8178] text-sm leading-relaxed">
                  With an estimated $100 average annual revenue per user and 4.5M+ small business owners already on Venmo,
                  the SOM of <span className="text-[#F5EFE8] font-medium">$450M</span> represents a significant, reachable opportunity within the existing user base.
                </p>
              </div>
            </FadeUp>
          </Section>

          {/* ════ MARKET SEGMENTATION ═════════════════════ */}
          <Section id="segmentation" onVisible={setActiveSection}>
            <SectionLabel text="Market Analysis" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">Market Segmentation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  type: "Geographic", color: "#2A8A7A",
                  points: ["Primary Market: United States", "Urban & Suburban Focus", "Main Regions: Dense, Tech-Savvy", "Areas that foster small consumer-oriented businesses"],
                  delay: 0,
                },
                {
                  type: "Demographic", color: "#7B5EA7",
                  points: ["Age: Millennials and Gen Z", "Income: Low – Middle Class", "Occupation: students, professionals, entrepreneurs"],
                  delay: 0.1,
                },
                {
                  type: "Behavioral", color: VENMO_BLUE,
                  points: ["Lifestyle: Social, Digital-first", "Values: Speed, Simplicity, Social-Focus", "Attitudes: Trustworthy, Comfortable, Social + Business"],
                  delay: 0.2,
                },
                {
                  type: "Psychographic", color: "#C4903A",
                  points: ["Usage Rate: Frequent", "Loyalty: High among younger users", "Desired Benefits: Quick P2P, split payments, social feed, contactless"],
                  delay: 0.3,
                },
              ].map((seg) => (
                <FadeUp key={seg.type} delay={seg.delay}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 h-full hover:border-[#3D95CE]/25 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-5">
                      <p className="font-semibold text-[#F5EFE8]">{seg.type}</p>
                      <div className="w-6 h-6 rounded-full opacity-70" style={{ background: seg.color }} />
                    </div>
                    <ul className="flex flex-col gap-2">
                      {seg.points.map((p) => (
                        <li key={p} className="flex gap-2 items-start">
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: seg.color }} />
                          <span className="text-[#8B8178] text-sm leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ COMPETITIVE ANALYSIS ════════════════════ */}
          <Section id="competitive" onVisible={setActiveSection}>
            <SectionLabel text="Competitive Analysis" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">Competitive Landscape</h2>

            <div className="overflow-x-auto rounded-2xl border border-[#252118]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#252118]">
                    <th className="p-4 text-left text-[#4A4540] font-medium w-28">Competitor</th>
                    <th className="p-4 text-left" style={{ background: `${VENMO_BLUE}15` }}>
                      <span className="text-[#F5EFE8] font-semibold">Advantages</span>
                    </th>
                    <th className="p-4 text-left" style={{ background: `${VENMO_BLUE}08` }}>
                      <span className="text-[#F5EFE8] font-semibold">Weaknesses</span>
                    </th>
                    <th className="p-4 text-left" style={{ background: `${VENMO_BLUE}15` }}>
                      <span className="text-[#F5EFE8] font-semibold">Positioning</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Cash App + Square", icon: "$",
                      advantages:  ["Large P2P User Base", "Bitcoin and Stock", "Established POS systems", "Comprehensive Business Tools"],
                      weaknesses:  ["Limited storefront", "Lacks Receipts and Inventory Tools", "For established businesses", "Complicated set up"],
                      positioning: ["Simple personal payments", "Strong POS for established businesses"],
                    },
                    {
                      name: "Zelle", icon: "Z",
                      advantages:  ["Bank Backed → Instant Transfers", "Reliable and growing user base"],
                      weaknesses:  ["Lacks Business Features", "Poor Product Discovery", "No social integration"],
                      positioning: ["Very secure", "Simple and to-the-point payments"],
                    },
                    {
                      name: "TikTok Shop", icon: "T",
                      advantages:  ["High product visibility", "Fast growing", "Strong appeal with younger audiences"],
                      weaknesses:  ["Chaotic order management", "Can be overwhelming", "Lack of flexibility"],
                      positioning: ["Social-driven commerce supported by content creation"],
                    },
                  ].map((comp, i) => (
                    <motion.tr key={comp.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="border-b border-[#252118] last:border-0">
                      <td className="p-4 bg-[#0f0d0b]">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white mb-2"
                          style={{ background: `${VENMO_BLUE}30` }}>{comp.icon}</div>
                        <p className="text-[#8B8178] text-xs leading-tight">{comp.name}</p>
                      </td>
                      <td className="p-4 bg-[#0f0d0b] align-top">
                        <ul className="flex flex-col gap-1.5">
                          {comp.advantages.map((a) => <li key={a} className="text-[#8B8178] text-xs leading-relaxed flex gap-1.5 items-start"><span className="mt-1 shrink-0" style={{ color: VENMO_BLUE }}>•</span>{a}</li>)}
                        </ul>
                      </td>
                      <td className="p-4 bg-[#0f0d0b] align-top">
                        <ul className="flex flex-col gap-1.5">
                          {comp.weaknesses.map((w) => <li key={w} className="text-[#8B8178] text-xs leading-relaxed flex gap-1.5 items-start"><span className="mt-1 shrink-0 text-[#6B3030]">•</span>{w}</li>)}
                        </ul>
                      </td>
                      <td className="p-4 bg-[#0f0d0b] align-top">
                        <ul className="flex flex-col gap-1.5">
                          {comp.positioning.map((p) => <li key={p} className="text-[#8B8178] text-xs leading-relaxed flex gap-1.5 items-start"><span className="mt-1 shrink-0" style={{ color: "#C4903A" }}>•</span>{p}</li>)}
                        </ul>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ════ SWOT ════════════════════════════════════ */}
          <Section id="swot" onVisible={setActiveSection}>
            <SectionLabel text="Internal Analysis" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">SWOT Analysis</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "STRENGTH", letter: "S", color: VENMO_BLUE,
                  points: ["Easy Adoption", "Tailored for informal businesses", "Intuitive", "Product Clarity and Organization", "Receipts and Inventory Tracking"],
                  delay: 0,
                },
                {
                  label: "WEAKNESS", letter: "W", color: "#8B6060",
                  points: ["May face trust issues", "Confusing Revenue Model", "May add app clutter", "SMBs may be resistant to switching"],
                  delay: 0.1,
                },
                {
                  label: "OPPORTUNITIES", letter: "O", color: "#4AB8A0",
                  points: ["Growing Popularity for Small Businesses", "Growing emphasis on digital solutions", "Potential integration/collaboration"],
                  delay: 0.2,
                },
                {
                  label: "THREAT", letter: "T", color: "#C4903A",
                  points: ["Policy limitations", "Comparable and quick-moving competition", "Risk of user drop-off", "Data/privacy concerns"],
                  delay: 0.3,
                },
              ].map((q) => (
                <FadeUp key={q.label} delay={q.delay}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                        style={{ background: `${q.color}30`, color: q.color }}>{q.letter}</div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: q.color }}>{q.label}</p>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {q.points.map((p) => (
                        <li key={p} className="flex gap-2 items-start">
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: q.color }} />
                          <span className="text-[#8B8178] text-xs leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ USER SURVEYS ════════════════════════════ */}
          <Section id="surveys" onVisible={setActiveSection}>
            <SectionLabel text="User Research" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-8 leading-tight">
              We conducted <span style={{ color: VENMO_LIGHT }}>40</span> User Surveys and learned&hellip;
            </h2>
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-6 mb-6 font-semibold text-white text-lg" style={{ background: VENMO_BLUE }}>
              32 of 40 surveyors have paid small businesses using Venmo before
            </motion.div>
            <div className="flex flex-col gap-4">
              {[
                { stat: "13", finding: "expressed concerns with a",  highlight: "lack of proof of purchase",      delay: 0.1 },
                { stat: "9",  finding: "were scared that they",       highlight: "didn't pay the right amount",    delay: 0.2 },
                { stat: "7",  finding: "are concerned with the",      highlight: "lack of 2-way communication",   delay: 0.3 },
              ].map((item, i) => (
                <FadeUp key={i} delay={item.delay}>
                  <div className="flex items-center gap-5 p-5 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                    <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{ background: `${VENMO_BLUE}25` }}>
                      <div className="w-4 h-4 rounded-full" style={{ background: VENMO_BLUE }} />
                    </div>
                    <p className="text-[#8B8178] text-sm leading-relaxed">
                      <span className="font-semibold text-[#F5EFE8]">{item.stat} surveyors </span>
                      {item.finding}{" "}
                      <span style={{ color: VENMO_LIGHT }} className="font-medium">{item.highlight}</span>
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ USER INTERVIEWS ═════════════════════════ */}
          <Section id="interviews" onVisible={setActiveSection}>
            <SectionLabel text="User Research" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-8 leading-tight">
              We conducted <span style={{ color: VENMO_LIGHT }}>15</span> User Interviews and learned&hellip;
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {[
                { stat: "14/15", title: "Used Venmo for small businesses",       body: "Participants used Venmo to pay taco stands, haircut shops, and vendor markets — confirming strong product-market fit.", delay: 0 },
                { stat: "12/15", title: "Expressed hesitation and confusion",    body: "Most felt uncertain after paying — unsure if payment went through, to the right person, or for the right amount.", delay: 0.1 },
                { stat: "9/15",  title: "Convenience over security",             body: "Users accept minor risk over added security steps — meaning the solution must be frictionless by design.", delay: 0.2 },
              ].map((card, i) => (
                <FadeUp key={i} delay={card.delay}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 hover:border-[#3D95CE]/30 transition-colors h-full">
                    <p className="font-display text-4xl font-bold mb-3" style={{ color: VENMO_LIGHT }}>{card.stat}</p>
                    <p className="font-semibold text-[#F5EFE8] mb-2 text-sm">{card.title}</p>
                    <p className="text-[#8B8178] text-sm leading-relaxed">{card.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <h3 className="font-display text-2xl font-bold text-[#F5EFE8] mb-6">What our Interviewees said</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { quote: "Sometimes silly descriptions make it hard to remember transactions.",                                     name: "Dora Elle Luis-Onedera", context: "on unclear payment memos",             delay: 0 },
                { quote: "I scanned the QR code, but still took some time to get the guy's attention.",                            name: "Musashi Avalos",         context: "on paying small businesses",          delay: 0.1 },
                { quote: "No payment confirmation other than the Venmo screen (made me nervous for a second).",                    name: "Sarah Kim",              context: "on lack of payment confirmation",     delay: 0.2 },
                { quote: "I always double check the username, I wish there was a confirmation that shows their business name.",     name: "Kristen Lee",            context: "on confusing verification",           delay: 0.3 },
              ].map((item, i) => (
                <FadeUp key={i} delay={item.delay}>
                  <div className="p-5 rounded-xl border border-[#252118] bg-[#0f0d0b] hover:border-[#3D95CE]/25 transition-colors h-full flex flex-col">
                    <p className="text-[#8B8178] text-sm leading-relaxed mb-4 italic flex-1">&ldquo;{item.quote}&rdquo;</p>
                    <div className="border-t border-[#252118] pt-3">
                      <p className="text-[#F5EFE8] text-xs font-semibold">{item.name}</p>
                      <p className="text-[#4A4540] text-[11px]">{item.context}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ AFFINITY MAPPING ════════════════════════ */}
          <Section id="affinity" onVisible={setActiveSection}>
            <SectionLabel text="Synthesis" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">Affinity Mapping</h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              After interviews, we clustered insights into three core theme groups to identify patterns across user frustrations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FadeUp>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                  <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8B8178] mb-4">Lack of Digital Proof</p>
                  <div className="flex flex-col gap-3">
                    <div className="rounded-lg p-3 text-sm font-medium text-white" style={{ background: VENMO_BLUE }}>Worried about paying the right amount</div>
                    <div className="rounded-lg p-3 text-sm font-medium text-white" style={{ background: "#5BAECC" }}>To have proof just in case</div>
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                  <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8B8178] mb-4">Sending to the Wrong Person</p>
                  <div className="flex flex-col gap-3">
                    <div className="rounded-lg p-3 text-sm font-medium text-white" style={{ background: VENMO_BLUE }}>Feel they need to personally verify they&apos;re sending to the right person</div>
                    <div className="rounded-lg p-3 text-sm font-medium text-white" style={{ background: "#2A8A7A" }}>Easy to send to the wrong user if the username is incorrect</div>
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.2}>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                  <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#8B8178] mb-4">Feels Unofficial & Sketchy</p>
                  <div className="flex flex-col gap-3">
                    <div className="rounded-lg p-3 text-sm font-medium text-white" style={{ background: "#C4903A" }}>Feels informal and trust-based</div>
                    <div className="rounded-lg p-3 text-sm font-medium text-white" style={{ background: "#C4903A" }}>Am I paying the right amount and the right person?</div>
                    <div className="rounded-lg p-3 text-sm font-medium text-white" style={{ background: "#C4903A" }}>Odd sending money to a &ldquo;stranger&rdquo; rather than an official account</div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </Section>

          {/* ════ USER PERSONAS ═══════════════════════════ */}
          <Section id="personas" onVisible={setActiveSection}>
            <SectionLabel text="User Personas" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">Who We&apos;re Designing For</h2>
            <div className="flex flex-col gap-8">
              {[
                {
                  label: "Seller Persona", name: "Jessie Tran", initials: "JT",
                  tags: ["Age 25", "She / Her", "Los Angeles, CA", "Clothing Reseller"],
                  bio: "Jessie wants her in-person selling experience at thrift markets to be seamless. She wants her booth to feel legitimate and keep her sales and payments organized.",
                  pains: ["Customers don't include order info in notes", "Lacks business tools (e.g. receipts, menu)", "Feels scrappy and unofficial"],
                },
                {
                  label: "Seller Persona", name: "Alexia (Lexie) Jefferson", initials: "AJ",
                  tags: ["Age 31", "She / Her", "Seattle, WA", "Food Truck Owner"],
                  bio: "Lexie wants a quick, hassle-free way to take payments while keeping the line moving and her business looking professional. The burgers don't flip themselves!",
                  pains: ["Trouble confirming if a customer paid her", "Tired of customers asking, \"Is this the right account?\"", "Feels discouraged as a smaller business"],
                },
              ].map((p, i) => (
                <FadeUp key={p.name} delay={i * 0.1}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <p className="text-[10px] font-medium tracking-[0.2em] uppercase mb-3" style={{ color: VENMO_BLUE }}>{p.label}</p>
                        <h3 className="font-display text-3xl font-bold text-[#F5EFE8] mb-4">{p.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {p.tags.map((t) => <span key={t} className="px-3 py-1 rounded-full text-xs border border-[#252118] text-[#8B8178]">{t}</span>)}
                        </div>
                        <p className="text-[#8B8178] text-sm leading-relaxed mb-6">{p.bio}</p>
                        <p className="text-[#F5EFE8] text-sm font-semibold mb-3">However&hellip;</p>
                        <div className="flex flex-col gap-2">
                          {p.pains.map((pain) => (
                            <span key={pain} className="inline-flex px-3 py-2 rounded-lg text-sm font-medium text-white w-fit" style={{ background: "#C45C5C" }}>
                              {pain}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 w-full md:w-44 h-44 rounded-2xl border border-[#252118] flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${VENMO_BLUE}15, #141210)` }}>
                        <span className="font-display text-6xl font-bold" style={{ color: `${VENMO_BLUE}30` }}>{p.initials}</span>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* User Story */}
            <FadeUp delay={0.2} className="mt-8">
              <div className="p-8 rounded-2xl border border-[#3D95CE]/25 bg-[#0d1929] relative overflow-hidden text-center">
                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 50% 50%, ${VENMO_BLUE}40, transparent 70%)` }} />
                <div className="relative z-10">
                  <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-5" style={{ color: VENMO_BLUE }}>User Story</p>
                  <p className="text-[#F5EFE8] text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
                    &ldquo;I want to easily navigate Venmo when purchasing from vendors so that I can{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">track</span> my different purchases,{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">trust</span> that my order is correct, and enjoy a{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">seamless</span> shopping experience.&rdquo;
                  </p>
                </div>
              </div>
            </FadeUp>
          </Section>

          {/* ════ PROBLEM STATEMENT ════════════════════════ */}
          <Section id="problem" onVisible={setActiveSection}>
            <SectionLabel text="Problem Statement" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">Defining the Problem</h2>

            <FadeUp>
              <div className="relative rounded-2xl border border-[#3D95CE]/30 bg-[#0d1929] p-8 mb-10 overflow-hidden">
                <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(ellipse at 20% 50%, ${VENMO_BLUE}30, transparent 60%)` }} />
                <div className="relative z-10">
                  <p className="text-[#F5EFE8] text-lg leading-relaxed mb-4">
                    Small businesses using Venmo struggle with{" "}
                    <span className="font-semibold text-[#E07070]">unclear</span> proof of purchase,{" "}
                    <span className="font-semibold text-[#E07070]">limited</span> inventory tracking, and{" "}
                    <span className="font-semibold text-[#E07070]">few</span> tools to promote themselves.
                  </p>
                  <p className="text-[#8B8178] text-lg leading-relaxed">
                    At the same time, buying through apps often{" "}
                    <span className="font-semibold text-[#E07070]">lacks</span> the personal, social connection of in-person
                    transactions. This creates <span className="font-semibold text-[#E07070]">friction</span> in both trust
                    and visibility for vendors and for customers.
                  </p>
                </div>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                { num: "#1", title: "Purchase Confusion", body: "Lack of proof of purchase and confusion when buying goods from vendors.", delay: 0 },
                { num: "#2", title: "Local Awareness",    body: "Small, local businesses want to raise awareness and market themselves.", delay: 0.1 },
                { num: "#3", title: "Social Connection",  body: "E-commerce apps remove the personal, in-person social connection.", delay: 0.2 },
              ].map((pain) => (
                <FadeUp key={pain.num} delay={pain.delay}>
                  <div className="rounded-xl border border-[#252118] bg-[#0f0d0b] p-6">
                    <span className="font-display text-3xl font-bold mb-3 block" style={{ color: VENMO_BLUE }}>{pain.num}</span>
                    <p className="font-semibold text-[#F5EFE8] mb-2">{pain.title}</p>
                    <p className="text-[#8B8178] text-sm leading-relaxed">{pain.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* HMW */}
            <FadeUp delay={0.2}>
              <div className="p-8 rounded-2xl border border-[#3D95CE]/30 bg-[#0d1929] text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 50% 50%, ${VENMO_BLUE}40, transparent 70%)` }} />
                <div className="relative z-10">
                  <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: VENMO_BLUE }}>How Might We</p>
                  <p className="font-display text-2xl md:text-3xl text-[#F5EFE8] font-semibold leading-snug max-w-2xl mx-auto">
                    How might we{" "}
                    <span style={{ color: VENMO_LIGHT }}>empower</span> small businesses to build better
                    relationships with their customers through{" "}
                    <span style={{ color: VENMO_LIGHT }}>Venmo</span>?
                  </p>
                </div>
              </div>
            </FadeUp>
          </Section>

          {/* ════ IDEATION ════════════════════════════════ */}
          <Section id="ideation" onVisible={setActiveSection}>
            <SectionLabel text="Ideation" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">Ideation</h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              We sketched 8 concept screens across the core problem areas — mapping each concept back to the pain points identified in research.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                {
                  pain: "Lack of security and verification",
                  solutions: ["Receipts", "Contract", "Payment", "Cart"],
                  color: "#C45C5C",
                  delay: 0,
                },
                {
                  pain: "Lack of discoverability of small businesses",
                  solutions: ["Storefront", "Search"],
                  color: VENMO_BLUE,
                  delay: 0.1,
                },
                {
                  pain: "Lack of legitimacy",
                  solutions: ["Storefront", "Feedback", "Customization"],
                  color: "#4AB8A0",
                  delay: 0.2,
                },
              ].map((item, i) => (
                <FadeUp key={i} delay={item.delay}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 h-full">
                    <div className="w-2 h-2 rounded-full mb-3" style={{ background: item.color }} />
                    <p className="font-semibold text-[#F5EFE8] text-sm mb-4">{item.pain}</p>
                    <p className="text-[#4A4540] text-[10px] uppercase tracking-[0.2em] mb-3">Solutions explored</p>
                    <div className="flex flex-wrap gap-2">
                      {item.solutions.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-md text-xs font-medium border"
                          style={{ borderColor: `${item.color}40`, color: item.color, background: `${item.color}10` }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* 8 sketched concepts */}
            <FadeUp delay={0.2}>
              <div className="p-5 rounded-xl border border-[#252118] bg-[#0f0d0b]">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-4">8 Concepts Sketched</p>
                <div className="flex flex-wrap gap-2">
                  {["Storefront", "Receipt", "Cart", "Search", "Feedback", "Contract", "Customizing", "Payment"].map((concept) => (
                    <span key={concept} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#3D95CE]/30 text-[#7ECDE6] bg-[#0d1929]">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </Section>

          {/* ════ LO-FI PROTOTYPES ════════════════════════ */}
          <Section id="lofi" onVisible={setActiveSection}>
            <SectionLabel text="Design" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">Low Fidelity Prototypes</h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              Each lo-fi screen was designed around a specific design goal — addressing legitimacy, trust, transparency, and social connection.
            </p>

            {/* Screen concepts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              {[
                { goal: "Establishing Legitimacy",    title: "Dedicated Vendor Page",      desc: "A searchable page of vendors nearby, with catalog views and business profiles to give buyers a clear preview before paying.", delay: 0 },
                { goal: "Building Trust",             title: "Vendor Catalog & Cart",       desc: "A detailed catalog of items with pricing, plus a cart summary that shows all items before checkout — eliminating ambiguity.", delay: 0.1 },
                { goal: "Transparency",               title: "Contract & Order Approval",   desc: "Buyers review and approve vendor terms before proceeding to payment — ensuring both parties are aware of the purchase.", delay: 0.2 },
                { goal: "Social Connection",          title: "QR Code + Receipt + Rating",  desc: "After QR payment, buyers receive a digital receipt. Post-purchase ratings let customers build the vendor's reputation.", delay: 0.3 },
              ].map((screen, i) => (
                <FadeUp key={i} delay={screen.delay}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 h-full hover:border-[#3D95CE]/30 transition-colors">
                    <div className="inline-flex items-center gap-2 mb-3 px-2.5 py-1 rounded-md text-[10px] font-medium border"
                      style={{ borderColor: `${VENMO_BLUE}40`, color: VENMO_BLUE, background: `${VENMO_BLUE}10` }}>
                      {screen.goal}
                    </div>
                    <p className="font-semibold text-[#F5EFE8] mb-2">{screen.title}</p>
                    <p className="text-[#8B8178] text-sm leading-relaxed">{screen.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ SOLUTION ════════════════════════════════ */}
          <Section id="solution" onVisible={setActiveSection}>
            <SectionLabel text="Introducing" />

            {/* Hero reveal */}
            <FadeUp>
              <div className="rounded-3xl p-10 mb-12 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d1929 0%, #0A0908 100%)" }}>
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${VENMO_BLUE}20, transparent 60%)` }} />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl" style={{ background: VENMO_BLUE }}>
                    🏪
                  </div>
                  <p className="text-[#8B8178] text-sm mb-2 tracking-widest uppercase">Now Introducing&hellip;</p>
                  <h2 className="font-display text-5xl md:text-6xl font-bold mb-2" style={{ color: VENMO_BLUE }}>venmo</h2>
                  <p className="text-[#F5EFE8] text-2xl font-semibold tracking-wide">Storefronts</p>
                </div>
              </div>
            </FadeUp>

            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              A dedicated storefront layer within Venmo that brings the trust and transparency of
              traditional e-commerce to in-person and small-business payments.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { tag: "Feature 01", title: "Vendor Discovery & Storefronts",    body: "A searchable map and profile system that lets small businesses be found — with catalogs, photos, and pricing visible before any payment.", delay: 0 },
                { tag: "Feature 02", title: "Cart, Receipt & Order Summary",      body: "A structured cart flow with itemized totals and post-payment digital receipts — eliminating uncertainty about what was paid for.", delay: 0.1 },
                { tag: "Feature 03", title: "Vendor Contract & Terms Approval",  body: "Buyers review and agree to vendor terms before paying. Both parties see a clear record of the transaction.", delay: 0.2 },
                { tag: "Feature 04", title: "Ratings & Social Trust Signals",    body: "Post-transaction ratings let buyers build a vendor's reputation, giving future customers confidence when paying.", delay: 0.3 },
              ].map((feature, i) => (
                <FadeUp key={i} delay={feature.delay}>
                  <div className="flex gap-6 p-6 rounded-2xl border border-[#252118] bg-[#0f0d0b] hover:border-[#3D95CE]/30 transition-colors">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{ background: `${VENMO_BLUE}20`, color: VENMO_BLUE }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase mb-1" style={{ color: VENMO_BLUE }}>{feature.tag}</p>
                      <p className="font-semibold text-[#F5EFE8] mb-2">{feature.title}</p>
                      <p className="text-[#8B8178] text-sm leading-relaxed">{feature.body}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ DESIGN SYSTEM ═══════════════════════════ */}
          <Section id="designsystem" onVisible={setActiveSection}>
            <SectionLabel text="Design System" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-4 leading-tight">Design System</h2>
            <p className="text-[#8B8178] text-base leading-relaxed max-w-xl mb-10">
              The Venmo Storefront design system was built on top of Venmo&apos;s existing brand — maintaining familiarity while adding the structure businesses need.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Typography */}
              <FadeUp>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-4">Typography</p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-2xl font-bold text-[#F5EFE8] mb-1">Athletics</p>
                      <p className="text-[11px] text-[#4A4540]">Heading / Accent Font</p>
                    </div>
                    <div className="border-t border-[#252118] pt-4">
                      <p className="text-base text-[#8B8178] mb-1" style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>Helvetica Neue</p>
                      <p className="text-[11px] text-[#4A4540]">Body Text Font</p>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Colors */}
              <FadeUp delay={0.1}>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-4">Colors</p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-[10px] text-[#4A4540] mb-2">Primary</p>
                      <div className="flex gap-2">
                        {[["#008CFF", "Venmo Blue"], ["#FFFFFF", "White"], ["#000000", "Black"]].map(([hex, name]) => (
                          <div key={hex} className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-lg border border-[#252118]" style={{ background: hex }} />
                            <span className="text-[9px] text-[#4A4540]">{hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#4A4540] mb-2">Neutral</p>
                      <div className="flex gap-2">
                        {[["#DEEFFF", "Light"], ["#2F3033", "Dark"], ["#F1F2F4", "Base"]].map(([hex, name]) => (
                          <div key={hex} className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-lg border border-[#252118]" style={{ background: hex }} />
                            <span className="text-[9px] text-[#4A4540]">{hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Components */}
              <FadeUp delay={0.2}>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6">
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-4">Components</p>
                  <div className="flex flex-col gap-3">
                    <div className="px-4 py-2 rounded-lg text-sm font-semibold text-white text-center" style={{ background: "#008CFF" }}>Primary Button</div>
                    <div className="px-4 py-2 rounded-lg text-sm font-semibold text-center border" style={{ borderColor: "#008CFF", color: "#008CFF" }}>Secondary Button</div>
                    <div className="px-3 py-2 rounded-lg text-xs border border-[#252118] text-[#8B8178] bg-[#0A0908]">Input field placeholder</div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((s) => <span key={s} className="text-yellow-400 text-sm">★</span>)}
                      <span className="text-xs text-[#4A4540] ml-1 self-center">Rating</span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </Section>

          {/* ════ POSITIONING ════════════════════════════ */}
          <Section id="positioning" onVisible={setActiveSection}>
            <SectionLabel text="Positioning Statement" />
            <FadeUp>
              <div className="relative rounded-3xl border border-[#3D95CE]/30 bg-[#0d1929] p-10 md:p-14 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 50% 50%, ${VENMO_BLUE}50, transparent 70%)` }} />
                <div className="relative z-10 max-w-2xl mx-auto">
                  <p className="text-[#F5EFE8] text-xl md:text-2xl leading-relaxed font-medium">
                    For{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">small business</span>{" "}
                    owners, <em>Venmo Storefronts</em> is the social, digital payment solution that enables
                    quick transactions and connects vendors and customers who already love using the
                    app — making every sale{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">easy</span>,{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">social</span>, and{" "}
                    <span style={{ color: VENMO_LIGHT }} className="font-semibold">seamless</span>.
                  </p>
                </div>
              </div>
            </FadeUp>
          </Section>

          {/* ════ GO-TO-MARKET ════════════════════════════ */}
          <Section id="gtm" onVisible={setActiveSection}>
            <SectionLabel text="Go-To-Market Strategy" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">Go-To-Market Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { phase: "1", label: "Pre-launch",  objective: "Build credibility and an organic audience within the micro- to medium-sized business community.", color: "#4A4540", delay: 0 },
                { phase: "2", label: "Launch",      objective: "Drive user adoption by leveraging organic channels and paid advertisements.", color: VENMO_BLUE, delay: 0.1 },
                { phase: "3", label: "Post-launch", objective: "Scale and optimize channels to encourage continuous growth and adoption.", color: "#4A4540", delay: 0.2 },
              ].map((p) => (
                <FadeUp key={p.phase} delay={p.delay}>
                  <div className={`rounded-2xl border p-7 h-full transition-colors ${p.color === VENMO_BLUE ? "border-[#3D95CE]/40 bg-[#0d1929]" : "border-[#252118] bg-[#0f0d0b]"}`}>
                    <div className="w-9 h-9 rounded-full border border-[#252118] flex items-center justify-center mb-4 text-sm font-semibold" style={{ color: p.color === VENMO_BLUE ? VENMO_LIGHT : "#6B6560" }}>
                      {p.phase}
                    </div>
                    <p className="font-display text-2xl font-bold mb-3" style={{ color: p.color === VENMO_BLUE ? VENMO_LIGHT : "#F5EFE8" }}>{p.label}</p>
                    <p className="text-[#8B8178] text-sm leading-relaxed">{p.objective}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ KPIs ════════════════════════════════════ */}
          <Section id="kpis" onVisible={setActiveSection}>
            <SectionLabel text="Key Performance Indicators" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">KPIs</h2>

            <div className="flex flex-col gap-8">
              {/* Social Media & Partnerships */}
              <FadeUp>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#252118] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: VENMO_BLUE }} />
                    <p className="font-semibold text-[#F5EFE8] text-sm">Social Media & Partnerships</p>
                    <span className="ml-auto text-[11px] text-[#4A4540]">Goal: Raise awareness and interest in Storefronts</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-3">Social Media · within 3 months</p>
                      <ul className="flex flex-col gap-2">
                        {["35M impressions across targeted platforms", "10K interactions on average per post", "2% Click Through Rate (CTR)", "Strong 85%+ positive sentiment analysis"].map((kpi) => (
                          <li key={kpi} className="flex gap-2 items-start">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: VENMO_BLUE }} />
                            <span className="text-[#8B8178] text-sm">{kpi}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-3">Partnerships · Poshmark, Uber Eats, Hulu</p>
                      <ul className="flex flex-col gap-2">
                        {["25M impressions across platforms", "15K Tags / Mentions across platforms", "50K new seller sign-ups", "750K landing page visits from partner links", "60+ Net Promoter Score (NPS)"].map((kpi) => (
                          <li key={kpi} className="flex gap-2 items-start">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "#4AB8A0" }} />
                            <span className="text-[#8B8178] text-sm">{kpi}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 mt-4">
                        {[["P", "#C04040"], ["UE", "#1A1A1A"], ["h", "#1CE783"]].map(([letter, bg]) => (
                          <div key={letter} className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ background: bg }}>{letter}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* SEO & Incentives */}
              <FadeUp delay={0.1}>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#252118] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#C4903A" }} />
                    <p className="font-semibold text-[#F5EFE8] text-sm">SEO Optimization & Incentives</p>
                    <span className="ml-auto text-[11px] text-[#4A4540]">Goal: Reduce friction in discovery and adoption</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-3">SEO · within 3 months of launch</p>
                      <ul className="flex flex-col gap-2">
                        {["5M+ organic search impressions", "150K+ clicks from search to storefronts", "1.5% average organic CTR", "10K+ indexed storefront pages", "5+ high-performing blog articles"].map((kpi) => (
                          <li key={kpi} className="flex gap-2 items-start">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "#C4903A" }} />
                            <span className="text-[#8B8178] text-sm">{kpi}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-3">Incentives</p>
                      <ul className="flex flex-col gap-2">
                        {["60K redemptions of early adopter offers", "100K+ invites sent via referral", "25K+ successful referrals"].map((kpi) => (
                          <li key={kpi} className="flex gap-2 items-start">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "#C4903A" }} />
                            <span className="text-[#8B8178] text-sm">{kpi}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Email & In-App */}
              <FadeUp delay={0.2}>
                <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#252118] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#7B5EA7" }} />
                    <p className="font-semibold text-[#F5EFE8] text-sm">Email Campaigns & In-App Promotions</p>
                    <span className="ml-auto text-[11px] text-[#4A4540]">Goal: Target qualified leads and keep them engaged</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-3">Email · within 3 months</p>
                      <ul className="flex flex-col gap-2">
                        {["2M+ emails sent to targeted users", "20%+ open rate", "5%+ CTR", "15K+ new storefront sign-ups", "10%+ conversion rate from email clicks"].map((kpi) => (
                          <li key={kpi} className="flex gap-2 items-start">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "#7B5EA7" }} />
                            <span className="text-[#8B8178] text-sm">{kpi}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-3">In-App Promotions</p>
                      <ul className="flex flex-col gap-2">
                        {["10M+ impressions within the app", "10%+ engagement rate on storefront prompts", "5K+ storefronts created through in-app prompts", "25K+ users completing milestone actions (first sale, referral)"].map((kpi) => (
                          <li key={kpi} className="flex gap-2 items-start">
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "#7B5EA7" }} />
                            <span className="text-[#8B8178] text-sm">{kpi}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </Section>

          {/* ════ OKRs ════════════════════════════════════ */}
          <Section id="okrs" onVisible={setActiveSection}>
            <SectionLabel text="Objectives & Key Results" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">OKRs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  num: "1", title: "Establish Venmo Storefronts as a go-to platform for small businesses and casual sellers",
                  krs: ["Launch Venmo Storefronts publicly by established target date with no critical bugs", "Onboard 500+ storefronts within the first 60 days of launch", "Reach 5,000+ unique visitors to storefront pages within the first month"],
                  delay: 0,
                },
                {
                  num: "2", title: "Build a sustainable and easy-to-discover search presence for Venmo Storefronts",
                  krs: ["Index all live Venmo Storefront pages in Google Search within 30 days of launch", "Achieve top 3+ Google search rankings for 5 high-intent long-tail keywords", "Generate 10,000+ organic search impressions for storefront-related searches within the first 3 months"],
                  delay: 0.1,
                },
                {
                  num: "3", title: "Drive engagement and retention through targeted email and in-app journey",
                  krs: ["Launch 3+ integral lifecycle email journeys with 30%+ open rates", "Achieve a 40% CTR on onboarding emails or in-app messages leading to storefront setup", "Reduce storefront drop-off rate by 25%+"],
                  delay: 0.2,
                },
              ].map((okr) => (
                <FadeUp key={okr.num} delay={okr.delay}>
                  <div className="rounded-2xl border border-[#252118] bg-[#0f0d0b] p-6 h-full">
                    <div className="w-9 h-9 rounded-full border border-[#252118] flex items-center justify-center mb-4 text-sm font-semibold text-[#6B6560]">{okr.num}</div>
                    <p className="font-semibold text-[#F5EFE8] text-sm mb-5 leading-relaxed">{okr.title}</p>
                    <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#4A4540] mb-3">Key Results</p>
                    <ul className="flex flex-col gap-3">
                      {okr.krs.map((kr) => (
                        <li key={kr} className="flex gap-2 items-start">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: VENMO_BLUE }} />
                          <span className="text-[#8B8178] text-xs leading-relaxed">{kr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              ))}
            </div>
          </Section>

          {/* ════ CONCLUSION ══════════════════════════════ */}
          <Section id="conclusion" onVisible={setActiveSection}>
            <SectionLabel text="Conclusion" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE8] mb-10 leading-tight">Wrapping Up</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <StatCard stat="40"    label="User surveys completed"       highlight delay={0}   />
              <StatCard stat="15"    label="User interviews completed"     highlight delay={0.1} />
              <StatCard stat="4"     label="Features in hi-fi prototype"   highlight delay={0.2} />
              <StatCard stat="$450M" label="Serviceable obtainable market" highlight delay={0.3} />
            </div>

            {/* Venmo closing quote */}
            <FadeUp delay={0.2}>
              <div className="relative rounded-2xl border border-[#3D95CE]/25 bg-[#0d1929] p-10 mb-10 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 30% 50%, ${VENMO_BLUE}40, transparent 60%)` }} />
                <div className="relative z-10">
                  <p className="font-display text-3xl md:text-4xl font-bold text-[#F5EFE8] mb-3 leading-snug italic">
                    &ldquo;Change people&apos;s relationships with money and each other.&rdquo;
                  </p>
                  <p className="text-sm font-medium" style={{ color: VENMO_BLUE }}>— Venmo&apos;s Mission</p>
                </div>
              </div>
            </FadeUp>

            <div className="flex flex-col gap-4 mb-16">
              {[
                "Validated that 80% of surveyed users had paid small businesses via Venmo — confirming strong product-market fit for a Storefront feature.",
                "Synthesized research into 3 core pain points via affinity mapping: purchase confusion, local awareness, and social connection.",
                "Designed a full GTM strategy with social media, SEO, incentive, email, and in-app channels — each with measurable KPIs.",
                "Built end-to-end: research → affinity mapping → personas → problem framing → ideation → lo-fi → hi-fi → design system → GTM → OKRs → stakeholder presentation.",
              ].map((point, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className="flex gap-4 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: VENMO_BLUE }} />
                    <p className="text-[#8B8178] text-sm leading-relaxed">{point}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.3}>
              <div className="pt-12 border-t border-[#252118] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="font-display text-2xl font-bold text-[#F5EFE8] mb-1">Want to see the full prototype?</p>
                  <p className="text-[#8B8178] text-sm">The Figma file, PRD, and presentation deck are available on request.</p>
                </div>
                <a href="mailto:val.chen21@gmail.com"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: VENMO_BLUE }}>
                  Get in touch →
                </a>
              </div>
            </FadeUp>
          </Section>

        </div>

        {/* ── TOC sidebar ──────────────────────────────── */}
        <aside className="hidden xl:block w-48 shrink-0">
          <TableOfContents active={activeSection} />
        </aside>
      </div>
    </div>
  );
}
