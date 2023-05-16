/* global document, requestAnimationFrame, fetch */

import WebAudioTinySynth from "./lib/webaudio-tinysynth/webaudio-tinysynth-core-es6.js";
import * as libxm from "./lib/libxm/libxm-es6.js";

import {
  MUSIC_TRACK_PATH_PREFIX,
  MIDI_CONTENT_TYPE,
  XM_CONTENT_TYPE
} from "./music-service-constants.js";

const MUSIC_TRACK_RELATIVE_PATH_PREFIX = "./" + MUSIC_TRACK_PATH_PREFIX;
const MUSIC_TRACKS_VOLUMES = [0.1, 0.7, 0.4, 0.1, 1.8, 0.6, 0.8, 1.1, 0.5, 0.7];
const MUSIC_TRACKS_LENGTH = MUSIC_TRACKS_VOLUMES.length;

let midiLibrary,
  xmLibrary,
  musicLibrary,
  playing,
  analyser,
  byteFrequencyData,
  callbackFrequencyData;

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

function initAnalyser() {
  analyser = musicLibrary.audioContext.createAnalyser();
  musicLibrary.out.connect(analyser);
  analyser.fftSize = 128;
  byteFrequencyData = new Uint8Array(analyser.frequencyBinCount);
}

async function play({ musicTrackIndex, onSetFrequencyData }) {
  const response = await fetch(
    MUSIC_TRACK_RELATIVE_PATH_PREFIX + (musicTrackIndex + 1)
  );
  const blob = await response.blob();
  const contentType = blob.type;
  const data = await blob.arrayBuffer();
  const masterVolume = MUSIC_TRACKS_VOLUMES[musicTrackIndex];
  await init({ data, contentType, masterVolume });
  playing = true;
  callbackFrequencyData = onSetFrequencyData;
  if (musicLibrary) {
    requestAnimationFrame(getByteFrequencyData);
  }
  return {};
}

function getByteFrequencyData() {
  analyser.getByteFrequencyData(byteFrequencyData);
  if (callbackFrequencyData) {
    callbackFrequencyData(Array.from(byteFrequencyData));
  }
  if (playing && !document.hidden) {
    requestAnimationFrame(getByteFrequencyData);
  }
}

function stop() {
  playing = false;
  if (musicLibrary) {
    musicLibrary.pause();
  }
}

function getFirstTrackIndex() {
  return Math.floor(Math.random() * MUSIC_TRACKS_LENGTH);
}

function getNextTrackIndex(musicTrackIndex) {
  return (musicTrackIndex + 1) % MUSIC_TRACKS_LENGTH;
}

document.onvisibilitychange = () => {
  if (musicLibrary && playing) {
    if (document.hidden) {
      musicLibrary.pause();
    } else {
      musicLibrary.resume();
      requestAnimationFrame(getByteFrequencyData);
    }
  }
};

export { getFirstTrackIndex, getNextTrackIndex, play, stop };
