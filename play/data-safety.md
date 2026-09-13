# Play Console → App content → Data safety

Answer **No** unless a row below says otherwise. Aetherion has no accounts and no first-party analytics. Ads are served by **Google AdMob**.

## Does your app collect or share any of the required user data types?

Yes — optional location (horizon) and advertising identifiers / ad activity via AdMob.

## Does your app contain ads?

Yes.

## Data types

| Type | Collected | Shared | Required | Purpose | Ephemeral |
| --- | --- | --- | --- | --- | --- |
| Location → Approximate location | Yes | Yes (AdMob, if the user grants location) | No (optional) | App functionality (sunrise / sunset) and advertising | Location for hours is in memory; AdMob may retain per Google’s policy |
| Location → Precise location | Yes | No | No (optional) | App functionality (sunrise / sunset) | Yes — used in memory, not stored on a server by Aetherion |
| Device or other IDs → Advertising ID | Yes | Yes (Google AdMob) | Yes if ads are shown | Advertising | Handled by Google Play services |
| App activity → App interactions | Yes | Yes (Google AdMob) | Yes if ads are shown | Advertising | Handled by AdMob |
| Personal info | No | | | | |
| Financial | No | | | | |
| Health & fitness | No | | | | |
| Messages | No | | | | |
| Photos and videos | No | | | | |
| Audio | No | | | | |
| Files and docs | No | | | | |
| Calendar | No | | | | |
| Contacts | No | | | | |
| Web browsing | No | | | | |
| App info and performance | No | | | | |

## Security practices

- Data is encrypted in transit: **Yes** (HTTPS only; no cleartext in release).
- Users can request deletion: **No** from Aetherion (we store nothing on a server). AdMob data follows [Google’s ads privacy](https://policies.google.com/privacy).
- Independent security review: **No**.
- Committed to Play Families Policy: **No** (not directed at children).

## Advertising ID

**Yes.** Required for AdMob. Do **not** strip `AD_ID` from the manifest.

## Data collected before account creation / offline

No account. Hours location stays on-device. Ads require a network connection; if an ad cannot load, the app continues to the requested room or chapter.
