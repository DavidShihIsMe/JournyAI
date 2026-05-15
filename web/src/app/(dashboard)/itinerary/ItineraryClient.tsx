"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import { RESULT_STORAGE_KEY, SAVED_TRIPS_STORAGE_KEY, TRIP_META_STORAGE_KEY } from "@/lib/tripStorageKeys";
import {
  displayTimeOffsetMinutes,
  effectiveTravelMinutes,
  formatAdjustedClockTime,
  itinerarySlotKey,
} from "@/lib/itineraryScheduleDisplay";
import {
  normalizeItineraryDays,
  type GeneratedItinerary,
  type GeneratedItineraryDay,
  type ItineraryScheduleRow,
  type ItineraryVenueChoice,
  type SavedTrip,
} from "@/lib/tripTypes";

function mapsSearchUrl(placeName: string, destination: string): string {
  const q = `${placeName}, ${destination}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export default function ItineraryClient() {
  const searchParams = useSearchParams();
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [venueSelections, setVenueSelections] = useState<Record<string, string>>({});
  const [travelOverrides, setTravelOverrides] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const tripId = searchParams.get("tripId");

    if (tripId) {
      const savedRaw = window.localStorage.getItem(SAVED_TRIPS_STORAGE_KEY);
      if (!savedRaw) {
        setItinerary(null);
        return;
      }
      try {
        const savedTrips = JSON.parse(savedRaw) as SavedTrip[];
        const selectedTrip = savedTrips.find((trip) => trip.id === tripId);
        if (!selectedTrip) {
          setItinerary(null);
          return;
        }
        setItinerary({
          ...selectedTrip,
          days: normalizeItineraryDays(selectedTrip.days),
        });
        return;
      } catch {
        setItinerary(null);
        return;
      }
    }

    const latestRaw = window.sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!latestRaw) {
      setItinerary(null);
      return;
    }
    try {
      const parsed = JSON.parse(latestRaw) as GeneratedItinerary;
      setItinerary({ ...parsed, days: normalizeItineraryDays(parsed.days) });
    } catch {
      setItinerary(null);
    }
  }, [searchParams]);

  useEffect(() => {
    setVenueSelections({});
    setTravelOverrides({});
  }, [itinerary?.title, itinerary?.travelDates]);

  const handleVenueSelect = useCallback((day: GeneratedItineraryDay, activityIndex: number, choice: ItineraryVenueChoice) => {
    const slot = itinerarySlotKey(day.day, activityIndex);
    setVenueSelections((prev) => ({ ...prev, [slot]: choice.id }));
    setTravelOverrides((o) => {
      const next = { ...o };
      const prevIndex = activityIndex - 1;
      if (prevIndex >= 0) {
        const prevRow = day.items[prevIndex];
        if (prevRow?.kind === "travel" && choice.walkFromPreviousMinutes != null) {
          next[itinerarySlotKey(day.day, prevIndex)] = Math.round(choice.walkFromPreviousMinutes);
        }
      }
      const travelAfterIndex = activityIndex + 1;
      const afterRow = day.items[travelAfterIndex];
      if (afterRow?.kind === "travel" && choice.walkToFollowingStopMinutes != null) {
        next[itinerarySlotKey(day.day, travelAfterIndex)] = Math.round(choice.walkToFollowingStopMinutes);
      }
      return next;
    });
  }, []);

  function handleSaveToProfile() {
    if (!itinerary || typeof window === "undefined") return;
    let meta: { startDateIso?: string; endDateIso?: string } = {};
    try {
      const rawMeta = window.sessionStorage.getItem(TRIP_META_STORAGE_KEY);
      if (rawMeta) meta = JSON.parse(rawMeta) as typeof meta;
    } catch {
      meta = {};
    }

    const savedTrip: SavedTrip = {
      ...itinerary,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      endDateIso: meta.endDateIso,
      startDateIso: meta.startDateIso,
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
          <title>${escapeHtml(itinerary.title)}</title>
          <style>
            body { font-family: Georgia, serif; padding: 28px; color: #1B1A18; }
            h1 { margin-bottom: 4px; }
            h2 { margin-top: 24px; margin-bottom: 6px; }
            p, li { font-size: 14px; line-height: 1.5; }
            .muted { font-size: 11px; color: #666; margin-top: 6px; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(itinerary.title)}</h1>
          <p>${escapeHtml(itinerary.destination)} - ${escapeHtml(itinerary.travelDates)}</p>
          <p>${escapeHtml(itinerary.summary)}</p>
          <p class="muted">Venue ratings and walk minutes are planner estimates — confirm before visiting. Clock times shift when you pick a card so later rows stay in sync with leg length.</p>
          ${itinerary.days
            .map((day) => {
              const rows = day.items;
              return `
              <h2>Day ${day.day}: ${escapeHtml(day.title)}</h2>
              <table style="width:100%; border-collapse:collapse; margin-top:8px;">
                <tbody>
                  ${rows
                    .map((row, index) => {
                      const timeLabel = escapeHtml(
                        formatAdjustedClockTime(row.time, displayTimeOffsetMinutes(day, index, venueSelections, travelOverrides))
                      );
                      const travelMin =
                        row.kind === "travel"
                          ? effectiveTravelMinutes(day, index, row, venueSelections, travelOverrides)
                          : null;
                      const meta =
                        row.kind === "travel" && travelMin != null
                          ? `${escapeHtml(formatTravelMeta({ ...row, durationMinutes: travelMin }))}`
                          : row.kind === "travel"
                            ? `${escapeHtml(formatTravelMeta(row))}`
                            : "";
                      const detail = row.detail ? `<div style="font-size:12px;color:#444;margin-top:4px;">${escapeHtml(row.detail)}</div>` : "";
                      const activityHtml =
                        row.kind === "activity" && row.venueChoices?.length
                          ? formatVenueChoicesPdfHtml(
                              row,
                              day.day,
                              index,
                              itinerary.destination,
                              venueSelections
                            )
                          : "";
                      const mainText =
                        row.kind === "activity" && row.venueChoices?.length
                          ? escapeHtml(row.text)
                          : escapeHtml(row.text);
                      return `<tr style="vertical-align:top;">
                        <td style="width:88px; padding:10px 12px 10px 0; border-bottom:1px solid #ddd; font-family:Helvetica,Arial,sans-serif; font-size:11px; letter-spacing:0.08em; color:#666;">${timeLabel}${meta ? `<div style="margin-top:6px;font-size:10px;">${meta}</div>` : ""}</td>
                        <td style="padding:10px 0; border-bottom:1px solid #ddd;">
                          ${row.kind === "travel" ? `<span style="font-family:Helvetica,Arial,sans-serif; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#666;">Travel</span><br/>` : ""}
                          <span style="font-size:14px;">${mainText}</span>
                          ${detail}
                          ${activityHtml}
                        </td>
                      </tr>`;
                    })
                    .join("")}
                </tbody>
              </table>
            `;
            })
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
        <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4.5vw, 50px)", lineHeight: 1.05 }}>
          {itinerary.title}
        </h1>
        <p style={{ marginTop: 10, fontFamily: SERIF, fontSize: 16, color: INK2 }}>
          {itinerary.destination} · {itinerary.travelDates}
        </p>
        <p style={{ marginTop: 16, fontFamily: SERIF, fontSize: 16, lineHeight: 1.55, color: INK2 }}>
          {itinerary.summary}
        </p>
        {itinerary.meta?.walkTimesVerifiedWithGoogle ? (
          <p
            style={{
              marginTop: 12,
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INK3,
              maxWidth: 720,
            }}
          >
            Walking times from your lodging and between some stops were double-checked with Google Directions
            {itinerary.meta.googleWalkUpdates != null ? ` (${itinerary.meta.googleWalkUpdates} legs updated)` : ""}.
            Driving or transit legs are unchanged; very dense city centers can still differ from real-time conditions.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-8">
        <p style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.5, color: INK3, maxWidth: 720 }}>
          Where you see three venue cards (meals, cafés, bars, shops, clubs, and similar), pick one — the leg <em>before</em>{" "}
          and <em>after</em> that stop updates, and later clock times shift to stay consistent with those walk minutes.
          Ratings are estimates (not live listings); confirm before you go.
        </p>
        {itinerary.days.map((day) => (
          <section
            key={day.day}
            className="p-5"
            style={{ border: `1px solid ${INK3}`, background: `${PAPER2}88` }}
          >
            <h2 style={{ fontFamily: SERIF, fontSize: 28, color: INK }}>
              Day {day.day}: {day.title}
            </h2>
            <div className="mt-4 flex flex-col">
              {day.items.map((row, index) => (
                <DayScheduleRow
                  key={`${day.day}-${index}`}
                  row={row}
                  day={day}
                  rowIndex={index}
                  destination={itinerary.destination}
                  venueSelections={venueSelections}
                  travelOverrides={travelOverrides}
                  travelMinutes={
                    row.kind === "travel"
                      ? effectiveTravelMinutes(day, index, row, venueSelections, travelOverrides)
                      : undefined
                  }
                  onVenueSelect={handleVenueSelect}
                />
              ))}
            </div>
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

function formatVenueChoicesPdfHtml(
  row: ItineraryScheduleRow,
  dayNum: number,
  index: number,
  destination: string,
  venueSelections: Record<string, string>
): string {
  const choices = row.venueChoices;
  if (!choices?.length) return "";
  const slot = itinerarySlotKey(dayNum, index);
  const blocks = choices
    .map((c) => {
      const sel = venueSelections[slot] === c.id ? " (selected)" : "";
      const rate =
        c.rating != null ? `★ ${c.rating.toFixed(1)}${c.ratingCountApprox != null ? ` (~${c.ratingCountApprox} reviews)` : ""}` : "";
      const walk =
        c.walkFromPreviousMinutes != null ? `Walk from prior stop ~${c.walkFromPreviousMinutes} min.` : "";
      const next =
        c.walkToFollowingStopMinutes != null
          ? ` Walk to following stop if chosen ~${c.walkToFollowingStopMinutes} min.`
          : "";
      const site =
        c.websiteUrl && /^https?:\/\//i.test(c.websiteUrl)
          ? `<div><a href="${escapeHtml(c.websiteUrl)}">Website</a></div>`
          : "";
      const maps = `<div><a href="${escapeHtml(mapsSearchUrl(c.name, destination))}">Map search</a></div>`;
      return `<div style="margin-top:10px;padding:8px;border:1px solid #ddd;">
        <strong>${escapeHtml(c.name)}</strong>${escapeHtml(sel)}<br/>
        <span style="font-size:12px;color:#444;">${escapeHtml(c.area ?? "")}</span><br/>
        <span style="font-size:12px;">${escapeHtml(rate)}</span><br/>
        <span style="font-size:12px;">${escapeHtml(walk)}${escapeHtml(next)}</span>
        ${c.oneLine ? `<div style="font-size:12px;margin-top:4px;">${escapeHtml(c.oneLine)}</div>` : ""}
        ${site}${maps}
      </div>`;
    })
    .join("");
  return `<div style="margin-top:10px;">${blocks}</div>`;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatModeLabel(mode?: string): string {
  if (!mode?.trim()) return "Travel";
  const m = mode.trim().toLowerCase().replaceAll("_", " ");
  return m.replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTravelMeta(row: ItineraryScheduleRow): string {
  const parts: string[] = [];
  if (row.durationMinutes != null && Number.isFinite(row.durationMinutes)) {
    parts.push(`~${row.durationMinutes} min`);
  }
  if (row.mode?.trim()) {
    parts.push(formatModeLabel(row.mode));
  }
  return parts.join(" · ");
}

function DayScheduleRow({
  row,
  day,
  rowIndex,
  destination,
  venueSelections,
  travelOverrides,
  travelMinutes,
  onVenueSelect,
}: {
  row: ItineraryScheduleRow;
  day: GeneratedItineraryDay;
  rowIndex: number;
  destination: string;
  venueSelections: Record<string, string>;
  travelOverrides: Record<string, number>;
  travelMinutes?: number;
  onVenueSelect: (day: GeneratedItineraryDay, activityIndex: number, choice: ItineraryVenueChoice) => void;
}) {
  const isTravel = row.kind === "travel";
  const timeDisplay = formatAdjustedClockTime(
    row.time,
    displayTimeOffsetMinutes(day, rowIndex, venueSelections, travelOverrides)
  );
  const slotKey = itinerarySlotKey(day.day, rowIndex);
  const selectedId = venueSelections[slotKey];
  const explicitChoice =
    !isTravel && selectedId && row.venueChoices?.length
      ? row.venueChoices.find((c) => c.id === selectedId)
      : undefined;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[5.75rem_1fr] gap-x-4 gap-y-1 py-3 border-b"
      style={{ borderColor: INK3 }}
    >
      <div className="min-w-0">
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          {timeDisplay}
        </div>
        {isTravel && travelMinutes != null && Number.isFinite(travelMinutes) ? (
          <div style={{ fontFamily: SERIF, fontSize: 13, color: INK2, marginTop: 6 }}>~{travelMinutes} min</div>
        ) : null}
      </div>
      <div className="min-w-0">
        {isTravel ? (
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: INK3,
              marginBottom: 4,
            }}
          >
            {formatModeLabel(row.mode)}
          </div>
        ) : null}
        <div style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.45, color: isTravel ? INK2 : INK }}>
          {row.text}
          {!isTravel && explicitChoice ? (
            <span style={{ display: "block", marginTop: 8, fontSize: 15, color: INK2 }}>
              <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.14em", color: INK3 }}>YOUR PICK · </span>
              {explicitChoice.name}
              {explicitChoice.area ? ` · ${explicitChoice.area}` : ""}
            </span>
          ) : null}
        </div>
        {row.detail ? (
          <p style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.45, color: INK2, marginTop: 6 }}>{row.detail}</p>
        ) : null}
        {!isTravel && row.venueChoices?.length ? (
          <VenueChoiceGrid
            choices={row.venueChoices}
            destination={destination}
            selectedId={selectedId}
            onSelect={(choice) => onVenueSelect(day, rowIndex, choice)}
          />
        ) : null}
      </div>
    </div>
  );
}

function VenueChoiceGrid({
  choices,
  destination,
  selectedId,
  onSelect,
}: {
  choices: ItineraryVenueChoice[];
  destination: string;
  selectedId: string | undefined;
  onSelect: (choice: ItineraryVenueChoice) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {choices.map((c) => {
          const isSelected = selectedId === c.id;
          const mapsHref = mapsSearchUrl(c.name, destination);
          const hasSite = Boolean(c.websiteUrl && /^https?:\/\//i.test(c.websiteUrl));
          return (
            <div
              key={c.id}
              className="flex flex-col gap-2 p-3 min-w-0"
              style={{
                border: `1px solid ${isSelected ? INK : INK3}`,
                background: isSelected ? `${PAPER2}` : "transparent",
                boxShadow: isSelected ? `0 0 0 1px ${INK}` : undefined,
              }}
            >
              <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: INK, lineHeight: 1.25 }}>
                {c.name}
              </div>
              {c.area ? (
                <div style={{ fontFamily: SERIF, fontSize: 13, color: INK2 }}>{c.area}</div>
              ) : null}
              {c.oneLine ? (
                <p style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.45, color: INK2, margin: 0 }}>{c.oneLine}</p>
              ) : null}
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.12em", color: INK3, textTransform: "uppercase" }}>
                {c.walkFromPreviousMinutes != null ? (
                  <span>From last stop ~{c.walkFromPreviousMinutes} min walk · </span>
                ) : null}
                {c.rating != null ? (
                  <span>
                    {c.rating.toFixed(1)}★
                    {c.ratingCountApprox != null ? ` · ~${c.ratingCountApprox} reviews` : ""}
                  </span>
                ) : (
                  <span>Rating n/a</span>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-auto pt-1">
                {hasSite ? (
                  <a
                    href={c.websiteUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center px-2 py-1.5 text-center"
                    style={{
                      border: `1px solid ${INK3}`,
                      fontFamily: SANS,
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: INK,
                      textDecoration: "none",
                    }}
                  >
                    Website
                  </a>
                ) : null}
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center px-2 py-1.5 text-center"
                  style={{
                    border: `1px solid ${INK3}`,
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: INK,
                    textDecoration: "none",
                  }}
                >
                  Map search
                </a>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(c)}
                  className="inline-flex justify-center px-2 py-2 cursor-pointer"
                  style={{
                    border: `1.5px solid ${INK}`,
                    background: isSelected ? INK : "transparent",
                    color: isSelected ? PAPER : INK,
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {isSelected ? "Selected" : "Choose"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
