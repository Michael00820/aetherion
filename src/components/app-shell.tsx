import { BookOpen, CalendarDays, Clock3, Moon, Orbit, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { dateToEthiopian, formatEthiopian, formatEthiopianTime, MONTHS } from "@/lib/ethiopian-calendar";
import { useAppStore, type PanelId } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { OrbitsPanel } from "@/components/solar/orbits-panel";
import { EthiopianCalendar } from "@/components/calendar/ethiopian-calendar";
import { PlanetaryHours } from "@/components/hours/planetary-hours";
import { ScriptureReader } from "@/components/bible/scripture-reader";
import { Button } from "@/components/ui/button";

const NAV: { id: PanelId; label: string; am: string; icon: typeof Orbit }[] = [
  { id: "orbits", label: "Orbits", am: "ዑደት", icon: Orbit },
  { id: "zemen", label: "Zemen", am: "ዘመን", icon: CalendarDays },
  { id: "hours", label: "Hours", am: "ሰዓት", icon: Clock3 },
  { id: "scripture", label: "Scripture", am: "መጽሐፍ", icon: BookOpen },
];

export function AppShell() {
  const panel = useAppStore((s) => s.panel);
  const setPanel = useAppStore((s) => s.setPanel);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const { resolved } = useTheme();
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const eth = dateToEthiopian(clock);
  const month = MONTHS[eth.month - 1];

  function cycleTheme() {
    const next = themeMode === "auto" ? "gold" : themeMode === "gold" ? "silver" : "auto";
    setThemeMode(next);
  }

  return (
    <div className="starfield flex min-h-dvh flex-col text-fg">
      <header className="flex items-center gap-3 border-b border-border px-3 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Sigil gold={resolved === "gold"} />
          <div className="min-w-0">
            <p className="font-display text-xl leading-none tracking-tight sm:text-2xl">Aetherion</p>
            <p className="mt-0.5 truncate text-[11px] uppercase tracking-[0.16em] text-subtle">
              Observatory of time
            </p>
          </div>
        </div>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPanel(item.id)}
              className={cn(
                "flex h-11 items-center gap-2 rounded-lg px-3 text-sm transition-colors duration-150",
                panel === item.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-raised hover:text-fg",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <div className="hidden text-right sm:block">
            <p className="font-ethiopic text-sm leading-none">{month?.amharic} {eth.day}</p>
            <p className="mt-1 text-[11px] tabular-nums text-subtle">
              {formatEthiopianTime(clock)} · {formatEthiopian(eth)}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={cycleTheme} aria-label="Cycle theme">
            {themeMode === "auto" ? (
              resolved === "gold" ? <Sun className="size-4" /> : <Moon className="size-4" />
            ) : themeMode === "gold" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col p-3 pb-[4.75rem] md:p-4 md:pb-4">
        <div className={cn("flex min-h-0 flex-1 flex-col", panel !== "orbits" && "overflow-hidden")}>
          {panel === "orbits" ? <OrbitsPanel /> : null}
          {panel === "zemen" ? <EthiopianCalendar /> : null}
          {panel === "hours" ? <PlanetaryHours /> : null}
          {panel === "scripture" ? <ScriptureReader /> : null}
        </div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-bg/95 px-2 py-1.5 backdrop-blur-sm md:hidden"
        style={{ paddingBottom: "max(0.4rem, env(safe-area-inset-bottom))" }}
        aria-label="Primary mobile"
      >
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPanel(item.id)}
            className={cn(
              "flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px]",
              panel === item.id ? "text-accent" : "text-muted",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Sigil({ gold }: { gold: boolean }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
      <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="18" cy="18" r="6" fill="currentColor" className={gold ? "text-accent" : "text-accent"} />
      <path
        d="M26 12a8 8 0 1 1-8 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="text-muted"
      />
    </svg>
  );
}
