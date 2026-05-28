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

function parsePlacesHotelResults(data: SearchResponse, maxResults: number): GoogleHotelResult[] {
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
  return hotels;
}

async function fetchHotelsFromPlaces(
  textQuery: string,
  apiKey: string,
  maxResults: number
): Promise<{ hotels: GoogleHotelResult[]; error?: string }> {
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
    let hotels = parsePlacesHotelResults(data, maxResults);

    if (!res.ok || hotels.length === 0) {
      const retry = await fetch(SEARCH_TEXT_URL, {
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
        }),
        signal: controller.signal,
      });
      const retryData = (await retry.json()) as SearchResponse & { error?: { message?: string } };
      if (retry.ok) {
        hotels = parsePlacesHotelResults(retryData, maxResults);
      } else if (!res.ok) {
        const msg = retryData.error?.message ?? data.error?.message ?? `Places API HTTP ${res.status}`;
        return { hotels: [], error: msg };
      }
    }

    if (!res.ok && hotels.length === 0) {
      const msg = data.error?.message ?? `Places API HTTP ${res.status}`;
      return { hotels: [], error: msg };
    }

    return { hotels };
  } catch {
    return { hotels: [], error: "Could not reach Google Places API." };
  } finally {
    clearTimeout(t);
  }
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
  return fetchHotelsFromPlaces(`hotels in ${dest}`, apiKey, maxResults);
}

/**
 * Typeahead: match hotels as the user types (name + destination).
 */
export async function searchHotelsByQuery(
  destination: string,
  query: string,
  apiKey: string,
  maxResults = 8
): Promise<{ hotels: GoogleHotelResult[]; error?: string }> {
  const dest = destination.trim();
  const q = query.trim();
  if (!dest || !apiKey) {
    return { hotels: [], error: "Missing destination or API key." };
  }
  if (!q) {
    return searchHotelsInDestination(dest, apiKey, maxResults);
  }
  return fetchHotelsFromPlaces(`${q} hotel ${dest}`, apiKey, maxResults);
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
