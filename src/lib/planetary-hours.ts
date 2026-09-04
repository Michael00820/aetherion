import { getPlanet, type PlanetId } from "./planets";
import { WEEKDAYS } from "./ethiopian-calendar";
import { getSunTimes } from "./sun";

/** Chaldean order used to sequence planetary hours. */
export const CHALDEAN: PlanetId[] = [
  "saturn",
  "jupiter",
  "mars",
  "sun",
  "venus",
  "mercury",
  "moon",
];

/** Sunday → Saturday rulers of the civil day (first hour of daylight). */
export const DAY_RULERS: PlanetId[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

export type HourSlot = {
  index: number;
  planet: PlanetId;
  start: Date;
  end: Date;
  isDay: boolean;
  ordinal: number;
  ethiopianHour: number;
};

export type DayHours = {
  weekday: number;
  dayRuler: PlanetId;
  sunrise: Date;
  sunset: Date;
  nextSunrise: Date;
  hours: HourSlot[];
  current: HourSlot | null;
};

function chaldeanIndex(id: PlanetId): number {
  return CHALDEAN.indexOf(id);
}

export function hoursForDate(date: Date, lat: number, lng: number, clock: Date = date): DayHours {
  const local = new Date(date);
  const weekday = local.getDay();
  const dayRuler = DAY_RULERS[weekday] ?? "sun";
  const { sunrise, sunset } = getSunTimes(local, lat, lng);
  const next = new Date(local);
  next.setDate(next.getDate() + 1);
  const { sunrise: nextSunrise } = getSunTimes(next, lat, lng);

  const daySpan = Math.max(1, sunset.getTime() - sunrise.getTime());
  const nightSpan = Math.max(1, nextSunrise.getTime() - sunset.getTime());
  const dayLen = daySpan / 12;
  const nightLen = nightSpan / 12;
  const startIdx = chaldeanIndex(dayRuler);
  const hours: HourSlot[] = [];

  for (let i = 0; i < 24; i++) {
    const planet = CHALDEAN[(startIdx + i) % 7] ?? "sun";
    const isDay = i < 12;
    const ordinal = (i % 12) + 1;
    const startMs = isDay ? sunrise.getTime() + i * dayLen : sunset.getTime() + (i - 12) * nightLen;
    const len = isDay ? dayLen : nightLen;
    hours.push({
      index: i,
      planet,
      start: new Date(startMs),
      end: new Date(startMs + len),
      isDay,
      ordinal,
      ethiopianHour: ordinal,
    });
  }

  const current = hours.find((h) => clock >= h.start && clock < h.end) ?? null;

  return { weekday, dayRuler, sunrise, sunset, nextSunrise, hours, current };
}

export function hourProgress(now: Date, slot: HourSlot): { pct: number; elapsedMin: number; remainMin: number } {
  const span = slot.end.getTime() - slot.start.getTime();
  const elapsed = Math.min(span, Math.max(0, now.getTime() - slot.start.getTime()));
  const remain = Math.max(0, span - elapsed);
  return {
    pct: span <= 0 ? 0 : elapsed / span,
    elapsedMin: Math.floor(elapsed / 60000),
    remainMin: Math.ceil(remain / 60000),
  };
}

export function rulerName(id: PlanetId): { en: string; am: string; glyph: string } {
  const p = getPlanet(id);
  return { en: p.name, am: p.amharic, glyph: p.glyph };
}

export function weekdayRuler(weekday: number): PlanetId {
  return DAY_RULERS[weekday] ?? "sun";
}

export function ethiopianWeekday(weekday: number) {
  return WEEKDAYS[weekday] ?? WEEKDAYS[0];
}
