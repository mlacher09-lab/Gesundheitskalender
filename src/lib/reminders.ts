import { careEntries } from "./care";
import { cycleInfo } from "./cycle";
import { addDays, fmtLong, iso, parse } from "./date";
import type { AppState, Person, ReminderSettings } from "./store";

export interface Reminder {
  /** eindeutig – jede Erinnerung wird nur einmal angezeigt */
  key: string;
  /** Tag, ab dem sie angezeigt wird (YYYY-MM-DD) */
  date: string;
  title: string;
  body: string;
}

/** Leitet aus dem aktuellen Stand alle anstehenden Erinnerungen ab – für alle Personen. */
export function buildReminders(app: AppState, today: Date): Reminder[] {
  const settings = app.reminders;
  if (!settings.enabled) return [];
  const many = app.people.length > 1;
  const out = app.people.flatMap((person) => {
    const who = many && person.profile.name ? `${person.profile.name}: ` : "";
    return personReminders(person, settings, today).map((r) => ({
      ...r,
      key: `${person.id}:${r.key}`,
      title: who + r.title,
    }));
  });
  if (settings.discreet)
    return out.map((r) => ({
      ...r,
      title: "Gesundheitskalender",
      body: "Du hast eine neue Erinnerung.",
    }));
  return out;
}

function personReminders(state: Person, settings: ReminderSettings, today: Date): Reminder[] {
  const { profile } = state;
  const todayIso = iso(today);
  const out: Reminder[] = [];

  for (const a of state.appointments) {
    if (a.date < todayIso) continue;
    const when = `${fmtLong(parse(a.date))}${a.time ? ` · ${a.time} Uhr` : ""}`;
    if (settings.leadDays > 0) {
      const early = iso(addDays(parse(a.date), -settings.leadDays));
      if (early >= todayIso)
        out.push({ key: `appt:${a.id}:${a.date}:early`, date: early, title: `Termin: ${a.title}`, body: when });
    }
    out.push({
      key: `appt:${a.id}:${a.date}`,
      date: a.date,
      title: `Heute: ${a.title}`,
      body: [a.time && `${a.time} Uhr`, a.note].filter(Boolean).join(" · ") || when,
    });
  }

  const entries = careEntries(profile, state.done, today, state.skipped);
  for (const e of entries) {
    if (!e.dueDate || (e.status !== "soon" && e.status !== "ok")) continue;
    out.push({
      key: `care:${e.item.id}:${iso(e.dueDate)}`,
      date: iso(e.dueDate),
      title: `Jetzt fällig: ${e.item.title}`,
      body: `${e.item.doctor} – am besten gleich einen Termin vereinbaren.`,
    });
  }

  // Monatliche Erinnerung an offene Punkte
  const open = entries.filter((e) => e.status === "due").length;
  if (open > 0) {
    for (const m of [0, 1]) {
      const first = new Date(today.getFullYear(), today.getMonth() + m, 1);
      out.push({
        key: `open:${iso(first).slice(0, 7)}`,
        date: m === 0 ? todayIso : iso(first),
        title: open === 1 ? "1 Vorsorge ist offen" : `${open} Vorsorgen sind offen`,
        body: "Schau in deinen Plan und vereinbare einen Termin.",
      });
    }
  }

  // Tägliche Erinnerung an den Medikamentenplan (heute und morgen vorgemerkt)
  for (const d of [0, 1]) {
    const day = iso(addDays(today, d));
    const doses = state.meds
      .filter((m) => m.active && (!m.until || m.until >= day))
      .reduce((n, m) => n + m.times.length, 0);
    if (doses > 0)
      out.push({
        key: `meds:${day}`,
        date: day,
        title: doses === 1 ? "Heute: 1 Medikamenten-Einnahme" : `Heute: ${doses} Medikamenten-Einnahmen`,
        body: "Öffne den Medikamentenplan zum Abhaken.",
      });
  }

  if (settings.cycle && profile.cycleEnabled && (profile.cycleMode ?? "standard") !== "schwangerschaft" && profile.cycleMode !== "wechseljahre") {
    const info = cycleInfo(state.periodDays, profile, today);
    if (info && !info.late) {
      out.push({
        key: `cycle:${iso(info.nextStart)}`,
        date: iso(addDays(info.nextStart, -1)),
        title: "Zyklus",
        body: "Deine Periode beginnt voraussichtlich morgen.",
      });
    }
  }
  return out;
}

const DATA = "gk-data";
const REMINDERS = "/__gk/reminders";

/** Legt die Erinnerungen dort ab, wo der Service Worker sie lesen kann, und lässt ihn prüfen. */
export async function syncReminders(list: Reminder[]) {
  if (typeof caches === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    const cache = await caches.open(DATA);
    await cache.put(
      REMINDERS,
      new Response(JSON.stringify(list), {
        headers: { "content-type": "application/json" },
      }),
    );
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({ type: "check" });
  } catch {
    // Ohne Cache/Service Worker gibt es keine Erinnerungen – die App funktioniert trotzdem.
  }
}

export type PermissionResult = "granted" | "denied" | "unsupported";

export async function requestReminderPermission(): Promise<PermissionResult> {
  if (typeof Notification === "undefined" || !("serviceWorker" in navigator))
    return "unsupported";
  const result = await Notification.requestPermission();
  if (result !== "granted") return "denied";
  try {
    // Hintergrund-Prüfung, wo der Browser sie erlaubt (v. a. installierte App auf Android)
    const reg = (await navigator.serviceWorker.ready) as ServiceWorkerRegistration & {
      periodicSync?: { register: (tag: string, o: { minInterval: number }) => Promise<void> };
    };
    await reg.periodicSync?.register("gk-reminders", { minInterval: 12 * 60 * 60 * 1000 });
  } catch {
    // nicht verfügbar – Erinnerungen erscheinen dann beim Öffnen der App
  }
  return "granted";
}
