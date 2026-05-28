import { HOTEL_OPTION_NA, HOTEL_OPTION_OTHER } from "@/lib/demoHotels";
import { fetchWalkingMinutesBetween } from "@/lib/googleWalkingDirections";
import {
  applyPlaceHoursToVenue,
  buildPlaceSearchQuery,
  lookupPlaceByText,
  type GooglePlaceLookupResult,
} from "@/lib/googleMaps/places";
import { fetchRouteMinutesBetween, itineraryModeToGoogleRoute } from "@/lib/googleMaps/routes";
import { parseActivityDateTime } from "@/lib/googleMaps/scheduleTime";
import type { GeneratedItinerary, ItineraryScheduleRow, ItineraryVenueChoice } from "@/lib/tripTypes";

export interface TripGoogleEnrichmentPayload {
  destination: string;
  startDate: string;
  stayingHotel: string;
  hotelAddress?: string;
}

export interface GoogleEnrichmentStats {
  routeAttempts: number;
  routeUpdates: number;
  placesLookups: number;
  placesMatched: number;
  closedAtTimeWarnings: number;
  usedLegacyDirectionsFallback: number;
  /** First Places API failure message (e.g. API not enabled on the key). */
  placesApiError?: string;
}

function lodgingGeocodeQuery(trip: TripGoogleEnrichmentPayload): string | null {
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

async function routeMinutes(
  origin: string,
  destination: string,
  apiKey: string,
  mode: string | undefined,
  departureTime: Date | undefined,
  stats: GoogleEnrichmentStats
): Promise<number | null> {
  stats.routeAttempts++;
  const googleMode = itineraryModeToGoogleRoute(mode);
  let minutes = await fetchRouteMinutesBetween(origin, destination, apiKey, {
    travelMode: googleMode,
    departureTime,
  });

  if (minutes == null && googleMode === "WALK") {
    minutes = await fetchWalkingMinutesBetween(origin, destination, apiKey);
    if (minutes != null) stats.usedLegacyDirectionsFallback++;
  }

  if (minutes != null) stats.routeUpdates++;
  return minutes;
}

function applyPlaceToVenue(choice: ItineraryVenueChoice, place: GooglePlaceLookupResult) {
  choice.googlePlaceId = place.placeId;
  if (place.rating != null) choice.rating = place.rating;
  if (place.userRatingCount != null) choice.ratingCountApprox = place.userRatingCount;
  if (place.websiteUri && /^https?:\/\//i.test(place.websiteUri)) {
    choice.websiteUrl = place.websiteUri;
  }
  choice.hoursSummary = place.hoursSummary;
  choice.openAtScheduledTime = place.openAtScheduledTime;
  choice.hoursNote = place.hoursNote;
  choice.businessStatus = place.businessStatus;
  choice.googleVerified = true;
}

/**
 * After the AI draft: verify legs with Routes API (walk/transit/drive) and
 * venue hours/open status with Places API before returning to the client.
 */
export async function enrichItineraryWithGoogle(
  itinerary: GeneratedItinerary,
  trip: TripGoogleEnrichmentPayload,
  apiKey: string
): Promise<GoogleEnrichmentStats> {
  const stats: GoogleEnrichmentStats = {
    routeAttempts: 0,
    routeUpdates: 0,
    placesLookups: 0,
    placesMatched: 0,
    closedAtTimeWarnings: 0,
    usedLegacyDirectionsFallback: 0,
  };

  const hotelQ = lodgingGeocodeQuery(trip);
  const dest = trip.destination.trim();
  const startDate = trip.startDate.trim();
  const placeCache = new Map<string, GooglePlaceLookupResult | null>();

  async function getPlaceForVenue(
    choice: ItineraryVenueChoice,
    scheduledAt: Date | null
  ): Promise<GooglePlaceLookupResult | null> {
    const query = buildPlaceSearchQuery(choice.name, choice.area, dest);
    let cached = placeCache.get(query);
    if (cached === undefined) {
      stats.placesLookups++;
      await sleep(120);
      const outcome = await lookupPlaceByText(query, apiKey);
      if (!stats.placesApiError && outcome.errorMessage) {
        stats.placesApiError = outcome.errorMessage;
      }
      cached = outcome.place;
      placeCache.set(query, cached);
      if (cached) stats.placesMatched++;
    }
    if (!cached) return null;
    return applyPlaceHoursToVenue(cached, scheduledAt);
  }

  for (const day of itinerary.days) {
    const items = day.items;
    const scheduledAtForRow = (row: ItineraryScheduleRow) =>
      parseActivityDateTime(startDate, day.day, row.time);

    const firstTravelIdx = items.findIndex((r) => r.kind === "travel");
    if (firstTravelIdx >= 0 && hotelQ) {
      const tr = items[firstTravelIdx] as ItineraryScheduleRow;
      const next = items[firstTravelIdx + 1];
      if (next) {
        const destText = [next.text, dest].filter(Boolean).join(" — ").slice(0, 200);
        const dep = scheduledAtForRow(tr);
        await sleep(150);
        const m = await routeMinutes(hotelQ, destText, apiKey, tr.mode, dep ?? undefined, stats);
        if (m != null) {
          tr.durationMinutes = m;
          tr.googleRouteVerified = true;
        }
      }
    }

    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      if (row.kind !== "activity" || !row.venueChoices?.length) continue;

      const activityAt = scheduledAtForRow(row);

      for (const choice of row.venueChoices) {
        const place = await getPlaceForVenue(choice, activityAt);
        if (place) {
          applyPlaceToVenue(choice, place);
          if (place.openAtScheduledTime === false) stats.closedAtTimeWarnings++;
        }
      }

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

      const walkMode =
        prev?.kind === "travel" ? (prev as ItineraryScheduleRow).mode : "walk";

      if (origin) {
        for (const choice of row.venueChoices) {
          const destQ = [choice.name, choice.area, dest].filter(Boolean).join(", ");
          await sleep(150);
          const m = await routeMinutes(
            origin,
            destQ,
            apiKey,
            walkMode,
            activityAt ?? undefined,
            stats
          );
          if (m != null) {
            choice.walkFromPreviousMinutes = m;
            choice.googleWalkVerified = true;
          }
        }
      }

      const trAfter = i + 1 < items.length && items[i + 1].kind === "travel" ? items[i + 1] : null;
      const actAfter = i + 2 < items.length && items[i + 2].kind === "activity" ? items[i + 2] : null;
      if (trAfter && actAfter && row.venueChoices.length) {
        const toQ = `${actAfter.text.trim().slice(0, 140)}, ${dest}`;
        const legDep = scheduledAtForRow(trAfter as ItineraryScheduleRow);
        for (const choice of row.venueChoices) {
          const fromQ = [choice.name, choice.area, dest].filter(Boolean).join(", ");
          await sleep(150);
          const m = await routeMinutes(
            fromQ,
            toQ,
            apiKey,
            trAfter.mode,
            legDep ?? undefined,
            stats
          );
          if (m != null) {
            choice.walkToFollowingStopMinutes = m;
            choice.googleWalkVerified = true;
          }
        }
        const firstTo = row.venueChoices[0].walkToFollowingStopMinutes;
        if (typeof firstTo === "number" && Number.isFinite(firstTo)) {
          (trAfter as ItineraryScheduleRow).durationMinutes = Math.round(firstTo);
        }
      }
    }

    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      if (row.kind !== "travel") continue;

      const prevAct = i > 0 && items[i - 1].kind === "activity" ? items[i - 1] : null;
      const nextAct = i + 1 < items.length && items[i + 1].kind === "activity" ? items[i + 1] : null;
      if (!nextAct) continue;

      let origin: string | null = null;
      if (prevAct) {
        const pick = prevAct.venueChoices?.find((c) => c.googlePlaceId) ?? prevAct.venueChoices?.[0];
        origin = pick
          ? [pick.name, pick.area, dest].filter(Boolean).join(", ")
          : `${prevAct.text.trim().slice(0, 140)}, ${dest}`;
      } else if (hotelQ && i === firstTravelIdx) {
        origin = hotelQ;
      }

      if (!origin) continue;

      const destText = `${nextAct.text.trim().slice(0, 140)}, ${dest}`;
      const dep = scheduledAtForRow(row);
      await sleep(150);
      const m = await routeMinutes(origin, destText, apiKey, row.mode, dep ?? undefined, stats);
      if (m != null) {
        row.durationMinutes = m;
        row.googleRouteVerified = true;
      }
    }
  }

  if (stats.placesLookups > 0 && stats.placesMatched === 0 && !stats.placesApiError) {
    stats.placesApiError =
      "No venues matched in Google Places. Try more specific venue names in the plan, or enable Places API (New) on your key.";
  }

  return stats;
}
