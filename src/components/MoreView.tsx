"use client";

import { moreTabs, type ViewProps } from "./App";
import { Icon } from "./ui";

/** Übersicht aller weiteren Bereiche (mobil über „Mehr“ erreichbar). */
export default function MoreView({ app, profile, go, onPeople }: ViewProps & { onPeople: () => void }) {
  const tiles = [
    { id: "tipps" as const, label: "Tipps", icon: "spark", hint: "Bewegung, Ernährung, Schlaf – passend zum Alter" },
    ...moreTabs,
  ];
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl md:text-5xl">Mehr</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {tiles.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => go(t.id)}
            className="flex items-center gap-3.5 rounded-3xl border border-line bg-card p-4 text-left transition-colors hover:border-forest/40"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sage text-forest">
              <Icon name={t.icon} size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{t.label}</span>
              <span className="block text-sm leading-snug text-muted">{t.hint}</span>
            </span>
            <Icon name="right" size={16} className="shrink-0 text-muted" />
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onPeople} className="flex items-center gap-3.5 rounded-3xl border border-line bg-card p-4 text-left hover:border-forest/40">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-plum-soft text-plum">
            <Icon name="users" size={22} />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">Familie</span>
            <span className="block text-sm text-muted">
              {app.people.length > 1 ? `${app.people.length} Personen · aktiv: ${profile.name || "ohne Namen"}` : "Weitere Person anlegen"}
            </span>
          </span>
        </button>
        <button type="button" onClick={() => go("profil")} className="flex items-center gap-3.5 rounded-3xl border border-line bg-card p-4 text-left hover:border-forest/40">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sun-soft text-sun">
            <Icon name="settings" size={22} />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">Profil & Einstellungen</span>
            <span className="block text-sm text-muted">Risikofaktoren, Erinnerungen, Design, Daten</span>
          </span>
        </button>
      </div>
    </div>
  );
}
