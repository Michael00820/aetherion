export type EthDate = {
  year: number;
  month: number;
  day: number;
};

export type BodyId =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "moon"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "halley";

export type PanelId = "none" | "calendar" | "hours" | "scripture" | "planet";

export type SpeedId = 0 | 1 | 24 | 168 | 720 | 8760;
