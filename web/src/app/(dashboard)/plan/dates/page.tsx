"use client";

import { useEffect } from "react";
import { INK, INK2, INK3, OXBLOOD, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import StepShell from "../_components/StepShell";
import { usePlan } from "../_components/PlanContext";

export default function DatesStep() {
  const { state, update } = usePlan();

  const datesValid =
    !!state.startDate &&
    !!state.endDate &&
    new Date(state.endDate) >= new Date(state.startDate);

  const dateError =
    state.startDate && state.endDate && new Date(state.endDate) < new Date(state.startDate)
      ? "End date must be on or after start date."
      : null;

  // Optional flight lookup — fires when both number and date are present.
  // Defaults flightDate to the trip's startDate so users only need to type the flight number.
  useEffect(() => {
    const num = state.flightNumber.trim();
    const date = (state.flightDate || state.startDate).trim();
    if (!num || !date) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/flight-lookup?flightNumber=${encodeURIComponent(num)}&date=${encodeURIComponent(date)}`,
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;
        const data = (await res.json()) as {
          found?: boolean;
          origin?: string;
          destination?: string;
          departureScheduled?: string;
          arrivalScheduled?: string;
          airline?: string;
        };
        if (controller.signal.aborted) return;
        if (data.found) {
          update({
            flightDate: date,
            flightOrigin: data.origin ?? "",
            flightDestination: data.destination ?? "",
            flightDepartureTime: data.departureScheduled ?? "",
            flightArrivalTime: data.arrivalScheduled ?? "",
            flightAirline: state.flightAirline.trim() || (data.airline ?? ""),
          });
        }
      } catch {
        // silent — lookup is best-effort
      }
    }, 800);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.flightNumber, state.flightDate, state.startDate]);

  return (
    <StepShell
      step="dates"
      title="When are you going?"
      subtitle="Pick your travel window. If you've already booked a flight, drop the number — we'll pin Day 1 arrival and the final day's departure for you."
      canContinue={datesValid}
      error={dateError}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Start date"
          type="date"
          value={state.startDate}
          onChange={(v) => update({ startDate: v })}
        />
        <Field
          label="End date"
          type="date"
          value={state.endDate}
          onChange={(v) => update({ endDate: v })}
        />
      </div>

      <div
        className="mt-1 p-4 flex flex-col gap-4"
        style={{ border: `1px dashed ${INK3}`, background: `${PAPER2}66` }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          Optional · Flight details
        </div>
        <p style={{ margin: 0, fontFamily: SERIF, fontSize: 14, color: INK2, lineHeight: 1.5 }}>
          Skip if you haven&apos;t booked yet. If you have, type the flight number — we&apos;ll look up
          arrival and departure times automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Flight number"
            placeholder="e.g. UA857"
            value={state.flightNumber}
            onChange={(v) =>
              update({
                flightNumber: v,
                // Reset resolved fields when the number changes
                flightOrigin: "",
                flightDestination: "",
                flightDepartureTime: "",
                flightArrivalTime: "",
              })
            }
          />
          <Field
            label="Flight date (if different from start)"
            type="date"
            value={state.flightDate}
            onChange={(v) => update({ flightDate: v })}
          />
        </div>

        {state.flightOrigin && state.flightDestination ? (
          <p
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontSize: 13,
              color: "#15803d",
              lineHeight: 1.5,
            }}
          >
            ✓ {state.flightAirline ? `${state.flightAirline} · ` : ""}
            {state.flightOrigin} → {state.flightDestination}
            {state.flightDepartureTime
              ? ` · departs ${new Date(state.flightDepartureTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
            {state.flightArrivalTime
              ? ` · arrives ${new Date(state.flightArrivalTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
          </p>
        ) : state.flightNumber.trim() ? (
          <p style={{ margin: 0, fontFamily: SERIF, fontSize: 13, color: INK3 }}>
            Looking up flight times… (this is optional — Continue any time)
          </p>
        ) : null}
      </div>

      {/* INK2/OXBLOOD intentionally used above; suppress unused-import noise */}
      <span style={{ display: "none", color: OXBLOOD }} aria-hidden />
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
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: "text" | "date";
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
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 outline-none"
        style={inputStyle}
      />
    </label>
  );
}
