import { ChevronLeft, ChevronRight, LocateFixed } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPlanet } from "@/lib/planets";
import {
  DAY_RULERS,
  ethiopianWeekday,
  formatHourClock,
  hourProgress,
  hoursContaining,
  hoursForDate,
  rulerName,
} from "@/lib/planetary-hours";
import { dateToEthiopian, formatEthiopian, WEEKDAYS } from "@/lib/ethiopian-calendar";
import { detectHorizon, formatCoords } from "@/lib/geo";
import { PLACES, type Geo } from "@/lib/sun";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Scope = "day" | "month" | "year";

function formatRange(start: Date, end: Date, timeZone?: string): string {
  return `${formatHourClock(start, timeZone)} - ${formatHourClock(end, timeZone)}`;
}

function formatShort(d: Date, timeZone?: string): string {
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit", timeZone });
}

function shiftDate(d: Date, days: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

function sameHorizon(a: Geo, b: Geo): boolean {
  return Math.abs(a.lat - b.lat) < 1e-4 && Math.abs(a.lng - b.lng) < 1e-4;
}

export function PlanetaryHours() {
  const place = useAppStore((s) => s.place);
  const setPlace = useAppStore((s) => s.setPlace);
  const [scope, setScope] = useState<Scope>("day");
  const [now, setNow] = useState(() => new Date());
  const [live, setLive] = useState(true);
  const [cursor, setCursor] = useState(() => new Date());
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (place.source === "pin") return;
    let cancelled = false;
    setLocating(true);
    void detectHorizon().then((geo) => {
      if (cancelled) return;
      setPlace(geo);
      setLocating(false);
    });
    return () => {
      cancelled = true;
    };
  }, [place.source, setPlace]);

  const day = useMemo(
    () => (live ? hoursContaining(now, place) : hoursForDate(cursor, place, now)),
    [live, now, cursor, place],
  );
  const eth = dateToEthiopian(day.sunrise);
  const dayMin = Math.round(day.dayMinutes / 12);
  const nightMin = Math.round(day.nightMinutes / 12);

  function jump(days: number) {
    setLive(false);
    setCursor(shiftDate(live ? day.sunrise : cursor, days));
    setScope("day");
  }

  function jumpMonth(delta: number) {
    setLive(false);
    setCursor((d) => {
      const n = new Date(live ? day.sunrise : d);
      n.setMonth(n.getMonth() + delta);
      return n;
    });
  }

  function jumpYear(delta: number) {
    setLive(false);
    setCursor((d) => {
      const n = new Date(live ? day.sunrise : d);
      n.setFullYear(n.getFullYear() + delta);
      return n;
    });
  }

  function goLive() {
    setLive(true);
    setCursor(new Date());
    setScope("day");
  }

  async function useMySky() {
    setLocating(true);
    const geo = await detectHorizon();
    setPlace(geo);
    setLocating(false);
    goLive();
  }

  return (
    <div className="panel-enter mx-auto flex h-full min-h-0 w-full max-w-xl flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <header className="shrink-0 border-b border-border px-4 pt-4">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Planetary Hours</p>
        <h2 className="mt-1 font-display text-3xl">Saat</h2>
        <p className="mt-1 text-sm text-muted">
          {place.label} · {formatCoords(place)}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-subtle">
          Twelve unequal hours of day from this sunrise, twelve of night from sunset. Hour one is
          the planet of the weekday; then Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-raised px-3 text-sm"
            value={place.source === "geo" ? "geo" : PLACES.find((p) => sameHorizon(p, place))?.label ?? "custom"}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "geo") void useMySky();
              else {
                const next = PLACES.find((p) => p.label === v);
                if (next) setPlace({ ...next, source: "pin" });
              }
            }}
            aria-label="Horizon"
          >
            <option value="geo">Your horizon</option>
            {PLACES.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="nav-chip"
            onClick={() => void useMySky()}
            aria-label="Use my location"
            disabled={locating}
          >
            <LocateFixed className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-xs tabular-nums text-muted">
          Sunrise {formatHourClock(day.sunrise, place.timeZone)} · sunset{" "}
          {formatHourClock(day.sunset, place.timeZone)} · day {dayMin} min · night {nightMin} min
        </p>
        <p className="mt-1 text-xs text-subtle">{formatEthiopian(eth)}</p>
        <div className="mt-4 grid grid-cols-3 text-center text-xs uppercase tracking-[0.18em]">
          {(["day", "month", "year"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setScope(id)}
              className={cn(
                "h-10 border-b-2",
                scope === id ? "border-accent text-accent" : "border-transparent text-subtle",
              )}
            >
              {id}
            </button>
          ))}
        </div>
      </header>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        {scope === "day" ? <DayList day={day} now={now} timeZone={place.timeZone} /> : null}
        {scope === "month" ? (
          <MonthGrid cursor={live ? day.sunrise : cursor} onPick={(d) => { setLive(false); setCursor(d); setScope("day"); }} timeZone={place.timeZone} />
        ) : null}
        {scope === "year" ? (
          <YearGrid
            year={(live ? day.sunrise : cursor).getFullYear()}
            onPick={(d) => { setLive(false); setCursor(d); setScope("month"); }}
          />
        ) : null}
      </div>

      <footer className="grid shrink-0 grid-cols-[3rem_1fr_3rem] gap-2 border-t border-border p-3">
        <button
          type="button"
          className="nav-chip"
          aria-label="Previous"
          onClick={() => (scope === "day" ? jump(-1) : scope === "month" ? jumpMonth(-1) : jumpYear(-1))}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" className="nav-chip font-display text-lg" onClick={goLive}>
          {scope === "year"
            ? (live ? day.sunrise : cursor).getFullYear()
            : formatShort(live ? day.sunrise : cursor, place.timeZone)}
        </button>
        <button
          type="button"
          className="nav-chip"
          aria-label="Next"
          onClick={() => (scope === "day" ? jump(1) : scope === "month" ? jumpMonth(1) : jumpYear(1))}
        >
          <ChevronRight className="size-5" />
        </button>
      </footer>
    </div>
  );
}

