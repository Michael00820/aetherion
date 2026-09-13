import { useEffect, useState } from "react";
import { subscribeAdOverlay, type AdOverlay } from "@/lib/ads";

export function AdGate() {
  const [gate, setGate] = useState<AdOverlay>(null);
  useEffect(() => subscribeAdOverlay(setGate), []);
  if (!gate) return null;
  const label = gate.kind === "tab" ? "Opening the next room" : "Opening the next chapter";
  const hint = gate.kind === "chapter" ? "Short message" : "A word from our partners";
  return (
    <div className="ad-gate" role="dialog" aria-modal="true" aria-label={hint}>
      <div className="ad-gate-card">
        <p className="ad-gate-kicker">{hint}</p>
        <div className="ad-gate-orb" aria-hidden="true" />
        <p className="ad-gate-title">{label}</p>
        <p className="ad-gate-copy">
          The requested page opens when this moment ends.
        </p>
        <div className="ad-gate-track" aria-hidden="true">
          <span className="ad-gate-fill" style={{ animationDuration: `${gate.ms}ms` }} />
        </div>
      </div>
    </div>
  );
}
