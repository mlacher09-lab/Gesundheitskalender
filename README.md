# Gesundheitskalender

Vorsorge, Impfungen, Zyklus und Gesundheitsempfehlungen in einem Kalender.

- **Vorsorge & Impfungen** – aus Geburtsdatum und Geschlecht berechnet (`src/data/vorsorge.ts`, Logik in `src/lib/care.ts`)
- **Zykluserfassung** (optional) – Periodentage, Prognose, Phasen-Tipps (`src/lib/cycle.ts`)
- **Empfehlungen** – Bewegung, Ernährung, Schlaf, Mental nach Alter (`src/data/empfehlungen.ts`)
- **Datenschutz** – alle Daten liegen ausschließlich im `localStorage` des Browsers

> Die medizinischen Inhalte in `src/data/` sind ein erster Entwurf und noch **nicht gegen die Primärquellen (G-BA, STIKO, DGE, WHO) geprüft**.

## Entwicklung

```bash
npm install
npm run dev
```

Stack: Next.js (App Router), TypeScript, Tailwind CSS v4.
