import * as THREE from "three";
import type { PlanetId } from "@/lib/planets";

function noise(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");
  return [c, ctx];
}

function tex(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

export function makePlanetTexture(id: PlanetId): THREE.CanvasTexture {
  if (id === "sun") return sunTex();
  if (id === "earth") return earthTex();
  if (id === "jupiter") return bandTex(["#c9a36a", "#a87840", "#e0c48a", "#8c5a32", "#d4b078"], 1.4);
  if (id === "saturn") return bandTex(["#d8cba0", "#c4b07c", "#eee4c4", "#bba66e"], 0.7);
  if (id === "mars") return dusty("#c45a32", "#8a3218", "#e08a5a");
  if (id === "mercury") return dusty("#b7b3aa", "#6e6a62", "#d4d0c8");
  if (id === "venus") return cloudy("#e6c48a", "#c9a66a");
  if (id === "neptune") return cloudy("#4a6d8c", "#2c4a66");
  if (id === "uranus") return cloudy("#9eb7b8", "#6e8c8e");
  return dusty("#d5d2c8", "#8a8680", "#f0ece4");
}

function sunTex(): THREE.CanvasTexture {
  const [c, ctx] = canvas(512, 512);
  const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  g.addColorStop(0, "#fff4c8");
  g.addColorStop(0.35, "#ffd56a");
  g.addColorStop(0.7, "#e89a32");
  g.addColorStop(1, "#a85a12");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = `rgba(255, 220, 140, ${0.04 + Math.random() * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, 4 + Math.random() * 10, 0, Math.PI * 2);
    ctx.fill();
  }
  return tex(c);
}

function earthTex(): THREE.CanvasTexture {
  const [c, ctx] = canvas(512, 256);
  ctx.fillStyle = "#1c3a68";
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = "#2e6a4a";
  for (let i = 0; i < 40; i++) {
    const x = noise(i, 2) * 512;
    const y = 40 + noise(i, 9) * 176;
    const w = 30 + noise(i, 4) * 90;
    const h = 16 + noise(i, 7) * 40;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, noise(i, 3) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(240,244,248,0.85)";
  ctx.fillRect(0, 0, 512, 18);
  ctx.fillRect(0, 238, 512, 18);
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.08 + noise(i, 1) * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(noise(i, 11) * 512, noise(i, 13) * 256, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return tex(c);
}

function bandTex(colors: string[], swirl: number): THREE.CanvasTexture {
  const [c, ctx] = canvas(512, 256);
  let y = 0;
  let i = 0;
  while (y < 256) {
    const h = 8 + noise(i, swirl) * 22;
    ctx.fillStyle = colors[i % colors.length] ?? colors[0] ?? "#888";
    ctx.fillRect(0, y, 512, h + 1);
    y += h;
    i++;
  }
  for (let k = 0; k < 200; k++) {
    ctx.fillStyle = `rgba(0,0,0,${0.04 + noise(k, 2) * 0.08})`;
    ctx.fillRect(noise(k, 5) * 512, noise(k, 8) * 256, 40, 3);
  }
  return tex(c);
}

function dusty(a: string, b: string, c2: string): THREE.CanvasTexture {
  const [c, ctx] = canvas(512, 256);
  ctx.fillStyle = a;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 1200; i++) {
    ctx.fillStyle = noise(i, 1) > 0.5 ? b : c2;
    ctx.globalAlpha = 0.15 + noise(i, 3) * 0.35;
    ctx.beginPath();
    ctx.arc(noise(i, 4) * 512, noise(i, 6) * 256, 1 + noise(i, 8) * 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return tex(c);
}

function cloudy(a: string, b: string): THREE.CanvasTexture {
  const [c, ctx] = canvas(512, 256);
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, b);
  g.addColorStop(0.5, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.04 + noise(i, 2) * 0.08})`;
    ctx.beginPath();
    ctx.ellipse(noise(i, 3) * 512, noise(i, 4) * 256, 50, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return tex(c);
}

export function makeRingTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(512, 64);
  for (let x = 0; x < 512; x++) {
    const t = x / 512;
    const a = t < 0.08 || t > 0.92 ? 0 : 0.35 + Math.sin(t * 40) * 0.15;
    const innerGap = t > 0.42 && t < 0.5 ? 0.05 : a;
    ctx.fillStyle = `rgba(220, 208, 170, ${innerGap})`;
    ctx.fillRect(x, 0, 1, 64);
  }
  const t = tex(c);
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}
