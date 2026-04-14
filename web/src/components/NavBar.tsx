"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 60);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[60px] transition-colors duration-200 ${
        scrolled
          ? "bg-white border-b border-neutral-200"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="h-full px-5 md:px-10 lg:px-20 flex items-center justify-between">
        <Link
          href="/"
          className={`font-display font-bold text-[20px] transition-colors duration-200 ${
            scrolled ? "text-neutral-900" : "text-white"
          }`}
        >
          Journy
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className={`font-body font-normal text-[16px] transition-colors duration-200 ${
              scrolled ? "text-neutral-600" : "text-white/80 hover:text-white"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/quiz"
            className={`font-body font-semibold text-[16px] px-5 py-2 rounded-[20px] border-[1.5px] transition-colors duration-200 ${
              scrolled
                ? "border-primary text-primary"
                : "border-white text-white"
            }`}
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className={`md:hidden text-[24px] leading-none transition-colors duration-200 ${
            scrolled ? "text-neutral-900" : "text-white"
          }`}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div
          className={`md:hidden flex flex-col gap-3 px-5 py-4 border-t ${
            scrolled
              ? "bg-white border-neutral-200"
              : "bg-primary border-white/20"
          }`}
        >
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className={`font-body font-normal text-[16px] ${
              scrolled ? "text-neutral-600" : "text-white/80"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/quiz"
            onClick={() => setMenuOpen(false)}
            className={`font-body font-semibold text-[16px] px-5 py-2 rounded-[20px] border-[1.5px] w-fit ${
              scrolled
                ? "border-primary text-primary"
                : "border-white text-white"
            }`}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
