"use client";

import { useState } from "react";
import { recommendations, type RecCategory } from "@/data/empfehlungen";
import { ageAt, parse } from "@/lib/date";
import type { ViewProps } from "./App";
import { Chip, Icon } from "./ui";

export const recIcon: Record<RecCategory, string> = {
  bewegung: "run",
  ernaehrung: "leaf",
  schlaf: "moon",
  mental: "mind",
  alltag: "sun",
};
const recMeta: Record<RecCategory, { label: string; cls: string }> = {
  bewegung: { label: "Bewegung", cls: "bg-sage text-forest" },
  ernaehrung: { label: "Ernährung", cls: "bg-sun-soft text-sun" },
  schlaf: { label: "Schlaf", cls: "bg-sky-soft text-sky" },
  mental: { label: "Mental", cls: "bg-plum-soft text-plum" },
  alltag: { label: "Alltag", cls: "bg-coral-soft text-coral" },
};

export default function RecsView({ profile, today }: ViewProps) {
  const [cat, setCat] = useState<RecCategory | "all">("all");
  const age = ageAt(parse(profile.birthDate), today);
  const mine = recommendations.filter(
    (r) =>
      age >= r.ageFrom &&
      (r.ageTo === null || age < r.ageTo + 1) &&
      (r.sex === "all" || profile.sex === "all" || r.sex === profile.sex),
  );
  const list = mine.filter((r) => cat === "all" || r.category === cat);
  const cats = (Object.keys(recMeta) as RecCategory[]).filter((c) => mine.some((r) => r.category === c));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-4xl md:text-5xl">Empfehlungen</h1>
      <p className="mt-2 text-muted">Ausgewählt für dein Alter ({Math.floor(age)} Jahre) – nach WHO, DGE und Fachgesellschaften.</p>

      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>Alle</Chip>
        {cats.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{recMeta[c].label}</Chip>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {list.map((r) => (
          <article key={r.id} className="flex flex-col rounded-3xl border border-line bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${recMeta[r.category].cls}`}>
                <Icon name={recIcon[r.category]} size={14} /> {recMeta[r.category].label}
              </span>
              {r.sourceUrl ? (
                <a href={r.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-muted underline underline-offset-2">
                  {r.source}
                </a>
              ) : (
                <span className="text-xs text-muted">{r.source}</span>
              )}
            </div>
            {r.metric && <p className="font-display mt-4 text-3xl text-forest">{r.metric}</p>}
            <h2 className={`font-semibold ${r.metric ? "mt-1" : "mt-4 text-lg"}`}>{r.title}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{r.text}</p>
          </article>
        ))}
      </div>

      <p className="mt-10 text-xs leading-relaxed text-muted">
        Allgemeine Empfehlungen für gesunde Menschen – sie ersetzen keine individuelle ärztliche Beratung.
      </p>
    </div>
  );
}
