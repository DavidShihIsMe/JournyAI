import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get("flightNumber")?.toUpperCase().trim();
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!flightNumber || !date) return NextResponse.json({ found: false });

  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) return NextResponse.json({ found: false, error: "no_key" });

  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${encodeURIComponent(flightNumber)}&flight_date=${encodeURIComponent(date)}`;

  let data: unknown;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return NextResponse.json({ found: false });
    data = await res.json();
  } catch {
    return NextResponse.json({ found: false });
  }

  const flight = (data as { data?: unknown[] })?.data?.[0] as Record<string, Record<string, string>> | undefined;
  if (!flight) return NextResponse.json({ found: false });

  return NextResponse.json({
    found: true,
    origin: flight.departure?.iata ?? "",
    destination: flight.arrival?.iata ?? "",
    departureScheduled: flight.departure?.scheduled ?? "",
    arrivalScheduled: flight.arrival?.scheduled ?? "",
    airline: flight.airline?.name ?? "",
  });
}
