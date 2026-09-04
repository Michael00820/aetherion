import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aetherion.observatory",
  appName: "Aetherion",
  webDir: "dist-android",
  backgroundColor: "#14110c",
  android: {
    allowMixedContent: false,
    backgroundColor: "#14110c",
    webContentsDebuggingEnabled: false,
    path: "android",
    flavor: undefined,
  },
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1400,
      launchAutoHide: true,
      backgroundColor: "#14110c",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#14110c",
    },
  },
};

export default config;
