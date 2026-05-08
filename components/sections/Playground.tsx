"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function Playground() {
  return (
    <SectionWrapper id="playground" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.43, 0.195, 0.02, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#8B8178]">
              Playground
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-[#F5EFE8] leading-[1.05] tracking-tight">
            Insert coin.
          </h2>
        </motion.div>

        {/* PLAY NOW — leads to immersive arcade page */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.43, 0.195, 0.02, 1] }}
          className="mt-8"
        >
          <Link
            href="/play"
            className="group block relative w-full overflow-hidden rounded-2xl border border-[#252118] bg-[#141210] hover:bg-[#1a1714] transition-colors duration-300"
          >
            <div className="relative flex items-center justify-center py-12 md:py-16">
              {/* Arrow decorations on either side */}
              <span
                aria-hidden
                className="absolute left-6 md:left-12 text-3xl md:text-5xl text-[#3a3530] group-hover:text-[var(--accent)] transition-colors duration-300"
              >
                ◄
              </span>
              <span
                aria-hidden
                className="absolute right-6 md:right-12 text-3xl md:text-5xl text-[#3a3530] group-hover:text-[var(--accent)] transition-colors duration-300"
              >
                ►
              </span>

              <div className="text-center">
                <div className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[#F5EFE8] group-hover:text-[var(--accent)] transition-colors duration-300">
                  PLAY NOW
                </div>
                <div className="mt-3 text-[11px] md:text-xs tracking-[0.3em] uppercase text-[#8B8178] group-hover:text-[#F5EFE8] transition-colors duration-300">
                  Insert coin to continue →
                </div>
              </div>
            </div>
            {/* Bottom hover bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              style={{ background: "var(--accent)" }}
            />
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
