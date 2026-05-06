"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";

const RESULT_STORAGE_KEY = "journy_latest_itinerary";
const SAVED_TRIPS_STORAGE_KEY = "journy_saved_trips";

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

interface SavedTrip extends GeneratedItinerary {
  id: string;
  savedAt: string;
}

export default function ItineraryPage() {
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as GeneratedItinerary;
      setItinerary(parsed);
    } catch {
      setItinerary(null);
    }
  }, []);

  function handleSaveToProfile() {
    if (!itinerary || typeof window === "undefined") return;
    const savedTrip: SavedTrip = {
      ...itinerary,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
    };

    const raw = window.localStorage.getItem(SAVED_TRIPS_STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as SavedTrip[]) : [];
    const next = [savedTrip, ...existing];
    window.localStorage.setItem(SAVED_TRIPS_STORAGE_KEY, JSON.stringify(next));
    setSaveMessage("Saved to profile.");
  }

  function handleDownloadPdf() {
    if (!itinerary || typeof window === "undefined") return;
    const printable = `
      <html>
        <head>
          <title>${itinerary.title}</title>
          <style>
            body { font-family: Georgia, serif; padding: 28px; color: #1B1A18; }
            h1 { margin-bottom: 4px; }
            h2 { margin-top: 24px; margin-bottom: 6px; }
            p, li { font-size: 14px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(itinerary.title)}</h1>
          <p>${escapeHtml(itinerary.destination)} - ${escapeHtml(itinerary.travelDates)}</p>
          <p>${escapeHtml(itinerary.summary)}</p>
          ${itinerary.days
            .map(
              (day) => `
              <h2>Day ${day.day}: ${escapeHtml(day.title)}</h2>
              <ul>
                ${day.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            `
            )
            .join("")}
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(printable);
    win.document.close();
    win.focus();
    win.print();
  }

  if (!itinerary) {
    return (
      <div className="journy-root journy-paper-texture" style={{ background: PAPER, border: `1px solid ${INK}`, padding: 24 }}>
        <div>
          <h1 style={{ fontFamily: SERIF, fontSize: 38, color: INK }}>Your Itinerary</h1>
          <p style={{ marginTop: 8, fontFamily: SERIF, fontSize: 16, color: INK2 }}>
            No generated itinerary found yet.
          </p>
        </div>
        <Link
          href="/plan"
          style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: INK3 }}
        >
          Plan a trip &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="journy-root journy-paper-texture" style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}>
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Personal Volume · Itinerary
        </div>
        <h1 style={{ marginTop: 10, fontFamily: SERIF, fontSize: "clamp(32px, 4.5vw, 50px)", lineHeight: 1.05 }}>
          {itinerary.title}
        </h1>
        <p style={{ marginTop: 10, fontFamily: SERIF, fontSize: 16, color: INK2 }}>
          {itinerary.destination} · {itinerary.travelDates}
        </p>
        <p style={{ marginTop: 16, fontFamily: SERIF, fontSize: 16, lineHeight: 1.55, color: INK2 }}>
          {itinerary.summary}
        </p>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-8">
        {itinerary.days.map((day) => (
          <section
            key={day.day}
            className="p-5"
            style={{ border: `1px solid ${INK3}`, background: `${PAPER2}88` }}
          >
            <h2 style={{ fontFamily: SERIF, fontSize: 28, color: INK }}>
              Day {day.day}: {day.title}
            </h2>
            <ul className="mt-3 list-disc pl-5 flex flex-col gap-1">
              {day.items.map((item, index) => (
                <li key={`${day.day}-${index}`} style={{ fontFamily: SERIF, fontSize: 16, color: INK2 }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="flex items-center gap-4 pt-3 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center px-4 py-2"
            style={{
              border: `1.5px solid ${INK3}`,
              background: PAPER2,
              color: INK,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={handleSaveToProfile}
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
            Save to profile
          </button>
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
            Plan another trip
          </Link>
          <Link href="/profile" style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>
            Back to profile &rarr;
          </Link>
          {saveMessage ? (
            <span style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>{saveMessage}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
