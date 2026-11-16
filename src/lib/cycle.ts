import type { CyclePhase } from "@/data/empfehlungen";
import { addDays, diffDays, iso, parse } from "./date";
import type { Profile } from "./store";

export interface CycleInfo {
  length: number; // (durchschnittliche) Zykluslänge
  periodLength: number;
  lastStart: Date;
  nextStart: Date;
  day: number; // aktueller Zyklustag, 1-basiert
  ovulationDay: number; // geschätzter Zyklustag des Eisprungs
  phase: CyclePhase;
  late: boolean;
  tracked: number; // Anzahl erfasster Zyklen
}

export type DayMark = "period" | "predicted" | "fertile" | "ovulation";

export function phaseOf(day: number, info: Pick<CycleInfo, "periodLength" | "ovulationDay">): CyclePhase {
  if (day <= info.periodLength) return "menstruation";
  if (day < info.ovulationDay - 1) return "follikel";
  if (day <= info.ovulationDay + 1) return "ovulation";
  return "luteal";
}

export function cycleInfo(
  periodDays: string[],
  profile: Profile,
  today: Date,
): CycleInfo | null {
  const set = new Set(periodDays);
  const starts = [...periodDays]
    .sort()
    .filter((d) => !set.has(iso(addDays(parse(d), -1))) && parse(d) <= today);
  if (!starts.length) return null;

  const lens: number[] = [];
  for (let i = 1; i < starts.length; i++) {
    const l = diffDays(parse(starts[i - 1]), parse(starts[i]));
    if (l >= 15 && l <= 60) lens.push(l);
  }
  const recent = lens.slice(-6);
  const length = recent.length
    ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length)
    : profile.cycleLength;

  const lastStart = parse(starts[starts.length - 1]);
  const day = diffDays(lastStart, today) + 1;
  const ovulationDay = length - 13;
  const periodLength = profile.periodLength;

  return {
    length,
    periodLength,
    lastStart,
    nextStart: addDays(lastStart, length),
    day,
    ovulationDay,
    phase: phaseOf(Math.min(day, length), { periodLength, ovulationDay }),
    late: day > length,
    tracked: starts.length,
  };
}

/** Markierungen für den Kalender: erfasste Tage + Prognose für die nächsten Zyklen. */
export function cycleMarks(
  periodDays: string[],
  info: CycleInfo | null,
  cycles = 4,
): Map<string, DayMark> {
  const marks = new Map<string, DayMark>();
  if (info) {
    for (let c = 0; c < cycles; c++) {
      const start = addDays(info.lastStart, c * info.length);
      for (let d = info.ovulationDay - 5; d <= info.ovulationDay; d++) {
        marks.set(
          iso(addDays(start, d - 1)),
          d === info.ovulationDay ? "ovulation" : "fertile",
        );
      }
      if (c > 0) {
        for (let d = 0; d < info.periodLength; d++)
          marks.set(iso(addDays(start, d)), "predicted");
      }
    }
  }
  for (const d of periodDays) marks.set(d, "period");
  return marks;
}

export const phaseColors: Record<CyclePhase, string> = {
  menstruation: "var(--plum)",
  follikel: "var(--phase-follikel)",
  ovulation: "var(--teal)",
  luteal: "var(--phase-luteal)",
};
