/** Compact NOAA-style sunrise / sunset for a civil date and location. */

export type Geo = { lat: number; lng: number; label: string };

export const PLACES: Geo[] = [
  { lat: 9.03, lng: 38.74, label: "Addis Ababa" },
  { lat: 14.13, lng: 38.72, label: "Axum" },
  { lat: 12.03, lng: 39.04, label: "Lalibela" },
  { lat: 12.6, lng: 37.47, label: "Gondar" },
  { lat: 15.34, lng: 38.93, label: "Asmara" },
  { lat: 8.98, lng: 38.8, label: "Bishoftu" },
];

const DEG = Math.PI / 180;

function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function toDateFromJulian(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

export function getSunTimes(date: Date, lat: number, lng: number): { sunrise: Date; sunset: Date; noon: Date } {
  const start = new Date(date);
  start.setHours(12, 0, 0, 0);
  const n = julianDate(start) - 2451545 + 0.0008;
  const jStar = n - lng / 360;
  const M = (357.5291 + 0.98560028 * jStar) % 360;
  const Mrad = M * DEG;
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = lambda * DEG;
  const jTransit =
    2451545 + jStar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);
  const delta = Math.asin(Math.sin(lambdaRad) * Math.sin(23.4397 * DEG));
  const latRad = lat * DEG;
  const cosOmega =
    (Math.sin(-0.833 * DEG) - Math.sin(latRad) * Math.sin(delta)) /
    (Math.cos(latRad) * Math.cos(delta));
  const clamped = Math.min(1, Math.max(-1, cosOmega));
  const omega = Math.acos(clamped);
  const omegaDays = omega / (2 * Math.PI);
  return {
    sunrise: toDateFromJulian(jTransit - omegaDays),
    sunset: toDateFromJulian(jTransit + omegaDays),
    noon: toDateFromJulian(jTransit),
  };
}

export function isDaytime(now: Date, lat: number, lng: number): boolean {
  const { sunrise, sunset } = getSunTimes(now, lat, lng);
  return now >= sunrise && now < sunset;
}
