"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INK, INK2, INK3, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import StepShell from "../_components/StepShell";
import { usePlan } from "../_components/PlanContext";
import { ACCESSIBILITY_OPTIONS } from "../_lib/accessibility";

const TRIP_PURPOSE_OPTIONS: { value: string; label: string }[] = [
  { value: "vacation", label: "Vacation / leisure" },
  { value: "fun", label: "Just for fun" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family_visit", label: "Visiting family" },
  { value: "friends_getaway", label: "Friends getaway" },
  { value: "celebration", label: "Birthday or celebration" },
  { value: "anniversary", label: "Anniversary trip" },
  { value: "solo", label: "Solo trip" },
  { value: "work_bleisure", label: "Work + leisure" },
  { value: "bucket_list", label: "Bucket-list adventure" },
  { value: "cultural_deep_dive", label: "Culture & learning focus" },
];

const TRANSPORT_OPTIONS: { value: string; label: string }[] = [
  { value: "car", label: "Car (rental or own)" },
  { value: "public_transit", label: "Public transportation" },
  { value: "train", label: "Train" },
  { value: "walk", label: "Walking" },
  { value: "bike", label: "Bike" },
  { value: "rideshare", label: "Rideshare / taxi" },
  { value: "mixed", label: "Mixed — whatever fits each day" },
  { value: "other", label: "Other" },
];

export default function PrioritizeStep() {
  const router = useRouter();
  const { state, reset } = usePlan();
  const { update } = usePlan();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue =
    !!state.tripPurpose.trim() &&
    !!state.preferredTransport.trim() &&
    (state.preferredTransport !== "other" || !!state.transportOther.trim());

  async function handleSubmit(): Promise<boolean> {
    if (busy) return false;
    setBusy(true);
    setError(null);

    const hasFlight = state.flightNumber.trim().length > 0;
    // Compose budget string from structured tier + amount inputs.
    const composedBudget = (() => {
      if (state.budgetTier === "no_budget") return "No budget — plan freely.";
      const parts: string[] = [];
      if (state.budgetAmount.trim()) parts.push(`$${state.budgetAmount.trim()} total`);
      if (state.budgetTier) {
        const tierMeaning: Record<string, string> = {
          "$": "$ (budget)",
          "$$": "$$ (moderate)",
          "$$$": "$$$ (upscale)",
          "$$$$": "$$$$ (luxury)",
        };
        parts.push(tierMeaning[state.budgetTier] ?? state.budgetTier);
      }
      return parts.join(" · ") || "Not specified";
    })();
    // Compose hotelAddress from structured parts when the user entered it manually.
    const composedManualAddress = [
      state.addressLine1,
      state.addressLine2,
      [state.addressCity, state.addressRegion].filter(Boolean).join(", "),
      [state.addressCountry, state.addressPostal].filter(Boolean).join(" "),
    ]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");
    const finalHotelAddress =
      state.stayingHotel === "__other__" && composedManualAddress
        ? composedManualAddress
        : state.hotelAddress;
    const payload = {
      destination: state.destination,
      startDate: state.startDate,
      endDate: state.endDate,
      tripPurpose: state.tripPurpose,
      flightBookingStatus: hasFlight ? "booked" : "not_booked",
      flightNumber: hasFlight ? state.flightNumber : "",
      flightAirline: hasFlight ? state.flightAirline : "",
      flightDate: hasFlight ? state.flightDate || state.startDate : "",
      flightDepartureTime: hasFlight ? state.flightDepartureTime : "",
      flightArrivalTime: hasFlight ? state.flightArrivalTime : "",
      flightOrigin: hasFlight ? state.flightOrigin : "",
      flightDestination: hasFlight ? state.flightDestination : "",
      budget: composedBudget,
      travelPace: "",
      interests: "",
      preferredTransport: state.preferredTransport,
      transportOther: state.preferredTransport === "other" ? state.transportOther : "",
      stayingHotel: state.stayingHotel,
      hotelAddress: finalHotelAddress,
      hotelPlaceId: state.hotelPlaceId || undefined,
      accessibility: state.accessibilityNeeds.length > 0 || state.accessibilityOther.trim().length > 0,
      accessibilityNotes: (() => {
        const labels = state.accessibilityNeeds
          .map((v) => ACCESSIBILITY_OPTIONS.find((opt) => opt.value === v)?.label)
          .filter(Boolean) as string[];
        const other = state.accessibilityOther.trim();
        if (other) labels.push(`Other: ${other}`);
        return labels.join("; ");
      })(),
      partySize: state.partySize,
      tripParty: state.tripParty,
      mustHaves: [
        // Activity wishes → search-style must-haves for the AI to find venues
        ...state.activityWishes
          .map((w) => w.text.trim())
          .filter((t) => t.length > 0)
          .map((t) => ({
            timeBlock: "",
            activity: t,
            where: "",
            details: "",
          })),
        // Fixed commitments → structured time blocks
        ...state.commitments
          .filter((c) => c.name.trim() || c.start || c.end)
          .map((c) => {
            const timeRange = [c.start, c.end].filter(Boolean).join("–");
            const timeBlock = [c.day, timeRange].filter(Boolean).join(" ");
            return {
              timeBlock,
              activity: c.name.trim(),
              where: c.address.trim(),
              details: "",
            };
          }),
      ],
    };

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const detail = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(detail?.error ?? "We could not generate your itinerary right now.");
      }
      const result = (await res.json()) as { tripId?: string };
      if (!result.tripId) throw new Error("Trip was generated but not saved.");
      reset();
      router.push(`/itinerary?tripId=${encodeURIComponent(result.tripId)}`);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
      return false;
    }
  }

  return (
    <StepShell
      step="prioritize"
      title="What do you want to prioritize?"
      subtitle="The tone, pace, and emphasis of the trip — these shape the whole itinerary."
      canContinue={canContinue}
      busy={busy}
      error={error}
      onContinue={handleSubmit}
    >
      <SelectField
        label="Trip purpose"
        value={state.tripPurpose}
        onChange={(v) => update({ tripPurpose: v })}
        options={TRIP_PURPOSE_OPTIONS}
      />
      <SelectField
        label="Preferred transportation"
        value={state.preferredTransport}
        onChange={(v) => update({ preferredTransport: v })}
        options={TRANSPORT_OPTIONS}
      />
      {state.preferredTransport === "other" ? (
        <Field
          label="Describe other"
          placeholder="e.g. ferry, private driver, scooter"
          value={state.transportOther}
          onChange={(v) => update({ transportOther: v })}
        />
      ) : null}
    </StepShell>
  );
}

const inputStyle = {
  border: `1px solid ${INK3}`,
  borderRadius: 0,
  background: PAPER2,
  color: INK,
  fontFamily: SERIF,
  fontSize: 15,
};

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
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
        {label}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 outline-none"
        style={inputStyle}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
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
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 outline-none"
        style={inputStyle}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// Suppress unused INK2 — kept for style consistency
void INK2;
