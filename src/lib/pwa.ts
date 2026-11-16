"use client";

import { useSyncExternalStore } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let installEvent: InstallPromptEvent | null = null;
let started = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Registriert den Service Worker (nur im Produktiv-Build) und merkt sich das Installations-Angebot des Browsers. */
export function startPwa() {
  if (started || typeof window === "undefined") return;
  started = true;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installEvent = e as InstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installEvent = null;
    emit();
  });

  if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => navigator.serviceWorker.ready)
    .then((reg) => {
      // Bereits geladene Dateien nachträglich für die Offline-Nutzung sichern
      const urls = performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((u) => u.startsWith(location.origin) && u.includes("/_next/static/"));
      reg.active?.postMessage({ type: "precache", urls: ["/", ...urls] });
    })
    .catch(() => undefined);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** true, wenn der Browser die Installation per Knopfdruck anbietet. */
export function useCanInstall() {
  return useSyncExternalStore(subscribe, () => installEvent !== null, () => false);
}

export async function promptInstall() {
  if (!installEvent) return;
  await installEvent.prompt();
  await installEvent.userChoice;
  installEvent = null;
  emit();
}

export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
