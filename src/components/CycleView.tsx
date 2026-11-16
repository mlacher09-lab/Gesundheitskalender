"use client";

import { useState } from "react";
import { cyclePhaseTips } from "@/data/empfehlungen";
import { cycleInfo, type CycleInfo } from "@/lib/cycle";
import { cycleStats } from "@/lib/cycleStats";
import { addDays, diffDays, fmtMed, fmtShort, iso, relative } from "@/lib/date";
import { milestones, pregnancyInfo, pregnancySource } from "@/lib/pregnancy";
import { uid, update, type CycleMode, type Person } from "@/lib/store";
import type { ViewProps } from "./App";
import CycleReport from "./CycleReport";
import CycleRing from "./CycleRing";
import { Button, Card, Chip, Field, Icon, SectionTitle } from "./ui";

const baseSymptoms = ["Krämpfe", "Kopfschmerzen", "Müde", "Stimmungstief", "Energiegeladen", "Brustspannen", "Heißhunger", "Schlecht geschlafen"];
const symptomsByMode: Record<CycleMode, string[]> = {
  standard: baseSymptoms,
  kinderwunsch: [...baseSymptoms, "Mittelschmerz", "Zervixschleim spinnbar"],
  schwangerschaft: ["Übelkeit", "Müde", "Sodbrennen", "Rückenschmerzen", "Schlecht geschlafen", "Wassereinlagerungen", "Kindsbewegungen gespürt", "Energiegeladen"],
  wechseljahre: ["Hitzewallungen", "Schweißausbrüche", "Schlecht geschlafen", "Stimmungsschwankungen", "Müde", "Zwischenblutung", "Gelenkschmerzen", "Energiegeladen"],
};
const modes: { id: CycleMode; label: string }[] = [
  { id: "standard", label: "Zyklus" },
  { id: "kinderwunsch", label: "Kinderwunsch" },
  { id: "schwangerschaft", label: "Schwangerschaft" },
  { id: "wechseljahre", label: "Wechseljahre" },
];

