"use client";

import Link from "next/link";
import {
  INK,
  INK2,
  INK3,
  INK4,
  MONO,
  OXBLOOD,
  PAPER,
  SANS,
  SERIF,
} from "../landing/brand";

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
];

interface QuizMastheadProps {
  current: number;
  total: number;
}

export default function QuizMasthead({ current, total }: QuizMastheadProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
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
        className="journy-quiz-topstrip"
      >
        <span>Vol. I · No. 1 — The Survey</span>
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
          — twenty statements, honestly noted —
        </span>
        <span>Est. MMXXV</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "12px 28px",
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK2,
          }}
        >
          Chapter {ROMAN[Math.min(20, Math.max(1, current || 1))] || "I"} of XX
        </div>

        <Link href="/" style={{ textAlign: "center", textDecoration: "none" }}>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 900,
              fontSize: 24,
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
            The Survey
          </div>
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 18,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 14,
              color: INK3,
              textDecoration: "underline",
              textUnderlineOffset: 4,
              textDecorationThickness: "0.5px",
            }}
          >
            Exit the survey
          </Link>
        </div>
      </div>

      <div style={{ padding: "12px 28px 14px", borderTop: `0.5px solid ${INK4}` }}>
        <LedgerProgress current={current} total={total} />
      </div>
    </header>
  );
}

function LedgerProgress({ current, total }: { current: number; total: number }) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${total}, 1fr)`,
          gap: 4,
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          const idx = i + 1;
          const done = idx < current;
          const isCurrent = idx === current;
          return (
            <div
              key={i}
              style={{
                height: 22,
                border: `1px solid ${done ? OXBLOOD : isCurrent ? INK : INK4}`,
                background: done ? OXBLOOD : "transparent",
                color: done ? PAPER : isCurrent ? INK : INK4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.06em",
                fontWeight: isCurrent ? 700 : 400,
                transform: done ? `rotate(${(i % 3) - 1}deg)` : "none",
                transition:
                  "background 180ms, color 180ms, border-color 180ms, transform 180ms",
              }}
            >
              {done ? "✓" : String(idx).padStart(2, "0")}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: SANS,
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK3,
        }}
      >
        <span>Survey Ledger</span>
        <span>
          {Math.max(0, current - 1)} of {total} noted
        </span>
      </div>
    </div>
  );
}
