import { X } from "lucide-react";
import { dateToEthiopian, formatGeezDate } from "@/lib/ethiopian";
import { lectionFor } from "@/lib/scripture";
import { useApp } from "@/lib/store";

export function ScripturePanel() {
  const simTime = useApp((s) => s.simTime);
  const setPanel = useApp((s) => s.setPanel);
  const eth = dateToEthiopian(new Date(simTime));
  const lec = lectionFor(eth.month, eth.day);

  return (
    <aside className="pointer-events-auto absolute top-24 right-3 left-3 max-h-[min(70vh,36rem)] overflow-auto rounded-[var(--radius-xl)] border border-border bg-ink-elevated/95 p-5 shadow-[var(--shadow-panel)] md:left-auto md:w-[26rem]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-[11px] tracking-[0.3em] text-gold uppercase">Daily reading</p>
          <h2 className="font-display text-2xl">{lec.saint}</h2>
          <p className="font-geez text-gold-soft">{lec.saintGeez}</p>
        </div>
        <button type="button" aria-label="Close scripture" onClick={() => setPanel("none")} className="size-11 rounded-[var(--radius-md)] border border-border">
          <X className="mx-auto size-5" />
        </button>
      </div>
      <p className="text-xs text-parchment-dim">{formatGeezDate(eth)}</p>
      {lec.feast ? <p className="mt-2 text-sm text-gold">{lec.feast}</p> : null}
      <p className="mt-4 text-xs tracking-[0.2em] text-parchment-dim uppercase">
        {lec.reading.book} {lec.reading.ref} · {lec.reading.bookGeez}
      </p>
      <p className="mt-3 font-geez text-lg leading-relaxed text-parchment">{lec.reading.geez}</p>
      <p className="mt-3 text-sm leading-relaxed text-parchment-dim">{lec.reading.english}</p>
    </aside>
  );
}
