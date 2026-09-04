# Aetherion Android

Open **this folder** in Android Studio.

Package: `com.aetherion.observatory`  
Signed Play bundle: after creating `keystore.properties`, run `./gradlew bundleRelease`.

The web shell is generated from the repo root:

```
npm install
npm run android:web
npx cap sync android
```

Do not commit `upload-keystore.jks` or `keystore.properties`.

Full instructions: [../ANDROID.md](../ANDROID.md)
