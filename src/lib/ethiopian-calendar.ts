/** Ethiopian (Ge'ez) calendar conversion via Julian Day Number. */

export type EthDate = {
  year: number;
  month: number;
  day: number;
};

export type GregDate = {
  year: number;
  month: number;
  day: number;
};

export const MONTHS = [
  {
    id: 1,
    name: "Meskerem",
    amharic: "መስከረም",
    geez: "መስከረም",
    meaning: "Beginning / the month of the cross",
    season: "Tsedey",
    seasonAm: "ጸደይ",
    seasonEn: "Spring",
    gregorianHint: "11 Sep – 10 Oct",
  },
  {
    id: 2,
    name: "Tikimt",
    amharic: "ጥቅምት",
    geez: "ጥቅምት",
    meaning: "The first fruits",
    season: "Tsedey",
    seasonAm: "ጸደይ",
    seasonEn: "Spring",
    gregorianHint: "11 Oct – 9 Nov",
  },
  {
    id: 3,
    name: "Hidar",
    amharic: "ኅዳር",
    geez: "ኅዳር",
    meaning: "The month of awe",
    season: "Tsedey",
    seasonAm: "ጸደይ",
    seasonEn: "Spring",
    gregorianHint: "10 Nov – 9 Dec",
  },
  {
    id: 4,
    name: "Tahsas",
    amharic: "ታኅሣሥ",
    geez: "ታኅሣሥ",
    meaning: "The month of fright / Advent",
    season: "Bega",
    seasonAm: "በጋ",
    seasonEn: "Dry season",
    gregorianHint: "10 Dec – 8 Jan",
  },
  {
    id: 5,
    name: "Tir",
    amharic: "ጥር",
    geez: "ጥር",
    meaning: "The month of strength",
    season: "Bega",
    seasonAm: "በጋ",
    seasonEn: "Dry season",
    gregorianHint: "9 Jan – 7 Feb",
  },
  {
    id: 6,
    name: "Yekatit",
    amharic: "የካቲት",
    geez: "የካቲት",
    meaning: "The month of restoration",
    season: "Bega",
    seasonAm: "በጋ",
    seasonEn: "Dry season",
    gregorianHint: "8 Feb – 9 Mar",
  },
  {
    id: 7,
    name: "Megabit",
    amharic: "መጋቢት",
    geez: "መጋቢት",
    meaning: "The month of spreading",
    season: "Belg",
    seasonAm: "በልግ",
    seasonEn: "Autumn rains",
    gregorianHint: "10 Mar – 8 Apr",
  },
  {
    id: 8,
    name: "Miyazya",
    amharic: "ሚያዝያ",
    geez: "ሚያዝያ",
    meaning: "The month of sprouting",
    season: "Belg",
    seasonAm: "በልግ",
    seasonEn: "Autumn rains",
    gregorianHint: "9 Apr – 8 May",
  },
  {
    id: 9,
    name: "Ginbot",
    amharic: "ግንቦት",
    geez: "ግንቦት",
    meaning: "The month of harvest approaching",
    season: "Belg",
    seasonAm: "በልግ",
    seasonEn: "Autumn rains",
    gregorianHint: "9 May – 7 Jun",
  },
  {
    id: 10,
    name: "Sene",
    amharic: "ሰኔ",
    geez: "ሰኔ",
    meaning: "The month of the rains",
    season: "Kiremt",
    seasonAm: "ክረምት",
    seasonEn: "Rainy season",
    gregorianHint: "8 Jun – 7 Jul",
  },
  {
    id: 11,
    name: "Hamle",
    amharic: "ሐምሌ",
    geez: "ሐምሌ",
    meaning: "The month of praise",
    season: "Kiremt",
    seasonAm: "ክረምት",
    seasonEn: "Rainy season",
    gregorianHint: "8 Jul – 6 Aug",
  },
  {
    id: 12,
    name: "Nehase",
    amharic: "ነሐሴ",
    geez: "ነሐሴ",
    meaning: "The month of compassion",
    season: "Kiremt",
    seasonAm: "ክረምት",
    seasonEn: "Rainy season",
    gregorianHint: "7 Aug – 5 Sep",
  },
  {
    id: 13,
    name: "Pagume",
    amharic: "ጳጉሜን",
    geez: "ጳጉሜን",
    meaning: "The leftover days",
    season: "Pagume",
    seasonAm: "ጳጉሜን",
    seasonEn: "Intercalary",
    gregorianHint: "6 Sep – 10 Sep",
  },
] as const;

export const WEEKDAYS = [
  { en: "Sunday", am: "እሑድ", geez: "እሑድ", latin: "Ehud", planet: "sun" },
  { en: "Monday", am: "ሰኞ", geez: "ሰኑይ", latin: "Segno", planet: "moon" },
  { en: "Tuesday", am: "ማክሰኞ", geez: "ሠሉስ", latin: "Maksegno", planet: "mars" },
  { en: "Wednesday", am: "ረቡዕ", geez: "ረቡዕ", latin: "Rebu", planet: "mercury" },
  { en: "Thursday", am: "ሐሙስ", geez: "ኀሙስ", latin: "Hamus", planet: "jupiter" },
  { en: "Friday", am: "አርብ", geez: "አርብ", latin: "Arb", planet: "venus" },
  { en: "Saturday", am: "ቅዳሜ", geez: "ቀዳም", latin: "Kidame", planet: "saturn" },
] as const;

