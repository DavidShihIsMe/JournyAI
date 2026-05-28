import type { MustHaveCard } from "@/lib/tripTypes";
import type {
  GeneratedItinerary,
  GeneratedItineraryDay,
  ItineraryScheduleRow,
  ItineraryVenueChoice,
} from "@/lib/tripTypes";

/** Max minutes for any between-stop leg unless an exception applies. */
export const MAX_TRAVEL_MINUTES = 60;

export interface TravelTimePolicyContext {
  interests: string;
  mustHaves: MustHaveCard[];
  tripPurpose?: string;
}

export interface TravelTimePolicyResult {
  longTravelWarnings: number;
  longTravelExceptions: number;
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function tokensFromList(text: string): string[] {
  return text
    .split(/[,;|/]+/)
    .map((t) => norm(t))
    .filter((t) => t.length >= 3);
}

function textBlob(parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function overlaps(haystack: string, needle: string): boolean {
  const n = norm(needle);
  if (n.length < 3) return false;
  if (haystack.includes(n)) return true;
  const words = n.split(/\s+/).filter((w) => w.length >= 4);
  return words.some((w) => haystack.includes(w));
}

/** Day-1 airport/station/intercity transfers may exceed the cap without being a "spot match". */
export function isLogisticsTravelLeg(row: ItineraryScheduleRow, dayNum: number): boolean {
  if (row.kind !== "travel" || dayNum !== 1) return false;
  const t = textBlob([row.text, row.detail]);
  return (
    /\bairport\b/.test(t) ||
    /\barrival\b/.test(t) ||
    /\bdeparture\b/.test(t) ||
    /\btrain station\b/.test(t) ||
    /\bintercity\b/.test(t) ||
    /\bfrom (the )?station\b/.test(t) ||
    /\btransfer from\b/.test(t)
  );
}

/** True when the destination activity clearly matches must-haves, interests, or trip purpose. */
export function isStrongTravelMatch(
  activity: ItineraryScheduleRow | undefined,
  ctx: TravelTimePolicyContext
): boolean {
  if (!activity || activity.kind !== "activity") return false;

  const activityText = textBlob([activity.text, activity.detail]);
  const purpose = ctx.tripPurpose ? norm(ctx.tripPurpose) : "";

  for (const mh of ctx.mustHaves) {
    if (mh.where && overlaps(activityText, mh.where)) return true;
    if (mh.activity && overlaps(activityText, mh.activity)) return true;
    if (mh.details && overlaps(activityText, mh.details)) return true;
    const whereNorm = mh.where ? norm(mh.where) : "";
    if (
      whereNorm &&
      activity.venueChoices?.some(
        (c) => overlaps(textBlob([c.name, c.area, c.oneLine]), mh.where)
      )
    ) {
      return true;
    }
  }

  for (const token of tokensFromList(ctx.interests)) {
    if (overlaps(activityText, token)) return true;
    if (
      activity.venueChoices?.some((c) =>
        overlaps(textBlob([c.name, c.area, c.oneLine]), token)
      )
    ) {
      return true;
    }
  }

  if (purpose && purpose !== "vacation" && overlaps(activityText, purpose)) return true;

  if (/\bexception\b|\bmust[- ]have\b|\bworth the (trip|ride|travel)\b/i.test(activityText)) {
    return true;
  }
  if (activity.detail && /\bexception\b/i.test(activity.detail)) return true;

  return false;
}

function nextActivityAfter(items: ItineraryScheduleRow[], travelIndex: number): ItineraryScheduleRow | undefined {
  for (let j = travelIndex + 1; j < items.length; j++) {
    if (items[j].kind === "activity") return items[j];
  }
  return undefined;
}

function annotateLongLeg(
  row: ItineraryScheduleRow,
  minutes: number,
  allowed: boolean,
  reason: string | undefined,
  result: TravelTimePolicyResult
): void {
  if (allowed) {
    row.longTravelAllowed = true;
    row.longTravelReason = reason;
    row.travelTimeWarning = undefined;
    result.longTravelExceptions++;
    return;
  }
  row.longTravelAllowed = false;
  row.longTravelReason = undefined;
  row.travelTimeWarning = `About ${minutes} min — over the 1-hour cap. Pick a closer stop unless this is a must-have for you.`;
  result.longTravelWarnings++;
}

function checkVenueWalkMinutes(
  activity: ItineraryScheduleRow,
  ctx: TravelTimePolicyContext,
  result: TravelTimePolicyResult
): void {
  if (!activity.venueChoices?.length) return;
  const strong = isStrongTravelMatch(activity, ctx);

  for (const choice of activity.venueChoices) {
    const from = choice.walkFromPreviousMinutes;
    const to = choice.walkToFollowingStopMinutes;
    if (from != null && from > MAX_TRAVEL_MINUTES) {
      if (strong) {
        choice.longWalkAllowed = true;
        choice.longWalkReason = "Strong match for your trip — longer ride allowed.";
      } else {
        choice.longWalkWarning = `~${from} min from prior stop (over 1 hour).`;
        result.longTravelWarnings++;
      }
    }
    if (to != null && to > MAX_TRAVEL_MINUTES) {
      if (strong) {
        choice.longWalkAllowed = true;
        choice.longWalkReason = choice.longWalkReason ?? "Strong match for your trip — longer ride allowed.";
      } else if (!choice.longWalkWarning) {
        choice.longWalkWarning = `~${to} min to next stop (over 1 hour).`;
        result.longTravelWarnings++;
      }
    }
  }
}

/**
 * After AI + optional Google verification: flag legs over 60 minutes unless
 * logistics (Day 1 transfer) or the destination is a strong traveler match.
 */
export function applyTravelTimeCapPolicy(
  itinerary: GeneratedItinerary,
  ctx: TravelTimePolicyContext
): TravelTimePolicyResult {
  const result: TravelTimePolicyResult = {
    longTravelWarnings: 0,
    longTravelExceptions: 0,
  };

  for (const day of itinerary.days) {
    const items = day.items;
    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      if (row.kind === "activity") {
        checkVenueWalkMinutes(row, ctx, result);
        continue;
      }
      if (row.kind !== "travel") continue;

      const minutes = row.durationMinutes;
      if (minutes == null || !Number.isFinite(minutes) || minutes <= MAX_TRAVEL_MINUTES) {
        row.longTravelAllowed = undefined;
        row.longTravelReason = undefined;
        row.travelTimeWarning = undefined;
        continue;
      }

      const dest = nextActivityAfter(items, i);
      if (isLogisticsTravelLeg(row, day.day)) {
        annotateLongLeg(
          row,
          minutes,
          true,
          "Day 1 arrival or intercity transfer — longer leg allowed.",
          result
        );
        continue;
      }

      if (isStrongTravelMatch(dest, ctx)) {
        const label = dest?.text?.trim().slice(0, 80) || "your next stop";
        annotateLongLeg(
          row,
          minutes,
          true,
          `Strong match for your trip (${label}) — longer travel allowed.`,
          result
        );
        continue;
      }

      annotateLongLeg(row, minutes, false, undefined, result);
    }
  }

  return result;
}

export function travelTimeCapPromptRules(): string {
  return `**One-hour travel cap (every mode — walk, transit, taxi, car, train, ferry, bike):**
- Every **travel** row **durationMinutes** and every **venueChoices** **walkFromPreviousMinutes** / **walkToFollowingStopMinutes** must be **≤ ${MAX_TRAVEL_MINUTES}** unless an exception below applies.
- **Default:** Cluster stops geographically. Do not plan routine meals, bars, museums, or shopping that require more than 1 hour of travel one way.
- **Allowed exceptions only when:**
  (1) **Day 1 logistics** — airport, station, or intercity **arrival/departure** transfer (say so in **detail**), or
  (2) **Strong traveler match** — the **following activity** is a clear must-have, matches their **must-haves** list, or directly serves stated **interests** / **trip purpose** (explain in the travel row **detail**, e.g. "Exception: must-have omakase in Ginza").
- If you use an exception, the travel **detail** must briefly say why the longer leg is worth it. Never use >1 hour travel for a generic filler stop.`;
}
