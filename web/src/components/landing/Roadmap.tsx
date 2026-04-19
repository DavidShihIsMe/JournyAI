"use client";

import {
  INK,
  INK2,
  INK3,
  INK4,
  MONO,
  OCHRE,
  OXBLOOD,
  PAPER,
  SANS,
  SERIF,
} from "./brand";

interface RoadmapProps {
  onStart: () => void;
}

interface Phase {
  num: string;
  code: string;
  status: string;
  statusColor: string;
  date: string;
  title: string;
  tagline: string;
  body: string;
  deliverables: string[];
  icon: string;
  available: boolean;
}

export default function Roadmap({ onStart }: RoadmapProps) {
  const phases: Phase[] = [
    {
      num: "I",
      code: "PHASE·I",
      status: "NOW PUBLISHING",
      statusColor: OXBLOOD,
      date: "Spring MMXXVI",
      title: "The Notation",
      tagline: "A traveler, rendered in four letters.",
      body: "Twenty statements resolve into one of sixteen notations. You get your four-letter code and a short dossier on how you travel.",
      deliverables: [
        "The twenty-statement survey",
        "Sixteen traveler notations",
        "Your personal dossier",
        "A saved reader's shelf",
      ],
      icon: "stamp",
      available: true,
    },
    {
      num: "II",
      code: "PHASE·II",
      status: "FORTHCOMING",
      statusColor: OCHRE,
      date: "Summer MMXXVI",
      title: "The Guidebook",
      tagline: "Itineraries, written for your notation.",
      body: "City volumes, rewritten sixteen ways — one for each notation. A Dreamer's Lisbon reads nothing like a Director's.",
      deliverables: [
        "First launch cities",
        "Itineraries per notation",
        "Rooms, hours, detours",
        "New cities each month",
      ],
      icon: "compass",
      available: false,
    },
    {
      num: "III",
      code: "PHASE·III",
      status: "PLANNED",
      statusColor: INK3,
      date: "MMXXVII",
      title: "The Companions",
      tagline: "A guidebook, shared.",
      body: "Add friends to a trip, reconcile notations into one itinerary, leave margin notes. Group planning without the spreadsheet.",
      deliverables: [
        "Travel companions",
        "Group itineraries",
        "Shared margin notes",
        "Collaborative planning",
      ],
      icon: "route",
      available: false,
    },
  ];

  const rotations = [-4, 3, -2];

  return (
    <section
      id="roadmap"
      style={{
        padding: "100px 40px 120px",
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="journy-roadmap-header"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 72,
            alignItems: "end",
            marginBottom: 56,
          }}
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
              Chapter III — Publication Schedule
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
              What&rsquo;s on the{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>press.</span>
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
              Journy is written in three volumes. The first has gone to print — the others
              are in the editor&rsquo;s hands. A plan, honestly stated, so you know what
              you&rsquo;re signing up for.
            </p>
            <div
              style={{
                marginTop: 22,
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  color: OXBLOOD,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ width: 8, height: 8, background: OXBLOOD }} /> Publishing
              </span>
              <span
                style={{
                  color: OCHRE,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{ width: 8, height: 8, border: `1.5px solid ${OCHRE}` }}
                />{" "}
                Forthcoming
              </span>
              <span
                style={{
                  color: INK3,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{ width: 8, height: 8, border: `0.5px dashed ${INK3}` }}
                />{" "}
                Planned
              </span>
            </div>
          </div>
        </div>

        <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
          {phases.map((p, i) => (
            <div
              key={p.num}
              className="roadmap-row"
              style={{
                display: "grid",
                gridTemplateColumns: "220px minmax(0, 1.3fr) minmax(0, 1fr)",
                gap: 40,
                padding: "44px 40px",
                borderBottom:
                  i < phases.length - 1 ? `1px solid ${INK}` : "none",
                background: p.available ? PAPER : "transparent",
                position: "relative",
              }}
            >
              <div>
                <div
                  style={{
                    transform: `rotate(${rotations[i]}deg)`,
                    display: "inline-block",
                    opacity: p.available ? 1 : 0.75,
                  }}
                >
                  <div
                    style={{
                      border: `${p.available ? 2.2 : 1.5}px ${
                        p.available ? "solid" : "dashed"
                      } ${p.statusColor}`,
                      padding: "14px 20px 16px",
                      fontFamily: MONO,
                      color: p.statusColor,
                      letterSpacing: "0.22em",
                      fontSize: 22,
                      fontWeight: 500,
                      textAlign: "center",
                      background: "transparent",
                    }}
                  >
                    {p.code}
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        marginTop: 4,
                      }}
                    >
                      — vol. {p.num.toLowerCase()} —
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 22 }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 9px",
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: p.statusColor,
                      border: `1px solid ${p.statusColor}`,
                      background: p.available ? `${p.statusColor}0D` : "transparent",
                    }}
                  >
                    {p.status}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: SANS,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: INK3,
                    }}
                  >
                    Expected · {p.date}
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: INK3,
                  }}
                >
                  Volume {p.num}
                </div>
                <h3
                  style={{
                    margin: "10px 0 8px",
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontVariationSettings: '"opsz" 80',
                    fontSize: "clamp(28px, 3vw, 40px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                    color: INK,
                    display: "block",
                  }}
                >
                  {p.title}
                </h3>
                <div
                  style={{
                    display: "block",
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: "clamp(15px, 1.3vw, 17px)",
                    lineHeight: 1.4,
                    color: p.statusColor,
                    marginBottom: 18,
                  }}
                >
                  — {p.tagline}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: SERIF,
                    fontSize: 15.5,
                    lineHeight: 1.65,
                    color: INK,
                    textWrap: "pretty" as React.CSSProperties["textWrap"],
                    maxWidth: "42ch",
                  }}
                >
                  {p.body}
                </p>

                {p.available && (
                  <button
                    type="button"
                    onClick={onStart}
                    style={{
                      marginTop: 22,
                      fontFamily: SANS,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "12px 18px",
                      background: INK,
                      color: PAPER,
                      border: `1.5px solid ${INK}`,
                      borderRadius: 0,
                      cursor: "pointer",
                    }}
                  >
                    Available now — begin →
                  </button>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 10,
                    borderBottom: `1px solid ${INK}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: INK,
                    }}
                  >
                    In this volume
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/journy/icons/${p.icon}.svg`}
                    alt=""
                    style={{
                      width: 24,
                      height: 24,
                      opacity: p.available ? 1 : 0.55,
                    }}
                  />
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {p.deliverables.map((d, j) => (
                    <li
                      key={j}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "32px 18px 1fr",
                        alignItems: "baseline",
                        gap: 0,
                        padding: "11px 0",
                        borderBottom:
                          j < p.deliverables.length - 1
                            ? `0.5px solid ${INK4}55`
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          color: p.statusColor,
                        }}
                      >
                        § {String(j + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 13,
                          color: p.available ? p.statusColor : INK3,
                          textAlign: "center",
                        }}
                      >
                        {p.available ? "✓" : "○"}
                      </span>
                      <span
                        style={{
                          fontFamily: SERIF,
                          fontSize: 15,
                          lineHeight: 1.45,
                          color: p.available ? INK : INK2,
                          fontStyle: p.available ? "normal" : "italic",
                        }}
                      >
                        {d}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
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
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 13,
              color: INK3,
            }}
          >
            — dates are intentions, not guarantees. We publish when it&rsquo;s ready, not
            before.
          </div>
          <a
            href="#top"
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: INK,
              textDecoration: "none",
              borderBottom: `1px solid ${INK}`,
              paddingBottom: 2,
            }}
          >
            Subscribe to the dispatches →
          </a>
        </div>
      </div>
    </section>
  );
}
