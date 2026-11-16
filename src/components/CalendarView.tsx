"use client";

import { useState } from "react";
import { careEntries } from "@/lib/care";
import { cycleInfo, cycleMarks } from "@/lib/cycle";
import { addDays, fmtLong, fmtMonth, iso } from "@/lib/date";
import { uid, update, type Doctor } from "@/lib/store";
import type { ViewProps } from "./App";
import VisitSheet from "./VisitSheet";
import { Button, Field, Icon, Sheet } from "./ui";

const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default function CalendarView({ app, state, profile, today }: ViewProps) {
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(iso(today));
  const [adding, setAdding] = useState(false);
  const [visitId, setVisitId] = useState<string | null>(null);
  const visit = state.appointments.find((a) => a.id === visitId);

  const info = profile.cycleEnabled ? cycleInfo(state.periodDays, profile, today) : null;
  const marks = profile.cycleEnabled ? cycleMarks(state.periodDays, info) : new Map();

  const careDue = new Map<string, string[]>();
  for (const e of careEntries(profile, state.done, today, state.skipped)) {
    if (e.dueDate && (e.status === "soon" || e.status === "ok")) {
      const k = iso(e.dueDate);
      careDue.set(k, [...(careDue.get(k) ?? []), e.item.title]);
    }
  }
  const appts = new Map<string, typeof state.appointments>();
  for (const a of state.appointments) appts.set(a.date, [...(appts.get(a.date) ?? []), a]);

  const offset = (month.getDay() + 6) % 7;
  const gridStart = addDays(month, -offset);
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  const selDate = days.find((d) => iso(d) === selected) ?? today;
  const selAppts = (appts.get(selected) ?? []).sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  const selMark = marks.get(selected);
  const isPeriod = state.periodDays.includes(selected);

  const togglePeriod = () =>
    update((s) => ({
      ...s,
      periodDays: isPeriod ? s.periodDays.filter((d) => d !== selected) : [...s.periodDays, selected],
    }));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl capitalize md:text-5xl">{fmtMonth(month)}</h1>
        <div className="flex gap-1.5">
          <button type="button" aria-label="Vorheriger Monat" onClick={() => shift(-1)} className="grid size-11 place-items-center rounded-full border border-line bg-card">
            <Icon name="left" />
          </button>
          <button type="button" aria-label="Nächster Monat" onClick={() => shift(1)} className="grid size-11 place-items-center rounded-full border border-line bg-card">
            <Icon name="right" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <div className="rounded-3xl border border-line bg-card p-3 md:p-4">
            <div className="grid grid-cols-7 pb-2 text-center text-xs font-semibold uppercase text-muted">
              {weekdays.map((w) => <span key={w}>{w}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {days.map((d) => {
                const k = iso(d);
                const out = d.getMonth() !== month.getMonth();
                const mark = marks.get(k);
                const isToday = k === iso(today);
                const isSel = k === selected;
                const bg =
                  mark === "period" ? "bg-plum text-onaccent"
                  : mark === "predicted" ? "border border-dashed border-plum/60 text-plum"
                  : mark === "ovulation" ? "bg-teal-soft text-teal"
                  : mark === "fertile" ? "bg-teal-soft/50"
                  : "";
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelected(k)}
                    aria-pressed={isSel}
                    className={`relative mx-auto flex aspect-square w-full max-w-14 flex-col items-center justify-center rounded-2xl text-[15px] transition-colors ${bg} ${out ? "opacity-30" : ""} ${isSel ? "ring-2 ring-forest ring-offset-2 ring-offset-card" : ""} ${isToday ? "font-bold" : ""} ${isToday && !mark ? "bg-sage text-forest" : ""}`}
                  >
                    {d.getDate()}
                    <span className="absolute bottom-1.5 flex gap-0.5">
                      {appts.has(k) && <span className={`size-1.5 rounded-full ${mark === "period" ? "bg-field" : "bg-coral"}`} />}
                      {careDue.has(k) && <span className="size-1.5 rounded-full bg-sun" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 px-1 text-xs text-muted">
            <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-coral" /> Termin</span>
            <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-sun" /> Vorsorge fällig</span>
            {profile.cycleEnabled && (
              <>
                <span className="flex items-center gap-1.5"><i className="size-3 rounded bg-plum" /> Periode</span>
                <span className="flex items-center gap-1.5"><i className="size-3 rounded border border-dashed border-plum" /> Prognose</span>
                <span className="flex items-center gap-1.5"><i className="size-3 rounded bg-teal-soft" /> fruchtbare Tage</span>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl capitalize">{fmtLong(selDate)}</h2>
          <div className="mt-3 space-y-2">
            {selAppts.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-line bg-card p-3.5">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-coral" />
                <button type="button" onClick={() => setVisitId(a.id)} className="min-w-0 flex-1 text-left">
                  <span className="block font-semibold">{a.title}</span>
                  <span className="block text-sm text-muted">
                    {a.time ? `${a.time} Uhr` : "ganztägig"}{a.note && ` · ${a.note}`}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-forest">
                    <Icon name="note" size={14} />
                    {a.questions?.length || a.bring?.length || a.after ? "Vorbereitung ansehen" : "Termin vorbereiten"}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`${a.title} löschen`}
                  onClick={() => update((s) => ({ ...s, appointments: s.appointments.filter((x) => x.id !== a.id) }))}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-line/60"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            ))}
            {(careDue.get(selected) ?? []).map((t) => (
              <div key={t} className="flex items-center gap-3 rounded-2xl bg-sun-soft p-3.5">
                <span className="size-2.5 shrink-0 rounded-full bg-sun" />
                <span><span className="font-semibold">{t}</span> <span className="text-sm text-muted">wird fällig</span></span>
              </div>
            ))}
            {selMark && selMark !== "period" && (
              <div className="rounded-2xl bg-plum-soft p-3.5 text-sm">
                {selMark === "predicted" ? "Periode voraussichtlich (Prognose)" : selMark === "ovulation" ? "Eisprung voraussichtlich" : "Voraussichtlich fruchtbarer Tag"}
              </div>
            )}
            {!selAppts.length && !careDue.has(selected) && !selMark && (
              <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">Nichts eingetragen.</p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => setAdding(true)}><Icon name="plus" size={18} /> Termin</Button>
            {profile.cycleEnabled && (
              <Button variant="ghost" onClick={togglePeriod}>
                <Icon name="cycle" size={18} className="text-plum" />
                {isPeriod ? "Periode entfernen" : "Periode eintragen"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {adding && <AddSheet date={selected} doctors={app.doctors} onClose={() => setAdding(false)} />}
      {visit && <VisitSheet appointment={visit} doctors={app.doctors} onClose={() => setVisitId(null)} />}
    </div>
  );
}

function AddSheet({ date, doctors, onClose }: { date: string; doctors: Doctor[]; onClose: () => void }) {
  const [doctorId, setDoctorId] = useState("");
  const [title, setTitle] = useState("");
  const [d, setD] = useState(date);
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !d) return;
    update((s) => ({
      ...s,
      appointments: [...s.appointments, { id: uid(), title: title.trim(), date: d, time: time || undefined, note: note.trim() || undefined, doctorId: doctorId || undefined }],
    }));
    onClose();
  };
  return (
    <Sheet title="Neuer Termin" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Was?">
          <input type="text" required autoFocus placeholder="z. B. Hausarzt, Physiotherapie" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Datum"><input type="date" required value={d} onChange={(e) => setD(e.target.value)} /></Field>
          <Field label="Uhrzeit"><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
        </div>
        {doctors.length > 0 && (
          <Field label="Praxis (optional)">
            <select
              value={doctorId}
              onChange={(e) => {
                setDoctorId(e.target.value);
                const d = doctors.find((x) => x.id === e.target.value);
                if (d && !title.trim()) setTitle(d.specialty);
              }}
            >
              <option value="">Keine ausgewählt</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Notiz (optional)">
          <input type="text" placeholder="z. B. Impfpass mitnehmen" value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full">Speichern</Button>
      </form>
    </Sheet>
  );
}
