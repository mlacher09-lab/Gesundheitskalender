import { careEntries } from "./care";
import { addDays, addYears, iso, parse } from "./date";
import type { State } from "./store";

const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
const day = (s: string) => s.replace(/-/g, "");

/** Kalenderdatei (.ics) mit Terminen und kommenden Vorsorgen – importierbar in jede Kalender-App. */
export function buildICS(state: State, today: Date): string {
  const lead = Math.max(0, state.reminders.leadDays);
  const stamp = `${day(iso(today))}T000000Z`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gesundheitskalender//DE",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Gesundheitskalender",
  ];
  const event = (uid: string, date: string, title: string, desc: string, time?: string) => {
    lines.push("BEGIN:VEVENT", `UID:${uid}@gesundheitskalender`, `DTSTAMP:${stamp}`);
    if (time) {
      const [h, m] = time.split(":").map(Number);
      const end = `${pad(Math.min(h + 1, 23))}${pad(m)}00`;
      lines.push(`DTSTART:${day(date)}T${pad(h)}${pad(m)}00`, `DTEND:${day(date)}T${end}`);
    } else {
      lines.push(
        `DTSTART;VALUE=DATE:${day(date)}`,
        `DTEND;VALUE=DATE:${day(iso(addDays(parse(date), 1)))}`,
      );
    }
    lines.push(`SUMMARY:${esc(title)}`);
    if (desc) lines.push(`DESCRIPTION:${esc(desc)}`);
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(title)}`,
      // ganztägig: am Morgen des Vortags bzw. des Tages; mit Uhrzeit: entsprechend früher
      `TRIGGER:${time ? `-P${lead}D` : lead > 0 ? `-P${lead - 1}DT15H` : "PT9H"}`,
      "END:VALARM",
      "END:VEVENT",
    );
  };

  const todayIso = iso(today);
  for (const a of state.appointments) {
    if (a.date >= todayIso) event(`appt-${a.id}`, a.date, a.title, a.note ?? "", a.time);
  }
  if (state.profile) {
    const horizon = addYears(today, 3);
    for (const e of careEntries(state.profile, state.done, today, state.skipped)) {
      if (!e.dueDate || e.dueDate < today || e.dueDate > horizon) continue;
      event(
        `care-${e.item.id}-${iso(e.dueDate)}`,
        iso(e.dueDate),
        `Vorsorge fällig: ${e.item.title}`,
        `${e.item.doctor}. ${e.item.description}`,
      );
    }
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function downloadICS(state: State, today: Date) {
  const blob = new Blob([buildICS(state, today)], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gesundheitskalender.ics";
  a.click();
  URL.revokeObjectURL(a.href);
}
