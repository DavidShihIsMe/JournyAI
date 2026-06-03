import { NextResponse } from "next/server";
import type { HotelOption } from "@/lib/hotelTypes";

// Places Autocomplete (New) — cheaper than Text Search for typeahead.
// We include lodging-class primary types so suggestions are hotels/hostels/etc.
// Address is taken from the autocomplete `secondaryText` so we avoid a
// separate Place Details fetch (and a separate bill).
// "lodging" is the umbrella category — covers hotels, hostels, B&Bs, resorts,
// motels, inns, etc. Google's autocomplete caps includedPrimaryTypes at 5,
// so we just use the broadest type and let Google rank.
const LODGING_TYPES = ["lodging"];

interface PlacePrediction {
  placeId?: string;
  text?: { text?: string };
  structuredFormat?: {
    mainText?: { text?: string };
    secondaryText?: { text?: string };
  };
}

interface AutocompleteResponse {
  suggestions?: Array<{ placePrediction?: PlacePrediction }>;
  error?: { message?: string; status?: string };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination")?.trim() ?? "";
  const query = searchParams.get("q")?.trim() ?? "";

  if (!destination) {
    return NextResponse.json({ hotels: [] as HotelOption[], source: "empty" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({
      hotels: [] as HotelOption[],
      source: "unavailable",
      message: "Hotel search is unavailable — type your hotel name below.",
    });
  }

  if (!query) {
    return NextResponse.json({ hotels: [] as HotelOption[], source: "google" });
  }

  // Bias the search toward the user's destination by including it in the input.
  // Google's autocomplete handles "<hotel name> <city>" patterns well.
  const input = `${query} ${destination}`;

  let data: AutocompleteResponse;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
      },
      body: JSON.stringify({
        input,
        includedPrimaryTypes: LODGING_TYPES,
      }),
    });
    data = (await res.json()) as AutocompleteResponse;
    if (!res.ok) {
      const blocked =
        data?.error?.status === "PERMISSION_DENIED" ||
        data?.error?.message?.includes("not enabled");
      console.error("Google Places hotel autocomplete error:", res.status, data?.error);
      return NextResponse.json({
        hotels: [] as HotelOption[],
        source: "unavailable",
        message: blocked
          ? "Google Places isn't enabled on your API key — type your hotel name below."
          : `Hotel search unavailable (${res.status}).`,
      });
    }
  } catch (err) {
    console.error("Hotel autocomplete fetch failed:", err);
    return NextResponse.json({
      hotels: [] as HotelOption[],
      source: "unavailable",
      message: "Hotel search unavailable — type your hotel name below.",
    });
  }

  const hotels: HotelOption[] = (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is PlacePrediction => Boolean(p?.placeId))
    .map((p) => {
      const name = p.structuredFormat?.mainText?.text ?? p.text?.text ?? "";
      const address = p.structuredFormat?.secondaryText?.text ?? "";
      return {
        name: name.trim(),
        address: address.trim() || undefined,
        placeId: p.placeId!,
        googleVerified: true,
      };
    })
    .filter((h) => h.name.length > 0)
    .slice(0, 8);

  return NextResponse.json({ hotels, source: "google" });
}
