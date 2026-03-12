"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Resume from "@/components/sections/Resume";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ResumeModal from "@/components/ui/ResumeModal";
import Confetti from "@/components/ui/Confetti";
import { ModeProvider } from "@/components/ModeContext";

export default function Home() {
  return (
    <ModeProvider>
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
    </ModeProvider>
  );
}
