import { startAmbience } from "@/lib/audio";
import { useApp } from "@/lib/store";

export function Onboarding() {
  const complete = useApp((s) => s.completeOnboarding);
  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center bg-[radial-gradient(ellipse_at_center,transparent_0%,#07060a_72%)] p-6 pb-16">
      <div className="max-w-lg rounded-[var(--radius-xl)] border border-border bg-ink-elevated/92 p-8 text-center shadow-[var(--shadow-panel)]">
        <p className="font-display text-[11px] tracking-[0.5em] text-gold uppercase">Aetherion</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-parchment">A living orrery of the Ethiopian cosmos</h1>
        <p className="mt-4 font-geez text-gold-soft">ሰማያት ይነግሩ ስብሐተ እግዚአብሔር</p>
        <p className="mt-4 text-sm leading-relaxed text-parchment-dim">
          Thirteen months, twelve hours of day and twelve of night, the wanderers in their courses, and the day's reading from the synaxarium. Drag to look. Touch a planet. Open the calendar.
        </p>
        <button
          type="button"
          className="mt-8 h-12 w-full rounded-[var(--radius-md)] bg-gold font-display text-lg text-ink"
          onClick={() => {
            void startAmbience();
            complete();
          }}
        >
          Enter the cosmos
        </button>
      </div>
    </div>
  );
}
