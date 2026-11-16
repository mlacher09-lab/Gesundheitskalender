import type { CareItem } from "./vorsorge";

/** Persönliche Risikofaktoren, die den Vorsorgeplan verändern. */
export type RiskKey =
  | "smoker"
  | "pregnant"
  | "chronic"
  | "familyColon"
  | "familyBreast"
  | "fsmeArea";

export const riskInfo: Record<RiskKey, { label: string; hint: string }> = {
  smoker: { label: "Ich rauche oder habe lange geraucht", hint: "Blendet die Lungenkrebs-Früherkennung ein" },
  pregnant: { label: "Ich bin schwanger", hint: "Ergänzt Impfungen in der Schwangerschaft" },
  chronic: { label: "Chronische Erkrankung", hint: "z. B. Diabetes, Herz-, Lungen- oder Immunerkrankung – ergänzt Indikationsimpfungen" },
  familyColon: { label: "Darmkrebs in der Familie", hint: "Verwandte ersten Grades – ergänzt eine frühere Beratung" },
  familyBreast: { label: "Brust- oder Eierstockkrebs in der Familie", hint: "Ergänzt eine Beratung zum familiären Risiko" },
  fsmeArea: { label: "Ich lebe oder bin oft in einem FSME-Risikogebiet", hint: "Blendet die FSME-Impfung ein" },
};

/** Bestehende Einträge, die nur bei einem Risikofaktor angezeigt werden. */
export const requiresById: Record<string, RiskKey> = {
  "lungenkrebs-screening": "smoker",
  "impfung-fsme": "fsmeArea",
};

export interface RiskItem extends CareItem {
  requires: RiskKey;
}

