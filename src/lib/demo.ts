import { addDays, iso } from "./date";
import { newPerson, noRisk, type AppState, type Measurement } from "./store";

/** Beispieldaten, um die App ohne eigene Eingaben auszuprobieren. */
export function demoState(today: Date): AppState {
  const d = (n: number) => iso(addDays(today, n));
  const periodDays: string[] = [];
  for (let c = 0; c < 5; c++) {
    const start = addDays(today, -9 - c * 28 - (c % 2));
    for (let i = 0; i < 5; i++) periodDays.push(iso(addDays(start, i)));
  }
  const bp: Measurement[] = [124, 131, 127, 122, 129, 125, 121, 126, 119, 123].map((v, i) => ({
    id: `bp${i}`,
    type: "bp",
    date: d(-90 + i * 10),
    value: v,
    value2: 78 + ((i * 3) % 7),
  }));
  const weight: Measurement[] = [68.4, 68.1, 67.8, 67.9, 67.2, 66.9].map((v, i) => ({
    id: `w${i}`,
    type: "weight",
    date: d(-100 + i * 20),
    value: v,
  }));

  const lena = {
    ...newPerson({
      name: "Lena",
      birthDate: "1990-03-14",
      sex: "female",
      cycleEnabled: true,
      cycleLength: 28,
      periodLength: 5,
      risk: noRisk,
    }),
    id: "demo-lena",
    done: {
      "check-up-ab-35": d(-400),
      "zahn-kontrolle-erwachsene": d(-150),
      "zahnstein-entfernung": d(-150),
      "impfung-td-auffrischung": d(-2200),
      "impfung-masern-erwachsene": d(-3000),
      "zervixkarzinom-ko-test-ab-35": d(-1000),
      "genitaluntersuchung-frau": d(-330),
      "brustuntersuchung-tasten": d(-330),
      "hepatitis-b-c-screening": d(-400),
    },
    appointments: [
      {
        id: "demo1",
        title: "Zahnkontrolle",
        date: d(6),
        time: "08:30",
        note: "Bonusheft mitnehmen",
        itemId: "zahn-kontrolle-erwachsene",
        doctorId: "doc-zahn",
        bring: ["Versichertenkarte", "Bonusheft"],
        questions: [{ id: "q1", text: "Empfindlicher Zahn oben links – was tun?", done: false }],
      },
      { id: "demo2", title: "Hautkrebs-Screening", date: d(23), time: "14:15", itemId: "hautkrebs-screening", doctorId: "doc-haut" },
    ],
    symptoms: { [d(-9)]: ["Krämpfe", "Müde"] },
    periodDays,
    vaccLog: [
      { id: "v1", itemId: "impfung-td-auffrischung", name: "Tetanus-/Diphtherie-Auffrischung", date: d(-2200), note: "als Tdap" },
      { id: "v2", itemId: "impfung-masern-erwachsene", name: "Masern (MMR)", date: d(-3000) },
      { id: "v3", name: "Hepatitis A", date: d(-1500), note: "vor Thailand-Reise" },
    ],
    meds: [
      { id: "m1", name: "L-Thyroxin", dose: "75 µg", times: ["07:00"], note: "nüchtern, 30 Min. vor dem Frühstück", active: true },
      { id: "m2", name: "Vitamin D", dose: "1 Tablette", times: ["12:30"], active: true },
    ],
    medLog: { [d(0)]: ["m1@07:00"], [d(-1)]: ["m1@07:00", "m2@12:30"], [d(-2)]: ["m1@07:00"] },
    measurements: [...bp, ...weight, { id: "l1", type: "lab" as const, date: d(-400), value: 118, label: "LDL-Cholesterin", unit: "mg/dl" }],
    activities: [
      { id: "a0", date: d(0), minutes: 25, intensity: "moderat" as const, kind: "Gehen" },
      { id: "a1", date: d(-1), minutes: 45, intensity: "moderat" as const, kind: "Radfahren" },
      { id: "a2", date: d(-2), minutes: 30, intensity: "intensiv" as const, kind: "Laufen" },
      { id: "a3", date: d(-3), minutes: 40, intensity: "moderat" as const, kind: "Krafttraining", strength: true },
      { id: "a4", date: d(-8), minutes: 60, intensity: "moderat" as const, kind: "Wandern" },
      { id: "a5", date: d(-10), minutes: 35, intensity: "moderat" as const, kind: "Krafttraining", strength: true },
      { id: "a6", date: d(-12), minutes: 50, intensity: "intensiv" as const, kind: "Schwimmen" },
      { id: "a7", date: d(-16), minutes: 90, intensity: "moderat" as const, kind: "Radfahren" },
    ],
    bonus: [0, 1, 2, 3].map((y) => ({
      id: `b${y}`,
      program: "zahn" as const,
      title: "Zahnärztliche Kontrolle",
      date: `${today.getFullYear() - y}-0${3 + y}-12`,
    })),
  };

  const jonas = {
    ...newPerson({
      name: "Jonas",
      birthDate: `${today.getFullYear() - 4}-05-20`,
      sex: "male",
      cycleEnabled: false,
      cycleLength: 28,
      periodLength: 5,
      risk: noRisk,
    }),
    id: "demo-jonas",
    done: { u8: `${today.getFullYear()}-02-10`, "impfung-mmr-varizellen": `${today.getFullYear() - 3}-08-15` },
  };

  return {
    people: [lena, jonas],
    activeId: lena.id,
    doctors: [
      { id: "doc-zahn", name: "Zahnarztpraxis Dr. Weber", specialty: "Zahnarzt", phone: "030 1234567", address: "Lindenstraße 12, 10969 Berlin", bookingUrl: "https://www.doctolib.de" },
      { id: "doc-haut", name: "Hautarztpraxis am Park", specialty: "Hautarzt", phone: "030 7654321", address: "Parkallee 3, 10785 Berlin" },
      { id: "doc-haus", name: "Dr. Yilmaz", specialty: "Hausarzt", phone: "030 2468135", note: "Offene Sprechstunde Mo–Fr 8–10 Uhr" },
    ],
    reminders: { enabled: false, leadDays: 1, cycle: false, discreet: false },
    theme: "system",
  };
}
