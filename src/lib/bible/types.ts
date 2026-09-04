export type Verse = {
  n: number;
  gez?: string;
  am: string;
  en: string;
};

export type Chapter = {
  number: number;
  title?: string;
  verses: Verse[];
};

export type Book = {
  id: string;
  section: "orit" | "nebiyat" | "dagua" | "wengel" | "broader";
  nameEn: string;
  nameAm: string;
  nameGez: string;
  note: string;
  chapters: Chapter[];
};

export const SECTION_LABELS: Record<Book["section"], { en: string; am: string }> = {
  orit: { en: "Orit — the Law", am: "ኦሪት" },
  nebiyat: { en: "Nebiyat — the Prophets", am: "ነቢያት" },
  dagua: { en: "Dagua — Writings & Psalms", am: "ዳዊት" },
  wengel: { en: "Wengel — the Gospel", am: "ወንጌል" },
  broader: { en: "Broader canon", am: "መጻሕፍት ተጨማሪ" },
};
