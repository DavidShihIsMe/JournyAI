"use client";

import { INK, INK2, INK3, INK4, MONO, OXBLOOD, PAPER, SANS, SERIF } from "./brand";

interface HeroProps {
  onStart: () => void;
  onSample: () => void;
}

export default function Hero({ onStart, onSample }: HeroProps) {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        padding: "80px 40px 100px",
        borderBottom: `1px solid ${INK}`,
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/journy/compass-rose.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -120,
          top: 40,
          width: 520,
          height: 520,
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <span style={{ flex: "0 0 48px", borderTop: `1px solid ${INK}` }} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: INK2,
            }}
          >
            A personal guidebook · Issued on demand
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontWeight: 900,
            fontVariationSettings: '"opsz" 144',
            fontSize: "clamp(64px, 9.2vw, 144px)",
            lineHeight: 0.92,
            letterSpacing: "-0.022em",
            color: INK,
            maxWidth: "14ch",
          }}
        >
          A guidebook,
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>written for</span>
          <span> one.</span>
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 48,
            marginTop: 48,
            alignItems: "end",
          }}
          className="journy-hero-grid"
        >
          <div style={{ maxWidth: 560 }}>
            <p
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontSize: 22,
                lineHeight: 1.45,
                color: INK,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              <span style={{ fontStyle: "italic" }}>Twelve statements.</span> One of sixteen
              notations. A pocket guidebook of cities, rooms, and hours —
              <span style={{ color: OXBLOOD }}>
                {" "}
                rewritten for the way you actually travel.
              </span>
            </p>

            <div
              style={{
                marginTop: 36,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 24,
              }}
            >
              <button
                type="button"
                onClick={onStart}
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "18px 26px",
                  background: INK,
                  color: PAPER,
                  border: `1.5px solid ${INK}`,
                  borderRadius: 0,
                  cursor: "pointer",
                  transition: "background 120ms",
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
                Take the Notation — 2 min
              </button>
              <a
                href="#archive"
                onClick={(e) => {
                  e.preventDefault();
                  onSample();
                }}
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 16,
                  color: INK2,
                  textDecoration: "underline",
                  textUnderlineOffset: 5,
                  textDecorationThickness: "0.5px",
                }}
              >
                — or read a sample dossier
              </a>
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 18,
                alignItems: "center",
                color: INK3,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                No account required
              </span>
              <span style={{ color: INK4 }}>·</span>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13 }}>
                — free to read. Printable on request.
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              justifySelf: "end",
              paddingRight: 20,
            }}
          >
            <div style={{ position: "relative", transform: "rotate(-7deg)" }}>
              <div
                style={{
                  border: `2.5px solid ${OXBLOOD}`,
                  padding: "22px 36px 26px",
                  fontFamily: MONO,
                  color: OXBLOOD,
                  letterSpacing: "0.22em",
                  fontSize: 52,
                  fontWeight: 500,
                  textAlign: "center",
                  background: "transparent",
                  position: "relative",
                }}
              >
                FRCO
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    marginTop: 6,
                    color: OXBLOOD,
                  }}
                >
                  — entered · mmxxvi —
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 9.5,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: INK3,
                textAlign: "center",
                transform: "rotate(-7deg)",
                marginTop: 4,
              }}
            >
              specimen · the dreamer
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 80,
            paddingTop: 18,
            borderTop: `1px solid ${INK}`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
        >
          {[
            ["XVI", "Notations"],
            ["XII", "Statements"],
            ["CXX", "Cities covered"],
            ["MMXXV", "Established"],
          ].map(([num, label]) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 22,
                  letterSpacing: "0.08em",
                  color: INK,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK3,
                  marginTop: 6,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
