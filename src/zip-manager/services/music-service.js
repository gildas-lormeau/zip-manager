/* global fetch, document, requestAnimationFrame */

import WebAudioTinySynth from "./webaudio-tinysynth/webaudio-tinysynth-core-es6.js";

let synth, playing, analyser, byteFrequencyData;

function createSynth() {
  synth = new WebAudioTinySynth({ quality: 1, useReverb: 1 });
  synth.setLoop(true);
  synth.setMasterVol(0.1);
}

async function init({ data }) {
  if (!createSynth()) {
    createSynth();
  }
  synth.loadMIDI(data);
  synth.setTimbre(1, 49, [
    { w: "n0", f: 150, v: 0.2, d: 0.1, r: 0.1, h: 0.05, t: 0, p: 0.1 }
  ]);
  synth.setTimbre(1, 53, [
    { w: "n0", f: 440, v: 0.3, d: 0.1, p: 0.9, t: 0, r: 0.1 }
  ]);
  synth.setTimbre(0, 28, [
    { w: "sine", v: 0.8, d: 1, f: -1 },
    { w: "triangle", v: 4, f: 1, d: 0.4, s: 0.5, g: 1, t: 3 }
  ]);
  synth.setTimbre(0, 38, [
    { w: "sine", v: 0.6, d: 0.3 },
    { w: "triangle", v: 4, f: 1, d: 0.4, s: 0.5, g: 1, t: 3 },
    { w: "sawtooth", v: 0.1, a: 0.03, d: 0.5, s: 0.3, r: 0.2 }
  ]);
  synth.setTimbre(0, 39, [
    { w: "sine", v: 0.5, d: 0.3 },
    { w: "square", v: 3, f: -1, d: 1, s: 0.7, g: 1 },
    { w: "sawtooth", v: 0.1, a: 0.03, d: 0.6, s: 0.3, r: 0.2 }
  ]);
  analyser = synth.actx.createAnalyser();
  synth.out.connect(analyser);
  analyser.fftSize = 512;
  byteFrequencyData = new Uint8Array(analyser.frequencyBinCount);
}

async function play({ data, defaultIntruments, onSetFrequencyData }) {
  await init({ data, defaultIntruments });
  requestAnimationFrame(getByteFrequencyData);
  synth.playMIDI();
  playing = true;
  return synth;

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
  synth.stopMIDI();
}

document.onvisibilitychange = () => {
  console.log(playing, document.hidden);
  if (playing) {
    if (document.hidden) {
      synth.stopMIDI();
    } else {
      synth.playMIDI();
    }
  }
};

export { play, stop };
