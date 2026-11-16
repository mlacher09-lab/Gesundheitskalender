"use client";

import { cyclePhaseTips } from "@/data/empfehlungen";
import { cycleInfo } from "@/lib/cycle";
import { addDays, fmtMed, fmtShort, iso, relative } from "@/lib/date";
import { update } from "@/lib/store";
import type { ViewProps } from "./App";
import CycleRing from "./CycleRing";
import { Button, Card, Chip, Icon, SectionTitle } from "./ui";

const symptomList = ["Krämpfe", "Kopfschmerzen", "Müde", "Stimmungstief", "Energiegeladen", "Brustspannen", "Heißhunger", "Schlecht geschlafen"];

export default function CycleView({ state, profile, today, go }: ViewProps) {
  const info = cycleInfo(state.periodDays, profile, today);
  const key = iso(today);
  const isPeriod = state.periodDays.includes(key);
  const todays = state.symptoms[key] ?? [];

  const togglePeriod = () =>
    update((s) => ({
      ...s,
      periodDays: isPeriod ? s.periodDays.filter((d) => d !== key) : [...s.periodDays, key],
    }));
  const toggleSymptom = (name: string) =>
    update((s) => {
      const cur = s.symptoms[key] ?? [];
      return {
        ...s,
        symptoms: { ...s.symptoms, [key]: cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name] },
      };
    });

  const tip = info ? cyclePhaseTips[info.phase] : null;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-4xl md:text-5xl">Zyklus</h1>

      {!info ? (
        <Card className="mt-6 bg-plum-soft">
          <h2 className="font-display text-2xl">Noch keine Periode erfasst</h2>
          <p className="mt-2 max-w-md text-muted">
            Trag den ersten Tag deiner letzten Periode ein – ab dann berechnet die App Zyklustag, Phase und Prognose.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={togglePeriod}>Periode hat heute begonnen</Button>
            <Button variant="ghost" onClick={() => go("kalender")}>Im Kalender eintragen</Button>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="flex flex-col items-center text-center">
            <CycleRing info={info} size={220} />
            <p className="mt-2 text-sm font-semibold text-plum">
              {tip!.label}
            </p>
            <p className="font-display mt-1 text-2xl">
              {info.late ? "Periode überfällig" : `Nächste Periode ${relative(info.nextStart, today)}`}
            </p>
            <p className="mt-1 text-sm text-muted">voraussichtlich am {fmtMed(info.nextStart)}</p>
            <Button variant={isPeriod ? "ghost" : "primary"} onClick={togglePeriod} className="mt-5">
              <Icon name="cycle" size={18} />
              {isPeriod ? "Heute keine Periode" : "Periode heute eintragen"}
            </Button>
          </Card>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Zykluslänge", `${info.length}`, "Tage"],
                ["Eisprung", fmtShort(addDays(info.lastStart, info.ovulationDay - 1)), "geschätzt"],
                ["Erfasst", `${info.tracked}`, info.tracked === 1 ? "Zyklus" : "Zyklen"],
              ].map(([l, v, u]) => (
                <div key={l} className="rounded-2xl border border-line bg-card p-3.5">
                  <p className="text-xs font-medium text-muted">{l}</p>
                  <p className="font-display mt-1 text-2xl leading-tight">{v}</p>
                  <p className="text-xs text-muted">{u}</p>
                </div>
              ))}
            </div>
            <Card>
              <h2 className="font-semibold">Wie geht es dir heute?</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {symptomList.map((s) => (
                  <Chip key={s} active={todays.includes(s)} onClick={() => toggleSymptom(s)}>{s}</Chip>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tip && (
        <>
          <SectionTitle aside="angepasst an deine Phase">In dieser Phase</SectionTitle>
          <p className="mb-4 max-w-2xl text-muted">{tip.summary}</p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["run", "Training", tip.training, "bg-sage text-forest"],
              ["leaf", "Ernährung", tip.ernaehrung, "bg-sun-soft text-sun"],
              ["mind", "Wohlbefinden", tip.wohlbefinden, "bg-plum-soft text-plum"],
            ].map(([icon, title, text, cls]) => (
              <Card key={title}>
                <span className={`grid size-10 place-items-center rounded-xl ${cls}`}><Icon name={icon} /></span>
                <h3 className="font-display mt-3 text-xl">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{text}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      <p className="mt-10 text-xs leading-relaxed text-muted">
        Prognosen sind Schätzungen auf Basis deiner bisherigen Zyklen und nicht zur Verhütung oder Familienplanung geeignet.
      </p>
    </div>
  );
}
