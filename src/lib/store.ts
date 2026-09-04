import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanetId } from "./planets";
import { PLACES, type Geo } from "./sun";

export type PanelId = "orbits" | "zemen" | "hours" | "scripture";
export type ThemeMode = "auto" | "gold" | "silver";
export type ScriptureLang = "traditional" | "english" | "dual";

type AppState = {
  panel: PanelId;
  setPanel: (panel: PanelId) => void;
  paused: boolean;
  togglePaused: () => void;
  setPaused: (paused: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  focusedPlanet: PlanetId | null;
  setFocusedPlanet: (id: PlanetId | null) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  showTrails: boolean;
  setShowTrails: (v: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  place: Geo;
  setPlace: (place: Geo) => void;
  scriptureLang: ScriptureLang;
  setScriptureLang: (lang: ScriptureLang) => void;
  calendarYear: number | null;
  setCalendarYear: (year: number) => void;
};

const addis = PLACES[0] ?? { lat: 9.03, lng: 38.74, label: "Addis Ababa" };

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      panel: "orbits",
      setPanel: (panel) => set({ panel }),
      paused: false,
      togglePaused: () => set((s) => ({ paused: !s.paused })),
      setPaused: (paused) => set({ paused }),
      speed: 1,
      setSpeed: (speed) => set({ speed }),
      focusedPlanet: null,
      setFocusedPlanet: (focusedPlanet) => set({ focusedPlanet }),
      showLabels: true,
      setShowLabels: (showLabels) => set({ showLabels }),
      showTrails: true,
      setShowTrails: (showTrails) => set({ showTrails }),
      themeMode: "auto",
      setThemeMode: (themeMode) => set({ themeMode }),
      place: addis,
      setPlace: (place) => set({ place }),
      scriptureLang: "dual",
      setScriptureLang: (scriptureLang) => set({ scriptureLang }),
      calendarYear: null,
      setCalendarYear: (calendarYear) => set({ calendarYear }),
    }),
    {
      name: "aetherion",
      partialize: (s) => ({
        themeMode: s.themeMode,
        speed: s.speed,
        showLabels: s.showLabels,
        showTrails: s.showTrails,
        scriptureLang: s.scriptureLang,
        place: s.place,
      }),
    },
  ),
);
