/** Map itinerary day number + trip start date + clock string to a Date for hours checks. */
export function parseActivityDateTime(
  startDateIso: string,
  dayNum: number,
  timeStr: string
): Date | null {
  const start = startDateIso.trim();
  if (!start || !timeStr.trim()) return null;

  const base = new Date(`${start}T12:00:00`);
  if (Number.isNaN(base.getTime())) return null;
  base.setDate(base.getDate() + Math.max(0, dayNum - 1));

  const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;

  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const meridiem = m[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  base.setHours(hour, minute, 0, 0);
  return base;
}
