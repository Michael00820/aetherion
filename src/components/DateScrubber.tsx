import { ethiopianToDate, dateToEthiopian, MONTHS, daysInMonth } from "@/lib/ethiopian";
import { useApp } from "@/lib/store";

export function DateScrubber() {
  const simTime = useApp((s) => s.simTime);
  const setSimTime = useApp((s) => s.setSimTime);
  const eth = dateToEthiopian(new Date(simTime));

  function commit(next: { year?: number; month?: number; day?: number }) {
    const year = next.year ?? eth.year;
    const month = next.month ?? eth.month;
    const max = daysInMonth(year, month);
    const day = Math.min(next.day ?? eth.day, max);
    const d = ethiopianToDate({ year, month, day });
    const current = new Date(simTime);
    d.setHours(current.getHours(), current.getMinutes(), current.getSeconds(), current.getMilliseconds());
    setSimTime(d.getTime());
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-ink-elevated/85 p-3 shadow-[var(--shadow-panel)]">
      <p className="mb-2 font-display text-[11px] tracking-[0.28em] text-gold uppercase">Travel in time</p>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-[11px] text-parchment-dim">
          Year
          <input
            type="number"
            value={eth.year}
            onChange={(e) => commit({ year: Number(e.target.value) })}
            className="mt-1 h-10 w-full rounded-[var(--radius-sm)] border border-border bg-ink px-2 text-parchment"
          />
        </label>
        <label className="text-[11px] text-parchment-dim">
          Month
          <select
            value={eth.month}
            onChange={(e) => commit({ month: Number(e.target.value) })}
            className="mt-1 h-10 w-full rounded-[var(--radius-sm)] border border-border bg-ink px-2 text-parchment"
          >
            {MONTHS.map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[11px] text-parchment-dim">
          Day
          <input
            type="number"
            min={1}
            max={daysInMonth(eth.year, eth.month)}
            value={eth.day}
            onChange={(e) => commit({ day: Number(e.target.value) })}
            className="mt-1 h-10 w-full rounded-[var(--radius-sm)] border border-border bg-ink px-2 text-parchment"
          />
        </label>
      </div>
      <input
        type="range"
        min={1}
        max={daysInMonth(eth.year, eth.month)}
        value={eth.day}
        onChange={(e) => commit({ day: Number(e.target.value) })}
        className="mt-3 w-full accent-gold"
        aria-label="Day of Ethiopian month"
      />
    </div>
  );
}
