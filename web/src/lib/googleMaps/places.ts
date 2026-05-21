import {
  isOpenAtScheduledTime,
  summarizeOpeningHours,
  type GoogleRegularHours,
} from "@/lib/googleMaps/openingHours";

const SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";

const PLACE_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.businessStatus",
  "places.regularOpeningHours",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
].join(",");

export type GooglePlaceBusinessStatus =
  | "OPERATIONAL"
  | "CLOSED_TEMPORARILY"
  | "CLOSED_PERMANENTLY";

export interface GooglePlaceLookupResult {
  placeId: string;
  displayName: string;
  formattedAddress?: string;
  businessStatus?: GooglePlaceBusinessStatus;
  regularOpeningHours?: GoogleRegularHours;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  hoursSummary?: string;
  openAtScheduledTime?: boolean;
  hoursNote?: string;
}

type PlacesSearchResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    businessStatus?: GooglePlaceBusinessStatus;
    regularOpeningHours?: GoogleRegularHours;
    rating?: number;
    userRatingCount?: number;
    websiteUri?: string;
  }>;
};

export type PlacesLookupErrorCode = "DISABLED" | "DENIED" | "HTTP" | "EMPTY" | "NETWORK";

export interface PlacesLookupOutcome {
  place: GooglePlaceLookupResult | null;
  errorCode?: PlacesLookupErrorCode;
  errorMessage?: string;
}

function parsePlacesError(
  status: number,
  body: unknown
): { code: PlacesLookupErrorCode; message: string } {
  const err =
    body && typeof body === "object" && "error" in body
      ? (body as { error?: { message?: string; status?: string } }).error
      : undefined;
  const msg = err?.message ?? `Places API returned HTTP ${status}`;
  if (status === 403 || err?.status === "PERMISSION_DENIED") {
    if (/places api \(new\)/i.test(msg) || /SERVICE_DISABLED/i.test(msg)) {
      return {
        code: "DISABLED",
        message:
          "Places API (New) is not enabled for this key. In Google Cloud Console, enable “Places API (New)” on the same project as your Routes key.",
      };
    }
    return { code: "DENIED", message: msg };
  }
  return { code: "HTTP", message: msg };
}

export async function lookupPlaceByText(
  textQuery: string,
  apiKey: string
): Promise<PlacesLookupOutcome> {
  const q = textQuery.trim();
  if (!q || !apiKey) {
    return { place: null, errorCode: "EMPTY", errorMessage: "Missing query or API key." };
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(SEARCH_TEXT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACE_FIELD_MASK,
      },
      body: JSON.stringify({ textQuery: q, languageCode: "en" }),
      signal: controller.signal,
    });
    const data = (await res.json()) as PlacesSearchResponse & {
      error?: { message?: string };
    };
    if (!res.ok) {
      const parsed = parsePlacesError(res.status, data);
      return { place: null, errorCode: parsed.code, errorMessage: parsed.message };
    }
    const place = data.places?.[0];
    if (!place?.id) {
      return { place: null, errorCode: "EMPTY", errorMessage: "No matching place found." };
    }

    const displayName = place.displayName?.text?.trim() || q;
    return {
      place: {
        placeId: place.id,
        displayName,
        formattedAddress: place.formattedAddress,
        businessStatus: place.businessStatus,
        regularOpeningHours: place.regularOpeningHours,
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        websiteUri: place.websiteUri,
        hoursSummary: summarizeOpeningHours(place.regularOpeningHours),
      },
    };
  } catch {
    return {
      place: null,
      errorCode: "NETWORK",
      errorMessage: "Could not reach Google Places API.",
    };
  } finally {
    clearTimeout(t);
  }
}

export function applyPlaceHoursToVenue(
  place: GooglePlaceLookupResult,
  scheduledAt: Date | null
): GooglePlaceLookupResult {
  const hoursSummary = place.hoursSummary ?? summarizeOpeningHours(place.regularOpeningHours);

  if (place.businessStatus === "CLOSED_PERMANENTLY") {
    return {
      ...place,
      hoursSummary,
      openAtScheduledTime: false,
      hoursNote: "Google reports this place as permanently closed.",
    };
  }

  if (place.businessStatus === "CLOSED_TEMPORARILY") {
    return {
      ...place,
      hoursSummary,
      openAtScheduledTime: false,
      hoursNote: "Google reports this place is temporarily closed — confirm before you go.",
    };
  }

  if (!scheduledAt) {
    return {
      ...place,
      hoursSummary,
      openAtScheduledTime: undefined,
      hoursNote: hoursSummary ? undefined : "Hours could not be verified with Google.",
    };
  }

  const open = isOpenAtScheduledTime(place.regularOpeningHours, scheduledAt);
  if (open === true) {
    return {
      ...place,
      hoursSummary,
      openAtScheduledTime: true,
      hoursNote: undefined,
    };
  }
  if (open === false) {
    const timeLabel = scheduledAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return {
      ...place,
      hoursSummary,
      openAtScheduledTime: false,
      hoursNote: `May be closed around ${timeLabel} on this day (per Google hours).`,
    };
  }

  return {
    ...place,
    hoursSummary,
    openAtScheduledTime: undefined,
    hoursNote: hoursSummary
      ? "Could not confirm open/closed at this exact time — check hours below."
      : "Hours could not be verified with Google.",
  };
}

export function buildPlaceSearchQuery(
  name: string,
  area: string | undefined,
  destination: string
): string {
  return [name, area, destination].filter(Boolean).join(", ");
}
