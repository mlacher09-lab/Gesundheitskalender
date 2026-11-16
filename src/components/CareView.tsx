"use client";

import { useState } from "react";
import type { CareCategory } from "@/data/vorsorge";
import { careEntries, categoryMeta, type CareEntry } from "@/lib/care";
import type { ViewProps } from "./App";
import { CareRow, CareSheet } from "./CareParts";
import { Chip, SectionTitle } from "./ui";

export default function CareView({ state, profile, today }: ViewProps) {
  const [cat, setCat] = useState<CareCategory | "all">("all");
  const [open, setOpen] = useState<CareEntry | null>(null);

  const all = careEntries(profile, state.done, today, state.skipped);
  const cats = [...new Set(all.map((e) => e.item.category))];
  const entries = all.filter((e) => cat === "all" || e.item.category === cat);

  const byDue = (a: CareEntry, b: CareEntry) =>
    (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0);
  const groups: { title: string; hint: string; items: CareEntry[] }[] = [
    { title: "Jetzt fällig", hint: "offen oder überfällig", items: entries.filter((e) => e.status === "due").sort(byDue) },
    { title: "Demnächst", hint: "in den nächsten 6 Monaten", items: entries.filter((e) => e.status === "soon").sort(byDue) },
    { title: "Im Plan", hint: "nächster Termin steht fest", items: entries.filter((e) => e.status === "ok").sort(byDue) },
    { title: "Später im Leben", hint: "wird mit dem Alter relevant", items: entries.filter((e) => e.status === "later").sort(byDue) },
    { title: "Abgeschlossen", hint: "", items: entries.filter((e) => e.status === "done") },
  ];
  const planned = all.filter((e) => e.status !== "later");
  const good = planned.filter((e) => e.status !== "due").length;
  const pct = planned.length ? Math.round((good / planned.length) * 100) : 100;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl">Vorsorge & Impfungen</h1>
      <p className="mt-2 max-w-xl text-muted">
        Berechnet aus deinem Alter nach den Empfehlungen von G-BA und STIKO. Trag ein, was du schon gemacht hast – der Rest plant sich von selbst.
      </p>

      <div className="mt-6 rounded-3xl border border-line bg-card p-5">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">Dein Vorsorge-Stand</span>
          <span className="font-display text-2xl text-forest">{pct} %</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sage">
          <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted">
          {good} von {planned.length} aktuell relevanten Punkten sind erledigt oder geplant.
        </p>
      </div>

      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>Alle</Chip>
        {cats.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
            {categoryMeta[c].label}
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        {groups
          .filter((g) => g.items.length)
          .map((g) => (
            <div key={g.title}>
              <SectionTitle aside={`${g.items.length}${g.hint ? ` · ${g.hint}` : ""}`}>{g.title}</SectionTitle>
              <div className="space-y-2">
                {g.items.map((e) => (
                  <CareRow key={e.item.id} entry={e} today={today} onOpen={setOpen} />
                ))}
              </div>
            </div>
          ))}
      </div>

      <p className="mt-10 text-xs leading-relaxed text-muted">
        Die Angaben dienen der Orientierung und ersetzen keine ärztliche Beratung. Bei Vorerkrankungen oder familiärem Risiko können andere Intervalle gelten.
      </p>

      {open && <CareSheet entry={open} today={today} onClose={() => setOpen(null)} />}
    </div>
  );
}
