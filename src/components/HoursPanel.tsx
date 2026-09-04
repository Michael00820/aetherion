import { X } from "lucide-react";
import { CANONICAL, currentHour, formatClock, seasonalHours, sunTimes } from "@/lib/hours";
import { useApp } from "@/lib/store";

export function HoursPanel() {
  const simTime = useApp((s) => s.simTime);
  const setPanel = useApp((s) => s.setPanel);
  const date = new Date(simTime);
  const hours = seasonalHours(date);
  const now = currentHour(date, hours);
  const sun = sunTimes(date);
  const dayLen = (sun.set.getTime() - sun.rise.getTime()) / 3600000;

  return (
    <aside className="pointer-events-auto absolute top-24 right-3 left-3 max-h-[min(70vh,36rem)] overflow-auto rounded-[var(--radius-xl)] border border-border bg-ink-elevated/95 p-5 shadow-[var(--shadow-panel)] md:left-auto md:w-[26rem]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Seasonal hours</p>
          <h2 className="font-display text-2xl">{now.label}</h2>
          <p className="font-geez text-gold-soft">{now.geez}</p>
        </div>
        <button type="button" aria-label="Close hours" onClick={() => setPanel("none")} className="size-11 rounded-[var(--radius-md)] border border-border">
          <X className="mx-auto size-5" />
        </button>
      </div>
      <p className="text-sm text-parchment-dim">
        Sunrise {formatClock(sun.rise)} · Noon {formatClock(sun.noon)} · Sunset {formatClock(sun.set)}
        <br />
        Day length {dayLen.toFixed(2)} hours at Addis Ababa
      </p>
      <div className="mt-4 grid grid-cols-2 gap-1">
        {hours.map((h) => {
          const on = h === now;
          return (
            <div
              key={`${h.kind}-${h.index}`}
              className={
                "rounded-[var(--radius-sm)] border px-2 py-2 text-xs " +
                (on ? "border-gold bg-gold/15 text-parchment" : "border-border text-parchment-dim")
              }
            >
              <div className="font-geez text-gold-soft">{h.geez}</div>
              <div>
                {formatClock(h.start)} – {formatClock(h.end)}
              </div>
            </div>
          );
        })}
      </div>
      <h3 className="mt-5 font-display text-lg">Canonical hours</h3>
      <ul className="mt-2 space-y-2 text-sm">
        {CANONICAL.map((c) => (
          <li key={c.id} className="flex justify-between gap-3 border-b border-border pb-2">
            <span>
              {c.name} <span className="font-geez text-gold-soft">{c.geez}</span>
              <span className="block text-xs text-parchment-dim">{c.note}</span>
            </span>
            <span className="text-parchment-dim">{c.kind}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
