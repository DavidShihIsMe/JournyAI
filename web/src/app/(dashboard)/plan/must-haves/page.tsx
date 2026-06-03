"use client";

import { INK, INK2, INK3, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import StepShell from "../_components/StepShell";
import { usePlan, type ActivityWish, type Commitment } from "../_components/PlanContext";

function newWish(): ActivityWish {
  return { id: crypto.randomUUID(), text: "" };
}

function newCommitment(): Commitment {
  return {
    id: crypto.randomUUID(),
    day: "",
    start: "",
    end: "",
    name: "",
    address: "",
  };
}

export default function ActivitiesStep() {
  const { state, update } = usePlan();

  // Show at least one wish input so the field is discoverable
  const wishes: ActivityWish[] =
    state.activityWishes.length > 0 ? state.activityWishes : [newWish()];

  function setWishes(next: ActivityWish[]) {
    update({ activityWishes: next });
  }

  function updateWish(id: string, text: string) {
    setWishes(wishes.map((w) => (w.id === id ? { ...w, text } : w)));
  }

  function addWish() {
    setWishes([...wishes, newWish()]);
  }

  function removeWish(id: string) {
    if (wishes.length <= 1) {
      setWishes([newWish()]);
      return;
    }
    setWishes(wishes.filter((w) => w.id !== id));
  }

  function setCommitments(next: Commitment[]) {
    update({ commitments: next });
  }

  function updateCommitment(id: string, patch: Partial<Commitment>) {
    setCommitments(state.commitments.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function addCommitment() {
    setCommitments([...state.commitments, newCommitment()]);
  }

  function removeCommitment(id: string) {
    setCommitments(state.commitments.filter((c) => c.id !== id));
  }

  return (
    <StepShell
      step="must-haves"
      title="What do you want to do?"
      subtitle="Describe activities you want — the AI will find specific venues for each. Add fixed commitments so we route around them."
      canContinue={true}
    >
      {/* --- Activities --- */}
      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: INK3,
              }}
            >
              Search for activities
            </span>
            <span style={{ fontFamily: SERIF, fontSize: 14, color: INK2 }}>
              One line per wish — &ldquo;ramen near Shibuya,&rdquo; &ldquo;rooftop bar with a view,&rdquo; &ldquo;Ghibli museum.&rdquo;
            </span>
          </div>
          <button
            type="button"
            onClick={addWish}
            className="px-3 py-2"
            style={{
              border: `1px solid ${INK}`,
              background: "transparent",
              color: INK,
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            + Add activity
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {wishes.map((w) => (
            <div key={w.id} className="flex items-center gap-2">
              <input
                type="text"
                value={w.text}
                onChange={(e) => updateWish(w.id, e.target.value)}
                placeholder="e.g. authentic ramen, live jazz, hidden coffee spot"
                className="flex-1 px-3 py-2 outline-none"
                style={{
                  border: `1px solid ${INK3}`,
                  borderRadius: 0,
                  background: PAPER2,
                  color: INK,
                  fontFamily: SERIF,
                  fontSize: 15,
                }}
              />
              <button
                type="button"
                onClick={() => removeWish(w.id)}
                aria-label="Remove activity"
                style={{
                  width: 32,
                  height: 32,
                  border: `1px solid ${INK3}`,
                  background: "transparent",
                  color: INK3,
                  fontFamily: SERIF,
                  fontSize: 18,
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Commitments --- */}
      <section className="flex flex-col gap-3 pt-3" style={{ borderTop: `1px dashed ${INK3}` }}>
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: INK3,
              }}
            >
              Fixed commitments
            </span>
            <span style={{ fontFamily: SERIF, fontSize: 14, color: INK2 }}>
              Things already on your calendar — we&apos;ll route around them.
            </span>
          </div>
          <button
            type="button"
            onClick={addCommitment}
            className="px-3 py-2"
            style={{
              border: `1px solid ${INK}`,
              background: "transparent",
              color: INK,
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            + Add commitment
          </button>
        </div>

        {state.commitments.length === 0 ? (
          <p style={{ fontFamily: SERIF, fontSize: 14, color: INK3 }}>
            No fixed commitments yet — skip if you don&apos;t have any.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {state.commitments.map((c, index) => (
              <div
                key={c.id}
                className="p-3 grid gap-3"
                style={{ border: `1px solid ${INK3}`, background: PAPER2 }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span style={{ fontFamily: SERIF, fontSize: 15, color: INK }}>
                    Commitment {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCommitment(c.id)}
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      color: INK3,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>

                <RowField
                  label="Name"
                  placeholder="e.g. Shabbat dinner, yoga class, dentist"
                  value={c.name}
                  onChange={(v) => updateCommitment(c.id, { name: v })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <RowField
                    label="Day"
                    type="date"
                    value={c.day}
                    onChange={(v) => updateCommitment(c.id, { day: v })}
                  />
                  <RowField
                    label="Starts"
                    type="time"
                    value={c.start}
                    onChange={(v) => updateCommitment(c.id, { start: v })}
                  />
                  <RowField
                    label="Ends"
                    type="time"
                    value={c.end}
                    onChange={(v) => updateCommitment(c.id, { end: v })}
                  />
                </div>

                <RowField
                  label="Address (optional)"
                  placeholder="Helps with route planning"
                  value={c.address}
                  onChange={(v) => updateCommitment(c.id, { address: v })}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </StepShell>
  );
}

function RowField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: "text" | "date" | "time";
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span
        style={{
          fontFamily: SANS,
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: INK3,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 outline-none"
        style={{
          border: `1px solid ${INK3}`,
          borderRadius: 0,
          background: "transparent",
          color: INK,
          fontFamily: SERIF,
          fontSize: 14,
        }}
      />
    </label>
  );
}
