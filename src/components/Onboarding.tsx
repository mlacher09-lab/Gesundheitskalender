"use client";

import { demoState } from "@/lib/demo";
import { addPerson, updateApp } from "@/lib/store";
import PersonForm from "./PersonForm";
import { Icon } from "./ui";

export default function Onboarding() {
  return (
    <div className="mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-6 py-10 md:grid-cols-2 md:gap-16">
      <div className="rise">
        <span className="grid size-12 place-items-center rounded-2xl bg-hero text-hero-fg">
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
            ["users", "Auch für die Familie – ein Profil pro Person"],
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

      <div
        className="rise space-y-5 rounded-[32px] border border-line bg-card p-6 md:p-8"
        style={{ animationDelay: "80ms" }}
      >
        <h2 className="font-display text-2xl">Kurz zu dir</h2>
        <PersonForm submitLabel="Kalender erstellen" onSubmit={addPerson} />
        <button
          type="button"
          onClick={() => updateApp(() => demoState(new Date()))}
          className="block w-full text-center text-sm font-medium text-forest underline underline-offset-4"
        >
          Erst mal mit Beispieldaten ansehen
        </button>
      </div>
    </div>
  );
}
