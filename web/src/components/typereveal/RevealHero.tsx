"use client";

import { useEffect, useState } from "react";
import {
  INK,
  INK2,
  INK3,
  INK4,
  PAPER,
  PAPER2,
  SANS,
  SERIF,
  MONO,
} from "../landing/brand";

interface AxisProps {
  label: string;
  left: string;
  right: string;
  active: 0 | 1;
}

interface RevealHeroProps {
  code: string;
  name: string;
  color: string;
  axes: AxisProps[];
}

export default function RevealHero({ code, name, color, axes }: RevealHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
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
          left: "50%",
          top: "54%",
          transform: "translate(-50%, -50%)",
          width: 820,
          height: 820,
          opacity: 0.055,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          padding: "14px 40px",
          borderBottom: `1px solid ${INK}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: INK,
          position: "relative",
          zIndex: 2,
        }}
        className="journy-reveal-topstrip"
      >
        <span>Journy · Vol. I</span>
        <span
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 12,
            letterSpacing: "0.04em",
            textTransform: "none",
            color: INK2,
          }}
        >
          — The Editor&rsquo;s Notation —
        </span>
        <span>Issued · MMXXVI</span>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "48px 20px 0",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          After careful review of twenty statements
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 16,
            color: INK2,
          }}
        >
          — we present, with the editor&rsquo;s compliments —
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            transform: mounted
              ? "rotate(-5deg) scale(1)"
              : "rotate(-40deg) scale(0.2)",
            opacity: mounted ? 1 : 0,
            transition:
              "transform 1200ms cubic-bezier(.2,0,0,1), opacity 600ms ease-out",
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              border: `3.5px solid ${color}`,
              padding: "36px 64px 42px",
              fontFamily: MONO,
              color,
              letterSpacing: "0.22em",
              fontSize: "clamp(80px, 14vw, 180px)",
              fontWeight: 500,
              textAlign: "center",
              lineHeight: 1,
              boxShadow: `inset 0 0 0 1.5px ${color}22, 0 1px 0 #00000015`,
              position: "relative",
            }}
          >
            {code}
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 14,
                letterSpacing: "0.1em",
                marginTop: 12,
                color,
                textTransform: "none",
              }}
            >
              — entered · mmxxvi —
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 48,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition:
              "opacity 600ms ease-out 600ms, transform 600ms cubic-bezier(.2,0,0,1) 600ms",
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            You are
          </div>
          <h1
            style={{
              margin: "10px 0 0",
              fontFamily: SERIF,
              fontWeight: 900,
              fontVariationSettings: '"opsz" 144',
              fontSize: "clamp(64px, 9vw, 128px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            {name}
          </h1>
          <div
            style={{
              marginTop: 16,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 18,
              color: INK2,
            }}
          >
            — one of sixteen. There will not be another quite like you.
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "28px 40px",
          borderTop: `1px solid ${INK}`,
          background: PAPER2,
          position: "relative",
          zIndex: 2,
          opacity: mounted ? 1 : 0,
          transition: "opacity 500ms ease-out 1100ms",
        }}
      >
        <div
          className="journy-reveal-axes"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr) auto",
            gap: 32,
            alignItems: "center",
          }}
        >
          {axes.map((a) => (
            <div
              key={a.label}
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: INK3,
                }}
              >
                {a.label}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: SERIF,
                    fontStyle: a.active === 0 ? "normal" : "italic",
                    fontWeight: a.active === 0 ? 700 : 400,
                    fontSize: 14,
                    color: a.active === 0 ? INK : INK4,
                  }}
                >
                  {a.left}
                </span>
                <span style={{ flex: 1, borderTop: `0.5px solid ${INK3}` }} />
                <span
                  style={{
                    fontFamily: SERIF,
                    fontStyle: a.active === 1 ? "normal" : "italic",
                    fontWeight: a.active === 1 ? 700 : 400,
                    fontSize: 14,
                    color: a.active === 1 ? INK : INK4,
                  }}
                >
                  {a.right}
                </span>
              </div>
            </div>
          ))}

          <a
            href="#dossier"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: SANS,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: INK,
              textDecoration: "none",
              border: `1.5px solid ${INK}`,
              padding: "10px 18px",
              transition: "background 120ms, color 120ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = INK;
              e.currentTarget.style.color = PAPER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = INK;
            }}
          >
            The dossier ↓
          </a>
        </div>
      </div>
    </section>
  );
}
