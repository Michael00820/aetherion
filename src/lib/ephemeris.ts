import * as Astronomy from "astronomy-engine";
import { PLANETS, type PlanetInfo } from "./planet-data";
import type { BodyId } from "./types";

export type BodyState = {
  id: BodyId;
  x: number;
  y: number;
  z: number;
  lon: number;
  lat: number;
  distanceAu: number;
};

const BODY_MAP: Record<string, Astronomy.Body> = {
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  earth: Astronomy.Body.Earth,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
};

function visualRadius(au: number, planet: PlanetInfo): number {
  if (planet.visualAu === 0) return 0;
  const compressed = Math.log(1 + au * 1.4) / Math.log(1 + 30);
  return 3.4 + compressed * (planet.visualAu - 3.4);
}

export function helioPosition(id: BodyId, date: Date): BodyState {
  if (id === "sun") {
    return { id, x: 0, y: 0, z: 0, lon: 0, lat: 0, distanceAu: 0 };
  }
  if (id === "halley") {
    return halleyPosition(date);
  }
  if (id === "moon") {
    const earth = helioPosition("earth", date);
    const astroTime = Astronomy.MakeTime(date);
    const geo = Astronomy.GeoMoon(astroTime);
    const scale = 0.72;
    return {
      id,
      x: earth.x + geo.x * scale * 0.08,
      y: earth.y + geo.z * scale * 0.08,
      z: earth.z + geo.y * scale * 0.08,
      lon: 0,
      lat: 0,
      distanceAu: Math.sqrt(geo.x * geo.x + geo.y * geo.y + geo.z * geo.z),
    };
  }

  const body = BODY_MAP[id];
  const planet = PLANETS.find((p) => p.id === id);
  const astroTime = Astronomy.MakeTime(date);
  const vec = Astronomy.HelioVector(body, astroTime);
  const ecl = Astronomy.Ecliptic(vec);
  const au = Math.sqrt(vec.x * vec.x + geoY(vec) + vec.z * vec.z);
  const r = planet ? visualRadius(au, planet) : au * 8;
  const lon = (ecl.elon * Math.PI) / 180;
  const lat = (ecl.elat * Math.PI) / 180;
  return {
    id,
    x: r * Math.cos(lat) * Math.cos(lon),
    y: r * Math.sin(lat),
    z: r * Math.cos(lat) * Math.sin(lon),
    lon: ecl.elon,
    lat: ecl.elat,
    distanceAu: au,
  };
}

function geoY(vec: Astronomy.Vector): number {
  return vec.y * vec.y;
}

/** Halley's comet, simplified Keplerian ellipse (P = 75.3y, e ≈ 0.967). */
export function halleyPosition(date: Date): BodyState {
  const peri = Date.UTC(1986, 1, 9);
  const period = 75.32 * 365.25 * 86400000;
  const t = (date.getTime() - peri) / period;
  const m = ((t % 1) + 1) % 1 * Math.PI * 2;
  let eAnom = m;
  for (let i = 0; i < 8; i++) {
    eAnom = m + 0.967 * Math.sin(eAnom);
  }
  const a = 18.4;
  const e = 0.967;
  const xOrb = a * (Math.cos(eAnom) - e);
  const zOrb = a * Math.sqrt(1 - e * e) * Math.sin(eAnom);
  const tilt = 1.12;
  return {
    id: "halley",
    x: xOrb * Math.cos(tilt),
    y: zOrb * 0.35 + xOrb * Math.sin(tilt) * 0.4,
    z: zOrb * Math.cos(0.4),
    lon: 0,
    lat: 0,
    distanceAu: Math.sqrt(xOrb * xOrb + zOrb * zOrb),
  };
}

export function moonPhase(date: Date): { angle: number; name: string; illumination: number } {
  const phase = Astronomy.MoonPhase(Astronomy.MakeTime(date));
  const illumination = 0.5 * (1 - Math.cos((phase * Math.PI) / 180));
  let name = "Waxing crescent";
  if (phase < 10 || phase > 350) name = "New moon";
  else if (phase < 80) name = "Waxing crescent";
  else if (phase < 100) name = "First quarter";
  else if (phase < 170) name = "Waxing gibbous";
  else if (phase < 190) name = "Full moon";
  else if (phase < 260) name = "Waning gibbous";
  else if (phase < 280) name = "Last quarter";
  else name = "Waning crescent";
  return { angle: phase, name, illumination };
}

export function allPlanetStates(date: Date): BodyState[] {
  return PLANETS.filter((p) => p.id !== "sun").map((p) => helioPosition(p.id, date));
}
