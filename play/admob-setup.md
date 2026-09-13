# Set up AdMob video ads for Aetherion

Until you paste your own IDs, the app uses Google **test** units. Test ads work on a device; they will not earn money, and Play will reject a production release that still uses test IDs.

You need **three** values:

1. Android **App ID** — `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`
2. **Tab** interstitial unit — shown when switching Orbits / Zemen / Hours / Scripture
3. **Chapter** interstitial unit — shown when changing book or chapter

Paste them into:

- `android/app/src/main/res/values/strings.xml` → `admob_app_id`
- `src/lib/ads-config.ts` → `androidAppId`, `tabInterstitial`, `chapterInterstitial`
- Set `useTestAds` to `false` only after those real IDs are in place

Then send the three IDs here so they can be committed.

---

## 1. Create the AdMob app

1. Open [AdMob](https://apps.admob.com/) with the same Google account you use for Play (recommended).
2. **Apps → Add app**.
3. Platform **Android**. App is **not** in Play yet? Choose “No”, name it **Aetherion**. After Play listing exists, link the store listing from the app settings.
4. Copy the **App ID** (`ca-app-pub-…~…`). This is **not** an ad unit.

## 2. Create two interstitial units (video)

AdMob does not have a separate “video interstitial” type. Create **Interstitial** units. Google fills them with **video** when a video advertiser wins, otherwise a full-screen image. That is the format for “between screens”.

1. In the Aetherion app → **Ad units → Add ad unit**.
2. Choose **Interstitial**.
3. Name it `Aetherion tabs`.
4. Frequency capping (recommended so the app stays usable):
   - Tab unit: **1 impression per 1 minute** per user (or 2–3 per hour if you want more)
5. Save. Copy the ad unit ID (`ca-app-pub-…/…`).
6. Add a second interstitial named `Aetherion chapters`.
7. Chapter unit frequency: **1 impression per 30–45 seconds** (this is the “quick short” break between chapters).

Do **not** use Banner, Native, or App open for these two gates.

Optional later: a **Rewarded interstitial** if you want a skippable short video with a reward. The app currently shows standard interstitials.

## 3. Link Play and enable video fill

1. AdMob app settings → **App store presence** → add `com.aetherion.observatory` once the Play listing exists.
2. **Blocking controls** → leave video ads **allowed** (default). If you block video, you will only get static interstitials.
3. **EU user consent** → **Privacy & messaging**:
   - Create a **GDPR** message (UMP).
   - Create a **Google-certified CMP** / IDFA if you later ship iOS.
   - Without a GDPR message, EEA users may not see ads.

## 4. Test on a real phone

1. Keep `useTestAds: true` and the Google test IDs until you see a full-screen test ad after a tab switch.
2. Add your phone as a [test device](https://support.google.com/admob/answer/9691433) in AdMob.
3. Switch to your real App ID + unit IDs, set `useTestAds: false`, rebuild the signed AAB.
4. Never click your own production ads. Use test devices.

## 5. Play Console (because ads are on)

When you declare the app:

- **Contains ads:** Yes
- Data safety: Advertising ID **Yes**, shared with Google; app interactions for advertising; approximate location shared if the user grants location
- Content rating: ads **Yes**, not directed at children
- Target audience: 13+, not for children
- Privacy policy URL must mention AdMob (already in `docs/privacy.html`)

If you already created the Play app as “no ads”, change **App content → Ads** to Yes before the first closed-test upload that includes this build.
