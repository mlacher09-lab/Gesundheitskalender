import { careItems, type CareCategory, type CareItem } from "@/data/vorsorge";
import { addYears, diffDays, parse } from "./date";
import type { Profile } from "./store";

export type CareStatus = "due" | "soon" | "ok" | "later" | "done";

export interface CareEntry {
  item: CareItem;
  status: CareStatus;
  /** nächster Termin bzw. Beginn des Altersfensters */
  dueDate: Date | null;
  lastDone?: string;
}

export const categoryMeta: Record<
  CareCategory,
  { label: string; fg: string; bg: string; icon: string }
> = {
  checkup: { label: "Check-up", fg: "text-forest", bg: "bg-sage", icon: "heart" },
  krebs: { label: "Früherkennung", fg: "text-sky", bg: "bg-sky-soft", icon: "search" },
  impfung: { label: "Impfung", fg: "text-sun", bg: "bg-sun-soft", icon: "shield" },
  zahn: { label: "Zahn", fg: "text-teal", bg: "bg-teal-soft", icon: "tooth" },
  kinder: { label: "Kinder & Jugend", fg: "text-coral", bg: "bg-coral-soft", icon: "child" },
};

export function intervalLabel(years: number | null) {
  if (years === null) return "einmalig";
  if (years === 0.5) return "halbjährlich";
  if (years === 1) return "jährlich";
  if (years < 1) return `alle ${Math.round(years * 12)} Monate`;
  return `alle ${years} Jahre`;
}

export function ageLabel(item: CareItem) {
  const a = (n: number) =>
    n < 2 && !Number.isInteger(n) ? `${Math.round(n * 12)} Mon.` : `${n}`;
  if (item.ageTo === null) return `ab ${a(item.ageFrom)}`;
  if (item.ageTo === item.ageFrom) return `mit ${a(item.ageFrom)}`;
  return `${a(item.ageFrom)}–${a(item.ageTo)}`;
}

const SOON_DAYS = 183;

export function careEntries(
  profile: Profile,
  done: Record<string, string>,
  today: Date,
  skipped: string[] = [],
): CareEntry[] {
  const birth = parse(profile.birthDate);
  const out: CareEntry[] = [];

  for (const item of careItems) {
    if (skipped.includes(item.id)) continue;
    if (item.sex !== "all" && profile.sex !== "all" && item.sex !== profile.sex)
      continue;

    const start = addYears(birth, item.ageFrom);
    const end =
      item.ageTo === null
        ? null
        : addYears(birth, item.ageTo + (Number.isInteger(item.ageTo) ? 1 : 0.1));
    const lastDone = done[item.id];

    if (end && today >= end) {
      if (lastDone) out.push({ item, status: "done", dueDate: null, lastDone });
      continue;
    }

    if (today < start) {
      const soon = diffDays(today, start) <= SOON_DAYS;
      out.push({ item, status: soon ? "soon" : "later", dueDate: start });
      continue;
    }

    if (!lastDone) {
      out.push({ item, status: "due", dueDate: null });
      continue;
    }
    if (item.intervalYears === null) {
      out.push({ item, status: "done", dueDate: null, lastDone });
      continue;
    }
    const next = addYears(parse(lastDone), item.intervalYears);
    if (end && next >= end) {
      out.push({ item, status: "done", dueDate: null, lastDone });
      continue;
    }
    const days = diffDays(today, next);
    out.push({
      item,
      status: days <= 0 ? "due" : days <= SOON_DAYS ? "soon" : "ok",
      dueDate: next,
      lastDone,
    });
  }
  return out;
}
