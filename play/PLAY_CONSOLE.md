# Play Console walkthrough

Use this beside [ANDROID.md](../ANDROID.md). Tick as you go.

## Before upload

- [ ] JDK 21 + Android SDK 36 in Android Studio
- [ ] `npm install` at repo root
- [ ] `npm run android:web && npx cap sync android`
- [ ] `android/upload-keystore.jks` and `android/keystore.properties` exist locally
- [ ] `cd android && ./gradlew bundleRelease` produced `app/build/outputs/bundle/release/app-release.aab`

## Create the app

- [ ] Play Console → Create app → name **Aetherion**, app, free
- [ ] Privacy policy URL (GitHub Pages `docs/privacy.html`)
- [ ] Ads: no
- [ ] News / government: no
- [ ] App access: all features available without login
- [ ] Content rating questionnaire (`play/content-rating.md`)
- [ ] Target audience: 18+ is safest if unsure; otherwise 13+ with “not directed at children”
- [ ] News apps: no
- [ ] COVID-19: no
- [ ] Data safety (`play/data-safety.md`)
- [ ] Advertising ID: no
- [ ] Financial features: no
- [ ] Health: no
- [ ] Government: no

## Store listing

- [ ] Name, short + full description from `play/listing.txt`
- [ ] Hi-res icon `play/icon-512.png`
- [ ] Feature graphic `play/feature-graphic.png`
- [ ] At least two phone screenshots from `play/screenshots/`
- [ ] Category: Books & Reference
- [ ] Contact email (your address) and website `https://github.com/Michael00820/aetherion`

## Release

- [ ] Testing → Closed testing → create a release → upload the AAB
- [ ] Add 12 testers, share the opt-in link, wait 14 days if this is a new personal developer account
- [ ] Production → create a release from the tested AAB (or promote the closed-test release)

Countries: start with Ethiopia + your home country, then expand.
