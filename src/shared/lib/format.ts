const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
] as const;

/** 23-noyabr, 2026 */
export function formatUzDate(date: Date): string {
  return `${date.getDate()}-${UZ_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

/** 1480 → "1 480" (Uzbek uses a space as the thousands separator). */
export function formatCount(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** 92 → "92.0%" */
export function formatPercent(value: number | null | undefined, digits = 1): string {
  return value == null ? "—" : `${value.toFixed(digits)}%`;
}

export function formatRating(value: number | null | undefined): string {
  return value == null ? "—" : value.toFixed(1);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Local-calendar ISO date ("2026-12-20") — never shifted by UTC. */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseIsoDate(iso: string): Date {
  const [y = 1970, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** ISO date `days` from today. */
export function isoInDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** Whole calendar days from today to `iso` (negative when past). */
export function daysUntil(iso: string): number {
  const today = parseIsoDate(toIsoDate(new Date()));
  return Math.round((parseIsoDate(iso).getTime() - today.getTime()) / 86_400_000);
}

/** "2026-12-20" → "20.12.2026" */
export function formatDate(iso: string): string {
  const date = parseIsoDate(iso);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

/** "+998907774122" → "+998 90 777 41 22" */
export function formatPhone(phone: string): string {
  const match = /^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(phone);
  return match ? `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}` : phone;
}

/** 330 → "$330" */
export function formatUsd(value: number): string {
  return `$${formatCount(value)}`;
}

/** "Aziza Karimova" → "AK" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
