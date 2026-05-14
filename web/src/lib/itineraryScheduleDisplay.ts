import type { GeneratedItineraryDay, ItineraryScheduleRow, ItineraryVenueChoice } from "@/lib/tripTypes";

export function itinerarySlotKey(day: number, index: number): string {
  return `${day}-${index}`;
}

export function pickVenueChoice(
  activityRow: ItineraryScheduleRow,
  activitySlotKey: string,
  venueSelections: Record<string, string>
): ItineraryVenueChoice | undefined {
  const choices = activityRow.venueChoices;
  if (!choices?.length) return undefined;
  const sel = venueSelections[activitySlotKey];
  if (sel) return choices.find((c) => c.id === sel) ?? choices[0];
  return choices[0];
}

function r(n: number | undefined | null): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return 0;
  return Math.round(n);
}

/**
 * Effective duration (minutes) for a travel row, including venue-card inbound/outbound logic.
 */
export function effectiveTravelMinutes(
  day: GeneratedItineraryDay,
  travelIndex: number,
  row: ItineraryScheduleRow,
  venueSelections: Record<string, string>,
  travelOverrides: Record<string, number>
): number {
  const travelKey = itinerarySlotKey(day.day, travelIndex);
  if (travelOverrides[travelKey] != null && Number.isFinite(travelOverrides[travelKey])) {
    return r(travelOverrides[travelKey]);
  }
  const items = day.items;
  const prevItem = travelIndex > 0 ? items[travelIndex - 1] : undefined;
  if (prevItem?.kind === "activity" && prevItem.venueChoices?.length) {
    const ch = pickVenueChoice(prevItem, itinerarySlotKey(day.day, travelIndex - 1), venueSelections);
    const w = ch?.walkToFollowingStopMinutes;
    if (typeof w === "number" && Number.isFinite(w)) return r(w);
  }
  const nextItem = items[travelIndex + 1];
  if (nextItem?.kind === "activity" && nextItem.venueChoices?.length) {
    const ch = pickVenueChoice(nextItem, itinerarySlotKey(day.day, travelIndex + 1), venueSelections);
    const w = ch?.walkFromPreviousMinutes;
    if (typeof w === "number" && Number.isFinite(w)) return r(w);
  }
  if (typeof row.durationMinutes === "number" && Number.isFinite(row.durationMinutes)) {
    return r(row.durationMinutes);
  }
  return 0;
}

function legDeltasForVenueAt(
  day: GeneratedItineraryDay,
  k: number,
  venueSelections: Record<string, string>,
  travelOverrides: Record<string, number>
): { dIn: number; dOut: number } {
  const items = day.items;
  const row = items[k];
  if (row.kind !== "activity" || !row.venueChoices?.length) return { dIn: 0, dOut: 0 };
  const slot = itinerarySlotKey(day.day, k);
  const first = row.venueChoices[0];
  const choice = pickVenueChoice(row, slot, venueSelections);
  if (!choice) return { dIn: 0, dOut: 0 };

  const travelBefore = k > 0 && items[k - 1].kind === "travel" ? items[k - 1] : null;
  const travelAfter = k + 1 < items.length && items[k + 1].kind === "travel" ? items[k + 1] : null;

  const baseIn =
    first.walkFromPreviousMinutes != null && Number.isFinite(first.walkFromPreviousMinutes)
      ? r(first.walkFromPreviousMinutes)
      : r(travelBefore?.durationMinutes);
  const beforeKey = travelBefore ? itinerarySlotKey(day.day, k - 1) : "";
  const rawNewIn =
    travelBefore && travelOverrides[beforeKey] != null
      ? travelOverrides[beforeKey]!
      : choice.walkFromPreviousMinutes ?? first.walkFromPreviousMinutes ?? travelBefore?.durationMinutes;
  const newIn = r(rawNewIn);

  const baseOut =
    first.walkToFollowingStopMinutes != null && Number.isFinite(first.walkToFollowingStopMinutes)
      ? r(first.walkToFollowingStopMinutes)
      : r(travelAfter?.durationMinutes);
  const afterKey = travelAfter ? itinerarySlotKey(day.day, k + 1) : "";
  const rawNewOut =
    travelAfter && travelOverrides[afterKey] != null
      ? travelOverrides[afterKey]!
      : choice.walkToFollowingStopMinutes ?? first.walkToFollowingStopMinutes ?? travelAfter?.durationMinutes;
  const newOut = r(rawNewOut);

  return { dIn: newIn - baseIn, dOut: newOut - baseOut };
}

/**
 * Minutes to shift this row's displayed clock vs the model's `time` string,
 * from venue leg length changes (inbound + outbound per choosable block).
 */
export function displayTimeOffsetMinutes(
  day: GeneratedItineraryDay,
  rowIndex: number,
  venueSelections: Record<string, string>,
  travelOverrides: Record<string, number>
): number {
  let offset = 0;
  for (let k = 0; k < day.items.length; k++) {
    if (day.items[k].kind !== "activity" || !day.items[k].venueChoices?.length) continue;
    const { dIn, dOut } = legDeltasForVenueAt(day, k, venueSelections, travelOverrides);
    if (dIn === 0 && dOut === 0) continue;
    if (rowIndex < k) continue;
    if (rowIndex === k) {
      offset += dIn;
      continue;
    }
    if (rowIndex === k + 1 && day.items[k + 1]?.kind === "travel") {
      offset += dIn;
      continue;
    }
    if (rowIndex > k + 1) offset += dIn + dOut;
  }
  return offset;
}

const TIME_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)/;

export function parseTimeToMinutes(input: string): number | null {
  const t = input.trim();
  const m = t.match(TIME_RE);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3].toUpperCase();
  if (!Number.isFinite(h) || !Number.isFinite(min) || min < 0 || min > 59) return null;
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

export function formatMinutesToTime(totalMinutes: number): string {
  let m = Math.round(totalMinutes) % (24 * 60);
  if (m < 0) m += 24 * 60;
  let h = Math.floor(m / 60);
  const min = m % 60;
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ap}`;
}

export function formatAdjustedClockTime(timeStr: string, offsetMinutes: number): string {
  const trimmed = timeStr.trim();
  if (!trimmed) return "—";
  const base = parseTimeToMinutes(trimmed);
  if (base == null) return trimmed;
  return formatMinutesToTime(base + offsetMinutes);
}
