"use client";

import { useState } from "react";
import { fmtMed, fmtShort, iso, parse } from "@/lib/date";
import { uid, update } from "@/lib/store";
import type { Measurement, MeasureType, Person } from "@/lib/store";
import { Button, Card, Chip, Field, Icon, SectionTitle, Sheet } from "./ui";

const TYPES: { id: MeasureType; label: string; unit: string }[] = [
  { id: "bp", label: "Blutdruck", unit: "mmHg" },
  { id: "weight", label: "Gewicht", unit: "kg" },
  { id: "pulse", label: "Puls", unit: "/min" },
  { id: "glucose", label: "Blutzucker", unit: "mg/dl" },
  { id: "lab", label: "Laborwerte", unit: "" },
];

type RangeId = "1m" | "3m" | "1y" | "all";
const RANGES: { id: RangeId; label: string; months: number }[] = [
  { id: "1m", label: "1 Monat", months: 1 },
  { id: "3m", label: "3 Monate", months: 3 },
  { id: "1y", label: "1 Jahr", months: 12 },
  { id: "all", label: "Alles", months: 0 },
];

const inputCls =
  "min-h-11 w-full rounded-xl border border-line bg-field px-3 text-[15px] text-ink placeholder:text-muted";

const fmtNum = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 2 });
const toNum = (s: string) => Number(s.trim().replace(",", "."));

const stamp = (m: Measurement) => {
  const base = parse(m.date).getTime();
  if (!m.time) return base;
  const [h, min] = m.time.split(":").map(Number);
  return base + ((h || 0) * 60 + (min || 0)) * 60000;
};

function bpCategory(sys: number, dia: number) {
  if (sys < 120 && dia < 80) return { label: "Optimal", cls: "bg-sage text-forest" };
  if (sys < 130 && dia < 85) return { label: "Normal", cls: "bg-sage text-forest" };
  if (sys < 140 && dia < 90) return { label: "Hochnormal", cls: "bg-sun-soft text-sun" };
  return { label: "Erhöht", cls: "bg-coral-soft text-coral" };
}

function Delta({ cur, prev, unit }: { cur: number; prev: number; unit: string }) {
  const d = Math.round((cur - prev) * 100) / 100;
  if (d === 0) return <span>unverändert</span>;
  return (
    <span>
      {d > 0 ? "+" : "−"}
      {fmtNum(Math.abs(d))} {unit}
    </span>
  );
}

interface Series {
  cls: string; // Tailwind-Klassen: stroke-* und fill-*
  stroke: string;
  fill: string;
  pts: { t: number; v: number }[];
}

