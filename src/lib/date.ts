const pad = (n: number) => String(n).padStart(2, "0");

export const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Addiert (auch gebrochene) Jahre monatsgenau. */
export const addYears = (d: Date, years: number) =>
  new Date(d.getFullYear(), d.getMonth() + Math.round(years * 12), d.getDate());

export const diffDays = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 864e5);

export const ageAt = (birth: Date, at: Date) =>
  (at.getTime() - birth.getTime()) / (365.2425 * 864e5);

const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("de-DE", o);
const fLong = f({ weekday: "long", day: "numeric", month: "long" });
const fMed = f({ day: "numeric", month: "short", year: "numeric" });
const fShort = f({ day: "numeric", month: "short" });
const fMonth = f({ month: "long", year: "numeric" });

export const fmtLong = (d: Date) => fLong.format(d);
export const fmtMed = (d: Date) => fMed.format(d);
export const fmtShort = (d: Date) => fShort.format(d);
export const fmtMonth = (d: Date) => fMonth.format(d);

/** "in 5 Tagen", "in 3 Mon.", "2031" … */
export function relative(date: Date, today: Date) {
  const days = diffDays(today, date);
  if (days < 0) return "überfällig";
  if (days === 0) return "heute";
  if (days === 1) return "morgen";
  if (days < 45) return `in ${days} Tagen`;
  if (days < 365) return `in ${Math.round(days / 30.4)} Mon.`;
  return String(date.getFullYear());
}