/** Zusätzliche Einträge, die nur bei einem Risikofaktor gelten. */
export const riskItems: RiskItem[] = [
  {
    id: "risiko-chronic-grippe",
    title: "Grippe-Impfung bei chronischer Erkrankung",
    category: "impfung",
    description:
      "Bei bestimmten Grunderkrankungen empfiehlt die STIKO die jährliche Grippe-Impfung schon vor dem 60. Lebensjahr, weil die Grippe dann schwerer verlaufen kann.",
    sex: "all",
    ageFrom: 0.5,
    ageTo: 59,
    intervalYears: 1,
    doctor: "Hausarzt",
    note:
      "Jährlich im Herbst/Winter, ab 6 Monaten. Gilt z. B. bei chronischen Atemwegs-, Herz-Kreislauf-, Leber- oder Nierenerkrankungen, Diabetes und anderen Stoffwechselerkrankungen, starkem Übergewicht (BMI ≥ 30), bestimmten neurologischen Erkrankungen sowie bei Immunschwäche. Ab 60 Jahren gilt für alle die Standardimpfung.",
    source: "STIKO (Epid. Bull. 4/2026, Tabelle 2)",
    sourceUrl: "https://www.rki.de/DE/Aktuelles/Publikationen/Epidemiologisches-Bulletin/2026/04_26.pdf?__blob=publicationFile",
    requires: "chronic",
  },
  {
    id: "risiko-chronic-pneumokokken",
    title: "Pneumokokken-Impfung bei chronischer Erkrankung",
    category: "impfung",
    description:
      "Bei bestimmten Grunderkrankungen oder Immunschwäche wird die Impfung gegen Pneumokokken (Erreger z. B. von Lungenentzündung) schon vor dem 60. Lebensjahr empfohlen.",
    sex: "all",
    ageFrom: 2,
    ageTo: 59,
    intervalYears: null,
    doctor: "Hausarzt",
    note:
      "Einmalig mit dem 20-valenten Konjugatimpfstoff (PCV20), ab 2 Jahren. Gilt z. B. bei Immundefekten, chronischen Herz-Kreislauf- oder Lungenerkrankungen und mit Tabletten oder Insulin behandeltem Diabetes. Wenn du früher schon eine andere Pneumokokken-Impfung hattest, sprich mit der Praxis über den Abstand. Ab 60 Jahren gilt für alle die Standardimpfung.",
    source: "STIKO (Epid. Bull. 4/2026, Tabelle 2)",
    sourceUrl: "https://www.rki.de/DE/Aktuelles/Publikationen/Epidemiologisches-Bulletin/2026/04_26.pdf?__blob=publicationFile",
    requires: "chronic",
  },
  {
    id: "risiko-chronic-covid-19",
    title: "COVID-19-Impfung bei erhöhter Gefährdung",
    category: "impfung",
    description:
      "Bei bestimmten Grunderkrankungen empfiehlt die STIKO weiterhin eine jährliche COVID-19-Impfung, auch wenn die Standardimpfung erst ab 75 Jahren gilt.",
    sex: "all",
    ageFrom: 0.5,
    ageTo: 74,
    intervalYears: 1,
    doctor: "Hausarzt",
    note:
      "Einmal pro Saison, möglichst im Spätsommer/Frühherbst, ab 6 Monaten. Gilt z. B. bei chronischen Atemwegs-, Herz-Kreislauf-, Leber- und Nierenerkrankungen, Diabetes, starkem Übergewicht (BMI ≥ 30), Immunschwäche oder aktiver Krebserkrankung. Ab 75 Jahren gilt für alle die Standardimpfung.",
    source: "STIKO (Epid. Bull. 28/2026)",
    sourceUrl: "https://www.rki.de/DE/Aktuelles/Publikationen/Epidemiologisches-Bulletin/2026/28_26.pdf?__blob=publicationFile",
    requires: "chronic",
  },
  {
    id: "risiko-chronic-guertelrose",
    title: "Gürtelrose-Impfung bei erhöhtem Risiko",
    category: "impfung",
    description:
      "Bei Immunschwäche oder schwerer chronischer Erkrankung wird die Gürtelrose-Impfung schon ab 18 Jahren empfohlen, weil das Risiko für Gürtelrose dann erhöht ist.",
    sex: "all",
    ageFrom: 18,
    ageTo: 59,
    intervalYears: null,
    doctor: "Hausarzt",
    note:
      "Zwei Dosen im Abstand von 2 bis 6 Monaten mit dem Totimpfstoff. Genannt werden u. a. Immunschwäche (z. B. HIV, Organtransplantation, Immunsuppression), Krebserkrankungen, rheumatoide Arthritis, Lupus, chronisch-entzündliche Darmerkrankungen, COPD/Asthma, chronische Niereninsuffizienz und Diabetes. Leichte oder gut eingestellte Formen sind bei 18 bis 59 Jahren nicht umfasst. Ab 60 Jahren gilt für alle die Standardimpfung.",
    source: "STIKO (Epid. Bull. 4/2026, Tabelle 2)",
    sourceUrl: "https://www.rki.de/DE/Aktuelles/Publikationen/Epidemiologisches-Bulletin/2026/04_26.pdf?__blob=publicationFile",
    requires: "chronic",
  },
  {
    id: "risiko-chronic-rsv",
    title: "RSV-Impfung bei schwerer Grunderkrankung",
    category: "impfung",
    description:
      "Bei schweren chronischen Erkrankungen wird die einmalige RSV-Impfung schon ab 60 Jahren empfohlen, weil das RS-Virus dann besonders schwere Atemwegsinfektionen auslösen kann.",
    sex: "all",
    ageFrom: 60,
    ageTo: 74,
    intervalYears: null,
    doctor: "Hausarzt",
    note:
      "Einmalig, möglichst im Spätsommer/Herbst vor der RSV-Saison. Gilt bei schweren Ausprägungen z. B. von chronischen Atemwegs-, Herz-Kreislauf- oder Nierenerkrankungen, Diabetes mit Komplikationen, hämato-onkologischen oder neurologischen Erkrankungen und schwerer Immunschwäche; leichte oder gut eingestellte Formen sind nicht umfasst. Ab 75 Jahren gilt für alle die Standardimpfung.",
    source: "STIKO (Epid. Bull. 4/2026, Tabelle 2)",
    sourceUrl: "https://www.rki.de/DE/Aktuelles/Publikationen/Epidemiologisches-Bulletin/2026/04_26.pdf?__blob=publicationFile",
    requires: "chronic",
  },
  {
    id: "risiko-schwangerschaft-keuchhusten",
    title: "Keuchhusten-Impfung in der Schwangerschaft",
    category: "impfung",
    description:
      "Die Impfung (Tdap) schützt dein Neugeborenes in den ersten Lebensmonaten, bevor es selbst geimpft werden kann, vor Keuchhusten.",
    sex: "female",
    ageFrom: 15,
    ageTo: null,
    intervalYears: null,
    doctor: "Frauenarzt oder Hausarzt",
    note:
      "Zu Beginn des 3. Trimenons (ab der 28. Schwangerschaftswoche), in jeder Schwangerschaft, unabhängig vom Abstand zu früheren Impfungen. Bei erhöhter Wahrscheinlichkeit für eine Frühgeburt wird die Impfung ins 2. Trimenon vorgezogen.",
    source: "STIKO (Epid. Bull. 4/2026, Tabelle 2)",
    sourceUrl: "https://www.rki.de/DE/Aktuelles/Publikationen/Epidemiologisches-Bulletin/2026/04_26.pdf?__blob=publicationFile",
    requires: "pregnant",
  },
  {
    id: "risiko-schwangerschaft-grippe",
    title: "Grippe-Impfung in der Schwangerschaft",
    category: "impfung",
    description:
      "Die Grippe-Impfung schützt dich in der Schwangerschaft vor einem schweren Verlauf der echten Grippe.",
    sex: "female",
    ageFrom: 15,
    ageTo: null,
    intervalYears: null,
    doctor: "Frauenarzt oder Hausarzt",
    note:
      "Für alle Schwangeren ab dem 2. Trimenon, bei einer Grunderkrankung schon ab dem 1. Trimenon. Mit einem inaktivierten Impfstoff in der Grippesaison (Herbst/Winter), einmal pro Saison.",
    source: "STIKO (Epid. Bull. 4/2026, Tabelle 2)",
    sourceUrl: "https://www.rki.de/DE/Aktuelles/Publikationen/Epidemiologisches-Bulletin/2026/04_26.pdf?__blob=publicationFile",
    requires: "pregnant",
  },
  {
    id: "risiko-schwangerschaft-vorsorge",
    title: "Mutterschaftsvorsorge",
    category: "checkup",
    description:
      "Regelmäßige ärztliche Untersuchungen und Beratung während der Schwangerschaft, dazu drei Ultraschall-Screenings. Sie sind Kassenleistung und werden im Mutterpass dokumentiert.",
    sex: "female",
    ageFrom: 15,
    ageTo: null,
    intervalYears: null,
    doctor: "Frauenarzt oder Hebamme",
    note:
      "Üblich sind Untersuchungen alle vier Wochen bis zur 32. Schwangerschaftswoche, danach alle zwei Wochen. Ultraschall-Screenings in der 8.–11., 18.–21. und 28.–31. Woche. Zwischen der 24. und 27. Woche wird ein Test auf Schwangerschaftsdiabetes angeboten; auch zur Grippe- und Keuchhusten-Impfung wirst du beraten.",
    source: "G-BA (Mutterschafts-Richtlinie)",
    sourceUrl: "https://www.g-ba.de/richtlinien/19/",
    requires: "pregnant",
  },
  {
    id: "risiko-familie-darmkrebs-beratung",
    title: "Beratung bei Darmkrebs in der Familie",
    category: "krebs",
    description:
      "Wenn nahe Verwandte Darmkrebs hatten, ist dein eigenes Risiko erhöht. In einer Beratung klärst du, ob eine Darmspiegelung früher sinnvoll ist als mit 50.",
    sex: "all",
    ageFrom: 18,
    ageTo: 49,
    intervalYears: null,
    doctor: "Hausarzt",
    note:
      "Fachleute empfehlen bei Verwandten ersten Grades (Eltern, Geschwister, Kinder) eine Darmspiegelung 10 Jahre vor dem frühesten Erkrankungsalter in der Familie, spätestens aber mit 40 Jahren. Lass dich z. B. beim hausärztlichen Check-up beraten. Ob die Krankenkasse die frühe Darmspiegelung bezahlt, klärst du in der Beratung. Auch Zentren für erblichen Darmkrebs bieten Beratung an.",
    source: "gesund.bund.de (Bundesgesundheitsministerium)",
    sourceUrl: "https://gesund.bund.de/darmkrebs",
    requires: "familyColon",
  },
  {
    id: "risiko-familie-brustkrebs-beratung",
    title: "Beratung bei Brust- und Eierstockkrebs in der Familie",
    category: "krebs",
    description:
      "Wenn Brust- oder Eierstockkrebs in deiner Familie gehäuft auftritt, kann ein erblich erhöhtes Risiko vorliegen. Spezialisierte Zentren beraten dazu und bieten eine engmaschigere Früherkennung an.",
    sex: "female",
    ageFrom: 18,
    ageTo: null,
    intervalYears: null,
    doctor: "Frauenarzt oder Zentrum für familiären Brust- und Eierstockkrebs",
    note:
      "Frauen mit erblich bedingt hohem Brustkrebsrisiko können an einem engmaschigen Früherkennungsprogramm teilnehmen, das Zentren für familiären Brust- und Eierstockkrebs anbieten. Sprich deine Frauenärztin oder deinen Frauenarzt auf die Familiengeschichte an; ab 30 Jahren steht dir außerdem die jährliche Tastuntersuchung zu.",
    source: "gesund.bund.de (Bundesgesundheitsministerium)",
    sourceUrl: "https://gesund.bund.de/brustkrebs",
    requires: "familyBreast",
  },
  {
    id: "risiko-raucher-rauchstopp",
    title: "Rauchstopp-Unterstützung",
    category: "checkup",
    description:
      "Mit Unterstützung fällt es leichter, mit dem Rauchen aufzuhören. Qualitätsgeprüfte Nichtraucherkurse werden von den Krankenkassen gefördert.",
    sex: "all",
    ageFrom: 18,
    ageTo: null,
    intervalYears: null,
    doctor: "Hausarzt oder Krankenkasse",
    note:
      "Frag bei deiner Krankenkasse nach geförderten Kursen. Auch Ärztinnen und Ärzte, Beratungsstellen und Selbsthilfegruppen helfen; eine Nikotinersatztherapie kann Entzugserscheinungen lindern.",
    source: "gesund.bund.de (Bundesgesundheitsministerium)",
    sourceUrl: "https://gesund.bund.de/rauchen",
    requires: "smoker",
  },
];
