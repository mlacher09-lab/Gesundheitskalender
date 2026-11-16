"use client";

import { useState } from "react";
import { allItems, careEntries, intervalLabel, type CareEntry } from "@/lib/care";
import { diffDays, fmtMed, iso, parse } from "@/lib/date";
import { uid, update, type Person } from "@/lib/store";
import type { ViewProps } from "./App";
import { CareSheet, statusPill } from "./CareParts";
import { Button, Card, Field, Icon, SectionTitle, Sheet } from "./ui";

const vaccines = allItems.filter((i) => i.category === "impfung");

/** „noch 3 Jahre 2 Monate“ */
function countdown(days: number) {
  if (days <= 0) return "jetzt fällig";
  if (days < 60) return `noch ${days} Tage`;
  const months = Math.round(days / 30.44);
  if (months < 24) return `noch ${months} Monate`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return `noch ${y} Jahre${m ? ` ${m} Mon.` : ""}`;
}

/** Trägt eine Impfung ein und merkt das jüngste Datum für den Vorsorgeplan. */
export function logVaccination(entry: { itemId?: string; name: string; date: string; note?: string }) {
  update((p) => {
    const done = { ...p.done };
    if (entry.itemId && (!done[entry.itemId] || done[entry.itemId] < entry.date)) done[entry.itemId] = entry.date;
    return { ...p, done, vaccLog: [...p.vaccLog, { id: uid(), ...entry }] };
  });
}

export default function VaccineView({ state, profile, today }: ViewProps) {
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<CareEntry | null>(null);

  const entries = careEntries(profile, state.done, today, state.skipped).filter(
    (e) => e.item.category === "impfung" && e.status !== "later",
  );
  const order = { due: 0, soon: 1, ok: 2, done: 3, later: 4 };
  entries.sort((a, b) => order[a.status] - order[b.status]);
  const log = [...state.vaccLog].sort((a, b) => b.date.localeCompare(a.date));
  const dueCount = entries.filter((e) => e.status === "due").length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Impfpass</h1>
          <p className="mt-2 text-muted">
            {dueCount ? `${dueCount} ${dueCount === 1 ? "Impfung ist" : "Impfungen sind"} offen oder fällig.` : "Dein Impfschutz ist auf dem aktuellen Stand."}
          </p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Icon name="plus" size={18} /> Impfung eintragen
        </Button>
      </div>

      <SectionTitle aside="nach STIKO-Impfkalender">Impfschutz</SectionTitle>
      <div className="space-y-2">
        {entries.map((e) => {
          const pill = statusPill(e, today);
          const last = e.lastDone ? parse(e.lastDone) : null;
          const total = last && e.dueDate ? Math.max(diffDays(last, e.dueDate), 1) : 0;
          const left = e.dueDate ? diffDays(today, e.dueDate) : 0;
          const pct = total ? Math.min(100, Math.max(0, ((total - left) / total) * 100)) : e.status === "done" ? 100 : 0;
          return (
            <button
              key={e.item.id}
              type="button"
              onClick={() => setOpen(e)}
              className="block w-full rounded-2xl border border-line bg-card p-3.5 text-left transition-colors hover:border-forest/40"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sun-soft text-sun">
                  <Icon name={e.status === "done" ? "check" : "syringe"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{e.item.title}</span>
                  <span className="block truncate text-sm text-muted">
                    {last ? `zuletzt ${fmtMed(last)}` : "noch nicht eingetragen"} · {intervalLabel(e.item.intervalYears)}
                  </span>
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${pill.cls}`}>{pill.text}</span>
              </span>
              {last && e.dueDate && (
                <span className="mt-3 block">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-sage">
                    <span className={`block h-full rounded-full ${left <= 0 ? "bg-coral" : "bg-forest"}`} style={{ width: `${pct}%` }} />
                  </span>
                  <span className="mt-1.5 flex justify-between text-xs text-muted">
                    <span>Auffrischung {fmtMed(e.dueDate)}</span>
                    <span>{countdown(left)}</span>
                  </span>
                </span>
              )}
            </button>
          );
        })}
        {!entries.length && (
          <Card>
            <p className="text-muted">Für dieses Alter stehen aktuell keine Standardimpfungen an.</p>
          </Card>
        )}
      </div>

      <SectionTitle aside={log.length ? `${log.length} Einträge` : undefined}>Eingetragene Impfungen</SectionTitle>
      {log.length ? (
        <div className="overflow-hidden rounded-3xl border border-line bg-card">
          {log.map((v, i) => (
            <div key={v.id} className={`flex items-center gap-3 px-4 py-3 ${i ? "border-t border-line" : ""}`}>
              <span className="w-24 shrink-0 text-sm tabular-nums text-muted">{fmtMed(parse(v.date))}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{v.name}</span>
                {v.note && <span className="block truncate text-sm text-muted">{v.note}</span>}
              </span>
              <button
                type="button"
                aria-label={`${v.name} löschen`}
                onClick={() => update((p) => ({ ...p, vaccLog: p.vaccLog.filter((x) => x.id !== v.id) }))}
                className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-line/60"
              >
                <Icon name="trash" size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <p className="leading-relaxed text-muted">
            Übertrag die Einträge aus deinem gelben Impfausweis – dann berechnet die App, wann die nächste Auffrischung ansteht.
          </p>
        </Card>
      )}

      <p className="mt-10 text-xs leading-relaxed text-muted">
        Der digitale Impfpass dient deiner Übersicht und ersetzt nicht den offiziellen Impfausweis.
      </p>

      {adding && <AddVaccination state={state} today={today} onClose={() => setAdding(false)} />}
      {open && <CareSheet entry={open} today={today} onClose={() => setOpen(null)} />}
    </div>
  );
}

function AddVaccination({ state, today, onClose }: { state: Person; today: Date; onClose: () => void }) {
  const [itemId, setItemId] = useState(vaccines[0]?.id ?? "other");
  const [name, setName] = useState("");
  const [date, setDate] = useState(iso(today));
  const [note, setNote] = useState("");
  const sex = state.profile.sex;
  const options = vaccines.filter((v) => v.sex === "all" || sex === "all" || v.sex === sex);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const item = options.find((v) => v.id === itemId);
    const label = item ? item.title : name.trim();
    if (!label || !date) return;
    logVaccination({ itemId: item?.id, name: label, date, note: note.trim() || undefined });
    onClose();
  };

  return (
    <Sheet title="Impfung eintragen" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Impfung">
          <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
            {options.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
            <option value="other">Andere (z. B. Reiseimpfung) …</option>
          </select>
        </Field>
        {itemId === "other" && (
          <Field label="Bezeichnung">
            <input type="text" required placeholder="z. B. Hepatitis A, Gelbfieber" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        )}
        <Field label="Datum der Impfung">
          <input type="date" required max={iso(today)} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Notiz (optional)">
          <input type="text" placeholder="z. B. Impfstoff, Chargennummer, Praxis" value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full">
          Speichern
        </Button>
      </form>
    </Sheet>
  );
}