export type Feast = {
  month: number;
  day: number;
  name: string;
  amharic: string;
  note: string;
};

export const FIXED_FEASTS: Feast[] = [
  { month: 1, day: 1, name: "Enkutatash", amharic: "እንቁጣጣሽ", note: "Ethiopian New Year — the gift of jewels" },
  { month: 1, day: 17, name: "Meskel", amharic: "መስቀል", note: "Finding of the True Cross" },
  { month: 3, day: 21, name: "Tsion Maryam", amharic: "ጽዮን ማርያም", note: "St. Mary of Zion" },
  { month: 4, day: 19, name: "Lideta", amharic: "ልደታ", note: "Nativity of the Virgin Mary" },
  { month: 4, day: 29, name: "Genna", amharic: "ገና", note: "Nativity of Christ" },
  { month: 5, day: 11, name: "Timkat", amharic: "ጥምቀት", note: "Epiphany — baptism of Christ" },
  { month: 6, day: 8, name: "Kulel", amharic: "ኩለል", note: "Presentation / Kudus Simeon" },
  { month: 8, day: 23, name: "St. George", amharic: "ቅዱስ ጊዮርጊስ", note: "Feast of St. George" },
  { month: 12, day: 16, name: "Filseta", amharic: "ፍልሰታ", note: "Assumption of Mary" },
  { month: 13, day: 1, name: "Pagume begins", amharic: "ጳጉሜን", note: "The short thirteenth month" },
];

/** JDN of the day before Meskerem 1, year 1 AM. */
const ETHIOPIC_EPOCH = 1723856;

export function isEthiopianLeap(year: number): boolean {
  return year % 4 === 3;
}

export function daysInEthiopianMonth(year: number, month: number): number {
  if (month < 13) return 30;
  return isEthiopianLeap(year) ? 6 : 5;
}

export function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function jdnToGregorian(jdn: number): GregDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

export function ethiopianToJdn(year: number, month: number, day: number): number {
  return ETHIOPIC_EPOCH + 365 * year + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

export function jdnToEthiopian(jdn: number): EthDate {
  const offset = jdn - ETHIOPIC_EPOCH;
  const nFour = Math.floor(offset / 1461);
  const r = offset % 1461;
  const nYears = Math.floor(r / 365) - Math.floor(r / 1460);
  const year = 4 * nFour + nYears;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
}

export function gregorianToEthiopian(year: number, month: number, day: number): EthDate {
  return jdnToEthiopian(gregorianToJdn(year, month, day));
}

export function ethiopianToGregorian(year: number, month: number, day: number): GregDate {
  return jdnToGregorian(ethiopianToJdn(year, month, day));
}

export function dateToEthiopian(date: Date): EthDate {
  return gregorianToEthiopian(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function weekdayFromJdn(jdn: number): number {
  // 0 = Sunday. JDN 0 was a Monday; JDN 1721426 (Greg 1 Jan 1) etc.
  return (jdn + 1) % 7;
}

export function weekdayOfGregorian(year: number, month: number, day: number): number {
  return weekdayFromJdn(gregorianToJdn(year, month, day));
}

export function formatEthiopian(d: EthDate, script: "latin" | "amharic" = "latin"): string {
  const month = MONTHS[d.month - 1];
  if (!month) return `${d.day}/${d.month}/${d.year}`;
  if (script === "amharic") return `${month.amharic} ${d.day}፣ ${d.year}`;
  return `${month.name} ${d.day}, ${d.year}`;
}

export function formatGregorianShort(d: GregDate): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.month - 1]} ${d.day}`;
}

export function formatGregorian(d: GregDate): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[d.month - 1]} ${d.day}, ${d.year}`;
}

export function gregorianRangeForMonth(year: number, month: number): { start: GregDate; end: GregDate } {
  const start = ethiopianToGregorian(year, month, 1);
  const end = ethiopianToGregorian(year, month, daysInEthiopianMonth(year, month));
  return { start, end };
}

export function feastsOn(month: number, day: number): Feast[] {
  return FIXED_FEASTS.filter((f) => f.month === month && f.day === day);
}

export function westernToEthiopianClock(date: Date): { hour: number; minute: number; period: "day" | "night" } {
  const h = date.getHours();
  const minute = date.getMinutes();
  const shifted = (h + 6) % 24;
  const hour12 = shifted % 12 === 0 ? 12 : shifted % 12;
  const period: "day" | "night" = h >= 6 && h < 18 ? "day" : "night";
  return { hour: hour12, minute, period };
}

export function formatEthiopianTime(date: Date): string {
  const t = westernToEthiopianClock(date);
  const mm = String(t.minute).padStart(2, "0");
  const period = t.period === "day" ? "day" : "night";
  return `${t.hour}:${mm} ${period}`;
}
