"use client";

import { useState } from "react";
import { addDays, fmtMed, fmtShort, iso, parse } from "@/lib/date";
import type { Medication, Person } from "@/lib/store";
import { uid, update } from "@/lib/store";
import { Button, Card, Chip, Field, Icon, SectionTitle, Sheet } from "./ui";

const quickTimes: [string, string][] = [
  ["Morgens", "08:00"],
  ["Mittags", "12:30"],
  ["Abends", "19:00"],
  ["Nachts", "22:00"],
];

const inputCls =
  "min-h-11 w-full rounded-2xl border border-line bg-field px-4 text-[15px] text-ink outline-none focus:border-forest";

const weekdayFmt = new Intl.DateTimeFormat("de-DE", { weekday: "short" });

const slotKey = (m: Medication, t: string) => `${m.id}@${t}`;

/** Ist das Medikament an diesem Tag (YYYY-MM-DD) einzunehmen? */
const runsOn = (m: Medication, day: string) => m.active && (!m.until || m.until >= day);

export default function MedsView({ state, today }: { state: Person; today: Date }) {
  const [editing, setEditing] = useState<Medication | "new" | null>(null);

  const todayKey = iso(today);
  const meds = state.meds;
  const takenToday = state.medLog[todayKey] ?? [];

  const slots = meds
    .filter((m) => runsOn(m, todayKey))
    .flatMap((m) => m.times.map((t) => ({ med: m, time: t, key: slotKey(m, t) })))
    .sort((a, b) => a.time.localeCompare(b.time) || a.med.name.localeCompare(b.med.name, "de"));
  const doneCount = slots.filter((s) => takenToday.includes(s.key)).length;

  const toggleSlot = (key: string) =>
    update((p) => {
      const cur = p.medLog[todayKey] ?? [];
      return {
        ...p,
        medLog: {
          ...p.medLog,
          [todayKey]: cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key],
        },
      };
    });

  const toggleActive = (id: string) =>
    update((p) => ({ ...p, meds: p.meds.map((m) => (m.id === id ? { ...m, active: !m.active } : m)) }));

  const save = (med: Medication) => {
    update((p) => ({
      ...p,
      meds: p.meds.some((m) => m.id === med.id) ? p.meds.map((m) => (m.id === med.id ? med : m)) : [...p.meds, med],
    }));
    setEditing(null);
  };

  const remove = (id: string) => {
    update((p) => ({ ...p, meds: p.meds.filter((m) => m.id !== id) }));
    setEditing(null);
  };

  // Letzte 7 Tage (älteste zuerst, heute zuletzt)
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i - 6);
    const key = iso(d);
    const planned = meds
      .filter((m) => runsOn(m, key))
      .flatMap((m) => m.times.map((t) => slotKey(m, t)));
    const log = state.medLog[key] ?? [];
    const taken = planned.filter((k) => log.includes(k)).length;
    return { d, key, total: planned.length, taken };
  });
  const weekHasData = week.some((w) => w.total > 0);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl">Medikamente</h1>

      {meds.length === 0 ? (
        <Card className="mt-6 bg-sage">
          <span className="grid size-11 place-items-center rounded-xl bg-card text-forest">
            <Icon name="bell" />
          </span>
          <h2 className="font-display mt-3 text-2xl">Noch kein Medikament eingetragen</h2>
          <p className="mt-2 max-w-md text-muted">
            Trag hier ein, was du regelmäßig einnimmst – mit Uhrzeiten. Dann siehst du jeden Tag auf einen Blick,
            was noch ansteht, und kannst es mit einem Tipp abhaken.
          </p>
          <Button onClick={() => setEditing("new")} className="mt-4">
            <Icon name="plus" size={18} />
            Medikament hinzufügen
          </Button>
        </Card>
      ) : (
        <>
          <SectionTitle
            aside={slots.length > 0 ? `${doneCount} von ${slots.length} genommen` : undefined}
          >
            Heute
          </SectionTitle>
          {slots.length === 0 ? (
            <p className="rounded-2xl border border-line bg-card p-3.5 text-muted">
              Heute stehen keine Einnahmen an.
            </p>
          ) : (
            <>
              <div
                className="mb-3 h-2 overflow-hidden rounded-full bg-sage"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={slots.length}
                aria-valuenow={doneCount}
                aria-label="Heute genommene Einnahmen"
              >
                <div
                  className="h-full rounded-full bg-forest transition-all"
                  style={{ width: `${(doneCount / slots.length) * 100}%` }}
                />
              </div>
              <ul className="space-y-2">
                {slots.map((s) => {
                  const taken = takenToday.includes(s.key);
                  return (
                    <li key={s.key}>
                      <button
                        type="button"
                        onClick={() => toggleSlot(s.key)}
                        aria-pressed={taken}
                        aria-label={`${s.med.name} um ${s.time} Uhr ${taken ? "als nicht genommen markieren" : "als genommen markieren"}`}
                        className={`flex min-h-16 w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-colors ${
                          taken ? "border-forest/30 bg-sage" : "border-line bg-card hover:border-forest/40"
                        }`}
                      >
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-full border-2 ${
                            taken ? "border-forest bg-forest text-onaccent" : "border-line text-transparent"
                          }`}
                        >
                          <Icon name="check" size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block font-semibold ${taken ? "text-muted line-through" : "text-ink"}`}>
                            {s.med.name}
                          </span>
                          <span className="block truncate text-sm text-muted">
                            {[s.med.dose, s.med.note].filter(Boolean).join(" · ") || "Einnahme"}
                          </span>
                        </span>
                        <span className="font-display shrink-0 text-xl text-ink">{s.time}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <SectionTitle>Mein Plan</SectionTitle>
          <ul className="space-y-2">
            {meds.map((m) => {
              const expired = !!m.until && m.until < todayKey;
              return (
                <li
                  key={m.id}
                  className="flex items-center gap-2 rounded-2xl border border-line bg-card p-3.5"
                >
                  <button
                    type="button"
                    onClick={() => setEditing(m)}
                    aria-label={`${m.name} bearbeiten`}
                    className={`flex min-h-11 min-w-0 flex-1 items-center gap-3 text-left ${
                      m.active && !expired ? "" : "opacity-60"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">{m.name}</span>
                      <span className="block text-sm text-muted">
                        {[m.dose, [...m.times].sort().join(", ")].filter(Boolean).join(" · ")}
                      </span>
                      {m.note && <span className="block text-sm text-muted">{m.note}</span>}
                      {m.until && (
                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            expired ? "bg-coral-soft text-coral" : "bg-sky-soft text-sky"
                          }`}
                        >
                          {expired ? "beendet am" : "bis"} {fmtMed(parse(m.until))}
                        </span>
                      )}
                    </span>
                    <Icon name="right" size={18} className="shrink-0 text-muted" />
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={m.active}
                    aria-label={`${m.name} ${m.active ? "pausieren" : "aktivieren"}`}
                    onClick={() => toggleActive(m.id)}
                    className="grid size-11 shrink-0 place-items-center"
                  >
                    <span
                      className={`flex h-7 w-12 items-center rounded-full border border-line p-0.5 transition-colors ${
                        m.active ? "justify-end bg-forest" : "justify-start bg-field"
                      }`}
                    >
                      <span className={`size-5 rounded-full ${m.active ? "bg-onaccent" : "bg-muted"}`} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Button onClick={() => setEditing("new")} className="mt-4">
            <Icon name="plus" size={18} />
            Medikament hinzufügen
          </Button>

          {weekHasData && (
            <>
              <SectionTitle aside="Anteil genommener Dosen">Letzte 7 Tage</SectionTitle>
              <Card>
                <ul className="grid grid-cols-7 gap-2">
                  {week.map((w) => {
                    const pct = w.total ? Math.round((w.taken / w.total) * 100) : 0;
                    return (
                      <li
                        key={w.key}
                        className="flex flex-col items-center gap-1.5"
                        aria-label={`${fmtShort(w.d)}: ${w.total ? `${w.taken} von ${w.total} genommen` : "nichts geplant"}`}
                      >
                        <div className="flex h-20 w-full max-w-9 items-end overflow-hidden rounded-xl bg-sage">
                          <div
                            className={`w-full rounded-xl ${w.taken === w.total && w.total > 0 ? "bg-forest" : "bg-sun"}`}
                            style={{ height: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-ink">{weekdayFmt.format(w.d)}</span>
                        <span className="text-xs text-muted">{w.total ? `${w.taken}/${w.total}` : "–"}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </>
          )}
        </>
      )}

      <p className="mt-10 text-xs leading-relaxed text-muted">
        Die App ersetzt nicht deinen ärztlichen Medikationsplan. Ändere Dosierungen nur nach ärztlicher Verordnung.
      </p>

      {editing && (
        <MedSheet
          key={editing === "new" ? "new" : editing.id}
          med={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={remove}
        />
      )}
    </div>
  );
}

function MedSheet({
  med,
  onClose,
  onSave,
  onDelete,
}: {
  med: Medication | null;
  onClose: () => void;
  onSave: (m: Medication) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState(med?.name ?? "");
  const [dose, setDose] = useState(med?.dose ?? "");
  const [times, setTimes] = useState<string[]>(med ? med.times : ["08:00"]);
  const [note, setNote] = useState(med?.note ?? "");
  const [until, setUntil] = useState(med?.until ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const setTime = (i: number, v: string) => setTimes((t) => t.map((x, j) => (j === i ? v : x)));
  const addTime = (v = "12:00") => setTimes((t) => (t.includes(v) ? t : [...t, v]));

  const submit = () => {
    const clean = [...new Set(times.filter(Boolean))].sort();
    onSave({
      id: med?.id ?? uid(),
      name: name.trim(),
      dose: dose.trim(),
      times: clean,
      note: note.trim() || undefined,
      active: med?.active ?? true,
      until: until || undefined,
    });
  };

  return (
    <Sheet title={med ? "Medikament bearbeiten" : "Medikament hinzufügen"} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) submit();
        }}
      >
        <Field label="Name (Pflicht)">
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Ibuprofen"
            autoComplete="off"
            required
          />
        </Field>
        <Field label="Dosis">
          <input
            className={inputCls}
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="z. B. 1 Tablette, 5 mg"
            autoComplete="off"
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-muted">Einnahmezeiten</span>
          <ul className="space-y-2">
            {times.map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  className={inputCls}
                  value={t}
                  onChange={(e) => setTime(i, e.target.value)}
                  aria-label={`Einnahmezeit ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => setTimes((x) => x.filter((_, j) => j !== i))}
                  aria-label={`Einnahmezeit ${i + 1} entfernen`}
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-card text-ink hover:border-coral/40"
                >
                  <Icon name="close" size={18} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickTimes.map(([label, t]) => (
              <Chip key={t} active={times.includes(t)} onClick={() => addTime(t)}>
                {label} {t}
              </Chip>
            ))}
          </div>
          <Button variant="ghost" onClick={() => addTime()} className="mt-3">
            <Icon name="plus" size={18} />
            Zeit hinzufügen
          </Button>
        </div>

        <Field label="Hinweis">
          <input
            className={inputCls}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z. B. nach dem Essen"
            autoComplete="off"
          />
        </Field>
        <Field label="Einnahme bis (optional)">
          <input type="date" className={inputCls} value={until} onChange={(e) => setUntil(e.target.value)} />
        </Field>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" disabled={!name.trim()}>
            Speichern
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
        </div>

        {med && (
          <div className="border-t border-line pt-4">
            {confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted">Wirklich löschen?</span>
                <Button variant="danger" onClick={() => onDelete(med.id)}>
                  Ja, löschen
                </Button>
                <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Nein
                </Button>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                Medikament löschen
              </Button>
            )}
          </div>
        )}
      </form>
    </Sheet>
  );
}
