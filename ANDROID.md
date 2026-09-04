# Aetherion for Android Studio and Play Console

Open the `android` folder in Android Studio. Application id: `com.aetherion.observatory`. Target SDK 36.

## One-time on this machine

1. Install [Android Studio](https://developer.android.com/studio) (Ladybug / 2024.2 or newer) with SDK 36 and Build-Tools 36.
2. Open `android/`. Let Gradle sync. Use **JDK 21** (Android Studio's embedded JDK is fine).
3. Copy `android/local.properties.example` to `android/local.properties` only if Studio did not write `sdk.dir` for you.

## Upload key (required for a signed Play bundle)

```bash
chmod +x scripts/create-upload-keystore.sh
./scripts/create-upload-keystore.sh
cp android/keystore.properties.example android/keystore.properties
```

Fill the two passwords in `android/keystore.properties`. Never commit that file or `upload-keystore.jks`.

Play Console uses **Play App Signing**. You keep the upload key; Google holds the app signing key.

## Refresh the web shell, then sign

From the repo root (Node 22):

```bash
npm install
npm run android:web
npx cap sync android
```

Then either:

- Android Studio → **Build → Generate Signed App Bundle / APK** → Android App Bundle → use `android/upload-keystore.jks`, alias `aetherion`.
- or `cd android && ./gradlew bundleRelease` (reads `keystore.properties`).

The signed bundle lands at:

`android/app/build/outputs/bundle/release/app-release.aab`

Upload that AAB to Play Console (production / open testing / internal testing).

## Play Console checklist

| Item | File / value |
| --- | --- |
| Package name | `com.aetherion.observatory` |
| App name | Aetherion |
| High-res icon | `play/icon-512.png` |
| Feature graphic | `play/feature-graphic.png` |
| Copy | `play/listing.txt` |
| Privacy policy | host `public/privacy.html` and paste the URL |
| Location | optional, on-device, for planetary hours |
| Target API | 36 |

Phone screenshots: capture Orbits, Zemen, Hours, and Scripture on a 6" device (1080×1920 or the Play screenshot sizes).

## Permissions

- `INTERNET` — optional chapter translation.
- `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` — optional “Your horizon”. Not required to install.

## Debug USB install

Android Studio → Run on a device, or `cd android && ./gradlew installDebug`.
