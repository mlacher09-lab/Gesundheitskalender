"use client";

import { useEffect, useState } from "react";
import { startPwa } from "@/lib/pwa";
import { buildReminders, syncReminders } from "@/lib/reminders";
import { useStore, type AppState, type Person, type Profile } from "@/lib/store";
import { Icon } from "./ui";
import Onboarding from "./Onboarding";
import Today from "./Today";
import CalendarView from "./CalendarView";
import CareView from "./CareView";
import CycleView from "./CycleView";
import RecsView from "./RecsView";
import ProfileView from "./ProfileView";
import VaccineView from "./VaccineView";
import MedsView from "./MedsView";
import MeasurementsView from "./MeasurementsView";
import BonusView from "./BonusView";
import DoctorsView from "./DoctorsView";
import TravelView from "./TravelView";
import MoreView from "./MoreView";
import PeopleSheet from "./PeopleSheet";

export type Tab =
  | "heute"
  | "kalender"
  | "vorsorge"
  | "zyklus"
  | "tipps"
  | "impfpass"
  | "medikamente"
  | "messwerte"
  | "bonus"
  | "praxen"
  | "reise"
  | "mehr"
  | "profil";

export interface TabInfo {
  id: Tab;
  label: string;
  icon: string;
  hint?: string;
}

export const mainTabs: TabInfo[] = [
  { id: "heute", label: "Heute", icon: "home" },
  { id: "kalender", label: "Kalender", icon: "calendar" },
  { id: "vorsorge", label: "Vorsorge", icon: "shield" },
  { id: "zyklus", label: "Zyklus", icon: "cycle" },
  { id: "tipps", label: "Tipps", icon: "spark" },
];

export const moreTabs: TabInfo[] = [
  { id: "impfpass", label: "Impfpass", icon: "syringe", hint: "Impfungen mit Datum und nächster Auffrischung" },
  { id: "medikamente", label: "Medikamente", icon: "pill", hint: "Einnahmeplan und tägliche Checkliste" },
  { id: "messwerte", label: "Messwerte", icon: "chart", hint: "Blutdruck, Gewicht, Laborwerte im Verlauf" },
  { id: "bonus", label: "Bonusheft", icon: "star", hint: "Zahn-Bonus und Bonusprogramm der Kasse" },
  { id: "praxen", label: "Praxen", icon: "phone", hint: "Deine Ärztinnen und Ärzte mit Telefon und Buchungslink" },
  { id: "reise", label: "Reiseimpfungen", icon: "globe", hint: "Empfehlungen nach Zielland" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-2xl bg-hero text-hero-fg">
        <Icon name="leaf" size={18} />
      </span>
      <span className="font-display text-[19px] leading-none">
        Gesundheits
        <br className="hidden md:block" />
        kalender
      </span>
    </div>
  );
}

