import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  formatGregorian,
  formatGregorianShort,
  gregorianRangeForMonth,
  weekdayFromJdn,
} from "@/lib/ethiopian-calendar";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type DayPick = { year: number; month: number; day: number };

export function EthiopianCalendar() {
  const today = useMemo(() => new Date(), []);
  const nowEth = useMemo(() => dateToEthiopian(today), [today]);
  const storedYear = useAppStore((s) => s.calendarYear);
  const setCalendarYear = useAppStore((s) => s.setCalendarYear);
  const year = storedYear ?? nowEth.year;
  const [open, setOpen] = useState<DayPick | null>(null);

  const yearStart = ethiopianToGregorian(year, 1, 1);
  const yearEnd = ethiopianToGregorian(year, 13, daysInEthiopianMonth(year, 13));

  return (
    <div className="zemen-page panel-enter scroll-thin h-full min-h-0 overflow-y-auto">
      <div className="zemen-toolbar">
        <button type="button" className="zemen-nav" aria-label="Previous year" onClick={() => setCalendarYear(year - 1)}>
          <ChevronLeft className="size-4" />
        </button>
        <span className="zemen-year">{year} E.C.</span>
        <button type="button" className="zemen-nav" aria-label="Next year" onClick={() => setCalendarYear(year + 1)}>
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="zemen-title">
        <h1>Ethiopian Calendar</h1>
        <p>
          Year {year} E.C. · {formatGregorian(yearStart)} – {formatGregorian(yearEnd)}
        </p>
      </div>

      <div className="zemen-months">
        {MONTHS.map((month) => {
          const days = daysInEthiopianMonth(year, month.id);
          const range = gregorianRangeForMonth(year, month.id);
          const startWeekday = weekdayFromJdn(ethiopianToJdn(year, month.id, 1));
          return (
            <section key={month.id} className="zemen-month">
              <div className="zemen-month-head">
                <h2>
                  {month.name} <span className="zemen-geez">{month.amharic}</span>
                </h2>
                <p className="zemen-range">
                  {formatGregorianShort(range.start)}, {range.start.year} – {formatGregorianShort(range.end)}, {range.end.year}
                </p>
              </div>
              <div className="zemen-grid">
                {WEEKDAYS.map((w) => (
                  <div key={w.en} className="zemen-dow">
                    {w.en.slice(0, 3)}
                  </div>
                ))}
                {Array.from({ length: startWeekday }).map((_, i) => (
                  <div key={`pad-${month.id}-${i}`} className="zemen-cell blank" />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const isToday = year === nowEth.year && month.id === nowEth.month && day === nowEth.day;
                  const feast = feastsOn(month.id, day)[0];
                  const greg = ethiopianToGregorian(year, month.id, day);
                  return (
                    <button
                      key={day}
                      type="button"
                      className={cn("zemen-cell", isToday && "today", feast && "feast")}
                      onClick={() => setOpen({ year, month: month.id, day })}
                    >
                      <span className="eth-day">{day}</span>
                      <span className="greg-day">{formatGregorianShort(greg)}</span>
                      {feast ? <span className="feast-dot" /> : null}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="zemen-foot">
        Ethiopian New Year (Enkutatash) {year + 1} E.C. begins {formatGregorian(ethiopianToGregorian(year + 1, 1, 1))}.
        Ge'ez calendar — 13 months (12 × 30 days + Pagumē). Tap a day for its story.
      </p>

      {open ? <DaySheet pick={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function DaySheet({ pick, onClose }: { pick: DayPick; onClose: () => void }) {
  const month = MONTHS[pick.month - 1];
  const greg = ethiopianToGregorian(pick.year, pick.month, pick.day);
  const weekday = WEEKDAYS[weekdayFromJdn(ethiopianToJdn(pick.year, pick.month, pick.day))];
  const feasts = feastsOn(pick.month, pick.day);
  if (!month || !weekday) return null;

  return (
    <div className="zemen-sheet-back" onClick={onClose} role="presentation">
      <aside
        className="zemen-sheet"
        role="dialog"
        aria-label={formatEthiopian(pick)}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="zemen-sheet-close" onClick={onClose} aria-label="Close">
          <X className="size-5" />
        </button>
        <p className="zemen-geez">
          {month.amharic} {pick.day}
        </p>
        <h3>
          {month.name} {pick.day}, {pick.year}
        </h3>
        <p className="zemen-sheet-meta">
          {weekday.en} · {weekday.am} · ruled by {weekday.planet}
        </p>
        <p className="zemen-sheet-meta">Gregorian counterpart: {formatGregorian(greg)}</p>
        <p>
          {month.meaning}. Season: {month.seasonEn} ({month.seasonAm}).
        </p>
        {feasts.length ? (
          feasts.map((f) => (
            <p key={f.name} className="zemen-feast">
              {f.name} · <span className="zemen-geez">{f.amharic}</span>
              <br />
              {f.note}
            </p>
          ))
        ) : (
          <p className="zemen-sheet-meta">No fixed feast on this date. The hours of {weekday.planet} still open the day.</p>
        )}
      </aside>
    </div>
  );
}
