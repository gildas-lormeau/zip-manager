/* global AudioContext */

// Fork of https://github.com/davidglezz/sid-worklet

import { SIDNode } from "./sid-node.js";
import processorURL from "./sid-worklet.js?worker&url";

let audioContext, out, sidNode;

async function init() {
  audioContext = new AudioContext();
  await audioContext.audioWorklet.addModule(processorURL);
  out = audioContext.createGain();
  out.connect(audioContext.destination);
  sidNode = new SIDNode(audioContext);
  sidNode.connect(out);
}

function pause() {
  audioContext.suspend();
}

function resume() {
  audioContext.resume();
}

function play({ data, track = 0, masterVolume = 0.4 }) {
  sidNode.load(data);
  if (track) {
    sidNode.setSubsong(track);
  }
  out.gain.value = masterVolume;
  resume();
}

export { init, play, pause, resume, audioContext, out };
