// Time / date helpers
export function todayISO(): string {
  const d = new Date();
  return toISODate(d);
}

export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfWeek(d: Date): Date {
  const out = new Date(d);
  const day = out.getDay(); // 0=Sun
  out.setDate(out.getDate() - day);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

export function diffDays(a: Date, b: Date): number {
  const ms = 1000 * 60 * 60 * 24;
  return Math.round((b.getTime() - a.getTime()) / ms);
}

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function prettyDate(iso: string): string {
  const d = fromISODate(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function monthLabel(year: number, monthIdx: number): string {
  return new Date(year, monthIdx, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function shortDay(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

export function dateNum(d: Date): number {
  return d.getDate();
}
