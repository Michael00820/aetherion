import type { EthDate } from "./types";

export const MONTHS = [
  { num: 1, name: "Meskerem", geez: "መስከረም" },
  { num: 2, name: "Tikimt", geez: "ጥቅምት" },
  { num: 3, name: "Hidar", geez: "ኅዳር" },
  { num: 4, name: "Tahsas", geez: "ታኅሣሥ" },
  { num: 5, name: "Tir", geez: "ጥር" },
  { num: 6, name: "Yekatit", geez: "የካቲት" },
  { num: 7, name: "Megabit", geez: "መጋቢት" },
  { num: 8, name: "Miazia", geez: "ሚያዝያ" },
  { num: 9, name: "Ginbot", geez: "ግንቦት" },
  { num: 10, name: "Sene", geez: "ሰኔ" },
  { num: 11, name: "Hamle", geez: "ሐምሌ" },
  { num: 12, name: "Nehase", geez: "ነሐሴ" },
  { num: 13, name: "Pagumen", geez: "ጳጉሜን" },
] as const;

export const WEEKDAYS = [
  { name: "Ehud", geez: "እሑድ", en: "Sunday" },
  { name: "Segno", geez: "ሰኞ", en: "Monday" },
  { name: "Maksegno", geez: "ማክሰኞ", en: "Tuesday" },
  { name: "Erob", geez: "ረቡዕ", en: "Wednesday" },
  { name: "Hamus", geez: "ሐሙስ", en: "Thursday" },
  { name: "Arb", geez: "ዓርብ", en: "Friday" },
  { name: "Kidame", geez: "ቅዳሜ", en: "Saturday" },
] as const;

const ONES = ["", "፩", "፪", "፫", "፬", "፭", "፮", "፯", "፰", "፱"];
const TENS = ["", "፲", "፳", "፴", "፵", "፶", "፷", "፸", "፹", "፺"];

export function isEthLeap(year: number): boolean {
  return year % 4 === 3;
}

export function daysInMonth(year: number, month: number): number {
  if (month < 13) return 30;
  return isEthLeap(year) ? 6 : 5;
}

/** Ethiopic → Julian Day Number (Amete Mihret, Dershowitz/Reingold). */
export function ethiopianToJdn(year: number, month: number, day: number): number {
  return 1724221 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
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

export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const j = jdn + 32044;
  const g = Math.floor(j / 146097);
  const dg = j % 146097;
  const c = Math.floor((Math.floor(dg / 36524) + 1) * 3 / 4);
  const dc = dg - c * 36524;
  const b = Math.floor(dc / 1461);
  const db = dc % 1461;
  const a = Math.floor((Math.floor(db / 365) + 1) * 3 / 4);
  const da = db - a * 365;
  const y = g * 400 + c * 100 + b * 4 + a;
  const m = Math.floor((da * 5 + 308) / 153) - 2;
  const d = da - Math.floor((m + 4) * 153 / 5) + 122;
  const year = y - 4800 + Math.floor((m + 2) / 12);
  const month = ((m + 2) % 12) + 1;
  const day = d + 1;
  return { year, month, day };
}

export function jdnToEthiopian(jdn: number): EthDate {
  const r = jdn - 1724221;
  const year = Math.floor((4 * r + 1463) / 1461);
  const t = r - (365 * (year - 1) + Math.floor(year / 4));
  const month = Math.floor(t / 30) + 1;
  const day = (t % 30) + 1;
  return { year, month, day };
}

export function dateToEthiopian(date: Date): EthDate {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return jdnToEthiopian(gregorianToJdn(y, m, d));
}

export function ethiopianToDate(eth: EthDate): Date {
  const g = jdnToGregorian(ethiopianToJdn(eth.year, eth.month, eth.day));
  return new Date(g.year, g.month - 1, g.day, 12, 0, 0, 0);
}

export function weekdayIndex(date: Date): number {
  return date.getDay();
}

