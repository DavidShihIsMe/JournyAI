"use client";

import { INK, INK2, INK3, MONO, OXBLOOD, PAPER, PAPER2, SANS, SERIF } from "./brand";

const STEPS = [
  {
    num: "01",
    time: "00 : 02",
    title: "Answer twelve statements.",
    body: "Short prompts — agree or disagree, seven circles from small to large. No sliders, no stars. It takes under two minutes and feels, frankly, like reading.",
    note: "— the statements are weighted; four axes emerge.",
    icon: "book",
  },
  {
    num: "02",
    time: "00 : 10",
    title: "Receive your notation.",
    body: "A four-letter code. The Dreamer. The Curator. The Nomad. Stamped into the margin of your file, where it belongs. One of sixteen, never more, never fewer.",
    note: "— accompanied by a short editor's dossier.",
    icon: "stamp",
  },
  {
    num: "03",
    time: "ONGOING",
    title: "Read your guidebook.",
    body: "We draft itineraries for your notation, city by city — the rooms, the hours, the walks, the detours. Rewritten for how you actually travel. Saved to your shelf.",
    note: "— a new city added each month.",
    icon: "compass",
  },
];

interface ProcessProps {
  onStart: () => void;
}

export default function Process({ onStart }: ProcessProps) {
  return (
    <section
      id="process"
      style={{
        padding: "100px 40px 120px",
        background: PAPER2,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: INK2,
            }}
          >
            Chapter II — Method
          </div>
          <h2
            style={{
              margin: "14px 0 0",
              fontFamily: SERIF,
              fontWeight: 700,
              fontVariationSettings: '"opsz" 80',
              fontSize: "clamp(36px, 4.6vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
              color: INK,
            }}
          >
            How a Journy is made
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginTop: 22,
              color: INK,
            }}
          >
            <span style={{ width: 60, borderTop: `1px solid ${INK}` }} />
            <span style={{ fontSize: 12 }}>✦</span>
            <span style={{ width: 60, borderTop: `1px solid ${INK}` }} />
          </div>
        </div>

        <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="journy-process-row"
              style={{
                display: "grid",
                gridTemplateColumns: "88px 1.2fr 1.3fr 140px",
                alignItems: "start",
                gap: 32,
                padding: "36px 32px",
                borderBottom: i < STEPS.length - 1 ? `1px solid ${INK}` : "none",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-block",
                    border: `1.5px solid ${OXBLOOD}`,
                    color: OXBLOOD,
                    padding: "6px 10px",
                    fontFamily: MONO,
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                  }}
                >
                  [{s.num}]
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    color: INK3,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {s.time}
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: 24,
                    lineHeight: 1.2,
                    color: INK,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h3>
                <div
                  style={{
                    marginTop: 14,
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 13,
                    color: OXBLOOD,
                    lineHeight: 1.5,
                  }}
                >
                  {s.note}
                </div>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: SERIF,
                    fontSize: 16,
                    lineHeight: 1.65,
                    color: INK2,
                    textWrap: "pretty" as React.CSSProperties["textWrap"],
                  }}
                >
                  {s.body}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    border: `1px solid ${INK}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: INK,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/journy/icons/${s.icon}.svg`}
                    alt=""
                    style={{ width: 52, height: 52 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button
            type="button"
            onClick={onStart}
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "18px 32px",
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
            Begin — it takes two minutes
          </button>
        </div>
      </div>
    </section>
  );
}
