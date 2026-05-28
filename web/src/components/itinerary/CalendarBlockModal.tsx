"use client";

import { useEffect, useState } from "react";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import VenueCardDetail from "@/components/itinerary/VenueCardDetail";
import { VenueChoiceGrid } from "@/components/itinerary/VenueChoiceGrid";
import {
  CALENDAR_TRANSPORT_OPTIONS,
  durationForTransportMode,
  formatTransportLabel,
} from "@/lib/calendarTransport";
import { getTravelEndpoints, googleMapsDirectionsUrl } from "@/lib/calendarMapsUrls";
import { effectiveTravelMinutes, itinerarySlotKey, pickVenueChoice } from "@/lib/itineraryScheduleDisplay";
import type { GeneratedItineraryDay, ItineraryScheduleRow, ItineraryVenueChoice } from "@/lib/tripTypes";

type Props = {
  open: boolean;
  onClose: () => void;
  row: ItineraryScheduleRow | null;
  day: GeneratedItineraryDay | null;
  rowIndex: number;
  destination: string;
  venueSelections: Record<string, string>;
  travelOverrides: Record<string, number>;
  onVenueSelect: (choice: ItineraryVenueChoice) => void;
  onTransportChange: (mode: string, durationMinutes: number) => void;
};

export default function CalendarBlockModal({
  open,
  onClose,
  row,
  day,
  rowIndex,
  destination,
  venueSelections,
  travelOverrides,
  onVenueSelect,
  onTransportChange,
}: Props) {
  const [showOtherVenues, setShowOtherVenues] = useState(false);

  useEffect(() => {
    if (!open) setShowOtherVenues(false);
  }, [open]);

  if (!open || !row || !day) return null;

  const slotKey = itinerarySlotKey(day.day, rowIndex);
  const isTravel = row.kind === "travel";
  const selectedId = venueSelections[slotKey];
  const currentMode = row.mode?.trim().toLowerCase() || "walk";
  const baseMinutes =
    row.kind === "travel"
      ? effectiveTravelMinutes(day, rowIndex, row, venueSelections, travelOverrides) ||
        row.durationMinutes ||
        15
      : 0;

  const chosenVenue =
    !isTravel && row.venueChoices?.length
      ? pickVenueChoice(row, slotKey, venueSelections)
      : undefined;
  const hasExplicitPick = Boolean(selectedId);

  const travelEndpoints = isTravel
    ? getTravelEndpoints(day, rowIndex, destination, venueSelections)
    : null;
  const directionsUrl =
    travelEndpoints && travelEndpoints.from && travelEndpoints.to
      ? googleMapsDirectionsUrl(travelEndpoints.from, travelEndpoints.to, currentMode)
      : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(27, 26, 24, 0.45)" }}
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
        style={{ background: PAPER, border: `2px solid ${INK}`, boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer"
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: INK3,
            background: "none",
            border: "none",
          }}
        >
          Close
        </button>

        {isTravel ? (
          <>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: INK3,
              }}
            >
              Travel leg
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, color: INK, marginTop: 8, paddingRight: 48 }}>
              {row.text || "Getting there"}
            </h2>
            {row.detail ? (
              <p style={{ fontFamily: SERIF, fontSize: 15, color: INK2, marginTop: 8 }}>{row.detail}</p>
            ) : null}
            {travelEndpoints ? (
              <p style={{ fontFamily: SERIF, fontSize: 14, color: INK2, marginTop: 12, lineHeight: 1.5 }}>
                <span style={{ color: INK3 }}>From </span>
                {travelEndpoints.from}
                <br />
                <span style={{ color: INK3 }}>To </span>
                {travelEndpoints.to}
              </p>
            ) : null}
            <p style={{ fontFamily: SERIF, fontSize: 14, color: INK2, marginTop: 16 }}>
              Current: {formatTransportLabel(row.mode)} · ~{baseMinutes} min
            </p>
            {directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center px-4 py-2.5 mt-4"
                style={{
                  border: `1.5px solid ${INK}`,
                  background: INK,
                  color: PAPER,
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Open route in Google Maps
              </a>
            ) : null}
            <div className="mt-6 flex flex-col gap-2">
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: INK3,
                }}
              >
                Change transportation
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CALENDAR_TRANSPORT_OPTIONS.map((opt) => {
                  const active = currentMode === opt.value;
                  const est = durationForTransportMode(
                    row.durationMinutes ?? baseMinutes,
                    opt.value
                  );
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onTransportChange(opt.value, est)}
                      className="px-3 py-3 cursor-pointer text-left"
                      style={{
                        border: `1.5px solid ${active ? INK : INK3}`,
                        background: active ? PAPER2 : "transparent",
                        fontFamily: SERIF,
                        fontSize: 14,
                        color: INK,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: INK2, marginTop: 4 }}>~{est} min</div>
                    </button>
                  );
                })}
              </div>
            </div>
            {row.travelTimeWarning ? (
              <p style={{ fontFamily: SERIF, fontSize: 13, color: "#9B2C2C", marginTop: 16 }}>{row.travelTimeWarning}</p>
            ) : null}
          </>
        ) : (
          <>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: INK3,
              }}
            >
              Activity
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, color: INK, marginTop: 8, paddingRight: 48, textAlign: "center" }}>
              {row.text}
            </h2>
            {row.detail ? (
              <p style={{ fontFamily: SERIF, fontSize: 15, color: INK2, marginTop: 8, textAlign: "center" }}>
                {row.detail}
              </p>
            ) : null}
            {chosenVenue ? (
              <div className="mt-6">
                <VenueCardDetail
                  choice={chosenVenue}
                  destination={destination}
                  isExplicitPick={hasExplicitPick}
                />
                {row.venueChoices && row.venueChoices.length > 1 ? (
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowOtherVenues((v) => !v)}
                      className="cursor-pointer underline-offset-2 hover:underline"
                      style={{
                        fontFamily: SERIF,
                        fontSize: 14,
                        color: INK2,
                        background: "none",
                        border: "none",
                      }}
                    >
                      {showOtherVenues ? "Hide other options" : "Pick a different venue"}
                    </button>
                    {showOtherVenues ? (
                      <VenueChoiceGrid
                        choices={row.venueChoices}
                        destination={destination}
                        selectedId={selectedId}
                        onSelect={(c) => {
                          onVenueSelect(c);
                          setShowOtherVenues(false);
                        }}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : row.venueChoices?.length ? (
              <VenueChoiceGrid
                choices={row.venueChoices}
                destination={destination}
                selectedId={selectedId}
                onSelect={onVenueSelect}
              />
            ) : (
              <p style={{ fontFamily: SERIF, fontSize: 15, color: INK2, marginTop: 16 }}>
                No venue cards for this stop — it is a fixed activity in your plan.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
