"use client";

import { siteConfig } from "@/data/content";

function scrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "About", href: "#about" },
];

const socialLinks = [
  { label: "LinkedIn", href: siteConfig.linkedin },
  { label: "GitHub", href: siteConfig.github },
  { label: "Email", href: `mailto:${siteConfig.email}` },
];

export default function Footer() {
  return (
    <footer className="relative py-20 border-t border-[#252118]">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0908]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 mb-16">
          {/* Left: Name + tagline */}
          <div>
            <button
              onClick={() => scrollTo("#hero")}
              className="group flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-[#5BAECC] flex items-center justify-center">
                <span className="font-display text-[10px] font-bold text-[#0A0908] tracking-wider">
                  {siteConfig.nameShort}
                </span>
              </div>
              <span className="font-display text-lg font-bold text-[#F5EFE8] group-hover:text-[#5BAECC] transition-colors duration-200">
                {siteConfig.name}
              </span>
            </button>
            <p className="text-sm text-[#4A4540] max-w-[240px] leading-relaxed">
              Product · Design · Strategy.<br />
              Building things people love.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex gap-16 md:gap-20">
            {/* Nav links */}
            <div>
              <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4A4540] mb-4">
                Navigate
              </h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-[#8B8178] hover:text-[#F5EFE8] transition-colors duration-200 link-hover"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social links */}
            <div>
              <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#4A4540] mb-4">
                Connect
              </h4>
              <ul className="space-y-2.5">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="text-sm text-[#8B8178] hover:text-[#F5EFE8] transition-colors duration-200 link-hover"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#252118] mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-[#4A4540]">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4A8B6A]" />
            <span className="text-xs text-[#4A4540]">Available for new projects</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
