import type { BodyId } from "./types";

export type PlanetInfo = {
  id: BodyId;
  name: string;
  geez: string;
  astronomy: string | null;
  color: string;
  emissive: string;
  radius: number;
  visualAu: number;
  moons?: { name: string; geez: string; radius: number; distance: number; period: number }[];
  blurb: string;
};

export const PLANETS: PlanetInfo[] = [
  {
    id: "sun",
    name: "Sun",
    geez: "ጸሐይ",
    astronomy: "Sun",
    color: "#ffd27a",
    emissive: "#ff9a3c",
    radius: 1.35,
    visualAu: 0,
    blurb: "The created light of the first day. In Ethiopian cosmology the sun measures the twelve hours of daytime from dawn at the eastern horizon.",
  },
  {
    id: "mercury",
    name: "Mercury",
    geez: "ዓጣርድ",
    astronomy: "Mercury",
    color: "#b7b3a8",
    emissive: "#6d6a62",
    radius: 0.18,
    visualAu: 3.2,
    blurb: "The swift inner wanderer. Closest to the sun, it races through its year in eighty-eight earthly days.",
  },
  {
    id: "venus",
    name: "Venus",
    geez: "ዙሐራ",
    astronomy: "Venus",
    color: "#e8d5a8",
    emissive: "#c4a56a",
    radius: 0.28,
    visualAu: 4.6,
    blurb: "The morning and evening star. Brightest of the wanderers, she never strays far from the sun.",
  },
  {
    id: "earth",
    name: "Earth",
    geez: "ምድር",
    astronomy: "Earth",
    color: "#3d7a6a",
    emissive: "#1a3d38",
    radius: 0.3,
    visualAu: 6.2,
    moons: [{ name: "Moon", geez: "ወርህ", radius: 0.1, distance: 0.72, period: 27.3 }],
    blurb: "Our home, counted by the Ethiopian calendar of thirteen months. From here the heavens are read: sun, moon, and the wandering stars.",
  },
  {
    id: "mars",
    name: "Mars",
    geez: "መሪህ",
    astronomy: "Mars",
    color: "#c45a3a",
    emissive: "#6b2418",
    radius: 0.22,
    visualAu: 8.1,
    moons: [
      { name: "Phobos", geez: "ፎቦስ", radius: 0.04, distance: 0.42, period: 0.32 },
      { name: "Deimos", geez: "ዲሞስ", radius: 0.03, distance: 0.62, period: 1.26 },
    ],
    blurb: "The red wanderer. In older tables he is the planet of fire and of the dry season's edge.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    geez: "ሙሽተሪ",
    astronomy: "Jupiter",
    color: "#d4b48a",
    emissive: "#8a6232",
    radius: 0.72,
    visualAu: 12.4,
    moons: [
      { name: "Io", geez: "ኢዮ", radius: 0.08, distance: 1.05, period: 1.77 },
      { name: "Europa", geez: "ኤውሮፓ", radius: 0.07, distance: 1.28, period: 3.55 },
      { name: "Ganymede", geez: "ጋኒሜድ", radius: 0.09, distance: 1.55, period: 7.15 },
      { name: "Callisto", geez: "ካሊስቶ", radius: 0.08, distance: 1.88, period: 16.7 },
    ],
    blurb: "The great king of the wanderers. His four bright moons were among the first new heavens revealed to the telescope.",
  },
  {
    id: "saturn",
    name: "Saturn",
    geez: "ዘሐል",
    astronomy: "Saturn",
    color: "#e6d2a0",
    emissive: "#8a7840",
    radius: 0.62,
    visualAu: 16.2,
    moons: [{ name: "Titan", geez: "ታይታን", radius: 0.1, distance: 1.45, period: 15.9 }],
    blurb: "The ringed elder. Slowest of the classical planets to complete a circuit, he keeps a year of twenty-nine earthly years.",
  },
  {
    id: "uranus",
    name: "Uranus",
    geez: "ዩራኑስ",
    astronomy: "Uranus",
    color: "#7ec8c8",
    emissive: "#2a6a6a",
    radius: 0.42,
    visualAu: 20.1,
    blurb: "The first of the modern wanderers, ice-green and tilted on his side, completing a circuit in eighty-four years.",
  },
  {
    id: "neptune",
    name: "Neptune",
    geez: "ኔፕቱን",
    astronomy: "Neptune",
    color: "#3a6ec8",
    emissive: "#1a3a7a",
    radius: 0.4,
    visualAu: 23.8,
    moons: [{ name: "Triton", geez: "ትሪቶን", radius: 0.08, distance: 1.1, period: 5.88 }],
    blurb: "The farthest giant, deep blue, found by calculation before it was seen. His year is one hundred sixty-five of ours.",
  },
];

export const PLANET_BY_ID: Record<string, PlanetInfo> = Object.fromEntries(
  PLANETS.map((p) => [p.id, p]),
);

export const ADDIS = { latitude: 9.03, longitude: 38.74, elevation: 2355 };
