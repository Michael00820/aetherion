#!/usr/bin/env bash
# Create a Play upload keystore. Run once, keep the JKS and passwords private.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/android/upload-keystore.jks"
if [[ -f "$OUT" ]]; then
  echo "Refusing to overwrite $OUT"
  exit 1
fi
keytool -genkeypair \
  -keystore "$OUT" \
  -alias aetherion \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype JKS \
  -dname "CN=Aetherion, OU=Observatory, O=Aetherion, L=Addis Ababa, ST=Addis Ababa, C=ET"
echo
echo "Wrote $OUT"
echo "Copy android/keystore.properties.example to android/keystore.properties and fill the passwords."
echo "Then in Play Console: Setup → App signing → upload this key as the upload key."
