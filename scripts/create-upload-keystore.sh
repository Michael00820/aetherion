#!/usr/bin/env bash
# Create a Play upload keystore. Run once, keep the JKS and passwords private.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/android/upload-keystore.jks"
PROPS="$ROOT/android/keystore.properties"
if [[ -f "$OUT" ]]; then
  echo "Refusing to overwrite $OUT"
  exit 1
fi

ALIAS="${KEY_ALIAS:-aetherion}"
STORE_PASS="${STORE_PASSWORD:-}"
KEY_PASS="${KEY_PASSWORD:-}"
DNAME="${KEY_DNAME:-CN=Aetherion, OU=Observatory, O=Aetherion, L=Addis Ababa, ST=Addis Ababa, C=ET}"

if [[ -n "$STORE_PASS" ]]; then
  KEY_PASS="${KEY_PASS:-$STORE_PASS}"
  keytool -genkeypair \
    -keystore "$OUT" \
    -alias "$ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storetype JKS \
    -dname "$DNAME" \
    -storepass "$STORE_PASS" \
    -keypass "$KEY_PASS" \
    -noprompt
  umask 077
  cat > "$PROPS" <<EOF
storeFile=upload-keystore.jks
storePassword=$STORE_PASS
keyAlias=$ALIAS
keyPassword=$KEY_PASS
EOF
  echo "Wrote $OUT and $PROPS (gitignored)."
else
  echo "keytool will prompt for the store password and key password."
  echo "Use the same password for both unless you have a reason not to."
  keytool -genkeypair \
    -keystore "$OUT" \
    -alias "$ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storetype JKS \
    -dname "$DNAME"
  echo
  echo "Wrote $OUT"
  echo "Copy android/keystore.properties.example to android/keystore.properties and fill the passwords."
fi

echo
echo "Keep the JKS and passwords offline. Play Console uses Play App Signing:"
echo "you upload this as the *upload* key; Google holds the app signing key."
echo "If you lose the upload key, recovery requires Play Console support."
