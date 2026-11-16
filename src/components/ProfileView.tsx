"use client";

import { useState } from "react";
import { downloadICS } from "@/lib/ics";
import { isIos, isStandalone, promptInstall, useCanInstall } from "@/lib/pwa";
import { requestReminderPermission } from "@/lib/reminders";
import { riskInfo, type RiskKey } from "@/data/risiko";
import { removePerson, resetAll, update, updateApp, type Profile, type ReminderSettings, type RiskFactors, type Sex, type Smoker, type Theme } from "@/lib/store";
import type { ViewProps } from "./App";
import { Button, Card, Field, Icon, SectionTitle } from "./ui";

export default function ProfileView({ app, state, profile, today }: ViewProps) {
  const canInstall = useCanInstall();
  const [installed] = useState(isStandalone);
  const [ios] = useState(isIos);
  const [notice, setNotice] = useState("");
  const rem = app.reminders;
  const setRem = (patch: Partial<ReminderSettings>) =>
    updateApp((s) => ({ ...s, reminders: { ...s.reminders, ...patch } }));
  const setRisk = (patch: Partial<RiskFactors>) => set({ risk: { ...profile.risk, ...patch } });
  const flags: Exclude<RiskKey, "smoker">[] = ["chronic", "familyColon", "familyBreast", "fsmeArea", "pregnant"];

  const toggleReminders = async (on: boolean) => {
    setNotice("");
    if (!on) return setRem({ enabled: false });
    const result = await requestReminderPermission();
    if (result === "granted") return setRem({ enabled: true });
    setNotice(
      result === "denied"
        ? "Benachrichtigungen sind für diese Seite blockiert. Erlaube sie in den Browser-Einstellungen und versuch es noch einmal."
        : ios
          ? "Auf dem iPhone funktionieren Benachrichtigungen erst, wenn die App auf dem Home-Bildschirm installiert ist."
          : "Dieser Browser unterstützt keine Benachrichtigungen. Nutze stattdessen den Kalender-Export.",
    );
  };

  const set = (patch: Partial<Profile>) =>
    update((s) => ({ ...s, profile: { ...s.profile, ...patch } }));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(app, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gesundheitskalender.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-4xl md:text-5xl">Profil</h1>

      <Card className="mt-6 space-y-4">
        <Field label="Vorname">
          <input type="text" value={profile.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="Geburtsdatum">
          <input type="date" value={profile.birthDate} onChange={(e) => e.target.value && set({ birthDate: e.target.value })} />
        </Field>
        <Field label="Empfehlungen anzeigen für">
          <select value={profile.sex} onChange={(e) => set({ sex: e.target.value as Sex })}>
            <option value="female">Weiblich</option>
            <option value="male">Männlich</option>
            <option value="all">Alle anzeigen</option>
          </select>
        </Field>
      </Card>

      <SectionTitle aside="passt den Vorsorgeplan an">Persönliche Risikofaktoren</SectionTitle>
      <Card className="space-y-4">
        <Field label={riskInfo.smoker.label}>
          <select value={profile.risk.smoker} onChange={(e) => setRisk({ smoker: e.target.value as Smoker })}>
            <option value="never">Nein</option>
            <option value="current">Ja, ich rauche</option>
            <option value="former">Früher, heute nicht mehr</option>
          </select>
        </Field>
        {flags
          .filter((k) => k !== "pregnant" || profile.sex !== "male")
          .map((k) => (
            <label key={k} className="flex cursor-pointer items-center justify-between gap-4">
              <span className="text-[15px]">
                {riskInfo[k].label}
                <span className="block text-sm text-muted">{riskInfo[k].hint}</span>
              </span>
              <input type="checkbox" checked={profile.risk[k]} onChange={(e) => setRisk({ [k]: e.target.checked })} className="size-6 shrink-0 accent-forest" />
            </label>
          ))}
        <p className="text-sm leading-relaxed text-muted">
          Die Angaben blenden zusätzliche Untersuchungen und Impfungen im Vorsorgeplan ein. Sie bleiben wie alles andere nur auf diesem Gerät.
        </p>
      </Card>

      <SectionTitle>Design</SectionTitle>
      <Card>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Design">
          {(
            [
              ["system", "Automatisch"],
              ["light", "Hell"],
              ["dark", "Dunkel"],
            ] as [Theme, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={app.theme === id}
              onClick={() => updateApp((s) => ({ ...s, theme: id }))}
              className={`min-h-11 rounded-xl border text-sm font-medium transition-colors ${
                app.theme === id ? "border-forest bg-forest text-onaccent" : "border-line bg-field"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <SectionTitle>App aufs Handy</SectionTitle>
      <Card>
        <p className="flex items-start gap-3 text-[15px] leading-relaxed">
          <Icon name="phone" className="mt-0.5 shrink-0 text-forest" />
          {installed
            ? "Die App ist auf diesem Gerät installiert und funktioniert auch ohne Internet."
            : "Installiere den Gesundheitskalender wie eine normale App: eigenes Symbol, Vollbild und Nutzung ohne Internet."}
        </p>
        {!installed && canInstall && (
          <Button className="mt-4" onClick={promptInstall}>
            <Icon name="plus" size={18} /> App installieren
          </Button>
        )}
        {!installed && !canInstall && (
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink/80">
            {ios ? (
              <>
                <li>Öffne diese Seite in <strong>Safari</strong>.</li>
                <li>Tippe unten auf das <strong>Teilen-Symbol</strong> (Quadrat mit Pfeil).</li>
                <li>Wähle <strong>„Zum Home-Bildschirm“</strong> und bestätige mit „Hinzufügen“.</li>
              </>
            ) : (
              <>
                <li>Öffne das <strong>Browser-Menü</strong> (⋮ oben rechts in Chrome).</li>
                <li>Wähle <strong>„App installieren“</strong> bzw. „Zum Startbildschirm hinzufügen“.</li>
                <li>Am Computer: Installations-Symbol rechts in der Adressleiste.</li>
              </>
            )}
          </ol>
        )}
      </Card>

      <SectionTitle>Erinnerungen</SectionTitle>
      <Card className="space-y-4">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span>
            <span className="block font-semibold">Benachrichtigungen</span>
            <span className="block text-sm text-muted">Für Termine und fällige Vorsorgen</span>
          </span>
          <input
            type="checkbox"
            checked={rem.enabled}
            onChange={(e) => toggleReminders(e.target.checked)}
            className="size-6 accent-forest"
          />
        </label>
        {notice && <p className="rounded-2xl bg-coral-soft p-3.5 text-sm leading-relaxed">{notice}</p>}
        {rem.enabled && (
          <>
            <Field label="Vor Terminen erinnern">
              <select value={rem.leadDays} onChange={(e) => setRem({ leadDays: Number(e.target.value) })}>
                <option value={0}>Nur am Tag selbst</option>
                <option value={1}>1 Tag vorher</option>
                <option value={2}>2 Tage vorher</option>
                <option value={7}>1 Woche vorher</option>
              </select>
            </Field>
            {profile.cycleEnabled && (
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-[15px]">An voraussichtliche Periode erinnern</span>
                <input type="checkbox" checked={rem.cycle} onChange={(e) => setRem({ cycle: e.target.checked })} className="size-5 accent-plum" />
              </label>
            )}
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span className="text-[15px]">
                Diskret anzeigen
                <span className="block text-sm text-muted">Ohne Details auf dem Sperrbildschirm</span>
              </span>
              <input type="checkbox" checked={rem.discreet} onChange={(e) => setRem({ discreet: e.target.checked })} className="size-5 accent-forest" />
            </label>
            <p className="text-sm leading-relaxed text-muted">
              Erinnerungen entstehen direkt auf diesem Gerät – ohne Server. Sie erscheinen, sobald du die App öffnest; als installierte App auf Android prüft sie zusätzlich im Hintergrund. Für Erinnerungen, die garantiert pünktlich kommen, übertrag die Termine in deinen Kalender:
            </p>
          </>
        )}
        <Button variant="ghost" onClick={() => downloadICS(state, today, rem.leadDays)}>
          <Icon name="calendar" size={18} /> In Kalender-App übertragen (.ics)
        </Button>
      </Card>

      <SectionTitle>Zyklus</SectionTitle>
      <Card className="space-y-4">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span>
            <span className="block font-semibold">Zykluserfassung</span>
            <span className="block text-sm text-muted">Blendet Zyklus-Tab und Kalendermarkierungen ein</span>
          </span>
          <input
            type="checkbox"
            checked={profile.cycleEnabled}
            onChange={(e) => set({ cycleEnabled: e.target.checked })}
            className="size-6 accent-plum"
          />
        </label>
        {profile.cycleEnabled && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Zykluslänge (Tage)">
              <input type="number" min={20} max={45} value={profile.cycleLength} onChange={(e) => set({ cycleLength: Number(e.target.value) || 28 })} />
            </Field>
            <Field label="Periodenlänge (Tage)">
              <input type="number" min={2} max={10} value={profile.periodLength} onChange={(e) => set({ periodLength: Number(e.target.value) || 5 })} />
            </Field>
          </div>
        )}
      </Card>

      {state.skipped.length > 0 && (
        <Button variant="ghost" className="mt-4" onClick={() => update((s) => ({ ...s, skipped: [] }))}>
          {state.skipped.length} ausgeblendete Vorsorge-Einträge wieder anzeigen
        </Button>
      )}

      <SectionTitle>Deine Daten</SectionTitle>
      <Card>
        <p className="flex items-start gap-3 text-[15px] leading-relaxed">
          <Icon name="lock" className="mt-0.5 shrink-0 text-forest" />
          Alles wird ausschließlich im Speicher dieses Browsers abgelegt. Es gibt kein Konto und keinen Server, der deine Gesundheitsdaten sieht.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" onClick={exportData}>Daten exportieren</Button>
          {app.people.length > 1 && (
            <Button
              variant="danger"
              onClick={() => {
                if (confirm(`Wirklich alle Daten von ${profile.name || "dieser Person"} löschen?`)) removePerson(state.id);
              }}
            >
              {profile.name || "Diese Person"} entfernen
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Wirklich alle Daten aller Personen auf diesem Gerät löschen?")) resetAll();
            }}
          >
            Alles löschen
          </Button>
        </div>
      </Card>
    </div>
  );
}
