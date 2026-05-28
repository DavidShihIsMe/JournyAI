import { parseGoogleDurationSeconds } from "@/lib/googleMaps/parseDuration";

const COMPUTE_ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

export type GoogleRouteTravelMode = "WALK" | "DRIVE" | "TRANSIT" | "BICYCLE";

export function itineraryModeToGoogleRoute(mode?: string): GoogleRouteTravelMode {
  const m = (mode ?? "walk").toLowerCase().replaceAll("_", " ");
  if (m === "walk" || m === "walking") return "WALK";
  if (m === "bike" || m === "bicycle" || m === "cycling") return "BICYCLE";
  if (
    m === "public transit" ||
    m === "transit" ||
    m === "train" ||
    m === "bus" ||
    m === "ferry" ||
    m === "subway" ||
    m === "tram" ||
    m === "metro"
  ) {
    return "TRANSIT";
  }
  if (m === "car" || m === "drive" || m === "driving" || m === "taxi" || m === "rideshare" || m === "mixed") {
    return "DRIVE";
  }
  return "WALK";
}

export async function fetchRouteMinutesBetween(
  origin: string,
  destination: string,
  apiKey: string,
  options?: {
    travelMode?: GoogleRouteTravelMode;
    departureTime?: Date;
  }
): Promise<number | null> {
  const o = origin.trim();
  const d = destination.trim();
  if (!o || !d || !apiKey) return null;

  const travelMode = options?.travelMode ?? "WALK";
  const body: Record<string, unknown> = {
    origin: { address: o },
    destination: { address: d },
    travelMode,
    computeAlternativeRoutes: false,
  };

  if (options?.departureTime && !Number.isNaN(options.departureTime.getTime())) {
    body.departureTime = options.departureTime.toISOString();
  }

  if (travelMode === "DRIVE") {
    body.routingPreference = "TRAFFIC_AWARE";
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 14_000);
  try {
    const res = await fetch(COMPUTE_ROUTES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.staticDuration",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      routes?: Array<{ duration?: string; staticDuration?: string }>;
    };
    const route = data.routes?.[0];
    if (!route) return null;
    return (
      parseGoogleDurationSeconds(route.duration) ??
      parseGoogleDurationSeconds(route.staticDuration)
    );
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