function Chart({ series, label, withYear }: { series: Series[]; label: string; withYear: boolean }) {
  const W = 340;
  const H = 200;
  const L = 40;
  const R = 12;
  const T = 12;
  const B = 28;
  const all = series.flatMap((s) => s.pts);
  const t0 = Math.min(...all.map((p) => p.t));
  const t1 = Math.max(...all.map((p) => p.t));
  let lo = Math.min(...all.map((p) => p.v));
  let hi = Math.max(...all.map((p) => p.v));
  if (hi === lo) {
    hi += 1;
    lo -= 1;
  }
  const padY = (hi - lo) * 0.12;
  lo -= padY;
  hi += padY;
  const x = (t: number) => (t1 === t0 ? (L + W - R) / 2 : L + ((t - t0) / (t1 - t0)) * (W - L - R));
  const y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const ticks = [0, 1, 2, 3].map((i) => lo + ((hi - lo) * i) / 3);
  const tickFmt = (v: number) =>
    v.toLocaleString("de-DE", { maximumFractionDigits: hi - lo < 10 ? 1 : 0 });
  const dateFmt = (t: number) => (withYear ? fmtMed(new Date(t)) : fmtShort(new Date(t)));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full text-ink">
      {ticks.map((v, i) => (
        <g key={i}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="stroke-line" strokeWidth={1} />
          <text x={L - 6} y={y(v) + 3.5} textAnchor="end" fontSize={10} className="fill-muted">
            {tickFmt(v)}
          </text>
        </g>
      ))}
      <text x={L} y={H - 8} textAnchor="start" fontSize={10} className="fill-muted">
        {dateFmt(t0)}
      </text>
      {t1 !== t0 && (
        <text x={W - R} y={H - 8} textAnchor="end" fontSize={10} className="fill-muted">
          {dateFmt(t1)}
        </text>
      )}
      {series.map((s, si) => (
        <g key={si}>
          <polyline
            points={s.pts.map((p) => `${x(p.t)},${y(p.v)}`).join(" ")}
            fill="none"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            className={s.stroke}
          />
          {s.pts.map((p, i) => (
            <circle key={i} cx={x(p.t)} cy={y(p.v)} r={3.5} className={s.fill} />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function MeasurementsView({ state, today }: { state: Person; today: Date }) {
  const [type, setType] = useState<MeasureType>("bp");
  const [labSel, setLabSel] = useState<string | null>(null);
  const [range, setRange] = useState<RangeId>("3m");
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);

  const [fDate, setFDate] = useState(iso(today));
  const [fTime, setFTime] = useState("");
  const [fV1, setFV1] = useState("");
  const [fV2, setFV2] = useState("");
  const [fLabel, setFLabel] = useState("");
  const [fUnit, setFUnit] = useState("");
  const [fNote, setFNote] = useState("");

  const meta = TYPES.find((t) => t.id === type)!;
  const ofType = state.measurements.filter((m) => m.type === type);
  const labels = type === "lab" ? [...new Set(ofType.map((m) => m.label ?? "").filter(Boolean))] : [];
  const selLabel = type === "lab" ? (labSel && labels.includes(labSel) ? labSel : (labels[0] ?? null)) : null;
  const entries = (type === "lab" ? ofType.filter((m) => (m.label ?? "") === selLabel) : ofType)
    .slice()
    .sort((a, b) => stamp(a) - stamp(b));
  const last = entries[entries.length - 1];
  const prev = entries[entries.length - 2];
  const unit = type === "lab" ? (last?.unit ?? "") : meta.unit;

  const months = RANGES.find((r) => r.id === range)!.months;
  const cutoff = months ? new Date(today.getFullYear(), today.getMonth() - months, today.getDate()).getTime() : -Infinity;
  const visible = entries.filter((m) => stamp(m) >= cutoff);

  const series: Series[] = [
    {
      cls: "",
      stroke: "stroke-forest",
      fill: "fill-forest",
      pts: visible.map((m) => ({ t: stamp(m), v: m.value })),
    },
  ];
  if (type === "bp") {
    series.push({
      cls: "",
      stroke: "stroke-coral",
      fill: "fill-coral",
      pts: visible.filter((m) => m.value2 != null).map((m) => ({ t: stamp(m), v: m.value2 as number })),
    });
  }
  const chartLabel =
    type === "bp"
      ? `Verlauf Blutdruck, ${visible.length} Messungen, zuletzt ${last ? `${fmtNum(last.value)} zu ${fmtNum(last.value2 ?? 0)}` : ""} mmHg`
      : `Verlauf ${selLabel ?? meta.label}, ${visible.length} Messungen, zuletzt ${last ? fmtNum(last.value) : ""} ${unit}`;

  const display = (m: Measurement) =>
    type === "bp" ? `${fmtNum(m.value)}/${fmtNum(m.value2 ?? 0)}` : fmtNum(m.value);

  const list = entries.slice().reverse();
  const shown = showAll ? list : list.slice(0, 30);

  const openSheet = () => {
    setFDate(iso(today));
    setFTime("");
    setFV1("");
    setFV2("");
    setFLabel(type === "lab" ? (selLabel ?? "") : "");
    setFUnit(type === "lab" ? (last?.unit ?? "") : "");
    setFNote("");
    setOpen(true);
  };

  const v1 = toNum(fV1);
  const v2 = toNum(fV2);
  const valid =
    fV1.trim() !== "" &&
    Number.isFinite(v1) &&
    v1 > 0 &&
    (type !== "bp" || (fV2.trim() !== "" && Number.isFinite(v2) && v2 > 0)) &&
    (type !== "lab" || (fLabel.trim() !== "" && fUnit.trim() !== "")) &&
    fDate !== "" &&
    fDate <= iso(today);

  const save = () => {
    if (!valid) return;
    const m: Measurement = {
      id: uid(),
      type,
      date: fDate,
      value: v1,
      ...(fTime ? { time: fTime } : {}),
      ...(type === "bp" ? { value2: v2 } : {}),
      ...(type === "lab" ? { label: fLabel.trim(), unit: fUnit.trim() } : {}),
      ...(fNote.trim() ? { note: fNote.trim() } : {}),
    };
    update((p) => ({ ...p, measurements: [...p.measurements, m] }));
    if (type === "lab") setLabSel(m.label!);
    setOpen(false);
  };

  const remove = (id: string) =>
    update((p) => ({ ...p, measurements: p.measurements.filter((m) => m.id !== id) }));

  const cat = type === "bp" && last && last.value2 != null ? bpCategory(last.value, last.value2) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl">Messwerte</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <Chip
            key={t.id}
            active={t.id === type}
            onClick={() => {
              setType(t.id);
              setShowAll(false);
            }}
          >
            {t.label}
          </Chip>
        ))}
      </div>

      {type === "lab" && labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Laborwert wählen">
          {labels.map((l) => (
            <Chip key={l} active={l === selLabel} onClick={() => { setLabSel(l); setShowAll(false); }}>
              {l}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Button onClick={openSheet}>
          <Icon name="plus" size={18} />
          Wert eintragen
        </Button>
      </div>

      {last ? (
        <>
          <Card className="mt-5">
            <p className="text-sm font-medium text-muted">
              {type === "lab" ? selLabel : meta.label} · letzter Wert
            </p>
            <p className="font-display mt-1 text-5xl leading-tight">
              {display(last)}
              <span className="ml-2 text-lg text-muted">{unit}</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {fmtMed(parse(last.date))}
              {last.time ? `, ${last.time} Uhr` : ""}
            </p>
            {prev && (
              <p className="mt-2 text-sm text-ink">
                Veränderung zum vorherigen Wert:{" "}
                {type === "bp" && last.value2 != null && prev.value2 != null ? (
                  <>
                    <Delta cur={last.value} prev={prev.value} unit="" />
                    {" / "}
                    <Delta cur={last.value2} prev={prev.value2} unit={unit} />
                  </>
                ) : (
                  <Delta cur={last.value} prev={prev.value} unit={unit} />
                )}
              </p>
            )}
            {cat && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${cat.cls}`}>{cat.label}</span>
                <span className="text-xs text-muted">Orientierung – bitte ärztlich abklären</span>
              </div>
            )}
          </Card>

          <SectionTitle>Verlauf</SectionTitle>
          <div className="mb-3 flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <Chip key={r.id} active={r.id === range} onClick={() => setRange(r.id)}>
                {r.label}
              </Chip>
            ))}
          </div>
          <Card>
            {visible.length >= 2 ? (
              <>
                <Chart series={series} label={chartLabel} withYear={range === "1y" || range === "all"} />
                {type === "bp" && (
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-forest" aria-hidden /> Systolisch
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-coral" aria-hidden /> Diastolisch
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="py-6 text-center text-muted">
                Für ein Diagramm braucht es mindestens zwei Werte im gewählten Zeitraum. Trag einfach weitere Messungen
                ein – der Verlauf erscheint dann hier.
              </p>
            )}
          </Card>

          <SectionTitle aside={`${list.length} ${list.length === 1 ? "Eintrag" : "Einträge"}`}>Einträge</SectionTitle>
          <ul className="space-y-2">
            {shown.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {display(m)} <span className="text-sm font-normal text-muted">{m.unit ?? meta.unit}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {fmtMed(parse(m.date))}
                    {m.time ? `, ${m.time} Uhr` : ""}
                  </p>
                  {m.note && <p className="mt-0.5 break-words text-sm text-ink/80">{m.note}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  aria-label={`Eintrag vom ${fmtMed(parse(m.date))} löschen`}
                  className="grid size-11 shrink-0 place-items-center rounded-full text-coral hover:bg-coral-soft"
                >
                  <Icon name="close" size={18} />
                </button>
              </li>
            ))}
          </ul>
          {!showAll && list.length > 30 && (
            <div className="mt-3 flex justify-center">
              <Button variant="ghost" onClick={() => setShowAll(true)}>
                Mehr anzeigen
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="mt-5 bg-sage text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-card text-forest">
            <Icon name="heart" />
          </span>
          <h2 className="font-display mt-3 text-2xl">Noch keine Werte</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            {type === "lab"
              ? "Trag deinen ersten Laborwert ein, zum Beispiel LDL-Cholesterin, und behalte den Verlauf im Blick."
              : `Trag deine erste Messung für ${meta.label} ein – danach siehst du hier den Verlauf.`}
          </p>
        </Card>
      )}

      <p className="mt-10 text-xs leading-relaxed text-muted">
        Die Werte dienen deiner eigenen Dokumentation und ersetzen keine ärztliche Beurteilung.
      </p>

      {open && (
        <Sheet title="Wert eintragen" onClose={() => setOpen(false)}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <p className="text-sm font-medium text-ink">{meta.label}</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Datum">
                <input
                  type="date"
                  required
                  max={iso(today)}
                  value={fDate}
                  onChange={(e) => setFDate(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Uhrzeit (optional)">
                <input type="time" value={fTime} onChange={(e) => setFTime(e.target.value)} className={inputCls} />
              </Field>
            </div>

            {type === "lab" && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bezeichnung">
                  <input
                    type="text"
                    value={fLabel}
                    onChange={(e) => setFLabel(e.target.value)}
                    placeholder="z. B. LDL-Cholesterin"
                    className={inputCls}
                  />
                </Field>
                <Field label="Einheit">
                  <input
                    type="text"
                    value={fUnit}
                    onChange={(e) => setFUnit(e.target.value)}
                    placeholder="z. B. mg/dl"
                    className={inputCls}
                  />
                </Field>
              </div>
            )}

            {type === "bp" ? (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Systolisch (oben)">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={fV1}
                    onChange={(e) => setFV1(e.target.value)}
                    placeholder="120"
                    className={inputCls}
                  />
                </Field>
                <Field label="Diastolisch (unten)">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={fV2}
                    onChange={(e) => setFV2(e.target.value)}
                    placeholder="80"
                    className={inputCls}
                  />
                </Field>
              </div>
            ) : (
              <Field label={`Wert${type === "lab" ? "" : ` in ${meta.unit}`}`}>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={fV1}
                  onChange={(e) => setFV1(e.target.value)}
                  className={inputCls}
                />
              </Field>
            )}

            <Field label="Notiz (optional)">
              <input type="text" value={fNote} onChange={(e) => setFNote(e.target.value)} className={inputCls} />
            </Field>

            <Button type="submit" disabled={!valid} className="w-full">
              Speichern
            </Button>
          </form>
        </Sheet>
      )}
    </div>
  );
}
