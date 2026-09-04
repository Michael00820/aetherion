import { Pause, Play, RotateCcw, Tag, Waypoints } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { PLANETS } from "@/lib/planets";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OrbitsPanel() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
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
    void import("./solar-scene").then((m) => {
      if (live) setScene(() => m.SolarScene);
    });
    return () => {
      live = false;
    };
  }, []);

  const planet = PLANETS.find((p) => p.id === focused) ?? null;

  return (
    <div className="relative flex h-full min-h-0 flex-1">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl bg-bg">
        {Scene ? (
          <Scene />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">Opening the heavens…</div>
        )}

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
                <span className="size-2 rounded-full" style={{ background: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside
        className={cn(
          "absolute inset-x-3 bottom-20 z-20 max-h-[46%] overflow-y-auto rounded-xl bg-surface/95 p-4 shadow-[var(--shadow-border)] backdrop-blur-sm transition-[opacity,transform] duration-200 ease-out scroll-thin sm:static sm:inset-auto sm:ml-3 sm:max-h-none sm:w-80 sm:self-stretch",
          planet
            ? "opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 translate-y-2 sm:pointer-events-auto sm:opacity-100 sm:translate-y-0",
        )}
      >
        {planet ? (
          <div>
            <p className="font-ethiopic text-sm text-muted">
              {planet.geez} · {planet.glyph}
            </p>
            <h2 className="mt-1 font-display text-3xl text-fg">{planet.name}</h2>
            <p className="mt-1 text-sm text-muted">{planet.type}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Info k="Distance" v={`${planet.distanceAU} AU`} />
              <Info k="Diameter" v={`${planet.diameterKm} km`} />
              <Info k="Day" v={planet.dayLength} />
              <Info k="Year" v={planet.yearLength} />
              <Info k="Metal" v={planet.hourMetal} />
              <Info k="Amharic" v={planet.amharic} ethiopic />
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-fg">{planet.summary}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{planet.ethiopian}</p>
          </div>
        ) : (
          <div className="hidden sm:block">
            <h2 className="font-display text-2xl">The wanderers</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Click a world to draw the camera in. Trails mark the compressed orbits. Speed is in Earth years
              — at 1×, our year takes under a minute.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

function Info({ k, v, ethiopic }: { k: string; v: string; ethiopic?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-subtle">{k}</dt>
      <dd className={cn("mt-0.5 text-fg", ethiopic && "font-ethiopic")}>{v}</dd>
    </div>
  );
}
