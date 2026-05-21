import { lookupPlaceByText, type PlacesLookupOutcome } from "@/lib/googleMaps/places";

const SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";

const HOTEL_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.types",
].join(",");

export interface GoogleHotelResult {
  name: string;
  address?: string;
  placeId?: string;
}

type SearchResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    types?: string[];
  }>;
};

const LODGING_TYPES = new Set([
  "lodging",
  "hotel",
  "motel",
  "resort_hotel",
  "bed_and_breakfast",
  "guest_house",
  "hostel",
]);

function isLodgingPlace(types: string[] | undefined): boolean {
  if (!types?.length) return true;
  return types.some((t) => LODGING_TYPES.has(t) || t.includes("lodging") || t.includes("hotel"));
}

/**
 * Find real hotel names in a destination via Places API (New) text search.
 */
export async function searchHotelsInDestination(
  destination: string,
  apiKey: string,
  maxResults = 10
): Promise<{ hotels: GoogleHotelResult[]; error?: string }> {
  const dest = destination.trim();
  if (!dest || !apiKey) {
    return { hotels: [], error: "Missing destination or API key." };
  }

  const textQuery = `hotels in ${dest}`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 14_000);

  try {
    const res = await fetch(SEARCH_TEXT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": HOTEL_FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "en",
        maxResultCount: Math.min(20, Math.max(1, maxResults)),
        includedType: "lodging",
      }),
      signal: controller.signal,
    });

    const data = (await res.json()) as SearchResponse & { error?: { message?: string } };
    if (!res.ok) {
      const msg = data.error?.message ?? `Places API HTTP ${res.status}`;
      return { hotels: [], error: msg };
    }

    const hotels: GoogleHotelResult[] = [];
    for (const place of data.places ?? []) {
      const name = place.displayName?.text?.trim();
      if (!name) continue;
      if (!isLodgingPlace(place.types)) continue;
      hotels.push({
        name,
        address: place.formattedAddress,
        placeId: place.id,
      });
      if (hotels.length >= maxResults) break;
    }

    return { hotels };
  } catch {
    return { hotels: [], error: "Could not reach Google Places API." };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Resolve a user-selected or AI hotel string to Google's canonical name + address.
 */
export async function resolveHotelLodging(
  hotelName: string,
  destination: string,
  apiKey: string,
  placeId?: string
): Promise<GoogleHotelResult | null> {
  const name = hotelName.trim();
  const dest = destination.trim();
  if (!name || !apiKey) return null;

  if (placeId?.trim()) {
    const byId = await lookupPlaceByText(`${name}, ${dest}`, apiKey);
    if (byId.place) {
      return {
        name: byId.place.displayName,
        address: byId.place.formattedAddress,
        placeId: byId.place.placeId,
      };
    }
  }

  const query = `${name}, ${dest}`;
  const outcome: PlacesLookupOutcome = await lookupPlaceByText(query, apiKey);
  if (!outcome.place) return null;

  return {
    name: outcome.place.displayName,
    address: outcome.place.formattedAddress,
    placeId: outcome.place.placeId,
  };
}
