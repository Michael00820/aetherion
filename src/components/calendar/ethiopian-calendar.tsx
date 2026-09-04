import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
  MONTHS,
  WEEKDAYS,
  dateToEthiopian,
  daysInEthiopianMonth,
  ethiopianToGregorian,
  ethiopianToJdn,
  feastsOn,
  formatEthiopian,
  formatEthiopianTime,
  formatGregorian,
  gregorianRangeForMonth,
  weekdayFromJdn,
} from "@/lib/ethiopian-calendar";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EthiopianCalendar() {
  const today = useMemo(() => new Date(), []);
  const nowEth = useMemo(() => dateToEthiopian(today), [today]);
  const storedYear = useAppStore((s) => s.calendarYear);
  const setCalendarYear = useAppStore((s) => s.setCalendarYear);
  const year = storedYear ?? nowEth.year;
  const [selected, setSelected] = useState({ year: nowEth.year, month: nowEth.month, day: nowEth.day });

  const selectedGreg = ethiopianToGregorian(selected.year, selected.month, selected.day);
  const selectedWeekday = weekdayFromJdn(ethiopianToJdn(selected.year, selected.month, selected.day));
  const weekday = WEEKDAYS[selectedWeekday];
  const selectedFeasts = feastsOn(selected.month, selected.day);
  const selectedMonth = MONTHS[selected.month - 1];

  return (
    <div className="panel-enter scroll-thin mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col gap-4 overflow-y-auto px-1 pb-8">
      <header className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Zemen — the era</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-4xl text-fg">{formatEthiopian(nowEth)}</h2>
            <p className="mt-1 font-ethiopic text-lg text-muted">{formatEthiopian(nowEth, "amharic")}</p>
            <p className="mt-1 text-sm text-muted">
              {formatGregorian({
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                day: today.getDate(),
              })}{" "}
              · Ethiopian clock {formatEthiopianTime(today)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Previous year" onClick={() => setCalendarYear(year - 1)}>
              <ChevronLeft className="size-5" />
            </Button>
            <span className="min-w-20 text-center font-display text-2xl tabular-nums">{year} AM</span>
            <Button variant="outline" size="icon" aria-label="Next year" onClick={() => setCalendarYear(year + 1)}>
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Twelve months of thirty days, then Pagume — five leftover days, six in a leap year. New Year,
          Enkutatash, falls on 11 September (12 September before a Gregorian leap year). The era runs seven
          or eight years behind the West because Ethiopia kept the old Alexandrian reckoning of the
          Annunciation.
        </p>
      </header>

      {selectedMonth ? (
        <section className="rounded-xl bg-raised p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs uppercase tracking-wider text-subtle">Selected day</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <h3 className="font-display text-2xl">
              {selectedMonth.name} {selected.day}
            </h3>
            <span className="font-ethiopic text-muted">
              {selectedMonth.amharic} · {weekday?.am} · {weekday?.en}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Gregorian counterpart: {formatGregorian(selectedGreg)} · ruled by {weekday?.planet}
          </p>
          <p className="mt-2 text-sm text-fg">
            {selectedMonth.meaning}. Season: {selectedMonth.seasonEn} ({selectedMonth.seasonAm}).
          </p>
          {selectedFeasts.map((f) => (
            <p key={f.name} className="mt-2 text-sm text-accent">
              {f.name} · <span className="font-ethiopic">{f.amharic}</span> — {f.note}
            </p>
          ))}
        </section>
      ) : null}

      <div className="flex flex-col gap-5">
        {MONTHS.map((month) => {
          const days = daysInEthiopianMonth(year, month.id);
          const range = gregorianRangeForMonth(year, month.id);
          const startWeekday = weekdayFromJdn(ethiopianToJdn(year, month.id, 1));
          return (
            <article key={month.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h3 className="font-display text-2xl">{month.name}</h3>
                  <p className="font-ethiopic text-muted">
                    {month.amharic} · {month.geez}
                  </p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>
                    {formatGregorian(range.start)} – {formatGregorian(range.end)}
                  </p>
                  <p>
                    {month.seasonEn} · {month.seasonAm}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-subtle">{month.meaning}</p>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-subtle">
                {WEEKDAYS.map((w) => (
                  <div key={w.en}>{w.en.slice(0, 2)}</div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {Array.from({ length: startWeekday }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const isToday = year === nowEth.year && month.id === nowEth.month && day === nowEth.day;
                  const isSel = year === selected.year && month.id === selected.month && day === selected.day;
                  const feast = feastsOn(month.id, day)[0];
                  const greg = ethiopianToGregorian(year, month.id, day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelected({ year, month: month.id, day })}
                      className={cn(
                        "flex min-h-11 flex-col items-center justify-center rounded-md px-0.5 py-1 text-sm transition-colors duration-150",
                        isSel && "bg-accent text-accent-fg",
                        !isSel && isToday && "ring-1 ring-ring",
                        !isSel && !isToday && "hover:bg-raised",
                      )}
                    >
                      <span className="tabular-nums">{day}</span>
                      <span className={cn("text-[10px] tabular-nums", isSel ? "text-accent-fg/70" : "text-subtle")}>
                        {greg.month}/{greg.day}
                      </span>
                      {feast ? <span className="sr-only">{feast.name}</span> : null}
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
