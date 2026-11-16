"use client";

import { useState } from "react";
import { ageAt, parse } from "@/lib/date";
import { addPerson, setActive, type AppState } from "@/lib/store";
import PersonForm from "./PersonForm";
import { Button, Icon, Sheet } from "./ui";

/** Personen wechseln und Familienmitglieder anlegen. */
export default function PeopleSheet({ app, onClose }: { app: AppState; onClose: () => void }) {
  const [adding, setAdding] = useState(false);
  const [now] = useState(() => new Date());

  if (adding)
    return (
      <Sheet title="Person hinzufügen" onClose={onClose}>
        <p className="mb-5 text-[15px] leading-relaxed text-muted">
          Zum Beispiel ein Kind oder ein Elternteil: Jede Person bekommt ihren eigenen Vorsorgeplan, Impfpass und Kalender.
        </p>
        <PersonForm
          nameLabel="Vorname"
          submitLabel="Hinzufügen"
          onSubmit={(p) => {
            addPerson(p);
            onClose();
          }}
        />
      </Sheet>
    );

  return (
    <Sheet title="Wer ist dran?" onClose={onClose}>
      <div className="space-y-2">
        {app.people.map((p) => {
          const active = p.id === app.activeId;
          const age = Math.floor(ageAt(parse(p.profile.birthDate), now));
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setActive(p.id);
                onClose();
              }}
              className={`flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-colors ${
                active ? "border-forest bg-sage" : "border-line bg-card hover:border-forest/40"
              }`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-forest font-semibold text-onaccent">
                {p.profile.name ? p.profile.name[0].toUpperCase() : <Icon name="user" size={18} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{p.profile.name || "Ohne Namen"}</span>
                <span className="block text-sm text-muted">{age < 1 ? "unter 1 Jahr" : `${age} Jahre`}</span>
              </span>
              {active && <Icon name="check" className="text-forest" />}
            </button>
          );
        })}
      </div>
      <Button variant="ghost" className="mt-4 w-full" onClick={() => setAdding(true)}>
        <Icon name="plus" size={18} /> Person hinzufügen
      </Button>
    </Sheet>
  );
}
