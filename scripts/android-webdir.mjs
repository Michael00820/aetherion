#!/usr/bin/env node
/**
 * Normalize the Android web folder Capacitor copies into the APK.
 */
import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";

const dest = join(process.cwd(), "dist-android");
const named = join(dest, "index.android.html");
const index = join(dest, "index.html");
if (existsSync(named) && !existsSync(index)) {
  renameSync(named, index);
}
if (!existsSync(index)) {
  console.error("dist-android/index.html missing after Vite Android build");
  process.exit(1);
}
console.log("android webdir ready at dist-android/");
