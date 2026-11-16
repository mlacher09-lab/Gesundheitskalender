"use client";

import { useState } from "react";
import type { AppState, Doctor, Person } from "@/lib/store";
import { uid, updateApp } from "@/lib/store";
import { fmtMed, iso, parse } from "@/lib/date";
import { Button, Card, Field, Icon, SectionTitle, Sheet } from "@/components/ui";

const SPECIALTIES = [
  "Hausarzt",
  "Zahnarzt",
  "Gynäkologie",
  "Hautarzt",
  "Kinderarzt",
  "Augenarzt",
  "Urologie",
  "HNO",
  "Orthopädie",
];
const OTHER = "Sonstige";

const inputCls =
  "min-h-11 w-full rounded-2xl border border-line bg-field px-4 text-[15px] text-ink placeholder:text-muted focus:border-forest focus:outline-none";
const linkBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors";
const linkPrimary = `${linkBase} bg-forest text-onaccent`;
const linkGhost = `${linkBase} border border-line bg-card text-ink hover:border-forest/40`;

function telHref(phone?: string) {
  const n = (phone ?? "").replace(/[^\d+]/g, "");
  return n ? `tel:${n}` : null;
}

function safeUrl(raw?: string) {
  const t = (raw ?? "").trim();
  if (!t) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

function routeHref(address?: string) {
  const a = (address ?? "").trim();
  return a
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`
    : null;
}

function specialtyRank(s: string) {
  const i = SPECIALTIES.indexOf(s);
  return i === -1 ? SPECIALTIES.length : i;
}

export default function DoctorsView({
  app,
  state,
  today,
}: {
  app: AppState;
  state: Person;
  today: Date;
}) {
  const [editing, setEditing] = useState<Doctor | "new" | null>(null);
  const todayIso = iso(today);

  const nextAppt = (doctorId: string) =>
    state.appointments
      .filter((a) => a.doctorId === doctorId && a.date >= todayIso)
      .sort((a, b) =>
        `${a.date} ${a.time ?? ""}`.localeCompare(`${b.date} ${b.time ?? ""}`),
      )[0];

  const sorted = [...app.doctors].sort(
    (a, b) =>
      specialtyRank(a.specialty) - specialtyRank(b.specialty) ||
      a.specialty.localeCompare(b.specialty, "de") ||
      a.name.localeCompare(b.name, "de"),
  );
  const groups: { specialty: string; items: Doctor[] }[] = [];
  for (const d of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.specialty === d.specialty) last.items.push(d);
    else groups.push({ specialty: d.specialty, items: [d] });
  }

  const save = (d: Doctor) =>
    updateApp((s) => ({
      ...s,
      doctors: s.doctors.some((x) => x.id === d.id)
        ? s.doctors.map((x) => (x.id === d.id ? d : x))
        : [...s.doctors, d],
    }));

  const remove = (id: string) =>
    updateApp((s) => ({ ...s, doctors: s.doctors.filter((x) => x.id !== id) }));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-4xl md:text-5xl">Meine Praxen</h1>
      <p className="mt-2 text-muted">
        Alle Praxen der Familie auf einen Blick – mit Telefon, Online-Termin und Route.
      </p>

      {sorted.length === 0 ? (
        <Card className="mt-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-sky-soft text-sky">
            <Icon name="heart" size={26} />
          </div>
          <h2 className="mt-4 font-display text-2xl">Noch keine Praxis gespeichert</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Lege deine Hausarztpraxis, Zahnarzt und Co. an – dann sind Nummer und
            Terminbuchung immer griffbereit.
          </p>
          <Button className="mt-5" onClick={() => setEditing("new")}>
            <Icon name="plus" size={18} />
            Praxis hinzufügen
          </Button>
        </Card>
      ) : (
        <>
          <div className="mt-6">
            <Button onClick={() => setEditing("new")}>
              <Icon name="plus" size={18} />
              Praxis hinzufügen
            </Button>
          </div>
          {groups.map((g) => (
            <section key={g.specialty}>
              <SectionTitle aside={g.items.length}>{g.specialty}</SectionTitle>
              <div className="grid gap-4 md:grid-cols-2">
                {g.items.map((d) => {
                  const tel = telHref(d.phone);
                  const book = safeUrl(d.bookingUrl);
                  const route = routeHref(d.address);
                  const next = nextAppt(d.id);
                  return (
                    <Card key={d.id} className="flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="inline-block rounded-full bg-sky-soft px-2.5 py-0.5 text-xs font-semibold text-sky">
                            {d.specialty}
                          </span>
                          <h3 className="mt-2 break-words font-display text-2xl leading-tight">
                            {d.name}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditing(d)}
                          aria-label={`${d.name} bearbeiten`}
                          className="-mr-1 -mt-1 inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-medium text-muted hover:bg-line/60"
                        >
                          Bearbeiten
                          <Icon name="right" size={16} />
                        </button>
                      </div>
                      {d.address && (
                        <p className="mt-2 whitespace-pre-line break-words text-[15px] text-ink">
                          {d.address}
                        </p>
                      )}
                      {d.note && (
                        <p className="mt-2 whitespace-pre-line break-words text-sm text-muted">
                          {d.note}
                        </p>
                      )}
                      {next && (
                        <p className="mt-3 flex items-center gap-2 rounded-2xl bg-teal-soft px-3 py-2 text-sm font-medium text-teal">
                          <Icon name="calendar" size={16} />
                          <span>
                            Nächster Termin: {fmtMed(parse(next.date))}
                            {next.time ? `, ${next.time} Uhr` : ""}
                          </span>
                        </p>
                      )}
                      {(tel || book || route) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {tel && (
                            <a href={tel} className={linkPrimary}>
                              <Icon name="phone" size={18} />
                              Anrufen
                            </a>
                          )}
                          {book && (
                            <a
                              href={book}
                              target="_blank"
                              rel="noreferrer"
                              className={linkGhost}
                            >
                              <Icon name="calendar" size={18} />
                              Online buchen
                            </a>
                          )}
                          {route && (
                            <a
                              href={route}
                              target="_blank"
                              rel="noreferrer"
                              className={linkGhost}
                            >
                              <Icon name="right" size={18} />
                              Route
                            </a>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </>
      )}

      {editing && (
        <DoctorSheet
          key={editing === "new" ? "new" : editing.id}
          doctor={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            save(d);
            setEditing(null);
          }}
          onDelete={(d) => {
            if (confirm(`„${d.name}“ wirklich löschen? Termine bleiben erhalten.`)) {
              remove(d.id);
              setEditing(null);
            }
          }}
        />
      )}
    </div>
  );
}

function DoctorSheet({
  doctor,
  onClose,
  onSave,
  onDelete,
}: {
  doctor: Doctor | null;
  onClose: () => void;
  onSave: (d: Doctor) => void;
  onDelete: (d: Doctor) => void;
}) {
  const initialSpec = doctor?.specialty ?? "Hausarzt";
  const known = SPECIALTIES.includes(initialSpec);
  const [name, setName] = useState(doctor?.name ?? "");
  const [spec, setSpec] = useState(known ? initialSpec : OTHER);
  const [custom, setCustom] = useState(known ? "" : initialSpec);
  const [phone, setPhone] = useState(doctor?.phone ?? "");
  const [address, setAddress] = useState(doctor?.address ?? "");
  const [url, setUrl] = useState(doctor?.bookingUrl ?? "");
  const [note, setNote] = useState(doctor?.note ?? "");

  const specialty = spec === OTHER ? custom.trim() || OTHER : spec;
  const valid = name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    onSave({
      id: doctor?.id ?? uid(),
      name: name.trim(),
      specialty,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      bookingUrl: url.trim() || undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <Sheet title={doctor ? "Praxis bearbeiten" : "Praxis hinzufügen"} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Field label="Name der Praxis">
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Praxis Dr. Müller"
            required
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-muted">Fachrichtung</span>
          <div className="flex flex-wrap gap-2">
            {[...SPECIALTIES, OTHER].map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={spec === s}
                onClick={() => setSpec(s)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  spec === s
                    ? "border-forest bg-forest text-onaccent"
                    : "border-line bg-card text-ink hover:border-forest/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {spec === OTHER && (
            <input
              className={`${inputCls} mt-3`}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Fachrichtung eintragen"
              aria-label="Eigene Fachrichtung"
            />
          )}
        </div>

        <Field label="Telefon">
          <input
            type="tel"
            className={inputCls}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="z. B. 030 1234567"
          />
        </Field>
        <Field label="Adresse">
          <input
            className={inputCls}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Straße Nr., PLZ Ort"
          />
        </Field>
        <Field label="Link zur Online-Terminbuchung">
          <input
            type="url"
            className={inputCls}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
          />
        </Field>
        <Field label="Notiz">
          <textarea
            className={`${inputCls} min-h-24 py-3`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z. B. Sprechzeiten: Mo–Fr 8–12 Uhr"
          />
        </Field>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={!valid}>
            Speichern
          </Button>
          {doctor && (
            <Button variant="danger" onClick={() => onDelete(doctor)}>
              Löschen
            </Button>
          )}
        </div>
      </form>
    </Sheet>
  );
}
