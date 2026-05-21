import { NextResponse } from "next/server";
import { hotelsForDestination } from "@/lib/demoHotels";
import type { HotelOption } from "@/lib/hotelTypes";
import { searchHotelsInDestination } from "@/lib/googleMaps/searchHotels";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination")?.trim() ?? "";

  if (!destination) {
    return NextResponse.json({ hotels: [] as HotelOption[], source: "empty" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    const fallback = hotelsForDestination(destination).map((name) => ({ name }));
    return NextResponse.json({
      hotels: fallback,
      source: "fallback",
      message: "GOOGLE_MAPS_API_KEY not set — using built-in hotel suggestions.",
    });
  }

  const { hotels, error } = await searchHotelsInDestination(destination, apiKey);

  if (hotels.length > 0) {
    const options: HotelOption[] = hotels.map((h) => ({
      name: h.name,
      address: h.address,
      placeId: h.placeId,
      googleVerified: true,
    }));
    return NextResponse.json({ hotels: options, source: "google" });
  }

  const fallback = hotelsForDestination(destination).map((name) => ({ name }));
  return NextResponse.json({
    hotels: fallback,
    source: "fallback",
    message:
      error ??
      "Google returned no hotels for this destination — using built-in suggestions. Enable Places API (New) for live names.",
  });
}