export default function CycleView({ state, profile, today, go }: ViewProps) {
  const [report, setReport] = useState(false);
  const mode = profile.cycleMode ?? "standard";
  const info = cycleInfo(state.periodDays, profile, today);
  const stats = cycleStats(state);
  const key = iso(today);
  const isPeriod = state.periodDays.includes(key);
  const todays = state.symptoms[key] ?? [];

  const setMode = (m: CycleMode) =>
    update((s) => ({
      ...s,
      // Die Schwangerschaft schaltet zugleich die passenden Einträge im Vorsorgeplan frei
      profile: { ...s.profile, cycleMode: m, risk: { ...s.profile.risk, pregnant: m === "schwangerschaft" } },
    }));
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

  const symptomCard = (
    <Card>
      <h2 className="font-semibold">Wie geht es dir heute?</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {symptomsByMode[mode].map((s) => (
          <Chip key={s} active={todays.includes(s)} onClick={() => toggleSymptom(s)}>
            {s}
          </Chip>
        ))}
      </div>
    </Card>
  );
  const tip = info && mode !== "schwangerschaft" && mode !== "wechseljahre" ? cyclePhaseTips[info.phase] : null;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-4xl md:text-5xl">Zyklus</h1>
      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Modus">
        {modes.map((m) => (
          <Chip key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
            {m.label}
          </Chip>
        ))}
      </div>

      {mode === "schwangerschaft" ? (
        <Pregnancy state={state} info={info} today={today} symptomCard={symptomCard} />
      ) : mode === "wechseljahre" ? (
        <Menopause info={info} today={today} isPeriod={isPeriod} togglePeriod={togglePeriod} symptomCard={symptomCard} go={go} />
      ) : !info ? (
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
        <>
          {mode === "kinderwunsch" && <FertileCard info={info} today={today} />}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="flex flex-col items-center text-center">
              <CycleRing info={info} size={220} />
              <p className="mt-2 text-sm font-semibold text-plum">{cyclePhaseTips[info.phase].label}</p>
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
              {symptomCard}
            </div>
          </div>
        </>
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

      {stats.cycles.length > 0 && (
        <>
          <SectionTitle aside={`${stats.cycles.length} ${stats.cycles.length === 1 ? "Zyklus" : "Zyklen"} erfasst`}>Auswertung</SectionTitle>
          <Card>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {[
                ["Ø Zykluslänge", stats.avg === null ? "–" : String(stats.avg).replace(".", ","), "Tage"],
                ["Spanne", stats.min === null ? "–" : `${stats.min}–${stats.max}`, "Tage"],
                ["Ø Blutung", stats.avgPeriod === null ? "–" : String(stats.avgPeriod).replace(".", ","), "Tage"],
                ["Häufigste Beschwerde", stats.symptoms[0]?.name ?? "–", stats.symptoms[0] ? `an ${stats.symptoms[0].count} Tagen` : ""],
              ].map(([l, v, u]) => (
                <div key={l}>
                  <p className="text-xs font-medium text-muted">{l}</p>
                  <p className={`font-display mt-1 leading-tight ${l === "Häufigste Beschwerde" ? "text-lg" : "text-2xl"}`}>{v}</p>
                  <p className="text-xs text-muted">{u}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-5" onClick={() => setReport(true)}>
              <Icon name="note" size={18} /> Bericht für die Frauenarztpraxis (PDF)
            </Button>
          </Card>
        </>
      )}

      <p className="mt-10 text-xs leading-relaxed text-muted">
        Prognosen sind Schätzungen auf Basis deiner bisherigen Zyklen und nicht zur Verhütung geeignet.
      </p>

      {report && <CycleReport stats={stats} profile={profile} today={today} onClose={() => setReport(false)} />}
    </div>
  );
}

function FertileCard({ info, today }: { info: CycleInfo; today: Date }) {
  // Fruchtbares Fenster im laufenden Zyklus; liegt es schon zurück, das des nächsten
  let ovulation = addDays(info.lastStart, info.ovulationDay - 1);
  if (diffDays(ovulation, today) > 0) ovulation = addDays(ovulation, info.length);
  const first = addDays(ovulation, -5);
  const inWindow = today >= first && diffDays(today, ovulation) >= 0;
  return (
    <Card className="mt-6 bg-teal-soft">
      <p className="text-sm font-semibold text-teal">Fruchtbares Fenster</p>
      <p className="font-display mt-1 text-3xl">
        {inWindow ? "Jetzt – bis " : ""}
        {inWindow ? fmtShort(ovulation) : `${fmtShort(first)} – ${fmtShort(ovulation)}`}
      </p>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/80">
        {inWindow
          ? "Du bist voraussichtlich in deinen fruchtbaren Tagen. Der Eisprung wird für den letzten Tag des Fensters geschätzt."
          : `Die fruchtbaren Tage beginnen voraussichtlich ${relative(first, today)}.`}{" "}
        Die Berechnung beruht nur auf deinen Zyklusdaten – Ovulationstests oder Temperaturmessung sind genauer.
      </p>
      <p className="mt-3 rounded-2xl bg-card p-3.5 text-sm leading-relaxed">
        <strong className="font-semibold">Folsäure:</strong> Empfohlen werden 400 µg täglich, mindestens vier Wochen vor Beginn der Schwangerschaft und im ersten Drittel (DGE).
      </p>
    </Card>
  );
}

function Pregnancy({
  state,
  info,
  today,
  symptomCard,
}: {
  state: Person;
  info: CycleInfo | null;
  today: Date;
  symptomCard: React.ReactNode;
}) {
  const due = state.profile.dueDate;
  const setDue = (d: string | undefined) => update((s) => ({ ...s, profile: { ...s.profile, dueDate: d } }));

  if (!due)
    return (
      <Card className="mt-6 bg-plum-soft">
        <h2 className="font-display text-2xl">Herzlichen Glückwunsch!</h2>
        <p className="mt-2 max-w-md text-muted">
          Trag den errechneten Entbindungstermin aus dem Mutterpass ein – dann zeigt die App deine Schwangerschaftswoche und die anstehenden Vorsorgetermine.
        </p>
        <div className="mt-4 max-w-xs">
          <Field label="Errechneter Entbindungstermin">
            <input type="date" min={iso(today)} max={iso(addDays(today, 300))} onChange={(e) => e.target.value && setDue(e.target.value)} />
          </Field>
        </div>
        {info && (
          <Button variant="ghost" className="mt-3" onClick={() => setDue(iso(addDays(info.lastStart, 280)))}>
            Aus letzter Periode berechnen ({fmtMed(addDays(info.lastStart, 280))})
          </Button>
        )}
      </Card>
    );

  const p = pregnancyInfo(due, today);
  const planned = new Set(state.appointments.map((a) => a.title));
  const plan = (title: string, from: number) =>
    update((s) => ({
      ...s,
      appointments: [...s.appointments, { id: uid(), title, date: iso(addDays(p.start, from)), bring: ["Mutterpass", "Versichertenkarte"] }],
    }));

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-plum">{p.trimester}. Schwangerschaftsdrittel</p>
          <p className="font-display mt-1 text-6xl leading-none">
            {p.week}+{p.day}
          </p>
          <p className="mt-1 text-muted">Schwangerschaftswoche (SSW) · {p.week + 1}. Woche</p>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-plum-soft">
            <div className="h-full rounded-full bg-plum" style={{ width: `${Math.min(100, (p.days / 280) * 100)}%` }} />
          </div>
          <p className="mt-2 flex justify-between text-sm text-muted">
            <span>Termin {fmtMed(p.due)}</span>
            <span>{p.daysLeft >= 0 ? `noch ${p.daysLeft} Tage` : `${-p.daysLeft} Tage über Termin`}</span>
          </p>
          <button type="button" onClick={() => setDue(undefined)} className="mt-4 text-sm font-medium text-muted underline underline-offset-4">
            Termin ändern
          </button>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="font-semibold">Vorsorge-Rhythmus</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">
              Untersuchungen im Allgemeinen alle vier Wochen, in den letzten zwei Schwangerschaftsmonaten alle zwei Wochen.
            </p>
          </Card>
          {symptomCard}
        </div>
      </div>

      <SectionTitle aside="nach Mutterschafts-Richtlinie">Wichtige Termine</SectionTitle>
      <div className="space-y-2">
        {milestones.map((m) => {
          const from = addDays(p.start, m.from);
          const to = addDays(p.start, m.to);
          const status = p.days > m.to ? "past" : p.days >= m.from ? "now" : "next";
          return (
            <div key={m.id} className={`rounded-2xl border p-4 ${status === "now" ? "border-plum bg-plum-soft" : "border-line bg-card"} ${status === "past" ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="mr-auto font-semibold">{m.title}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === "now" ? "bg-plum text-onaccent" : "bg-line/60 text-muted"}`}>
                  {status === "past" ? "vorbei" : status === "now" ? "jetzt" : relative(from, today)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                SSW {Math.floor(m.from / 7)}+{m.from % 7} bis {Math.floor(m.to / 7)}+{m.to % 7} · {fmtShort(from)} – {fmtMed(to)} · {m.source}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{m.text}</p>
              {status !== "past" &&
                (planned.has(m.title) ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                    <Icon name="check" size={16} /> im Kalender
                  </p>
                ) : (
                  <button type="button" onClick={() => plan(m.title, Math.max(m.from, p.days))} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-forest">
                    <Icon name="calendar" size={16} /> In den Kalender eintragen
                  </button>
                ))}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Zeitfenster laut{" "}
        <a href={pregnancySource.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {pregnancySource.label}
        </a>
        ; Impfung nach STIKO. Welche Untersuchungen für dich anstehen, bespricht deine Praxis oder Hebamme mit dir – maßgeblich ist der Mutterpass. Im Vorsorgeplan sind jetzt zusätzlich die Impfungen in der Schwangerschaft eingeblendet.
      </p>
    </>
  );
}

function Menopause({
  info,
  today,
  isPeriod,
  togglePeriod,
  symptomCard,
  go,
}: {
  info: CycleInfo | null;
  today: Date;
  isPeriod: boolean;
  togglePeriod: () => void;
  symptomCard: React.ReactNode;
  go: ViewProps["go"];
}) {
  const since = info ? diffDays(info.lastStart, today) : null;
  const months = since === null ? null : Math.floor(since / 30.44);
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-plum">Seit der letzten Periode</p>
          <p className="font-display mt-1 text-6xl leading-none">{since === null ? "–" : months! >= 2 ? months : since}</p>
          <p className="mt-1 text-muted">
            {since === null ? "Noch keine Periode erfasst" : months! >= 2 ? "Monate" : since === 1 ? "Tag" : "Tage"}
            {info && ` · zuletzt am ${fmtMed(info.lastStart)}`}
          </p>
          {since !== null && (
            <>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-plum-soft">
                <div className="h-full rounded-full bg-plum" style={{ width: `${Math.min(100, (since / 365) * 100)}%` }} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {since >= 365
                  ? "Seit über zwölf Monaten keine Blutung – nach der WHO-Definition gilt die Menopause damit als erreicht. Eine spätere Blutung bitte ärztlich abklären lassen."
                  : "Von der Menopause spricht man nach zwölf Monaten ohne Blutung (WHO). Bis dahin sind unregelmäßige Zyklen üblich."}
              </p>
            </>
          )}
          <Button variant={isPeriod ? "ghost" : "primary"} onClick={togglePeriod} className="mt-5">
            <Icon name="cycle" size={18} />
            {isPeriod ? "Heute keine Blutung" : "Blutung heute eintragen"}
          </Button>
        </Card>
        <div className="space-y-4">
          {symptomCard}
          <Card>
            <h2 className="font-semibold">Gut zu wissen</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">
              Hitzewallungen und Schweißausbrüche sind die häufigsten Beschwerden; viele Frauen haben auch Schlafstörungen oder Stimmungsschwankungen – manche merken kaum etwas. Wenn dich Beschwerden belasten, nimm deine Notizen mit in die Praxis.
            </p>
            <button type="button" onClick={() => go("tipps")} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-forest">
              Tipps zu Bewegung und Knochengesundheit <Icon name="right" size={16} />
            </button>
          </Card>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        In diesem Modus zeigt die App keine Zyklus-Prognosen, weil sie bei unregelmäßigen Zyklen nicht verlässlich sind. Verhütung bleibt bis zur gesicherten Menopause ein Thema – sprich das in der Praxis an.
      </p>
    </>
  );
}
