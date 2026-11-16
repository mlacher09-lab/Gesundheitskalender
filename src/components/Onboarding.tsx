"use client";

import { useState } from "react";
import { demoState } from "@/lib/demo";
import { update, type Sex } from "@/lib/store";
import { Button, Field, Icon } from "./ui";

const sexOptions: { id: Sex; label: string }[] = [
  { id: "female", label: "Weiblich" },
  { id: "male", label: "Männlich" },
  { id: "all", label: "Alle anzeigen" },
];

export default function Onboarding() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState<Sex>("female");
  const [cycle, setCycle] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    update((s) => ({
      ...s,
      profile: {
        name: name.trim(),
        birthDate,
        sex,
        cycleEnabled: cycle && sex !== "male",
        cycleLength: 28,
        periodLength: 5,
      },
    }));
  };

  return (
    <div className="mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-6 py-10 md:grid-cols-2 md:gap-16">
      <div className="rise">
        <span className="grid size-12 place-items-center rounded-2xl bg-forest text-white">
          <Icon name="leaf" size={24} />
        </span>
        <h1 className="font-display mt-6 text-[44px] leading-[1.02] md:text-6xl">
          Deine Gesundheit,
          <br />
          <em className="text-forest">gut geplant.</em>
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
          Vorsorge, Impfungen, Zyklus und Bewegung – ein Kalender, der weiß,
          was in deinem Alter ansteht.
        </p>
        <ul className="mt-8 space-y-3 text-[15px]">
          {[
            ["shield", "Vorsorge & Impfungen nach Alter – automatisch berechnet"],
            ["cycle", "Zykluserfassung, wenn du sie möchtest"],
            ["run", "Empfehlungen zu Bewegung, Ernährung und Schlaf"],
            ["lock", "Alle Daten bleiben lokal auf deinem Gerät"],
          ].map(([icon, text]) => (
            <li key={text} className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sage text-forest">
                <Icon name={icon} size={18} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={submit}
        className="rise space-y-5 rounded-[32px] border border-line bg-card p-6 md:p-8"
        style={{ animationDelay: "80ms" }}
      >
        <h2 className="font-display text-2xl">Kurz zu dir</h2>
        <Field label="Vorname (optional)">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
        </Field>
        <Field label="Geburtsdatum">
          <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-muted">
            Empfehlungen anzeigen für
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {sexOptions.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={sex === o.id}
                onClick={() => setSex(o.id)}
                className={`min-h-11 rounded-xl border text-sm font-medium transition-colors ${
                  sex === o.id ? "border-forest bg-forest text-white" : "border-line bg-white"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
        {sex !== "male" && (
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-plum-soft p-4">
            <input
              type="checkbox"
              checked={cycle}
              onChange={(e) => setCycle(e.target.checked)}
              className="size-5 accent-plum"
            />
            <span className="text-[15px]">
              <strong className="font-semibold">Zyklus erfassen</strong>
              <span className="block text-sm text-muted">Optional – jederzeit im Profil änderbar</span>
            </span>
          </label>
        )}
        <Button type="submit" className="w-full" disabled={!birthDate}>
          Kalender erstellen
        </Button>
        <button
          type="button"
          onClick={() => update(() => demoState(new Date()))}
          className="block w-full text-center text-sm font-medium text-forest underline underline-offset-4"
        >
          Erst mal mit Beispieldaten ansehen
        </button>
      </form>
    </div>
  );
}
