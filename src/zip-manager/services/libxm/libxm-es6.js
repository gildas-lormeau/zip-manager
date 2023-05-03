// Fork of https://artefact2.github.io/libxm.js/

/* Author: Romain "Artefact2" Dalmaso <artefact2@gmail.com> */

/* This program is free software. It comes without any warranty, to the
 * extent permitted by applicable law. You can redistribute it and/or
 * modify it under the terms of the Do What The Fuck You Want To Public
 * License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

var libxm = typeof libxm !== "undefined" ? libxm : {};
var moduleOverrides = {};
var arguments_ = [];
var scriptDirectory = "";
var err = libxm.printErr || console.warn.bind(console);
var tempRet0 = 0;
var wasmMemory;
var ABORT = false;
var HEAP8, HEAPU8, HEAP16, HEAP32, HEAPF32, HEAPF64;
var wasmTable;
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runDependencies = 0;
var dependenciesFulfilled = function runCaller() {
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};
var wasmBinaryFile = locateFile("./assets/lib/libxm.wasm");
var asmLibraryArg = {
  b: _emscripten_memcpy_big,
  c: _emscripten_resize_heap,
  a: _setTempRet0
};
var calledRun;

var ___wasm_call_ctors = (libxm.___wasm_call_ctors = function () {
  return (___wasm_call_ctors = libxm.___wasm_call_ctors = libxm.asm.e).apply(
    null,
    arguments
  );
});
libxm._xm_create_context = function () {
  return (libxm._xm_create_context = libxm.asm.f).apply(null, arguments);
};
libxm._xm_free_context = function () {
  return (libxm._xm_free_context = libxm.asm.h).apply(null, arguments);
};
libxm._xm_generate_samples = function () {
  return (libxm._xm_generate_samples = libxm.asm.E).apply(null, arguments);
};
libxm._malloc = function () {
  return (libxm._malloc = libxm.asm.F).apply(null, arguments);
};
libxm._free = function () {
  return (libxm._free = libxm.asm.G).apply(null, arguments);
};
libxm.getValue = getValue;
libxm.writeArrayToMemory = writeArrayToMemory;
libxm.run = run;
for (let key in libxm) {
  if (libxm.hasOwnProperty(key)) {
    moduleOverrides[key] = libxm[key];
  }
}
for (let key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    libxm[key] = moduleOverrides[key];
  }
}
moduleOverrides = null;
if (typeof document !== "undefined" && document.currentScript) {
  scriptDirectory = document.currentScript.src;
} else {
  scriptDirectory = "";
}
if (libxm.arguments) {
  arguments_ = libxm.arguments;
}
if (libxm.quit) {
  quit_ = libxm.quit;
}
if (typeof WebAssembly !== "object") {
  abort("no native wasm support detected");
}
__ATINIT__.push({
  func: function () {
    ___wasm_call_ctors();
  }
});
if (libxm.preInit) {
  if (typeof libxm.preInit == "function") libxm.preInit = [libxm.preInit];
  while (libxm.preInit.length > 0) {
    libxm.preInit.pop()();
  }
}
libxm.init = async function () {
  await createWasm();
  run();
};

function setTempRet0(value) {
  tempRet0 = value;
}

function quit_(status, toThrow) {
  throw toThrow;
}

function locateFile(path) {
  if (libxm.locateFile) {
    return libxm.locateFile(path, scriptDirectory);
  }
  return scriptDirectory + path;
}

function getValue(ptr, type, noSafe) {
  type = type || "i8";
  if (type.charAt(type.length - 1) === "*") type = "i32";
  switch (type) {
    case "i1":
      return HEAP8[ptr >> 0];
    case "i8":
      return HEAP8[ptr >> 0];
    case "i16":
      return HEAP16[ptr >> 1];
    case "i32":
      return HEAP32[ptr >> 2];
    case "i64":
      return HEAP32[ptr >> 2];
    case "float":
      return HEAPF32[ptr >> 2];
    case "double":
      return HEAPF64[ptr >> 3];
    default:
      abort("invalid type for getValue: " + type);
  }
  return null;
}

function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}

function updateGlobalBufferAndViews(buf) {
  libxm.HEAP8 = HEAP8 = new Int8Array(buf);
  libxm.HEAP16 = HEAP16 = new Int16Array(buf);
  libxm.HEAP32 = HEAP32 = new Int32Array(buf);
  libxm.HEAPU8 = HEAPU8 = new Uint8Array(buf);
  libxm.HEAPU16 = new Uint16Array(buf);
  libxm.HEAPU32 = new Uint32Array(buf);
  libxm.HEAPF32 = HEAPF32 = new Float32Array(buf);
  libxm.HEAPF64 = HEAPF64 = new Float64Array(buf);
}

function preRun() {
  if (libxm.preRun) {
    if (typeof libxm.preRun == "function") libxm.preRun = [libxm.preRun];
    while (libxm.preRun.length) {
      addOnPreRun(libxm.preRun.shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {
  if (libxm.postRun) {
    if (typeof libxm.postRun == "function") libxm.postRun = [libxm.postRun];
    while (libxm.postRun.length) {
      addOnPostRun(libxm.postRun.shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

function addRunDependency() {
  runDependencies++;
}

function removeRunDependency() {
  runDependencies--;
  if (runDependencies == 0) {
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}

function abort(what) {
  if (libxm.onAbort) {
    libxm.onAbort(what);
  }
  what += "";
  err(what);
  ABORT = true;
  what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
  var e = new WebAssembly.RuntimeError(what);
  throw e;
}

async function createWasm() {
  var info = { a: asmLibraryArg };
  addRunDependency();
  try {
    const response = await fetch(wasmBinaryFile);
    if (!response.ok) {
      throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
    }
    const binary = await response.arrayBuffer();
    const output = await WebAssembly.instantiate(binary, info);
    var exports = output.instance.exports;
    libxm.asm = exports;
    wasmMemory = libxm.asm.d;
    updateGlobalBufferAndViews(wasmMemory.buffer);
    wasmTable = libxm.asm.H;
    removeRunDependency();
  } catch (error) {
    err("failed to asynchronously prepare wasm: " + error);
    abort(error);
  }
}

function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == "function") {
      callback(libxm);
      continue;
    }
    var func = callback.func;
    if (typeof func === "number") {
      if (callback.arg === undefined) {
        wasmTable.get(func)();
      } else {
        wasmTable.get(func)(callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

function _emscripten_memcpy_big(dest, src, num) {
  HEAPU8.copyWithin(dest, src, src + num);
}

function abortOnCannotGrowMemory(requestedSize) {
  abort("OOM (" + requestedSize + ")");
}

function _emscripten_resize_heap(requestedSize) {
  abortOnCannotGrowMemory(requestedSize);
}

function _setTempRet0($i) {
  setTempRet0($i | 0);
}

function run(args) {
  args = args || arguments_;
  if (runDependencies > 0) {
    return;
  }
  preRun();
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    if (calledRun) return;
    calledRun = true;
    libxm.calledRun = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    if (libxm.onRuntimeInitialized) libxm.onRuntimeInitialized();
    postRun();
  }
  if (libxm.setStatus) {
    libxm.setStatus("Running...");
    setTimeout(function () {
      setTimeout(function () {
        libxm.setStatus("");
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}

const AUDIO_BUFFER_LENGTH = 4096;
const XM_BUFFER_LENGTH = 256;
const RATE = 48000;

const xmActions = [];
const amp = 1.0;

let cFloatArray,
  moduleContextPtr,
  audioContext,
  out,
  buffers,
  clip,
  moduleContext;

function runXmContextAction(action) {
  if (xmActions.length > 0) {
    xmActions.push(action);
    return;
  }
  xmActions.push(action);
  while (xmActions.length > 0) {
    xmActions.shift()();
  }
}

function load(arrayBuffer) {
  runXmContextAction(() => {
    if (moduleContext !== undefined) {
      libxm._xm_free_context(moduleContext);
      moduleContext = undefined;
    }
    const view = new Int8Array(arrayBuffer);
    const moduleStringBuffer = libxm._malloc(view.length);
    libxm.writeArrayToMemory(view, moduleStringBuffer);
    const result = libxm._xm_create_context(
      moduleContextPtr,
      moduleStringBuffer,
      RATE
    );
    libxm._free(moduleStringBuffer);
    if (result !== 0) {
      moduleContext = undefined;
      throw new Error("Module context not defined");
    } else {
      moduleContext = libxm.getValue(moduleContextPtr, "*");
    }
  });
}

function fillBuffer(buffer) {
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  for (
    let offset = 0;
    offset < AUDIO_BUFFER_LENGTH;
    offset += XM_BUFFER_LENGTH
  ) {
    libxm._xm_generate_samples(moduleContext, cFloatArray, XM_BUFFER_LENGTH);
    for (let indexOffset = 0; indexOffset < XM_BUFFER_LENGTH; ++indexOffset) {
      leftChannel[offset + indexOffset] =
        libxm.getValue(cFloatArray + 8 * indexOffset, "float") * amp;
      rightChannel[offset + indexOffset] =
        libxm.getValue(cFloatArray + 8 * indexOffset + 4, "float") * amp;
      if (
        !clip &&
        (leftChannel[indexOffset] < -1.0 ||
          leftChannel[indexOffset] > 1.0 ||
          rightChannel[indexOffset] < -1.0 ||
          rightChannel[indexOffset] > 1.0)
      ) {
        clip = true;
      }
    }
  }
}

function setupSources() {
  const time = RATE * audioContext.currentTime + AUDIO_BUFFER_LENGTH;
  out = audioContext.createGain();
  out.gain.value = 0;
  makeSourceGenerator(0, time)();
  makeSourceGenerator(1, time + AUDIO_BUFFER_LENGTH)();
}

function makeSourceGenerator(index, start) {
  return () => {
    const source = audioContext.createBufferSource();
    source.buffer = buffers[index];
    source.onended = makeSourceGenerator(
      index,
      start + 2 * AUDIO_BUFFER_LENGTH
    );
    if (moduleContext !== undefined) {
      runXmContextAction(() => fillBuffer(source.buffer));
    } else {
      const leftChannel = source.buffer.getChannelData(0);
      const rightChannel = source.buffer.getChannelData(1);
      for (let i = 0; i < AUDIO_BUFFER_LENGTH; ++i) {
        leftChannel[i] = rightChannel[i] = 0.0;
      }
    }
    source.connect(out).connect(audioContext.destination);
    source.start(start / RATE);
  };
}

async function init() {
  await libxm.init();
  cFloatArray = libxm._malloc(2 * XM_BUFFER_LENGTH * 4);
  moduleContextPtr = libxm._malloc(4);
}

function pause() {
  audioContext.suspend();
}

function resume() {
  audioContext.resume();
}

function play({ data, masterVolume = 0.4 }) {
  audioContext = new AudioContext();
  buffers = [
    audioContext.createBuffer(2, AUDIO_BUFFER_LENGTH, RATE),
    audioContext.createBuffer(2, AUDIO_BUFFER_LENGTH, RATE)
  ];
  setupSources();
  load(data);
  clip = false;
  audioContext
    .resume()
    .then(() => setTimeout(() => (out.gain.value = masterVolume), 500));
}

export { init, play, pause, resume, audioContext, out };
