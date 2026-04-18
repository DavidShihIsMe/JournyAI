import { INK, INK2, INK3, INK4, MONO, OXBLOOD, PAPER2, SANS, SERIF } from "./brand";

export default function Premise() {
  return (
    <section
      id="about"
      style={{
        padding: "100px 40px",
        background: PAPER2,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            Dispatch No. I — The Premise
          </div>
          <div
            style={{
              flex: 1,
              height: 0,
              borderTop: `1px solid ${INK}`,
              margin: "0 16px",
              opacity: 0.6,
            }}
          />
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: INK3 }}>
            — by the editors
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 72,
          }}
          className="journy-premise-grid"
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontWeight: 700,
                fontVariationSettings: '"opsz" 60',
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: INK,
                maxWidth: "18ch",
              }}
            >
              The recommendation engine never met a person it didn&rsquo;t try to flatten.
            </h2>

            <p
              className="journy-drop-cap"
              style={{
                marginTop: 28,
                fontFamily: SERIF,
                fontSize: 18,
                lineHeight: 1.6,
                color: INK,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              We prefer the way guidebooks worked for most of the twentieth century — a
              trusted editor, a narrow column, a footnote where a footnote belonged. Journy
              is a small experiment in returning travel writing to the hand of a tastemaker,
              and then addressing that writing, specifically, to <em>you.</em>
            </p>

            <p
              style={{
                marginTop: 20,
                fontFamily: SERIF,
                fontSize: 16,
                lineHeight: 1.65,
                color: INK2,
                textWrap: "pretty" as React.CSSProperties["textWrap"],
              }}
            >
              You answer twelve statements. We note you into one of sixteen types — a
              four-letter code that says how you move through a city, what you&rsquo;ll cross a
              street for, what you won&rsquo;t. Then we write you a guidebook that honors it.
            </p>
          </div>

          <aside
            style={{
              alignSelf: "start",
              borderLeft: `1px solid ${INK}`,
              paddingLeft: 28,
              marginTop: 16,
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: OXBLOOD,
              }}
            >
              Editor&rsquo;s note
            </div>

            <h3
              style={{
                margin: "14px 0 22px",
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 26,
                lineHeight: 1.2,
                color: INK,
              }}
            >
              What we won&rsquo;t do.
            </h3>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {(
                [
                  ["Rank", 'We will not tell you the "#1 best café." There is no such thing.'],
                  ["Gamify", "There are no streaks. There is no score. You are not a profile."],
                  [
                    "Generalize",
                    'No "top 10 in every city." A guidebook is a point of view, or it is nothing.',
                  ],
                  [
                    "Shout",
                    "No must-do. No life-changing. No exclamation points, barring emergencies.",
                  ],
                ] as const
              ).map(([head, body], i) => (
                <li
                  key={head}
                  style={{
                    padding: "14px 0",
                    borderTop: i === 0 ? `1px solid ${INK}` : `0.5px solid ${INK4}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: OXBLOOD,
                      marginBottom: 4,
                    }}
                  >
                    § {String(i + 1).padStart(2, "0")} — {head}
                  </div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: INK,
                      fontStyle: "italic",
                    }}
                  >
                    {body}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
