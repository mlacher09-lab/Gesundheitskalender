"use client";

import { useState } from "react";
import { fmtMed, iso, parse } from "@/lib/date";
import { uid, update } from "@/lib/store";
import type { ViewProps } from "./App";
import { Button, Card, Chip, Field, Icon, SectionTitle, Sheet } from "./ui";

const kasseIdeas = ["Gesundheits-Check-up", "Krebsfrüherkennung", "Schutzimpfung", "Zahnvorsorge", "Sportverein / Fitnessstudio", "Gesundheitskurs", "Sportabzeichen"];

export default function BonusView({ state, today }: ViewProps) {
  const [adding, setAdding] = useState<"zahn" | "kasse" | null>(null);
  const year = today.getFullYear();
  const zahn = state.bonus.filter((b) => b.program === "zahn");
  const kasse = state.bonus.filter((b) => b.program === "kasse").sort((a, b) => b.date.localeCompare(a.date));
  const stamped = new Set(zahn.map((b) => Number(b.date.slice(0, 4))));

  // Lückenlose Jahre rückwärts; das laufende Jahr darf noch offen sein
  let streak = 0;
  for (let y = stamped.has(year) ? year : year - 1; stamped.has(y); y--) streak++;
  const level = streak >= 10 ? 75 : streak >= 5 ? 70 : 60;
  const next = streak >= 10 ? null : streak >= 5 ? 10 - streak : 5 - streak;
  const years = Array.from({ length: 10 }, (_, i) => year - 9 + i);
  const kasseThisYear = kasse.filter((b) => b.date.startsWith(String(year))).length;

  const stampToday = () =>
    update((p) => ({
      ...p,
      bonus: [...p.bonus, { id: uid(), program: "zahn", title: "Zahnärztliche Kontrolle", date: iso(today) }],
      done: { ...p.done, "zahn-kontrolle-erwachsene": iso(today) },
    }));
  const remove = (id: string) => update((p) => ({ ...p, bonus: p.bonus.filter((b) => b.id !== id) }));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl">Bonusheft</h1>
      <p className="mt-2 text-muted">Regelmäßige Vorsorge zahlt sich aus – beim Zahnersatz und im Bonusprogramm deiner Krankenkasse.</p>

      <SectionTitle aside={`${streak} ${streak === 1 ? "Jahr" : "Jahre"} lückenlos`}>Zahn-Bonusheft</SectionTitle>
      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Festzuschuss zum Zahnersatz</p>
            <p className="font-display mt-1 text-5xl text-forest">{level} %</p>
          </div>
          <p className="max-w-56 text-sm leading-relaxed text-muted">
            {next === null
              ? "Höchste Stufe erreicht – weiter jedes Jahr zur Kontrolle gehen."
              : `Noch ${next} ${next === 1 ? "Jahr" : "Jahre"} lückenlos bis ${streak >= 5 ? 75 : 70} %.`}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {years.map((y) => {
            const on = stamped.has(y);
            return (
              <div
                key={y}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl border text-xs font-semibold ${
                  on ? "border-forest bg-forest text-onaccent" : y === year ? "border-dashed border-forest text-forest" : "border-line text-muted"
                }`}
                aria-label={`${y}: ${on ? "Kontrolle eingetragen" : "kein Eintrag"}`}
              >
                {on ? <Icon name="check" size={18} /> : <span className="h-[18px]" />}
                {y}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {!stamped.has(year) && (
            <Button onClick={stampToday}>
              <Icon name="check" size={18} /> Kontrolle heute eintragen
            </Button>
          )}
          <Button variant="ghost" onClick={() => setAdding("zahn")}>
            Früheren Besuch nachtragen
          </Button>
        </div>
        {zahn.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm">
            {[...zahn].sort((a, b) => b.date.localeCompare(a.date)).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 text-muted">
                <span>{fmtMed(parse(b.date))}{b.note && ` · ${b.note}`}</span>
                <button type="button" aria-label="Eintrag löschen" onClick={() => remove(b.id)} className="grid size-9 place-items-center rounded-full hover:bg-line/60">
                  <Icon name="trash" size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Erwachsene brauchen eine Kontrolle pro Kalenderjahr, Kinder und Jugendliche von 6 bis 17 eine pro Halbjahr. Maßgeblich bleibt das gestempelte Bonusheft der Zahnarztpraxis. Stufen (60, 70, 75 %) laut{" "}
          <a href="https://www.bundesgesundheitsministerium.de/zahnaerztliche-behandlung" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            Bundesgesundheitsministerium
          </a>
          .
        </p>
      </Card>

      <SectionTitle aside={`${kasseThisYear} in ${year}`}>Bonusprogramm der Krankenkasse</SectionTitle>
      <Card>
        <p className="text-[15px] leading-relaxed text-muted">
          Viele Kassen belohnen Vorsorge, Impfungen und Sport mit Prämien. Sammle hier deine Nachweise, damit du sie am Jahresende gesammelt einreichen kannst.
        </p>
        <Button className="mt-4" onClick={() => setAdding("kasse")}>
          <Icon name="plus" size={18} /> Nachweis eintragen
        </Button>
        {kasse.length > 0 && (
          <div className="mt-4 divide-y divide-line">
            {kasse.map((b) => (
              <div key={b.id} className="flex items-center gap-3 py-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sun-soft text-sun">
                  <Icon name="star" size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{b.title}</span>
                  <span className="block text-sm text-muted">{fmtMed(parse(b.date))}{b.note && ` · ${b.note}`}</span>
                </span>
                <button type="button" aria-label={`${b.title} löschen`} onClick={() => remove(b.id)} className="grid size-10 place-items-center rounded-full text-muted hover:bg-line/60">
                  <Icon name="trash" size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {adding && <AddBonus program={adding} today={today} onClose={() => setAdding(null)} />}
    </div>
  );
}

function AddBonus({ program, today, onClose }: { program: "zahn" | "kasse"; today: Date; onClose: () => void }) {
  const [title, setTitle] = useState(program === "zahn" ? "Zahnärztliche Kontrolle" : "");
  const [date, setDate] = useState(iso(today));
  const [note, setNote] = useState("");
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    update((p) => ({ ...p, bonus: [...p.bonus, { id: uid(), program, title: title.trim(), date, note: note.trim() || undefined }] }));
    onClose();
  };
  return (
    <Sheet title={program === "zahn" ? "Zahnarztbesuch nachtragen" : "Nachweis eintragen"} onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        {program === "kasse" && (
          <>
            <div className="flex flex-wrap gap-2">
              {kasseIdeas.map((k) => (
                <Chip key={k} active={title === k} onClick={() => setTitle(k)}>
                  {k}
                </Chip>
              ))}
            </div>
            <Field label="Maßnahme">
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
          </>
        )}
        <Field label="Datum">
          <input type="date" required max={iso(today)} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Notiz (optional)">
          <input type="text" placeholder={program === "zahn" ? "z. B. Praxis" : "z. B. Stempel im Bonusheft der Kasse"} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full">
          Speichern
        </Button>
      </form>
    </Sheet>
  );
}
