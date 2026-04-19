"use client";

import {
  DENIM,
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
} from "./brand";

interface ProcessProps {
  onStart: () => void;
}

interface Stop {
  num: string;
  code: string;
  title: string;
  tagline: string;
  body: string;
  features: string[];
  stampColor: string;
  side: "left" | "right";
}

const STOPS: Stop[] = [
  {
    num: "01",
    code: "YNO",
    title: "Your Notation",
    tagline: "— a traveler, in four letters.",
    body: "Twenty statements, a seven-point agree scale. We note you into one of sixteen types.",
    features: [
      "A two-minute quiz — no sign-up required.",
      "Four axes: pace, company, depth, structure.",
      "Your notation is saved to your shelf for next time.",
    ],
    stampColor: OXBLOOD,
    side: "right",
  },
  {
    num: "02",
    code: "GDE",
    title: "Your Guidebook",
    tagline: "— written for you, and no one else.",
    body: "We draft city volumes for your notation — rooms, hours, walks, detours.",
    features: [
      "A ten-minute read, structured as morning → afternoon → evening.",
      "Room picks, restaurant holds, neighbourhood walks — shortlisted, not scraped.",
      "Re-run the draft any time: swap cities, add days, add companions.",
    ],
    stampColor: OCHRE,
    side: "left",
  },
  {
    num: "03",
    code: "EXP",
    title: "Your Experience",
    tagline: "— the guidebook goes with you.",
    body: "You travel. Read it in the morning. Annotate the margin. Remember it after.",
    features: [
      "Offline access on phone — no data, no ads, no pop-ups.",
      "Annotate in the margins; your notes join the guidebook.",
      "When you return, the volume stays on your shelf — revise or gift.",
    ],
    stampColor: DENIM,
    side: "right",
  },
];

