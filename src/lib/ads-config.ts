/**
 * AdMob IDs. Google test units ship until you send production IDs.
 * Paste your ca-app-pub-… values here, set useTestAds to false,
 * and put the same androidAppId in android/app/src/main/res/values/strings.xml
 */
export const ADMOB = {
  androidAppId: "ca-app-pub-3940256099942544~3347511713",
  tabInterstitial: "ca-app-pub-3940256099942544/1033173712",
  chapterInterstitial: "ca-app-pub-3940256099942544/1033173712",
  useTestAds: true,
};

export const AD_DURATION_MS = {
  tab: 4200,
  chapter: 2200,
} as const;
