import { CalendarDays, Clock3, BookOpen, Orbit, Tags, Volume2, VolumeX, Pause, Play } from "lucide-react";
import {
  dateToEthiopian,
  formatEthiopian,
  formatGeezDate,
  MONTHS,
  WEEKDAYS,
  weekdayIndex,
  seasonFor,
} from "@/lib/ethiopian";
import { SPEED_LABEL, useApp } from "@/lib/store";
import { CalendarPanel } from "./CalendarPanel";
import { HoursPanel } from "./HoursPanel";
import { ScripturePanel } from "./ScripturePanel";
import { PlanetPanel } from "./PlanetPanel";
import { DateScrubber } from "./DateScrubber";

function Chip({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={
        "flex size-11 items-center justify-center rounded-[var(--radius-md)] border transition-colors duration-[var(--motion-quick)] " +
        (active
          ? "border-gold bg-gold text-ink"
          : "border-border bg-ink-elevated/80 text-parchment-dim hover:border-border-strong hover:text-parchment")
      }
    >
      {children}
    </button>
  );
}

export function HUD() {
  const simTime = useApp((s) => s.simTime);
  const speed = useApp((s) => s.speed);
  const panel = useApp((s) => s.panel);
  const setPanel = useApp((s) => s.setPanel);
  const cycleSpeed = useApp((s) => s.cycleSpeed);
  const setSpeed = useApp((s) => s.setSpeed);
  const showOrbits = useApp((s) => s.showOrbits);
  const showLabels = useApp((s) => s.showLabels);
  const muted = useApp((s) => s.muted);
  const toggleOrbits = useApp((s) => s.toggleOrbits);
  const toggleLabels = useApp((s) => s.toggleLabels);
  const toggleMuted = useApp((s) => s.toggleMuted);

  const date = new Date(simTime);
  const eth = dateToEthiopian(date);
  const month = MONTHS[eth.month - 1];
  const wd = WEEKDAYS[weekdayIndex(date)];
  const season = seasonFor(eth.month);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-parchment">
      <header className="pointer-events-auto absolute top-0 left-0 right-0 flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div>
          <p className="font-display text-[11px] tracking-[0.42em] text-gold uppercase">Aetherion</p>
          <h1 className="font-display text-2xl leading-tight text-parchment md:text-3xl">
            {month?.name} {eth.day}
          </h1>
          <p className="font-geez text-sm text-gold-soft">{formatGeezDate(eth)}</p>
          <p className="mt-1 text-xs text-parchment-dim">
            {wd?.en} · {season.name} · {date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Chip label="Calendar" active={panel === "calendar"} onClick={() => setPanel(panel === "calendar" ? "none" : "calendar")}>
            <CalendarDays className="size-5" />
          </Chip>
          <Chip label="Hours" active={panel === "hours"} onClick={() => setPanel(panel === "hours" ? "none" : "hours")}>
            <Clock3 className="size-5" />
          </Chip>
          <Chip label="Scripture" active={panel === "scripture"} onClick={() => setPanel(panel === "scripture" ? "none" : "scripture")}>
            <BookOpen className="size-5" />
          </Chip>
        </div>
      </header>

      <div className="pointer-events-auto absolute top-28 right-4 hidden w-11 flex-col gap-2 md:flex">
        <Chip label="Toggle orbits" active={showOrbits} onClick={toggleOrbits}>
          <Orbit className="size-5" />
        </Chip>
        <Chip label="Toggle labels" active={showLabels} onClick={toggleLabels}>
          <Tags className="size-5" />
        </Chip>
        <Chip label={muted ? "Unmute" : "Mute"} active={!muted} onClick={toggleMuted}>
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </Chip>
      </div>

      <div className="pointer-events-auto absolute bottom-28 left-4 right-4 md:bottom-8 md:left-4 md:right-auto md:w-[22rem]">
        <button
          type="button"
          onClick={cycleSpeed}
          className="mb-3 flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-ink-elevated/85 px-3 py-2 text-left"
        >
          {speed === 0 ? <Pause className="size-4 text-gold" /> : <Play className="size-4 text-gold" />}
          <span className="font-display text-sm tracking-wide">{SPEED_LABEL[speed]}</span>
        </button>
        <DateScrubber />
        <div className="mt-2 flex gap-1 md:hidden">
          <Chip label="Pause or play" onClick={() => setSpeed(speed === 0 ? 1 : 0)}>
            {speed === 0 ? <Play className="size-5" /> : <Pause className="size-5" />}
          </Chip>
          <Chip label="Toggle orbits" active={showOrbits} onClick={toggleOrbits}>
            <Orbit className="size-5" />
          </Chip>
          <Chip label="Toggle labels" active={showLabels} onClick={toggleLabels}>
            <Tags className="size-5" />
          </Chip>
          <Chip label={muted ? "Unmute" : "Mute"} active={!muted} onClick={toggleMuted}>
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </Chip>
        </div>
      </div>

      {panel === "calendar" ? <CalendarPanel /> : null}
      {panel === "hours" ? <HoursPanel /> : null}
      {panel === "scripture" ? <ScripturePanel /> : null}
      {panel === "planet" ? <PlanetPanel /> : null}

      <p className="sr-only">{formatEthiopian(eth)}</p>
    </div>
  );
}