function DayList({
  day,
  now,
  timeZone,
}: {
  day: ReturnType<typeof hoursForDate>;
  now: Date;
  timeZone?: string;
}) {
  const wd = ethiopianWeekday(day.weekday);
  useEffect(() => {
    document.querySelector(".hour-row.current")?.scrollIntoView({ block: "center", inline: "nearest" });
  }, [day.current?.index]);
  return (
    <div>
      <div className="flex items-baseline gap-3 px-4 py-3">
        <span className="font-display text-3xl leading-none text-accent">{rulerName(day.dayRuler).glyph}</span>
        <span className="text-lg text-muted">{wd.en}</span>
        <span className="text-sm text-subtle">{rulerName(day.dayRuler).en} opens the day</span>
      </div>
      {day.hours.map((h) => {
        const p = getPlanet(h.planet);
        const active = day.current?.index === h.index;
        const prog = active ? hourProgress(now, h) : null;
        return (
          <div key={h.index} className={cn("hour-row", !h.isDay && "night", active && "current")}>
            <span className="hour-num">{h.ordinal}</span>
            <span className="hour-glyph" aria-hidden="true">
              {p.glyph}
            </span>
            <span className="hour-name">{p.name}</span>
            <span className="hour-time">{formatRange(h.start, h.end, timeZone)}</span>
            {prog ? (
              <div className="hour-track">
                <span>{prog.elapsedMin} min.</span>
                <div className="hour-bar">
                  <i style={{ width: `${Math.round(prog.pct * 100)}%` }} />
                </div>
                <span>{Math.round(prog.pct * 100)}%</span>
                <span>{prog.remainMin} min.</span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function MonthGrid({
  cursor,
  onPick,
  timeZone,
}: {
  cursor: Date;
  onPick: (d: Date) => void;
  timeZone?: string;
}) {
  const year = Number(
    cursor.toLocaleDateString("en-US", { year: "numeric", timeZone }),
  );
  const month = Number(cursor.toLocaleDateString("en-US", { month: "numeric", timeZone })) - 1;
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startPad).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const today = new Date();

  return (
    <div className="p-4">
      <p className="mb-3 font-display text-2xl">
        {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone })}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-subtle">
        {WEEKDAYS.map((w) => (
          <div key={w.en}>{w.en.slice(0, 2)}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const date = new Date(year, month, d, 12, 0, 0);
          const ruler = DAY_RULERS[date.getDay()] ?? "sun";
          const p = getPlanet(ruler);
          const on =
            today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
          const selected = cursor.getDate() === d && cursor.getMonth() === month;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(date)}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center rounded-lg bg-raised py-1",
                selected && "ring-1 ring-accent",
                on && "bg-accent text-accent-fg",
              )}
            >
              <span className="text-xs">{d}</span>
              <span className="font-display text-lg leading-none">{p.glyph}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YearGrid({ year, onPick }: { year: number; onPick: (d: Date) => void }) {
  return (
    <div className="grid gap-2 p-4 sm:grid-cols-2">
      {Array.from({ length: 12 }, (_, m) => {
        const label = new Date(year, m, 1).toLocaleDateString("en-US", { month: "long" });
        return (
          <button
            key={m}
            type="button"
            onClick={() => onPick(new Date(year, m, 1, 12, 0, 0))}
            className="rounded-lg bg-raised p-3 text-left"
          >
            <p className="text-xs uppercase tracking-wider text-subtle">{label}</p>
            <div className="mt-2 flex justify-between font-display text-xl">
              {WEEKDAYS.map((w, i) => (
                <span key={w.en} title={w.en}>
                  {getPlanet(DAY_RULERS[i] ?? "sun").glyph}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
