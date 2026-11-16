"use client";

import { useState } from "react";
import { cyclePhaseTips, recommendations } from "@/data/empfehlungen";
import { careEntries, type CareEntry } from "@/lib/care";
import { cycleInfo } from "@/lib/cycle";
import { addDays, ageAt, diffDays, fmtLong, fmtShort, iso, parse, relative } from "@/lib/date";
import type { ViewProps } from "./App";
import { CareRow, CareSheet } from "./CareParts";
import CycleRing from "./CycleRing";
import { recIcon } from "./RecsView";
import { Card, Icon, SectionTitle } from "./ui";

export default function Today({ state, profile, today, go }: ViewProps) {
  const [open, setOpen] = useState<CareEntry | null>(null);
  const entries = careEntries(profile, state.done, today, state.skipped);
  const due = entries.filter((e) => e.status === "due");
  const soon = entries.filter((e) => e.status === "soon");
  const age = ageAt(parse(profile.birthDate), today);
  const info = profile.cycleEnabled ? cycleInfo(state.periodDays, profile, today) : null;

  const upcoming = state.appointments
    .filter((a) => a.date >= iso(today))
    .sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")))
    .slice(0, 3);

  const recs = recommendations.filter(
    (r) =>
      age >= r.ageFrom &&
      (r.ageTo === null || age < r.ageTo + 1) &&
      (r.sex === "all" || profile.sex === "all" || r.sex === profile.sex),
  );
  const rec = recs.length ? recs[diffDays(new Date(2024, 0, 1), today) % recs.length] : null;

  const hour = today.getHours();
  const greeting = hour < 11 ? "Guten Morgen" : hour < 18 ? "Hallo" : "Guten Abend";
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const apptDays = new Set(state.appointments.map((a) => a.date));

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-medium capitalize text-muted">{fmtLong(today)}</p>
      <h1 className="font-display mt-1 text-4xl md:text-5xl">
        {greeting}
        {profile.name && `, ${profile.name}`}
      </h1>

      {/* Wochenleiste */}
      <div className="mt-6 grid grid-cols-7 gap-1.5">
        {week.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go("kalender")}
            className={`flex flex-col items-center rounded-2xl border py-2.5 ${
              i === 0 ? "border-forest bg-forest text-white" : "border-line bg-card"
            }`}
          >
            <span className={`text-[11px] font-medium uppercase ${i === 0 ? "text-white/70" : "text-muted"}`}>
              {d.toLocaleDateString("de-DE", { weekday: "short" }).slice(0, 2)}
            </span>
            <span className="font-display text-xl leading-tight">{d.getDate()}</span>
            <span className={`mt-0.5 size-1.5 rounded-full ${apptDays.has(iso(d)) ? (i === 0 ? "bg-white" : "bg-coral") : "bg-transparent"}`} />
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {/* Vorsorge-Status */}
        <button
          type="button"
          onClick={() => go("vorsorge")}
          className="relative overflow-hidden rounded-3xl bg-forest p-6 text-left text-white md:col-span-3"
        >
          <span className="absolute -right-10 -top-10 size-44 rounded-full bg-white/5" />
          <span className="absolute -bottom-16 right-10 size-40 rounded-full bg-white/5" />
          <span className="text-sm font-medium text-white/70">Deine Vorsorge</span>
          <span className="mt-3 flex items-end gap-4">
            <span className="font-display text-7xl leading-none">{due.length}</span>
            <span className="pb-1.5 text-lg leading-snug">
              {due.length === 1 ? "Untersuchung" : "Untersuchungen"}
              <br />
              <span className="text-white/70">offen oder fällig</span>
            </span>
          </span>
          <span className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/12 px-3 py-1">{soon.length} demnächst</span>
            <span className="rounded-full bg-white/12 px-3 py-1">
              {entries.filter((e) => e.status === "ok" || e.status === "done").length} im Plan
            </span>
            <span className="ml-auto inline-flex items-center gap-1 font-semibold">
              Ansehen <Icon name="right" size={16} />
            </span>
          </span>
        </button>

        {/* Zyklus oder Termine */}
        {info ? (
          <button
            type="button"
            onClick={() => go("zyklus")}
            className="flex items-center gap-4 rounded-3xl border border-line bg-card p-5 text-left md:col-span-2"
          >
            <CycleRing info={info} size={128} />
            <span>
              <span className="text-sm font-medium text-plum">{cyclePhaseTips[info.phase].label}</span>
              <span className="font-display mt-1 block text-2xl leading-tight">
                {info.late ? "Periode überfällig" : `Periode ${relative(info.nextStart, today)}`}
              </span>
              <span className="mt-1 block text-sm text-muted">
                voraussichtlich {fmtShort(info.nextStart)}
              </span>
            </span>
          </button>
        ) : (
          <Card className="md:col-span-2">
            <p className="text-sm font-medium text-muted">Dein Alter</p>
            <p className="font-display mt-2 text-5xl">{Math.floor(age)}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Dein Plan passt sich automatisch an, sobald neue Untersuchungen für dich relevant werden.
            </p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        <div className="min-w-0">
          <SectionTitle aside={<button type="button" className="underline underline-offset-4" onClick={() => go("vorsorge")}>Alle</button>}>
            Als Nächstes
          </SectionTitle>
          <div className="space-y-2">
            {[...due, ...soon].slice(0, 4).map((e) => (
              <CareRow key={e.item.id} entry={e} today={today} onOpen={setOpen} />
            ))}
            {!due.length && !soon.length && (
              <Card><p className="text-muted">Alles erledigt – aktuell steht nichts an. 🎉</p></Card>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <SectionTitle aside={<button type="button" className="underline underline-offset-4" onClick={() => go("kalender")}>Kalender</button>}>
            Termine
          </SectionTitle>
          <div className="space-y-2">
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center gap-3.5 rounded-2xl border border-line bg-card p-3.5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-coral-soft text-center leading-none text-coral">
                  <span>
                    <span className="font-display block text-lg">{parse(a.date).getDate()}</span>
                    <span className="block text-[10px] font-semibold uppercase">
                      {parse(a.date).toLocaleDateString("de-DE", { month: "short" }).replace(".", "")}
                    </span>
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{a.title}</span>
                  <span className="block truncate text-sm text-muted">
                    {relative(parse(a.date), today)}
                    {a.time && ` · ${a.time} Uhr`}
                    {a.note && ` · ${a.note}`}
                  </span>
                </span>
              </div>
            ))}
            {!upcoming.length && (
              <Card><p className="text-muted">Keine Termine eingetragen.</p></Card>
            )}
          </div>

          {rec && (
            <>
              <SectionTitle>Tipp des Tages</SectionTitle>
              <button type="button" onClick={() => go("tipps")} className="w-full rounded-3xl bg-sun-soft p-5 text-left">
                <span className="flex items-center gap-2 text-sm font-semibold text-sun">
                  <Icon name={recIcon[rec.category]} size={18} /> {rec.metric ?? rec.source}
                </span>
                <span className="font-display mt-2 block text-xl">{rec.title}</span>
                <span className="mt-1.5 block text-[15px] leading-relaxed text-ink/80">{rec.text}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {open && <CareSheet entry={open} today={today} onClose={() => setOpen(null)} />}
    </div>
  );
}
