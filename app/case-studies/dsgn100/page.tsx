"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ─── TOC config ───────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: "overview",    label: "Overview" },
  { id: "team",        label: "The Team" },
  { id: "research",    label: "Research" },
  { id: "fieldwork",   label: "Field Work" },
  { id: "personas",    label: "User Personas" },
  { id: "interviews",  label: "Interviews" },
  { id: "mission",     label: "Mission" },
  { id: "prototype",   label: "Physical Prototype" },
  { id: "kiosk",       label: "Digital Kiosk" },
  { id: "testing",     label: "User Testing" },
  { id: "process",     label: "Process" },
  { id: "conclusion",  label: "Conclusion" },
];

const GREEN  = "#4A8C5C";
const GREEN_LIGHT = "#72B88A";

// ─── Sticky TOC ───────────────────────────────────────────────────────────────
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
              style={{ width: isActive ? "20px" : "8px", background: isActive ? GREEN : "#3A3530" }}
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
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-16 border-b border-[#1E1B17] ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#0F0E0D] border border-[#252118] rounded-xl p-5 text-center">
      <div className="text-3xl font-bold text-[#72B88A] mb-1">{value}</div>
      <div className="text-xs text-[#8B8178]">{label}</div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DSGN100CaseStudy() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

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
        <span className="text-xs tracking-widest uppercase text-[#4A4540]">DSGN 100 · PantryPal</span>
        <div className="w-16" />
      </header>

      {/* ── Hero ── */}
      <div className="pt-20 pb-0">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a10] via-[#0A0908] to-[#0A0908]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${GREEN}40, transparent)`,
            }}
          />
          <div className="relative max-w-6xl mx-auto px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full border"
                  style={{ color: GREEN_LIGHT, borderColor: `${GREEN}60`, background: `${GREEN}15` }}
                >
                  UCSD DSGN 100
                </span>
                <span className="text-xs text-[#5C5650]">UX · Academic Capstone</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                PantryPal
              </h1>
              <p className="text-xl text-[#8B8178] max-w-2xl leading-relaxed">
                A grocery store recipe kiosk that helps shoppers discover personalized recipes
                and locate the right ingredients — designed end-to-end from research to high-fidelity prototype.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                { label: "Role", value: "UX Designer & Researcher" },
                { label: "Team", value: "4 Designers" },
                { label: "Course", value: "UCSD DSGN 100" },
                { label: "Deliverable", value: "Physical + Digital Prototype" },
              ].map((m) => (
                <div key={m.label} className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-4">
                  <p className="text-xs text-[#5C5650] mb-1">{m.label}</p>
                  <p className="text-sm font-medium text-[#F5EFE8]">{m.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Cover image */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 rounded-2xl overflow-hidden border border-[#1E1B17]"
            >
              <Image
                src="/Pantry Pal/Pantry Pal Cover.PNG"
                alt="PantryPal Cover"
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Body: TOC + Content ── */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex gap-16">
          {/* TOC */}
          <div className="hidden lg:block w-44 shrink-0">
            <TableOfContents active={activeSection} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* OVERVIEW */}
            <Section id="overview">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-6">Overview</h2>
                <p className="text-[#B8B0A8] leading-relaxed mb-6">
                  PantryPal is an interactive grocery store kiosk designed for UCSD&apos;s DSGN 100 capstone.
                  Located near the store entrance, it streamlines meal planning by recommending tailored
                  recipes based on lifestyle preferences, dietary needs, allergies, and budget — then guides
                  shoppers directly to the ingredients they need in-store.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard value="10/12" label="Interviewees struggled to locate groceries for recipes" />
                  <StatCard value="3.16/5" label="Avg. confidence in finding diet-friendly options" />
                  <StatCard value="8/12" label="Shoppers approach the store unsure what to buy" />
                  <StatCard value="4/5" label="Navigation ease rating from user testing" />
                </div>
              </FadeIn>
            </Section>

            {/* TEAM */}
            <Section id="team">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-6">The Team</h2>
                <p className="text-[#8B8178] text-sm mb-6">Group 12: Foodies · March 2025</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Val Chen", email: "vac001@ucsd.edu" },
                    { name: "Kristen Lee", email: "krl010@ucsd.edu" },
                    { name: "Evelyn Huang", email: "evhuang@ucsd.edu" },
                    { name: "Natalie Kim", email: "nak010@ucsd.edu" },
                  ].map((m) => (
                    <div key={m.name} className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-4">
                      <p className="text-sm font-medium text-[#F5EFE8] mb-1">{m.name}</p>
                      <p className="text-xs text-[#5C5650] break-all">{m.email}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </Section>

            {/* RESEARCH */}
            <Section id="research">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-2">Research</h2>
                <p className="text-[#8B8178] text-sm mb-8">Stage 1: Online Research</p>
                <p className="text-[#B8B0A8] leading-relaxed mb-8">
                  We identified four core problem areas driving the need for a grocery kiosk solution:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Food Allergies",
                      challenge: "Hard-to-find safe foods, unclear labeling, cross-contamination risks, and time-consuming shopping.",
                      solution: "Allergy-friendly recipes, adaptable meal options, budget-friendly choices, and cost-effective planning.",
                    },
                    {
                      title: "Food Restrictions",
                      challenge: "Difficult meal planning, limited recipe options, and food waste.",
                      solution: "Customizable diet-friendly recipes, budget-conscious ingredient choices, and waste reduction.",
                    },
                    {
                      title: "Students & Cooking",
                      challenge: "Limited dining hall hours, lack of cooking skills, poor nutrition affecting focus.",
                      solution: "Budget-friendly, easy-to-make recipes, step-by-step cooking guides, and personalized meal plans.",
                    },
                    {
                      title: "Too Tired to Cook",
                      challenge: "77% feel too exhausted to cook, leading to reliance on fast food and takeout.",
                      solution: "Quick, budget-friendly recipes, time-based meal suggestions, and healthier fast-food alternatives.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-5">
                      <h3 className="text-sm font-semibold mb-3" style={{ color: GREEN_LIGHT }}>{item.title}</h3>
                      <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-1">Challenge</p>
                        <p className="text-xs text-[#8B8178] leading-relaxed">{item.challenge}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-1">Kiosk Solution</p>
                        <p className="text-xs text-[#B8B0A8] leading-relaxed">{item.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </Section>

            {/* FIELD WORK */}
            <Section id="fieldwork">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-2">Field Work</h2>
                <p className="text-[#8B8178] text-sm mb-8">Stage 2: Observational Research at Whole Foods, Trader Joe&apos;s & Ralphs</p>
                <div className="space-y-6">
                  {[
                    {
                      store: "Whole Foods",
                      pathway: "Shoppers start in the produce section, navigating based on past experience and phone-based shopping lists. New shoppers took longer to orient. A noticeable number immediately went to the hot foods section.",
                      placement: "Near the store entrance: the kiosk could help shoppers decide between meal prep and ready-to-eat options early on.",
                    },
                    {
                      store: "Trader Joe's",
                      pathway: "Many shoppers place items in their carts and later remove them — suggesting reconsideration possibly due to price, ingredients, or impulse buying. Some customers FaceTimed friends to get feedback on a product.",
                      placement: "Near the store entrance: the kiosk could help shoppers decide between meal prep and ready-to-eat options early on.",
                    },
                    {
                      store: "Ralphs",
                      pathway: "Shoppers often don't have a clear plan before entering. The kiosk could help create a smart shopping list based on budget, dietary needs, and meal planning goals — and highlight weekly promotions and deals.",
                      placement: "Near the entrance and produce section: pairs well with fresh ingredient suggestions and weekly sales.",
                    },
                  ].map((item) => (
                    <div key={item.store} className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-6">
                      <h3 className="font-semibold mb-4" style={{ color: GREEN_LIGHT }}>{item.store}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">Shopper Pathway</p>
                          <p className="text-sm text-[#8B8178] leading-relaxed">{item.pathway}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">PantryPal Kiosk Placement</p>
                          <p className="text-sm text-[#B8B0A8] leading-relaxed">{item.placement}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </Section>

            {/* USER PERSONAS */}
            <Section id="personas">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-8">User Personas</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pearl */}
                  <div className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-[#1E1B17]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#1E1B17] flex items-center justify-center text-lg">👩</div>
                        <div>
                          <p className="font-semibold text-[#F5EFE8]">Pearl Supapisal</p>
                          <p className="text-xs text-[#5C5650]">Age 29 · Female</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#8B8178] leading-relaxed">
                        A busy professional with a demanding job. Works long hours and doesn&apos;t have time to
                        always plan meals in advance. Prefers quick, healthy meals that don&apos;t require a lot of
                        prep work. Focuses on whole foods and clean eating but resorts to takeout due to time constraints.
                      </p>
                    </div>
                    <div className="px-6 py-4 border-b border-[#1E1B17]">
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">Core Needs</p>
                      <ul className="space-y-1">
                        {[
                          "Find quick, healthy recipes she can prepare after work",
                          "Stick to wholesome, organic ingredients without overspending",
                          "Nutritional insights on meals to stay on track with fitness goals",
                        ].map((n) => (
                          <li key={n} className="text-xs text-[#8B8178] flex gap-2">
                            <span style={{ color: GREEN_LIGHT }} className="mt-0.5">·</span>{n}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">Frustrations</p>
                      <ul className="space-y-1">
                        {[
                          "Lack of time for meal planning and grocery shopping",
                          "Gets overwhelmed by complex recipes with too many steps",
                          "Struggles to find balanced meals that are both quick and nutritious",
                        ].map((f) => (
                          <li key={f} className="text-xs text-[#8B8178] flex gap-2">
                            <span className="text-red-400 mt-0.5">·</span>{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Evan */}
                  <div className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-[#1E1B17]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#1E1B17] flex items-center justify-center text-lg">👨</div>
                        <div>
                          <p className="font-semibold text-[#F5EFE8]">Evan Ji</p>
                          <p className="text-xs text-[#5C5650]">Age 35 · Male</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#8B8178] leading-relaxed">
                        A busy father who juggles work and family life. Enjoys cooking for his wife and two kids
                        but needs quick, nutritious, kid-friendly meals. His youngest child has a severe nut allergy,
                        requiring extra caution. Values high-quality, allergy-safe options but wants to keep grocery bills in check.
                      </p>
                    </div>
                    <div className="px-6 py-4 border-b border-[#1E1B17]">
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">Core Needs</p>
                      <ul className="space-y-1">
                        {[
                          "Ensure all meals are nut-free and safe for his child",
                          "Get budget-friendly options to feed a family of four without overspending",
                          "Save time by getting all ingredients in one trip",
                        ].map((n) => (
                          <li key={n} className="text-xs text-[#8B8178] flex gap-2">
                            <span style={{ color: GREEN_LIGHT }} className="mt-0.5">·</span>{n}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">Frustrations</p>
                      <ul className="space-y-1">
                        {[
                          "Finding safe, allergy-friendly recipes can be time-consuming",
                          "Wants to avoid expensive specialty foods but still prioritize quality",
                          "Doesn't always have time to browse aisles for recipe ideas",
                        ].map((f) => (
                          <li key={f} className="text-xs text-[#8B8178] flex gap-2">
                            <span className="text-red-400 mt-0.5">·</span>{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </Section>

            {/* INTERVIEWS */}
            <Section id="interviews">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-8">User Interviews</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <StatCard value="10/12" label="Expressed instances of struggling to locate groceries for recipes" />
                  <StatCard value="8/12" label="Usually approach grocery shopping unsure of what they are looking for" />
                  <StatCard value="3.16/5" label="Average confidence in finding options that fit dietary needs" />
                </div>

                <div className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-6 mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-3">Key Quote</p>
                  <blockquote className="text-[#B8B0A8] italic text-sm leading-relaxed border-l-2 pl-4" style={{ borderColor: GREEN }}>
                    &ldquo;I look for an egg substitute, but I had to go to 2 different grocery stores looking for it
                    because they were either sold out or they just didn&apos;t carry it.&rdquo;
                    <footer className="mt-2 text-[#5C5650] not-italic">— Kat, Interview Participant</footer>
                  </blockquote>
                </div>

                <p className="text-[#8B8178] text-sm leading-relaxed">
                  We interviewed 12 participants across dietary backgrounds — including those with food allergies,
                  dietary restrictions, and general shopping challenges. Common themes included decision fatigue,
                  difficulty finding allergen-safe options, and the desire for personalized recipe guidance in-store.
                </p>
              </FadeIn>
            </Section>

            {/* MISSION */}
            <Section id="mission">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-6">Mission Statement</h2>
                <div
                  className="rounded-2xl p-8 mb-6"
                  style={{ background: `linear-gradient(135deg, ${GREEN}15, transparent)`, border: `1px solid ${GREEN}30` }}
                >
                  <p className="text-lg text-[#F5EFE8] leading-relaxed font-medium mb-4">
                    Our mission is to offer a convenient and efficient grocery planning kiosk that caters to the
                    needs of shoppers looking for stress-free meal solutions.
                  </p>
                  <p className="text-[#8B8178] leading-relaxed">
                    We aim to provide a seamless, personalized grocery shopping experience by recommending recipes
                    and guiding users to the right ingredients based on their lifestyle, dietary needs, allergies,
                    and budget. Our kiosk allows users to discover tailored recipes, generate organized shopping
                    lists, and easily locate ingredients in store — making meal planning effortless and enjoyable.
                  </p>
                </div>
              </FadeIn>
            </Section>

            {/* PHYSICAL PROTOTYPE */}
            <Section id="prototype">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-2">Physical Prototype</h2>
                <p className="text-[#8B8178] text-sm mb-8">Laser-cut wooden kiosk with iPad screen mount</p>
                <div className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Frame", desc: "Puzzle-box laser-cut wood pieces assembled to hold the iPad screen at the optimal eye-level viewing angle." },
                      { label: "Organic Feel", desc: "Puzzle box construction creates natural wood joints, mimicking an organic, handcrafted aesthetic that aligns with a grocery environment." },
                      { label: "Details", desc: "Wooden fruit decorations (peach, tomato, cherry) on the exterior panels reinforce the food theme and brand identity." },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-xl" style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
                        <p className="text-sm font-medium mb-2" style={{ color: GREEN_LIGHT }}>{item.label}</p>
                        <p className="text-xs text-[#8B8178] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-[#5C5650] text-center italic">
                    Physical kiosk built using laser-cut wood, puzzle-box joinery, and an iPad touchscreen display
                  </div>
                </div>
              </FadeIn>
            </Section>

            {/* DIGITAL KIOSK */}
            <Section id="kiosk">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-2">Interactive Digital Kiosk</h2>
                <p className="text-[#8B8178] text-sm mb-8">High-fidelity Figma prototype with 4 core screens</p>
                <div className="space-y-4">
                  {[
                    {
                      screen: "Start Page",
                      tag: "01",
                      desc: "What shoppers see when they first arrive at the kiosk. Features the PantryPal logo, brand tagline \"Your Pantry, Your Preferences, Your Perfect Meal!\" and a \"Tap to Start\" CTA.",
                    },
                    {
                      screen: "Search / Browse Page",
                      tag: "02",
                      desc: "Shoppers can search a specific recipe or browse through categories (Breakfast, Appetizer, Lunch, Dinner), cuisines (Italian, Chinese, Greek, Japanese), or explore popular recipes.",
                    },
                    {
                      screen: "Result Page",
                      tag: "03",
                      desc: "Displays recipe results with filters for allergies, budget ($–$$$), and dietary preferences. Each card shows recipe name, description, cost tier, allergy tags, and a favorite button.",
                    },
                    {
                      screen: "Recipe & Ingredients Page",
                      tag: "04",
                      desc: "Full recipe with adjustable serving size and step-by-step directions. The Ingredients tab shows each ingredient with price, aisle number, shelf number, and a dropdown for cheaper alternatives.",
                    },
                    {
                      screen: "Favorited Page",
                      tag: "05",
                      desc: "Saved recipes displayed as cards. Shoppers can export their recipe list and shopping plan via text or email to continue shopping with their phone.",
                    },
                  ].map((item) => (
                    <div key={item.screen} className="flex gap-4 bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{ background: `${GREEN}20`, color: GREEN_LIGHT }}
                      >
                        {item.tag}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F5EFE8] mb-1">{item.screen}</p>
                        <p className="text-xs text-[#8B8178] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hi-fi screen gallery */}
                <FadeIn delay={0.1}>
                  <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mt-10 mb-4">High-Fidelity Screens</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="rounded-xl overflow-hidden border border-[#1E1B17] bg-[#0F0E0D]">
                        <Image
                          src={`/Pantry Pal/PP ${n}.PNG`}
                          alt={`PantryPal screen ${n}`}
                          width={600}
                          height={800}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </FadeIn>
            </Section>

            {/* USER TESTING */}
            <Section id="testing">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-8">User Testing</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* In-person */}
                  <div className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: GREEN_LIGHT }}>In-Person Session</p>
                    <div className="mb-4">
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">Key Insights</p>
                      <ul className="space-y-1 text-xs text-[#8B8178]">
                        <li className="flex gap-2"><span style={{ color: GREEN_LIGHT }}>·</span>Navigation: Easy (4/5) for both users</li>
                        <li className="flex gap-2"><span className="text-red-400">·</span>Filters felt separate / unnecessary on home screen</li>
                        <li className="flex gap-2"><span className="text-red-400">·</span>No recipe suggestions for unsure users</li>
                        <li className="flex gap-2"><span className="text-red-400">·</span>Export button was hard to find</li>
                        <li className="flex gap-2"><span style={{ color: GREEN_LIGHT }}>·</span>Users completed tasks without frustration</li>
                        <li className="flex gap-2"><span style={{ color: GREEN_LIGHT }}>·</span>Interface described as &ldquo;cute and intuitive&rdquo;</li>
                      </ul>
                    </div>
                  </div>

                  {/* Community */}
                  <div className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: GREEN_LIGHT }}>Community Testing</p>
                    <div className="mb-4">
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">Key Insights</p>
                      <ul className="space-y-1 text-xs text-[#8B8178]">
                        <li className="flex gap-2"><span style={{ color: GREEN_LIGHT }}>·</span>2 users found it generally easy to navigate</li>
                        <li className="flex gap-2"><span className="text-red-400">·</span>Serving size adjustments weren&apos;t intuitive</li>
                        <li className="flex gap-2"><span className="text-red-400">·</span>Filters (allergies, budget) were hard to find</li>
                        <li className="flex gap-2"><span className="text-red-400">·</span>Export button not where expected</li>
                        <li className="flex gap-2"><span style={{ color: GREEN_LIGHT }}>·</span>Icons helpful; ingredient map praised</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-6">
                  <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-4">Recommendations for Next Iteration</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Combine filters with recipe list for smoother flow",
                      "Add visuals & videos for clearer cooking instructions",
                      "Suggest recipes for users who don't know what to search",
                      "Make export feature more prominent and easier to locate",
                      "Include tooltips and an optional onboarding walkthrough",
                      "Add a persistent 'Back to Home' button for navigation",
                      "Add barcode scanning and grocery app sync",
                      "Integrate nutrition filters into search",
                    ].map((rec) => (
                      <div key={rec} className="flex gap-2 text-xs text-[#8B8178]">
                        <span style={{ color: GREEN_LIGHT }} className="mt-0.5 shrink-0">→</span>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </Section>

            {/* PROCESS */}
            <Section id="process">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-8">Process Materials</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      stage: "Stage 1",
                      title: "Online Research",
                      desc: "Competitive analysis of medical and grocery kiosks. Identified four key problem areas: food allergies, dietary restrictions, student cooking challenges, and fatigue-driven unhealthy eating.",
                    },
                    {
                      stage: "Stage 2",
                      title: "Field Work",
                      desc: "Observational research at Whole Foods, Trader Joe's, and Ralphs. Mapped shopper pathways, decision-making patterns, and identified optimal kiosk placement near store entrances.",
                    },
                    {
                      stage: "Stage 3",
                      title: "Moodboard & Style Guide",
                      desc: "Established visual identity: bright green primary, orange and yellow accents, beige background. Typography: DM Sans (primary) and Rammetto One (display). Warm, inviting, and effortless aesthetic.",
                    },
                    {
                      stage: "Stage 4",
                      title: "Storyboards",
                      desc: "6 scenario storyboards covering: The Busy Professional, The Broke College Student, The Meal Prep Overload, The Allergy-Aware Parent, The Sustainability-Shopper, and The Dinner Party Puzzle.",
                    },
                    {
                      stage: "Stage 5",
                      title: "Lo-Fi Wireframes",
                      desc: "Sketched wireframes for all key screens: Home, Search/Recipe, Ingredients, Filter Preferences, Export Screen, and Favorited Recipes. Validated user flows before building high-fidelity screens.",
                    },
                    {
                      stage: "Stage 6",
                      title: "Clickable Prototype",
                      desc: "High-fidelity Figma prototype with full navigation flows: Home → Browse → Filter → Recipe → Ingredients → Export. Tested with two rounds of usability participants.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-5">
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: GREEN }}>{item.stage}</p>
                      <p className="text-sm font-semibold text-[#F5EFE8] mb-2">{item.title}</p>
                      <p className="text-xs text-[#8B8178] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </Section>

            {/* CONCLUSION */}
            <Section id="conclusion">
              <FadeIn>
                <h2 className="text-2xl font-serif font-bold mb-6">Conclusion</h2>
                <div
                  className="rounded-2xl p-8 mb-8"
                  style={{ background: `linear-gradient(135deg, ${GREEN}10, transparent)`, border: `1px solid ${GREEN}25` }}
                >
                  <p className="text-[#B8B0A8] leading-relaxed mb-4">
                    Overall, we learned a lot about the research and prototyping process in creating PantryPal.
                    The project pushed us to move from identifying a real, everyday pain point all the way through
                    a validated high-fidelity prototype and physical kiosk build.
                  </p>
                  <p className="text-[#8B8178] leading-relaxed">
                    If we had more time, we would iterate on the digital prototype by optimizing user flows and
                    testing more features — particularly around barcode scanning, grocery app integration, and
                    nutrition tracking. For the physical prototype, we could add a recipe printing feature or
                    push further with the industrial design.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "What I built", value: "End-to-end UX process from primary research through physical + digital prototype" },
                    { label: "What I learned", value: "How to translate user insights into design decisions, and how to run usability tests that actually improve a product" },
                    { label: "What's next", value: "Barcode scanning, grocery app sync, nutrition filters, and a persistent navigation system" },
                  ].map((item) => (
                    <div key={item.label} className="bg-[#0F0E0D] border border-[#1E1B17] rounded-xl p-5">
                      <p className="text-[10px] uppercase tracking-widest text-[#5C5650] mb-2">{item.label}</p>
                      <p className="text-sm text-[#B8B0A8] leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </Section>

            {/* Nav footer */}
            <div className="py-12 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-[#8B8178] hover:text-[#F5EFE8] transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Portfolio
              </Link>
              <Link
                href="/case-studies/venmo"
                className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: GREEN_LIGHT }}
              >
                Next: Venmo Storefronts
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
