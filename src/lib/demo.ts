import { addDays, iso } from "./date";
import type { State } from "./store";

/** Beispieldaten, um die App ohne eigene Eingaben auszuprobieren. */
export function demoState(today: Date): State {
  const periodDays: string[] = [];
  for (let c = 0; c < 5; c++) {
    const start = addDays(today, -9 - c * 28 - (c % 2));
    for (let d = 0; d < 5; d++) periodDays.push(iso(addDays(start, d)));
  }
  return {
    profile: {
      name: "Lena",
      birthDate: "1990-03-14",
      sex: "female",
      cycleEnabled: true,
      cycleLength: 28,
      periodLength: 5,
    },
    done: {
      "check-up-ab-35": iso(addDays(today, -400)),
      "zahn-kontrolle-erwachsene": iso(addDays(today, -150)),
      "zahnstein-entfernung": iso(addDays(today, -150)),
      "impfung-td-auffrischung": iso(addDays(today, -2200)),
      "impfung-masern-erwachsene": iso(addDays(today, -3000)),
      "zervixkarzinom-ko-test-ab-35": iso(addDays(today, -1000)),
      "genitaluntersuchung-frau": iso(addDays(today, -330)),
      "brustuntersuchung-tasten": iso(addDays(today, -330)),
      "hepatitis-b-c-screening": iso(addDays(today, -400)),
    },
    skipped: ["impfung-fsme"],
    appointments: [
      { id: "demo1", title: "Zahnkontrolle", date: iso(addDays(today, 6)), time: "08:30", note: "Bonusheft mitnehmen", itemId: "zahn-kontrolle-erwachsene" },
      { id: "demo2", title: "Hautkrebs-Screening", date: iso(addDays(today, 23)), time: "14:15", itemId: "hautkrebs-screening" },
    ],
    symptoms: { [iso(addDays(today, -9))]: ["Krämpfe", "Müde"] },
    periodDays,
  };
}
