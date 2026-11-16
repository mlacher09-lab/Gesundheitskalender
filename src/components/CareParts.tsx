"use client";

import { useState } from "react";
import { ageLabel, categoryMeta, intervalLabel, type CareEntry } from "@/lib/care";
import { fmtMed, iso, parse, relative } from "@/lib/date";
import { uid, update } from "@/lib/store";
import { Button, Field, Icon, Sheet } from "./ui";

export function statusPill(e: CareEntry, today: Date) {
  switch (e.status) {
    case "due":
      return { text: e.dueDate ? "Fällig" : "Offen", cls: "bg-coral text-onaccent" };
    case "soon":
      return { text: relative(e.dueDate!, today), cls: "bg-sun-soft text-sun" };
    case "ok":
      return { text: relative(e.dueDate!, today), cls: "bg-sage text-forest" };
    case "later":
      return { text: `ab ${e.item.ageFrom}`, cls: "bg-line/60 text-muted" };
    default:
      return { text: "Erledigt", cls: "bg-sage text-forest" };
  }
}

export function CareRow({
  entry,
  today,
  onOpen,
}: {
  entry: CareEntry;
  today: Date;
  onOpen: (e: CareEntry) => void;
}) {
  const meta = categoryMeta[entry.item.category];
  const pill = statusPill(entry, today);
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="flex w-full items-center gap-3.5 rounded-2xl border border-line bg-card p-3.5 text-left transition-colors hover:border-forest/40"
    >
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${meta.bg} ${meta.fg}`}>
        <Icon name={entry.status === "done" ? "check" : meta.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{entry.item.title}</span>
        <span className="block truncate text-sm text-muted">
          {entry.item.doctor} · {intervalLabel(entry.item.intervalYears)}
        </span>
      </span>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${pill.cls}`}>
        {pill.text}
      </span>
    </button>
  );
}

export function CareSheet({
  entry,
  today,
  onClose,
}: {
  entry: CareEntry;
  today: Date;
  onClose: () => void;
}) {
  const { item } = entry;
  const meta = categoryMeta[item.category];
  const [doneDate, setDoneDate] = useState(entry.lastDone ?? iso(today));
  const [planDate, setPlanDate] = useState("");

  const markDone = () => {
    update((s) => ({
      ...s,
      done: { ...s.done, [item.id]: doneDate },
      // Impfungen landen zusätzlich im Impfpass
      vaccLog:
        item.category === "impfung" && !s.vaccLog.some((v) => v.itemId === item.id && v.date === doneDate)
          ? [...s.vaccLog, { id: uid(), itemId: item.id, name: item.title, date: doneDate }]
          : s.vaccLog,
    }));
    onClose();
  };
  const clearDone = () => {
    update((s) => {
      const done = { ...s.done };
      delete done[item.id];
      return { ...s, done };
    });
    onClose();
  };
  const skip = () => {
    update((s) => ({ ...s, skipped: [...s.skipped, item.id] }));
    onClose();
  };
  const plan = () => {
    if (!planDate) return;
    update((s) => ({
      ...s,
      appointments: [
        ...s.appointments,
        { id: uid(), title: item.title, date: planDate, itemId: item.id },
      ],
    }));
    onClose();
  };

  return (
    <Sheet title={item.title} onClose={onClose}>
      <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className={`rounded-full px-2.5 py-1 ${meta.bg} ${meta.fg}`}>{meta.label}</span>
        <span className="rounded-full bg-line/60 px-2.5 py-1 text-muted">{ageLabel(item)} Jahre</span>
        <span className="rounded-full bg-line/60 px-2.5 py-1 text-muted">{intervalLabel(item.intervalYears)}</span>
        <span className="rounded-full bg-line/60 px-2.5 py-1 text-muted">{item.doctor}</span>
      </div>
      <p className="leading-relaxed">{item.description}</p>
      {item.note && (
        <p className="mt-3 rounded-2xl bg-sun-soft p-3.5 text-sm leading-relaxed">{item.note}</p>
      )}
      <p className="mt-3 text-xs text-muted">
        Quelle:{" "}
        {item.sourceUrl ? (
          <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {item.source}
          </a>
        ) : (
          item.source
        )}
        {entry.lastDone && ` · zuletzt am ${fmtMed(parse(entry.lastDone))}`}
      </p>

      {entry.status !== "later" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-line bg-card p-4">
            <Field label="Zuletzt gemacht am">
              <input type="date" value={doneDate} max={iso(today)} onChange={(e) => setDoneDate(e.target.value)} />
            </Field>
            <div className="mt-3 flex gap-2">
              <Button onClick={markDone} className="flex-1">
                <Icon name="check" size={18} /> Als erledigt eintragen
              </Button>
              {entry.lastDone && (
                <Button variant="ghost" onClick={clearDone}>Löschen</Button>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-card p-4">
            <Field label="Termin vereinbart für">
              <input type="date" value={planDate} min={iso(today)} onChange={(e) => setPlanDate(e.target.value)} />
            </Field>
            <Button variant="ghost" onClick={plan} disabled={!planDate} className="mt-3 w-full">
              <Icon name="calendar" size={18} /> In den Kalender eintragen
            </Button>
          </div>
          <button type="button" onClick={skip} className="block w-full text-center text-sm font-medium text-muted underline underline-offset-4">
            Betrifft mich nicht – ausblenden
          </button>
        </div>
      )}
    </Sheet>
  );
}
