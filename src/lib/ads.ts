import type { PluginListenerHandle } from "@capacitor/core";
import { isNative } from "@/lib/native";
import { useAppStore } from "@/lib/store";
import { ADMOB, AD_DURATION_MS } from "@/lib/ads-config";

export type AdKind = "tab" | "chapter";
export type AdOverlay = { kind: AdKind; ms: number } | null;

type Destination = () => void;

let overlay: AdOverlay = null;
const listeners = new Set<(value: AdOverlay) => void>();
let playing = false;
let destination: Destination | null = null;
let nativeReady = false;
let nativeBoot: Promise<void> | null = null;

export function subscribeAdOverlay(fn: (value: AdOverlay) => void) {
  listeners.add(fn);
  fn(overlay);
  return () => {
    listeners.delete(fn);
  };
}

function setOverlay(value: AdOverlay) {
  overlay = value;
  listeners.forEach((fn) => fn(value));
}

function unitFor(kind: AdKind) {
  return kind === "tab" ? ADMOB.tabInterstitial : ADMOB.chapterInterstitial;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function bootAds() {
  if (!isNative) return;
  if (!nativeBoot) nativeBoot = initNative().catch(() => undefined);
}

async function initNative() {
  const { AdMob, AdmobConsentStatus } = await import("@capacitor-community/admob");
  await AdMob.initialize({
    initializeForTesting: ADMOB.useTestAds,
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
  });
  try {
    const info = await AdMob.requestConsentInfo();
    if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
      await AdMob.showConsentForm();
    }
  } catch {
    /* regions without a UMP form */
  }
  nativeReady = true;
  void prepareNative("tab");
  void prepareNative("chapter");
}

async function prepareNative(kind: AdKind) {
  if (!isNative) return;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.prepareInterstitial({
      adId: unitFor(kind),
      isTesting: ADMOB.useTestAds,
      immersiveMode: true,
    });
  } catch {
    /* fill may miss; show path will skip */
  }
}

async function waitEvent(
  add: (fn: () => void) => Promise<PluginListenerHandle>,
  ms: number,
) {
  return new Promise<boolean>((resolve) => {
    let handle: PluginListenerHandle | undefined;
    const timer = window.setTimeout(() => {
      void handle?.remove();
      resolve(false);
    }, ms);
    void add(() => {
      window.clearTimeout(timer);
      void handle?.remove();
      resolve(true);
    }).then((h) => {
      handle = h;
    });
  });
}

async function playNative(kind: AdKind) {
  if (!nativeBoot) bootAds();
  await nativeBoot;
  if (!nativeReady) return;
  const { AdMob, InterstitialAdPluginEvents } = await import("@capacitor-community/admob");
  const adId = unitFor(kind);
  const prepared = await Promise.race([
    AdMob.prepareInterstitial({
      adId,
      isTesting: ADMOB.useTestAds,
      immersiveMode: true,
    }).then(() => true),
    sleep(2800).then(() => false),
  ]).catch(() => false);
  if (!prepared) return;

  const closed = waitEvent(
    (fn) => AdMob.addListener(InterstitialAdPluginEvents.Dismissed, fn),
    18000,
  );
  const failed = waitEvent(
    (fn) => AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => fn()),
    18000,
  );
  try {
    await AdMob.showInterstitial({ adId });
  } catch {
    return;
  }
  await Promise.race([closed, failed]);
  void prepareNative(kind === "tab" ? "chapter" : "tab");
  void prepareNative(kind);
}

async function playWeb(kind: AdKind) {
  const ms = AD_DURATION_MS[kind];
  setOverlay({ kind, ms });
  await sleep(ms);
  setOverlay(null);
}

async function play(kind: AdKind) {
  const wasPaused = useAppStore.getState().paused;
  useAppStore.getState().setPaused(true);
  try {
    if (isNative) {
      setOverlay({ kind, ms: 900 });
      await playNative(kind);
      setOverlay(null);
    } else {
      await playWeb(kind);
    }
  } catch {
    setOverlay(null);
  } finally {
    useAppStore.getState().setPaused(wasPaused);
  }
}

/** One ad at a time. Rapid taps keep the latest destination. */
export function afterAd(kind: AdKind, then: Destination) {
  destination = then;
  if (playing) return;
  playing = true;
  void play(kind).finally(() => {
    const go = destination;
    destination = null;
    playing = false;
    go?.();
  });
}
