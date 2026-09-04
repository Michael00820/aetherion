import { create } from "zustand";
import type { BodyId, PanelId, SpeedId } from "./types";

const SPEEDS: SpeedId[] = [0, 1, 24, 168, 720, 8760];

type AppState = {
  simTime: number;
  speed: SpeedId;
  selected: BodyId | null;
  follow: BodyId | null;
  panel: PanelId;
  showOrbits: boolean;
  showLabels: boolean;
  muted: boolean;
  onboarded: boolean;
  setSimTime: (t: number) => void;
  advance: (ms: number) => void;
  cycleSpeed: () => void;
  setSpeed: (s: SpeedId) => void;
  select: (id: BodyId | null) => void;
  setFollow: (id: BodyId | null) => void;
  setPanel: (p: PanelId) => void;
  toggleOrbits: () => void;
  toggleLabels: () => void;
  toggleMuted: () => void;
  completeOnboarding: () => void;
};

function readOnboarded() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("aetherion-onboarded") === "1";
  } catch {
    return false;
  }
}

export const useApp = create<AppState>((set, get) => ({
  simTime: Date.now(),
  speed: 1,
  selected: null,
  follow: null,
  panel: "none",
  showOrbits: true,
  showLabels: true,
  muted: true,
  onboarded: readOnboarded(),
  setSimTime: (t) => set({ simTime: t }),
  advance: (ms) => {
    const { speed, simTime } = get();
    if (speed === 0) return;
    set({ simTime: simTime + ms * speed });
  },
  cycleSpeed: () => {
    const i = SPEEDS.indexOf(get().speed);
    set({ speed: SPEEDS[(i + 1) % SPEEDS.length] ?? 1 });
  },
  setSpeed: (s) => set({ speed: s }),
  select: (id) =>
    set({
      selected: id,
      panel: id ? "planet" : get().panel === "planet" ? "none" : get().panel,
    }),
  setFollow: (id) => set({ follow: id }),
  setPanel: (p) => set({ panel: p }),
  toggleOrbits: () => set({ showOrbits: !get().showOrbits }),
  toggleLabels: () => set({ showLabels: !get().showLabels }),
  toggleMuted: () => set({ muted: !get().muted }),
  completeOnboarding: () => {
    try {
      window.localStorage.setItem("aetherion-onboarded", "1");
    } catch {
      /* ignore */
    }
    set({ onboarded: true, muted: false });
  },
}));

export const SPEED_LABEL: Record<SpeedId, string> = {
  0: "Paused",
  1: "Realtime",
  24: "Day / sec",
  168: "Week / sec",
  720: "Month / sec",
  8760: "Year / sec",
};
