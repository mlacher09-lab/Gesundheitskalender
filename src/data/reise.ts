// Reiseimpfempfehlungen nach Zielland.
// Quelle der Länderzuordnung: Ländertabellen als Anhang zum Epidemiologischen Bulletin 27/2026
// (RKI, 2. Juli 2026; Stand WHO Polio Statement 08/2026) - Empfehlungen der STIKO und der DTG zu Reiseimpfungen.
// Abbildung der Quellkategorien:
//   "Nachweispflicht gemäß WHO" bei Einreise aus Deutschland  -> level "pflicht"
//   "Impfungen für alle Reisenden"                            -> level "empfohlen"
//   "Zusätzliche Impfungen bei reiseassoziiertem Risiko"      -> level "situativ"
// Hinweis: Die Quelle unterscheidet bei Malaria nur "kein Risiko bekannt" und "Risiko" (Details in
// den DTG-Karten); daher gibt es hier zusätzlich den Wert "risiko". Standard- und Indikationsimpfungen
// (MMR, Tdap, Influenza usw.) gelten für alle Reisenden und sind nicht je Land aufgeführt.

export type TravelLevel = "pflicht" | "empfohlen" | "situativ";

export interface TravelVaccine {
  id: string;
  name: string;
  description: string;
  leadWeeks: number;
  schedule: string;
}

export interface Destination {
  code: string;
  name: string;
  region: string;
  vaccines: { id: string; level: TravelLevel; note?: string }[];
  /** "risiko" = laut Quelle Malaria-Risiko vorhanden (Differenzierung nur in den DTG-Karten). */
  malaria?: "kein" | "gering" | "regional" | "hoch" | "risiko";
  note?: string;
}

export const travelVaccines: TravelVaccine[] = [
  {
    id: "chikungunya",
    name: "Chikungunya",
    description: "Wird durch Tigermücken übertragen und verursacht hohes Fieber mit teils monatelang anhaltenden Gelenkschmerzen. Die Impfung schützt vor der Erkrankung; die Impfstoffwahl hängt vom Alter ab.",
    leadWeeks: 3,
    schedule: "1 Dosis; Schutz etwa 2–3 Wochen nach der Impfung; Impfstoff und Altersgrenzen laut Fachinformation bzw. STIKO-DTG-Empfehlung"
  },
  {
    id: "dengue",
    name: "Dengue",
    description: "Das Dengue-Virus wird von tagaktiven Mücken übertragen und kann Fieber mit starken Gliederschmerzen sowie schwere Verläufe verursachen. Die Impfung wird nur nach früher gesicherter Infektion empfohlen.",
    leadWeeks: 14,
    schedule: "2 Dosen im Abstand von 3 Monaten; Schutz etwa 2 Wochen nach der zweiten Dosis"
  },
  {
    id: "fsme",
    name: "FSME",
    description: "Die Frühsommer-Meningoenzephalitis wird durch Zecken übertragen und kann eine Hirnhaut- und Gehirnentzündung auslösen. Die Impfung schützt in Risikogebieten bei Aufenthalt in Wald und Wiese.",
    leadWeeks: 4,
    schedule: "3 Dosen (0, 1–3 Monate, 5–12 Monate nach der ersten Dosis); Schnellschema mit 2 Dosen im Abstand von 2 Wochen möglich"
  },
  {
    id: "gelbfieber",
    name: "Gelbfieber",
    description: "Gelbfieber wird von Stechmücken in Afrika und Südamerika übertragen und kann zu Leber- und Nierenversagen führen. Manche Länder verlangen bei Einreise einen Impfnachweis.",
    leadWeeks: 2,
    schedule: "1 Dosis; Schutz ab 10 Tagen nach der Impfung; nur in zugelassenen Gelbfieber-Impfstellen, Eintrag im Internationalen Impfausweis"
  },
  {
    id: "hepatitis-a",
    name: "Hepatitis A",
    description: "Das Virus wird über verunreinigte Lebensmittel und Trinkwasser übertragen und verursacht eine Leberentzündung. Die Impfung schützt zuverlässig.",
    leadWeeks: 2,
    schedule: "2 Dosen im Abstand von 6–12 Monaten; erste Dosis schützt bereits"
  },
  {
    id: "hepatitis-b",
    name: "Hepatitis B",
    description: "Hepatitis B wird über Blut und Körperflüssigkeiten übertragen, etwa bei medizinischen Eingriffen oder Sexualkontakt, und kann die Leber dauerhaft schädigen.",
    leadWeeks: 4,
    schedule: "3 Dosen (0, 1, 6 Monate); Schnellschema (Tag 0, 7, 21) möglich"
  },
  {
    id: "japanische-enzephalitis",
    name: "Japanische Enzephalitis",
    description: "Das Virus wird von Stechmücken in Asien übertragen und kann eine schwere Gehirnentzündung auslösen. Das Risiko besteht vor allem in ländlichen Regionen.",
    leadWeeks: 5,
    schedule: "2 Dosen im Abstand von 28 Tagen; Schnellschema (Tag 0, 7) bei Erwachsenen möglich; Schutz ab etwa 1 Woche nach der letzten Dosis"
  },
  {
    id: "meningokokken-acwy",
    name: "Meningokokken ACWY",
    description: "Meningokokken sind Bakterien, die Hirnhautentzündung und Blutvergiftung auslösen können; sie werden durch Tröpfchen übertragen. Das Risiko ist im Meningitisgürtel Afrikas und bei Pilgerreisen erhöht.",
    leadWeeks: 2,
    schedule: "1 Dosis (Konjugatimpfstoff); Schutz etwa 10–14 Tage nach der Impfung"
  },
  {
    id: "poliomyelitis",
    name: "Poliomyelitis",
    description: "Kinderlähmung wird über Stuhl und verunreinigtes Wasser übertragen und kann zu bleibenden Lähmungen führen. Für Reisen reicht oft eine Auffrischimpfung.",
    leadWeeks: 2,
    schedule: "Bei fehlendem oder unvollständigem Schutz Vervollständigung bzw. 1 Auffrischimpfung mit IPV; Nachweis im Impfausweis"
  },
  {
    id: "tollwut",
    name: "Tollwut",
    description: "Tollwut wird durch Bisse oder Speichel infizierter Tiere, meist Hunde, übertragen und verläuft nach Ausbruch tödlich. Die Impfung vor der Reise vereinfacht die Behandlung nach einem Biss.",
    leadWeeks: 4,
    schedule: "In der Regel 2–3 Dosen innerhalb weniger Wochen (z. B. Tag 0, 7, ggf. 21/28); Schema je nach Impfstoff und Alter"
  },
  {
    id: "typhus",
    name: "Typhus",
    description: "Typhus wird über verunreinigte Lebensmittel und Wasser übertragen und verursacht langanhaltendes Fieber. Die Impfung schützt vor allem bei einfachen Reisebedingungen.",
    leadWeeks: 2,
    schedule: "Impfung als Spritze (1 Dosis) oder Schluckimpfung (3 Kapseln an Tag 1, 3, 5); Schutz nach etwa 1–2 Wochen"
  }
];

