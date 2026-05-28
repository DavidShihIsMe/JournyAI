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
  /** Set when Places API matched this venue during enrichment. */
  googlePlaceId?: string;
  /** Hours, rating, and open/closed came from Google Places. */
  googleVerified?: boolean;
  /** Walk minutes on this card were updated from Google Routes. */
  googleWalkVerified?: boolean;
  /** Google Places business status when known. */
  businessStatus?: "OPERATIONAL" | "CLOSED_TEMPORARILY" | "CLOSED_PERMANENTLY";
  /** Whether Google regular hours suggest the venue is open at the scheduled activity time. */
  openAtScheduledTime?: boolean;
  /** Short hours line from Google (e.g. weekday descriptions). */
  hoursSummary?: string;
  /** Warning when closed or hours could not be confirmed for the scheduled time. */
  hoursNote?: string;
  /** Walk leg to this venue exceeds 60 min but matches trip strongly. */
  longWalkAllowed?: boolean;
  longWalkReason?: string;
  /** Walk leg exceeds 60 min without a strong-match exception. */
  longWalkWarning?: string;
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
  /** Travel only: leg exceeds 60 min but is allowed (logistics or strong match). */
  longTravelAllowed?: boolean;
  longTravelReason?: string;
  /** Travel only: leg exceeds 60 min without an allowed exception. */
  travelTimeWarning?: string;
  /** Travel only: durationMinutes came from Google Routes. */
  googleRouteVerified?: boolean;
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
    /** Routes + Places enrichment summary (when GOOGLE_MAPS_API_KEY is set). */
    googleEnrichment?: {
      routeAttempts: number;
      routeUpdates: number;
      placesLookups: number;
      placesMatched: number;
      closedAtTimeWarnings: number;
      usedLegacyDirectionsFallback?: number;
      longTravelWarnings?: number;
      longTravelExceptions?: number;
      /** Set when Places lookups ran but none succeeded (often API not enabled). */
      placesApiError?: string;
    };
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
      longTravelAllowed: o.longTravelAllowed === true,
      longTravelReason: typeof o.longTravelReason === "string" ? o.longTravelReason.trim() : undefined,
      travelTimeWarning: typeof o.travelTimeWarning === "string" ? o.travelTimeWarning.trim() : undefined,
      googleRouteVerified: o.googleRouteVerified === true,
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
    const businessStatus = o.businessStatus;
    const validStatus =
      businessStatus === "OPERATIONAL" ||
      businessStatus === "CLOSED_TEMPORARILY" ||
      businessStatus === "CLOSED_PERMANENTLY"
        ? businessStatus
        : undefined;
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
      googlePlaceId: typeof o.googlePlaceId === "string" ? o.googlePlaceId : undefined,
      googleVerified: o.googleVerified === true,
      googleWalkVerified: o.googleWalkVerified === true,
      businessStatus: validStatus,
      openAtScheduledTime:
        o.openAtScheduledTime === true ? true : o.openAtScheduledTime === false ? false : undefined,
      hoursSummary: typeof o.hoursSummary === "string" ? o.hoursSummary.trim() : undefined,
      hoursNote: typeof o.hoursNote === "string" ? o.hoursNote.trim() : undefined,
      longWalkAllowed: o.longWalkAllowed === true,
      longWalkReason: typeof o.longWalkReason === "string" ? o.longWalkReason.trim() : undefined,
      longWalkWarning: typeof o.longWalkWarning === "string" ? o.longWalkWarning.trim() : undefined,
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
