"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import { SAVED_TRIPS_STORAGE_KEY } from "@/lib/tripStorageKeys";
import { type SavedTrip, tripIsPast } from "@/lib/tripTypes";

export default function HomePage() {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(SAVED_TRIPS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as SavedTrip[]) : [];
    setSavedTrips(parsed);
  }, []);

  const upcomingTrips = savedTrips.filter((t) => !tripIsPast(t.endDateIso));
  const latestTrips = upcomingTrips.slice(0, 3);

  return (
    <div
      className="journy-root journy-paper-texture flex min-h-0 w-full flex-1 flex-col gap-6"
      style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Travel Desk · Home
        </div>
        <h1 style={{ marginTop: 10, fontFamily: SERIF, fontSize: "clamp(32px, 4.8vw, 50px)", lineHeight: 1.04 }}>
          Welcome <span style={{ fontStyle: "italic", fontWeight: 400 }}>back</span>
        </h1>
        <p style={{ marginTop: 10, fontFamily: SERIF, fontSize: 16, color: INK2 }}>
          Your quick overview: notation profile and most recent planned trips.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 px-6 pt-2 md:grid-cols-2 md:items-stretch">
        <div className="flex min-h-[min(280px,42vh)] flex-col p-6" style={{ border: `1px solid ${INK3}`, background: `${PAPER2}99` }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, color: INK }}>
            Your Traveler Type
          </h2>
          <div className="flex min-h-[140px] flex-1 items-center justify-center" style={{ border: `1px solid ${INK3}`, background: PAPER }}>
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: INK3 }}>
              Placeholder: Type Card
            </span>
          </div>
        </div>

        <div className="flex min-h-[min(280px,42vh)] flex-col p-6" style={{ border: `1px solid ${INK3}`, background: `${PAPER2}99` }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, color: INK }}>
            Upcoming Trips
          </h2>
          {latestTrips.length === 0 ? (
            <div className="flex min-h-[140px] flex-1 items-center justify-center" style={{ border: `1px solid ${INK3}`, background: PAPER }}>
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: INK3 }}>
                No trips saved yet
              </span>
            </div>
          ) : (
            <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2">
              {latestTrips.map((trip) => (
                <div key={trip.id} className="p-3" style={{ border: `1px solid ${INK3}`, background: PAPER }}>
                  <p style={{ fontFamily: SERIF, fontSize: 18, color: INK }}>{trip.title}</p>
                  <p style={{ fontFamily: SERIF, fontSize: 14, color: INK2 }}>
                    {trip.destination} - {trip.travelDates}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex gap-4 px-6 pb-6">
        <Link
          href="/plan"
          className="inline-flex items-center px-4 py-2"
          style={{
            border: `1.5px solid ${INK}`,
            background: INK,
            color: PAPER,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Plan a trip
        </Link>
        <Link
          href="/profile"
          style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}
        >
          View profile &rarr;
        </Link>
      </div>
    </div>
  );
}
