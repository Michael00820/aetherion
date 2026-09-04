import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAppStore } from "./store";
import { isDaytime } from "./sun";

export type ResolvedTheme = "gold" | "silver";

type ThemeContextValue = {
  resolved: ResolvedTheme;
  isAuto: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({ resolved: "gold", isAuto: true });

function resolveNow(
  mode: "auto" | "gold" | "silver",
  lat: number,
  lng: number,
  timeZone?: string,
): ResolvedTheme {
  if (mode === "gold" || mode === "silver") return mode;
  try {
    return isDaytime(new Date(), lat, lng, timeZone) ? "gold" : "silver";
  } catch {
    const h = new Date().getHours();
    return h >= 6 && h < 18 ? "gold" : "silver";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useAppStore((s) => s.themeMode);
  const place = useAppStore((s) => s.place);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveNow(mode, place.lat, place.lng, place.timeZone),
  );

  useEffect(() => {
    const apply = () => setResolved(resolveNow(mode, place.lat, place.lng, place.timeZone));
    apply();
    const id = window.setInterval(apply, 60_000);
    return () => window.clearInterval(id);
  }, [mode, place.lat, place.lng, place.timeZone]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    const color = resolved === "gold" ? "#14110c" : "#0c0e12";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", color);
  }, [resolved]);

  const value = useMemo(
    () => ({ resolved, isAuto: mode === "auto" }),
    [resolved, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
