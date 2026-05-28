import {
  displayTimeOffsetMinutes,
  effectiveTravelMinutes,
  formatMinutesToTime,
  itinerarySlotKey,
  parseTimeToMinutes,
} from "@/lib/itineraryScheduleDisplay";
import type { GeneratedItinerary, GeneratedItineraryDay, ItineraryScheduleRow } from "@/lib/tripTypes";

export const CALENDAR_DAY_START_MINUTES = 6 * 60;
export const CALENDAR_DAY_END_MINUTES = 23 * 60;
export const CALENDAR_PX_PER_MINUTE = 1.25;
export const CALENDAR_TIME_AXIS_WIDTH = 56;
export const CALENDAR_COLUMN_MIN_WIDTH = 128;
export const CALENDAR_SNAP_MINUTES = 15;

export interface CalendarBlockModel {
  slotKey: string;
  dayIndex: number;
  rowIndex: number;
  kind: "activity" | "travel";
  label: string;
  detail?: string;
  mode?: string;
  startMinutes: number;
  durationMinutes: number;
  endMinutes: number;
  hasVenueChoices: boolean;
  travelMinutes?: number;
}

export interface CalendarDayColumn {
  dayNum: number;
  title: string;
  weekdayLabel: string;
  dateLabel: string;
  blocks: CalendarBlockModel[];
}

function defaultActivityDurationMinutes(
  day: GeneratedItineraryDay,
  index: number,
  startMinutes: number,
  venueSelections: Record<string, string>,
  travelOverrides: Record<string, number>
): number {
  const items = day.items;
  for (let j = index + 1; j < items.length; j++) {
    const next = items[j];
    const nextStart = parseTimeToMinutes(next.time);
    if (nextStart == null) continue;
    const nextOffset = displayTimeOffsetMinutes(day, j, venueSelections, travelOverrides);
    const gap = nextStart + nextOffset - startMinutes;
    if (gap > 5) return Math.min(180, Math.max(20, gap));
  }
  return 60;
}

function buildBlockForRow(
  itinerary: GeneratedItinerary,
  day: GeneratedItineraryDay,
  dayIndex: number,
  rowIndex: number,
  venueSelections: Record<string, string>,
  travelOverrides: Record<string, number>
): CalendarBlockModel | null {
  const row = day.items[rowIndex];
  if (!row) return null;
  const base = parseTimeToMinutes(row.time);
  if (base == null) return null;
  const offset = displayTimeOffsetMinutes(day, rowIndex, venueSelections, travelOverrides);
  const startMinutes = base + offset;

  let durationMinutes: number;
  if (row.kind === "travel") {
    durationMinutes = Math.max(
      10,
      effectiveTravelMinutes(day, rowIndex, row, venueSelections, travelOverrides)
    );
  } else {
    durationMinutes = defaultActivityDurationMinutes(
      day,
      rowIndex,
      startMinutes,
      venueSelections,
      travelOverrides
    );
  }

  const endMinutes = startMinutes + durationMinutes;
  const slotKey = itinerarySlotKey(day.day, rowIndex);

  return {
    slotKey,
    dayIndex,
    rowIndex,
    kind: row.kind,
    label: row.text,
    detail: row.detail,
    mode: row.mode,
    startMinutes,
    durationMinutes,
    endMinutes,
    hasVenueChoices: Boolean(row.kind === "activity" && row.venueChoices?.length),
    travelMinutes:
      row.kind === "travel"
        ? effectiveTravelMinutes(day, rowIndex, row, venueSelections, travelOverrides)
        : undefined,
  };
}

/** Push blocks down so they never overlap vertically within a day column. */
function resolveVerticalOverlaps(blocks: CalendarBlockModel[]): CalendarBlockModel[] {
  const sorted = [...blocks].sort((a, b) => a.startMinutes - b.startMinutes);
  let cursor = CALENDAR_DAY_START_MINUTES;
  return sorted.map((b) => {
    let start = b.startMinutes;
    if (start < cursor) start = cursor;
    const duration = b.durationMinutes;
    const end = start + duration;
    cursor = end;
    return { ...b, startMinutes: start, endMinutes: end };
  });
}

