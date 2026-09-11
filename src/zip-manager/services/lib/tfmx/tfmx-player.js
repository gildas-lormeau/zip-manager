/* global AudioContext, AudioWorkletNode, fetch */

import processorURL from "./tfmx-worklet.js?worker&url";
import wasmURL from "./tfmx-decoder.wasm?url";

let audioContext, out, node, wasm;

async function init() {
  audioContext = new AudioContext();
  const response = fetch(wasmURL);
  await audioContext.audioWorklet.addModule(processorURL);
  wasm = await (await response).arrayBuffer();
  out = audioContext.createGain();
  out.connect(audioContext.destination);
}

function pause() {
  audioContext.suspend();
}

function resume() {
  audioContext.resume();
}

function play({ data, track = 0, masterVolume = 0.4 }) {
  if (node) {
    node.disconnect();
  }
  node = new AudioWorkletNode(audioContext, "tfmx", {
    outputChannelCount: [2]
  });
  node.port.postMessage({ wasm, data, song: track });
  node.connect(out);
  out.gain.value = masterVolume;
  resume();
}

export { init, play, pause, resume, audioContext, out };
