"use client";

import { INK, INK2, INK3, OXBLOOD, PAPER, SANS, SERIF, MONO } from "./brand";

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
        padding: "80px 40px 110px",
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
                lineHeight: 1.5,
                color: INK,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              Answer twenty statements. Receive your notation — one of sixteen — and a
              guidebook{" "}
              <span style={{ color: OXBLOOD, fontStyle: "italic" }}>
                written for the way you actually travel.
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
                — or read a sample
              </a>
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
      </div>
    </section>
  );
}
