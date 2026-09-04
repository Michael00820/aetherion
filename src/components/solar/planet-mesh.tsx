import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { PlanetDef } from "@/lib/planets";
import { atmosphereColor, getPlanetTexture, getRingTexture } from "./textures";

export function displayRadius(def: PlanetDef): number {
  if (def.id === "sun") return def.size;
  if (def.id === "moon") return Math.max(def.size, 0.34);
  return Math.max(def.size, 0.52);
}

export function PlanetMesh({
  def,
  radius,
  inspect,
  paused = false,
  speed = 1,
}: {
  def: PlanetDef;
  radius: number;
  inspect?: boolean;
  paused?: boolean;
  speed?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => getPlanetTexture(def.id), [def.id]);
  const ringTex = useMemo(() => (def.rings ? getRingTexture() : null), [def.rings]);
  const atm = atmosphereColor(def.id);
  const isSun = def.id === "sun";
  const segments = inspect ? 64 : 32;

  useFrame((_, raw) => {
    const d = Math.min(raw, 0.05);
    const factor = inspect ? 1 : paused ? 0 : Math.min(speed, 8);
    if (mesh.current && def.day !== 0) {
      const spin = inspect ? 0.1 : 0.28;
      mesh.current.rotation.y +=
        (Math.PI * 2 * spin * d * factor * Math.sign(def.day)) / Math.max(0.2, Math.abs(def.day));
    }
  });

  return (
    <group rotation={[0, 0, (def.tilt * Math.PI) / 180]}>
      <mesh ref={mesh}>
        <sphereGeometry args={[radius, segments, Math.floor(segments * 0.65)]} />
        {isSun ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            map={texture}
            roughness={def.id === "jupiter" || def.id === "saturn" ? 0.45 : 0.8}
            metalness={0.04}
          />
        )}
      </mesh>

      {isSun ? (
        <>
          <mesh scale={1.22}>
            <sphereGeometry args={[radius, 24, 16]} />
            <meshBasicMaterial color={def.emissive ?? def.color} transparent opacity={0.18} depthWrite={false} />
          </mesh>
          <mesh scale={1.5}>
            <sphereGeometry args={[radius, 16, 12]} />
            <meshBasicMaterial color="#ffb347" transparent opacity={0.07} depthWrite={false} />
          </mesh>
        </>
      ) : null}

      {def.id === "earth" ? (
        <mesh scale={1.02}>
          <sphereGeometry args={[radius, 24, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.12} depthWrite={false} roughness={1} />
        </mesh>
      ) : null}

      {atm ? (
        <mesh scale={inspect ? 1.07 : 1.1}>
          <sphereGeometry args={[radius, 16, 12]} />
          <meshBasicMaterial color={atm} transparent opacity={0.16} side={THREE.BackSide} depthWrite={false} />
        </mesh>
      ) : null}

      {def.rings && ringTex ? (
        <mesh rotation={[Math.PI / 2.12, 0, 0.28]}>
          <ringGeometry args={[radius * 1.35, radius * 2.2, inspect ? 64 : 48]} />
          <meshStandardMaterial
            map={ringTex}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            roughness={0.75}
            metalness={0.1}
          />
        </mesh>
      ) : null}
    </group>
  );
}
