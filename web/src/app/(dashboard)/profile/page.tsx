"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";

const SAVED_TRIPS_STORAGE_KEY = "journy_saved_trips";

interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  travelDates: string;
  summary: string;
  savedAt: string;
}

export default function ProfilePage() {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(SAVED_TRIPS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as SavedTrip[]) : [];
    setSavedTrips(parsed);
  }, []);

  return (
    <div
      className="journy-root journy-paper-texture flex flex-col gap-8"
      style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Reader Record · Profile
        </div>
        <h1 style={{ marginTop: 10, fontFamily: SERIF, fontSize: "clamp(32px, 4.8vw, 50px)", lineHeight: 1.04 }}>
          Your <span style={{ fontStyle: "italic", fontWeight: 400 }}>Profile</span>
        </h1>
        <p style={{ marginTop: 10, fontFamily: SERIF, fontSize: 16, color: INK2 }}>
          Your account details, traveler notation, and planning controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pt-2">
        <div className="p-6" style={{ border: `1px solid ${INK3}`, background: `${PAPER2}99` }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, color: INK }}>
            Account
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 flex items-center justify-center"
                style={{ border: `1px solid ${INK3}`, background: PAPER }}
              >
                <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: INK3 }}>
                  Avatar
                </span>
              </div>
              <div>
                <p style={{ fontFamily: SERIF, fontSize: 18, color: INK }}>
                  Display Name
                </p>
                <p style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.12em", color: INK3 }}>
                  user@example.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6" style={{ border: `1px solid ${INK3}`, background: `${PAPER2}99` }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, color: INK }}>
            Traveler Type
          </h2>
          <div
            className="h-[120px] flex items-center justify-center"
            style={{ border: `1px solid ${INK3}`, background: PAPER }}
          >
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: INK3 }}>
              Placeholder: Type Details
            </span>
          </div>
        </div>
      </div>

      <div className="mx-6 p-6" style={{ border: `1px solid ${INK3}`, background: `${PAPER2}99` }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 28, color: INK }}>
          Dimensions
        </h2>
        <div
          className="h-[160px] flex items-center justify-center"
          style={{ border: `1px solid ${INK3}`, background: PAPER }}
        >
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: INK3 }}>
            Placeholder: Dimension Sliders
          </span>
        </div>
      </div>

      <div className="mx-6 p-6" style={{ border: `1px solid ${INK3}`, background: `${PAPER2}99` }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 28, color: INK }}>Planned Trips</h2>
        {savedTrips.length === 0 ? (
          <p style={{ fontFamily: SERIF, fontSize: 16, color: INK2 }}>
            No trips saved yet. Generate an itinerary and click "Save to profile."
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {savedTrips.map((trip) => (
              <div key={trip.id} className="p-4" style={{ border: `1px solid ${INK3}`, background: PAPER }}>
                <p style={{ fontFamily: SERIF, fontSize: 20, color: INK }}>{trip.title}</p>
                <p style={{ marginTop: 4, fontFamily: SERIF, fontSize: 15, color: INK2 }}>
                  {trip.destination} - {trip.travelDates}
                </p>
                <p style={{ marginTop: 8, fontFamily: SERIF, fontSize: 15, color: INK2 }}>
                  {trip.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 px-6 pb-6">
        <Link
          href="/plan"
          className="inline-flex items-center px-4 py-2"
          style={{
            border: `1.5px solid ${INK}`,
            background: INK,
            color: PAPER,
            borderRadius: 0,
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
          href="/home"
          style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}
        >
          Back to home &rarr;
        </Link>
        <Link
          href="/quiz"
          style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}
        >
          Retake quiz
        </Link>
      </div>
    </div>
  );
}
