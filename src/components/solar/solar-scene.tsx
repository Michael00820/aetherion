import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { createContext, useContext, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { ORBITING, PLANETS, getPlanet, type PlanetDef } from "@/lib/planets";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { makePlanetTexture, makeRingTexture } from "./textures";

const YEAR_SECONDS = 48;

const TimeCtx = createContext<MutableRefObject<number> | null>(null);
function useSimTime() {
  const ref = useContext(TimeCtx);
  if (!ref) throw new Error("sim time");
  return ref;
}

function simAngle(timeYears: number, period: number): number {
  if (period <= 0) return 0;
  return (timeYears / period) * Math.PI * 2;
}

function PlanetBody({ def, parentRef }: { def: PlanetDef; parentRef?: MutableRefObject<THREE.Vector3> }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const timeRef = useSimTime();
  const focused = useAppStore((s) => s.focusedPlanet);
  const setFocused = useAppStore((s) => s.setFocusedPlanet);
  const showLabels = useAppStore((s) => s.showLabels);
  const texture = useMemo(() => makePlanetTexture(def.id), [def.id]);
  const ringTex = useMemo(() => (def.rings ? makeRingTexture() : null), [def.rings]);

  useEffect(() => {
    return () => {
      texture.dispose();
      ringTex?.dispose();
    };
  }, [texture, ringTex]);

  useFrame(() => {
    const time = timeRef.current;
    if (!group.current) return;
    if (def.id === "moon" && parentRef) {
      const a = simAngle(time, def.period);
      const p = parentRef.current;
      group.current.position.set(p.x + Math.cos(a) * def.orbit, 0.12, p.z + Math.sin(a) * def.orbit);
    } else if (def.orbit > 0) {
      const a = simAngle(time, def.period);
      group.current.position.set(Math.cos(a) * def.orbit, 0, Math.sin(a) * def.orbit);
    }
    if (mesh.current && def.day !== 0) {
      mesh.current.rotation.y = ((time * 365) / Math.abs(def.day)) * Math.PI * 2 * Math.sign(def.day);
    }
  });

  const selected = focused === def.id;
  const isSun = def.id === "sun";

  return (
    <group ref={group} name={def.id}>
      <mesh
        ref={mesh}
        rotation={[0, 0, (def.tilt * Math.PI) / 180]}
        onClick={(e) => {
          e.stopPropagation();
          setFocused(def.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[def.size, 48, 32]} />
        {isSun ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial
            map={texture}
            roughness={0.72}
            metalness={0.08}
            emissive={selected ? def.color : "#000000"}
            emissiveIntensity={selected ? 0.18 : 0}
          />
        )}
      </mesh>
      {isSun ? (
        <mesh scale={1.18}>
          <sphereGeometry args={[def.size, 24, 16]} />
          <meshBasicMaterial color={def.emissive ?? def.color} transparent opacity={0.14} />
        </mesh>
      ) : null}
      {def.rings && ringTex ? (
        <mesh rotation={[Math.PI / 2.15, 0, 0.35]}>
          <ringGeometry args={[def.size * 1.35, def.size * 2.15, 96]} />
          <meshStandardMaterial
            map={ringTex}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            roughness={0.8}
            metalness={0.15}
          />
        </mesh>
      ) : null}
      {showLabels ? (
        <Html center sprite distanceFactor={def.id === "sun" ? 22 : 16} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] tracking-wide ${
              selected ? "bg-accent text-accent-fg" : "bg-bg/80 text-fg"
            }`}
          >
            {def.name}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function EarthWithMoon() {
  const earth = getPlanet("earth");
  const moon = getPlanet("moon");
  const timeRef = useSimTime();
  const earthPos = useRef(new THREE.Vector3());
  useFrame(() => {
    const a = simAngle(timeRef.current, earth.period);
    earthPos.current.set(Math.cos(a) * earth.orbit, 0, Math.sin(a) * earth.orbit);
  });
  return (
    <>
      <PlanetBody def={earth} />
      <PlanetBody def={moon} parentRef={earthPos} />
    </>
  );
}

function OrbitRings() {
  const show = useAppStore((s) => s.showTrails);
  const theme = useTheme();
  const color = theme.resolved === "gold" ? "#c9a227" : "#c5cdd8";
  if (!show) return null;
  return (
    <>
      {ORBITING.map((p) => (
        <mesh key={p.id} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[p.orbit - 0.012, p.orbit + 0.012, 160]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function CameraRig() {
  const focused = useAppStore((s) => s.focusedPlanet);
  const { camera, scene } = useThree();
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  useFrame((state, rawDelta) => {
    const d = Math.min(rawDelta, 0.1);
    const k = 1 - Math.exp(-2.4 * d);
    const controls = state.controls as unknown as { target: THREE.Vector3 } | undefined;
    if (!focused) return;
    const obj = scene.getObjectByName(focused);
    if (!obj) return;
    obj.getWorldPosition(target.current);
    const def = PLANETS.find((p) => p.id === focused);
    const dist = (def?.size ?? 1) * 6 + 3.2;
    desired.current.set(
      target.current.x + dist * 0.7,
      target.current.y + dist * 0.45,
      target.current.z + dist * 0.9,
    );
    camera.position.lerp(desired.current, k);
    if (controls) controls.target.lerp(target.current, k);
    else camera.lookAt(target.current);
  });
  return null;
}

function SimulationClock({ timeRef }: { timeRef: MutableRefObject<number> }) {
  const paused = useAppStore((s) => s.paused);
  const speed = useAppStore((s) => s.speed);
  useFrame((_, raw) => {
    const d = Math.min(raw, 0.1);
    if (!paused) timeRef.current += (d * speed) / YEAR_SECONDS;
  });
  return null;
}

function SceneContent() {
  const timeRef = useRef(0);
  const theme = useTheme();
  const sunColor = theme.resolved === "gold" ? "#ffd27a" : "#e8eef8";
  const amb = theme.resolved === "gold" ? 0.22 : 0.16;
  const sun = getPlanet("sun");

  return (
    <TimeCtx.Provider value={timeRef}>
      <color attach="background" args={[theme.resolved === "gold" ? "#0c0906" : "#07080c"]} />
      <ambientLight intensity={amb} />
      <hemisphereLight args={[sunColor, "#1a1410", 0.35]} />
      <pointLight position={[0, 0, 0]} intensity={2.4} distance={80} decay={2} color={sunColor} />
      <Stars radius={140} depth={60} count={1800} factor={2.6} saturation={0} fade speed={0.35} />
      <SimulationClock timeRef={timeRef} />
      <PlanetBody def={sun} />
      {ORBITING.filter((p) => p.id !== "earth").map((p) => (
        <PlanetBody key={p.id} def={p} />
      ))}
      <EarthWithMoon />
      <OrbitRings />
      <CameraRig />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={4}
        maxDistance={90}
        enableDamping
        dampingFactor={0.08}
      />
    </TimeCtx.Provider>
  );
}

export function SolarScene() {
  return (
    <Canvas
      camera={{ position: [0, 16, 44], fov: 48, near: 0.1, far: 250 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onPointerMissed={() => useAppStore.getState().setFocusedPlanet(null)}
      style={{ touchAction: "none" }}
    >
      <SceneContent />
    </Canvas>
  );
}
