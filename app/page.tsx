"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Resume from "@/components/sections/Resume";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navigation />
      <Hero />
      <Projects />
      <Resume />
      <About />
      <Footer />
    </main>
  );
}
