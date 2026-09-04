import { PLACES, type Geo } from "./sun";

const TZ_HORIZONS: Record<string, Geo> = {
  "Africa/Addis_Ababa": PLACES[0]!,
  "Africa/Asmara": PLACES[4]!,
  "Africa/Nairobi": { lat: -1.286, lng: 36.817, label: "Nairobi", timeZone: "Africa/Nairobi", source: "guess" },
  "Africa/Lagos": { lat: 6.5244, lng: 3.3792, label: "Lagos", timeZone: "Africa/Lagos", source: "guess" },
  "Africa/Accra": { lat: 5.6037, lng: -0.187, label: "Accra", timeZone: "Africa/Accra", source: "guess" },
  "Africa/Cairo": { lat: 30.0444, lng: 31.2357, label: "Cairo", timeZone: "Africa/Cairo", source: "guess" },
  "Africa/Johannesburg": {
    lat: -26.2041,
    lng: 28.0473,
    label: "Johannesburg",
    timeZone: "Africa/Johannesburg",
    source: "guess",
  },
  "Africa/Algiers": { lat: 36.7538, lng: 3.0588, label: "Algiers", timeZone: "Africa/Algiers", source: "guess" },
  "Africa/Casablanca": { lat: 33.5731, lng: -7.5898, label: "Casablanca", timeZone: "Africa/Casablanca", source: "guess" },
  "Europe/London": { lat: 51.5074, lng: -0.1278, label: "London", timeZone: "Europe/London", source: "guess" },
  "Europe/Paris": { lat: 48.8566, lng: 2.3522, label: "Paris", timeZone: "Europe/Paris", source: "guess" },
  "America/New_York": { lat: 40.7128, lng: -74.006, label: "New York", timeZone: "America/New_York", source: "guess" },
  "America/Los_Angeles": {
    lat: 34.0522,
    lng: -118.2437,
    label: "Los Angeles",
    timeZone: "America/Los_Angeles",
    source: "guess",
  },
  "Asia/Dubai": { lat: 25.2048, lng: 55.2708, label: "Dubai", timeZone: "Asia/Dubai", source: "guess" },
  "Asia/Jerusalem": { lat: 31.7683, lng: 35.2137, label: "Jerusalem", timeZone: "Asia/Jerusalem", source: "guess" },
};

function round4(n: number): number {
  return Math.round(n * 10_000) / 10_000;
}

export function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Addis_Ababa";
  } catch {
    return "Africa/Addis_Ababa";
  }
}

export function guessHorizon(timeZone = browserTimeZone()): Geo {
  if (TZ_HORIZONS[timeZone]) return { ...TZ_HORIZONS[timeZone]!, source: "guess" };
  const prefix = timeZone.split("/")[0];
  const match = Object.entries(TZ_HORIZONS).find(([id]) => id.startsWith(`${prefix}/`));
  if (match) return { ...match[1], timeZone, source: "guess" };
  return { ...PLACES[0]!, source: "guess" };
}

export async function detectHorizon(): Promise<Geo> {
  const timeZone = browserTimeZone();
  const fallback = guessHorizon(timeZone);
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Geolocation } = await import("@capacitor/geolocation");
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 8000,
      });
      return {
        lat: round4(pos.coords.latitude),
        lng: round4(pos.coords.longitude),
        label: "Your horizon",
        timeZone,
        source: "geo",
      };
    }
  } catch {
    /* fall through to browser geolocation */
  }
  if (typeof navigator === "undefined" || !navigator.geolocation) return fallback;
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 30 * 60_000,
      });
    });
    return {
      lat: round4(pos.coords.latitude),
      lng: round4(pos.coords.longitude),
      label: "Your horizon",
      timeZone,
      source: "geo",
    };
  } catch {
    return fallback;
  }
}

export function formatCoords(geo: Geo): string {
  const ns = geo.lat >= 0 ? "N" : "S";
  const ew = geo.lng >= 0 ? "E" : "W";
  return `${Math.abs(geo.lat).toFixed(2)}°${ns} ${Math.abs(geo.lng).toFixed(2)}°${ew}`;
}
