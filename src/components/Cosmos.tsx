import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { HUD } from "./HUD";
import { Onboarding } from "./Onboarding";
import { setAmbienceMuted } from "@/lib/audio";
import { useApp } from "@/lib/store";

const Orrery = lazy(() => import("./Orrery").then((m) => ({ default: m.Orrery })));

class SceneGuard extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <p className="font-display text-2xl">The heavens could not be drawn</p>
            <p className="mt-2 text-sm text-parchment-dim">{this.state.error.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function CanvasGate() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return <div className="size-full bg-ink" aria-hidden="true" />;
  }
  return (
    <Suspense fallback={<div className="size-full bg-ink" aria-hidden="true" />}>
      <SceneGuard>
        <Orrery />
      </SceneGuard>
    </Suspense>
  );
}

export function Cosmos() {
  const onboarded = useApp((s) => s.onboarded);
  const muted = useApp((s) => s.muted);

  useEffect(() => {
    setAmbienceMuted(muted);
  }, [muted]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-ink">
      <CanvasGate />
      {onboarded ? <HUD /> : <Onboarding />}
    </div>
  );
}