export function buildCalendarColumns(
  itinerary: GeneratedItinerary,
  venueSelections: Record<string, string>,
  travelOverrides: Record<string, number>,
  startDateIso?: string
): CalendarDayColumn[] {
  const days = itinerary.days.slice(0, 7);
  return days.map((day, dayIndex) => {
    const blocks: CalendarBlockModel[] = [];
    for (let rowIndex = 0; rowIndex < day.items.length; rowIndex++) {
      const block = buildBlockForRow(
        itinerary,
        day,
        dayIndex,
        rowIndex,
        venueSelections,
        travelOverrides
      );
      if (block) blocks.push(block);
    }

    let weekdayLabel = `Day ${day.day}`;
    let dateLabel = day.title;
    if (startDateIso) {
      const d = new Date(`${startDateIso}T12:00:00`);
      if (!Number.isNaN(d.getTime())) {
        d.setDate(d.getDate() + dayIndex);
        weekdayLabel = d.toLocaleDateString(undefined, { weekday: "short" });
        dateLabel = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      }
    }

    return {
      dayNum: day.day,
      title: day.title,
      weekdayLabel,
      dateLabel,
      blocks: resolveVerticalOverlaps(blocks),
    };
  });
}

export function calendarGridHeightPx(): number {
  return (CALENDAR_DAY_END_MINUTES - CALENDAR_DAY_START_MINUTES) * CALENDAR_PX_PER_MINUTE;
}

export function minutesToTopPx(minutes: number): number {
  return (minutes - CALENDAR_DAY_START_MINUTES) * CALENDAR_PX_PER_MINUTE;
}

export function topPxToMinutes(topPx: number): number {
  const raw = topPx / CALENDAR_PX_PER_MINUTE + CALENDAR_DAY_START_MINUTES;
  const snapped = Math.round(raw / CALENDAR_SNAP_MINUTES) * CALENDAR_SNAP_MINUTES;
  return Math.min(
    CALENDAR_DAY_END_MINUTES - CALENDAR_SNAP_MINUTES,
    Math.max(CALENDAR_DAY_START_MINUTES, snapped)
  );
}

export function blockHeightPx(durationMinutes: number): number {
  return Math.max(22, durationMinutes * CALENDAR_PX_PER_MINUTE);
}

export function formatHourLabel(totalMinutes: number): string {
  return formatMinutesToTime(totalMinutes).replace(/:\d{2}\s/, " ");
}

export function hourTicks(): number[] {
  const ticks: number[] = [];
  for (let m = CALENDAR_DAY_START_MINUTES; m <= CALENDAR_DAY_END_MINUTES; m += 60) {
    ticks.push(m);
  }
  return ticks;
}

export function setBlockStartTimeOnly(
  itinerary: GeneratedItinerary,
  slotKey: string,
  targetStartMinutes: number,
  venueSelections: Record<string, string>,
  travelOverrides: Record<string, number>
): GeneratedItinerary {
  const [dayStr, indexStr] = slotKey.split("-");
  const dayNum = Number(dayStr);
  const rowIndex = Number(indexStr);
  const dayIdx = itinerary.days.findIndex((d) => d.day === dayNum);
  if (dayIdx < 0 || !Number.isFinite(rowIndex)) return itinerary;

  const day = itinerary.days[dayIdx];
  const row = day.items[rowIndex];
  if (!row) return itinerary;

  const offset = displayTimeOffsetMinutes(day, rowIndex, venueSelections, travelOverrides);
  const newTime = formatMinutesToTime(targetStartMinutes - offset);

  const days = itinerary.days.map((d, i) => {
    if (i !== dayIdx) return d;
    return {
      ...d,
      items: d.items.map((item, j) => (j === rowIndex ? { ...item, time: newTime } : item)),
    };
  });

  return { ...itinerary, days };
}

export function updateTravelRow(
  days: GeneratedItineraryDay[],
  dayNum: number,
  rowIndex: number,
  patch: Partial<ItineraryScheduleRow>
): GeneratedItineraryDay[] {
  return days.map((d) => {
    if (d.day !== dayNum) return d;
    return {
      ...d,
      items: d.items.map((item, i) => (i === rowIndex ? { ...item, ...patch } : item)),
    };
  });
}
