"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QUIZ_QUESTIONS,
  QUIZ_CHAPTERS,
  computeDimensionScores,
  type QuizResponse,
} from "@lib/onboarding/quizQuestions";
import QuizMasthead from "@/components/quiz/QuizMasthead";
import AgreeScale from "@/components/quiz/AgreeScale";
import {
  INK,
  INK2,
  INK3,
  INK4,
  MONO,
  OXBLOOD,
  PAPER,
  PAPER2,
  SANS,
  SERIF,
} from "@/components/landing/brand";

const RESPONSES_KEY = "journy_quiz_responses";
const SCORES_KEY = "journy_dimension_scores";

export default function QuizPage() {
  const router = useRouter();
  const total = QUIZ_QUESTIONS.length;
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(total).fill(null)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(RESPONSES_KEY);
    window.localStorage.removeItem(SCORES_KEY);
  }, []);

  const persist = useCallback((next: (number | null)[]) => {
    if (typeof window === "undefined") return;
    const arr: QuizResponse[] = [];
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const value = next[i];
      const q = QUIZ_QUESTIONS[i];
      if (value !== null && value !== undefined) {
        arr.push({ questionId: q.id, dataKey: q.dataKey, value });
      }
    }
    window.localStorage.setItem(RESPONSES_KEY, JSON.stringify(arr));
    window.localStorage.setItem(
      SCORES_KEY,
      JSON.stringify(computeDimensionScores(arr))
    );
  }, []);

  const setAnswer = useCallback(
    (i: number, v: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[i] = v;
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const done = answers.filter((a) => a !== null).length;
  const complete = done === total;
  const current = Math.min(total, done + 1);

  function handleSubmit() {
    if (!complete) return;
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(RESPONSES_KEY);
      const saved = raw ? JSON.parse(raw) : [];
      console.log("[quiz] submit — responses saved to localStorage:", saved);
    }
    router.push("/interests");
  }

  return (
    <div
      className="journy-root journy-paper-texture"
      style={{ background: PAPER, color: INK, position: "relative", minHeight: "100vh" }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <QuizMasthead current={current} total={total} />
        <section style={{ padding: "56px 40px 80px" }}>
          <div style={{ maxWidth: 1020, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: OXBLOOD,
                }}
              >
                The Survey · twenty statements
              </div>
              <h1
                style={{
                  margin: "14px 0 0",
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontVariationSettings: '"opsz" 120',
                  fontSize: "clamp(38px, 5vw, 68px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.01em",
                }}
              >
                The{" "}
                <span style={{ fontStyle: "italic", fontWeight: 400 }}>Ledger</span>
              </h1>
              <p
                style={{
                  margin: "20px auto 0",
                  maxWidth: 560,
                  fontFamily: SERIF,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: INK2,
                }}
              >
                Twenty statements, a single sitting. Note each with the degree of your
                agreement. No wrong answers; only preferences.
              </p>
            </div>

            <div style={{ border: `1px solid ${INK}`, background: PAPER }}>
              <div
                className="journy-ledger-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "72px 1fr 360px",
                  gap: 24,
                  alignItems: "end",
                  padding: "14px 28px 12px",
                  borderBottom: `1px solid ${INK}`,
                  background: PAPER2,
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: INK3,
                  }}
                >
                  №
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: INK3,
                  }}
                >
                  Statement
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: SANS,
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: INK2,
                  }}
                >
                  <span>Disagree</span>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontWeight: 400,
                      letterSpacing: 0,
                      textTransform: "none",
                      fontSize: 12,
                      color: INK3,
                    }}
                  >
                    — neutral —
                  </span>
                  <span>Agree</span>
                </div>
              </div>

              {QUIZ_QUESTIONS.map((q, i) => {
                const value = answers[i];
                const chapter = QUIZ_CHAPTERS[q.id] ?? "";
                return (
                  <div
                    key={q.id}
                    className="journy-ledger-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "72px 1fr 360px",
                      gap: 24,
                      alignItems: "center",
                      padding: "22px 28px",
                      borderBottom:
                        i < QUIZ_QUESTIONS.length - 1
                          ? `0.5px solid ${INK4}`
                          : "none",
                      background: value ? PAPER2 + "55" : "transparent",
                      transition: "background 180ms",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: MONO,
                          fontSize: 13,
                          color: value ? OXBLOOD : INK2,
                          letterSpacing: "0.14em",
                          fontWeight: 500,
                        }}
                      >
                        {String(q.id).padStart(2, "0")}.
                      </div>
                      <div
                        style={{
                          fontFamily: SANS,
                          fontSize: 8.5,
                          letterSpacing: "0.24em",
                          textTransform: "uppercase",
                          color: INK4,
                          marginTop: 4,
                        }}
                      >
                        {chapter}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: 17,
                          lineHeight: 1.4,
                          color: INK,
                          textWrap: "pretty" as React.CSSProperties["textWrap"],
                        }}
                      >
                        <span style={{ color: OXBLOOD, fontStyle: "italic" }}>
                          &ldquo;
                        </span>
                        {q.statement}
                        <span style={{ color: OXBLOOD, fontStyle: "italic" }}>
                          &rdquo;
                        </span>
                      </div>
                    </div>

                    <div>
                      <AgreeScale
                        value={value}
                        onChange={(v) => setAnswer(i, v)}
                        size="md"
                        showLabels={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 14,
                  color: INK3,
                }}
              >
                — {done} of {total} noted
                {done < total ? `, ${total - done} remain` : " in full"}.
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!complete}
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "18px 32px",
                  background: complete ? INK : "transparent",
                  color: complete ? PAPER : INK4,
                  border: `1.5px solid ${complete ? INK : INK4}`,
                  borderRadius: 0,
                  cursor: complete ? "pointer" : "not-allowed",
                  transition: "background 120ms, color 120ms, border-color 120ms",
                }}
                onMouseEnter={(e) => {
                  if (complete) {
                    e.currentTarget.style.background = OXBLOOD;
                    e.currentTarget.style.borderColor = OXBLOOD;
                  }
                }}
                onMouseLeave={(e) => {
                  if (complete) {
                    e.currentTarget.style.background = INK;
                    e.currentTarget.style.borderColor = INK;
                  }
                }}
              >
                Submit the ledger — to Interests ▸
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
