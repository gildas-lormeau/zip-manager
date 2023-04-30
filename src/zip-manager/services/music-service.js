/* global fetch, document, requestAnimationFrame */

import WebAudioTinySynth from "./webaudio-tinysynth/webaudio-tinysynth-core-es6.js";

let synth, playing, analyser, byteFrequencyData;

synth = new WebAudioTinySynth({ quality: 1, useReverb: 1 });
synth.setLoop(true);
synth.setMasterVol(0.1);

async function init({ data, defaultIntruments }) {
  synth.loadMIDI(data);
  if (!defaultIntruments) {
    synth.setTimbre(1, 36, [
      { w: "triangle", t: 0, f: 88, v: 0.7, d: 0.05, h: 0.03, p: 0.5, q: 0.1 },
      { w: "n0", g: 1, t: 5, v: 42, r: 0.01, h: 0, p: 0 }
    ]);
    synth.setTimbre(1, 38, [{ w: "n0", f: 33, d: 0.05, t: 0, v: 1 }]);
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
    synth.setTimbre(0, 30, [
      { w: "triangle", v: 0.5, d: 1, f: 1 },
      { w: "square", v: 7, f: -1, d: 0.3, s: 0.5, g: 1 }
    ]);
    synth.setTimbre(0, 38, [
      { w: "triangle", v: 0.5, t: 2, d: 1 },
      { w: "triangle", v: 6, t: 2.5, d: 0.08, s: 0.1, g: 1 }
    ]);
    synth.setTimbre(0, 80, [
      { w: "square", v: 0.4, d: 1, s: 0.5 },
      { w: "square", v: 3, f: 0.2, d: 1, s: 0.5, g: 1 }
    ]);
    synth.setTimbre(0, 4, [
      { w: "sine", d: 0.5, v: 0.5 },
      { w: "triangle", v: 6, t: 3, f: 2, d: 0.3, g: 1, k: -1, a: 0.01, s: 0.5 }
    ]);
    synth.setTimbre(0, 94, [
      { w: "sine", v: 0.3, a: 0.05, d: 1, s: 0.3, r: 0.1 },
      { w: "sine", v: 0.1, t: 2.001, f: 1, d: 1, s: 50, g: 1 }
    ]);
  }
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
  if (playing) {
    if (document.hidden) {
      synth.stopMIDI();
    } else {
      play();
    }
  }
};

export { play, stop };