export const destinations: Destination[] = [
  {
    code: "AF",
    name: "Afghanistan",
    region: "Südasien",
    vaccines: [
      {
        id: "poliomyelitis",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Empfehlung: Unabhängig von der Nachweispflicht wird von der STIKO vor jeder Reise (also auch Reisen ≤ 4 Wochen) eine Auffrischung empfohlen, wenn die letzte Impfstoffdosis vor mehr als 10 Jahren verabreicht worden ist."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "typhus",
        level: "empfohlen",
        note: "Typhus-Hochrisikogebiet, zudem potenzielles XDR-Risiko durch Import"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "EG",
    name: "Ägypten",
    region: "Nordafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Einreise): Polio-Impfnachweis (ausgestellt 12 Monate bis 4 Wochen vor Ausreise) erforderlich – bei Einreise aus den 7 polio-endemischen Ländern (Stand WHO ITH 2022: Afghanistan, Indonesien, Myanmar, Nigeria, Pakistan, Papua-Neuguinea, Somalia) für die Beantragung eines Einreisevisums, bei Einreise aus den 12 cVDPV-Ländern (Stand WHO ITH 2022: Äthiopien, Angola, Benin, China, DR Kongo, Ghana, Kamerun, Kenia, Mosambik, Niger, Philippinen, Zentralafrikanische Republik) für alle Reisenden"
  },
  {
    code: "AX",
    name: "Åland-Inseln (Finnland)",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "AL",
    name: "Albanien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — sehr niedrige Inzidenz; sporadische Fälle, keine etablierten Risikoregionen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "DZ",
    name: "Algerien",
    region: "Nordafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "VI",
    name: "Amerikanische Jungferninseln (USA)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "AS",
    name: "Amerikanisch-Samoa (USA)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "AD",
    name: "Andorra",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "AO",
    name: "Angola",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "AI",
    name: "Anguilla (UK)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "AG",
    name: "Antigua und Barbuda",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "GQ",
    name: "Äquatorialguinea",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "AR",
    name: "Argentinien",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in die Provinzen Misiones und Corrientes (sowie ausgewiesene Gebiete in Chaco, Formosa, Jujuy und Salta) • Impfung nicht empfohlen für Reisen, die sich auf die übrigen Provinzen und Buenos Aires beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "AM",
    name: "Armenien",
    region: "Kaukasus",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "AW",
    name: "Aruba (Niederlande)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "AZ",
    name: "Aserbaidschan",
    region: "Kaukasus",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "ET",
    name: "Äthiopien",
    region: "Ostafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in das gesamte Land — AUSSER den Provinzen Afar und Somali • Impfung nicht empfohlen für Reisen, die sich auf die Provinzen Afar und Somali beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "AU",
    name: "Australien",
    region: "Ozeanien",
    vaccines: [
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Äußere Torres- Strait-Inseln, Tiwi-Inseln und weite Teile des australischen Festlands · Saison: November– Mai"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet ▲ Nachweis aus Gelbfieber-Endemiegebieten jedoch mit Ausnahme der Galápagos-Inseln (Ecuador)"
  },
  {
    code: "BS",
    name: "Bahamas",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "BH",
    name: "Bahrain",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "BD",
    name: "Bangladesch",
    region: "Südasien",
    vaccines: [
      {
        id: "poliomyelitis",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Polio (Einreise): Reisende < 5 Jahre"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "typhus",
        level: "empfohlen",
        note: "Typhus-Hochrisikogebiet, zudem dokumentiertes lokales XDR-Risiko"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; die meisten Fälle Juni– November"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "BB",
    name: "Barbados",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis aus Gelbfieber-Endemiegebieten jedoch mit Ausnahme von Guyana und Trinidad und Tobago (außer bei akutem Ausbruch)"
  },
  {
    code: "BY",
    name: "Belarus",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch — fast das gesamte Land gilt als endemisch. In einigen wenigen geographisch verstreuten Gebieten wurde kein TBE-Virus nachgewiesen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "BE",
    name: "Belgien",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — bisher nur drei bestätigte autochthone Fälle gemeldet, alle 2020 in geographisch verstreuten Gebieten."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "BZ",
    name: "Belize",
    region: "Mittelamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "BJ",
    name: "Benin",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "BM",
    name: "Bermuda (UK)",
    region: "Nordamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "BT",
    name: "Bhutan",
    region: "Südasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Vermutlich verbreitet in den nicht-bergigen Gebieten · Saison: Unbekannt"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "BO",
    name: "Bolivien",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in Gebiete östlich der Anden unterhalb 2.300 m — gesamte Departements Beni, Pando, Santa Cruz sowie ausgewiesene Gebiete in Chuquisaca, Cochabamba, La Paz und Tarija • Impfung nicht empfohlen für Reisen, die sich auf Gebiete > 2.300 m Höhe (z. B. La Paz- Stadt, Salar de Uyuni) und alle oben nicht genannten Gebiete beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität, bei Reiserückkehrern aus Deutschland im Zeitraum 2012–2023 S. Paratyphi B dominant"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "BQ",
    name: "Bonaire, Sint Eustatius, Saba",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "BA",
    name: "Bosnien und Herzegowina",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — Situation epidemiologisch unklar; sehr begrenzte Datenlage. Bisher < 10 Humanfälle dokumentiert; TBE-Virus früher in Zecken nachgewiesen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "BW",
    name: "Botsuana",
    region: "Südliches Afrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "BR",
    name: "Brasilien",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in die Bundesstaaten Acre, Amapá, Amazonas, Distrito Federal, Espírito Santo, Goiás, Maranhão, Mato Grosso, Mato Grosso do Sul, Minas Gerais, Pará, Paraná, Piauí, Rio de Janeiro, Rio Grande do Sul, Rondônia, Roraima, Santa Catarina, São Paulo, Tocantins sowie ausgewiesene Gebiete in Bahia • Impfung nicht empfohlen für Reisen, die sich auf nicht genannte Küstenstädte ohne Risiko beschränken (Iguaçu-Wasserfälle/ Foz do Iguaçu inbegriffen)"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "VG",
    name: "Britische Jungferninseln (UK)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "BN",
    name: "Brunei Darussalam",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Vermutlich landesweit · Saison: Unbekannt"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Einreise): aus polio-betroffenen Ländern"
  },
  {
    code: "BG",
    name: "Bulgarien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — nur sporadische Fälle gemeldet; das Ausmaß möglicher Unterdiagnostik ist unbekannt."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "BF",
    name: "Burkina Faso",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "BI",
    name: "Burundi",
    region: "Ostafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Erweiterter Meningitisgürtel, potenzielles Risiko"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "CV",
    name: "Cabo Verde",
    region: "Westafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "KY",
    name: "Cayman Islands (UK)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CL",
    name: "Chile",
    region: "Südamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CN",
    name: "China",
    region: "Ostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — etwa 90 % der Fälle aus Nordostchina; höchste Endemizität in der Inneren Mongolei (Daxing'an-Gebirge), Provinz Heilongjiang (Xiaoxing'an-Gebirge) und Provinz Jilin (Changbai-Gebirge). Übertragung auch in Nordwestchina (Xinjiang: Tianshan und Altai- Gebirge) und Südwestchina (Yunnan, Tibet) berichtet."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Alle Provinzen außer Qinghai · Saison: Südchina April– Oktober; Nordchina Mai–September"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "CK",
    name: "Cookinseln (Neuseeland)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CR",
    name: "Costa Rica",
    region: "Mittelamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Erweiterte Liste — zusätzlich Tansania und Sambia in Afrika; Ausnahmen für Argentinien und Panama (Amerika); detaillierte Sonderregelungen für Kolumbien (außer Großstädte), Ecuador (nur 6 Provinzen östlich der Anden), Paraguay (außer Asunción), Peru (außer bestimmte Städte), Trinidad und Tobago (außer Großstädte)"
  },
  {
    code: "CI",
    name: "Côte d’Ivoire",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "CW",
    name: "Curaçao (Niederlande)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "DK",
    name: "Dänemark",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — endemisch ausschließlich auf Bornholm (Ostsee-Insel). Sehr seltene sporadische Fälle aus anderen Gebieten, einschließlich Mikrofoki in Nordseeland."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CD",
    name: "Demokratische Republik Kongo",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "poliomyelitis",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Empfehlung: Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz unabhängig von der Nachweispflicht eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Erweiterter Meningitisgürtel, potenzielles Risiko"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "DM",
    name: "Dominica",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "DO",
    name: "Dominikanische Republik",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet ▲ Nachweis nur bei Einreise aus den brasilianischen Bundesstaaten Minas Gerais, Espírito Santo, São Paulo und Rio de Janeiro"
  },
  {
    code: "DJ",
    name: "Dschibuti",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz unabhängig von der Nachweispflicht eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden."
  },
  {
    code: "EC",
    name: "Ecuador",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in die Provinzen östlich der Anden (Sucumbíos, Orellana, Napo, Pastaza, Morona Santiago, Zamora Chinchipe) sowie Esmeraldas • Impfung nicht empfohlen für Reisen, die sich auf die Galapagos-Inseln, Guayaquil, Quito oder Gebiete > 2.300 m Höhe beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet ▲ Nachweis nur bei Einreise aus Brasilien, DR Kongo und Uganda (engere eigene Liste)"
  },
  {
    code: "SV",
    name: "El Salvador",
    region: "Mittelamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "ER",
    name: "Eritrea",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "EE",
    name: "Estland",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch — hochendemisch; regelmäßig unter den Ländern mit höchster gemeldeter Inzidenz in Europa. Endemische Gebiete im gesamten Land, höchste Inzidenz im Westen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "SZ",
    name: "Eswatini",
    region: "Südliches Afrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "FK",
    name: "Falklandinseln (UK)",
    region: "Südamerika",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "FO",
    name: "Färöer (Dänemark)",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "FJ",
    name: "Fidschi",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "FI",
    name: "Finnland",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — fokal endemisch, vor allem in Schären- und Küstengebieten im Süden. Höchste Inzidenz 2019–2023 in den Küstengemeinden Kustavi und Pargas sowie auf Åland. Weitere Risikogebiete: Kotka-Schären, Sipoo-Schären, Suvisaaristo (Espoo), Karhusaari (Helsinki), Sammonlahti (Lappeenranta), Preiskari (bei Raahe), Tohmajärvi sowie Teile von Lohja, Kirkkonummi, Lappeenranta und Raseborg."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "FR",
    name: "Frankreich",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — Hauptendemiegebiet im Elsass (Nordosten) und in der Region Auvergne-Rhône-Alpes. Sporadische Fälle in einigen weiteren Lokalitäten."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "GF",
    name: "Französisch-Guayana (Frankreich)",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 1 Jahr Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "PF",
    name: "Französisch-Polynesien (Frankreich)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "GA",
    name: "Gabun",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "GM",
    name: "Gambia",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "GE",
    name: "Georgien",
    region: "Kaukasus",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Polio (Einreise): aus Polio-Risikoländern"
  },
  {
    code: "GH",
    name: "Ghana",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "GI",
    name: "Gibraltar (UK)",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "GD",
    name: "Grenada",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "GR",
    name: "Griechenland",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — sehr niedrige Inzidenz; sporadische Fälle, keine etablierten Risikoregionen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "GL",
    name: "Grönland (Dänemark)",
    region: "Nordamerika",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "GP",
    name: "Guadeloupe (Frankreich)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "GU",
    name: "Guam (USA)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "GT",
    name: "Guatemala",
    region: "Mittelamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "GG",
    name: "Guernsey",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "GN",
    name: "Guinea",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "GW",
    name: "Guinea-Bissau",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 1 Jahr Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "GY",
    name: "Guyana",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 4 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "HT",
    name: "Haiti",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "HN",
    name: "Honduras",
    region: "Mittelamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr und ≤ 50 Jahre ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "HK",
    name: "Hongkong",
    region: "Ostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "IN",
    name: "Indien",
    region: "Südasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "typhus",
        level: "empfohlen",
        note: "Typhus-Hochrisikogebiet, zudem dokumentiertes lokales XDR-Risiko"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Haryana, Himachal Pradesh, Jammu und Kashmir, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Nagaland, Odisha, Punjab, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, Westbengalen · Saison: Hauptsaison Mai– November, besonders in Nordindien; in einigen Gebieten (v. a. Südindien) kann die Saison verlängert oder ganzjährig sein."
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer) ▲ Eigene umfangreiche Liste — Afrika: Äquatorialguinea, Äthiopien, Angola, Benin, Burkina Faso, Burundi, Côte d’Ivoire, DR Kongo, Gabun, Gambia, Ghana, Guinea, Guinea-Bissau, Kamerun, Kenia, Liberia, Mali, Mauretanien, Niger, Nigeria, Republik Kongo, Ruanda, Senegal, Sierra Leone, Sudan, Südsudan, Togo, Tschad, Uganda, Zentralafrikanische Republik · Amerika: Argentinien, Bolivien, Brasilien, Ecuador, Französisch-Guayana, Guyana, Kolumbien, Panama, Paraguay, Peru, Suriname, Trinidad und Tobago (nur Trinidad), Venezuela · Bei fehlendem Nachweis bis zu 6 Tage Isolation"
  },
  {
    code: "ID",
    name: "Indonesien",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; Hauptsaison variiert je nach Insel."
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "IQ",
    name: "Irak",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Potenzielles XDR-Risiko durch Import"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "IR",
    name: "Iran",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Einreise): aus polio-endemischen Ländern (Afghanistan, Nigeria, Pakistan, alle Altersgruppen)"
  },
  {
    code: "IE",
    name: "Irland",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "IS",
    name: "Island",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "IM",
    name: "Isle of Man",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "IL",
    name: "Israel",
    region: "Naher Osten",
    vaccines: [
      {
        id: "poliomyelitis",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Empfehlung: Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz unabhängig von der Nachweispflicht eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "IT",
    name: "Italien",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — Risiko vor allem in den voralpinen und alpinen Gebieten im Nordosten: Venetien (vor allem Belluneser Alpen), Friaul-Julisch Venetien sowie Trentino- Südtirol."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "JM",
    name: "Jamaika",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "JP",
    name: "Japan",
    region: "Ostasien",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — in den letzten 30 Jahren weniger als 10 Fälle diagnostiziert, alle in der Präfektur Hokkaidō (Insel im Norden). Keine eindeutigen Hinweise auf Übertragung in anderen Regionen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Alle Inseln · Saison: Juni–Oktober"
      }
    ],
    malaria: "kein"
  },
  {
    code: "YE",
    name: "Jemen",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "JE",
    name: "Jersey",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "JO",
    name: "Jordanien",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "KH",
    name: "Kambodscha",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; Hauptsaison Mai–Oktober"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "CM",
    name: "Kamerun",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 1 Jahr Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "poliomyelitis",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Empfehlung: Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz unabhängig von der Nachweispflicht eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "CA",
    name: "Kanada",
    region: "Nordamerika",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "KZ",
    name: "Kasachstan",
    region: "Zentralasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — Hauptrisikogebiete: Regionen Almaty und Ostkasachstan sowie der Sandyktau-Distrikt der Region Akmola. Seltene sporadische Fälle aus weiteren zentralen und nördlichen Lokalitäten."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "QA",
    name: "Katar",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate Polio (Einreise): aus polio-endemischen Ländern"
  },
  {
    code: "KE",
    name: "Kenia",
    region: "Ostafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Achtung: Im März 2022 wurden Gelbfieberfälle im Inneren des Landes bestätigt. Da eine Ausbreitung auch auf einige der oben genannten Gebiete stattgefunden hat, sollte bis auf Weiteres die Indikation für eine Gelbfieberimpfung für Reisende nach ganz Kenia großzügig gestellt werden. Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in das gesamte Land — AUSSER North Eastern Province, Coast Province (Distrikte Kilifi, Kwale, Lamu, Malindi, Tana River), Nairobi und Mombasa"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Erweiterter Meningitisgürtel, potenzielles Risiko"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "KG",
    name: "Kirgisistan",
    region: "Zentralasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — TBE-Virus (Sibirischer Subtyp) in Ixodes persulcatus- Zecken nachgewiesen, phylogenetisch verwandt mit Bosnien-Stamm. Wenige Humanfälle aus dem Land berichtet."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "KI",
    name: "Kiribati",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CC",
    name: "Kokosinseln (Australien)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CO",
    name: "Kolumbien",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in das gesamte Land — AUSSER Bogotá, San Andrés und Providencia sowie Gebiete > 2.300 m Höhe • Impfung nicht empfohlen für Reisen, die sich auf Bogotá, San Andrés/Providencia, Gebiete > 2.300 m Höhe oder die Großstädte Barranquilla, Cali, Cartagena und Medellín beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet ▲ Nachweis nur bei Einreise aus Angola, Brasilien, DR Kongo und Uganda (engere eigene Liste statt allgemeiner WHO- Risikoländer)"
  },
  {
    code: "KM",
    name: "Komoren",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "XK",
    name: "Kosovo",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "HR",
    name: "Kroatien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — höchstes Risiko in Nordost- und Nordwestregionen, geringeres Risiko in der zentralen Bergregion, nur sporadische Fälle aus dem adriatischen Küstenraum. Die meisten Fälle aus Koprivnica- Križevci, Međimurje und Bjelovar-Bilogora."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CU",
    name: "Kuba",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "KW",
    name: "Kuwait",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "LA",
    name: "Laos",
    region: "Südostasien",
    vaccines: [
      {
        id: "poliomyelitis",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Empfehlung: Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz unabhängig von der Nachweispflicht eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; Hauptsaison Juni– September"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "LS",
    name: "Lesotho",
    region: "Südliches Afrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "LV",
    name: "Lettland",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch — hochendemisch; regelmäßig unter den Ländern mit höchster gemeldeter Inzidenz in Europa. Endemische Gebiete im gesamten Land; höchste Inzidenz in der Region Kurzeme (Westen) sowie in Vidzeme und Riga (Mitte)."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "LB",
    name: "Libanon",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "LR",
    name: "Liberia",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "LY",
    name: "Libyen",
    region: "Nordafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "LI",
    name: "Liechtenstein",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — TBE-Virus- infizierte Zecken nachgewiesen. Liechtensteinische Gesundheitsbehörden gehen von einem Risiko im gesamten Land aus."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "LT",
    name: "Litauen",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch — hochendemisch; regelmäßig unter den Ländern mit höchster gemeldeter Inzidenz in Europa. Endemische Gebiete im gesamten Land, höchste Inzidenz zuletzt im Bezirk Utena."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "LU",
    name: "Luxemburg",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "MO",
    name: "Macau",
    region: "Ostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      }
    ],
    malaria: "kein"
  },
  {
    code: "MG",
    name: "Madagaskar",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "MW",
    name: "Malawi",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "MY",
    name: "Malaysia",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; Hauptsaison in Sarawak Oktober–Dezember"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Dokumentiertes XDR-Risiko durch Import"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "MV",
    name: "Malediven",
    region: "Südasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Einreise): aus polio-exportierenden Ländern"
  },
  {
    code: "ML",
    name: "Mali",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate ▲ Risiko nur in Teilen des Landes (siehe Risikogebiet) Empfehlung: Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in den Süden des Landes (südlich der Sahara) • Impfung nicht empfohlen für Reisen, die sich auf den nördlichen Sahara-Teil beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "MT",
    name: "Malta",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "MA",
    name: "Marokko",
    region: "Nordafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Polio (Einreise): aus polio-betroffenen Ländern"
  },
  {
    code: "MH",
    name: "Marshallinseln",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "MQ",
    name: "Martinique (Frankreich)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "MR",
    name: "Mauretanien",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in den Süden des Landes — Regionen Brakna, Trarza, Gorgol, Guidimaka, Assaba, Hodh el Gharbi, Hodh ech Chargui, Tagant, Nouakchott • Impfung nicht empfohlen für Reisen, die sich auf die nördlichen Sahara-Regionen (Adrar, Dakhlet Nouadhibou, Inchiri, Tiris Zemmour) beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Erweiterter Meningitisgürtel, potenzielles Risiko"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "MU",
    name: "Mauritius",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "YT",
    name: "Mayotte (Frankreich)",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "MX",
    name: "Mexiko",
    region: "Mittelamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "FM",
    name: "Mikronesien",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "MD",
    name: "Moldau",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — Situation epidemiologisch unklar; sehr begrenzte Datenlage. Bisher < 10 Humanfälle dokumentiert; TBE-Virus früher in Zecken nachgewiesen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "MC",
    name: "Monaco",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "MN",
    name: "Mongolei",
    region: "Ostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — Hauptrisikogebiete: Provinzen Selenge und Bulgan im Norden."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "ME",
    name: "Montenegro",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "MS",
    name: "Montserrat (UK)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "MZ",
    name: "Mosambik",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "MM",
    name: "Myanmar",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; die meisten Fälle Mai– September"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "NA",
    name: "Namibia",
    region: "Südliches Afrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "NR",
    name: "Nauru",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "NP",
    name: "Nepal",
    region: "Südasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "typhus",
        level: "empfohlen",
        note: "Typhus-Hochrisikogebiet, zudem sporadisches lokales XDR-Risiko"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Südliches Tiefland (Terai), einzelne Hügel- und Bergdistrikte · Saison: Hauptsaison Juni– Oktober"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Einreise): aus 32 Polio-Risikoländern (Ägypten, Äthiopien, Afghanistan, Benin, Burkina Faso, Côte d’Ivoire, DR Kongo, Gambia, Guinea, Guinea-Bissau, Iran, Jemen, Kamerun, Kenia, Liberia, Madagaskar, Mali, Mauretanien, Niger, Nigeria, Pakistan, Republik Kongo, Senegal, Sierra Leone, Somalia, Sudan, Südsudan, Tadschikistan, Tschad, Uganda, Ukraine, Zentralafrikanische Republik)"
  },
  {
    code: "NC",
    name: "Neukaledonien (Frankreich)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "NZ",
    name: "Neuseeland",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "NI",
    name: "Nicaragua",
    region: "Mittelamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "NL",
    name: "Niederlande",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — erste Humanfälle 2016 identifiziert; seither sporadische Fälle aus mehreren verschiedenen Orten diagnostiziert."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "NE",
    name: "Niger",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate ▲ Risiko nur in Teilen des Landes (siehe Risikogebiet) Empfehlung: Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in den Süden des Landes — Regionen Tillabéri, Niamey, Dosso, Tahoua, Maradi, Zinder, Diffa • Impfung nicht empfohlen für Reisen, die sich auf den nördlichen Sahara-Teil (Region Agadez) beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "NG",
    name: "Nigeria",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz unabhängig von der Nachweispflicht eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer) Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden."
  },
  {
    code: "NU",
    name: "Niue (Neuseeland)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "KP",
    name: "Nordkorea",
    region: "Ostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Vermutlich landesweit · Saison: Unbekannt; Nähe zu Südkorea deutet auf Hauptübertragung Mai– November hin"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "MP",
    name: "Nördliche Marianen-Inseln (USA)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "MK",
    name: "Nordmazedonien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "NF",
    name: "Norfolkinsel (Australien)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "NO",
    name: "Norwegen",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — Küstengebiete in Südnorwegen gelten als endemisch, insbesondere die Provinzen Agder und Vestfold og Telemark."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "OM",
    name: "Oman",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet ▲ Erweiterte Liste — zusätzlich Ruanda und Tansania in Afrika (über die allgemeinen WHO- Risikoländer hinaus)"
  },
  {
    code: "AT",
    name: "Österreich",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch — fokal endemisch im gesamten Land. Hochendemische Regionen: Kärnten, Steiermark, Oberösterreich, Salzburg, Tirol und Vorarlberg."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TL",
    name: "Osttimor (Timor-Leste)",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Vermutlich landesweit · Saison: Keine Daten; Nähe zu West-Timor deutet auf ganzjährige Übertragung hin"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "kein"
  },
  {
    code: "PK",
    name: "Pakistan",
    region: "Südasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Unabhängig von der Nachweispflicht wird von der STIKO vor jeder Reise (also auch Reisen ≤ 4 Wochen) eine Auffrischung empfohlen, wenn die letzte Impfstoffdosis vor mehr als 10 Jahren verabreicht worden ist."
      },
      {
        id: "typhus",
        level: "empfohlen",
        note: "Typhus-Hochrisikogebiet, zudem dokumentiertes lokales XDR-Risiko"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Unbekannt · Saison: Unbekannt"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden."
  },
  {
    code: "PS",
    name: "Palästinensische Gebiete",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "kein"
  },
  {
    code: "PW",
    name: "Palau",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "kein"
  },
  {
    code: "PA",
    name: "Panama",
    region: "Mittelamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in die Provinzen Darién und Emberá-Wounaan, die indigene Comarca Guna Yala (Kuna Yala) sowie die östlich des Panamakanals gelegenen Gebiete der Provinzen Colón und Panamá • Impfung nicht empfohlen für Reisen, die sich auf Gebiete westlich des Panamakanals, Panama-Stadt, die Balboa-Inseln (Pearl Islands) oder die San-Blas-Inseln beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "PG",
    name: "Papua-Neuguinea",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Vermutlich ganzjährig"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "PY",
    name: "Paraguay",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in das gesamte Land — AUSSER der Hauptstadt Asunción • Impfung nicht empfohlen für Reisen, die sich ausschließlich auf Asunción beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis inkl. Transit > 24 h in Brasilien/ Bolivien/Peru/Venezuela ▲ Nachweis nur bei Einreise aus Brasilien, Bolivien, Peru und Venezuela (engere eigene Liste)"
  },
  {
    code: "PE",
    name: "Peru",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in 10 Regionen vollständig (Loreto, Madre de Dios, Ucayali, Amazonas, San Martín, Junín, Pasco, Huánuco, Cusco, Puno) sowie ausgewiesene Gebiete in Apurímac, Áncash, Ayacucho, Cajamarca, Huancavelica, La Libertad und Piura • Impfung nicht empfohlen für Reisen, die sich auf Lima, Cuzco-Stadt, Machu Picchu, den Inka-Pfad oder Gebiete > 2.300 m Höhe beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "PH",
    name: "Philippinen",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; Hauptsaison Juli–Oktober"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Einreise): aus Polio-Hochrisikoländern"
  },
  {
    code: "PN",
    name: "Pitcairninseln (UK)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "PL",
    name: "Polen",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — mehr als 70 % der gemeldeten Fälle aus den Woiwodschaften Podlachien und Ermland- Masuren im Nordosten. Im Großteil des restlichen Landes endemische Foki."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "PT",
    name: "Portugal",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "PR",
    name: "Puerto Rico (USA)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CG",
    name: "Republik Kongo",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "RE",
    name: "Réunion (Frankreich)",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "RW",
    name: "Ruanda",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Erweiterter Meningitisgürtel, potenzielles Risiko"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "RO",
    name: "Rumänien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — nur sporadische Fälle gemeldet; Datenlage begrenzt, Krankheit möglicherweise unterdiagnostiziert."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "RU",
    name: "Russland",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch — Endemiegebiete weit verteilt im südlichen, nicht-tropischen Waldgürtel; variable Inzidenz je nach Region. Stand 2019: 48 Regionen als endemisch eingestuft. Hohe Übertragung in Süd-Westsibirien, Süd-Ostsibirien und im südlichen Ural."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Primorsky Krai · Saison: Juni–September"
      }
    ],
    malaria: "kein"
  },
  {
    code: "SB",
    name: "Salomonen",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "ZM",
    name: "Sambia",
    region: "Südliches Afrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "WS",
    name: "Samoa",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "SM",
    name: "San Marino",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "ST",
    name: "São Tomé und Príncipe",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "SA",
    name: "Saudi-Arabien",
    region: "Naher Osten",
    vaccines: [
      {
        id: "meningokokken-acwy",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Meningokokken ACWY: Hadj/Umrah- Einreise-Pflicht (Alter ≥ 1 Jahr, ACWY- Konjugatimpfstoff) — gilt unabhängig vom Herkunftsland Empfehlung: Unabhängig von der Nachweispflicht Impfung bei Hadj/Umrah empfohlen"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Potenzielles XDR-Risiko durch Import"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet Polio (Einreise): Hadj/Umrah"
  },
  {
    code: "SE",
    name: "Schweden",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — hochendemisch im Großraum Stockholm im östlichen Süd-Mittelschweden (Stockholm- Schären, Mälarsee, Provinzen Uppsala und Södermanland). Weitere Hauptrisikogebiete um die Seen Vänern und Vättern im Süden sowie weitere natürliche Foki im Süden und im Zentrum des Landes."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "CH",
    name: "Schweiz",
    region: "Europa",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — Das gesamte Land mit Ausnahme des Kantons Tessin gilt als Risikogebiet. Höheres Risiko im Nordosten, in der Zentral- und Westschweiz; der Kanton Thurgau gilt als hochendemisch."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "SN",
    name: "Senegal",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "RS",
    name: "Serbien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — geringe Anzahl gemeldeter Fälle; diagnostische Tests werden jedoch nicht routinemäßig durchgeführt. Fälle aus verschiedenen Lokalitäten gemeldet, einschließlich ländlicher Gebiete in der Umgebung von Belgrad."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "SC",
    name: "Seychellen",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit in einem Gelbfieber-Endemiegebiet (unabhängig von Dauer)"
  },
  {
    code: "SL",
    name: "Sierra Leone",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende jeden Alters (keine Altersvorgabe) Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "ZW",
    name: "Simbabwe",
    region: "Südliches Afrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "SG",
    name: "Singapur",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Vermutlich sehr lokal begrenzt · Saison: Ganzjährig"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "SX",
    name: "Sint Maarten (Niederlande)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "SK",
    name: "Slowakei",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — Übertragungsherde im gesamten Land verteilt; höhere Risikogebiete im Norden und in der Mitte, insbesondere die Regionen Banská Bystrica, Žilina und Trenčín."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "SI",
    name: "Slowenien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch — hochendemisch; regelmäßig unter den Ländern mit höchster gemeldeter Inzidenz in Europa. Fälle aus dem gesamten Land, höchste Inzidenz im Norden und in der Mitte."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "SO",
    name: "Somalia",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "ES",
    name: "Spanien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "LK",
    name: "Sri Lanka",
    region: "Südasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit, außer in den Bergregionen · Saison: Ganzjährig; Hauptsaison November–Februar"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "BL",
    name: "St. Barthélemy (Frankreich)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "SH",
    name: "St. Helena (UK)",
    region: "Westafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "KN",
    name: "St. Kitts und Nevis",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr Polio (Einreise): aus polio-endemischen Ländern"
  },
  {
    code: "LC",
    name: "St. Lucia",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate"
  },
  {
    code: "MF",
    name: "St. Martin (Frankreich)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "PM",
    name: "St. Pierre und Miquelon (Frankreich)",
    region: "Nordamerika",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "VC",
    name: "St. Vincent und die Grenadinen",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr"
  },
  {
    code: "ZA",
    name: "Südafrika",
    region: "Südliches Afrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "SD",
    name: "Sudan",
    region: "Nordafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in den Süden des Landes — South Kordufan, Blue Nile, White Nile, Sennar, Gezira, Gedarif, Kassala sowie alle Darfur-Regionen und North Kordufan • Impfung nicht empfohlen für Reisen, die sich auf Khartoum oder die nördlichen Wüstenregionen beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "KR",
    name: "Südkorea",
    region: "Ostasien",
    vaccines: [
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — keine Humanfälle gemeldet; TBE-Virus nur in Zecken und Nagern nachgewiesen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Mai–November"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "SS",
    name: "Südsudan",
    region: "Ostafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "poliomyelitis",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Empfehlung: Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz unabhängig von der Nachweispflicht eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "SR",
    name: "Suriname",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "SJ",
    name: "Svalbard und Jan Mayen (Norwegen)",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "SY",
    name: "Syrien",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "TJ",
    name: "Tadschikistan",
    region: "Zentralasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TW",
    name: "Taiwan",
    region: "Ostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Hauptsaison Mai–Oktober"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TZ",
    name: "Tansania",
    region: "Ostafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Erweiterter Meningitisgürtel, potenzielles Risiko"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "TH",
    name: "Thailand",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; Hauptsaison Mai–Oktober, besonders Nordthailand"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Dokumentiertes XDR-Risiko durch Import"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "TG",
    name: "Togo",
    region: "Westafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "TK",
    name: "Tokelau (Neuseeland)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TO",
    name: "Tonga",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TT",
    name: "Trinidad und Tobago",
    region: "Karibik",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in dicht bewaldete Gebiete der Insel Trinidad • Impfung nicht empfohlen für Reisen, die sich auf die Hauptstadt Port of Spain bzw. Großstadtgebiete oder die Insel Tobago beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TD",
    name: "Tschad",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in den Süden des Landes — Regionen Mandoul, Logone Oriental/Occidental, Mayo-Kebbi Est/Ouest, Tandjilé, Moyen-Chari, Salamat, N'Djamena, Chari-Baguirmi, Hadjer-Lamis, Guéra, Sila, Batha, Lac • Impfung nicht empfohlen für Reisen, die sich auf den nördlichen Sahara-Teil (Tibesti, Borkou, Ennedi, Wadi Fira, Ouaddaï) beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz unabhängig von der Nachweispflicht eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Meningitisgürtel Kerngebiet"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate Polio (Ausreise): Bei Aufenthalt > 4 Wochen muss die letzte Poliomyelitis-Impfung 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden."
  },
  {
    code: "CZ",
    name: "Tschechien",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Hochendemisch — hochendemisch; regelmäßig unter den Ländern mit höchster gemeldeter Inzidenz in Europa. Übertragungsherde im gesamten Land, höchstes Risiko in der Region Südböhmen."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TN",
    name: "Tunesien",
    region: "Nordafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TR",
    name: "Türkei",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TM",
    name: "Turkmenistan",
    region: "Zentralasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TC",
    name: "Turks- und Caicosinseln (UK)",
    region: "Karibik",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "TV",
    name: "Tuvalu",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "UG",
    name: "Uganda",
    region: "Ostafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 1 Jahr Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Erweiterter Meningitisgürtel, potenzielles Risiko"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "UA",
    name: "Ukraine",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — Mehrheit der Infektionen der letzten 15 Jahre aus den Regionen Wolhynien und Krim. Weitere Foki im gesamten Land, u. a. in Riwne, Schytomyr, Kiew, Tschernihiw und in der Karpaten-Region."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "HU",
    name: "Ungarn",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Endemisch regional — höchste Inzidenz im westlichen Transdanubien und im Norden des Landes; in den meisten anderen Gebieten viel niedrigeres oder kein Risiko."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "UY",
    name: "Uruguay",
    region: "Südamerika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "UZ",
    name: "Usbekistan",
    region: "Zentralasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "VU",
    name: "Vanuatu",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "VA",
    name: "Vatikanstadt",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "VE",
    name: "Venezuela",
    region: "Südamerika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "empfohlen",
        note: "Risiko nur in bestimmten Teilen des Landes; unabhängig von der Nachweispflicht gelten folgende Impfempfehlungen für alle Reisenden ab einem Alter von ≥ 9 Monaten, wenn keine Kontraindikation besteht: • Impfung empfohlen für alle Reisen in das gesamte Land — AUSSER den Bundesstaaten Aragua, Carabobo, Miranda, Vargas, Yaracuy, Falcón, Lara, Distrito Capital und der Insel Margarita • Impfung nicht empfohlen für Reisen, die sich auf Caracas, Valencia, die Insel Margarita oder Gebiete > 2.300 m Höhe in Mérida, Trujillo und Táchira beschränken"
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet ▲ Nachweis nur bei Einreise aus Brasilien (engere eigene Liste)"
  },
  {
    code: "AE",
    name: "Vereinigte Arabische Emirate",
    region: "Naher Osten",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Potenzielles XDR-Risiko durch Import"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 9 Monate ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "US",
    name: "Vereinigte Staaten",
    region: "Nordamerika",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "GB",
    name: "Vereinigtes Königreich",
    region: "Europa",
    vaccines: [
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "CVDPV2 im Abwasser nachgewiesen (letzter Nachweis 03.03.2026). Bislang (Stand Sept 2026) wurden keine klinischen Fälle registriert. Derzeit werden keine über die aktuellen nationalen Impfempfehlungen hinausgehenden Auffrischimpfungen empfohlen (WHO Global Polio Eradication Initiative – Stand 25.08.2026)."
      },
      {
        id: "fsme",
        level: "situativ",
        note: "Sporadisch — fokal endemisch in einer kleinen Anzahl von Gebieten. Drei wahrscheinliche oder bestätigte Humanfälle in England seit 2019; ein bestätigter Fall in Schottland 2022. TBE-Virus-infizierte Zecken nachgewiesen u. a. in Thetford Forest, an der Grenze Hampshire/Dorset, im New Forest und in den North Yorkshire Moors."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  },
  {
    code: "VN",
    name: "Vietnam",
    region: "Südostasien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "japanische-enzephalitis",
        level: "situativ",
        note: "Region: Landesweit · Saison: Ganzjährig; Hauptsaison Mai–Oktober, besonders Nordvietnam"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Moderates Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "WF",
    name: "Wallis und Futuna (Frankreich)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet"
  },
  {
    code: "CX",
    name: "Weihnachtsinsel (Australien)",
    region: "Ozeanien",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein",
    note: "Nachweispflicht laut WHO (Stand ITH 2022 / Polio-Statement 08/2026): Gelbfieber: bei Einreise aus einem Gelbfieber-Endemiegebiet für Reisende im Alter ≥ 1 Jahr ▲ Nachweis auch bei Flughafentransit > 12 h in einem Gelbfieber-Endemiegebiet ▲ Gleiche Anforderungen wie Australien — mit Ausnahme der Galápagos-Inseln (Ecuador)"
  },
  {
    code: "EH",
    name: "Westsahara",
    region: "Nordafrika",
    vaccines: [
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "CF",
    name: "Zentralafrikanische Republik",
    region: "Zentralafrika",
    vaccines: [
      {
        id: "gelbfieber",
        level: "pflicht",
        note: "Nachweispflicht laut WHO: Gelbfieber: bei Einreise aus jedem Land (einschließlich Deutschland) für Reisende im Alter ≥ 9 Monate Empfehlung: Landesweites Risiko; unabhängig von der Nachweispflicht sollten alle Reisende gegen Gelbfieber geimpft werden, wenn keine Kontraindikation besteht."
      },
      {
        id: "hepatitis-a",
        level: "empfohlen"
      },
      {
        id: "poliomyelitis",
        level: "empfohlen",
        note: "Die letzte Polio-Impfung soll 12 Monate bis 4 Wochen vor der Ausreise erfolgt sein und im Internationalen Impfausweis dokumentiert werden. Die WHO empfiehlt dies für Aufenthalte > 4 Wochen (WHO Polio Statement 08/2026). Bei Aufenthalt ≤ 4 Wochen wird bei fehlendem oder unvollständigem Impfschutz eine Vervollständigung bzw. Auffrischimpfung mit IPV empfohlen."
      },
      {
        id: "chikungunya",
        level: "situativ"
      },
      {
        id: "dengue",
        level: "situativ",
        note: "Nur für Personen ≥ 4 Jahre, die eine labordiagnostisch gesicherte Dengue-Infektion durchgemacht haben."
      },
      {
        id: "hepatitis-b",
        level: "situativ"
      },
      {
        id: "meningokokken-acwy",
        level: "situativ",
        note: "Erweiterter Meningitisgürtel, potenzielles Risiko"
      },
      {
        id: "tollwut",
        level: "situativ",
        note: "Hohes Risiko für Tollwut bei Hunden"
      },
      {
        id: "typhus",
        level: "situativ",
        note: "Hohes Risiko und/oder hohe Endemizität"
      }
    ],
    malaria: "risiko"
  },
  {
    code: "CY",
    name: "Zypern",
    region: "Europa",
    vaccines: [
      {
        id: "hepatitis-b",
        level: "situativ"
      }
    ],
    malaria: "kein"
  }
];

export const travelSource = {
  label:
    "Ländertabellen als Anhang zum Epidemiologischen Bulletin 27/2026 (RKI, 2. Juli 2026): Empfehlungen der STIKO und der DTG zu Reiseimpfungen",
  url: "https://www.rki.de/DE/Aktuelles/Publikationen/Epidemiologisches-Bulletin/2026/27_26_Anhang.pdf?__blob=publicationFile",
};
