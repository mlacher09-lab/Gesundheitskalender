"use client";

import { useEffect, useState } from "react";
import type { Destination, TravelLevel, TravelVaccine } from "@/data/reise";
import { careEntries } from "@/lib/care";
import { addDays, fmtMed, iso, parse } from "@/lib/date";
import { uid, update } from "@/lib/store";
import type { ViewProps } from "./App";
import { Button, Card, Field, Icon, SectionTitle } from "./ui";

type TravelData = typeof import("@/data/reise");

const levels: { id: TravelLevel; title: string; hint: string; cls: string }[] = [
  { id: "pflicht", title: "Vorgeschrieben", hint: "Nachweis bei der Einreise", cls: "bg-coral text-onaccent" },
  { id: "empfohlen", title: "Für alle Reisenden empfohlen", hint: "", cls: "bg-forest text-onaccent" },
  { id: "situativ", title: "Je nach Art der Reise", hint: "z. B. Langzeitaufenthalt, einfache Verhältnisse, Tierkontakt", cls: "bg-sun-soft text-sun" },
];

export default function TravelView({ state, profile, today, go }: ViewProps) {
  // Die Ländertabelle ist groß und wird erst beim Öffnen dieser Ansicht geladen
  const [data, setData] = useState<TravelData | null>(null);
  useEffect(() => {
    let alive = true;
    import("@/data/reise").then((m) => alive && setData(m));
    return () => {
      alive = false;
    };
  }, []);

  const [query, setQuery] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [planned, setPlanned] = useState(false);

  const q = query.trim().toLowerCase();
  const matches: Destination[] =
    data && q ? data.destinations.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 8) : [];
  const dest = data?.destinations.find((d) => d.code === code) ?? null;
  const byId = new Map<string, TravelVaccine>(data?.travelVaccines.map((v) => [v.id, v]));
  const openStandard = careEntries(profile, state.done, today, state.skipped).filter(
    (e) => e.item.category === "impfung" && e.status === "due",
  ).length;

  const logged = (name: string) => {
    const key = name.toLowerCase();
    return state.vaccLog.filter((v) => v.name.toLowerCase().includes(key)).sort((a, b) => b.date.localeCompare(a.date))[0];
  };
  const planVisit = () => {
    if (!dest) return;
    const ideal = date ? addDays(parse(date), -42) : today;
    const when = ideal < today ? today : ideal;
    update((p) => ({
      ...p,
      appointments: [
        ...p.appointments,
        { id: uid(), title: `Reiseimpfberatung ${dest.name}`, date: iso(when), bring: ["Impfpass", "Versichertenkarte"] },
      ],
    }));
    setPlanned(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl">Reiseimpfungen</h1>
      <p className="mt-2 text-muted">Wohin geht es? Hier siehst du, welche Impfungen STIKO und DTG für dein Reiseziel empfehlen.</p>

      <Card className="mt-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <Field label="Reiseziel">
            <input
              type="text"
              placeholder={data ? "Land eingeben, z. B. Thailand" : "Länder werden geladen …"}
              value={query}
              disabled={!data}
              onChange={(e) => {
                setQuery(e.target.value);
                setCode(null);
                setPlanned(false);
              }}
            />
          </Field>
          <Field label="Abreise (optional)">
            <input type="date" min={iso(today)} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        {!dest && matches.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {matches.map((d) => (
              <button
                key={d.code}
                type="button"
                onClick={() => {
                  setCode(d.code);
                  setQuery(d.name);
                }}
                className="min-h-11 rounded-full border border-line bg-card px-4 text-[15px] font-medium hover:border-forest/40"
              >
                {d.name} <span className="text-muted">· {d.region}</span>
              </button>
            ))}
          </div>
        )}
        {!dest && q && data && !matches.length && <p className="mt-3 text-sm text-muted">Kein Land gefunden.</p>}
      </Card>

      {dest && data && (
        <>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">{dest.region}</p>
              <h2 className="font-display text-3xl">{dest.name}</h2>
            </div>
            <Button variant={planned ? "ghost" : "primary"} onClick={planVisit} disabled={planned}>
              <Icon name={planned ? "check" : "calendar"} size={18} />
              {planned ? "Beratung im Kalender" : "Beratungstermin eintragen"}
            </Button>
          </div>

          {openStandard > 0 && (
            <button type="button" onClick={() => go("impfpass")} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-sun-soft p-4 text-left">
              <Icon name="syringe" className="shrink-0 text-sun" />
              <span className="flex-1 text-[15px]">
                <strong className="font-semibold">Erst die Standardimpfungen prüfen:</strong> {openStandard}{" "}
                {openStandard === 1 ? "ist" : "sind"} im Impfpass noch offen.
              </span>
              <Icon name="right" size={16} />
            </button>
          )}

          {levels.map((l) => {
            const list = dest.vaccines.filter((v) => v.level === l.id);
            if (!list.length) return null;
            return (
              <div key={l.id}>
                <SectionTitle aside={l.hint || undefined}>{l.title}</SectionTitle>
                <div className="space-y-2">
                  {list.map((v) => {
                    const meta = byId.get(v.id);
                    if (!meta) return null;
                    const had = logged(meta.name);
                    const start = date ? addDays(parse(date), -meta.leadWeeks * 7) : null;
                    return (
                      <div key={v.id} className="rounded-2xl border border-line bg-card p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="mr-auto font-semibold">{meta.name}</h3>
                          {had && (
                            <span className="rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-forest">
                              eingetragen {fmtMed(parse(had.date))}
                            </span>
                          )}
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${l.cls}`}>
                            {l.id === "pflicht" ? "Pflicht" : l.id === "empfohlen" ? "Empfohlen" : "Situativ"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{meta.description}</p>
                        {v.note && <p className="mt-2 rounded-xl bg-sun-soft p-3 text-sm leading-relaxed">{v.note}</p>}
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          <strong className="font-semibold text-ink">Übliches Schema:</strong> {meta.schedule}
                          {start && (
                            <>
                              {" "}
                              · <strong className="font-semibold text-ink">Beginn spätestens {start < today ? "jetzt" : fmtMed(start)}</strong>
                            </>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {dest.malaria && dest.malaria !== "kein" && (
            <p className="mt-6 rounded-2xl bg-coral-soft p-4 text-[15px] leading-relaxed">
              <strong className="font-semibold">Malaria-Risiko:</strong> Für dieses Land ist ein Malaria-Risiko gemeldet. Ob Mückenschutz genügt oder Medikamente sinnvoll sind, klärt die reisemedizinische Beratung.
            </p>
          )}
          {dest.note && <p className="mt-4 rounded-2xl border border-line bg-card p-4 text-sm leading-relaxed text-muted">{dest.note}</p>}

          <p className="mt-8 text-xs leading-relaxed text-muted">
            Länderangaben:{" "}
            <a href={data.travelSource.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {data.travelSource.label}
            </a>
            . Impfschemata und Vorlaufzeiten sind Richtwerte. Einreisevorschriften können sich kurzfristig ändern – bitte vor der Reise ärztlich beraten lassen, am besten 6 bis 8 Wochen vorher.
          </p>
        </>
      )}
    </div>
  );
}
