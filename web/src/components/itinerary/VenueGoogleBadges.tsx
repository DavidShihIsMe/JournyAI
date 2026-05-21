import type { CSSProperties } from "react";
import { INK, PAPER, SANS } from "@/components/landing/brand";
import type { ItineraryVenueChoice } from "@/lib/tripTypes";

const badgeBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "3px 8px",
  fontFamily: SANS,
  fontSize: 9,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: 700,
  borderRadius: 2,
};

export function VenueGoogleBadges({ choice }: { choice: ItineraryVenueChoice }) {
  const hasPlace = Boolean(choice.googleVerified || choice.googlePlaceId);
  const hasWalk = Boolean(choice.googleWalkVerified);
  const hasAny = hasPlace || hasWalk || choice.hoursSummary || choice.hoursNote;

  if (!hasAny) return null;

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex flex-wrap gap-2">
        {hasPlace ? (
          <span style={{ ...badgeBase, border: `1px solid ${INK}`, background: INK, color: PAPER }}>
            Google · hours & rating
          </span>
        ) : null}
        {hasWalk ? (
          <span style={{ ...badgeBase, border: `1px solid ${INK}`, background: "transparent", color: INK }}>
            Google · walk time
          </span>
        ) : null}
        {choice.openAtScheduledTime === true ? (
          <span
            style={{
              ...badgeBase,
              border: "1px solid #166534",
              background: "#DCFCE7",
              color: "#166534",
            }}
          >
            Open at this time
          </span>
        ) : null}
        {choice.openAtScheduledTime === false ? (
          <span
            style={{
              ...badgeBase,
              border: "1px solid #9B2C2C",
              background: "#FEE2E2",
              color: "#9B2C2C",
            }}
          >
            May be closed
          </span>
        ) : null}
      </div>
      {choice.hoursNote ? (
        <p
          style={{
            fontFamily: SANS,
            fontSize: 12,
            lineHeight: 1.45,
            color: choice.openAtScheduledTime === false ? "#9B2C2C" : INK,
            margin: 0,
          }}
        >
          {choice.hoursNote}
        </p>
      ) : null}
      {choice.hoursSummary ? (
        <p style={{ fontFamily: SANS, fontSize: 11, lineHeight: 1.45, color: INK, margin: 0, opacity: 0.85 }}>
          {choice.hoursSummary}
        </p>
      ) : null}
    </div>
  );
}
