"use client";

import {
  DENIM,
  INK,
  INK2,
  INK3,
  INK4,
  MOSS,
  MONO,
  OCHRE,
  OXBLOOD,
  PAPER,
  PAPER2,
  SANS,
  SERIF,
} from "./brand";

const ENTRIES: Array<[string, string, string, string, string, string, string]> = [
  [
    "01",
    "09:30",
    "Pastéis de Belém",
    "A queue, always, but quick. Two, warm, cinnamon on one. Stand at the counter — the tables are for the patient.",
    "fork",
    OXBLOOD,
    "MUST",
  ],
  [
    "02",
    "11:00",
    "Gulbenkian Founder’s Collection",
    "Skip the modern wing today. The Egyptian rooms first, then the Lalique. Allow ninety minutes; plan for two.",
    "arch",
    OCHRE,
    "NOTE",
  ],
  [
    "03",
    "13:30",
    "Cervejaria Ramiro — first floor",
    "Shrimp, garlic, bread, beer. Do not order dessert here; the steak sandwich is dessert. Ask for the upstairs room.",
    "fork",
    MOSS,
    "LOCAL",
  ],
  [
    "04",
    "16:00",
    "Tram 28, eastbound from Graça",
    "Ride the full loop once. Get off at Campo de Ourique for coffee; walk back through the cemetery — yes, really.",
    "train",
    DENIM,
    "WALK",
  ],
];

interface ArchiveProps {
  onSample: () => void;
}

export default function Archive({ onSample }: ArchiveProps) {
  return (
    <section
      id="archive"
      style={{
        padding: "100px 40px 120px",
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 40,
            flexWrap: "wrap",
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
              From the Archive
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontFamily: SERIF,
                fontWeight: 700,
                fontVariationSettings: '"opsz" 80',
                fontSize: "clamp(36px, 4.6vw, 60px)",
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                color: INK,
                maxWidth: "20ch",
              }}
            >
              A specimen page — Lisbon, for a Dreamer.
            </h2>
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 14,
              color: INK3,
              textAlign: "right",
              maxWidth: 260,
            }}
          >
            — the same city, written for a Director, reads nothing like this.
          </div>
        </div>

        <div
          className="journy-archive-spread"
          style={{
            border: `1px solid ${INK}`,
            background: PAPER,
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
          }}
        >
          <div
            className="journy-archive-left"
            style={{ padding: "36px 36px 40px", borderRight: `1px solid ${INK}` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingBottom: 10,
                borderBottom: `1px solid ${INK}`,
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: INK,
                }}
              >
                Itinerary · Day III of V
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: INK2,
                }}
              >
                38.7223° N · 9.1393° W
              </span>
            </div>

            <h3
              style={{
                margin: "20px 0 2px",
                fontFamily: SERIF,
                fontWeight: 700,
                fontVariationSettings: '"opsz" 80',
                fontSize: 44,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              Lisbon
            </h3>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 14,
                color: INK3,
                marginBottom: 22,
              }}
            >
              — a slow Thursday, window-side weather.
            </div>

            {ENTRIES.map(([n, time, title, body, icon, color, pill]) => (
              <div
                key={n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr auto",
                  gap: 14,
                  padding: "16px 0",
                  borderTop: `0.5px solid ${INK4}`,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    fontWeight: 500,
                    color: OXBLOOD,
                    letterSpacing: "0.12em",
                  }}
                >
                  [{n}]
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 12,
                        color: INK2,
                        letterSpacing: "0.08em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {time}
                    </span>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: INK3,
                      }}
                    >
                      ·  {icon}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 600,
                      fontSize: 17,
                      color: INK,
                      lineHeight: 1.25,
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: 13,
                      color: INK3,
                      lineHeight: 1.5,
                    }}
                  >
                    — {body}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color,
                    border: `1px solid ${color}`,
                    padding: "3px 7px",
                    height: "fit-content",
                  }}
                >
                  {pill}
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 20,
                paddingTop: 14,
                borderTop: `1px solid ${INK}`,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: INK3,
              }}
            >
              <span>— Journy · Vol. I —</span>
              <span>p. 47</span>
            </div>
          </div>

          <div
            className="journy-archive-right"
            style={{
              padding: "36px 36px 40px",
              background: PAPER2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
                <div style={{ transform: "rotate(4deg)" }}>
                  <div
                    style={{
                      border: `1.5px solid ${DENIM}`,
                      color: DENIM,
                      padding: "8px 14px 10px",
                      fontFamily: MONO,
                      fontSize: 16,
                      letterSpacing: "0.22em",
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    FRCO
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        marginTop: 2,
                        fontWeight: 400,
                      }}
                    >
                      — the dreamer —
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: INK3,
                  marginBottom: 14,
                }}
              >
                Editor&rsquo;s margin
              </div>

              <blockquote
                style={{
                  margin: 0,
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontVariationSettings: '"opsz" 60',
                  fontSize: 30,
                  lineHeight: 1.25,
                  color: INK,
                  textWrap: "balance" as React.CSSProperties["textWrap"],
                }}
              >
                &ldquo;A Dreamer in Lisbon will change restaurants for a better view.
                <br />
                We have planned accordingly.&rdquo;
              </blockquote>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  color: INK3,
                }}
              >
                <span style={{ width: 32, borderTop: `1px solid ${INK3}` }} />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  From the dossier
                </span>
              </div>

              <p
                style={{
                  marginTop: 28,
                  fontFamily: SERIF,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: INK2,
                  textWrap: "pretty" as React.CSSProperties["textWrap"],
                }}
              >
                Every entry in your guidebook is chosen for the notation. The Dreamer gets
                tram rides and long lunches; the Director gets reservations and optimized
                minutes; the Pilgrim walks. Nothing generic, nothing &ldquo;trending,&rdquo;
                nothing recommended by the crowd.
              </p>
            </div>

            <div style={{ marginTop: 36 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: INK,
                  marginBottom: 16,
                }}
              >
                <span style={{ flex: 1, borderTop: `1px solid ${INK}` }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/journy/ornament.svg" alt="" style={{ height: 14 }} />
                <span style={{ flex: 1, borderTop: `1px solid ${INK}` }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 12,
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
                  — noted for the reader in Week III, Spring MMXXVI.
                </div>
                <button
                  type="button"
                  onClick={onSample}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 14,
                    color: INK,
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    textDecorationThickness: "0.5px",
                    padding: 0,
                  }}
                >
                  Read the full sample →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
