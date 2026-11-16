"use client";

import { resetAll, update, type Profile, type Sex } from "@/lib/store";
import type { ViewProps } from "./App";
import { Button, Card, Field, Icon, SectionTitle } from "./ui";

export default function ProfileView({ state, profile }: ViewProps) {
  const set = (patch: Partial<Profile>) =>
    update((s) => ({ ...s, profile: { ...s.profile!, ...patch } }));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
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
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Wirklich alle Daten auf diesem Gerät löschen?")) resetAll();
            }}
          >
            Alles löschen
          </Button>
        </div>
      </Card>
    </div>
  );
}
