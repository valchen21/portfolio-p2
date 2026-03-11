"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ResumeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openResume", handler);
    return () => window.removeEventListener("openResume", handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.43, 0.195, 0.02, 1] }}
            className="relative z-10 w-full max-w-5xl flex flex-col rounded-2xl border border-[#252118] bg-[#141210] overflow-hidden shadow-2xl"
            style={{ maxHeight: "95vh", height: "95vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#252118] shrink-0">
              <span className="text-sm font-medium text-[#F5EFE8]">Resume</span>
              <div className="flex items-center gap-3">
                <a
                  href="/resume.pdf"
                  download="Val_Chen_Resume.pdf"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5BAECC] text-[#0A0908] text-xs font-semibold hover:bg-[#7ECDE6] transition-colors duration-200"
                >
                  Download ↓
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full border border-[#252118] flex items-center justify-center text-[#8B8178] hover:text-[#F5EFE8] hover:border-[#3a3020] transition-all duration-200 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* PDF iframe — view=Fit shows full page, toolbar lets them zoom */}
            <iframe
              src="/resume.pdf#view=Fit&toolbar=1&navpanes=0&scrollbar=1"
              className="w-full flex-1"
              style={{ border: "none" }}
              title="Val Chen Resume"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
