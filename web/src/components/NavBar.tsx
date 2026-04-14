"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-primary">
      <div className="h-full px-5 md:px-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display font-normal text-[20px] leading-[1.9] text-white"
        >
          Journy
        </Link>

        <div className="hidden md:flex items-center gap-6 p-[10px]">
          <Link
            href="/login"
            className="font-body font-normal text-[16px] leading-[1.5] text-white"
          >
            Sign In
          </Link>
          <Link
            href="/quiz"
            className="font-body font-normal text-[16px] leading-[1.5] text-primary bg-neutral-200 border border-neutral-200 rounded-[20px] w-[104px] h-[32px] flex items-center justify-center"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="md:hidden text-[24px] leading-none text-white"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-5 py-4 bg-primary border-t border-white/20">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="font-body font-normal text-[16px] text-white"
          >
            Sign In
          </Link>
          <Link
            href="/quiz"
            onClick={() => setMenuOpen(false)}
            className="font-body font-normal text-[16px] leading-[1.5] text-primary bg-neutral-200 border border-neutral-200 rounded-[20px] px-5 py-2 w-fit"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
