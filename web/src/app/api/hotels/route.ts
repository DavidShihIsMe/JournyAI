import { NextResponse } from "next/server";
import { filterHotelsByQuery } from "@/lib/demoHotels";
import type { HotelOption } from "@/lib/hotelTypes";
import { searchHotelsByQuery } from "@/lib/googleMaps/searchHotels";

function fallbackOptions(destination: string, query: string): HotelOption[] {
  return filterHotelsByQuery(destination, query).map((name) => ({ name }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination")?.trim() ?? "";
  const query = searchParams.get("q")?.trim() ?? "";

  if (!destination) {
    return NextResponse.json({ hotels: [] as HotelOption[], source: "empty" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  const fallback = fallbackOptions(destination, query);

  if (!apiKey) {
    return NextResponse.json({
      hotels: fallback,
      source: "fallback",
      message: "GOOGLE_MAPS_API_KEY not set — showing built-in hotel suggestions.",
    });
  }

  const { hotels, error } = await searchHotelsByQuery(destination, query, apiKey);

  if (hotels.length > 0) {
    const options: HotelOption[] = hotels.map((h) => ({
      name: h.name,
      address: h.address,
      placeId: h.placeId,
      googleVerified: true,
    }));
    return NextResponse.json({ hotels: options, source: "google" });
  }

  const placesBlocked =
    error?.includes("PERMISSION_DENIED") ||
    error?.includes("SERVICE_BLOCKED") ||
    error?.includes("not enabled") ||
    error?.includes("blocked");

  return NextResponse.json({
    hotels: fallback,
    source: "fallback",
    message: placesBlocked
      ? "Google Places isn’t enabled on your API key yet — showing built-in hotels for your destination. Enable Places API (New) in Google Cloud for live search as you type."
      : fallback.length
        ? "Showing built-in hotel suggestions for your destination."
        : (error ?? "No matches — try another spelling or use manual entry below."),
  });
}
