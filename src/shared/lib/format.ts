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

/** `iso` shifted by whole days. */
export function isoAddDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** `iso` shifted by calendar months, clamped to the month's last day (31.01 + 1 → 28.02). */
export function isoAddMonths(iso: string, months: number): string {
  const date = parseIsoDate(iso);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return toIsoDate(date);
}

/** Today as a local ISO date. */
export function todayIso(): string {
  return toIsoDate(new Date());
}

const UZ_MONTHS_SHORT = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"] as const;

/** "2026-11-23T16:06" → "23 Noy, 16:06" */
export function formatShortDateTime(isoDateTime: string): string {
  const [date = "", time = ""] = isoDateTime.split("T");
  const d = parseIsoDate(date);
  return `${d.getDate()} ${UZ_MONTHS_SHORT[d.getMonth()]}, ${time.slice(0, 5)}`;
}

/** "2026-11-21" → "21.11" */
export function formatDayMonth(iso: string): string {
  const date = parseIsoDate(iso);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
}

/** 0 → "Bugun", 1 → "Kecha", n → "n kun oldin" */
export function formatDaysAgo(iso: string): string {
  const ago = -daysUntil(iso);
  if (ago <= 0) return "Bugun";
  if (ago === 1) return "Kecha";
  return `${ago} kun oldin`;
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

const timeOf = (isoDateTime: string) => isoDateTime.split("T")[1]?.slice(0, 5) ?? "";

/** List stamp: "14:20" today, "Kecha", otherwise "21 Noy". */
export function formatListStamp(isoDateTime: string): string {
  const [date = ""] = isoDateTime.split("T");
  const ago = -daysUntil(date);
  if (ago <= 0) return timeOf(isoDateTime);
  if (ago === 1) return "Kecha";
  const d = parseIsoDate(date);
  return `${d.getDate()} ${UZ_MONTHS_SHORT[d.getMonth()]}`;
}

/** Message stamp: "Bugun, 14:20", "Kecha, 16:30", otherwise "21 Noy, 16:30". */
export function formatMessageStamp(isoDateTime: string): string {
  const [date = ""] = isoDateTime.split("T");
  const ago = -daysUntil(date);
  if (ago <= 0) return `Bugun, ${timeOf(isoDateTime)}`;
  if (ago === 1) return `Kecha, ${timeOf(isoDateTime)}`;
  return formatShortDateTime(isoDateTime);
}

/** "2026-11-15T19:53" → "15.11.2026, 19:53" */
export function formatDateTime(isoDateTime: string): string {
  const [date = "", time = ""] = isoDateTime.split("T");
  return `${formatDate(date)}, ${time.slice(0, 5)}`;
}
