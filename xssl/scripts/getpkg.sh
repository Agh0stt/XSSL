#!/data/data/com.termux/files/usr/bin/bash
# Or: #!/bin/bash if you're not using Termux

NAME=$1
BASE_URL="https://xssl-pkg-repo.vercel.app/stable/pkg"
DEST_DIR=".pkg"

mkdir -p "$DEST_DIR"
wget  -O "$DEST_DIR/$NAME.xssl" "$BASE_URL/$NAME.xssl"

if [ $? -eq 0 ]; then
  echo " Package '$NAME' downloaded to $DEST_DIR/"
else
  echo " Failed to download package '$NAME'"
fi
