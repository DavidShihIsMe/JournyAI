import { HOTEL_OPTION_NA, HOTEL_OPTION_OTHER } from "@/lib/demoHotels";
import { fetchWalkingMinutesBetween } from "@/lib/googleWalkingDirections";
import type { GeneratedItinerary, ItineraryScheduleRow } from "@/lib/tripTypes";

export interface TripLodgingPayload {
  destination: string;
  stayingHotel: string;
  hotelAddress?: string;
}

function lodgingGeocodeQuery(trip: TripLodgingPayload): string | null {
  if (trip.stayingHotel === HOTEL_OPTION_NA) return null;
  const dest = trip.destination.trim();
  if (!dest) return null;
  if (trip.stayingHotel === HOTEL_OPTION_OTHER) {
    const addr = trip.hotelAddress?.trim();
    return addr ? `${addr}, ${dest}` : null;
  }
  const hotel = trip.stayingHotel.trim();
  if (!hotel) return null;
  const addr = trip.hotelAddress?.trim();
  return addr ? `${hotel}, ${addr}, ${dest}` : `${hotel}, ${dest}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Overwrites walking minutes using Google Directions when possible:
 * - First walking leg of each day (usually from hotel).
 * - Each venue card's walkFromPrevious when the prior leg is from the hotel (first travel of day)
 *   or from the previous activity's text.
 */
export async function enrichItineraryWalksWithGoogle(
  itinerary: GeneratedItinerary,
  trip: TripLodgingPayload,
  apiKey: string
): Promise<{ attempts: number; updates: number }> {
  const hotelQ = lodgingGeocodeQuery(trip);
  let attempts = 0;
  let updates = 0;

  if (!hotelQ) {
    return { attempts: 0, updates: 0 };
  }

  const dest = trip.destination.trim();

  for (const day of itinerary.days) {
    const items = day.items;
    const firstTravelIdx = items.findIndex((r) => r.kind === "travel");
    if (firstTravelIdx >= 0) {
      const tr = items[firstTravelIdx] as ItineraryScheduleRow;
      const next = items[firstTravelIdx + 1];
      const mode = (tr.mode ?? "walk").toLowerCase();
      if (next && (mode === "walk" || mode === "walking")) {
        const destText = [next.text, dest].filter(Boolean).join(" — ").slice(0, 200);
        attempts++;
        const m = await fetchWalkingMinutesBetween(hotelQ, destText, apiKey);
        await sleep(180);
        if (m != null) {
          tr.durationMinutes = m;
          updates++;
        }
      }
    }

    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      if (row.kind !== "activity" || !row.venueChoices?.length) continue;

      const prev = i > 0 ? items[i - 1] : null;
      let origin: string | null = null;
      if (!prev) {
        origin = hotelQ;
      } else if (prev.kind === "travel") {
        const travelsBefore = items.slice(0, i).filter((r) => r.kind === "travel").length;
        const isFirstTravelOfDay = travelsBefore === 1;
        if (isFirstTravelOfDay) {
          origin = hotelQ;
        } else {
          const prevAct = i > 1 ? items[i - 2] : null;
          if (prevAct?.kind === "activity") {
            origin = `${prevAct.text.trim().slice(0, 140)}, ${dest}`;
          } else {
            origin = hotelQ;
          }
        }
      } else if (prev.kind === "activity") {
        origin = `${prev.text.trim().slice(0, 140)}, ${dest}`;
      }

      if (!origin) continue;

      for (const choice of row.venueChoices) {
        const destQ = [choice.name, choice.area, dest].filter(Boolean).join(", ");
        attempts++;
        const m = await fetchWalkingMinutesBetween(origin, destQ, apiKey);
        await sleep(180);
        if (m != null) {
          choice.walkFromPreviousMinutes = m;
          updates++;
        }
      }

      const trAfter = i + 1 < items.length && items[i + 1].kind === "travel" ? items[i + 1] : null;
      const actAfter = i + 2 < items.length && items[i + 2].kind === "activity" ? items[i + 2] : null;
      if (trAfter && actAfter && row.venueChoices.length) {
        const mode = (trAfter.mode ?? "walk").toLowerCase();
        if (mode === "walk" || mode === "walking") {
          const toQ = `${actAfter.text.trim().slice(0, 140)}, ${dest}`;
          for (const choice of row.venueChoices) {
            const fromQ = [choice.name, choice.area, dest].filter(Boolean).join(", ");
            attempts++;
            const m = await fetchWalkingMinutesBetween(fromQ, toQ, apiKey);
            await sleep(180);
            if (m != null) {
              choice.walkToFollowingStopMinutes = m;
              updates++;
            }
          }
          const firstTo = row.venueChoices[0].walkToFollowingStopMinutes;
          if (typeof firstTo === "number" && Number.isFinite(firstTo)) {
            trAfter.durationMinutes = Math.round(firstTo);
          }
        }
      }
    }
  }

  return { attempts, updates };
}
