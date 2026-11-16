"use client";

import { useEffect, useState } from "react";
import { startPwa } from "@/lib/pwa";
import { buildReminders, syncReminders } from "@/lib/reminders";
import { useStore } from "@/lib/store";
import { Icon } from "./ui";
import Onboarding from "./Onboarding";
import Today from "./Today";
import CalendarView from "./CalendarView";
import CareView from "./CareView";
import CycleView from "./CycleView";
import RecsView from "./RecsView";
import ProfileView from "./ProfileView";

export type Tab = "heute" | "kalender" | "vorsorge" | "zyklus" | "tipps" | "profil";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "heute", label: "Heute", icon: "home" },
  { id: "kalender", label: "Kalender", icon: "calendar" },
  { id: "vorsorge", label: "Vorsorge", icon: "shield" },
  { id: "zyklus", label: "Zyklus", icon: "cycle" },
  { id: "tipps", label: "Tipps", icon: "spark" },
  { id: "profil", label: "Profil", icon: "user" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-2xl bg-forest text-white">
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
  const state = useStore();
  useEffect(startPwa, []);
  // Auf dem Server ist der Zustand null – die eigentliche App rendert nur im Browser.
  if (!state) return <div className="min-h-dvh bg-paper" />;
  if (!state.profile) return <Onboarding />;
  return <Shell state={state} profile={state.profile} />;
}

function Shell({ state, profile }: Pick<ViewProps, "state" | "profile">) {
  const [tab, setTab] = useState<Tab>("heute");
  const [today] = useState(() => new Date());

  // Erinnerungen bei jeder Änderung für den Service Worker bereitstellen
  useEffect(() => {
    syncReminders(buildReminders(state, today));
  }, [state, today]);
  const visible = tabs.filter((t) => t.id !== "zyklus" || profile.cycleEnabled);
  const current = tab === "zyklus" && !profile.cycleEnabled ? "heute" : tab;
  const props = { state, profile, today, go: setTab };

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl">
      {/* Desktop: Seitenleiste */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col p-6 md:flex">
        <Brand />
        <nav className="mt-10 flex flex-col gap-1" aria-label="Hauptnavigation">
          {visible.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={current === t.id ? "page" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-[15px] font-medium transition-colors ${
                current === t.id
                  ? "bg-forest text-white"
                  : "text-ink hover:bg-line/50"
              }`}
            >
              <Icon name={t.icon} />
              {t.label}
            </button>
          ))}
        </nav>
        <p className="mt-auto flex items-start gap-2 text-xs leading-relaxed text-muted">
          <Icon name="lock" size={14} className="mt-0.5 shrink-0" />
          Deine Daten bleiben auf diesem Gerät.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobil: Kopfzeile */}
        <header className="flex items-center justify-between px-5 pt-5 md:hidden">
          <Brand />
          <button
            type="button"
            onClick={() => setTab("profil")}
            aria-label="Profil"
            className="grid size-10 place-items-center rounded-full border border-line bg-card font-semibold text-forest"
          >
            {profile.name ? profile.name[0].toUpperCase() : <Icon name="user" size={18} />}
          </button>
        </header>

        <main key={current} className="rise flex-1 px-5 pb-28 pt-6 md:px-10 md:pb-12 md:pt-10">
          {current === "heute" && <Today {...props} />}
          {current === "kalender" && <CalendarView {...props} />}
          {current === "vorsorge" && <CareView {...props} />}
          {current === "zyklus" && <CycleView {...props} />}
          {current === "tipps" && <RecsView {...props} />}
          {current === "profil" && <ProfileView {...props} />}
        </main>
      </div>

      {/* Mobil: Tab-Leiste */}
      <nav
        aria-label="Hauptnavigation"
        className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-[26px] border border-line bg-card/95 p-1.5 shadow-[0_8px_30px_rgba(27,43,39,0.12)] backdrop-blur md:hidden"
      >
        {visible
          .filter((t) => t.id !== "profil")
          .map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={current === t.id ? "page" : undefined}
              className={`flex min-w-14 flex-1 flex-col items-center gap-0.5 rounded-[20px] py-2 text-[11px] font-medium transition-colors ${
                current === t.id ? "bg-forest text-white" : "text-muted"
              }`}
            >
              <Icon name={t.icon} />
              {t.label}
            </button>
          ))}
      </nav>
    </div>
  );
}

export interface ViewProps {
  state: NonNullable<ReturnType<typeof useStore>>;
  profile: NonNullable<NonNullable<ReturnType<typeof useStore>>["profile"]>;
  today: Date;
  go: (t: Tab) => void;
}
