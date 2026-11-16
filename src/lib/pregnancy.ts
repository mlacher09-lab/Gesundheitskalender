import { addDays, diffDays, parse } from "./date";

/** Zeitfenster der Mutterschaftsvorsorge in Schwangerschaftswochen (SSW, Woche + Tag). */
export interface Milestone {
  id: string;
  title: string;
  text: string;
  /** Beginn und Ende als Tage seit dem ersten Tag der letzten Periode */
  from: number;
  to: number;
  source: string;
}

const w = (week: number, day = 0) => week * 7 + day;

export const pregnancySource = {
  label: "G-BA Mutterschafts-Richtlinie",
  url: "https://www.g-ba.de/richtlinien/19/",
};

// Zeitfenster aus der Mutterschafts-Richtlinie des G-BA (Fassung in Kraft seit 25.08.2026);
// Keuchhusten-Impfung nach STIKO (Epid. Bull. 4/2026).
export const milestones: Milestone[] = [
  { id: "us1", title: "1. Ultraschall-Screening", text: "Bestätigt die Schwangerschaft und den voraussichtlichen Geburtstermin.", from: w(8), to: w(11, 6), source: "G-BA" },
  { id: "us2", title: "2. Ultraschall-Screening", text: "Kontrolle von Wachstum und Entwicklung; auf Wunsch als erweiterte Untersuchung.", from: w(18), to: w(21, 6), source: "G-BA" },
  { id: "gdm", title: "Test auf Schwangerschaftsdiabetes", text: "Zuckertest (50 g Glukoselösung), nicht nüchtern; bei auffälligem Wert folgt ein zweiter Test.", from: w(24), to: w(27, 6), source: "G-BA" },
  { id: "antid", title: "Anti-D-Prophylaxe", text: "Nur bei Rhesus-negativer Blutgruppe, wenn das Kind Rhesus-positiv ist oder dies nicht bekannt ist.", from: w(27), to: w(29, 6), source: "G-BA" },
  { id: "tdap", title: "Keuchhusten-Impfung", text: "Zu Beginn des letzten Schwangerschaftsdrittels – schützt das Neugeborene in den ersten Lebenswochen.", from: w(28), to: w(32), source: "STIKO" },
  { id: "us3", title: "3. Ultraschall-Screening", text: "Kontrolle von Wachstum, Lage des Kindes und Plazenta.", from: w(28), to: w(31, 6), source: "G-BA" },
];

export interface PregnancyInfo {
  /** erster Tag der letzten Periode (rechnerisch) */
  start: Date;
  due: Date;
  /** Tage seit Beginn */
  days: number;
  week: number;
  day: number;
  trimester: 1 | 2 | 3;
  daysLeft: number;
}

/** Schwangerschaftswoche aus dem errechneten Entbindungstermin (280 Tage nach Beginn der letzten Periode). */
export function pregnancyInfo(dueDate: string, today: Date): PregnancyInfo {
  const due = parse(dueDate);
  const start = addDays(due, -280);
  const days = Math.max(0, diffDays(start, today));
  const week = Math.floor(days / 7);
  return {
    start,
    due,
    days,
    week,
    day: days % 7,
    trimester: week < 14 ? 1 : week < 28 ? 2 : 3,
    daysLeft: diffDays(today, due),
  };
}
