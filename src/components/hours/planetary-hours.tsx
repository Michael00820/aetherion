import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPlanet } from "@/lib/planets";
import {
  DAY_RULERS,
  ethiopianWeekday,
  hourProgress,
  hoursForDate,
  rulerName,
} from "@/lib/planetary-hours";
import { dateToEthiopian, formatEthiopian, WEEKDAYS } from "@/lib/ethiopian-calendar";
import { getSunTimes } from "@/lib/sun";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Scope = "day" | "month" | "year";

function formatRange(start: Date, end: Date): string {
  const opt: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  return `${start.toLocaleTimeString("en-US", opt)} - ${end.toLocaleTimeString("en-US", opt)}`;
}

function formatShort(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
}

function shiftDate(d: Date, days: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

function planetaryCursor(now: Date, lat: number, lng: number): Date {
  const { sunrise } = getSunTimes(now, lat, lng);
  if (now < sunrise) {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return y;
  }
  return now;
}

export function PlanetaryHours() {
  const place = useAppStore((s) => s.place);
  const [scope, setScope] = useState<Scope>("day");
  const [now, setNow] = useState(() => new Date());
  const [cursor, setCursor] = useState(() => planetaryCursor(new Date(), place.lat, place.lng));

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const day = useMemo(
    () => hoursForDate(cursor, place.lat, place.lng, now),
    [cursor, now, place.lat, place.lng],
  );
  const eth = dateToEthiopian(cursor);

  function jump(days: number) {
    setCursor((d) => shiftDate(d, days));
  }

  function jumpMonth(delta: number) {
    setCursor((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() + delta);
      return n;
    });
  }

  function jumpYear(delta: number) {
    setCursor((d) => {
      const n = new Date(d);
      n.setFullYear(n.getFullYear() + delta);
      return n;
    });
  }

  return (
    <div className="panel-enter mx-auto flex h-full min-h-0 w-full max-w-xl flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <header className="shrink-0 border-b border-border px-4 pt-4">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Planetary Hours</p>
        <h2 className="mt-1 font-display text-3xl">Saat</h2>
        <p className="mt-1 text-sm text-muted">
          {place.label} · {formatEthiopian(eth)}
        </p>
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
        {scope === "day" ? <DayList day={day} now={now} /> : null}
        {scope === "month" ? <MonthGrid cursor={cursor} onPick={setCursor} /> : null}
        {scope === "year" ? <YearGrid year={cursor.getFullYear()} onPick={setCursor} /> : null}
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
        <button type="button" className="nav-chip font-display text-lg" onClick={() => setCursor(new Date())}>
          {scope === "year" ? cursor.getFullYear() : formatShort(cursor)}
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
}: {
  day: ReturnType<typeof hoursForDate>;
  now: Date;
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
            <span className="hour-time">{formatRange(h.start, h.end)}</span>
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

function MonthGrid({ cursor, onPick }: { cursor: Date; onPick: (d: Date) => void }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startPad).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const today = new Date();

  return (
    <div className="p-4">
      <p className="mb-3 font-display text-2xl">
        {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-subtle">
        {WEEKDAYS.map((w) => (
          <div key={w.en}>{w.en.slice(0, 2)}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const date = new Date(year, month, d);
          const ruler = DAY_RULERS[date.getDay()] ?? "sun";
          const p = getPlanet(ruler);
          const on =
            today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
          const selected = cursor.getDate() === d;
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
            onClick={() => onPick(new Date(year, m, 1))}
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
