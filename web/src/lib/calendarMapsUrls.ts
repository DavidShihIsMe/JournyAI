import { itinerarySlotKey, pickVenueChoice } from "@/lib/itineraryScheduleDisplay";
import type { GeneratedItineraryDay, ItineraryScheduleRow } from "@/lib/tripTypes";

function placeQuery(
  row: ItineraryScheduleRow,
  day: GeneratedItineraryDay,
  rowIndex: number,
  destination: string,
  venueSelections: Record<string, string>
): string {
  const slot = itinerarySlotKey(day.day, rowIndex);
  if (row.kind === "activity" && row.venueChoices?.length) {
    const choice = pickVenueChoice(row, slot, venueSelections);
    if (choice?.name) return `${choice.name}, ${destination}`.trim();
  }
  const text = row.text?.trim();
  if (text) return `${text}, ${destination}`.trim();
  return destination.trim();
}

/** Nearest activity stops before and after a travel row (for Maps directions). */
export function getTravelEndpoints(
  day: GeneratedItineraryDay,
  travelRowIndex: number,
  destination: string,
  venueSelections: Record<string, string>
): { from: string; to: string } {
  let from = destination.trim();
  let to = destination.trim();

  for (let i = travelRowIndex - 1; i >= 0; i--) {
    const item = day.items[i];
    if (item?.kind === "activity") {
      from = placeQuery(item, day, i, destination, venueSelections);
      break;
    }
  }

  for (let i = travelRowIndex + 1; i < day.items.length; i++) {
    const item = day.items[i];
    if (item?.kind === "activity") {
      to = placeQuery(item, day, i, destination, venueSelections);
      break;
    }
  }

  return { from, to };
}

export function googleMapsTravelMode(mode?: string): string {
  const m = mode?.trim().toLowerCase() ?? "walk";
  if (m === "walk") return "walking";
  if (m === "bike") return "bicycling";
  if (m === "public_transit" || m === "train" || m === "ferry") return "transit";
  return "driving";
}

export function googleMapsDirectionsUrl(
  origin: string,
  destination: string,
  travelMode?: string
): string {
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: googleMapsTravelMode(travelMode),
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
