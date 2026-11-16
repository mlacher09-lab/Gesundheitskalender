"use client";

import { useSyncExternalStore } from "react";
import type { RiskKey } from "@/data/risiko";

export type Sex = "female" | "male" | "all";
export type Smoker = "never" | "former" | "current";

export interface RiskFactors {
  smoker: Smoker;
  pregnant: boolean;
  chronic: boolean;
  familyColon: boolean;
  familyBreast: boolean;
  fsmeArea: boolean;
}

export interface Profile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  sex: Sex;
  cycleEnabled: boolean;
  cycleLength: number;
  periodLength: number;
  risk: RiskFactors;
  /** Ausrichtung der Zyklusansicht */
  cycleMode?: CycleMode;
  /** Schwangerschaft: errechneter Entbindungstermin (YYYY-MM-DD) */
  dueDate?: string;
  /** Wochenziel Bewegung in Minuten (moderat); Standard 150 */
  activityGoal?: number;
}

export type CycleMode = "standard" | "kinderwunsch" | "schwangerschaft" | "wechseljahre";

export interface Activity {
  id: string;
  date: string;
  minutes: number;
  intensity: "moderat" | "intensiv";
  /** z. B. "Radfahren" */
  kind: string;
  /** zählt als muskelkräftigende Einheit */
  strength?: boolean;
}

export interface Question {
  id: string;
  text: string;
  done: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time?: string;
  note?: string;
  itemId?: string; // verknüpfte Vorsorge
  doctorId?: string; // verknüpfte Praxis
  /** Vorbereitung: Fragen an die Ärztin/den Arzt */
  questions?: Question[];
  /** Vorbereitung: was mitbringen */
  bring?: string[];
  /** Notizen nach dem Termin */
  after?: string;
}

/** Eintrag im digitalen Impfpass */
export interface VaccEntry {
  id: string;
  itemId?: string; // Standardimpfung aus den Stammdaten
  name: string;
  date: string;
  note?: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string; // z. B. "1 Tablette", "5 mg"
  times: string[]; // Einnahmezeiten "HH:MM"
  note?: string;
  active: boolean;
  until?: string; // letzter Einnahmetag (YYYY-MM-DD), optional
}

export type MeasureType = "bp" | "weight" | "pulse" | "glucose" | "lab";

export interface Measurement {
  id: string;
  type: MeasureType;
  date: string;
  time?: string;
  value: number; // bp: systolisch
  value2?: number; // bp: diastolisch
  label?: string; // lab: Name des Werts, z. B. "LDL-Cholesterin"
  unit?: string; // lab: Einheit
  note?: string;
}

export interface BonusEntry {
  id: string;
  program: "zahn" | "kasse";
  title: string;
  date: string;
  note?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone?: string;
  address?: string;
  bookingUrl?: string;
  note?: string;
}

export interface ReminderSettings {
  enabled: boolean;
  /** Tage Vorlauf vor einem Termin */
  leadDays: number;
  /** auch an die voraussichtliche Periode erinnern */
  cycle: boolean;
  /** Benachrichtigungen ohne Details anzeigen (Sperrbildschirm) */
  discreet: boolean;
}

/** Alle Daten einer Person (eigenes Profil oder Familienmitglied). */
export interface Person {
  id: string;
  profile: Profile;
  /** Vorsorge-ID → Datum, an dem sie zuletzt erledigt wurde */
  done: Record<string, string>;
  /** Vorsorge-IDs, die als „betrifft mich nicht“ ausgeblendet wurden */
  skipped: string[];
  appointments: Appointment[];
  periodDays: string[];
  symptoms: Record<string, string[]>;
  vaccLog: VaccEntry[];
  meds: Medication[];
  /** Datum → eingenommene Dosen als `${medId}@${HH:MM}` */
  medLog: Record<string, string[]>;
  measurements: Measurement[];
  bonus: BonusEntry[];
  activities: Activity[];
}

export type Theme = "system" | "light" | "dark";

