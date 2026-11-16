/* Service Worker: Offline-Nutzung und lokale Erinnerungen.
   Es werden keine Daten an einen Server gesendet. */
const STATIC = "gk-static-v1";
const DATA = "gk-data";
const REMINDERS = "/__gk/reminders";
const SHOWN = "/__gk/shown";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("gk-static-") && k !== STATIC)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

const isAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  /\.(png|svg|ico|woff2?)$/.test(url.pathname) ||
  url.pathname === "/manifest.webmanifest";

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Seite: Netz zuerst, offline aus dem Cache
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC);
        try {
          const res = await fetch(req);
          if (res.ok) cache.put("/", res.clone());
          return res;
        } catch {
          return (await cache.match("/")) || Response.error();
        }
      })(),
    );
    return;
  }

  // Unveränderliche Dateien: Cache zuerst
  if (isAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC);
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      })(),
    );
  }
});

async function readJSON(key, fallback) {
  const cache = await caches.open(DATA);
  const res = await cache.match(key);
  return res ? res.json() : fallback;
}

async function writeJSON(key, value) {
  const cache = await caches.open(DATA);
  await cache.put(
    key,
    new Response(JSON.stringify(value), {
      headers: { "content-type": "application/json" },
    }),
  );
}

const pad = (n) => String(n).padStart(2, "0");
const localISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Zeigt alle Erinnerungen, die heute (oder in den letzten 3 Tagen) fällig wurden, genau einmal. */
async function checkReminders() {
  if (self.Notification && Notification.permission !== "granted") return;
  const list = await readJSON(REMINDERS, []);
  const shown = await readJSON(SHOWN, []);
  const now = new Date();
  const today = localISO(now);
  const earliest = localISO(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3));
  const due = list.filter(
    (r) => r.date <= today && r.date >= earliest && !shown.includes(r.key),
  );
  if (!due.length) return;
  for (const r of due) {
    await self.registration.showNotification(r.title, {
      body: r.body,
      tag: r.key,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      lang: "de",
    });
  }
  await writeJSON(SHOWN, [...shown, ...due.map((r) => r.key)].slice(-300));
}

self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "check") event.waitUntil(checkReminders());
  if (msg.type === "precache" && Array.isArray(msg.urls)) {
    event.waitUntil(
      caches.open(STATIC).then((cache) =>
        Promise.all(msg.urls.map((u) => cache.add(u).catch(() => undefined))),
      ),
    );
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "gk-reminders") event.waitUntil(checkReminders());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      if (clients.length) return clients[0].focus();
      return self.clients.openWindow("/");
    })(),
  );
});
