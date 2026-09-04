import { X } from "lucide-react";
import { PLANET_BY_ID } from "@/lib/planet-data";
import { helioPosition, moonPhase } from "@/lib/ephemeris";
import { useApp } from "@/lib/store";

export function PlanetPanel() {
  const selected = useApp((s) => s.selected);
  const follow = useApp((s) => s.follow);
  const setFollow = useApp((s) => s.setFollow);
  const select = useApp((s) => s.select);
  const simTime = useApp((s) => s.simTime);
  if (!selected) return null;
  const info = PLANET_BY_ID[selected] ?? (selected === "moon"
    ? { id: "moon" as const, name: "Moon", geez: "ወርህ", color: "#cfc8b8", emissive: "#888", radius: 0.1, visualAu: 0, astronomy: "Moon", blurb: "The measurer of months. The Ethiopian calendar is lunisolar in feast, solar in count." }
    : selected === "halley"
      ? { id: "halley" as const, name: "Halley", geez: "ሐሌይ", color: "#f3e6c4", emissive: "#7eb8b8", radius: 0.08, visualAu: 0, astronomy: null, blurb: "A long-period visitor on a seventy-five year ellipse, drawn here from Kepler's law." }
      : null);
  if (!info) return null;
  const date = new Date(simTime);
  const pos = helioPosition(selected === "moon" ? "moon" : info.id, date);
  const phase = selected === "moon" || selected === "earth" ? moonPhase(date) : null;

  return (
    <aside className="pointer-events-auto absolute top-24 right-3 left-3 max-h-[min(70vh,28rem)] overflow-auto rounded-[var(--radius-xl)] border border-border bg-ink-elevated/95 p-5 shadow-[var(--shadow-panel)] md:left-auto md:w-[24rem]">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Wanderer</p>
          <h2 className="font-display text-2xl">{info.name}</h2>
          <p className="font-geez text-xl text-gold-soft">{info.geez}</p>
        </div>
        <button type="button" aria-label="Close planet" onClick={() => select(null)} className="size-11 rounded-[var(--radius-md)] border border-border">
          <X className="mx-auto size-5" />
        </button>
      </div>
      <p className="text-sm leading-relaxed text-parchment-dim">{info.blurb}</p>
      {info.id !== "sun" ? (
        <p className="mt-3 text-xs text-parchment-dim">Heliocentric distance {pos.distanceAu.toFixed(3)} AU</p>
      ) : null}
      {phase ? (
        <p className="mt-2 text-sm">
          Moon: {phase.name} · {Math.round(phase.illumination * 100)}% light
        </p>
      ) : null}
      {info.moons ? (
        <ul className="mt-3 text-sm text-parchment-dim">
          {info.moons.map((m) => (
            <li key={m.name}>
              {m.name} <span className="font-geez text-gold-soft">{m.geez}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        onClick={() => setFollow(follow === info.id ? null : info.id)}
        className="mt-4 h-11 w-full rounded-[var(--radius-md)] border border-gold text-gold"
      >
        {follow === info.id ? "Release camera" : "Follow this body"}
      </button>
    </aside>
  );
}
