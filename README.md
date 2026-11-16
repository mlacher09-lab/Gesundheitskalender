# Gesundheitskalender

Vorsorge, Impfungen, Zyklus und Gesundheitsempfehlungen in einem Kalender.

- **Vorsorge & Impfungen** – aus Geburtsdatum und Geschlecht berechnet (`src/data/vorsorge.ts`, Logik in `src/lib/care.ts`)
- **Zykluserfassung** (optional) – Periodentage, Prognose, Phasen-Tipps (`src/lib/cycle.ts`)
- **Empfehlungen** – Bewegung, Ernährung, Schlaf, Mental nach Alter (`src/data/empfehlungen.ts`)
- **Datenschutz** – alle Daten liegen ausschließlich im `localStorage` des Browsers

- **Familienprofile** – mehrere Personen mit eigenem Plan, Impfpass und Kalender
- **Risikofaktoren** – Rauchen, Schwangerschaft, chronische Erkrankung, familiäres Risiko, FSME-Gebiet passen den Plan an (`src/data/risiko.ts`)
- **Impfpass** – eingetragene Impfungen mit Countdown bis zur Auffrischung
- **Medikamentenplan**, **Messwerte-Tagebuch** (Blutdruck, Gewicht, Labor mit Verlauf), **Bonusheft**
- **Praxen** und **Terminvorbereitung** (Fragen, Mitbringen, Notizen danach)
- **Reiseimpfungen** nach Zielland (`src/data/reise.ts`, aus den STIKO/DTG-Ländertabellen des RKI, Epid. Bull. 27/2026)
- **Dunkles Design** – automatisch oder fest wählbar
- **Installierbar (PWA)** – Manifest, Icons und Service Worker (`public/sw.js`) für Offline-Nutzung
- **Erinnerungen** – lokale Benachrichtigungen ohne Server (`src/lib/reminders.ts`) und Kalender-Export als `.ics` (`src/lib/ics.ts`)

> Stand der medizinischen Inhalte in `src/data/` (November 2026): Impfungen sind am STIKO-Impfkalender 2026 (RKI, Epid. Bull. 4/2026 und 28/2026) geprüft, Untersuchungen an Richtlinien und Versicherteninformationen von G-BA, BMG und gesund.bund.de, Empfehlungen an WHO, DGE und gesund.bund.de. Einzelne Punkte (z. B. Zahnstein-Intervall, freiwillige Kassenleistungen U10/U11/J2, Zyklus-Tipps, vier Alltagstipps) sind nicht an einem Originaldokument belegt. Die Angaben ersetzen keine ärztliche Beratung.

## Entwicklung

```bash
npm install
npm run dev
```

Stack: Next.js (App Router), TypeScript, Tailwind CSS v4.
