"use client";

import { useState } from "react";
import { fmtLong, parse } from "@/lib/date";
import { uid, update, type Appointment, type Doctor } from "@/lib/store";
import { Button, Chip, Field, Icon, Sheet } from "./ui";

const bringIdeas = ["Versichertenkarte", "Impfpass", "Bonusheft", "Überweisung", "Medikamentenplan", "Vorbefunde", "Brille / Hörgerät", "Untersuchungsheft"];

/** Vorbereitung und Nachbereitung eines Arzttermins. */
export default function VisitSheet({
  appointment: a,
  doctors,
  onClose,
}: {
  appointment: Appointment;
  doctors: Doctor[];
  onClose: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [custom, setCustom] = useState("");
  const patch = (fn: (a: Appointment) => Appointment) =>
    update((p) => ({ ...p, appointments: p.appointments.map((x) => (x.id === a.id ? fn(x) : x)) }));

  const bring = a.bring ?? [];
  const questions = a.questions ?? [];
  const doctor = doctors.find((d) => d.id === a.doctorId);
  const toggleBring = (item: string) =>
    patch((x) => ({ ...x, bring: bring.includes(item) ? bring.filter((b) => b !== item) : [...bring, item] }));
  const addQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    patch((x) => ({ ...x, questions: [...questions, { id: uid(), text: question.trim(), done: false }] }));
    setQuestion("");
  };

  return (
    <Sheet title={a.title} onClose={onClose}>
      <p className="-mt-2 capitalize text-muted">
        {fmtLong(parse(a.date))}
        {a.time && ` · ${a.time} Uhr`}
      </p>

      <div className="mt-5 space-y-6">
        <Field label="Praxis">
          <select value={a.doctorId ?? ""} onChange={(e) => patch((x) => ({ ...x, doctorId: e.target.value || undefined }))}>
            <option value="">Keine ausgewählt</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </Field>
        {doctor?.phone && (
          <a
            href={`tel:${doctor.phone.replace(/[^\d+]/g, "")}`}
            className="-mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card px-5 text-[15px] font-semibold"
          >
            <Icon name="phone" size={18} /> {doctor.phone}
          </a>
        )}

        <section>
          <h3 className="font-semibold">Meine Fragen</h3>
          <ul className="mt-2 space-y-1.5">
            {questions.map((q) => (
              <li key={q.id} className="flex items-center gap-2 rounded-2xl border border-line bg-card pl-3.5">
                <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    checked={q.done}
                    onChange={() => patch((x) => ({ ...x, questions: questions.map((y) => (y.id === q.id ? { ...y, done: !y.done } : y)) }))}
                    className="size-5 shrink-0 accent-forest"
                  />
                  <span className={q.done ? "text-muted line-through" : ""}>{q.text}</span>
                </label>
                <button
                  type="button"
                  aria-label="Frage löschen"
                  onClick={() => patch((x) => ({ ...x, questions: questions.filter((y) => y.id !== q.id) }))}
                  className="grid size-11 shrink-0 place-items-center rounded-full text-muted"
                >
                  <Icon name="close" size={16} />
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addQuestion} className="mt-2 flex gap-2">
            <input type="text" aria-label="Neue Frage" placeholder="Was möchtest du fragen?" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <Button type="submit" variant="ghost" disabled={!question.trim()}>
              <Icon name="plus" size={18} />
            </Button>
          </form>
        </section>

        <section>
          <h3 className="font-semibold">Mitbringen</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {[...bringIdeas, ...bring.filter((b) => !bringIdeas.includes(b))].map((b) => (
              <Chip key={b} active={bring.includes(b)} onClick={() => toggleBring(b)}>
                {b}
              </Chip>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (custom.trim() && !bring.includes(custom.trim())) toggleBring(custom.trim());
              setCustom("");
            }}
            className="mt-2 flex gap-2"
          >
            <input type="text" aria-label="Weiteres mitbringen" placeholder="Etwas anderes …" value={custom} onChange={(e) => setCustom(e.target.value)} />
            <Button type="submit" variant="ghost" disabled={!custom.trim()}>
              <Icon name="plus" size={18} />
            </Button>
          </form>
        </section>

        <section>
          <h3 className="font-semibold">Notizen nach dem Termin</h3>
          <textarea
            rows={4}
            aria-label="Notizen nach dem Termin"
            placeholder="Was wurde besprochen? Was ist als Nächstes zu tun?"
            value={a.after ?? ""}
            onChange={(e) => patch((x) => ({ ...x, after: e.target.value }))}
            className="mt-2 block w-full rounded-xl p-3 text-base"
          />
        </section>
      </div>
    </Sheet>
  );
}