export default function App() {
  const app = useStore();
  useEffect(startPwa, []);

  const theme = app?.theme;
  useEffect(() => {
    if (!theme) return;
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Auf dem Server ist der Zustand null – die eigentliche App rendert nur im Browser.
  if (!app) return <div className="min-h-dvh bg-paper" />;
  const person = app.people.find((p) => p.id === app.activeId);
  if (!person) return <Onboarding />;
  return <Shell app={app} state={person} profile={person.profile} />;
}

function Shell({ app, state, profile }: Pick<ViewProps, "app" | "state" | "profile">) {
  const [tab, setTab] = useState<Tab>("heute");
  const [today] = useState(() => new Date());
  const [peopleOpen, setPeopleOpen] = useState(false);

  // Erinnerungen bei jeder Änderung für den Service Worker bereitstellen
  useEffect(() => {
    syncReminders(buildReminders(app, today));
  }, [app, today]);

  const main = mainTabs.filter((t) => t.id !== "zyklus" || profile.cycleEnabled);
  const current = tab === "zyklus" && !profile.cycleEnabled ? "heute" : tab;
  const go = (t: Tab) => {
    setTab(t);
    window.scrollTo(0, 0);
  };
  const props: ViewProps = { app, state, profile, today, go };
  const inMore = moreTabs.some((t) => t.id === current) || current === "mehr" || current === "profil" || current === "tipps";
  // Mobil: vier Hauptbereiche + „Mehr“
  const bottom: TabInfo[] = [
    ...main.filter((t) => t.id !== "tipps").slice(0, 4),
    ...(profile.cycleEnabled ? [] : [mainTabs[4]]),
    { id: "mehr", label: "Mehr", icon: "grid" },
  ];
  const initial = profile.name ? profile.name[0].toUpperCase() : null;

  const navButton = (t: TabInfo) => (
    <button
      key={t.id}
      type="button"
      onClick={() => go(t.id)}
      aria-current={current === t.id ? "page" : undefined}
      className={`flex items-center gap-3 rounded-2xl px-3.5 py-2 text-left text-[15px] font-medium transition-colors ${
        current === t.id ? "bg-forest text-onaccent" : "text-ink hover:bg-line/50"
      }`}
    >
      <Icon name={t.icon} />
      {t.label}
    </button>
  );

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl">
      {/* Desktop: Seitenleiste */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col overflow-y-auto p-6 md:flex">
        <Brand />
        <nav className="mt-8 flex flex-col gap-0.5" aria-label="Hauptnavigation">
          {main.map(navButton)}
          <p className="mb-1 mt-5 px-3.5 text-xs font-semibold uppercase tracking-wide text-muted">Meine Gesundheit</p>
          {moreTabs.map(navButton)}
        </nav>
        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => setPeopleOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-line bg-card p-2.5 text-left hover:border-forest/40"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage font-semibold text-forest">
              {initial ?? <Icon name="user" size={18} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{profile.name || "Mein Profil"}</span>
              <span className="block text-xs text-muted">
                {app.people.length > 1 ? `${app.people.length} Personen` : "Person wechseln"}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => go("profil")}
            aria-current={current === "profil" ? "page" : undefined}
            className={`mt-1 flex w-full items-center gap-3 rounded-2xl px-3.5 py-2 text-left text-[15px] font-medium ${
              current === "profil" ? "bg-forest text-onaccent" : "hover:bg-line/50"
            }`}
          >
            <Icon name="settings" /> Einstellungen
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobil: Kopfzeile */}
        <header className="flex items-center justify-between px-5 pt-5 md:hidden">
          <Brand />
          <button
            type="button"
            onClick={() => setPeopleOpen(true)}
            aria-label="Person wechseln"
            className="grid size-10 place-items-center rounded-full border border-line bg-card font-semibold text-forest"
          >
            {initial ?? <Icon name="user" size={18} />}
          </button>
        </header>

        <main key={`${current}-${state.id}`} className="rise flex-1 px-5 pb-28 pt-6 md:px-10 md:pb-12 md:pt-10">
          {current === "heute" && <Today {...props} />}
          {current === "kalender" && <CalendarView {...props} />}
          {current === "vorsorge" && <CareView {...props} />}
          {current === "zyklus" && <CycleView {...props} />}
          {current === "tipps" && <RecsView {...props} />}
          {current === "impfpass" && <VaccineView {...props} />}
          {current === "medikamente" && <MedsView state={state} today={today} />}
          {current === "messwerte" && <MeasurementsView state={state} today={today} />}
          {current === "bonus" && <BonusView {...props} />}
          {current === "praxen" && <DoctorsView app={app} state={state} today={today} />}
          {current === "reise" && <TravelView {...props} />}
          {current === "mehr" && <MoreView {...props} onPeople={() => setPeopleOpen(true)} />}
          {current === "profil" && <ProfileView {...props} />}
        </main>
      </div>

      {/* Mobil: Tab-Leiste */}
      <nav
        aria-label="Hauptnavigation"
        className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-[26px] border border-line bg-card/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.14)] backdrop-blur md:hidden"
      >
        {bottom.map((t) => {
          const active = t.id === "mehr" ? inMore && !bottom.some((b) => b.id === current && b.id !== "mehr") : current === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-14 flex-1 flex-col items-center gap-0.5 rounded-[20px] py-2 text-[11px] font-medium transition-colors ${
                active ? "bg-forest text-onaccent" : "text-muted"
              }`}
            >
              <Icon name={t.icon} />
              {t.label}
            </button>
          );
        })}
      </nav>

      {peopleOpen && <PeopleSheet app={app} onClose={() => setPeopleOpen(false)} />}
    </div>
  );
}

export interface ViewProps {
  app: AppState;
  /** Daten der aktuell ausgewählten Person */
  state: Person;
  profile: Profile;
  today: Date;
  go: (t: Tab) => void;
}
