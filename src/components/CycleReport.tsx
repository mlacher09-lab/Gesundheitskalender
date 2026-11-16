"use client";

import { createPortal } from "react-dom";
import { cyclePhaseTips, type CyclePhase } from "@/data/empfehlungen";
import { phaseColors } from "@/lib/cycle";
import type { CycleStats } from "@/lib/cycleStats";
import { fmtMed, parse } from "@/lib/date";
import type { Profile } from "@/lib/store";
import { Button, Icon } from "./ui";

const phases: CyclePhase[] = ["menstruation", "follikel", "ovulation", "luteal"];

/** Druckbare Zyklus-Auswertung für das Gespräch in der Frauenarztpraxis. */
export default function CycleReport({
  stats,
  profile,
  today,
  onClose,
}: {
  stats: CycleStats;
  profile: Profile;
  today: Date;
  onClose: () => void;
}) {
  const recent = stats.cycles.slice(-12);
  const withLen = recent.filter((c) => c.length !== null);
  const maxLen = Math.max(35, ...withLen.map((c) => c.length ?? 0));
  const fmt = (n: number | null, unit = "Tage") => (n === null ? "–" : `${String(n).replace(".", ",")} ${unit}`);

  return createPortal(
    <div className="print-area fixed inset-0 z-50 overflow-y-auto bg-paper">
      <div className="no-print sticky top-0 flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur">
        <Button variant="ghost" onClick={onClose}>
          <Icon name="left" size={18} /> Zurück
        </Button>
        <Button onClick={() => window.print()}>Drucken / als PDF speichern</Button>
      </div>

      <article className="mx-auto max-w-2xl px-6 py-8 text-[15px] leading-relaxed">
        <p className="text-sm text-muted">Gesundheitskalender · erstellt am {fmtMed(today)}</p>
        <h1 className="font-display mt-1 text-3xl">Zyklus-Auswertung</h1>
        <p className="mt-1 text-muted">
          {profile.name || "Ohne Namen"} · geboren am {fmtMed(parse(profile.birthDate))}
        </p>

        <h2 className="font-display mt-8 text-xl">Überblick</h2>
        <table className="mt-2 w-full border-collapse">
          <tbody>
            {[
              ["Erfasste Zyklen", `${stats.cycles.length} (davon ${stats.completed} abgeschlossen)`],
              ["Durchschnittliche Zykluslänge", fmt(stats.avg)],
              ["Kürzester / längster Zyklus", stats.min === null ? "–" : `${stats.min} / ${stats.max} Tage`],
              ["Schwankung", stats.min === null || stats.max === null ? "–" : `${stats.max - stats.min} Tage`],
              ["Durchschnittliche Blutungsdauer", fmt(stats.avgPeriod)],
              ["Tage mit notierten Beschwerden", String(stats.symptomDays)],
            ].map(([k, v]) => (
              <tr key={k} className="border-b border-line">
                <th scope="row" className="py-2 pr-4 text-left font-normal text-muted">{k}</th>
                <td className="py-2 text-right font-semibold tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {withLen.length > 0 && (
          <>
            <h2 className="font-display mt-8 text-xl">Zykluslängen</h2>
            <div className="mt-3 space-y-1.5">
              {withLen.map((c) => (
                <div key={c.start} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0 tabular-nums text-muted">{fmtMed(parse(c.start))}</span>
                  <span className="h-3 flex-1 overflow-hidden rounded-full bg-sage">
                    <span className="block h-full rounded-full bg-forest" style={{ width: `${((c.length ?? 0) / maxLen) * 100}%` }} />
                  </span>
                  <span className="w-16 shrink-0 text-right font-semibold tabular-nums">{c.length} Tage</span>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="font-display mt-8 text-xl">Letzte Zyklen</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2 font-normal">Beginn der Periode</th>
              <th className="py-2 text-right font-normal">Blutungsdauer</th>
              <th className="py-2 text-right font-normal">Zykluslänge</th>
            </tr>
          </thead>
          <tbody>
            {[...recent].reverse().map((c) => (
              <tr key={c.start} className="border-b border-line">
                <td className="py-1.5 tabular-nums">{fmtMed(parse(c.start))}</td>
                <td className="py-1.5 text-right tabular-nums">{c.periodLength} Tage</td>
                <td className="py-1.5 text-right tabular-nums">{c.length === null ? "läuft" : `${c.length} Tage`}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="font-display mt-8 text-xl">Beschwerden nach Zyklusphase</h2>
        {stats.symptoms.length ? (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="py-2 font-normal">Beschwerde</th>
                <th className="py-2 text-right font-normal">Tage</th>
                {phases.map((p) => (
                  <th key={p} className="py-2 text-right font-normal">
                    <span className="mr-1 inline-block size-2 rounded-full" style={{ background: phaseColors[p] }} />
                    {cyclePhaseTips[p].label.replace("phase", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.symptoms.map((s) => (
                <tr key={s.name} className="border-b border-line">
                  <td className="py-1.5">{s.name}</td>
                  <td className="py-1.5 text-right font-semibold tabular-nums">{s.count}</td>
                  {phases.map((p) => (
                    <td key={p} className="py-1.5 text-right tabular-nums">{s.byPhase[p] || "–"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-2 text-muted">Keine Beschwerden notiert.</p>
        )}

        <p className="mt-8 text-xs leading-relaxed text-muted">
          Selbst erfasste Angaben aus der App „Gesundheitskalender“. Zyklusphasen sind rechnerisch geschätzt (Eisprung 14 Tage vor der nächsten Periode) und nicht gemessen. Die Auswertung dient als Gesprächsgrundlage und ist keine ärztliche Diagnose.
        </p>
      </article>
    </div>,
    document.body,
  );
}
