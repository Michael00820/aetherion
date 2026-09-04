#!/usr/bin/env python3
"""Fail if the Android Studio / Play pack is missing a required file."""
from __future__ import annotations

import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def need(rel: str) -> Path:
    p = ROOT / rel
    if not p.exists():
        errors.append(f"missing {rel}")
    return p


def png_info(path: Path) -> tuple[int, int, bool]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        errors.append(f"{path} is not a PNG")
        return 0, 0, False
    w, h = struct.unpack(">II", data[16:24])
    # color type 4 and 6 include alpha
    color_type = data[25]
    has_alpha = color_type in (4, 6)
    return w, h, has_alpha


def main() -> int:
    for rel in [
        "android/gradlew",
        "android/gradlew.bat",
        "android/gradle/wrapper/gradle-wrapper.jar",
        "android/gradle/wrapper/gradle-wrapper.properties",
        "android/build.gradle",
        "android/settings.gradle",
        "android/variables.gradle",
        "android/gradle.properties",
        "android/capacitor.settings.gradle",
        "android/keystore.properties.example",
        "android/local.properties.example",
        "android/app/build.gradle",
        "android/app/proguard-rules.pro",
        "android/app/capacitor.build.gradle",
        "android/app/src/main/AndroidManifest.xml",
        "android/app/src/main/java/com/aetherion/observatory/MainActivity.java",
        "android/app/src/main/res/values/colors.xml",
        "android/app/src/main/res/values/strings.xml",
        "android/app/src/main/res/values/styles.xml",
        "android/app/src/main/res/values-v31/styles.xml",
        "android/app/src/main/res/xml/network_security_config.xml",
        "android/app/src/main/res/xml/file_paths.xml",
        "android/app/src/main/res/xml/backup_rules.xml",
        "android/app/src/main/res/xml/data_extraction_rules.xml",
        "android/app/src/main/res/drawable/splash.png",
        "android/app/src/main/res/drawable/splash_icon.png",
        "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png",
        "android/app/src/debug/AndroidManifest.xml",
        "android/app/src/main/assets/public/index.html",
        "android/app/src/main/assets/capacitor.config.json",
        "capacitor.config.ts",
        "scripts/create-upload-keystore.sh",
        "play/icon-512.png",
        "play/feature-graphic.png",
        "play/listing.txt",
        "play/data-safety.md",
        "play/content-rating.md",
        "play/PLAY_CONSOLE.md",
        "docs/privacy.html",
        "public/privacy.html",
        "ANDROID.md",
    ]:
        need(rel)

    jar = ROOT / "android/gradle/wrapper/gradle-wrapper.jar"
    if jar.exists() and jar.read_bytes()[:2] != b"PK":
        errors.append("gradle-wrapper.jar is not a zip/jar")

    css = (ROOT / "src/styles.css").read_text()[:40]
    if not css.startswith('@import "tailwindcss"'):
        errors.append("src/styles.css must start with @import \"tailwindcss\"")

    manifest = (ROOT / "android/app/src/main/AndroidManifest.xml").read_text()
    gradle = (ROOT / "android/app/build.gradle").read_text()
    if "com.aetherion.observatory" not in gradle:
        errors.append("applicationId missing")
    if "signingConfigs" not in gradle:
        errors.append("signingConfigs.release missing")
    if 'android:exported="true"' not in manifest:
        errors.append("LAUNCHER activity must be exported")
    if "AD_ID" not in manifest:
        errors.append("AD_ID tools:node=remove missing")

    for forbidden in [
        "android/keystore.properties",
        "android/upload-keystore.jks",
        "android/local.properties",
    ]:
        if (ROOT / forbidden).exists():
            errors.append(f"secret must not be in the tree: {forbidden}")

    icon = ROOT / "play/icon-512.png"
    if icon.exists():
        w, h, _ = png_info(icon)
        if (w, h) != (512, 512):
            errors.append(f"play/icon-512.png is {w}x{h}, need 512x512")

    feat = ROOT / "play/feature-graphic.png"
    if feat.exists():
        w, h, alpha = png_info(feat)
        if (w, h) != (1024, 500):
            errors.append(f"feature-graphic.png is {w}x{h}, need 1024x500")
        if alpha:
            errors.append("feature-graphic.png has alpha; Play requires 24-bit PNG")

    shots = list((ROOT / "play/screenshots").glob("*.png"))
    if len(shots) < 2:
        errors.append("need at least 2 Play phone screenshots")

    if errors:
        print("ANDROID PACK INCOMPLETE:")
        for e in errors:
            print(" -", e)
        return 1
    print("android pack ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
