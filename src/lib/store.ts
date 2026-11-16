"use client";

import { useSyncExternalStore } from "react";

export type Sex = "female" | "male" | "all";

export interface Profile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  sex: Sex;
  cycleEnabled: boolean;
  cycleLength: number;
  periodLength: number;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time?: string;
  note?: string;
  itemId?: string; // verknüpfte Vorsorge
}

export interface State {
  profile: Profile | null;
  /** Vorsorge-ID → Datum, an dem sie zuletzt erledigt wurde */
  done: Record<string, string>;
  /** Vorsorge-IDs, die als „betrifft mich nicht“ ausgeblendet wurden */
  skipped: string[];
  appointments: Appointment[];
  periodDays: string[];
  symptoms: Record<string, string[]>;
}

const KEY = "gesundheitskalender-v1";

const empty: State = {
  profile: null,
  done: {},
  skipped: [],
  appointments: [],
  periodDays: [],
  symptoms: {},
};

let state: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...empty, ...JSON.parse(raw) };
  } catch {
    // Speicher nicht verfügbar – App läuft dann ohne Persistenz
  }
  return empty;
}

function snapshot(): State {
  if (!state) state = load();
  return state;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function update(fn: (s: State) => State) {
  state = fn(snapshot());
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // siehe oben
  }
  listeners.forEach((l) => l());
}

export function resetAll() {
  update(() => empty);
}

/** null, solange noch nicht im Browser geladen (Server-Render). */
export function useStore(): State | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

export const uid = () => Math.random().toString(36).slice(2, 10);
