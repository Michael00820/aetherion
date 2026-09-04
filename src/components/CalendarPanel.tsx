import { X } from "lucide-react";
import {
  MONTHS,
  WEEKDAYS,
  currentFasts,
  dateToEthiopian,
  daysInMonth,
  ethiopianEaster,
  ethiopianToDate,
  formatGeezDate,
  goldenNumber,
  epact,
  isEthLeap,
  monthGrid,
  seasonFor,
  toGeezNumeral,
} from "@/lib/ethiopian";
import { useApp } from "@/lib/store";

export function CalendarPanel() {
  const simTime = useApp((s) => s.simTime);
  const setSimTime = useApp((s) => s.setSimTime);
  const setPanel = useApp((s) => s.setPanel);
  const date = new Date(simTime);
  const eth = dateToEthiopian(date);
  const cells = monthGrid(eth.year, eth.month);
  const easter = ethiopianEaster(eth.year);
  const fasts = currentFasts(eth, date);
  const season = seasonFor(eth.month);
  const month = MONTHS[eth.month - 1];

  return (
    <aside className="pointer-events-auto absolute top-24 right-3 left-3 max-h-[min(70vh,36rem)] overflow-auto rounded-[var(--radius-xl)] border border-border bg-ink-elevated/95 p-5 shadow-[var(--shadow-panel)] md:left-auto md:w-[26rem]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Bahire Hasab</p>
          <h2 className="font-display text-2xl">
            {month?.name} {eth.year}
          </h2>
          <p className="font-geez text-gold-soft">{month?.geez} {toGeezNumeral(eth.year)}</p>
        </div>
        <button type="button" aria-label="Close calendar" onClick={() => setPanel("none")} className="size-11 rounded-[var(--radius-md)] border border-border">
          <X className="mx-auto size-5" />
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          className="h-10 flex-1 rounded-[var(--radius-sm)] border border-border"
          onClick={() => {
            const month = eth.month === 1 ? 13 : eth.month - 1;
            const year = eth.month === 1 ? eth.year - 1 : eth.year;
            setSimTime(ethiopianToDate({ year, month, day: Math.min(eth.day, daysInMonth(year, month)) }).getTime());
          }}
        >
          Prev
        </button>
        <button
          type="button"
          className="h-10 flex-1 rounded-[var(--radius-sm)] border border-border"
          onClick={() => {
            const month = eth.month === 13 ? 1 : eth.month + 1;
            const year = eth.month === 13 ? eth.year + 1 : eth.year;
            setSimTime(ethiopianToDate({ year, month, day: Math.min(eth.day, daysInMonth(year, month)) }).getTime());
          }}
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] tracking-wider text-parchment-dim uppercase">
        {WEEKDAYS.map((d) => (
          <div key={d.en}>{d.en.slice(0, 2)}</div>
        ))}
        {cells.map((d, i) => {
          const on = d === eth.day;
          return (
            <button
              key={i}
              type="button"
              disabled={!d}
              onClick={() => d && setSimTime(ethiopianToDate({ year: eth.year, month: eth.month, day: d }).getTime())}
              className={
                "flex h-9 items-center justify-center rounded-[var(--radius-xs)] " +
                (on ? "bg-gold text-ink" : d ? "hover:bg-ink-soft" : "opacity-0")
              }
            >
              {d ?? ""}
            </button>
          );
        })}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[11px] tracking-widest text-parchment-dim uppercase">Season</dt>
          <dd>
            {season.name} <span className="font-geez text-gold-soft">{season.geez}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-widest text-parchment-dim uppercase">Leap</dt>
          <dd>{isEthLeap(eth.year) ? "Pagumen has six days" : "Common year"}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-widest text-parchment-dim uppercase">Golden no.</dt>
          <dd>{goldenNumber(eth.year)}</dd>
        </div>
        <div>
          <dt className="text-[11px] tracking-widest text-parchment-dim uppercase">Epact</dt>
          <dd>{epact(eth.year)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] tracking-widest text-parchment-dim uppercase">Fasika</dt>
          <dd>{formatGeezDate(easter)} · {MONTHS[easter.month - 1]?.name} {easter.day}</dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-1 text-sm">
        {fasts.map((f) => (
          <li key={f.id} className={f.active ? "text-gold-soft" : "text-parchment-dim"}>
            <span className="mr-2 inline-block size-1.5 rounded-full align-middle" style={{ background: f.active ? "var(--color-gold)" : "var(--color-border)" }} />
            {f.name} <span className="font-geez">{f.geez}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
