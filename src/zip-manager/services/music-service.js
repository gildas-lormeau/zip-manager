/* global fetch, document, requestAnimationFrame */

import WebAudioTinySynth from "./webaudio-tinysynth/webaudio-tinysynth-core-es6.js";
import * as libxm from "./libxm/libxm-es6.js";

const MIDI_CONTENT_TYPE = "audio/midi";
const XM_CONTENT_TYPE = "audio/xm";

let midiLibrary, xmLibrary, musicLibrary, playing, analyser, byteFrequencyData;

function initMIDI() {
  if (!midiLibrary) {
    midiLibrary = new WebAudioTinySynth({ quality: 1, useReverb: 1 });
    midiLibrary.setLoop(true);
    midiLibrary.setTimbre(1, 49, [
      { w: "n0", f: 150, v: 0.2, d: 0.1, r: 0.1, h: 0.05, t: 0, p: 0.1 }
    ]);
    midiLibrary.setTimbre(1, 53, [
      { w: "n0", f: 440, v: 0.3, d: 0.1, p: 0.9, t: 0, r: 0.1 }
    ]);
    midiLibrary.setTimbre(0, 28, [
      { w: "sine", v: 0.8, d: 1, f: -1 },
      { w: "triangle", v: 4, f: 1, d: 0.4, s: 0.5, g: 1, t: 3 }
    ]);
    midiLibrary.setTimbre(0, 38, [
      { w: "sine", v: 0.6, d: 0.3 },
      { w: "triangle", v: 4, f: 1, d: 0.4, s: 0.5, g: 1, t: 3 },
      { w: "sawtooth", v: 0.1, a: 0.03, d: 0.5, s: 0.3, r: 0.2 }
    ]);
    midiLibrary.setTimbre(0, 39, [
      { w: "sine", v: 0.5, d: 0.3 },
      { w: "square", v: 3, f: -1, d: 1, s: 0.7, g: 1 },
      { w: "sawtooth", v: 0.1, a: 0.03, d: 0.6, s: 0.3, r: 0.2 }
    ]);
  }
  musicLibrary = midiLibrary;
}

async function initXM() {
  if (!xmLibrary) {
    await libxm.init();
    xmLibrary = libxm;
  }
  musicLibrary = xmLibrary;
}

async function init({ data, contentType, masterVolume }) {
  musicLibrary = null;
  if (contentType === MIDI_CONTENT_TYPE) {
    initMIDI();
  } else if (contentType === XM_CONTENT_TYPE) {
    await initXM();
  }
  if (musicLibrary) {
    musicLibrary.play({ data, masterVolume });
    initAnalyser(musicLibrary);
  }
}

function initAnalyser(library) {
  analyser = library.audioContext.createAnalyser();
  library.out.connect(analyser);
  analyser.fftSize = 512;
  byteFrequencyData = new Uint8Array(analyser.frequencyBinCount);
}

async function play({ data, contentType, masterVolume, onSetFrequencyData }) {
  await init({ data, contentType, masterVolume });
  playing = true;
  if (musicLibrary) {
    requestAnimationFrame(getByteFrequencyData);
  }
  return {};

  function getByteFrequencyData() {
    analyser.getByteFrequencyData(byteFrequencyData);
    if (onSetFrequencyData) {
      onSetFrequencyData(Array.from(byteFrequencyData));
    }
    if (playing && !document.hidden) {
      requestAnimationFrame(getByteFrequencyData);
    }
  }
}

function stop() {
  playing = false;
  if (musicLibrary) {
    musicLibrary.pause();
  }
}

document.onvisibilitychange = () => {
  if (musicLibrary && playing) {
    if (document.hidden) {
      musicLibrary.pause();
    } else {
      musicLibrary.resume();
    }
  }
};

export { play, stop };
