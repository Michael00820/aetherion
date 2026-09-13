# Publish Aetherion on Google Play

Follow these in order. Tick as you go. Full Android Studio notes are in [ANDROID.md](../ANDROID.md).

Store copy and images are in this `play/` folder. The signed file Play wants is an **Android App Bundle** (`.aab`), not an APK.

---

## 0. What you need before Play

- A Google account
- [Google Play Console](https://play.google.com/console) developer account (**US$25**, one-time)
- Government ID for [developer verification](https://support.google.com/googleplay/android-developer/answer/13606827)
- Android Studio on your computer (Ladybug / 2024.2 or newer), JDK 21, Android SDK 36
- This project, with the `android` folder
- 12 people with Android phones who will test for 14 days (new personal accounts only)

Organization accounts (D-U-N-S) skip the 12-tester wait. Personal accounts created **after 13 November 2023** do not.

---

## 1. Create the Play developer account

1. Open [play.google.com/console](https://play.google.com/console) and pay the registration fee.
2. Complete identity verification (passport, national ID, or driver licence).
3. Wait until the account status is active. Verification can take hours to a few days.

---

## 2. Create the app listing

1. **Create app**.
2. App name: **Aetherion**.
3. Default language: English (United States) or English (UK).
4. Type: **App** (not game).
5. Free.
6. Declarations: not a news app, not a government app, **contains ads**.
7. Accept the declarations and create.

---

## 3. Privacy policy URL (required)

Play will reject the store listing without a public `https://` policy.

1. On GitHub: **Settings → Pages** for `Michael00820/aetherion`.
2. Source: **Deploy from a branch**.
3. Branch **main**, folder **/docs**.
4. Save. After a few minutes the policy is at:

`https://michael00820.github.io/aetherion/privacy.html`

5. Play Console → **App content → Privacy policy** → paste that URL.

The HTML is already in `docs/privacy.html`.

---

## 4. Store listing (Main store listing)

Use files in `play/`.

| Field | What to enter |
| --- | --- |
| App name | Aetherion |
| Short description | first block in `listing.txt` (80 characters) |
| Full description | full block in `listing.txt` |
| App icon 512×512 | `icon-512.png` |
| Feature graphic 1024×500 | `feature-graphic.png` (RGB, no transparency — Play rejects alpha here) |
| Phone screenshots | at least **two** from `screenshots/` (upload 4–8 if you can) |
| Category | Books & Reference |
| Email | your real contact email |
| Website | `https://github.com/Michael00820/aetherion` |
| Phone | optional |

Do **not** upload `feature-graphic.png` as the icon, or the icon as the feature graphic.

---

## 5. App content questionnaires

Open **Monitor and improve → App content** (or **Policy → App content**) and complete every card until each shows a green check.

Use [data-safety.md](data-safety.md) and [content-rating.md](content-rating.md). Short answers:

- **Ads:** yes (Google AdMob interstitials). See [admob-setup.md](admob-setup.md)
- **App access:** all features available without login
- **News:** no
- **COVID-19:** no
- **Data safety:** location only, optional, not shared, app functionality (sunrise / sunset)
- **Advertising ID:** no
- **Target audience:** 13+ is honest; tick **not directed at children**. 18+ is safer if you prefer to skip Families policy.
- **Content rating:** IARC questionnaire — this is a reference / calendar / scripture app, no violence, no sexual content, no drugs. Expected rating: **Everyone** or **Everyone 10+**.
- **Financial / Health / Government:** no
- **Data safety encryption in transit:** yes (HTTPS)

---

## 6. Build the signed AAB on your computer

Play does not accept an unsigned bundle. The upload keystore is **not** in git. You create it once and never lose it.

1. Install Android Studio. Open the **`android`** folder (not the repo root).
2. Let Gradle sync. Install SDK 36 if Studio asks.
3. In a terminal at the **repo root**:

```bash
npm install
chmod +x scripts/create-upload-keystore.sh
./scripts/create-upload-keystore.sh
```

Keytool will ask for a store password and a key password. Use a strong password. Save it in a password manager. Copy `android/keystore.properties.example` to `android/keystore.properties` and fill both passwords if the script did not write them.

4. Build the store file:

```bash
npm run android:bundle
```

The file Play wants:

`android/app/build/outputs/bundle/release/app-release.aab`

Or in Studio: **Build → Generate Signed App Bundle / APK → Android App Bundle**, keystore `android/upload-keystore.jks`, alias `aetherion`.

**Never** commit `upload-keystore.jks` or `keystore.properties`. If you lose the upload key, you must ask Play for a reset; you cannot guess it.

Play App Signing: leave **Google Play App Signing** on (the default). Your JKS is the *upload* key. Google holds the *app signing* key.

---

## 7. Closed testing (required for new personal accounts)

New personal developer accounts cannot go straight to Production.

1. Play Console → **Test and release → Testing → Closed testing**.
2. Create a closed track (the default “Closed testing” track is fine).
3. **Create new release** → upload `app-release.aab`.
4. Release name: `1.0.0 (1)`.
5. Release notes, English:

```
First Play build of Aetherion: Ethiopian calendar, planetary hours, orrery, and Tewahedo scripture.
```

6. Save → **Review release** → **Start rollout to Closed testing**.
7. Testers: create an email list of at least **12 Google accounts** (add 14–16 in case someone drops).
8. Copy the **opt-in link**. Each tester must:
   - Open the link while signed into that Google account
   - Become a tester
   - Install Aetherion from the Play Store testing page
9. Keep **at least 12 testers opted in continuously for 14 days**. If someone leaves, the 14-day clock can reset. Internal testing does **not** count.
10. Ask testers to open Orbits, Zemen, Hours, and Scripture once so Play sees real use.

Review of the first closed-test AAB usually takes 1–5 days.

---

## 8. Apply for production

When Play Console shows the 12 testers / 14 days requirement as met:

1. Dashboard → **Apply for production access** (wording varies: “Apply for production”).
2. Summarise tester feedback in a few sentences (even “no crashes reported” is a valid summary).
3. Wait for Google’s decision (often 1–7 days).

Then:

1. **Test and release → Production → Countries / regions** — start with Ethiopia plus your home country; expand later.
2. **Create new release** — promote the closed-test AAB, or upload the same `app-release.aab`.
3. Review and **Start rollout to Production**.

Production review can take from a few hours to about a week.

---

## 9. After it is live

- Every new upload: raise `versionCode` by 1 and bump `versionName` in `android/app/build.gradle`, then `npm run android:bundle`.
- Reply to Play policy emails quickly; a missed 7-day window can suspend the app.
- Keep the privacy URL online.
- Keep the upload keystore backed up offline.

---

## 10. Common rejections (and the fix)

| Play says | Fix |
| --- | --- |
| Feature graphic invalid | Use `play/feature-graphic.png` (1024×500, **no alpha**) |
| Missing privacy policy | GitHub Pages URL from step 3 |
| Data safety mismatch | Location is collected, optional, not shared |
| Advertising ID declared | We strip `AD_ID`; answer **No** |
| Missing 12 testers | Closed testing, opt-in link, 14 continuous days |
| Unsigned / wrong key | `keystore.properties` present; alias `aetherion` |
| App name / impersonation | Keep the name **Aetherion**; do not use other brand names |
