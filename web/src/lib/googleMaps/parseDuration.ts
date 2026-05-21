/** Parse Google Routes duration strings like "1234s" into whole minutes. */
export function parseGoogleDurationSeconds(value: string | undefined): number | null {
  if (!value || typeof value !== "string") return null;
  const m = value.match(/^(\d+(?:\.\d+)?)s$/);
  if (!m) return null;
  const sec = Number(m[1]);
  if (!Number.isFinite(sec) || sec < 0) return null;
  return Math.max(1, Math.round(sec / 60));
}
