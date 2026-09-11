#!/bin/sh
set -e
WASI_SDK="${WASI_SDK:?path to the wasi-sdk installation}"
YMFM_SRC="${YMFM_SRC:?path to the ymfm src directory}"
OUTPUT_DIR="$(cd "$(dirname "$0")" && pwd)"
"$WASI_SDK/bin/clang++" \
  --target=wasm32-wasip1 \
  -mexec-model=reactor \
  -O2 \
  -std=c++17 \
  -fno-exceptions \
  -fno-rtti \
  -DNDEBUG \
  -I"$YMFM_SRC" \
  -Wl,--strip-all \
  -o "$OUTPUT_DIR/ymfm-ym2610.wasm" \
  "$OUTPUT_DIR/ymfm-ym2610.cpp" \
  "$YMFM_SRC/ymfm_opn.cpp" \
  "$YMFM_SRC/ymfm_adpcm.cpp" \
  "$YMFM_SRC/ymfm_ssg.cpp" \
  "$YMFM_SRC/ymfm_misc.cpp"
