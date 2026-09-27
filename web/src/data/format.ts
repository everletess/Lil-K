import type { Center, Ring, Stage } from "./types";

/** The prototype's "today". All sample dates are relative to it. */
export const TODAY = new Date(2026, 8, 14);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** "26 Sep" */
export function dayMonth(iso: string): string {
  const d = parseDate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "14 Feb 2026" */
export function dayMonthYear(iso: string): string {
  const d = parseDate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "14 Sep 2026" from a Date */
export function shortDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Jun 2026" */
export function monthYear(iso: string): string {
  const d = parseDate(iso);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "September 2026" */
export function monthYearLong(iso: string): string {
  const d = parseDate(iso);
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Monday, 14 September 2026" */
export function longDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysFromToday(iso: string): number {
  return Math.round((parseDate(iso).getTime() - TODAY.getTime()) / 86_400_000);
}

/** Decision dates inside 14 days are the one state that earns oxblood. */
export function isDecisionSoon(iso: string | null): boolean {
  if (!iso) return false;
  const days = daysFromToday(iso);
  return days >= 0 && days <= 14;
}

export function ageInDays(iso: string): number {
  return -daysFromToday(iso);
}

export function ageLabel(iso: string): string {
  const n = ageInDays(iso);
  return n === 1 ? "1 day" : `${n} days`;
}

/** Introductions older than seven days are shown in oxblood. */
export function isOverdue(iso: string): boolean {
  return ageInDays(iso) > 7;
}

export function ringLabel(r: Ring): string {
  return `RING ${r}`;
}

export const RING_NAMES: Record<Ring, string> = {
  0: "Advanced Team",
  1: "Close Circle",
  2: "Larger Network",
  3: "Partners & Advisors",
};

export const CENTER_LONG: Record<Center, string> = {
  People: "The People of Families",
  Legacy: "The Legacy of Families",
  Lifestyle: "The Lifestyle of Families",
  Business: "The Business of Families",
  Assets: "The Assets of Families",
};

export const CENTER_SHORT: Record<Center, string> = {
  People: "People of Families",
  Legacy: "Legacy of Families",
  Lifestyle: "Lifestyle of Families",
  Business: "Business of Families",
  Assets: "Assets of Families",
};

export const CENTERS: Center[] = ["People", "Legacy", "Lifestyle", "Business", "Assets"];

export const STAGES: { id: Stage; label: string; short: string }[] = [
  { id: "intake", label: "Intake", short: "Intake" },
  { id: "analyze", label: "Analyze", short: "Analyze" },
  { id: "strategize", label: "Strategize", short: "Strategize" },
  { id: "close", label: "Hustle & Close", short: "Close" },
];

export function money(n: number): string {
  return "$" + n.toLocaleString("en-US");
}
