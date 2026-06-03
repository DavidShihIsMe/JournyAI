"use client";

import { useState } from "react";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import StepShell from "../_components/StepShell";
import { usePlan } from "../_components/PlanContext";

const PARTY_OPTIONS: { value: "myself" | "friends" | "family" | "friends_and_family"; label: string; sub: string }[] = [
  { value: "myself", label: "Solo", sub: "Just me — solo-friendly tone and logistics." },
  { value: "friends", label: "Friends", sub: "Trip with a friend or group of friends." },
  { value: "family", label: "Family", sub: "Family trip — kids, parents, or extended." },
  { value: "friends_and_family", label: "Friends & family", sub: "Mixed group of friends and family." },
];

export default function PartyStep() {
  const { state, update } = usePlan();
  const canContinue = state.partySize >= 1 && state.partySize <= 20;

  const [shareMessage, setShareMessage] = useState("");

  async function handleInvite() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/`;
    const text = "Discover your traveler personality in 2 minutes →";

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Journy", text, url });
        return;
      } catch {
        // user cancelled — fall through to clipboard so they have something
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copied — paste anywhere to share.");
      setTimeout(() => setShareMessage(""), 3000);
    } catch {
      setShareMessage("Couldn't copy — copy the URL from your address bar.");
      setTimeout(() => setShareMessage(""), 4000);
    }
  }

  return (
    <StepShell
      step="party"
      title="Who is coming?"
      subtitle="Friends-with-Journy invites and quiz-status badges are coming in a later iteration."
      canContinue={canContinue}
    >
      <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
        <legend
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          Who is traveling
        </legend>
        <div className="flex flex-col gap-2">
          {PARTY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-start gap-3 cursor-pointer p-3"
              style={{
                border: `1px solid ${state.tripParty === opt.value ? INK : INK3}`,
                background: state.tripParty === opt.value ? PAPER2 : "transparent",
              }}
            >
              <input
                type="radio"
                name="tripParty"
                value={opt.value}
                checked={state.tripParty === opt.value}
                onChange={() =>
                  update({
                    tripParty: opt.value,
                    partySize: opt.value === "myself" ? 1 : Math.max(state.partySize, 2),
                  })
                }
                style={{ accentColor: INK, marginTop: 4 }}
              />
              <div className="flex flex-col">
                <span style={{ fontFamily: SERIF, fontSize: 16, color: INK }}>{opt.label}</span>
                <span style={{ fontFamily: SERIF, fontSize: 13, color: INK2 }}>{opt.sub}</span>
              </div>
            </label>
          ))}
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
          Party size
        </span>
        <input
          type="number"
          min={1}
          max={20}
          value={state.partySize}
          onChange={(e) => update({ partySize: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })}
          className="w-32 px-3 py-2 outline-none"
          style={{
            border: `1px solid ${INK3}`,
            borderRadius: 0,
            background: PAPER2,
            color: INK,
            fontFamily: SERIF,
            fontSize: 16,
          }}
        />
      </label>

      <div
        className="mt-2 pt-4 flex flex-wrap items-center gap-3"
        style={{ borderTop: `1px dashed ${INK3}` }}
      >
        <button
          type="button"
          onClick={handleInvite}
          className="inline-flex items-center px-4 py-2"
          style={{
            border: `1px solid ${INK}`,
            borderRadius: 0,
            background: PAPER,
            color: INK,
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Invite a friend to Journy →
        </button>
        {shareMessage ? (
          <span style={{ fontFamily: SERIF, fontSize: 14, color: INK2 }}>{shareMessage}</span>
        ) : null}
      </div>
    </StepShell>
  );
}
