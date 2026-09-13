/**
 * Production AdMob IDs. Keep useTestAds false for Play builds.
 * Web preview still uses the in-app gate, not live AdMob.
 */
export const ADMOB = {
  androidAppId: "ca-app-pub-5547630504432869~2347293820",
  tabInterstitial: "ca-app-pub-5547630504432869/5707954330",
  chapterInterstitial: "ca-app-pub-5547630504432869/6777493420",
  useTestAds: false,
};

export const AD_DURATION_MS = {
  tab: 4200,
  chapter: 2200,
} as const;