export default function Process({ onStart }: ProcessProps) {
  // Vertical canvas: narrower + taller. Road runs top to bottom with gentle S-curves.
  const SPACING = 0.6;
  const BASE_W = 900;
  const TOP_MARGIN = 180;
  const BASE_GAP_1 = 380;
  const BASE_GAP_2 = 360;
  const BASE_BOTTOM = 340;

  const gap1 = BASE_GAP_1 * SPACING;
  const gap2 = BASE_GAP_2 * SPACING;
  const pin01Y = TOP_MARGIN;
  const pin02Y = pin01Y + gap1;
  const pin03Y = pin02Y + gap2;

  const VB_W = BASE_W;
  const VB_H = pin03Y + BASE_BOTTOM;
  const CX = VB_W / 2;

  const pins = [
    { x: CX - 60, y: pin01Y },
    { x: CX + 60, y: pin02Y },
    { x: CX - 60, y: pin03Y },
  ];

  const labels = STOPS.map((s, i) => ({
    side: s.side,
    topPct: ((pins[i].y - 90) / VB_H) * 100,
  }));

  const topY = Math.max(40, pin01Y - 140);
  const botY = VB_H - 40;
  const road = `
    M ${CX} ${topY}
    C ${CX - 30} ${pin01Y - 80}, ${pins[0].x + 30} ${pin01Y - 40}, ${pins[0].x} ${pins[0].y}
    C ${pins[0].x - 20} ${pin01Y + gap1 * 0.32}, ${pins[1].x + 20} ${pin01Y + gap1 * 0.68}, ${pins[1].x} ${pins[1].y}
    C ${pins[1].x + 20} ${pin02Y + gap2 * 0.38}, ${pins[2].x - 20} ${pin02Y + gap2 * 0.72}, ${pins[2].x} ${pins[2].y}
    C ${pins[2].x - 20} ${pin03Y + 60}, ${CX - 20} ${pin03Y + 100}, ${CX} ${botY}
  `;

  return (
    <section
      id="process"
      style={{
        padding: "100px 40px 120px",
        background: PAPER2,
        borderBottom: `1px solid ${INK}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
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
              marginTop: 18,
              color: INK,
            }}
          >
            <span style={{ width: 56, borderTop: `1px solid ${INK}` }} />
            <span
              style={{
                fontSize: 11,
                fontFamily: SERIF,
                fontStyle: "italic",
                color: INK3,
              }}
            >
              — the traveler&rsquo;s route, in three stops
            </span>
            <span style={{ width: 56, borderTop: `1px solid ${INK}` }} />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            border: `1px solid ${INK}`,
            background: PAPER,
            boxShadow: "0 1px 0 #00000010",
            maxWidth: 1040,
            margin: "0 auto",
          }}
        >
          <div
            className="journy-process-masthead"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 20px",
              borderBottom: `1px solid ${INK}`,
              fontFamily: SANS,
              fontSize: 9.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            <span>Plate I · Route JY-1</span>
            <span
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 12,
                letterSpacing: "0.04em",
                textTransform: "none",
                color: INK3,
              }}
            >
              — a traveler&rsquo;s progress, from first statement to last step —
            </span>
            <span>Scale · 1 : MMXXVI</span>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: `${VB_W} / ${VB_H}`,
            }}
          >
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                position: "absolute",
                inset: 0,
              }}
            >
              <defs>
                <pattern
                  id="latlonProc"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="#9E9684"
                    strokeWidth="0.35"
                    strokeDasharray="1 4"
                  />
                </pattern>
                <filter
                  id="pinShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
                  <feOffset dx="1.5" dy="2" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.35" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect
                x="0"
                y="0"
                width={VB_W}
                height={VB_H}
                fill="url(#latlonProc)"
                opacity="0.7"
              />

              <g
                fill="#D9C8A6"
                opacity="0.28"
                stroke="#9E9684"
                strokeWidth="0.5"
              >
                <path d="M 60 260 Q 120 240, 150 280 Q 160 340, 120 380 Q 70 390, 50 350 Q 40 300, 60 260 Z" />
                <path
                  d={`M ${VB_W - 120} ${VB_H - 180} Q ${VB_W - 50} ${VB_H - 200} ${VB_W - 30} ${VB_H - 150} Q ${VB_W - 30} ${VB_H - 90} ${VB_W - 80} ${VB_H - 70} Q ${VB_W - 130} ${VB_H - 80} ${VB_W - 140} ${VB_H - 120} Q ${VB_W - 140} ${VB_H - 160} ${VB_W - 120} ${VB_H - 180} Z`}
                />
              </g>

              <path
                d={road}
                fill="none"
                stroke="#1B1A18"
                strokeWidth="26"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={road}
                fill="none"
                stroke="#F2EAD6"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={road}
                fill="none"
                stroke="#1B1A18"
                strokeWidth="1.4"
                strokeDasharray="10 10"
              />

              {STOPS.map((s, i) => {
                const p = pins[i];
                return (
                  <g
                    key={`pin-${s.num}`}
                    transform={`translate(${p.x} ${p.y})`}
                    filter="url(#pinShadow)"
                  >
                    <path
                      d="M 0 0
                         C -22 0, -32 -18, -32 -36
                         C -32 -54, -18 -68, 0 -68
                         C 18 -68, 32 -54, 32 -36
                         C 32 -18, 22 0, 0 0 Z"
                      fill={s.stampColor}
                      stroke="#1B1A18"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="0"
                      cy="-38"
                      r="17"
                      fill="#F2EAD6"
                      stroke="#1B1A18"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-32"
                      textAnchor="middle"
                      fontFamily="DM Mono, monospace"
                      fontSize="16"
                      fontWeight="500"
                      letterSpacing="1"
                      fill={s.stampColor}
                    >
                      {s.num}
                    </text>
                    <circle cx="0" cy="3" r="3.5" fill="#1B1A18" />
                  </g>
                );
              })}

              <g
                transform={`translate(${CX - 10} ${pin01Y + gap1 * 0.55}) rotate(50)`}
              >
                <path
                  d="M0 -14 L3 4 L10 7 L-10 7 L-3 4 Z M0 -14 L2 12 L-2 12 Z"
                  fill="#1B1A18"
                  stroke="#1B1A18"
                  strokeWidth="0.8"
                />
              </g>

              <g
                transform={`translate(${CX - 26} ${Math.max(10, topY - 30)})`}
              >
                <rect
                  x="0"
                  y="0"
                  width="52"
                  height="20"
                  fill="#F2EAD6"
                  stroke="#1B1A18"
                  strokeWidth="0.7"
                />
                <text
                  x="26"
                  y="14"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize="9"
                  letterSpacing="2.4"
                  fill="#1B1A18"
                >
                  START
                </text>
              </g>
              <g transform={`translate(${CX - 30} ${botY + 10})`}>
                <rect
                  x="0"
                  y="0"
                  width="60"
                  height="20"
                  fill="#1B1A18"
                  stroke="#1B1A18"
                  strokeWidth="0.7"
                />
                <text
                  x="30"
                  y="14"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize="9"
                  letterSpacing="2.4"
                  fill="#F2EAD6"
                >
                  ARRIVAL
                </text>
              </g>

              <g transform={`translate(70 ${VB_H - 70})`}>
                <circle r="26" fill="none" stroke="#1B1A18" strokeWidth="0.7" />
                <circle
                  r="19"
                  fill="none"
                  stroke="#9E9684"
                  strokeWidth="0.4"
                  strokeDasharray="2 3"
                />
                <path
                  d="M 0 -22 L 3 0 L 0 22 L -3 0 Z"
                  fill="#1B1A18"
                />
                <path
                  d="M -22 0 L 0 -3 L 22 0 L 0 3 Z"
                  fill="none"
                  stroke="#1B1A18"
                  strokeWidth="0.6"
                />
                <text
                  y="-30"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize="8"
                  letterSpacing="2"
                  fill="#1B1A18"
                >
                  N
                </text>
              </g>

              {STOPS.map((s, i) => {
                const p = pins[i];
                const x2 = s.side === "right" ? p.x + 160 : p.x - 160;
                return (
                  <line
                    key={`ld-${i}`}
                    x1={p.x + (s.side === "right" ? 32 : -32)}
                    y1={p.y - 34}
                    x2={x2}
                    y2={p.y - 34}
                    stroke="#1B1A18"
                    strokeWidth="0.8"
                    strokeDasharray="2 3"
                  />
                );
              })}
            </svg>

            {STOPS.map((s, i) => {
              const l = labels[i];
              const onRight = l.side === "right";
              return (
                <div
                  key={`lbl-${s.num}`}
                  style={{
                    position: "absolute",
                    top: `${l.topPct}%`,
                    ...(onRight
                      ? { left: "58%", right: "3%" }
                      : { right: "58%", left: "3%" }),
                    textAlign: onRight ? "left" : "right",
                    pointerEvents: "none",
                    padding: "0 10px",
                  }}
                >
                  <div
                    style={{
                      borderTop: `1px solid ${INK}`,
                      paddingTop: 10,
                      display: "inline-block",
                      textAlign: "left",
                      maxWidth: 320,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 11,
                        letterSpacing: "0.22em",
                        color: s.stampColor,
                      }}
                    >
                      {s.code} · STOP № {s.num}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontFamily: SERIF,
                        fontWeight: 700,
                        fontVariationSettings: '"opsz" 60',
                        fontSize: 28,
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                        color: INK,
                      }}
                    >
                      {s.title}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontSize: 14,
                        lineHeight: 1.35,
                        color: INK3,
                      }}
                    >
                      {s.tagline}
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        fontFamily: SERIF,
                        fontSize: 14.5,
                        lineHeight: 1.5,
                        color: INK2,
                        textWrap: "pretty" as React.CSSProperties["textWrap"],
                      }}
                    >
                      {s.body}
                    </div>

                    <ul
                      style={{
                        margin: "14px 0 0",
                        padding: 0,
                        listStyle: "none",
                        borderTop: `0.5px solid ${INK}22`,
                        paddingTop: 10,
                      }}
                    >
                      {s.features.map((f, fi) => (
                        <li
                          key={fi}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "baseline",
                            padding: "5px 0",
                            borderBottom:
                              fi < s.features.length - 1
                                ? `0.5px solid ${INK}15`
                                : "none",
                          }}
                        >
                          <span
                            style={{
                              flex: "0 0 auto",
                              fontFamily: MONO,
                              fontSize: 9.5,
                              letterSpacing: "0.12em",
                              color: s.stampColor,
                              paddingTop: 2,
                            }}
                          >
                            §{String(fi + 1).padStart(2, "0")}
                          </span>
                          <span
                            style={{
                              fontFamily: SERIF,
                              fontSize: 13,
                              lineHeight: 1.45,
                              color: INK2,
                              textWrap:
                                "pretty" as React.CSSProperties["textWrap"],
                            }}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="journy-process-masthead"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 20px",
              borderTop: `1px solid ${INK}`,
              fontFamily: SANS,
              fontSize: 9.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            <span>— Journy · Vol. I · Plate I —</span>
            <span
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 12,
                letterSpacing: "0.04em",
                textTransform: "none",
              }}
            >
              engraved MMXXVI
            </span>
            <span>XVI notations · III stops · I reader</span>
          </div>
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
            Begin the route — 2 min
          </button>
        </div>
      </div>
    </section>
  );
}
