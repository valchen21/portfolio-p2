"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Resume from "@/components/sections/Resume";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ResumeModal from "@/components/ui/ResumeModal";
import Confetti from "@/components/ui/Confetti";
import EntranceIntro from "@/components/EntranceIntro";
import { ModeProvider } from "@/components/ModeContext";

export default function Home() {
  // null = undecided (SSR / first paint); true = show intro; false = intro done
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  // Hero mounts when intro enters its "leaving" phase, so they crossfade smoothly.
  // On mobile/iPad we skip the intro and mount hero immediately.
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine)"
    ).matches;
    setShowIntro(desktop);
    if (!desktop) setHeroMounted(true);
  }, []);

  if (showIntro === null) {
    return <div style={{ minHeight: "100vh", background: "#0A0908" }} />;
  }

  return (
    <ModeProvider>
      {heroMounted && (
        <main>
          <ScrollProgress />
          <Confetti />
          <ResumeModal />
          <Navigation />
          <Hero />
          <Projects />
          <Resume />
          <About />
          <Footer />
        </main>
      )}
      {showIntro && (
        <EntranceIntro
          onLeaving={() => setHeroMounted(true)}
          onComplete={() => setShowIntro(false)}
        />
      )}
    </ModeProvider>
  );
}
