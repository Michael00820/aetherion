# Aetherion

A living observatory of the Ethiopian cosmos: a 3D orrery, the thirteen-month calendar, Chaldean planetary hours, and Tewahedo scripture.

## Rooms

- **Orbits** — compressed solar system with pause, speed, labels, trails, and click-to-focus.
- **Zemen** — Ethiopian calendar with Ge'ez month names and Gregorian counterparts.
- **Hours** — twelve hours of day from sunrise and twelve of night from sunset, in Chaldean order. The living hour shows a progress slider. Day / month / year views and a date bar.
- **Scripture** — traditional Ge'ez / Amharic text with English, plus optional chapter translation.

Gold (day) and silver (night) themes follow the sun at Addis Ababa, or can be locked.

## Run

```bash
npm install
npm run dev
```

Built with TanStack Start, React, Three.js, and Tailwind.

## Android / Play Store

Open the **`android`** folder in Android Studio. Application id: `com.aetherion.observatory`.

1. `npm install && npm run android:web && npx cap sync android`
2. `./scripts/create-upload-keystore.sh` (once; keep the JKS private)
3. `cd android && ./gradlew bundleRelease`

Full signed-AAB and Play Console steps: [ANDROID.md](ANDROID.md). Listing assets: [play/](play/). Privacy policy for GitHub Pages: [docs/privacy.html](docs/privacy.html).
