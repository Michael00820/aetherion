import { Pause, Play, RotateCcw, Tag, Waypoints } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { PLANETS } from "@/lib/planets";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlanetDef } from "@/lib/planets";

type InspectProps = { planet: PlanetDef; onClose: () => void };

export function OrbitsPanel() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  const [Inspect, setInspect] = useState<ComponentType<InspectProps> | null>(null);
  const [failed, setFailed] = useState(false);
  const paused = useAppStore((s) => s.paused);
  const togglePaused = useAppStore((s) => s.togglePaused);
  const speed = useAppStore((s) => s.speed);
  const setSpeed = useAppStore((s) => s.setSpeed);
  const focused = useAppStore((s) => s.focusedPlanet);
  const setFocused = useAppStore((s) => s.setFocusedPlanet);
  const showLabels = useAppStore((s) => s.showLabels);
  const setShowLabels = useAppStore((s) => s.setShowLabels);
  const showTrails = useAppStore((s) => s.showTrails);
  const setShowTrails = useAppStore((s) => s.setShowTrails);

  useEffect(() => {
    let live = true;
    const start = window.setTimeout(() => {
      void import("./solar-scene")
        .then((m) => {
          if (live) setScene(() => m.SolarScene);
        })
        .catch(() => {
          if (live) setFailed(true);
        });
    }, 40);
    return () => {
      live = false;
      window.clearTimeout(start);
    };
  }, []);

  useEffect(() => {
    if (!focused || Inspect) return;
    void import("./planet-inspect").then((m) => setInspect(() => m.PlanetInspect));
  }, [focused, Inspect]);

  const planet = PLANETS.find((p) => p.id === focused) ?? null;

  return (
    <div className="orbit-stage flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl bg-bg">
        <div className="absolute inset-0">
          {Scene ? (
            <Scene />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-muted">
              <span className="size-8 animate-pulse rounded-full bg-accent/40" />
              <p>{failed ? "The heavens could not open on this device." : "Opening the heavens…"}</p>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap items-start justify-between gap-2 sm:inset-x-4">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-xl bg-bg/80 p-2 shadow-[var(--shadow-border)] backdrop-blur-sm">
            <Button
              variant="subtle"
              size="icon-sm"
              aria-label={paused ? "Play" : "Pause"}
              onClick={togglePaused}
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </Button>
            <label className="flex items-center gap-2 px-1 text-xs text-muted">
              Speed
              <input
                className="speed-range w-24 sm:w-32"
                type="range"
                min={0}
                max={24}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
              <span className="w-10 tabular-nums text-fg">{speed.toFixed(1)}×</span>
            </label>
            <Button
              variant={showLabels ? "solid" : "ghost"}
              size="icon-sm"
              aria-label="Toggle labels"
              onClick={() => setShowLabels(!showLabels)}
            >
              <Tag className="size-4" />
            </Button>
            <Button
              variant={showTrails ? "solid" : "ghost"}
              size="icon-sm"
              aria-label="Toggle trails"
              onClick={() => setShowTrails(!showTrails)}
            >
              <Waypoints className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Reset camera"
              onClick={() => setFocused(null)}
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>

        {!planet ? (
          <p className="pointer-events-none absolute inset-x-3 top-16 z-10 text-center text-[11px] tracking-wide text-subtle sm:top-auto sm:bottom-20">
            Pinch to zoom · two fingers to pan · tap a world to pull it from the sky
          </p>
        ) : null}

        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 sm:inset-x-4">
          <div className="pointer-events-auto scroll-thin flex gap-2 overflow-x-auto rounded-xl bg-bg/80 p-2 shadow-[var(--shadow-border)] backdrop-blur-sm">
            {PLANETS.filter((p) => p.id !== "moon").map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFocused(p.id === focused ? null : p.id)}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm transition-[background-color,color] duration-150",
                  focused === p.id ? "bg-accent text-accent-fg" : "text-fg hover:bg-raised",
                )}
              >
                <span className="planet-chip" style={{ background: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {planet && Inspect ? <Inspect planet={planet} onClose={() => setFocused(null)} /> : null}
      </div>
    </div>
  );
}
