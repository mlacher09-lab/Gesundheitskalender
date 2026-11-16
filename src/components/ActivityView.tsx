"use client";

import { useState } from "react";
import { addDays, ageAt, fmtMed, fmtShort, iso, parse } from "@/lib/date";
import type { Activity, Person } from "@/lib/store";
import { uid, update } from "@/lib/store";
import { Button, Card, Chip, Field, Icon, SectionTitle, Sheet } from "./ui";

const inputCls =
  "min-h-11 w-full rounded-2xl border border-line bg-field px-4 text-[15px] text-ink outline-none focus:border-forest";

const kinds = [
  "Gehen",
  "Laufen",
  "Radfahren",
  "Schwimmen",
  "Krafttraining",
  "Yoga",
  "Mannschaftssport",
  "Wandern",
  "Tanzen",
  "Sonstiges",
];
const quickMinutes = [15, 30, 45, 60, 90];
const goalOptions = [150, 225, 300];

const weekdayFmt = new Intl.DateTimeFormat("de-DE", { weekday: "short" });

/** Montag der Woche, in der `d` liegt. */
const mondayOf = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));

type Group = "adult" | "child" | "small";

function groupOf(state: Person, today: Date): Group {
  const age = ageAt(parse(state.profile.birthDate), today);
  if (age >= 18) return "adult";
  if (age >= 5) return "child";
  return "small";
}

/** Angerechnete Minuten eines Eintrags: Erwachsene zählen intensiv doppelt. */
const credited = (a: Activity, group: Group) =>
  a.intensity === "intensiv" && group === "adult" ? a.minutes * 2 : a.minutes;

function minutesInRange(acts: Activity[], from: Date, group: Group) {
  const a = iso(from);
  const b = iso(addDays(from, 6));
  return acts.filter((x) => x.date >= a && x.date <= b).reduce((s, x) => s + credited(x, group), 0);
}

export function weekSummary(
  state: Person,
  today: Date,
): { goal: number; minutes: number; strengthDays: number; strengthGoal: number; daily: boolean } {
  const group = groupOf(state, today);
  const start = mondayOf(today);
  const a = iso(start);
  const b = iso(addDays(start, 6));
  const inWeek = state.activities.filter((x) => x.date >= a && x.date <= b);
  const strengthDays = new Set(inWeek.filter((x) => x.strength).map((x) => x.date)).size;
  const minutes = inWeek.reduce((s, x) => s + credited(x, group), 0);
  if (group === "adult") {
    return { goal: state.profile.activityGoal ?? 150, minutes, strengthDays, strengthGoal: 2, daily: false };
  }
  if (group === "child") {
    return { goal: 420, minutes, strengthDays, strengthGoal: 3, daily: true };
  }
  return { goal: 0, minutes, strengthDays, strengthGoal: 0, daily: false };
}

