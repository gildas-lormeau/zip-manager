#!/bin/sh
set -e
WASI_SDK="${WASI_SDK:?path to the wasi-sdk installation}"
OUTPUT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$OUTPUT_DIR/libtfmxaudiodecoder/src"
"$WASI_SDK/bin/clang++" \
  --target=wasm32-wasip1 \
  -mexec-model=reactor \
  -O2 \
  -std=c++11 \
  -fno-exceptions \
  -fno-rtti \
  -DNDEBUG \
  -include cstdlib \
  -I"$OUTPUT_DIR" \
  -I"$SRC" \
  -Wl,--strip-all \
  -o "$OUTPUT_DIR/tfmx-decoder.wasm" \
  "$OUTPUT_DIR/tfmx-decoder.cpp" \
  "$SRC"/*.cpp \
  "$SRC"/Chris/*.cpp \
  "$SRC"/Chris/DNS/*.cpp \
  "$SRC"/Jochen/*.cpp