export interface AppState {
  people: Person[];
  activeId: string | null;
  /** Praxen werden von allen Personen gemeinsam genutzt */
  doctors: Doctor[];
  reminders: ReminderSettings;
  theme: Theme;
}

const KEY = "gesundheitskalender-v1";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const noRisk: RiskFactors = {
  smoker: "never",
  pregnant: false,
  chronic: false,
  familyColon: false,
  familyBreast: false,
  fsmeArea: false,
};

export function isRiskActive(risk: RiskFactors, key: RiskKey) {
  return key === "smoker" ? risk.smoker !== "never" : risk[key];
}

export function newPerson(profile: Omit<Profile, "risk"> & { risk?: RiskFactors }): Person {
  return {
    id: uid(),
    profile: { ...profile, risk: profile.risk ?? noRisk },
    done: {},
    skipped: [],
    appointments: [],
    periodDays: [],
    symptoms: {},
    vaccLog: [],
    meds: [],
    medLog: {},
    measurements: [],
    bonus: [],
    activities: [],
  };
}

const empty: AppState = {
  people: [],
  activeId: null,
  doctors: [],
  reminders: { enabled: false, leadDays: 1, cycle: false, discreet: false },
  theme: "system",
};

/** Ergänzt fehlende Felder (ältere Speicherstände) mit Standardwerten. */
function normalizePerson(p: Partial<Person> & { profile: Profile }): Person {
  const base = newPerson(p.profile);
  return {
    ...base,
    ...p,
    id: p.id ?? base.id,
    profile: { ...p.profile, risk: { ...noRisk, ...p.profile.risk } },
  };
}

function normalize(raw: unknown): AppState {
  if (!raw || typeof raw !== "object") return empty;
  const r = raw as Record<string, unknown>;
  // Speicherstand der ersten Version: eine Person, flach abgelegt
  if (!Array.isArray(r.people)) {
    if (!r.profile) return { ...empty, ...(r.reminders ? { reminders: r.reminders as ReminderSettings } : {}) };
    const person = normalizePerson(r as unknown as Person);
    return {
      ...empty,
      people: [person],
      activeId: person.id,
      reminders: { ...empty.reminders, ...(r.reminders as ReminderSettings | undefined) },
    };
  }
  const people = (r.people as Person[]).filter((p) => p?.profile).map(normalizePerson);
  const activeId = people.some((p) => p.id === r.activeId) ? (r.activeId as string) : (people[0]?.id ?? null);
  return {
    ...empty,
    ...(r as Partial<AppState>),
    people,
    activeId,
    reminders: { ...empty.reminders, ...(r.reminders as ReminderSettings | undefined) },
  };
}

let state: AppState | null = null;
const listeners = new Set<() => void>();

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch {
    // Speicher nicht verfügbar – App läuft dann ohne Persistenz
  }
  return empty;
}

function snapshot(): AppState {
  if (!state) state = load();
  return state;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Ändert den gesamten App-Zustand (Personenliste, Praxen, Einstellungen). */
export function updateApp(fn: (s: AppState) => AppState) {
  state = fn(snapshot());
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // siehe oben
  }
  listeners.forEach((l) => l());
}

/** Ändert die Daten der aktuell ausgewählten Person. */
export function update(fn: (p: Person) => Person) {
  updateApp((s) => ({
    ...s,
    people: s.people.map((p) => (p.id === s.activeId ? fn(p) : p)),
  }));
}

export function addPerson(person: Person) {
  updateApp((s) => ({ ...s, people: [...s.people, person], activeId: person.id }));
}

export function removePerson(id: string) {
  updateApp((s) => {
    const people = s.people.filter((p) => p.id !== id);
    return { ...s, people, activeId: s.activeId === id ? (people[0]?.id ?? null) : s.activeId };
  });
}

export function setActive(id: string) {
  updateApp((s) => ({ ...s, activeId: id }));
}

export function resetAll() {
  updateApp(() => empty);
}

export function importState(raw: unknown) {
  updateApp(() => normalize(raw));
}

/** null, solange noch nicht im Browser geladen (Server-Render). */
export function useStore(): AppState | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