export default function ActivityView({ state, today }: { state: Person; today: Date }) {
  const [adding, setAdding] = useState(false);

  const group = groupOf(state, today);
  const age = ageAt(parse(state.profile.birthDate), today);
  const sum = weekSummary(state, today);
  const monday = mondayOf(today);
  const todayKey = iso(today);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const key = iso(d);
    const minutes = state.activities.filter((x) => x.date === key).reduce((s, x) => s + credited(x, group), 0);
    return { d, key, minutes };
  });
  const scale = Math.max(60, ...days.map((d) => d.minutes));

  const prevWeeks = Array.from({ length: 6 }, (_, i) => {
    const start = addDays(monday, -7 * (i + 1));
    return { start, minutes: minutesInRange(state.activities, start, group) };
  });

  const weekStartKey = iso(monday);
  const weekEndKey = iso(addDays(monday, 6));
  const entries = state.activities
    .filter((x) => x.date >= weekStartKey && x.date <= weekEndKey)
    .sort((a, b) => b.date.localeCompare(a.date));

  const save = (a: Activity) => {
    update((p) => ({ ...p, activities: [...p.activities, a] }));
    setAdding(false);
  };
  const remove = (id: string) => update((p) => ({ ...p, activities: p.activities.filter((x) => x.id !== id) }));
  const setGoal = (n: number) => update((p) => ({ ...p, profile: { ...p.profile, activityGoal: n } }));

  const pct = sum.goal > 0 ? Math.min(1, sum.minutes / sum.goal) : 0;
  const missing = Math.max(0, sum.goal - sum.minutes);
  const reached = sum.goal > 0 && missing === 0;
  const R = 52;
  const C = 2 * Math.PI * R;

  const subtitle =
    group === "adult"
      ? `Ziel: ${sum.goal} Minuten pro Woche, dazu Kräftigung an mindestens 2 Tagen.`
      : group === "child"
        ? "Ziel: im Schnitt mindestens 60 Minuten pro Tag, dazu Kräftigung an mindestens 3 Tagen."
        : "Bewegung gehört für die Kleinen zum Alltag.";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl">Bewegung</h1>
      <p className="mt-2 text-muted">{subtitle}</p>

      {group === "small" ? (
        <Card className="mt-6 bg-sage">
          <span className="grid size-11 place-items-center rounded-xl bg-card text-forest">
            <Icon name="run" />
          </span>
          <h2 className="font-display mt-3 text-2xl">Spielen und Entdecken</h2>
          <p className="mt-2 max-w-md text-muted">
            {age >= 1
              ? "Kinder ab 1 Jahr sollten sich über den Tag verteilt mindestens 180 Minuten bewegen – Krabbeln, Laufen, Toben und Spielen zählen alle. Ein Minutenziel gibt es hier nicht."
              : "Für Babys gilt: so oft wie möglich aktiv sein, zum Beispiel in Bauchlage spielen und sich frei bewegen. Ein Minutenziel gibt es hier nicht."}
          </p>
        </Card>
      ) : (
        <>
          <Card className="mt-6">
            <h2 className="font-display text-2xl">Diese Woche</h2>
            <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
              <div className="relative size-40 shrink-0">
                <svg
                  viewBox="0 0 120 120"
                  className="size-full"
                  role="img"
                  aria-label={`${sum.minutes} von ${sum.goal} angerechneten Minuten diese Woche`}
                >
                  <circle cx="60" cy="60" r={R} fill="none" strokeWidth="10" className="stroke-sage" />
                  <circle
                    cx="60"
                    cy="60"
                    r={R}
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="stroke-forest"
                    strokeDasharray={`${C * pct} ${C}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
                  <span className="font-display text-4xl leading-none text-ink">{sum.minutes}</span>
                  <span className="mt-1 text-xs text-muted">von {sum.goal} Min.</span>
                </div>
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className={`font-display text-2xl ${reached ? "text-forest" : "text-ink"}`}>
                  {reached ? "Ziel erreicht" : `Noch ${missing} Min. bis zum Ziel`}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {group === "adult"
                    ? "Intensive Minuten zählen doppelt."
                    : "Jede Minute mit mittlerer bis hoher Intensität zählt."}
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    {Array.from({ length: sum.strengthGoal }, (_, i) => {
                      const on = i < sum.strengthDays;
                      return (
                        <span
                          key={i}
                          className={`grid size-8 place-items-center rounded-full border-2 ${
                            on ? "border-forest bg-forest text-onaccent" : "border-line text-transparent"
                          }`}
                        >
                          <Icon name="check" size={16} />
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Kräftigung: {sum.strengthDays} von {sum.strengthGoal} Tagen
                    {sum.strengthDays >= sum.strengthGoal ? " – geschafft" : ""}
                  </p>
                </div>
                {group === "adult" && age >= 65 && (
                  <p className="mt-3 rounded-2xl bg-sage p-3 text-sm text-ink">
                    Ab 65 Jahren zusätzlich empfohlen: Gleichgewichtstraining an 3 Tagen pro Woche, um Stürzen
                    vorzubeugen.
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Button onClick={() => setAdding(true)} className="mt-4 w-full sm:w-auto">
            <Icon name="plus" size={18} />
            Aktivität eintragen
          </Button>

          <SectionTitle aside="angerechnete Minuten">Wochenverlauf</SectionTitle>
          <Card>
            <ul className="grid grid-cols-7 gap-2">
              {days.map((d) => {
                const isToday = d.key === todayKey;
                return (
                  <li
                    key={d.key}
                    className="flex flex-col items-center gap-1.5"
                    aria-label={`${fmtShort(d.d)}: ${d.minutes} Minuten`}
                  >
                    <div className="flex h-24 w-full max-w-9 items-end overflow-hidden rounded-xl bg-sage">
                      <div
                        className={`w-full rounded-xl ${isToday ? "bg-forest" : "bg-teal"}`}
                        style={{ height: `${(d.minutes / scale) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs ${isToday ? "font-bold text-forest" : "font-medium text-ink"}`}>
                      {weekdayFmt.format(d.d)}
                    </span>
                    <span className="text-xs text-muted">{d.minutes || "–"}</span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <SectionTitle>Letzte Wochen</SectionTitle>
          <ul className="space-y-2">
            {prevWeeks.map((w) => {
              const ok = w.minutes >= sum.goal;
              return (
                <li
                  key={iso(w.start)}
                  className="flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-card px-3.5 py-2"
                >
                  <span className="w-16 shrink-0 text-sm text-ink">{fmtShort(w.start)}</span>
                  <span className="w-14 shrink-0 text-sm font-semibold text-ink">{w.minutes} Min.</span>
                  <div
                    className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-sage"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={sum.goal}
                    aria-valuenow={Math.min(w.minutes, sum.goal)}
                    aria-label={`Woche ab ${fmtShort(w.start)}`}
                  >
                    <div
                      className="h-full rounded-full bg-forest"
                      style={{ width: `${Math.min(100, (w.minutes / sum.goal) * 100)}%` }}
                    />
                  </div>
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full ${
                      ok ? "bg-forest text-onaccent" : "text-transparent"
                    }`}
                    aria-label={ok ? "Ziel erreicht" : "Ziel nicht erreicht"}
                  >
                    <Icon name="check" size={16} />
                  </span>
                </li>
              );
            })}
          </ul>

          <SectionTitle aside={entries.length > 0 ? `${entries.length} Einträge` : undefined}>
            Einträge dieser Woche
          </SectionTitle>
          {entries.length === 0 ? (
            <Card className="bg-sage">
              <p className="text-muted">
                Diese Woche ist noch nichts eingetragen. Ein Spaziergang zählt schon – trag deine erste Aktivität ein.
              </p>
            </Card>
          ) : (
            <ul className="space-y-2">
              {entries.map((a) => (
                <li key={a.id} className="flex items-center gap-2 rounded-2xl border border-line bg-card p-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage text-forest">
                    <Icon name="run" size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-ink">{a.kind}</span>
                    <span className="block text-sm text-muted">
                      {fmtMed(parse(a.date))} · {a.minutes} Min. · {a.intensity}
                      {a.strength ? " · Kräftigung" : ""}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    aria-label={`${a.kind} vom ${fmtShort(parse(a.date))} löschen`}
                    className="grid size-11 shrink-0 place-items-center rounded-full text-coral hover:bg-coral-soft"
                  >
                    <Icon name="trash" size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {group === "adult" && (
            <>
              <SectionTitle aside="Minuten pro Woche">Wochenziel</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map((g) => (
                  <Chip key={g} active={sum.goal === g} onClick={() => setGoal(g)}>
                    {g} Min.
                  </Chip>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">
                Die WHO empfiehlt 150 bis 300 Minuten moderate oder 75 bis 150 Minuten intensive Bewegung pro Woche.
              </p>
            </>
          )}
        </>
      )}

      <div className="mt-10 space-y-2 text-xs leading-relaxed text-muted">
        <p>
          Empfehlung nach WHO 2020. Bei Vorerkrankungen bitte die Belastung ärztlich abklären.
        </p>
        <p>
          Eine automatische Übernahme aus Apple Health oder Google Health Connect ist in einer Web-App technisch nicht
          möglich. Deshalb werden Aktivitäten von Hand eingetragen.
        </p>
      </div>

      {adding && <ActivitySheet today={today} onClose={() => setAdding(false)} onSave={save} />}
    </div>
  );
}

function ActivitySheet({
  today,
  onClose,
  onSave,
}: {
  today: Date;
  onClose: () => void;
  onSave: (a: Activity) => void;
}) {
  const todayKey = iso(today);
  const [kind, setKind] = useState("Gehen");
  const [custom, setCustom] = useState("");
  const [minutes, setMinutes] = useState("30");
  const [intensity, setIntensity] = useState<"moderat" | "intensiv">("moderat");
  const [strength, setStrength] = useState(false);
  const [date, setDate] = useState(todayKey);

  const mins = Math.round(Number(minutes));
  const valid = mins >= 1 && mins <= 1000 && !!date && date <= todayKey;

  const pickKind = (k: string) => {
    setKind(k);
    if (k === "Krafttraining") setStrength(true);
  };

  const submit = () => {
    if (!valid) return;
    const label = kind === "Sonstiges" && custom.trim() ? custom.trim() : kind;
    onSave({ id: uid(), date, minutes: mins, intensity, kind: label, strength: strength || undefined });
  };

  return (
    <Sheet title="Aktivität eintragen" onClose={onClose}>
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div>
          <span className="mb-1.5 block text-sm font-medium text-muted">Art</span>
          <div className="flex flex-wrap gap-2">
            {kinds.map((k) => (
              <Chip key={k} active={kind === k} onClick={() => pickKind(k)}>
                {k}
              </Chip>
            ))}
          </div>
          {kind === "Sonstiges" && (
            <input
              className={`${inputCls} mt-3`}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="z. B. Gartenarbeit"
              aria-label="Eigene Art der Aktivität"
              autoComplete="off"
            />
          )}
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-muted">Dauer in Minuten</span>
          <div className="mb-3 flex flex-wrap gap-2">
            {quickMinutes.map((m) => (
              <Chip key={m} active={mins === m} onClick={() => setMinutes(String(m))}>
                {m}
              </Chip>
            ))}
          </div>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={1000}
            className={inputCls}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            aria-label="Dauer in Minuten"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-muted">Intensität</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["moderat", "Moderat – du kannst noch reden"],
                ["intensiv", "Intensiv – du kommst außer Atem"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                aria-pressed={intensity === val}
                onClick={() => setIntensity(val)}
                className={`min-h-14 rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors ${
                  intensity === val
                    ? "border-forest bg-forest text-onaccent"
                    : "border-line bg-card text-ink hover:border-forest/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={strength}
          onClick={() => setStrength((s) => !s)}
          className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
        >
          <span className="text-[15px] font-medium text-ink">Zählt als Kräftigung</span>
          <span
            className={`flex h-7 w-12 shrink-0 items-center rounded-full border border-line p-0.5 transition-colors ${
              strength ? "justify-end bg-forest" : "justify-start bg-field"
            }`}
          >
            <span className={`size-5 rounded-full ${strength ? "bg-onaccent" : "bg-muted"}`} />
          </span>
        </button>

        <Field label="Datum">
          <input
            type="date"
            className={inputCls}
            value={date}
            max={todayKey}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" disabled={!valid}>
            Speichern
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
