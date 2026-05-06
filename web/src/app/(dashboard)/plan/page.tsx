"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INK, INK2, INK3, INK4, OXBLOOD, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";

const RESULT_STORAGE_KEY = "journy_latest_itinerary";

interface GeneratedItinerary {
  title: string;
  summary: string;
  destination: string;
  travelDates: string;
  days: Array<{
    day: number;
    title: string;
    items: string[];
  }>;
}

export default function PlanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      destination: String(formData.get("destination") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
      hotelPreferences: String(formData.get("hotelPreferences") ?? ""),
      flightPreferences: String(formData.get("flightPreferences") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      travelPace: String(formData.get("travelPace") ?? ""),
      interests: String(formData.get("interests") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("We could not generate your itinerary right now.");
      }

      const result = (await response.json()) as GeneratedItinerary;
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
      }
      router.push("/itinerary");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating your itinerary.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="journy-root journy-paper-texture"
      style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Itinerary Desk · Issue Form
        </div>
        <h1 style={{ marginTop: 10, fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.04 }}>
          Plan a <span style={{ fontStyle: "italic", fontWeight: 400 }}>Trip</span>
        </h1>
        <p style={{ marginTop: 10, maxWidth: 800, fontFamily: SERIF, fontSize: 16, lineHeight: 1.5, color: INK2 }}>
          Tell us your hotel, flights, budget, and travel style. We will draft a day-by-day itinerary in the same guidebook voice as Journy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 p-6 md:p-8" style={{ background: PAPER }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Destination" name="destination" placeholder="Tokyo, Japan" required />
          <Field label="Budget" name="budget" placeholder="$2500 total" required />
          <Field label="Start Date" name="startDate" type="date" required />
          <Field label="End Date" name="endDate" type="date" required />
          <Field label="Hotel Preferences" name="hotelPreferences" placeholder="Boutique, central, quiet" required />
          <Field label="Flight Preferences" name="flightPreferences" placeholder="Direct flights, morning departure" required />
          <Field
            label="Travel Pace"
            name="travelPace"
            placeholder="Relaxed, balanced, or packed"
            required
          />
          <Field
            label="Interests"
            name="interests"
            placeholder="Food, museums, nightlife, shopping"
            required
          />
        </div>

        <label className="flex flex-col gap-2">
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3 }}>
            Extra Notes
          </span>
          <textarea
            name="notes"
            rows={4}
            placeholder="Anything else the AI should know..."
            className="w-full px-3 py-2 outline-none transition"
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

        {error ? (
          <p
            className="px-3 py-2"
            style={{
              border: `1px solid ${OXBLOOD}`,
              background: `${OXBLOOD}14`,
              color: OXBLOOD,
              fontFamily: SERIF,
              fontSize: 15,
            }}
          >
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              border: `1.5px solid ${INK}`,
              borderRadius: 0,
              background: isSubmitting ? INK3 : INK,
              color: PAPER,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {isSubmitting ? "Generating your itinerary..." : "Generate itinerary"}
          </button>
          <Link
            href="/profile"
            className="transition-colors"
            style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}
          >
            Back to profile &rarr;
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "date";
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3 }}>
        {label}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 outline-none transition"
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
  );
}
