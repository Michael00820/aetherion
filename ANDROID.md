# Aetherion — Android Studio and Play Console

Open the **`android`** folder in Android Studio (not the repo root).

| | |
| --- | --- |
| Package / application id | `com.aetherion.observatory` |
| App name | Aetherion |
| Version | `1.0.0` (`versionCode` 1) |
| minSdk | 24 (Android 7) |
| target / compile SDK | 36 |
| JDK | **21** (Studio’s embedded JDK) |
| Web shell | Capacitor 8, `webDir` = `dist-android` |
| Signed output | `android/app/build/outputs/bundle/release/app-release.aab` |

The upload keystore is **not** in git. You create it once on your machine.

---

## 1. One-time machine setup

1. Install [Android Studio](https://developer.android.com/studio) (Ladybug / 2024.2 or newer).
2. SDK Manager → install **Android SDK 36**, **Build-Tools 36**, and **NDK** if Studio offers it.
3. File → Open → select the `android` directory.
4. Let Gradle sync. If it asks for an SDK, accept the default. Studio writes `android/local.properties` (`sdk.dir`). Use `android/local.properties.example` only if you must set it by hand.
5. From the **repo root** (Node 22):

```bash
npm install
npm run android:web
npx cap sync android
```

`npm install` is required: Capacitor’s Android modules live in `node_modules` and `android/capacitor.settings.gradle` points at them.

---

## 2. Upload key (required for a signed Play bundle)

```bash
chmod +x scripts/create-upload-keystore.sh
./scripts/create-upload-keystore.sh
```

Interactive: keytool asks for a store password and a key password. Use a strong password; store it in a password manager.

Non-interactive (same password for store and key):

```bash
STORE_PASSWORD='your-strong-password' ./scripts/create-upload-keystore.sh
```

That writes `android/upload-keystore.jks` and `android/keystore.properties` (both gitignored). If you ran it interactively, copy `android/keystore.properties.example` to `android/keystore.properties` and fill the two passwords.

**Never commit** `upload-keystore.jks` or `keystore.properties`. Play App Signing keeps the *app signing* key; you keep this *upload* key. Losing the upload key means a Play Console recovery request.

---

## 3. Produce the signed AAB

Refresh the web shell, then sign:

```bash
npm install
npm run android:web
npx cap sync android
cd android && ./gradlew bundleRelease
```

Or from the repo root: `npm run android:bundle`.

In Android Studio: **Build → Generate Signed App Bundle / APK** → Android App Bundle → keystore `android/upload-keystore.jks`, alias `aetherion`.

The signed bundle lands at:

`android/app/build/outputs/bundle/release/app-release.aab`

`bundleRelease` **fails on purpose** if `keystore.properties` is missing, so you cannot upload an unsigned bundle.

Debug USB install (no Play key): Android Studio → Run, or `cd android && ./gradlew installDebug`.

---

## 4. Play Console — create the app

1. [Play Console](https://play.google.com/console) → Create app.
2. App name **Aetherion**, default language English, type **App**, free.
3. Declarations: not a government app, not a news app, no ads, privacy policy URL (step 6).
4. **Setup → App signing**: let Google manage the app signing key. First AAB upload registers your upload key.
5. **Release → Production** (or Internal testing / Closed testing) → Create release → upload `app-release.aab`.

### Closed testing (new personal developer accounts)

Google requires a closed test with at least **12 testers for 14 days** before production on new personal accounts. Internal testing does not count. Invite testers, have them opt in via the testing link, then apply for production.

---

## 5. Store listing assets

All files live in `play/`.

| Play field | File / value |
| --- | --- |
| App name | Aetherion |
| Short description | `play/listing.txt` |
| Full description | `play/listing.txt` |
| High-res icon 512×512 | `play/icon-512.png` (32-bit PNG) |
| Feature graphic 1024×500 | `play/feature-graphic.png` (24-bit PNG, **no alpha**) |
| Phone screenshots (2–8) | `play/screenshots/` |
| Category | Books & Reference |
| Contact | GitHub issues on Michael00820/aetherion |
| Data safety | `play/data-safety.md` |
| Content rating | `play/content-rating.md` |
| Privacy policy | host `public/privacy.html` (or `docs/privacy.html`) and paste the URL |

Phone screenshots are 1280×720. Play accepts 16:9. Capture portrait 1080×1920 from a device later if you want the phone-store crop.

---

## 6. Privacy policy URL

Play will reject the app without a public HTTP(S) URL.

- Enable GitHub Pages on `Michael00820/aetherion` (Deploy from branch `main`, folder `/docs`).
- Policy URL: `https://michael00820.github.io/aetherion/privacy.html`
- Paste that under Play Console → App content → Privacy policy.

---

## 7. Permissions (what Play will ask)

- `INTERNET` — optional chapter translation only. Scripture, calendar, and orbits ship in the bundle.
- `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` — optional “Your horizon”. Not required to install. Declare **approximate + precise location**, collected, app functionality, **not** shared, optional.
- Advertising ID is **removed** from the merged manifest (`tools:node="remove"`). Data safety: no advertising ID.

---

## 8. After the first release

Bump `versionCode` (integer, always +1) and `versionName` in `android/app/build.gradle` before every new AAB. Rebuild with `npm run android:bundle`.
