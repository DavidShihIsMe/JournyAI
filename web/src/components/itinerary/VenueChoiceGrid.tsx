"use client";

import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import { VenueGoogleBadges } from "@/components/itinerary/VenueGoogleBadges";
import type { ItineraryVenueChoice } from "@/lib/tripTypes";

export function mapsSearchUrl(placeName: string, destination: string): string {
  const q = `${placeName}, ${destination}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function VenueChoiceGrid({
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
              <VenueGoogleBadges choice={c} />
              {c.longWalkWarning ? (
                <p style={{ fontFamily: SERIF, fontSize: 13, lineHeight: 1.4, color: "#9B2C2C", margin: 0 }}>{c.longWalkWarning}</p>
              ) : null}
              {c.longWalkAllowed && c.longWalkReason ? (
                <p style={{ fontFamily: SERIF, fontSize: 12, lineHeight: 1.4, color: INK3, margin: 0 }}>{c.longWalkReason}</p>
              ) : null}
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.12em", color: INK3, textTransform: "uppercase" }}>
                {c.walkFromPreviousMinutes != null ? (
                  <span>From last stop ~{c.walkFromPreviousMinutes} min walk · </span>
                ) : null}
                {c.rating != null ? (
                  <span>
                    {c.rating.toFixed(1)}★
                    {c.ratingCountApprox != null
                      ? ` · ${c.googleVerified ? "" : "~"}${c.ratingCountApprox} reviews`
                      : ""}
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
