"use client";

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
  MOSS,
  OXBLOOD,
} from "../landing/brand";
import type { TypeData } from "./typeData";

interface DossierProps {
  type: TypeData;
}

export default function Dossier({ type }: DossierProps) {
  return (
    <>
      <Definition type={type} />
      <InTheWild type={type} />
      <InAGroup type={type} />
      <CharterAndCaveats type={type} />
      <Cartouche type={type} />
      <Compatibility type={type} />
      <Cities type={type} />
      <ClosingNote type={type} />
    </>
  );
}

function SectionLabel({
  num,
  label,
  inverse,
  center,
}: {
  num: string;
  label: string;
  inverse?: boolean;
  center?: boolean;
}) {
  const col = inverse ? PAPER : INK;
  const col2 = inverse ? "#E8DCC1AA" : INK3;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        justifyContent: center ? "center" : "flex-start",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 12,
          color: col2,
          letterSpacing: "0.14em",
        }}
      >
        § {num}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: col,
        }}
      >
        {label}
      </div>
      {!center && (
        <div style={{ flex: 1, borderTop: `1px solid ${col}33`, marginLeft: 8 }} />
      )}
    </div>
  );
}

function Definition({ type }: DossierProps) {
  return (
    <section
      id="dossier"
      style={{
        padding: "120px 40px 100px",
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionLabel num="01" label="The Definition" />
        <div
          className="journy-dossier-2col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 72,
            marginTop: 32,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontWeight: 700,
                fontVariationSettings: '"opsz" 96',
                fontSize: "clamp(36px, 4.6vw, 60px)",
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>On</span>{" "}
              {type.name.replace(/^The /, "the ")}.
            </h2>
            <div
              style={{
                marginTop: 22,
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 17,
                color: INK3,
                maxWidth: "30ch",
              }}
            >
              — {type.tagline}
            </div>
          </div>
          <div>
            <p
              className="journy-drop-cap"
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontSize: 19,
                lineHeight: 1.65,
                color: INK,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              {type.definition}
            </p>
            <p
              style={{
                marginTop: 18,
                fontFamily: SERIF,
                fontSize: 16,
                lineHeight: 1.7,
                color: INK2,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              {type.definitionPart2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InTheWild({ type }: DossierProps) {
  return (
    <section
      style={{
        padding: "100px 40px",
        background: PAPER2,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionLabel num="02" label="In the Wild" />
        <h2
          style={{
            margin: "24px 0 40px",
            fontFamily: SERIF,
            fontWeight: 700,
            fontVariationSettings: '"opsz" 80',
            fontSize: "clamp(32px, 4vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          How the {type.short} tends to act.
        </h2>

        <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
          {type.behaviors.map((b, i) => (
            <div
              key={i}
              className="journy-dossier-behavior-row"
              style={{
                display: "grid",
                gridTemplateColumns: "72px 200px 1fr",
                gap: 28,
                padding: "22px 28px",
                alignItems: "baseline",
                borderBottom:
                  i < type.behaviors.length - 1
                    ? `0.5px solid ${INK4}`
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: type.color,
                  letterSpacing: "0.14em",
                }}
              >
                [{String(i + 1).padStart(2, "0")}]
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK,
                }}
              >
                {b[0]}
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: INK,
                  textWrap: "pretty" as React.CSSProperties["textWrap"],
                }}
              >
                {b[1]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InAGroup({ type }: DossierProps) {
  return (
    <section
      style={{
        padding: "100px 40px",
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionLabel num="03" label="In Company" />
        <div
          className="journy-dossier-2col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 72,
            marginTop: 32,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontWeight: 700,
                fontVariationSettings: '"opsz" 80',
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Among other travelers.
            </h2>
            <p
              style={{
                marginTop: 24,
                fontFamily: SERIF,
                fontSize: 17,
                lineHeight: 1.65,
                color: INK,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              {type.inGroup}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {type.roles.map(([role, body]) => (
              <div
                key={role}
                style={{
                  padding: "22px 24px",
                  border: `1px solid ${INK}`,
                  background: PAPER,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: 20,
                    background: PAPER,
                    padding: "0 10px",
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: type.color,
                  }}
                >
                  {role}
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 15.5,
                    lineHeight: 1.6,
                    color: INK,
                  }}
                >
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CharterAndCaveats({ type }: DossierProps) {
  const cols: Array<[string, string[], string]> = [
    ["Lean In", type.leanIn, MOSS],
    ["Watch For", type.watchFor, OXBLOOD],
  ];
  return (
    <section
      style={{
        padding: "100px 40px",
        background: INK,
        color: PAPER,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionLabel num="04" label="Charter & Caveats" inverse />
        <h2
          style={{
            margin: "24px 0 44px",
            fontFamily: SERIF,
            fontWeight: 700,
            fontVariationSettings: '"opsz" 80',
            fontSize: "clamp(32px, 4vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: PAPER,
          }}
        >
          What to lean into, what to watch for.
        </h2>

        <div
          className="journy-dossier-charter"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
          }}
        >
          {cols.map(([head, list, col]) => (
            <div
              key={head}
              style={{ borderTop: `1px solid ${PAPER}44`, paddingTop: 22 }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: col,
                  marginBottom: 22,
                }}
              >
                — {head}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {list.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "14px 0",
                      borderBottom:
                        i < list.length - 1
                          ? `0.5px solid ${PAPER}22`
                          : "none",
                      fontFamily: SERIF,
                      fontSize: 17,
                      lineHeight: 1.55,
                      color: PAPER,
                      display: "flex",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 11,
                        color: col,
                        letterSpacing: "0.14em",
                        flexShrink: 0,
                        paddingTop: 4,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cartouche({ type }: DossierProps) {
  return (
    <section
      style={{
        padding: "100px 40px",
        background: PAPER2,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionLabel num="05" label="The Cartouche" />
        <div
          className="journy-dossier-2col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 72,
            marginTop: 32,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontWeight: 700,
                fontVariationSettings: '"opsz" 80',
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Four axes, one point of view.
            </h2>
            <p
              style={{
                marginTop: 22,
                fontFamily: SERIF,
                fontSize: 16,
                lineHeight: 1.65,
                color: INK2,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              Every notation maps to four axes. Your position along them is
              where your guidebook begins — and what it will, and won&rsquo;t,
              propose for you.
            </p>
          </div>
          <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
            {type.axisDetails.map((a, i, arr) => (
              <div
                key={a.label}
                style={{
                  padding: "22px 28px",
                  borderBottom:
                    i < arr.length - 1 ? `0.5px solid ${INK4}` : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: INK3,
                    }}
                  >
                    {a.label}
                  </span>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: 15,
                      color: type.color,
                    }}
                  >
                    — {a.leans}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: SERIF,
                    fontSize: 14,
                    color: INK,
                  }}
                >
                  <span
                    style={{
                      fontWeight: a.pos < 50 ? 700 : 400,
                      color: a.pos < 50 ? INK : INK4,
                      width: 88,
                    }}
                  >
                    {a.left}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: INK4,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: -4,
                        left: `${a.pos}%`,
                        transform: "translateX(-50%)",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: type.color,
                        border: `1.5px solid ${INK}`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontWeight: a.pos > 50 ? 700 : 400,
                      color: a.pos > 50 ? INK : INK4,
                      width: 88,
                      textAlign: "right",
                    }}
                  >
                    {a.right}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Compatibility({ type }: DossierProps) {
  const rotations = [-3, 2, -2];
  return (
    <section
      style={{
        padding: "100px 40px",
        background: PAPER,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionLabel num="06" label="Fellow Travelers" />
        <h2
          style={{
            margin: "24px 0 40px",
            fontFamily: SERIF,
            fontWeight: 700,
            fontVariationSettings: '"opsz" 80',
            fontSize: "clamp(32px, 4vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          Those who travel well with the {type.short}.
        </h2>

        <div
          className="journy-dossier-compat"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {type.compatibility.map((c, i) => (
            <div
              key={c.code}
              style={{
                border: `1px solid ${INK}`,
                background: PAPER,
                padding: "28px 24px 26px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: INK3,
                  marginBottom: 10,
                }}
              >
                {c.how}
              </div>
              <div
                style={{
                  transform: `rotate(${rotations[i % 3]}deg)`,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    border: `1.8px solid ${c.color}`,
                    padding: "10px 16px 12px",
                    fontFamily: MONO,
                    color: c.color,
                    letterSpacing: "0.22em",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  {c.code}
                </div>
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: 22,
                  color: INK,
                  letterSpacing: "-0.005em",
                }}
              >
                {c.name}
              </div>
              <p
                style={{
                  marginTop: 10,
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: INK2,
                }}
              >
                {c.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cities({ type }: DossierProps) {
  return (
    <section
      style={{
        padding: "100px 40px",
        background: PAPER2,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionLabel num="07" label="Cities on the Shelf" />
        <div
          className="journy-dossier-2col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 72,
            marginTop: 32,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontWeight: 700,
                fontVariationSettings: '"opsz" 80',
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Cities that suit the {type.short}.
            </h2>
            <p
              style={{
                marginTop: 22,
                fontFamily: SERIF,
                fontSize: 16,
                lineHeight: 1.65,
                color: INK2,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              An editor&rsquo;s shortlist. Each city has a volume already on
              the shelf, written for your notation — rooms, hours, walks,
              reservations chosen for a traveler exactly like you.
            </p>
          </div>
          <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
            <div
              style={{
                padding: "12px 22px",
                borderBottom: `1px solid ${INK}`,
                display: "grid",
                gridTemplateColumns: "1fr 2fr 60px",
                gap: 20,
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: INK,
              }}
            >
              <span>City</span>
              <span>Why</span>
              <span style={{ textAlign: "right" }}>Vol.</span>
            </div>
            {type.cities.map((c, i) => (
              <div
                key={c.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 60px",
                  padding: "18px 22px",
                  alignItems: "baseline",
                  borderBottom:
                    i < type.cities.length - 1
                      ? `0.5px solid ${INK4}`
                      : "none",
                  gap: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 700,
                      fontSize: 20,
                      color: INK,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: INK3,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {c.coord}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 14.5,
                    lineHeight: 1.55,
                    color: INK2,
                  }}
                >
                  — {c.why}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: type.color,
                    letterSpacing: "0.12em",
                    textAlign: "right",
                  }}
                >
                  {c.vol}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingNote({ type }: DossierProps) {
  return (
    <section
      style={{
        padding: "120px 40px",
        background: INK,
        color: PAPER,
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

      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <SectionLabel num="08" label="Closing Note" inverse center />
        <h2
          style={{
            margin: "22px 0 0",
            fontFamily: SERIF,
            fontWeight: 900,
            fontVariationSettings: '"opsz" 144',
            fontSize: "clamp(44px, 6vw, 84px)",
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
            color: PAPER,
            textWrap: "balance" as React.CSSProperties["textWrap"],
          }}
        >
          Your volume is being{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>typeset.</span>
        </h2>

        <p
          style={{
            margin: "28px auto 0",
            maxWidth: 520,
            fontFamily: SERIF,
            fontSize: 18,
            lineHeight: 1.6,
            color: "#E8DCC1CC",
            textWrap: "pretty" as React.CSSProperties["textWrap"],
          }}
        >
          — a guidebook for the {type.short}, city by city. We start with one.
          You choose which.
        </p>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 22,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "18px 32px",
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
            Choose my first city →
          </button>
          <a
            href="#dossier"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 15,
              color: "#E8DCC1CC",
              textDecoration: "underline",
              textUnderlineOffset: 5,
            }}
          >
            — or revisit the dossier
          </a>
        </div>
      </div>
    </section>
  );
}
