function stripAt(s: string): string {
  return s.replace(/^@+/, "").trim();
}

export function displayNameToInitials(raw: string): string {
  const t = raw.trim();
  if (!t) return "·";
  const parts = t
    .split(/\s+/)
    .map(stripAt)
    .filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) {
    const w = parts[0]!.toUpperCase();
    if (w.length >= 2) return w.slice(0, 2);
    return `${w}·`;
  }
  const first = parts[0]!;
  const last = parts[parts.length - 1]!;
  const a = first[0];
  const b = last[0];
  if (a && b) return `${a}${b}`.toUpperCase();
  return "·";
}
