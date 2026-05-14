/**
 * Google Maps Directions API (legacy) — walking duration between two free-text places.
 * Enable "Directions API" for the key. Server-side only.
 */
const DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json";

export async function fetchWalkingMinutesBetween(
  origin: string,
  destination: string,
  apiKey: string
): Promise<number | null> {
  const o = origin.trim();
  const d = destination.trim();
  if (!o || !d || !apiKey) return null;

  const url = new URL(DIRECTIONS_URL);
  url.searchParams.set("origin", o);
  url.searchParams.set("destination", d);
  url.searchParams.set("mode", "walking");
  url.searchParams.set("key", apiKey);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status?: string;
      routes?: Array<{ legs?: Array<{ duration?: { value?: number } }> }>;
    };
    if (data.status !== "OK" || !data.routes?.[0]?.legs?.[0]?.duration?.value) return null;
    const sec = data.routes[0].legs[0].duration.value;
    if (typeof sec !== "number" || !Number.isFinite(sec) || sec < 0) return null;
    return Math.max(1, Math.round(sec / 60));
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
