"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="#below"
      aria-label="Scroll to next section"
      className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <span className="block animate-gentle-bounce text-white/30 text-[24px] leading-none">
        ↓
      </span>
    </a>
  );
}
