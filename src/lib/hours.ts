import * as Astronomy from "astronomy-engine";
import { ADDIS } from "./planet-data";

export type HourKind = "day" | "night";

export type SeasonalHour = {
  index: number;
  kind: HourKind;
  start: Date;
  end: Date;
  label: string;
  geez: string;
};

export const CANONICAL = [
  { id: "matins", name: "Matins", geez: "ውዳሴ", hour: 0, kind: "night" as const, note: "Night office before dawn" },
  { id: "lauds", name: "Lauds", geez: "ሰዓተ ግህድ", hour: 11, kind: "night" as const, note: "Praise at first light" },
  { id: "prime", name: "Prime", geez: "ሰዓተ ሠርቅ", hour: 0, kind: "day" as const, note: "First hour of day" },
  { id: "terce", name: "Terce", geez: "ሰዓተ ሠለስቱ", hour: 2, kind: "day" as const, note: "Third hour" },
  { id: "sext", name: "Sext", geez: "ሰዓተ ስድስቱ", hour: 5, kind: "day" as const, note: "Sixth hour, noon" },
  { id: "none", name: "None", geez: "ሰዓተ ታሕተ", hour: 8, kind: "day" as const, note: "Ninth hour" },
  { id: "vespers", name: "Vespers", geez: "ሰዓተ ምሴት", hour: 0, kind: "night" as const, note: "Evening office at sunset" },
  { id: "compline", name: "Compline", geez: "ሰዓተ ንዋም", hour: 3, kind: "night" as const, note: "Night prayer before sleep" },
] as const;

const GEEZ_HOUR = ["፩", "፪", "፫", "፬", "፭", "፮", "፯", "፰", "፱", "፲", "፲፩", "፲፪"];

function observer() {
  return new Astronomy.Observer(ADDIS.latitude, ADDIS.longitude, ADDIS.elevation);
}

export function sunTimes(date: Date): { rise: Date; set: Date; noon: Date } {
  const obs = observer();
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const t0 = Astronomy.MakeTime(start);
  const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, +1, t0, 1);
  const set = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, -1, t0, 1);
  const noon = Astronomy.SearchHourAngle(Astronomy.Body.Sun, obs, 0, t0, +1);
  const fallbackRise = new Date(start.getTime() + 6 * 3600000);
  const fallbackSet = new Date(start.getTime() + 18 * 3600000);
  return {
    rise: rise ? rise.date : fallbackRise,
    set: set ? set.date : fallbackSet,
    noon: noon ? noon.time.date : new Date(start.getTime() + 12 * 3600000),
  };
}

export function seasonalHours(date: Date): SeasonalHour[] {
  const { rise, set } = sunTimes(date);
  let nextRise = new Date(rise.getTime() + 86400000);
  try {
    const obs = observer();
    const t1 = Astronomy.MakeTime(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0));
    const r = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, +1, t1, 1);
    if (r) nextRise = r.date;
  } catch {
    /* keep fallback */
  }

  const daySpan = set.getTime() - rise.getTime();
  const nightSpan = nextRise.getTime() - set.getTime();
  const hours: SeasonalHour[] = [];

  for (let i = 0; i < 12; i++) {
    const start = new Date(rise.getTime() + (daySpan * i) / 12);
    const end = new Date(rise.getTime() + (daySpan * (i + 1)) / 12);
    hours.push({
      index: i + 1,
      kind: "day",
      start,
      end,
      label: `Day hour ${i + 1}`,
      geez: `ሰዓተ ${GEEZ_HOUR[i]}`,
    });
  }
  for (let i = 0; i < 12; i++) {
    const start = new Date(set.getTime() + (nightSpan * i) / 12);
    const end = new Date(set.getTime() + (nightSpan * (i + 1)) / 12);
    hours.push({
      index: i + 1,
      kind: "night",
      start,
      end,
      label: `Night hour ${i + 1}`,
      geez: `ሰዓተ ሌሊት ${GEEZ_HOUR[i]}`,
    });
  }
  return hours;
}

export function currentHour(date: Date, hours: SeasonalHour[]): SeasonalHour {
  return (
    hours.find((h) => date >= h.start && date < h.end) ??
    hours[0]
  );
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}
