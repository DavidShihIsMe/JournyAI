"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INTEREST_OPTIONS, type InterestOption } from "@lib/constants/interests";
import QuizMasthead from "@/components/quiz/QuizMasthead";
import {
  INK,
  INK2,
  INK3,
  INK4,
  MONO,
  OXBLOOD,
  PAPER,
  SANS,
  SERIF,
} from "@/components/landing/brand";

const SELECTED_KEY = "journy_interests";
const CUSTOM_KEY = "journy_custom_interests";

interface Category {
  name: string;
  items: InterestOption[];
}

function buildCategories(custom: InterestOption[]): Category[] {
  const map = new Map<string, InterestOption[]>();
  for (const opt of INTEREST_OPTIONS) {
    if (!map.has(opt.category)) map.set(opt.category, []);
    map.get(opt.category)!.push(opt);
  }
  const cats: Category[] = Array.from(map.entries()).map(([name, items]) => ({
    name,
    items,
  }));
  if (custom.length) cats.push({ name: "Your Own", items: custom });
  return cats;
}

function slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function prettify(input: string): string {
  return input
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function InterestsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState<InterestOption[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(SELECTED_KEY);
    window.localStorage.removeItem(CUSTOM_KEY);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  }, [custom]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SELECTED_KEY, JSON.stringify(Array.from(selected)));
  }, [selected]);

  const allCats = useMemo(() => buildCategories(custom), [custom]);

  const q = query.trim();
  const qLower = q.toLowerCase();

  const cats = useMemo(() => {
    if (!qLower) return allCats;
    return allCats
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => i.label.toLowerCase().includes(qLower)),
      }))
      .filter((c) => c.items.length > 0);
  }, [allCats, qLower]);

  const allLabelsLower = useMemo(
    () =>
      [
        ...custom.map((c) => c.label),
        ...INTEREST_OPTIONS.map((i) => i.label),
      ].map((s) => s.toLowerCase()),
    [custom]
  );

  const canAdd = q.length > 0 && !allLabelsLower.includes(qLower);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addCustom() {
    if (!canAdd) return;
    const label = prettify(q);
    let id = slug(label);
    if (!id) return;
    while (allLabelsLower.includes(id) || INTEREST_OPTIONS.some((o) => o.id === id)) {
      id = `${id}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const opt: InterestOption = { id, label, category: "Your Own" };
    setCustom((prev) => [opt, ...prev]);
    setSelected((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setQuery("");
  }

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && canAdd) {
      e.preventDefault();
      addCustom();
    }
  }

  const count = selected.size;

  function onFinish() {
    if (count === 0) return;
    router.push("/type-reveal");
  }

  function onBack() {
    router.push("/quiz");
  }

  return (
    <div
      className="journy-root journy-paper-texture"
      style={{ background: PAPER, color: INK, position: "relative", minHeight: "100vh" }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <QuizMasthead current={20} total={20} />
        <section style={{ padding: "56px 40px 80px" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
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
                Chapter XXI · Appendix
              </div>
              <h1
                style={{
                  margin: "14px 0 0",
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontVariationSettings: '"opsz" 120',
                  fontSize: "clamp(40px, 5.4vw, 72px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.01em",
                }}
              >
                What you&rsquo;re{" "}
                <span style={{ fontStyle: "italic", fontWeight: 400 }}>into.</span>
              </h1>
              <p
                style={{
                  margin: "20px auto 0",
                  maxWidth: 600,
                  fontFamily: SERIF,
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: INK2,
                }}
              >
                Mark as many as you like — these shape the detours, the dinners, the
                what-to-cross-a-street-for. You can revise at any time.
              </p>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: INK3,
                }}
              >
                {count} SELECTED
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${INK}`,
                background: PAPER,
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "stretch",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 16px",
                  borderRight: `1px solid ${INK}`,
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK2,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <circle
                    cx="6"
                    cy="6"
                    r="4.2"
                    fill="none"
                    stroke={INK}
                    strokeWidth="1.4"
                  />
                  <line
                    x1="9.2"
                    y1="9.2"
                    x2="12.5"
                    y2="12.5"
                    stroke={INK}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                Search
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKey}
                placeholder="e.g. natural wine, vinyl bars, brutalist architecture…"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  padding: "16px 18px",
                  fontFamily: SERIF,
                  fontSize: 16,
                  color: INK,
                  width: "100%",
                }}
              />
              <button
                type="button"
                onClick={addCustom}
                disabled={!canAdd}
                title={
                  canAdd ? `Add "${q}" to your interests` : "Type something new to add"
                }
                style={{
                  background: canAdd ? OXBLOOD : "transparent",
                  color: canAdd ? PAPER : INK4,
                  border: "none",
                  borderLeft: `1px solid ${INK}`,
                  padding: "0 22px",
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: canAdd ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background 120ms, color 120ms",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    border: `1.3px solid currentColor`,
                    fontSize: 14,
                    lineHeight: 1,
                    fontWeight: 400,
                  }}
                >
                  +
                </span>
                {canAdd
                  ? `Add "${q.length > 18 ? q.slice(0, 18) + "…" : q}"`
                  : "Custom"}
              </button>
            </div>

            {q && (
              <div
                style={{
                  marginTop: -16,
                  marginBottom: 22,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 13,
                  color: INK3,
                }}
              >
                <span>— showing matches for &ldquo;{q}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: INK3,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  clear
                </button>
              </div>
            )}

            {cats.length === 0 ? (
              <div
                style={{
                  border: `1px dashed ${INK4}`,
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 18,
                    color: INK2,
                    marginBottom: 18,
                  }}
                >
                  — nothing in the appendix matches &ldquo;{q}&rdquo;.
                </div>
                {canAdd && (
                  <button
                    type="button"
                    onClick={addCustom}
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      padding: "14px 22px",
                      background: OXBLOOD,
                      color: PAPER,
                      border: `1.5px solid ${OXBLOOD}`,
                      borderRadius: 0,
                      cursor: "pointer",
                    }}
                  >
                    + Add &ldquo;{q}&rdquo; as your own entry
                  </button>
                )}
              </div>
            ) : (
              <InterestsIndex cats={cats} selected={selected} toggle={toggle} />
            )}

            <div
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={onBack}
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "14px 22px",
                  background: "transparent",
                  color: INK,
                  border: `1.5px solid ${INK}`,
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                ◂ Revisit the survey
              </button>

              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 14,
                  color: INK3,
                }}
              >
                — the more specific, the better your guidebook.
              </div>

              <button
                type="button"
                onClick={onFinish}
                disabled={count === 0}
                style={{
                  fontFamily: SANS,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "18px 30px",
                  background: count ? INK : "transparent",
                  color: count ? PAPER : INK4,
                  border: `1.5px solid ${count ? INK : INK4}`,
                  borderRadius: 0,
                  cursor: count ? "pointer" : "not-allowed",
                  transition: "background 120ms, color 120ms, border-color 120ms",
                }}
                onMouseEnter={(e) => {
                  if (count) {
                    e.currentTarget.style.background = OXBLOOD;
                    e.currentTarget.style.borderColor = OXBLOOD;
                  }
                }}
                onMouseLeave={(e) => {
                  if (count) {
                    e.currentTarget.style.background = INK;
                    e.currentTarget.style.borderColor = INK;
                  }
                }}
              >
                Reveal my notation →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InterestsIndex({
  cats,
  selected,
  toggle,
}: {
  cats: Category[];
  selected: Set<string>;
  toggle: (id: string) => void;
}) {
  return (
    <div
      className="journy-interests-index"
      style={{
        border: `1px solid ${INK}`,
        background: PAPER,
        columnCount: 2,
        columnGap: 0,
      }}
    >
      {cats.map((cat, ci) => (
        <div
          key={cat.name}
          style={{ breakInside: "avoid", padding: "20px 28px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingBottom: 10,
              borderBottom: `1px solid ${INK}`,
              marginBottom: 10,
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
              {cat.name}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: INK3,
                letterSpacing: "0.14em",
              }}
            >
              § {String(ci + 1).padStart(2, "0")}
            </span>
          </div>
          {cat.items.map((item, i) => {
            const sel = selected.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={sel}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  padding: "6px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  borderBottom: `0.5px dotted ${INK4}`,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    border: `1.2px solid ${INK}`,
                    background: sel ? OXBLOOD : "transparent",
                    color: PAPER,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {sel ? "✓" : ""}
                </span>
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: 15,
                    color: INK,
                    fontStyle: sel ? "italic" : "normal",
                    flex: 1,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: INK4,
                    letterSpacing: "0.1em",
                  }}
                >
                  p. {String((ci + 1) * 13 + i).padStart(3, "0")}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
