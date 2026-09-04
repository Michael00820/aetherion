# Play Console → App content → Data safety

Answer **No** unless a row below says otherwise. Aetherion does not use Firebase, ads, or accounts.

## Does your app collect or share any of the required user data types?

Yes — location only, and only if the user taps “Your horizon”.

## Data types

| Type | Collected | Shared | Required | Purpose | Ephemeral |
| --- | --- | --- | --- | --- | --- |
| Location → Approximate location | Yes | No | No (optional) | App functionality (sunrise / sunset for planetary hours) | Yes — used in memory, not stored on a server |
| Location → Precise location | Yes | No | No (optional) | Same | Yes |
| Personal info | No | | | | |
| Financial | No | | | | |
| Health & fitness | No | | | | |
| Messages | No | | | | |
| Photos and videos | No | | | | |
| Audio | No | | | | |
| Files and docs | No | | | | |
| Calendar | No | | | | |
| Contacts | No | | | | |
| App activity | No | | | | |
| Web browsing | No | | | | |
| App info and performance | No | | | | |
| Device or other IDs | No | | | | |

## Security practices

- Data is encrypted in transit: **Yes** (HTTPS only; no cleartext in release).
- Users can request deletion: **No** (nothing is stored on a server).
- Independent security review: **No**.
- Committed to Play Families Policy: **No** (not directed at children).

## Advertising ID

**No.** The `AD_ID` permission is stripped from the merged manifest.

## Data collected before account creation / offline

No account. Location is on-device only.
