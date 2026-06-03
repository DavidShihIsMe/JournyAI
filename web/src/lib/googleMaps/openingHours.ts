export interface GoogleOpeningPeriod {
  open?: { day?: number; hour?: number; minute?: number };
  close?: { day?: number; hour?: number; minute?: number };
}

export interface GoogleRegularHours {
  periods?: GoogleOpeningPeriod[];
  weekdayDescriptions?: string[];
  openNow?: boolean;
}

function toWeekMinutes(day: number, hour: number, minute: number): number {
  const d = ((day % 7) + 7) % 7;
  return d * 24 * 60 + hour * 60 + minute;
}

/**
 * Returns whether the place is open at `when` per regularOpeningHours.periods,
 * or null when hours are unknown.
 *
 * Includes a ±toleranceMinutes window to absorb timezone skew between the
 * server's local time (used to build `when`) and the destination's local time —
 * cheaper than per-place tz lookups and good enough for hours-aware planning.
 */
export function isOpenAtScheduledTime(
  regularOpeningHours: GoogleRegularHours | undefined,
  when: Date,
  toleranceMinutes = 60
): boolean | null {
  const periods = regularOpeningHours?.periods;
  if (!periods?.length) return null;

  const day = when.getDay();
  const target = toWeekMinutes(day, when.getHours(), when.getMinutes());
  const tol = Math.max(0, toleranceMinutes);

  for (const period of periods) {
    const o = period.open;
    const c = period.close;
    if (o?.day == null || o.hour == null || c?.day == null || c.hour == null) continue;

    let openM = toWeekMinutes(o.day, o.hour, o.minute ?? 0);
    let closeM = toWeekMinutes(c.day, c.hour, c.minute ?? 0);
    if (closeM <= openM) closeM += 7 * 24 * 60;

    let check = target;
    if (check < openM - 2 * 24 * 60) check += 7 * 24 * 60;
    if (check >= openM - tol && check < closeM + tol) return true;
  }

  return false;
}

export function summarizeOpeningHours(regularOpeningHours: GoogleRegularHours | undefined): string | undefined {
  const lines = regularOpeningHours?.weekdayDescriptions;
  if (lines?.length) {
    return lines.slice(0, 2).join(" · ");
  }
  return undefined;
}
