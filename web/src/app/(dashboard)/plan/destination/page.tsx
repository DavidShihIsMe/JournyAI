"use client";

import { INK, INK2 } from "@/components/landing/brand";
import CityAutocomplete from "@/components/plan/CityAutocomplete";
import StepShell from "../_components/StepShell";
import { usePlan } from "../_components/PlanContext";

export default function DestinationStep() {
  const { state, update } = usePlan();
  const canContinue = state.destination.trim().length > 0;

  return (
    <StepShell
      step="destination"
      title="Where are you going?"
      subtitle="City, region, or country — start typing and pick from the list, or enter your own."
      canContinue={canContinue}
    >
      <CityAutocomplete
        value={state.destination}
        placeId={state.destinationPlaceId}
        onChange={({ value, placeId }) =>
          update({
            destination: value,
            destinationPlaceId: placeId,
            // Reset stay-step autofill targets so they re-derive from the new destination
            addressCity: "",
            addressCountry: "",
            addressLocationEdited: false,
          })
        }
        autoFocus
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={state.beenHereBefore}
          onChange={(e) => update({ beenHereBefore: e.target.checked })}
          style={{ accentColor: INK }}
        />
        <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 15, color: INK2 }}>
          I&apos;ve been here before
        </span>
      </label>
    </StepShell>
  );
}
