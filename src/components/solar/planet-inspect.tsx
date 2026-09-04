import { Canvas } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import { X } from "lucide-react";
import type { PlanetDef } from "@/lib/planets";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { PlanetMesh } from "./planet-mesh";

function Globe({ def }: { def: PlanetDef }) {
  const theme = useTheme();
  const key = theme.resolved === "gold" ? "#ffd27a" : "#d7dde8";
  const radius = def.rings ? 1.15 : 1.45;
  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[4.2, 2.2, 3]} intensity={2.1} color={key} />
      <PresentationControls
        global
        cursor
        polar={[-0.45, 0.55]}
        azimuth={[-Infinity, Infinity]}
        damping={0.22}
        speed={1.15}
        snap={false}
      >
        <group position={[0, 0.1, 0]}>
          <PlanetMesh def={def} radius={radius} inspect />
        </group>
      </PresentationControls>
    </>
  );
}

export function PlanetInspect({
  planet,
  onClose,
}: {
  planet: PlanetDef;
  onClose: () => void;
}) {
  return (
    <div className="sky-inspect" role="dialog" aria-label={planet.name}>
      <button type="button" className="sky-inspect-close" onClick={onClose} aria-label="Close">
        <X className="size-5" />
      </button>
      <div className="sky-inspect-stage">
        <Canvas
          camera={{ position: [0, 0.2, 5.2], fov: 42 }}
          dpr={1}
          gl={{ antialias: false, alpha: true, stencil: false, powerPreference: "default" }}
        >
          <Globe def={planet} />
        </Canvas>
      </div>
      <div className="sky-glass">
        <p className="font-ethiopic text-sm text-muted">
          {planet.geez} · {planet.glyph}
        </p>
        <h2 className="mt-1 font-display text-4xl leading-none">{planet.name}</h2>
        <p className="mt-1 text-sm text-muted">{planet.type}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Info k="Distance" v={`${planet.distanceAU} AU`} />
          <Info k="Diameter" v={`${planet.diameterKm} km`} />
          <Info k="Day" v={planet.dayLength} />
          <Info k="Year" v={planet.yearLength} />
          <Info k="Metal" v={planet.hourMetal} />
          <Info k="Amharic" v={planet.amharic} ethiopic />
        </dl>
        <p className="mt-4 text-sm leading-relaxed">{planet.summary}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{planet.ethiopian}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="subtle" size="sm" onClick={onClose}>
            Return to the orrery
          </Button>
        </div>
      </div>
    </div>
  );
}

function Info({ k, v, ethiopic }: { k: string; v: string; ethiopic?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-subtle">{k}</dt>
      <dd className={`mt-0.5 ${ethiopic ? "font-ethiopic" : ""}`}>{v}</dd>
    </div>
  );
}
