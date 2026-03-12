"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/content";
import { useMode } from "@/components/ModeContext";

const baseNavItems = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "About", href: "#about" },
];

const sectionIds = ["hero", "projects", "resume", "about"];

function useActiveSection() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return active;
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return scrolled;
}

function scrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Navigation() {
  const active = useActiveSection();
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isPlayMode, toggleMode, accentHex } = useMode();

  const navItems = baseNavItems.map((item) =>
    item.href === "#projects"
      ? { ...item, label: isPlayMode ? "Passion Projects" : "Work Projects" }
      : item
  );

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.43, 0.195, 0.02, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#0A0908]/90 backdrop-blur-xl border-b border-[#252118]/60"
            : "py-5 bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("#hero")}
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <span className="font-display text-[10px] font-bold text-[#0A0908] tracking-wider">
                {siteConfig.nameShort}
              </span>
            </div>
            <span className="text-sm font-medium text-[#F5EFE8]/70 group-hover:text-[#F5EFE8] transition-colors duration-200 hidden sm:block">
              {siteConfig.name}
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = active === sectionId;
              return (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                    isActive
                      ? "text-[#F5EFE8]"
                      : "text-[#8B8178] hover:text-[#F5EFE8]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[#252118]"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}

            {/* Mode toggle */}
            <button
              onClick={toggleMode}
              className="ml-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-widest uppercase transition-all duration-300"
              style={{
                background: isPlayMode ? "rgba(240,96,158,0.12)" : "rgba(91,174,204,0.10)",
                border: `1px solid ${isPlayMode ? "rgba(240,96,158,0.35)" : "rgba(91,174,204,0.25)"}`,
                color: accentHex,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6, height: 6,
                  borderRadius: "50%",
                  background: accentHex,
                  boxShadow: `0 0 6px ${accentHex}`,
                  transition: "background 0.3s, box-shadow 0.3s",
                }}
              />
              {isPlayMode ? "Play" : "Work"}
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event("openResume"))}
              className="ml-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
              style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
            >
              Resume ↗
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-px bg-[#F5EFE8]"
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-px bg-[#F5EFE8]"
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-px bg-[#F5EFE8]"
              transition={{ duration: 0.25 }}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#0A0908]/95 backdrop-blur-xl border-b border-[#252118] px-6 py-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    scrollTo(item.href);
                    setMobileOpen(false);
                  }}
                  className="text-left px-4 py-3 text-base font-medium text-[#8B8178] hover:text-[#F5EFE8] hover:bg-[#141210] rounded-lg transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-[#252118] my-2" />
              <button
                onClick={() => { toggleMode(); setMobileOpen(false); }}
                className="text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 flex items-center gap-3"
                style={{ color: accentHex }}
              >
                <span style={{
                  display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                  background: accentHex, boxShadow: `0 0 6px ${accentHex}`,
                }} />
                {isPlayMode ? "Switch to Work mode" : "Switch to Play mode"}
              </button>
              <button
                onClick={() => window.dispatchEvent(new Event("openResume"))}
                className="text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-200"
                style={{ color: "var(--accent)" }}
              >
                Download Resume ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
