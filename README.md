# Gesundheitskalender

Vorsorge, Impfungen, Zyklus und Gesundheitsempfehlungen in einem Kalender.

- **Vorsorge & Impfungen** – aus Geburtsdatum und Geschlecht berechnet (`src/data/vorsorge.ts`, Logik in `src/lib/care.ts`)
- **Zykluserfassung** (optional) – Periodentage, Prognose, Phasen-Tipps (`src/lib/cycle.ts`)
- **Empfehlungen** – Bewegung, Ernährung, Schlaf, Mental nach Alter (`src/data/empfehlungen.ts`)
- **Datenschutz** – alle Daten liegen ausschließlich im `localStorage` des Browsers

- **Installierbar (PWA)** – Manifest, Icons und Service Worker (`public/sw.js`) für Offline-Nutzung
- **Erinnerungen** – lokale Benachrichtigungen ohne Server (`src/lib/reminders.ts`) und Kalender-Export als `.ics` (`src/lib/ics.ts`)

> Stand der medizinischen Inhalte in `src/data/` (November 2026): Alle Einträge wurden per Websuche mit STIKO-, G-BA-, WHO- und DGE-Angaben abgeglichen – allerdings nur anhand von Suchergebnis-Zusammenfassungen, **nicht anhand der Originaldokumente**. Die `sourceUrl`-Links wurden nicht einzeln geöffnet. Vor einem öffentlichen Einsatz ist eine fachliche Prüfung nötig.

## Entwicklung

```bash
npm install
npm run dev
```

Stack: Next.js (App Router), TypeScript, Tailwind CSS v4.
