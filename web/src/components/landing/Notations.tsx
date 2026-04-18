"use client";

import { useState } from "react";
import {
  DENIM,
  GROUP,
  INK,
  INK2,
  INK3,
  MONO,
  OCHRE,
  OXBLOOD,
  PAPER,
  PAPER2,
  SANS,
  SERIF,
  TERRA,
} from "./brand";

const TYPE_LIST: Array<[string, string, "PB" | "PR" | "FB" | "FR"]> = [
  ["PBCI", "The Director", "PB"],
  ["PBCO", "The Curator", "PB"],
  ["PBAI", "The Expeditionist", "PB"],
  ["PBAO", "The Journalist", "PB"],
  ["PRCI", "The Artisan", "PR"],
  ["PRCO", "The Local", "PR"],
  ["PRAI", "The Apprentice", "PR"],
  ["PRAO", "The Pilgrim", "PR"],
  ["FBCI", "The Spark", "FB"],
  ["FBCO", "The Flaneur", "FB"],
  ["FBAI", "The Adventurer", "FB"],
  ["FBAO", "The Drifter", "FB"],
  ["FRCI", "The Romantic", "FR"],
  ["FRCO", "The Dreamer", "FR"],
  ["FRAI", "The Nomad", "FR"],
  ["FRAO", "The Ghost", "FR"],
];

const ROTATIONS = [-3, 2, -2, 3, 2, -3, 3, -2, -2, 3, -3, 2, 3, -2, 2, -3];

function axis(code: string) {
  const a1 = code[0] === "P" ? "plan" : "flow";
  const a2 = code[1] === "B" ? "busy" : "relaxed";
  const a3 = code[2] === "C" ? "cultural" : "adventure";
  const a4 = code[3] === "I" ? "indoors" : "outdoors";
  return `${a1} · ${a2} · ${a3} · ${a4}`;
}

interface NotationsProps {
  onStart: () => void;
}

export default function Notations({ onStart }: NotationsProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section
      id="types"
      style={{
        padding: "100px 40px 120px",
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 72,
            alignItems: "end",
            marginBottom: 56,
          }}
          className="journy-notations-header"
        >
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: OXBLOOD,
              }}
            >
              The Sixteen
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontFamily: SERIF,
                fontWeight: 900,
                fontVariationSettings: '"opsz" 144',
                fontSize: "clamp(44px, 5.4vw, 84px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              Notations,{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>sixteen.</span>
            </h2>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontSize: 17,
                lineHeight: 1.6,
                color: INK2,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
                maxWidth: 560,
              }}
            >
              Four axes, each a honest question: do you <em>plan</em> or <em>flow</em>; move{" "}
              <em>busy</em> or <em>relaxed</em>; crave the <em>cultural</em> or the{" "}
              <em>adventurous</em>; sit <em>indoors</em> or <em>outdoors</em>. Sixteen
              combinations. Every guidebook begins here.
            </p>
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 22,
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: INK3,
                flexWrap: "wrap",
              }}
            >
              {(
                [
                  ["Plan · Busy", OCHRE],
                  ["Plan · Relaxed", OXBLOOD],
                  ["Flow · Busy", TERRA],
                  ["Flow · Relaxed", DENIM],
                ] as const
              ).map(([label, color]) => (
                <span key={label}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      border: `1.5px solid ${color}`,
                      marginRight: 8,
                      verticalAlign: "-1px",
                    }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            border: `1px solid ${INK}`,
            borderRight: "none",
            borderBottom: "none",
            background: PAPER,
          }}
          className="journy-notations-grid"
        >
          {TYPE_LIST.map(([code, name, group], i) => {
            const color = GROUP[group];
            const rotate = ROTATIONS[i];
            const isHover = hover === i;
            return (
              <div
                key={code}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={onStart}
                style={{
                  position: "relative",
                  padding: "40px 28px 36px",
                  borderRight: `1px solid ${INK}`,
                  borderBottom: `1px solid ${INK}`,
                  background: isHover ? PAPER2 : PAPER,
                  cursor: "pointer",
                  transition: "background 120ms",
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 12,
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: INK3,
                  }}
                >
                  № {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 12,
                    fontFamily: SANS,
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: INK3,
                    textTransform: "uppercase",
                  }}
                >
                  {group === "PB"
                    ? "Land"
                    : group === "PR"
                      ? "Elev."
                      : group === "FB"
                        ? "Route"
                        : "Water"}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    transform: `rotate(${isHover ? 0 : rotate}deg) scale(${isHover ? 1.05 : 1})`,
                    transition: "transform 280ms cubic-bezier(.2,0,0,1)",
                  }}
                >
                  <div
                    style={{
                      border: `1.8px solid ${color}`,
                      padding: "10px 16px 12px",
                      fontFamily: MONO,
                      color,
                      letterSpacing: "0.22em",
                      fontSize: 20,
                      fontWeight: 500,
                    }}
                  >
                    {code}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 22,
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: 22,
                    color: INK,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 14,
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 12,
                    color: INK3,
                    lineHeight: 1.4,
                  }}
                >
                  — {axis(code)}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: INK3 }}>
            — each notation is a point of view, not a personality test.
          </div>
          <button
            type="button"
            onClick={onStart}
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "12px 20px",
              background: "transparent",
              color: INK,
              border: `1.5px solid ${INK}`,
              borderRadius: 0,
              cursor: "pointer",
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
            Find my notation →
          </button>
        </div>
      </div>
    </section>
  );
}
