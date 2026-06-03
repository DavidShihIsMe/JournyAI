"use client";

import { INK, INK2, INK3, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import StepShell from "../_components/StepShell";
import { usePlan } from "../_components/PlanContext";
import { ACCESSIBILITY_OPTIONS } from "../_lib/accessibility";

export default function AccessStep() {
  const { state, update } = usePlan();
  const isNa =
    state.accessibilityNeeds.length === 0 && state.accessibilityOther.trim().length === 0;

  function toggleNeed(value: string, checked: boolean) {
    const next = checked
      ? Array.from(new Set([...state.accessibilityNeeds, value]))
      : state.accessibilityNeeds.filter((v) => v !== value);
    update({ accessibilityNeeds: next });
  }

  function selectNa() {
    update({ accessibilityNeeds: [], accessibilityOther: "" });
  }

  return (
    <StepShell
      step="access"
      title="Any accessibility needs?"
      subtitle="Pick anything that applies — we'll prioritize matching routes, venues, and pacing. Skip if nothing here is relevant."
      canContinue={true}
    >
      {/* N/A option */}
      <button
        type="button"
        onClick={selectNa}
        className="flex items-center gap-3 cursor-pointer p-3 text-left"
        style={{
          border: `1px solid ${isNa ? INK : INK3}`,
          background: isNa ? PAPER2 : "transparent",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 16,
            height: 16,
            border: `1.5px solid ${INK}`,
            background: isNa ? INK : "transparent",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span style={{ fontFamily: SERIF, fontSize: 16, color: INK }}>
          N/A — no specific accessibility needs
        </span>
      </button>

      <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
        <legend
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: INK3,
            marginBottom: 4,
          }}
        >
          Or select any that apply
        </legend>
        <div className="flex flex-col gap-2">
          {ACCESSIBILITY_OPTIONS.map((opt) => {
            const checked = state.accessibilityNeeds.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-start gap-3 cursor-pointer p-3"
                style={{
                  border: `1px solid ${checked ? INK : INK3}`,
                  background: checked ? PAPER2 : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggleNeed(opt.value, e.target.checked)}
                  style={{ accentColor: INK, marginTop: 4 }}
                />
                <div className="flex flex-col">
                  <span style={{ fontFamily: SERIF, fontSize: 16, color: INK }}>{opt.label}</span>
                  <span style={{ fontFamily: SERIF, fontSize: 13, color: INK2 }}>{opt.sub}</span>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          Other (please describe)
        </span>
        <textarea
          rows={2}
          placeholder="e.g. low-vision — large signage helps; hearing-impaired — written tour info; needs frequent restroom access"
          value={state.accessibilityOther}
          onChange={(e) => update({ accessibilityOther: e.target.value })}
          className="w-full px-3 py-2 outline-none"
          style={{
            border: `1px solid ${INK3}`,
            borderRadius: 0,
            background: PAPER2,
            color: INK,
            fontFamily: SERIF,
            fontSize: 15,
          }}
        />
      </label>
    </StepShell>
  );
}
