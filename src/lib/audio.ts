let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: number | null = null;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.08;
  master.connect(ctx.destination);
  return ctx;
}

function drone(freq: number, type: OscillatorType, gain: number) {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = type;
  osc.frequency.value = freq;
  filter.type = "lowpass";
  filter.frequency.value = 680;
  g.gain.value = gain;
  osc.connect(filter);
  filter.connect(g);
  g.connect(master);
  osc.start();
}

export async function startAmbience() {
  const c = ensure();
  if (c.state === "suspended") await c.resume();
  if (timer != null) return;
  drone(55, "sine", 0.45);
  drone(82.5, "sine", 0.22);
  drone(165, "triangle", 0.06);
  const tick = () => {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880 + Math.random() * 420;
    g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.012, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
    osc.connect(g);
    g.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 2);
    timer = window.setTimeout(tick, 4000 + Math.random() * 5000);
  };
  timer = window.setTimeout(tick, 1200);
}

export function setAmbienceMuted(muted: boolean) {
  if (!master || !ctx) return;
  master.gain.linearRampToValueAtTime(muted ? 0.0001 : 0.08, ctx.currentTime + 0.4);
}

export function stopAmbience() {
  if (timer != null) window.clearTimeout(timer);
  timer = null;
  void ctx?.close();
  ctx = null;
  master = null;
}
