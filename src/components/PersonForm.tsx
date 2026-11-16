"use client";

import { useState } from "react";
import { newPerson, type Person, type Sex } from "@/lib/store";
import { Button, Field } from "./ui";

const sexOptions: { id: Sex; label: string }[] = [
  { id: "female", label: "Weiblich" },
  { id: "male", label: "Männlich" },
  { id: "all", label: "Alle anzeigen" },
];

/** Formular zum Anlegen einer Person (eigenes Profil oder Familienmitglied). */
export default function PersonForm({
  submitLabel,
  onSubmit,
  nameLabel = "Vorname (optional)",
}: {
  submitLabel: string;
  onSubmit: (p: Person) => void;
  nameLabel?: string;
}) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState<Sex>("female");
  const [cycle, setCycle] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    onSubmit(
      newPerson({
        name: name.trim(),
        birthDate,
        sex,
        cycleEnabled: cycle && sex !== "male",
        cycleLength: 28,
        periodLength: 5,
      }),
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label={nameLabel}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
      </Field>
      <Field label="Geburtsdatum">
        <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
      </Field>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-muted">Empfehlungen anzeigen für</legend>
        <div className="grid grid-cols-3 gap-2">
          {sexOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={sex === o.id}
              onClick={() => setSex(o.id)}
              className={`min-h-11 rounded-xl border text-sm font-medium transition-colors ${
                sex === o.id ? "border-forest bg-forest text-onaccent" : "border-line bg-field"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>
      {sex !== "male" && (
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-plum-soft p-4">
          <input type="checkbox" checked={cycle} onChange={(e) => setCycle(e.target.checked)} className="size-5 accent-plum" />
          <span className="text-[15px]">
            <strong className="font-semibold">Zyklus erfassen</strong>
            <span className="block text-sm text-muted">Optional – jederzeit im Profil änderbar</span>
          </span>
        </label>
      )}
      <Button type="submit" className="w-full" disabled={!birthDate}>
        {submitLabel}
      </Button>
    </form>
  );
}