export function toGeezNumeral(n: number): string {
  if (n <= 0) return String(n);
  if (n >= 10000) {
    const hi = Math.floor(n / 10000);
    const lo = n % 10000;
    return `${toGeezNumeral(hi)}፼${lo ? toGeezNumeral(lo) : ""}`;
  }
  if (n >= 100) {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    const head = h === 1 ? "፻" : `${ONES[h]}፻`;
    return head + (rest ? toGeezNumeral(rest) : "");
  }
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${TENS[t]}${ONES[o]}`;
}

export function formatEthiopian(eth: EthDate, lang: "en" | "am" = "en"): string {
  const month = MONTHS[eth.month - 1];
  if (!month) return `${eth.year}-${eth.month}-${eth.day}`;
  if (lang === "am") {
    return `${month.geez} ${toGeezNumeral(eth.day)} ${toGeezNumeral(eth.year)}`;
  }
  return `${month.name} ${eth.day}, ${eth.year}`;
}

export function formatGeezDate(eth: EthDate): string {
  const month = MONTHS[eth.month - 1];
  return `${month?.geez ?? ""} ${toGeezNumeral(eth.day)}፣ ${toGeezNumeral(eth.year)}`;
}

/** Orthodox/Julian computus, then +13 days for 1900–2099 Gregorian. */
export function orthodoxEaster(gregYear: number): Date {
  const a = gregYear % 4;
  const b = gregYear % 7;
  const c = gregYear % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  const julianOffset = gregYear < 2100 ? 13 : 14;
  return new Date(gregYear, month - 1, day + julianOffset, 12, 0, 0);
}

export function ethiopianEaster(ethYear: number): EthDate {
  const gYear = ethYear + 8;
  return dateToEthiopian(orthodoxEaster(gYear));
}

export function goldenNumber(ethYear: number): number {
  return (ethYear % 19) + 1;
}

export function epact(ethYear: number): number {
  return (11 * goldenNumber(ethYear)) % 30;
}

export type FastInfo = {
  id: string;
  name: string;
  geez: string;
  active: boolean;
};

export function currentFasts(eth: EthDate, date: Date): FastInfo[] {
  const easter = ethiopianToDate(ethiopianEaster(eth.year));
  const dayMs = 86400000;
  const delta = Math.round((startOfDay(date).getTime() - startOfDay(easter).getTime()) / dayMs);
  const wedFri = date.getDay() === 3 || date.getDay() === 5;
  const nativityStart = ethiopianToDate({ year: eth.year, month: 4, day: 16 });
  const nativityEnd = ethiopianToDate({ year: eth.year, month: 4, day: 29 });
  const tsomeNabi = date >= nativityStart && date < nativityEnd;
  const hudadi = delta <= -2 && delta >= -55;
  const filseta = eth.month === 12 && eth.day >= 1 && eth.day <= 16;

  return [
    { id: "wedfri", name: "Wednesday & Friday", geez: "ረቡዕ ወዓርብ", active: wedFri && !hudadi },
    { id: "hudadi", name: "Great Lent (Hudadi)", geez: "ሁዳዴ", active: hudadi },
    { id: "nabi", name: "Fast of the Prophets", geez: "ጾመ ነቢያት", active: tsomeNabi },
    { id: "filseta", name: "Fast of the Assumption", geez: "ጾመ ፍልሰታ", active: filseta },
  ];
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function monthGrid(year: number, month: number): (number | null)[] {
  const first = ethiopianToDate({ year, month, day: 1 });
  const start = first.getDay();
  const count = daysInMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= count; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export const SEASONS = [
  { id: "belg", name: "Belg", geez: "በልግ", months: [7, 8, 9], hint: "Autumn rains" },
  { id: "kiremt", name: "Kiremt", geez: "ክረምት", months: [10, 11, 12], hint: "The long rains" },
  { id: "tsedey", name: "Tsedey", geez: "ጸደይ", months: [1, 2, 3], hint: "Spring, New Year" },
  { id: "bega", name: "Bega", geez: "በጋ", months: [4, 5, 6], hint: "The dry season" },
] as const;

export function seasonFor(month: number) {
  return SEASONS.find((s) => (s.months as readonly number[]).includes(month)) ?? SEASONS[0];
}
