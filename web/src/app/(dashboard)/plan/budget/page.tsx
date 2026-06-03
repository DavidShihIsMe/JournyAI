"use client";

import { INK, INK2, INK3, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import StepShell from "../_components/StepShell";
import { usePlan } from "../_components/PlanContext";

type Tier = "" | "$" | "$$" | "$$$" | "$$$$" | "no_budget";

const TIER_OPTIONS: { value: Exclude<Tier, "">; label: string; sub: string }[] = [
  { value: "$", label: "$", sub: "Budget — street food, hostels, free attractions." },
  { value: "$$", label: "$$", sub: "Moderate — mid-range hotels, mix of casual and nice meals." },
  { value: "$$$", label: "$$$", sub: "Upscale — 4-star hotels, fine dining a few nights." },
  { value: "$$$$", label: "$$$$", sub: "Luxury — top hotels and splurge meals throughout." },
  { value: "no_budget", label: "No budget", sub: "Don't constrain spending — plan freely." },
];

export default function BudgetStep() {
  const { state, update } = usePlan();
  const isNoBudget = state.budgetTier === "no_budget";
  const canContinue =
    isNoBudget || state.budgetTier !== "" || state.budgetAmount.trim().length > 0;

  function pickTier(tier: Exclude<Tier, "">) {
    if (tier === "no_budget") {
      update({ budgetTier: "no_budget", budgetAmount: "" });
    } else {
      update({ budgetTier: tier });
    }
  }

  return (
    <StepShell
      step="budget"
      title="Do you have a budget?"
      subtitle="Enter a specific amount, pick a tier, or both. Or skip with 'No budget'."
      canContinue={canContinue}
    >
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
          Specific amount (optional)
        </span>
        <div
          className="flex items-center"
          style={{
            border: `1px solid ${isNoBudget ? `${INK3}66` : INK3}`,
            background: isNoBudget ? `${PAPER2}88` : PAPER2,
          }}
        >
          <span
            style={{
              padding: "10px 12px",
              fontFamily: SERIF,
              fontSize: 18,
              color: isNoBudget ? INK3 : INK,
              borderRight: `1px solid ${INK3}`,
            }}
          >
            $
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            disabled={isNoBudget}
            value={state.budgetAmount}
            onChange={(e) => update({ budgetAmount: e.target.value })}
            placeholder="2500"
            className="flex-1 px-3 py-2 outline-none disabled:cursor-not-allowed"
            style={{
              border: "none",
              background: "transparent",
              color: INK,
              fontFamily: SERIF,
              fontSize: 16,
              opacity: isNoBudget ? 0.5 : 1,
            }}
          />
          <span
            style={{
              padding: "10px 12px",
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            Total trip
          </span>
        </div>
      </label>

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
          Tier
        </legend>
        <div className="flex flex-col gap-2">
          {TIER_OPTIONS.map((opt) => {
            const selected = state.budgetTier === opt.value;
            return (
              <label
                key={opt.value}
                className="flex items-start gap-3 cursor-pointer p-3"
                style={{
                  border: `1px solid ${selected ? INK : INK3}`,
                  background: selected ? PAPER2 : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="budgetTier"
                  value={opt.value}
                  checked={selected}
                  onChange={() => pickTier(opt.value)}
                  style={{ accentColor: INK, marginTop: 6 }}
                />
                <div className="flex flex-col">
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 20,
                      color: INK,
                      fontWeight: opt.value === "no_budget" ? 600 : 700,
                      letterSpacing: opt.value === "no_budget" ? "normal" : "0.04em",
                    }}
                  >
                    {opt.label}
                  </span>
                  <span style={{ fontFamily: SERIF, fontSize: 13, color: INK2 }}>{opt.sub}</span>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
    </StepShell>
  );
}
