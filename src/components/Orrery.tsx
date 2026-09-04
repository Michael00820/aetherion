import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { PLANETS } from "@/lib/planet-data";
import { allPlanetStates, helioPosition, halleyPosition } from "@/lib/ephemeris";
import { useApp } from "@/lib/store";
import type { BodyId } from "@/lib/types";

function SimClock() {
  const advance = useApp((s) => s.advance);
  useFrame((_, delta) => {
    advance(Math.min(delta, 0.05) * 1000);
  });
  return null;
}

function FollowRig({
  target,
}: {
  target: React.RefObject<{ target: THREE.Vector3 } | null>;
}) {
  const follow = useApp((s) => s.follow);
  const simTime = useApp((s) => s.simTime);
  useFrame((_, delta) => {
    const controls = target.current;
    if (!follow || !controls) return;
    const p = helioPosition(follow, new Date(simTime));
    controls.target.lerp(new THREE.Vector3(p.x, p.y, p.z), 1 - Math.pow(0.001, delta));
  });
  return null;
}

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);
  return <Line points={points} color={color} transparent opacity={0.28} lineWidth={1} />;
}

function SaturnRings({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2.15, 0, 0.2]}>
      <ringGeometry args={[radius * 1.25, radius * 2.05, 64]} />
      <meshStandardMaterial
        color="#d9c48a"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
        metalness={0.2}
        roughness={0.55}
      />
    </mesh>
  );
}

function Planet({
  id,
  color,
  emissive,
  radius,
  position,
  label,
  geez,
  ring,
}: {
  id: BodyId;
  color: string;
  emissive: string;
  radius: number;
  position: [number, number, number];
  label: string;
  geez: string;
  ring?: boolean;
}) {
  const select = useApp((s) => s.select);
  const selected = useApp((s) => s.selected);
  const showLabels = useApp((s) => s.showLabels);
  const isSel = selected === id;
  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          select(id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isSel ? 0.55 : 0.18}
          roughness={0.55}
          metalness={0.12}
        />
      </mesh>
      {ring ? <SaturnRings radius={radius} /> : null}
      {isSel ? (
        <mesh>
          <ringGeometry args={[radius * 1.35, radius * 1.48, 48]} />
          <meshBasicMaterial color="#c9a227" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      ) : null}
      {showLabels ? (
        <Html center distanceFactor={18} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap text-center font-display text-parchment drop-shadow-[0_1px_4px_#000]">
            <div className="text-[11px] tracking-[0.18em] uppercase">{label}</div>
            <div className="font-geez text-[10px] text-gold-soft">{geez}</div>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Moons({ parentId, parentPos }: { parentId: BodyId; parentPos: [number, number, number] }) {
  const planet = PLANETS.find((p) => p.id === parentId);
  const simTime = useApp((s) => s.simTime);
  if (!planet?.moons) return null;
  const t = simTime / 86400000;
  return (
    <group position={parentPos}>
      {planet.moons.map((m) => {
        const a = (t / m.period) * Math.PI * 2;
        const x = Math.cos(a) * m.distance;
        const z = Math.sin(a) * m.distance;
        return (
          <mesh key={m.name} position={[x, 0.04, z]}>
            <sphereGeometry args={[m.radius, 12, 12]} />
            <meshStandardMaterial color="#cfc8b8" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function Sun() {
  const select = useApp((s) => s.select);
  const showLabels = useApp((s) => s.showLabels);
  return (
    <group>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          select("sun");
        }}
      >
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshBasicMaterial color="#ffd27a" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color="#ff9a3c" transparent opacity={0.18} />
      </mesh>
      <pointLight color="#ffd7a0" intensity={18} distance={80} />
      {showLabels ? (
        <Html center distanceFactor={22} position={[0, 1.9, 0]} style={{ pointerEvents: "none" }}>
          <div className="text-center font-display text-gold-soft">
            <div className="text-[11px] tracking-[0.22em] uppercase">Sun</div>
            <div className="font-geez text-[11px]">ጸሐይ</div>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function AsteroidBelt() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: 420 }, (_, i) => {
        const a = (i / 420) * Math.PI * 2 + (i % 7) * 0.17;
        const r = 9.6 + (i % 11) * 0.08 + ((i * 17) % 9) * 0.04;
        return { a, r, y: ((i * 13) % 7) * 0.02 - 0.06, s: 0.02 + (i % 5) * 0.006 };
      }),
    [],
  );
  useFrame(() => {
    if (!mesh.current) return;
    seeds.forEach((s, i) => {
      dummy.position.set(Math.cos(s.a) * s.r, s.y, Math.sin(s.a) * s.r);
      dummy.scale.setScalar(s.s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, seeds.length]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#8a7d68" roughness={1} />
    </instancedMesh>
  );
}

function Comet() {
  const simTime = useApp((s) => s.simTime);
  const p = halleyPosition(new Date(simTime));
  const dir = new THREE.Vector3(-p.x, -p.y, -p.z).normalize();
  return (
    <group position={[p.x, p.y, p.z]}>
      <mesh>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshBasicMaterial color="#f3e6c4" />
      </mesh>
      <mesh position={[dir.x * 0.6, dir.y * 0.6, dir.z * 0.6]}>
        <coneGeometry args={[0.05, 1.4, 8]} />
        <meshBasicMaterial color="#7eb8b8" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Planets() {
  const simTime = useApp((s) => s.simTime);
  const showOrbits = useApp((s) => s.showOrbits);
  const date = new Date(simTime);
  const states = allPlanetStates(date);
  return (
    <>
      {PLANETS.filter((p) => p.id !== "sun").map((planet) => {
        const st = states.find((s) => s.id === planet.id);
        if (!st) return null;
        const pos: [number, number, number] = [st.x, st.y, st.z];
        const orbitR = Math.hypot(st.x, st.z);
        return (
          <group key={planet.id}>
            {showOrbits ? <OrbitRing radius={orbitR || planet.visualAu} color={planet.color} /> : null}
            <Planet
              id={planet.id}
              color={planet.color}
              emissive={planet.emissive}
              radius={planet.radius}
              position={pos}
              label={planet.name}
              geez={planet.geez}
              ring={planet.id === "saturn"}
            />
            <Moons parentId={planet.id} parentPos={pos} />
          </group>
        );
      })}
    </>
  );
}

function Scene() {
  const controlsRef = useRef<{ target: THREE.Vector3 } | null>(null);
  return (
    <>
      <color attach="background" args={["#07060a"]} />
      <fog attach="fog" args={["#07060a", 28, 70]} />
      <ambientLight intensity={0.12} color="#cbbd96" />
      <Stars radius={80} depth={40} count={3500} factor={2.4} saturation={0} fade speed={0.3} />
      <SimClock />
      <FollowRig target={controlsRef} />
      <Sun />
      <Planets />
      <AsteroidBelt />
      <Comet />
      <OrbitControls
        ref={controlsRef as never}
        makeDefault
        enablePan={false}
        minDistance={4}
        maxDistance={48}
        maxPolarAngle={Math.PI * 0.82}
        minPolarAngle={Math.PI * 0.18}
      />
    </>
  );
}

export function Orrery() {
  return (
    <Canvas
      camera={{ position: [0, 9, 16], fov: 48, near: 0.1, far: 200 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onPointerMissed={() => useApp.getState().select(null)}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
