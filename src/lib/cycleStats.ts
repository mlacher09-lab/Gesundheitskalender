import type { CyclePhase } from "@/data/empfehlungen";
import { phaseOf } from "./cycle";
import { addDays, diffDays, iso, parse } from "./date";
import type { Person } from "./store";

export interface CycleRecord {
  start: string;
  /** Tage bis zum Beginn der nächsten Periode; null beim laufenden Zyklus */
  length: number | null;
  periodLength: number;
}

export interface CycleStats {
  cycles: CycleRecord[];
  /** abgeschlossene Zyklen mit plausibler Länge (15–60 Tage) */
  completed: number;
  avg: number | null;
  min: number | null;
  max: number | null;
  avgPeriod: number | null;
  symptoms: { name: string; count: number; byPhase: Record<CyclePhase, number> }[];
  symptomDays: number;
}

/** Wertet die erfassten Periodentage und Symptome aus. */
export function cycleStats(state: Person): CycleStats {
  const days = [...new Set(state.periodDays)].sort();
  const set = new Set(days);
  const cycles: CycleRecord[] = [];
  for (const d of days) {
    if (set.has(iso(addDays(parse(d), -1)))) continue;
    let len = 1;
    while (set.has(iso(addDays(parse(d), len)))) len++;
    cycles.push({ start: d, length: null, periodLength: len });
  }
  for (let i = 0; i < cycles.length - 1; i++)
    cycles[i].length = diffDays(parse(cycles[i].start), parse(cycles[i + 1].start));

  const lens = cycles.map((c) => c.length).filter((l): l is number => l !== null && l >= 15 && l <= 60);
  const avg = lens.length ? Math.round((lens.reduce((a, b) => a + b, 0) / lens.length) * 10) / 10 : null;
  const avgPeriod = cycles.length
    ? Math.round((cycles.reduce((a, c) => a + c.periodLength, 0) / cycles.length) * 10) / 10
    : null;
  const typical = Math.round(avg ?? state.profile.cycleLength);

  const map = new Map<string, { name: string; count: number; byPhase: Record<CyclePhase, number> }>();
  let symptomDays = 0;
  for (const [date, list] of Object.entries(state.symptoms)) {
    if (!list.length) continue;
    symptomDays++;
    const cycle = [...cycles].reverse().find((c) => c.start <= date);
    let phase: CyclePhase | null = null;
    if (cycle) {
      const len = cycle.length && cycle.length >= 15 && cycle.length <= 60 ? cycle.length : typical;
      const day = diffDays(parse(cycle.start), parse(date)) + 1;
      if (day <= len + 14) phase = phaseOf(Math.min(day, len), { periodLength: cycle.periodLength, ovulationDay: len - 13 });
    }
    for (const name of list) {
      const e = map.get(name) ?? { name, count: 0, byPhase: { menstruation: 0, follikel: 0, ovulation: 0, luteal: 0 } };
      e.count++;
      if (phase) e.byPhase[phase]++;
      map.set(name, e);
    }
  }

  return {
    cycles,
    completed: lens.length,
    avg,
    min: lens.length ? Math.min(...lens) : null,
    max: lens.length ? Math.max(...lens) : null,
    avgPeriod,
    symptoms: [...map.values()].sort((a, b) => b.count - a.count),
    symptomDays,
  };
}
