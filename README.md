# Gesundheitskalender

Vorsorge, Impfungen, Zyklus und Gesundheitsempfehlungen in einem Kalender.

- **Vorsorge & Impfungen** – aus Geburtsdatum und Geschlecht berechnet (`src/data/vorsorge.ts`, Logik in `src/lib/care.ts`)
- **Zykluserfassung** (optional) – Periodentage, Prognose, Phasen-Tipps (`src/lib/cycle.ts`)
- **Empfehlungen** – Bewegung, Ernährung, Schlaf, Mental nach Alter (`src/data/empfehlungen.ts`)
- **Datenschutz** – alle Daten liegen ausschließlich im `localStorage` des Browsers

- **Installierbar (PWA)** – Manifest, Icons und Service Worker (`public/sw.js`) für Offline-Nutzung
- **Erinnerungen** – lokale Benachrichtigungen ohne Server (`src/lib/reminders.ts`) und Kalender-Export als `.ics` (`src/lib/ics.ts`)

> Stand der medizinischen Inhalte in `src/data/`: Impfungen sind gegen den STIKO-Impfkalender 2026 abgeglichen (anhand von Suchergebnissen, nicht der Originaldokumente). Die Prüfung von `vorsorge.ts` und `empfehlungen.ts` ist begonnen, aber **nicht abgeschlossen**.

## Entwicklung

```bash
npm install
npm run dev
```

Stack: Next.js (App Router), TypeScript, Tailwind CSS v4.
