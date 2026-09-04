import { Capacitor } from "@capacitor/core";

export const isNative = Capacitor.isNativePlatform();

export async function bootNativeShell() {
  if (!isNative) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setBackgroundColor({ color: "#14110c" });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    /* web preview */
  }
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    /* web preview */
  }
}
