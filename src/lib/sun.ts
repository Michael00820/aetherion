/** NOAA-style sunrise / sunset for a civil date at a geographic horizon. */

export type Geo = {
  lat: number;
  lng: number;
  label: string;
  timeZone?: string;
  source?: "geo" | "pin" | "guess";
};

export const PLACES: Geo[] = [
  { lat: 9.03, lng: 38.74, label: "Addis Ababa", timeZone: "Africa/Addis_Ababa", source: "pin" },
  { lat: 14.13, lng: 38.72, label: "Axum", timeZone: "Africa/Addis_Ababa", source: "pin" },
  { lat: 12.03, lng: 39.04, label: "Lalibela", timeZone: "Africa/Addis_Ababa", source: "pin" },
  { lat: 12.6, lng: 37.47, label: "Gondar", timeZone: "Africa/Addis_Ababa", source: "pin" },
  { lat: 15.34, lng: 38.93, label: "Asmara", timeZone: "Africa/Asmara", source: "pin" },
  { lat: 8.98, lng: 38.8, label: "Bishoftu", timeZone: "Africa/Addis_Ababa", source: "pin" },
];

const DEG = Math.PI / 180;

export type CivilDate = { year: number; month: number; day: number };

export function civilDateAt(date: Date, lng: number, timeZone?: string): CivilDate {
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date);
      const num = (type: string) => Number(parts.find((p) => p.type === type)?.value);
      return { year: num("year"), month: num("month"), day: num("day") };
    } catch {
      /* longitude fallback */
    }
  }
  const shifted = new Date(date.getTime() + (lng / 15) * 3_600_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

export function addCivilDays(civil: CivilDate, days: number): CivilDate {
  const utc = new Date(Date.UTC(civil.year, civil.month - 1, civil.day + days));
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() };
}

export function weekdayInZone(date: Date, timeZone?: string): number {
  if (timeZone) {
    try {
      const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone }).format(date);
      const idx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
      if (idx >= 0) return idx;
    } catch {
      /* fall through */
    }
  }
  return date.getDay();
}

function julianDate(date: Date): number {
  return date.getTime() / 86_400_000 + 2_440_587.5;
}

function fromJulian(jd: number): Date {
  return new Date((jd - 2_440_587.5) * 86_400_000);
}

/** Apparent sunrise/sunset using the official −0.833° altitude (refraction + solar radius). */
export function sunForCivilDate(
  civil: CivilDate,
  lat: number,
  lng: number,
): { sunrise: Date; sunset: Date; noon: Date } {
  const noonUtc = new Date(Date.UTC(civil.year, civil.month - 1, civil.day, 12, 0, 0));
  const n = julianDate(noonUtc) - 2_451_545 + 0.0008;
  const jStar = n - lng / 360;
  const M = (357.5291 + 0.98560028 * jStar) % 360;
  const Mrad = M * DEG;
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = lambda * DEG;
  const jTransit = 2_451_545 + jStar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);
  const delta = Math.asin(Math.sin(lambdaRad) * Math.sin(23.4397 * DEG));
  const latRad = lat * DEG;
  const cosOmega =
    (Math.sin(-0.833 * DEG) - Math.sin(latRad) * Math.sin(delta)) /
    (Math.cos(latRad) * Math.cos(delta));
  const omega = Math.acos(Math.min(1, Math.max(-1, cosOmega)));
  const omegaDays = omega / (2 * Math.PI);
  return {
    sunrise: fromJulian(jTransit - omegaDays),
    sunset: fromJulian(jTransit + omegaDays),
    noon: fromJulian(jTransit),
  };
}

export function getSunTimes(
  date: Date,
  lat: number,
  lng: number,
  timeZone?: string,
): { sunrise: Date; sunset: Date; noon: Date } {
  return sunForCivilDate(civilDateAt(date, lng, timeZone), lat, lng);
}

export function isDaytime(now: Date, lat: number, lng: number, timeZone?: string): boolean {
  const { sunrise, sunset } = getSunTimes(now, lat, lng, timeZone);
  return now >= sunrise && now < sunset;
}
