"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  INK,
  INK2,
  INK3,
  INK4,
  OXBLOOD,
  PAPER,
  PAPER2,
  PAPER3,
  MONO,
  SANS,
  SERIF,
} from "./brand";

interface FinalCTAProps {
  onStart: () => void;
  onSample: () => void;
}

export function FinalCTA({ onStart, onSample }: FinalCTAProps) {
  return (
    <section
      style={{
        padding: "120px 40px 140px",
        background: INK,
        color: PAPER,
        borderBottom: `1px solid ${INK}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/journy/passport-stamp.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -80,
          bottom: -80,
          width: 520,
          opacity: 0.06,
          pointerEvents: "none",
          filter: "invert(1)",
        }}
      />

      <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            fontFamily: SANS,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#E8DCC1AA",
            marginBottom: 28,
          }}
        >
          <span style={{ width: 40, borderTop: `1px solid ${PAPER3}` }} />
          Colophon
          <span style={{ width: 40, borderTop: `1px solid ${PAPER3}` }} />
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontWeight: 900,
            fontVariationSettings: '"opsz" 144',
            fontSize: "clamp(48px, 7vw, 104px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: PAPER,
            textWrap: "balance" as React.CSSProperties["textWrap"],
          }}
        >
          The shelf is{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400, color: "#E8DCC1" }}>waiting</span>{" "}
          for your volume.
        </h2>

        <p
          style={{
            margin: "32px auto 0",
            maxWidth: 560,
            fontFamily: SERIF,
            fontSize: 19,
            lineHeight: 1.55,
            color: "#E8DCC1CC",
            textWrap: "pretty" as React.CSSProperties["textWrap"],
          }}
        >
          <em>Twelve statements, a notation, a guidebook.</em> It takes less time than brewing a
          second pot.
        </p>

        <div
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onStart}
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "20px 36px",
              background: PAPER,
              color: INK,
              border: `1.5px solid ${PAPER}`,
              borderRadius: 0,
              cursor: "pointer",
              transition: "background 120ms, color 120ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = PAPER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = PAPER;
              e.currentTarget.style.color = INK;
            }}
          >
            Take the Notation →
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
              color: "#E8DCC1CC",
              textDecoration: "underline",
              textUnderlineOffset: 5,
              textDecorationThickness: "0.5px",
            }}
          >
            — or peek at a sample first
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const COLUMNS: Array<[string, string[]]> = [
    ["The Guidebook", ["Take the quiz", "The sixteen", "Sample dossier", "Pricing"]],
    ["Editors", ["About us", "Our method", "Voice & style", "Press"]],
    ["Readers", ["Sign in", "Your shelf", "Printed edition", "Gift a volume"]],
    ["Fine print", ["Privacy", "Terms", "Contact", "Colophon"]],
  ];

  return (
    <footer style={{ padding: "60px 40px 48px", background: PAPER, color: INK }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="journy-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
            gap: 48,
            paddingBottom: 48,
            borderBottom: `1px solid ${INK}`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 900,
                fontSize: 44,
                fontVariationSettings: '"opsz" 144',
                letterSpacing: "0.01em",
                lineHeight: 1,
              }}
            >
              Journy
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: INK3,
              }}
            >
              Est. MMXXV · Vol. I · No. 1
            </div>
            <p
              style={{
                margin: "22px 0 0",
                maxWidth: 280,
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 14,
                lineHeight: 1.55,
                color: INK2,
              }}
            >
              — a pocket guidebook, issued on demand, for travelers who prefer a point of view.
            </p>
          </div>

          {COLUMNS.map(([head, items]) => (
            <div key={head}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: INK,
                  marginBottom: 18,
                }}
              >
                {head}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li key={item} style={{ padding: "7px 0" }}>
                    <a
                      href="#"
                      style={{
                        fontFamily: SERIF,
                        fontSize: 15,
                        color: INK2,
                        textDecoration: "none",
                        borderBottom: `0.5px solid transparent`,
                        transition: "border-color 120ms",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderBottomColor = INK2;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderBottomColor = "transparent";
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            © MMXXVI · Journy Editorial Ltd.
          </div>
          <div
            style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 12, color: INK3 }}
          >
            — set in Fraunces, Inter, and DM Mono. Printed on uncoated cream.
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            usejourny.com
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(27, 26, 24, 0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "journyFadeIn 220ms cubic-bezier(.2,0,0,1)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: PAPER,
          width: "100%",
          maxWidth: 460,
          border: `1px solid ${INK}`,
          padding: "36px 40px 32px",
          position: "relative",
          animation: "journyLift 320ms cubic-bezier(.2,0,0,1)",
        }}
      >
        <div
          style={{
            margin: "-36px -40px 28px",
            padding: "10px 22px",
            borderBottom: `1px solid ${INK}`,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: SANS,
            fontSize: 9.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK,
          }}
        >
          <span>Journy</span>
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 11,
              letterSpacing: "0.04em",
              textTransform: "none",
              color: INK2,
            }}
          >
            — readers&rsquo; entrance —
          </span>
          <span>Vol. I</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            Sign in
          </div>
          <h3
            style={{
              margin: "10px 0 6px",
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 32,
              fontVariationSettings: '"opsz" 80',
              lineHeight: 1.05,
            }}
          >
            Return to your shelf.
          </h3>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: INK3 }}>
            — your notation &amp; saved guidebooks await.
          </div>
        </div>

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label
              style={{
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: INK2,
              }}
            >
              Email
            </label>
            <input
              type="email"
              defaultValue=""
              placeholder="reader@journy.co"
              style={{
                width: "100%",
                marginTop: 6,
                padding: "12px 12px",
                background: PAPER2,
                border: `1px solid ${INK}`,
                borderRadius: 0,
                fontFamily: SERIF,
                fontSize: 15,
                color: INK,
                boxSizing: "border-box",
              }}
            />
          </div>
          <Link
            href="/login"
            style={{
              marginTop: 8,
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "14px 22px",
              background: INK,
              color: PAPER,
              border: `1.5px solid ${INK}`,
              borderRadius: 0,
              cursor: "pointer",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Send magic link →
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: "6px 0",
              color: INK3,
            }}
          >
            <span style={{ flex: 1, borderTop: `0.5px solid ${INK4}` }} />
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 12 }}>or</span>
            <span style={{ flex: 1, borderTop: `0.5px solid ${INK4}` }} />
          </div>

          {["Continue with Google", "Continue with Apple"].map((label) => (
            <Link
              key={label}
              href="/login"
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "12px 18px",
                background: PAPER,
                color: INK,
                border: `1px solid ${INK}`,
                borderRadius: 0,
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: `0.5px solid ${INK4}`,
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 13,
            color: INK3,
          }}
        >
          — a first-time reader?{" "}
          <Link
            href="/quiz"
            style={{ color: OXBLOOD, textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Take the Notation
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: SERIF,
            fontSize: 22,
            color: INK2,
            padding: 4,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
