"use client";

import { useEffect, useState } from "react";
import { INK, INK2, INK3, OXBLOOD, PAPER, SANS, SERIF } from "./brand";

interface MastheadProps {
  onSignIn: () => void;
  onStart: () => void;
}

export default function Masthead({ onSignIn, onStart }: MastheadProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
        transition: "box-shadow 220ms cubic-bezier(.2,0,0,1)",
        boxShadow: scrolled ? "0 1px 0 #00000014" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 28px",
          borderBottom: `1px solid ${INK}`,
          fontFamily: SANS,
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK2,
        }}
      >
        <span>Vol. I · No. 1</span>
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 10.5,
            letterSpacing: "0.04em",
            textTransform: "none",
            color: INK3,
          }}
        >
          — a guide that could sit on the shelf next to a 1962 Michelin Red —
        </span>
        <span>MMXXVI · Spring</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "14px 28px",
          gap: 24,
        }}
      >
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            ["Types", "#types"],
            ["Process", "#process"],
            ["Sample", "#archive"],
            ["Roadmap", "#roadmap"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: INK,
                textDecoration: "none",
                padding: "4px 0",
                borderBottom: `1px solid transparent`,
                transition: "border-color 120ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = INK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = "transparent";
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <a href="#top" style={{ textDecoration: "none", textAlign: "center" }}>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 900,
              fontSize: 28,
              fontVariationSettings: '"opsz" 144',
              letterSpacing: "0.02em",
              color: INK,
              lineHeight: 1,
            }}
          >
            Journy
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 8.5,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: INK3,
              marginTop: 3,
            }}
          >
            Est. MMXXV
          </div>
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 18,
          }}
        >
          <a
            href="#signin"
            onClick={(e) => {
              e.preventDefault();
              onSignIn();
            }}
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 14,
              color: INK2,
              textDecoration: "underline",
              textUnderlineOffset: 4,
              textDecorationThickness: "0.5px",
            }}
          >
            Sign in
          </a>
          <button
            type="button"
            onClick={onStart}
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "10px 16px",
              background: INK,
              color: PAPER,
              border: `1.5px solid ${INK}`,
              borderRadius: 0,
              cursor: "pointer",
              transition: "background 120ms, color 120ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = OXBLOOD;
              e.currentTarget.style.borderColor = OXBLOOD;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = INK;
              e.currentTarget.style.borderColor = INK;
            }}
          >
            Take the Notation →
          </button>
        </div>
      </div>
    </header>
  );
}
