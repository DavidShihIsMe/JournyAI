export interface MustHaveCard {
  timeBlock: string;
  activity: string;
  where: string;
  details: string;
}

/** One of three concrete venue picks for an activity row (cafés, retail, nightlife, etc.). */
export interface ItineraryVenueChoice {
  id: string;
  name: string;
  area?: string;
  /** Estimated walk from the previous scheduled stop to this venue (minutes). */
  walkFromPreviousMinutes?: number;
  /** When the user picks this venue, use this for the next row if it is travel (walk to following stop). */
  walkToFollowingStopMinutes?: number;
  /** Typical rating scale 1–5 (itinerary estimate for comparison). */
  rating?: number;
  /** Approximate review count (itinerary estimate). */
  ratingCountApprox?: number;
  /** Official site when known; otherwise omit or null (Maps search is still offered in UI). */
  websiteUrl?: string | null;
  oneLine?: string;
}

/** One row in the day schedule: either a stop or a move between stops. */
export interface ItineraryScheduleRow {
  kind: "activity" | "travel";
  /** When this block starts (12h with AM/PM), e.g. "9:15 AM". */
  time: string;
  /** Activity line or travel summary. */
  text: string;
  detail?: string;
  /** Travel only: typical duration of this leg in minutes. */
  durationMinutes?: number;
  /** Travel only: walk | public_transit | taxi | car | bike | train | ferry | mixed etc. */
  mode?: string;
  /** Activity only: exactly three named venue alternatives when present. */
  venueChoices?: ItineraryVenueChoice[];
}

export interface GeneratedItineraryDay {
  day: number;
  title: string;
  items: ItineraryScheduleRow[];
}

export interface GeneratedItinerary {
  title: string;
  summary: string;
  destination: string;
  travelDates: string;
  days: GeneratedItineraryDay[];
  /** Present when the itinerary API attaches generation metadata. */
  meta?: {
    walkTimesVerifiedWithGoogle?: boolean;
    googleWalkAttempts?: number;
    googleWalkUpdates?: number;
  };
}

/**
 * Coerce API/localStorage payloads into schedule rows (supports legacy string[] items).
 */
export function normalizeDayItems(items: unknown): ItineraryScheduleRow[] {
  if (!Array.isArray(items)) return [];
  const rows: ItineraryScheduleRow[] = [];
  for (const raw of items) {
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      const legacyTime = trimmed.match(
        /^(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\s*[–—\-·|]\s*([\s\S]+)$/
      );
      if (legacyTime) {
        rows.push({
          kind: "activity",
          time: legacyTime[1].replace(/\s*(am|pm)$/i, (m) => m.toUpperCase()),
          text: legacyTime[2].trim(),
        });
      } else {
        rows.push({ kind: "activity", time: "", text: trimmed });
      }
      continue;
    }
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const kind = o.kind === "travel" ? "travel" : "activity";
    const time = typeof o.time === "string" ? o.time : "";
    const text =
      typeof o.text === "string"
        ? o.text
        : typeof o.activity === "string"
          ? o.activity
          : typeof o.label === "string"
            ? o.label
            : "";
    const detail = typeof o.detail === "string" ? o.detail : undefined;
    const mode = typeof o.mode === "string" ? o.mode : undefined;
    let durationMinutes: number | undefined;
    if (typeof o.durationMinutes === "number" && Number.isFinite(o.durationMinutes)) {
      durationMinutes = Math.round(o.durationMinutes);
    } else if (typeof o.durationMinutes === "string" && o.durationMinutes.trim()) {
      const n = Number(o.durationMinutes);
      if (Number.isFinite(n)) durationMinutes = Math.round(n);
    }
    const venueChoices = normalizeVenueChoices(o.venueChoices);
    const hasVenues = Boolean(venueChoices?.length);
    if (!text.trim() && !hasVenues) continue;
    rows.push({
      kind,
      time,
      text: text.trim() || (hasVenues ? "Choose a spot" : ""),
      detail,
      mode,
      durationMinutes,
      venueChoices,
    });
  }
  return rows;
}

function numOrUndef(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function normalizeVenueChoices(raw: unknown): ItineraryVenueChoice[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const out: ItineraryVenueChoice[] = [];
  for (const item of raw.slice(0, 3)) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!name) continue;
    const idRaw = typeof o.id === "string" ? o.id.trim() : "";
    const id = idRaw || `pick${out.length + 1}`;
    let websiteUrl: string | null | undefined;
    if (o.websiteUrl === null) websiteUrl = null;
    else if (typeof o.websiteUrl === "string") {
      const u = o.websiteUrl.trim();
      websiteUrl = /^https?:\/\//i.test(u) ? u : null;
    }
    out.push({
      id,
      name,
      area: typeof o.area === "string" ? o.area.trim() : undefined,
      walkFromPreviousMinutes: numOrUndef(o.walkFromPreviousMinutes),
      walkToFollowingStopMinutes: numOrUndef(o.walkToFollowingStopMinutes),
      rating: numOrUndef(o.rating),
      ratingCountApprox: numOrUndef(o.ratingCountApprox),
      websiteUrl: websiteUrl === undefined ? undefined : websiteUrl,
      oneLine: typeof o.oneLine === "string" ? o.oneLine.trim() : undefined,
    });
    if (out.length >= 3) break;
  }
  return out.length ? out : undefined;
}

export function normalizeItineraryDays(
  days: unknown
): GeneratedItinerary["days"] {
  if (!Array.isArray(days)) return [];
  return days.map((d, idx) => {
    if (!d || typeof d !== "object") {
      return { day: idx + 1, title: "", items: [] };
    }
    const o = d as Record<string, unknown>;
    const day = typeof o.day === "number" ? o.day : idx + 1;
    const title = typeof o.title === "string" ? o.title : "";
    return {
      day,
      title,
      items: normalizeDayItems(o.items),
    };
  });
}

export interface SavedTrip extends GeneratedItinerary {
  id: string;
  savedAt: string;
  /** YYYY-MM-DD from plan form — used for past vs planned */
  endDateIso?: string;
  startDateIso?: string;
}

export function tripIsPast(endDateIso?: string): boolean {
  if (!endDateIso) return false;
  const end = new Date(`${endDateIso}T23:59:59`);
  return end < new Date();
}
