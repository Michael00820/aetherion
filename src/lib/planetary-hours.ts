import { getPlanet, type PlanetId } from "./planets";
import { WEEKDAYS } from "./ethiopian-calendar";
import {
  addCivilDays,
  civilDateAt,
  sunForCivilDate,
  weekdayInZone,
  type Geo,
} from "./sun";

/**
 * Planetary hours (horae inaequales).
 *
 * 1. The planetary *day* begins at apparent sunrise on the local horizon — not midnight,
 *    and not a 60-minute clock. (Renaissance / modern astrological convention.)
 * 2. Daylight (sunrise → sunset) is split into 12 equal segments. Night (sunset → next
 *    sunrise) is split into 12 equal segments. Lengths differ except near equinox.
 * 3. Hours follow Chaldean order, slowest to fastest: Saturn → Jupiter → Mars → Sun →
 *    Venus → Mercury → Moon, then repeat.
 * 4. Hour 1 of daylight is the weekday ruler (Sun on Sunday … Venus on Friday … Saturn
 *    on Saturday). Night continues the same chain; Saturday's first hour is therefore
 *    three steps on from Friday's, which is why the week itself is ordered as it is.
 * 5. Sunrise, sunset, and weekday are computed for the observer's latitude/longitude.
 */
export const CHALDEAN: PlanetId[] = [
  "saturn",
  "jupiter",
  "mars",
  "sun",
  "venus",
  "mercury",
  "moon",
];

/** Sunday → Saturday rulers of the first hour after sunrise. */
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
  dayMinutes: number;
  nightMinutes: number;
};

function chaldeanIndex(id: PlanetId): number {
  const idx = CHALDEAN.indexOf(id);
  return idx < 0 ? 0 : idx;
}

function buildHours(
  civil: { year: number; month: number; day: number },
  geo: Geo,
  clock: Date,
): DayHours {
  const { lat, lng, timeZone } = geo;
  const { sunrise, sunset } = sunForCivilDate(civil, lat, lng);
  const next = addCivilDays(civil, 1);
  const { sunrise: nextSunrise } = sunForCivilDate(next, lat, lng);

  const daySpan = Math.max(1, sunset.getTime() - sunrise.getTime());
  const nightSpan = Math.max(1, nextSunrise.getTime() - sunset.getTime());
  const dayLen = daySpan / 12;
  const nightLen = nightSpan / 12;

  const weekday = weekdayInZone(sunrise, timeZone);
  const dayRuler = DAY_RULERS[weekday] ?? "sun";
  const startIdx = chaldeanIndex(dayRuler);
  const hours: HourSlot[] = [];

  for (let i = 0; i < 24; i++) {
    const isDay = i < 12;
    const ordinal = (i % 12) + 1;
    const startMs = isDay ? sunrise.getTime() + i * dayLen : sunset.getTime() + (i - 12) * nightLen;
    const endMs = isDay
      ? i === 11
        ? sunset.getTime()
        : sunrise.getTime() + (i + 1) * dayLen
      : i === 23
        ? nextSunrise.getTime()
        : sunset.getTime() + (i - 11) * nightLen;
    hours.push({
      index: i,
      planet: CHALDEAN[(startIdx + i) % 7] ?? "sun",
      start: new Date(startMs),
      end: new Date(endMs),
      isDay,
      ordinal,
      ethiopianHour: ordinal,
    });
  }

  const current = hours.find((h) => clock >= h.start && clock < h.end) ?? null;

  return {
    weekday,
    dayRuler,
    sunrise,
    sunset,
    nextSunrise,
    hours,
    current,
    dayMinutes: daySpan / 60_000,
    nightMinutes: nightSpan / 60_000,
  };
}

/** Twelve day + twelve night hours beginning at this civil date's sunrise. */
export function hoursForDate(date: Date, geo: Geo, clock: Date = date): DayHours {
  const civil = civilDateAt(date, geo.lng, geo.timeZone);
  return buildHours(civil, geo, clock);
}

/**
 * Hours of the planetary day that contains `clock`: if it is still before today's
 * sunrise, that is yesterday's night (the previous weekday's chain).
 */
export function hoursContaining(clock: Date, geo: Geo): DayHours {
  const civil = civilDateAt(clock, geo.lng, geo.timeZone);
  const { sunrise } = sunForCivilDate(civil, geo.lat, geo.lng);
  if (clock < sunrise) return buildHours(addCivilDays(civil, -1), geo, clock);
  return buildHours(civil, geo, clock);
}

export function hourProgress(now: Date, slot: HourSlot): { pct: number; elapsedMin: number; remainMin: number } {
  const span = slot.end.getTime() - slot.start.getTime();
  const elapsed = Math.min(span, Math.max(0, now.getTime() - slot.start.getTime()));
  const remain = Math.max(0, span - elapsed);
  return {
    pct: span <= 0 ? 0 : elapsed / span,
    elapsedMin: Math.floor(elapsed / 60_000),
    remainMin: Math.ceil(remain / 60_000),
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

export function formatHourClock(date: Date, timeZone?: string): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone });
}
