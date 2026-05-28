"use client";

import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import { VenueGoogleBadges } from "@/components/itinerary/VenueGoogleBadges";
import { mapsSearchUrl } from "@/components/itinerary/VenueChoiceGrid";
import type { ItineraryVenueChoice } from "@/lib/tripTypes";

type Props = {
  choice: ItineraryVenueChoice;
  destination: string;
  isExplicitPick?: boolean;
};

export default function VenueCardDetail({ choice, destination, isExplicitPick = true }: Props) {
  const mapsHref = mapsSearchUrl(choice.name, destination);
  const hasSite = Boolean(choice.websiteUrl && /^https?:\/\//i.test(choice.websiteUrl));

  return (
    <div
      className="flex flex-col gap-3 p-4 md:p-5 max-w-xl mx-auto w-full"
      style={{
        border: `2px solid ${INK}`,
        background: PAPER2,
        boxShadow: `0 4px 20px ${INK}18`,
      }}
    >
      {isExplicitPick ? (
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          Your pick
        </div>
      ) : (
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          Suggested venue
        </div>
      )}
      <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: INK, lineHeight: 1.2 }}>
        {choice.name}
      </div>
      {choice.area ? (
        <div style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>{choice.area}</div>
      ) : null}
      {choice.oneLine ? (
        <p style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.5, color: INK2, margin: 0 }}>{choice.oneLine}</p>
      ) : null}
      <VenueGoogleBadges choice={choice} />
      <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.1em", color: INK3, textTransform: "uppercase" }}>
        {choice.walkFromPreviousMinutes != null ? (
          <span>From last stop ~{choice.walkFromPreviousMinutes} min · </span>
        ) : null}
        {choice.rating != null ? (
          <span>
            {choice.rating.toFixed(1)}★
            {choice.ratingCountApprox != null
              ? ` · ${choice.googleVerified ? "" : "~"}${choice.ratingCountApprox} reviews`
              : ""}
          </span>
        ) : (
          <span>Rating n/a</span>
        )}
      </div>
      {choice.longWalkWarning ? (
        <p style={{ fontFamily: SERIF, fontSize: 13, lineHeight: 1.4, color: "#9B2C2C", margin: 0 }}>{choice.longWalkWarning}</p>
      ) : null}
      {choice.longWalkAllowed && choice.longWalkReason ? (
        <p style={{ fontFamily: SERIF, fontSize: 12, lineHeight: 1.4, color: INK3, margin: 0 }}>{choice.longWalkReason}</p>
      ) : null}
      <div className="flex flex-wrap gap-2 pt-1">
        {hasSite ? (
          <a
            href={choice.websiteUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center px-3 py-2"
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
          className="inline-flex justify-center px-3 py-2"
          style={{
            border: `1px solid ${INK}`,
            background: INK,
            color: PAPER,
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Google Maps
        </a>
      </div>
    </div>
  );
}
