"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Playground from "@/components/sections/Playground";
import Resume from "@/components/sections/Resume";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ResumeModal from "@/components/ui/ResumeModal";
import EntranceIntro from "@/components/EntranceIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const alreadyEntered = sessionStorage.getItem("hasEnteredPortfolio");
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;

    if (alreadyEntered || !desktop) {
      setShowIntro(false);
      setHeroMounted(true);
    } else {
      setShowIntro(true);
    }
  }, []);

  if (showIntro === null) {
    return <div style={{ minHeight: "100vh", background: "#0A0908" }} />;
  }

  return (
    <>
      {heroMounted && (
        <main>
          <ScrollProgress />
          <ResumeModal />
          <Navigation />
          <Hero />
          <Projects />
          <Playground />
          <Resume />
          <About />
          <Footer />
        </main>
      )}
      {showIntro && (
        <EntranceIntro
          onLeaving={() => setHeroMounted(true)}
          onComplete={() => {
            sessionStorage.setItem("hasEnteredPortfolio", "true");
            setShowIntro(false);
          }}
        />
      )}
    </>
  );
}
