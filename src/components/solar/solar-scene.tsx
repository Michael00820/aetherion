import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { createContext, useContext, useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ORBITING, PLANETS, getPlanet, type PlanetDef } from "@/lib/planets";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { PlanetMesh, displayRadius } from "./planet-mesh";

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
  const timeRef = useSimTime();
  const focused = useAppStore((s) => s.focusedPlanet);
  const setFocused = useAppStore((s) => s.setFocusedPlanet);
  const paused = useAppStore((s) => s.paused);
  const speed = useAppStore((s) => s.speed);
  const radius = displayRadius(def);
  const selected = focused === def.id;

  useFrame(() => {
    const time = timeRef.current;
    if (!group.current) return;
    if (def.id === "moon" && parentRef) {
      const a = simAngle(time, def.period);
      const p = parentRef.current;
      group.current.position.set(p.x + Math.cos(a) * def.orbit, 0.18, p.z + Math.sin(a) * def.orbit);
    } else if (def.orbit > 0) {
      const a = simAngle(time, def.period);
      group.current.position.set(Math.cos(a) * def.orbit, 0, Math.sin(a) * def.orbit);
    }
  });

  return (
    <group
      ref={group}
      name={def.id}
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
      <PlanetMesh def={def} radius={radius} paused={paused} speed={speed} />
      {selected ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 1.5, 24]} />
          <meshBasicMaterial color={def.color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
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
          <ringGeometry args={[p.orbit - 0.02, p.orbit + 0.02, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.26} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function CameraRig({
  controlsRef,
  followRef,
}: {
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
  followRef: MutableRefObject<boolean>;
}) {
  const focused = useAppStore((s) => s.focusedPlanet);
  const { camera, scene } = useThree();
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  useFrame((_, rawDelta) => {
    if (!focused || !followRef.current) return;
    const d = Math.min(rawDelta, 0.1);
    const k = 1 - Math.exp(-2.1 * d);
    const obj = scene.getObjectByName(focused);
    if (!obj) return;
    obj.getWorldPosition(target.current);
    const def = PLANETS.find((p) => p.id === focused);
    const rad = def ? displayRadius(def) : 1;
    const dist = rad * 5.4 + 2.6;
    desired.current.set(
      target.current.x + dist * 0.75,
      target.current.y + dist * 0.38,
      target.current.z + dist * 0.95,
    );
    camera.position.lerp(desired.current, k);
    const controls = controlsRef.current;
    if (controls) controls.target.lerp(target.current, k);
    else camera.lookAt(target.current);
    if (camera.position.distanceTo(desired.current) < 0.08) followRef.current = false;
  });
  return null;
}

function SimulationClock({ timeRef }: { timeRef: MutableRefObject<number> }) {
  const paused = useAppStore((s) => s.paused);
  const speed = useAppStore((s) => s.speed);
  useFrame((_, raw) => {
    const d = Math.min(raw, 0.1);
    if (!paused) timeRef.current += (d * Math.min(speed, 24)) / YEAR_SECONDS;
  });
  return null;
}

function SceneContent() {
  const timeRef = useRef(0);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const followRef = useRef(true);
  const focused = useAppStore((s) => s.focusedPlanet);
  const theme = useTheme();
  const sunColor = theme.resolved === "gold" ? "#ffd27a" : "#e8eef8";
  const sun = getPlanet("sun");

  useEffect(() => {
    followRef.current = Boolean(focused);
  }, [focused]);

  return (
    <TimeCtx.Provider value={timeRef}>
      <color attach="background" args={[theme.resolved === "gold" ? "#0c0906" : "#05060a"]} />
      <ambientLight intensity={0.32} />
      <pointLight position={[0, 0, 0]} intensity={2.4} distance={70} decay={2} color={sunColor} />
      <Stars radius={90} depth={40} count={420} factor={2.2} saturation={0} fade={false} speed={0} />
      <SimulationClock timeRef={timeRef} />
      <PlanetBody def={sun} />
      {ORBITING.filter((p) => p.id !== "earth").map((p) => (
        <PlanetBody key={p.id} def={p} />
      ))}
      <EarthWithMoon />
      <OrbitRings />
      <CameraRig controlsRef={controlsRef} followRef={followRef} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        screenSpacePanning
        panSpeed={0.85}
        minDistance={2.2}
        maxDistance={110}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI * 0.49}
        minPolarAngle={0.08}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
        onStart={() => {
          followRef.current = false;
        }}
      />
    </TimeCtx.Provider>
  );
}

export function SolarScene() {
  const panel = useAppStore((s) => s.panel);
  return (
    <Canvas
      camera={{ position: [0, 14, 36], fov: 46, near: 0.1, far: 200 }}
      dpr={1}
      frameloop={panel === "orbits" ? "always" : "never"}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "default" }}
      onPointerMissed={() => useAppStore.getState().setFocusedPlanet(null)}
      style={{ touchAction: "none" }}
    >
      <SceneContent />
    </Canvas>
  );
}
