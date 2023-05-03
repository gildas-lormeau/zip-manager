/* global AudioContext, requestAnimationFrame */

/* eslint-disable indent */

// Fork of https://github.com/g200kg/webaudio-tinysynth/
// - ported to ES6
// - removed code related to the GUI
// - removed dependency to `XMLHttpRequest`
// - applied optimization to minify more the code (see `that` variables)
// - use `requestAnimationFrame`

function WebAudioTinySynthCore(target) {
  Object.assign(target, {
    properties: {
      masterVol: { type: Number, value: 0.5, observer: "setMasterVol" },
      reverbLev: { type: Number, value: 0.3, observer: "setReverbLev" },
      quality: { type: Number, value: 1, observer: "setQuality" },
      loop: { type: Number, value: 0 },
      internalcontext: { type: Number, value: 1 },
      tsmode: { type: Number, value: 0 },
      voices: { type: Number, value: 64 },
      useReverb: { type: Number, value: 1 }
    },
    program: [
      // 1-8 : Piano
      { name: "Acoustic Grand Piano" },
      { name: "Bright Acoustic Piano" },
      { name: "Electric Grand Piano" },
      { name: "Honky-tonk Piano" },
      { name: "Electric Piano 1" },
      { name: "Electric Piano 2" },
      { name: "Harpsichord" },
      { name: "Clavi" },
      /* 9-16 : Chromatic Perc*/
      { name: "Celesta" },
      { name: "Glockenspiel" },
      { name: "Music Box" },
      { name: "Vibraphone" },
      { name: "Marimba" },
      { name: "Xylophone" },
      { name: "Tubular Bells" },
      { name: "Dulcimer" },
      /* 17-24 : Organ */
      { name: "Drawbar Organ" },
      { name: "Percussive Organ" },
      { name: "Rock Organ" },
      { name: "Church Organ" },
      { name: "Reed Organ" },
      { name: "Accordion" },
      { name: "Harmonica" },
      { name: "Tango Accordion" },
      /* 25-32 : Guitar */
      { name: "Acoustic Guitar (nylon)" },
      { name: "Acoustic Guitar (steel)" },
      { name: "Electric Guitar (jazz)" },
      { name: "Electric Guitar (clean)" },
      { name: "Electric Guitar (muted)" },
      { name: "Overdriven Guitar" },
      { name: "Distortion Guitar" },
      { name: "Guitar harmonics" },
      /* 33-40 : Bass */
      { name: "Acoustic Bass" },
      { name: "Electric Bass (finger)" },
      { name: "Electric Bass (pick)" },
      { name: "Fretless Bass" },
      { name: "Slap Bass 1" },
      { name: "Slap Bass 2" },
      { name: "Synth Bass 1" },
      { name: "Synth Bass 2" },
      /* 41-48 : Strings */
      { name: "Violin" },
      { name: "Viola" },
      { name: "Cello" },
      { name: "Contrabass" },
      { name: "Tremolo Strings" },
      { name: "Pizzicato Strings" },
      { name: "Orchestral Harp" },
      { name: "Timpani" },
      /* 49-56 : Ensamble */
      { name: "String Ensemble 1" },
      { name: "String Ensemble 2" },
      { name: "SynthStrings 1" },
      { name: "SynthStrings 2" },
      { name: "Choir Aahs" },
      { name: "Voice Oohs" },
      { name: "Synth Voice" },
      { name: "Orchestra Hit" },
      /* 57-64 : Brass */
      { name: "Trumpet" },
      { name: "Trombone" },
      { name: "Tuba" },
      { name: "Muted Trumpet" },
      { name: "French Horn" },
      { name: "Brass Section" },
      { name: "SynthBrass 1" },
      { name: "SynthBrass 2" },
      /* 65-72 : Reed */
      { name: "Soprano Sax" },
      { name: "Alto Sax" },
      { name: "Tenor Sax" },
      { name: "Baritone Sax" },
      { name: "Oboe" },
      { name: "English Horn" },
      { name: "Bassoon" },
      { name: "Clarinet" },
      /* 73-80 : Pipe */
      { name: "Piccolo" },
      { name: "Flute" },
      { name: "Recorder" },
      { name: "Pan Flute" },
      { name: "Blown Bottle" },
      { name: "Shakuhachi" },
      { name: "Whistle" },
      { name: "Ocarina" },
      /* 81-88 : SynthLead */
      { name: "Lead 1 (square)" },
      { name: "Lead 2 (sawtooth)" },
      { name: "Lead 3 (calliope)" },
      { name: "Lead 4 (chiff)" },
      { name: "Lead 5 (charang)" },
      { name: "Lead 6 (voice)" },
      { name: "Lead 7 (fifths)" },
      { name: "Lead 8 (bass + lead)" },
      /* 89-96 : SynthPad */
      { name: "Pad 1 (new age)" },
      { name: "Pad 2 (warm)" },
      { name: "Pad 3 (polysynth)" },
      { name: "Pad 4 (choir)" },
      { name: "Pad 5 (bowed)" },
      { name: "Pad 6 (metallic)" },
      { name: "Pad 7 (halo)" },
      { name: "Pad 8 (sweep)" },
      /* 97-104 : FX */
      { name: "FX 1 (rain)" },
      { name: "FX 2 (soundtrack)" },
      { name: "FX 3 (crystal)" },
      { name: "FX 4 (atmosphere)" },
      { name: "FX 5 (brightness)" },
      { name: "FX 6 (goblins)" },
      { name: "FX 7 (echoes)" },
      { name: "FX 8 (sci-fi)" },
      /* 105-112 : Ethnic */
      { name: "Sitar" },
      { name: "Banjo" },
      { name: "Shamisen" },
      { name: "Koto" },
      { name: "Kalimba" },
      { name: "Bag pipe" },
      { name: "Fiddle" },
      { name: "Shanai" },
      /* 113-120 : Percussive */
      { name: "Tinkle Bell" },
      { name: "Agogo" },
      { name: "Steel Drums" },
      { name: "Woodblock" },
      { name: "Taiko Drum" },
      { name: "Melodic Tom" },
      { name: "Synth Drum" },
      { name: "Reverse Cymbal" },
      /* 121-128 : SE */
      { name: "Guitar Fret Noise" },
      { name: "Breath Noise" },
      { name: "Seashore" },
      { name: "Bird Tweet" },
      { name: "Telephone Ring" },
      { name: "Helicopter" },
      { name: "Applause" },
      { name: "Gunshot" }
    ],
    drummap: [
      // 35
      { name: "Acoustic Bass Drum" },
      { name: "Bass Drum 1" },
      { name: "Side Stick" },
      { name: "Acoustic Snare" },
      { name: "Hand Clap" },
      { name: "Electric Snare" },
      { name: "Low Floor Tom" },
      { name: "Closed Hi Hat" },
      { name: "High Floor Tom" },
      { name: "Pedal Hi-Hat" },
      { name: "Low Tom" },
      { name: "Open Hi-Hat" },
      { name: "Low-Mid Tom" },
      { name: "Hi-Mid Tom" },
      { name: "Crash Cymbal 1" },
      { name: "High Tom" },
      { name: "Ride Cymbal 1" },
      { name: "Chinese Cymbal" },
      { name: "Ride Bell" },
      { name: "Tambourine" },
      { name: "Splash Cymbal" },
      { name: "Cowbell" },
      { name: "Crash Cymbal 2" },
      { name: "Vibraslap" },
      { name: "Ride Cymbal 2" },
      { name: "Hi Bongo" },
      { name: "Low Bongo" },
      { name: "Mute Hi Conga" },
      { name: "Open Hi Conga" },
      { name: "Low Conga" },
      { name: "High Timbale" },
      { name: "Low Timbale" },
      { name: "High Agogo" },
      { name: "Low Agogo" },
      { name: "Cabasa" },
      { name: "Maracas" },
      { name: "Short Whistle" },
      { name: "Long Whistle" },
      { name: "Short Guiro" },
      { name: "Long Guiro" },
      { name: "Claves" },
      { name: "Hi Wood Block" },
      { name: "Low Wood Block" },
      { name: "Mute Cuica" },
      { name: "Open Cuica" },
      { name: "Mute Triangle" },
      { name: "Open Triangle" }
    ],
    program1: [
      // 1-8 : Piano
      [
        { w: "sine", v: 0.4, d: 0.7, r: 0.1 },
        { w: "triangle", v: 3, d: 0.7, s: 0.1, g: 1, a: 0.01, k: -1.2 }
      ],
      [
        { w: "triangle", v: 0.4, d: 0.7, r: 0.1 },
        { w: "triangle", v: 4, t: 3, d: 0.4, s: 0.1, g: 1, k: -1, a: 0.01 }
      ],
      [
        { w: "sine", d: 0.7, r: 0.1 },
        { w: "triangle", v: 4, f: 2, d: 0.5, s: 0.5, g: 1, k: -1 }
      ],
      [
        { w: "sine", d: 0.7, v: 0.2 },
        {
          w: "triangle",
          v: 4,
          t: 3,
          f: 2,
          d: 0.3,
          g: 1,
          k: -1,
          a: 0.01,
          s: 0.5
        }
      ],
      [
        { w: "sine", v: 0.35, d: 0.7 },
        { w: "sine", v: 3, t: 7, f: 1, d: 1, s: 1, g: 1, k: -0.7 }
      ],
      [
        { w: "sine", v: 0.35, d: 0.7 },
        { w: "sine", v: 8, t: 7, f: 1, d: 0.5, s: 1, g: 1, k: -0.7 }
      ],
      [
        { w: "sawtooth", v: 0.34, d: 2 },
        { w: "sine", v: 8, f: 0.1, d: 2, s: 1, r: 2, g: 1 }
      ],
      [
        { w: "triangle", v: 0.34, d: 1.5 },
        { w: "square", v: 6, f: 0.1, d: 1.5, s: 0.5, r: 2, g: 1 }
      ],
      /* 9-16 : Chromatic Perc*/
      [
        { w: "sine", d: 0.3, r: 0.3 },
        { w: "sine", v: 7, t: 11, d: 0.03, g: 1 }
      ],
      [
        { w: "sine", d: 0.3, r: 0.3 },
        { w: "sine", v: 11, t: 6, d: 0.2, s: 0.4, g: 1 }
      ],
      [
        { w: "sine", v: 0.2, d: 0.3, r: 0.3 },
        { w: "sine", v: 11, t: 5, d: 0.1, s: 0.4, g: 1 }
      ],
      [
        { w: "sine", v: 0.2, d: 0.6, r: 0.6 },
        { w: "triangle", v: 11, t: 5, f: 1, s: 0.5, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, d: 0.2, r: 0.2 },
        { w: "sine", v: 6, t: 5, d: 0.02, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, d: 0.2, r: 0.2 },
        { w: "sine", v: 7, t: 11, d: 0.03, g: 1 }
      ],
      [
        { w: "sine", v: 0.2, d: 1, r: 1 },
        { w: "sine", v: 11, t: 3.5, d: 1, r: 1, g: 1 }
      ],
      [
        { w: "triangle", v: 0.2, d: 0.5, r: 0.2 },
        { w: "sine", v: 6, t: 2.5, d: 0.2, s: 0.1, r: 0.2, g: 1 }
      ],
      /* 17-24 : Organ */
      [
        { w: "w9999", v: 0.22, s: 0.9 },
        { w: "w9999", v: 0.22, t: 2, f: 2, s: 0.9 }
      ],
      [
        { w: "w9999", v: 0.2, s: 1 },
        {
          w: "sine",
          v: 11,
          t: 6,
          f: 2,
          s: 0.1,
          g: 1,
          h: 0.006,
          r: 0.002,
          d: 0.002
        },
        { w: "w9999", v: 0.2, t: 2, f: 1, h: 0, s: 1 }
      ],
      [
        { w: "w9999", v: 0.2, d: 0.1, s: 0.9 },
        { w: "w9999", v: 0.25, t: 4, f: 2, s: 0.5 }
      ],
      [
        { w: "w9999", v: 0.3, a: 0.04, s: 0.9 },
        { w: "w9999", v: 0.2, t: 8, f: 2, a: 0.04, s: 0.9 }
      ],
      [
        { w: "sine", v: 0.2, a: 0.02, d: 0.05, s: 1 },
        { w: "sine", v: 6, t: 3, f: 1, a: 0.02, d: 0.05, s: 1, g: 1 }
      ],
      [
        { w: "triangle", v: 0.2, a: 0.02, d: 0.05, s: 0.8 },
        { w: "square", v: 7, t: 3, f: 1, d: 0.05, s: 1.5, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 0.2, s: 0.5 },
        { w: "square", v: 1, d: 0.03, s: 2, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 0.1, s: 0.8 },
        { w: "square", v: 1, a: 0.3, d: 0.1, s: 2, g: 1 }
      ],
      /* 25-32 : Guitar */
      [
        { w: "sine", v: 0.3, d: 0.5, f: 1 },
        { w: "triangle", v: 5, t: 3, f: -1, d: 1, s: 0.1, g: 1 }
      ],
      [
        { w: "sine", v: 0.4, d: 0.6, f: 1 },
        { w: "triangle", v: 12, t: 3, d: 0.6, s: 0.1, g: 1, f: -1 }
      ],
      [
        { w: "triangle", v: 0.3, d: 1, f: 1 },
        { w: "triangle", v: 6, f: -1, d: 0.4, s: 0.5, g: 1, t: 3 }
      ],
      [
        { w: "sine", v: 0.3, d: 1, f: -1 },
        { w: "triangle", v: 11, f: 1, d: 0.4, s: 0.5, g: 1, t: 3 }
      ],
      [
        { w: "sine", v: 0.4, d: 0.1, r: 0.01 },
        { w: "sine", v: 7, g: 1 }
      ],
      [
        { w: "triangle", v: 0.4, d: 1, f: 1 },
        { w: "square", v: 4, f: -1, d: 1, s: 0.7, g: 1 }
      ], //[{w:"triangle",v:0.35,d:1,f:1,},{w:"square",v:7,f:-1,d:0.3,s:0.5,g:1,}],
      [
        { w: "triangle", v: 0.35, d: 1, f: 1 },
        { w: "square", v: 7, f: -1, d: 0.3, s: 0.5, g: 1 }
      ], //[{w:"triangle",v:0.4,d:1,f:1,},{w:"square",v:4,f:-1,d:1,s:0.7,g:1,}],//[{w:"triangle",v:0.4,d:1,},{w:"square",v:4,f:2,d:1,s:0.7,g:1,}],
      [
        { w: "sine", v: 0.2, t: 1.5, a: 0.005, h: 0.2, d: 0.6 },
        { w: "sine", v: 11, t: 5, f: 2, d: 1, s: 0.5, g: 1 }
      ],
      /* 33-40 : Bass */
      [
        { w: "sine", d: 0.3 },
        { w: "sine", v: 4, t: 3, d: 1, s: 1, g: 1 }
      ],
      [
        { w: "sine", d: 0.3 },
        { w: "sine", v: 4, t: 3, d: 1, s: 1, g: 1 }
      ],
      [
        { w: "w9999", d: 0.3, v: 0.7, s: 0.5 },
        { w: "sawtooth", v: 1.2, d: 0.02, s: 0.5, g: 1, h: 0, r: 0.02 }
      ],
      [
        { w: "sine", d: 0.3 },
        { w: "sine", v: 4, t: 3, d: 1, s: 1, g: 1 }
      ],
      [
        { w: "triangle", v: 0.3, t: 2, d: 1 },
        { w: "triangle", v: 15, t: 2.5, d: 0.04, s: 0.1, g: 1 }
      ],
      [
        { w: "triangle", v: 0.3, t: 2, d: 1 },
        { w: "triangle", v: 15, t: 2.5, d: 0.04, s: 0.1, g: 1 }
      ],
      [
        { w: "triangle", d: 0.7 },
        { w: "square", v: 0.4, t: 0.5, f: 1, d: 0.2, s: 10, g: 1 }
      ],
      [
        { w: "triangle", d: 0.7 },
        { w: "square", v: 0.4, t: 0.5, f: 1, d: 0.2, s: 10, g: 1 }
      ],
      /* 41-48 : Strings */
      [
        { w: "sawtooth", v: 0.4, a: 0.1, d: 11 },
        { w: "sine", v: 5, d: 11, s: 0.2, g: 1 }
      ],
      [
        { w: "sawtooth", v: 0.4, a: 0.1, d: 11 },
        { w: "sine", v: 5, d: 11, s: 0.2, g: 1 }
      ],
      [
        { w: "sawtooth", v: 0.4, a: 0.1, d: 11 },
        { w: "sine", v: 5, t: 0.5, d: 11, s: 0.2, g: 1 }
      ],
      [
        { w: "sawtooth", v: 0.4, a: 0.1, d: 11 },
        { w: "sine", v: 5, t: 0.5, d: 11, s: 0.2, g: 1 }
      ],
      [
        { w: "sine", v: 0.4, a: 0.1, d: 11 },
        { w: "sine", v: 6, f: 2.5, d: 0.05, s: 1.1, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, d: 0.1, r: 0.1 },
        { w: "square", v: 4, t: 3, d: 1, s: 0.2, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, d: 0.5, r: 0.5 },
        { w: "sine", v: 7, t: 2, f: 2, d: 1, r: 1, g: 1 }
      ],
      [
        { w: "triangle", v: 0.6, h: 0.03, d: 0.3, r: 0.3, t: 0.5 },
        { w: "n0", v: 8, t: 1.5, d: 0.08, r: 0.08, g: 1 }
      ],
      /* 49-56 : Ensamble */
      [
        { w: "sawtooth", v: 0.3, a: 0.03, s: 0.5 },
        { w: "sawtooth", v: 0.2, t: 2, f: 2, d: 1, s: 2 }
      ],
      [
        { w: "sawtooth", v: 0.3, f: -2, a: 0.03, s: 0.5 },
        { w: "sawtooth", v: 0.2, t: 2, f: 2, d: 1, s: 2 }
      ],
      [
        { w: "sawtooth", v: 0.2, a: 0.02, s: 1 },
        { w: "sawtooth", v: 0.2, t: 2, f: 2, a: 1, d: 1, s: 1 }
      ],
      [
        { w: "sawtooth", v: 0.2, a: 0.02, s: 1 },
        { w: "sawtooth", v: 0.2, f: 2, a: 0.02, d: 1, s: 1 }
      ],
      [
        { w: "triangle", v: 0.3, a: 0.03, s: 1 },
        { w: "sine", v: 3, t: 5, f: 1, d: 1, s: 1, g: 1 }
      ],
      [
        { w: "sine", v: 0.4, a: 0.03, s: 0.9 },
        { w: "sine", v: 1, t: 2, f: 3, d: 0.03, s: 0.2, g: 1 }
      ],
      [
        { w: "triangle", v: 0.6, a: 0.05, s: 0.5 },
        { w: "sine", v: 1, f: 0.8, d: 0.2, s: 0.2, g: 1 }
      ],
      [
        { w: "square", v: 0.15, a: 0.01, d: 0.2, r: 0.2, t: 0.5, h: 0.03 },
        { w: "square", v: 4, f: 0.5, d: 0.2, r: 11, a: 0.01, g: 1, h: 0.02 },
        {
          w: "square",
          v: 0.15,
          t: 4,
          f: 1,
          a: 0.02,
          d: 0.15,
          r: 0.15,
          h: 0.03
        },
        { g: 3, w: "square", v: 4, f: -0.5, a: 0.01, h: 0.02, d: 0.15, r: 11 }
      ],
      /* 57-64 : Brass */
      [
        { w: "square", v: 0.2, a: 0.01, d: 1, s: 0.6, r: 0.04 },
        { w: "sine", v: 1, d: 0.1, s: 4, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 1, s: 0.5, r: 0.08 },
        { w: "sine", v: 1, d: 0.1, s: 4, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.04, d: 1, s: 0.4, r: 0.08 },
        { w: "sine", v: 1, d: 0.1, s: 4, g: 1 }
      ],
      [
        { w: "square", v: 0.15, a: 0.04, s: 1 },
        { w: "sine", v: 2, d: 0.1, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 1, s: 0.5, r: 0.08 },
        { w: "sine", v: 1, d: 0.1, s: 4, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 1, s: 0.6, r: 0.08 },
        { w: "sine", v: 1, f: 0.2, d: 0.1, s: 4, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 0.5, s: 0.7, r: 0.08 },
        { w: "sine", v: 1, d: 0.1, s: 4, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 1, s: 0.5, r: 0.08 },
        { w: "sine", v: 1, d: 0.1, s: 4, g: 1 }
      ],
      /* 65-72 : Reed */
      [
        { w: "square", v: 0.2, a: 0.02, d: 2, s: 0.6 },
        { w: "sine", v: 2, d: 1, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 2, s: 0.6 },
        { w: "sine", v: 2, d: 1, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 1, s: 0.6 },
        { w: "sine", v: 2, d: 1, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.02, d: 1, s: 0.6 },
        { w: "sine", v: 2, d: 1, g: 1 }
      ],
      [
        { w: "sine", v: 0.4, a: 0.02, d: 0.7, s: 0.5 },
        { w: "square", v: 5, t: 2, d: 0.2, s: 0.5, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, a: 0.05, d: 0.2, s: 0.8 },
        { w: "sawtooth", v: 6, f: 0.1, d: 0.1, s: 0.3, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, a: 0.03, d: 0.2, s: 0.4 },
        { w: "square", v: 7, f: 0.2, d: 1, s: 0.1, g: 1 }
      ],
      [
        { w: "square", v: 0.2, a: 0.05, d: 0.1, s: 0.8 },
        { w: "square", v: 4, d: 0.1, s: 1.1, g: 1 }
      ],
      /* 73-80 : Pipe */
      [
        { w: "sine", a: 0.02, d: 2 },
        { w: "sine", v: 6, t: 2, d: 0.04, g: 1 }
      ],
      [
        { w: "sine", v: 0.7, a: 0.03, d: 0.4, s: 0.4 },
        { w: "sine", v: 4, t: 2, f: 0.2, d: 0.4, g: 1 }
      ],
      [
        { w: "sine", v: 0.7, a: 0.02, d: 0.4, s: 0.6 },
        { w: "sine", v: 3, t: 2, d: 0, s: 1, g: 1 }
      ],
      [
        { w: "sine", v: 0.4, a: 0.06, d: 0.3, s: 0.3 },
        { w: "sine", v: 7, t: 2, d: 0.2, s: 0.2, g: 1 }
      ],
      [
        { w: "sine", a: 0.02, d: 0.3, s: 0.3 },
        { w: "sawtooth", v: 3, t: 2, d: 0.3, g: 1 }
      ],
      [
        { w: "sine", v: 0.4, a: 0.02, d: 2, s: 0.1 },
        { w: "sawtooth", v: 8, t: 2, f: 1, d: 0.5, g: 1 }
      ],
      [
        { w: "sine", v: 0.7, a: 0.03, d: 0.5, s: 0.3 },
        { w: "sine", v: 0.003, t: 0, f: 4, d: 0.1, s: 0.002, g: 1 }
      ],
      [
        { w: "sine", v: 0.7, a: 0.02, d: 2 },
        { w: "sine", v: 1, t: 2, f: 1, d: 0.02, g: 1 }
      ],
      /* 81-88 : SynthLead */
      [
        { w: "square", v: 0.3, d: 1, s: 0.5 },
        { w: "square", v: 1, f: 0.2, d: 1, s: 0.5, g: 1 }
      ],
      [
        { w: "sawtooth", v: 0.3, d: 2, s: 0.5 },
        { w: "square", v: 2, f: 0.1, s: 0.5, g: 1 }
      ],
      [
        { w: "triangle", v: 0.5, a: 0.05, d: 2, s: 0.6 },
        { w: "sine", v: 4, t: 2, g: 1 }
      ],
      [
        { w: "triangle", v: 0.3, a: 0.01, d: 2, s: 0.3 },
        { w: "sine", v: 22, t: 2, f: 1, d: 0.03, s: 0.2, g: 1 }
      ],
      [
        { w: "sawtooth", v: 0.3, d: 1, s: 0.5 },
        { w: "sine", v: 11, t: 11, a: 0.2, d: 0.05, s: 0.3, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, a: 0.06, d: 1, s: 0.5 },
        { w: "sine", v: 7, f: 1, d: 1, s: 0.2, g: 1 }
      ],
      [
        { w: "sawtooth", v: 0.3, a: 0.03, d: 0.7, s: 0.3, r: 0.2 },
        { w: "sawtooth", v: 0.3, t: 0.75, d: 0.7, a: 0.1, s: 0.3, r: 0.2 }
      ],
      [
        { w: "triangle", v: 0.3, a: 0.01, d: 0.7, s: 0.5 },
        { w: "square", v: 5, t: 0.5, d: 0.7, s: 0.5, g: 1 }
      ],
      /* 89-96 : SynthPad */
      [
        { w: "triangle", v: 0.3, a: 0.02, d: 0.3, s: 0.3, r: 0.3 },
        { w: "square", v: 3, t: 4, f: 1, a: 0.02, d: 0.1, s: 1, g: 1 },
        {
          w: "triangle",
          v: 0.08,
          t: 0.5,
          a: 0.1,
          h: 0,
          d: 0.1,
          s: 0.5,
          r: 0.1,
          b: 0,
          c: 0
        }
      ],
      [
        { w: "sine", v: 0.3, a: 0.05, d: 1, s: 0.7, r: 0.3 },
        { w: "sine", v: 2, f: 1, d: 0.3, s: 1, g: 1 }
      ],
      [
        { w: "square", v: 0.3, a: 0.03, d: 0.5, s: 0.3, r: 0.1 },
        { w: "square", v: 4, f: 1, a: 0.03, d: 0.1, g: 1 }
      ],
      [
        { w: "triangle", v: 0.3, a: 0.08, d: 1, s: 0.3, r: 0.1 },
        { w: "square", v: 2, f: 1, d: 0.3, s: 0.3, g: 1, t: 4, a: 0.08 }
      ],
      [
        { w: "sine", v: 0.3, a: 0.05, d: 1, s: 0.3, r: 0.1 },
        { w: "sine", v: 0.1, t: 2.001, f: 1, d: 1, s: 50, g: 1 }
      ],
      [
        { w: "triangle", v: 0.3, a: 0.03, d: 0.7, s: 0.3, r: 0.2 },
        { w: "sine", v: 12, t: 7, f: 1, d: 0.5, s: 1.7, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, a: 0.05, d: 1, s: 0.3, r: 0.1 },
        { w: "sawtooth", v: 22, t: 6, d: 0.06, s: 0.3, g: 1 }
      ],
      [
        { w: "triangle", v: 0.3, a: 0.05, d: 11, r: 0.3 },
        { w: "triangle", v: 1, d: 1, s: 8, g: 1 }
      ],
      /* 97-104 : FX */
      [
        { w: "sawtooth", v: 0.3, d: 4, s: 0.8, r: 0.1 },
        { w: "square", v: 1, t: 2, f: 8, a: 1, d: 1, s: 1, r: 0.1, g: 1 }
      ],
      [
        {
          w: "triangle",
          v: 0.3,
          d: 1,
          s: 0.5,
          t: 0.8,
          a: 0.2,
          p: 1.25,
          q: 0.2
        },
        { w: "sawtooth", v: 0.2, a: 0.2, d: 0.3, s: 1, t: 1.2, p: 1.25, q: 0.2 }
      ],
      [
        { w: "sine", v: 0.3, d: 1, s: 0.3 },
        { w: "square", v: 22, t: 11, d: 0.5, s: 0.1, g: 1 }
      ],
      [
        { w: "sawtooth", v: 0.3, a: 0.04, d: 1, s: 0.8, r: 0.1 },
        { w: "square", v: 1, t: 0.5, d: 1, s: 2, g: 1 }
      ],
      [
        { w: "triangle", v: 0.3, d: 1, s: 0.3 },
        { w: "sine", v: 22, t: 6, d: 0.6, s: 0.05, g: 1 }
      ],
      [
        { w: "sine", v: 0.6, a: 0.1, d: 0.05, s: 0.4 },
        { w: "sine", v: 5, t: 5, f: 1, d: 0.05, s: 0.3, g: 1 }
      ],
      [
        { w: "sine", a: 0.1, d: 0.05, s: 0.4, v: 0.8 },
        { w: "sine", v: 5, t: 5, f: 1, d: 0.05, s: 0.3, g: 1 }
      ],
      [
        { w: "square", v: 0.3, a: 0.1, d: 0.1, s: 0.4 },
        { w: "square", v: 1, f: 1, d: 0.3, s: 0.1, g: 1 }
      ],
      /* 105-112 : Ethnic */
      [
        { w: "sawtooth", v: 0.3, d: 0.5, r: 0.5 },
        { w: "sawtooth", v: 11, t: 5, d: 0.05, g: 1 }
      ],
      [
        { w: "square", v: 0.3, d: 0.2, r: 0.2 },
        { w: "square", v: 7, t: 3, d: 0.05, g: 1 }
      ],
      [
        { w: "triangle", d: 0.2, r: 0.2 },
        { w: "square", v: 9, t: 3, d: 0.1, r: 0.1, g: 1 }
      ],
      [
        { w: "triangle", d: 0.3, r: 0.3 },
        { w: "square", v: 6, t: 3, d: 1, r: 1, g: 1 }
      ],
      [
        { w: "triangle", v: 0.4, d: 0.2, r: 0.2 },
        { w: "square", v: 22, t: 12, d: 0.1, r: 0.1, g: 1 }
      ],
      [
        { w: "sine", v: 0.25, a: 0.02, d: 0.05, s: 0.8 },
        { w: "square", v: 1, t: 2, d: 0.03, s: 11, g: 1 }
      ],
      [
        { w: "sine", v: 0.3, a: 0.05, d: 11 },
        { w: "square", v: 7, t: 3, f: 1, s: 0.7, g: 1 }
      ],
      [
        { w: "square", v: 0.3, a: 0.05, d: 0.1, s: 0.8 },
        { w: "square", v: 4, d: 0.1, s: 1.1, g: 1 }
      ],
      /* 113-120 : Percussive */
      [
        { w: "sine", v: 0.4, d: 0.3, r: 0.3 },
        { w: "sine", v: 7, t: 9, d: 0.1, r: 0.1, g: 1 }
      ],
      [
        { w: "sine", v: 0.7, d: 0.1, r: 0.1 },
        { w: "sine", v: 22, t: 7, d: 0.05, g: 1 }
      ],
      [
        { w: "sine", v: 0.6, d: 0.15, r: 0.15 },
        { w: "square", v: 11, t: 3.2, d: 0.1, r: 0.1, g: 1 }
      ],
      [
        { w: "sine", v: 0.8, d: 0.07, r: 0.07 },
        { w: "square", v: 11, t: 7, r: 0.01, g: 1 }
      ],
      [
        { w: "triangle", v: 0.7, t: 0.5, d: 0.2, r: 0.2, p: 0.95 },
        { w: "n0", v: 9, g: 1, d: 0.2, r: 0.2 }
      ],
      [
        { w: "sine", v: 0.7, d: 0.1, r: 0.1, p: 0.9 },
        { w: "square", v: 14, t: 2, d: 0.005, r: 0.005, g: 1 }
      ],
      [
        { w: "square", d: 0.15, r: 0.15, p: 0.5 },
        { w: "square", v: 4, t: 5, d: 0.001, r: 0.001, g: 1 }
      ],
      [{ w: "n1", v: 0.3, a: 1, s: 1, d: 0.15, r: 0, t: 0.5 }],
      /* 121-128 : SE */
      [
        { w: "sine", t: 12.5, d: 0, r: 0, p: 0.5, v: 0.3, h: 0.2, q: 0.5 },
        { g: 1, w: "sine", v: 1, t: 2, d: 0, r: 0, s: 1 },
        {
          g: 1,
          w: "n0",
          v: 0.2,
          t: 2,
          a: 0.6,
          h: 0,
          d: 0.1,
          r: 0.1,
          b: 0,
          c: 0
        }
      ],
      [{ w: "n0", v: 0.2, a: 0.05, h: 0.02, d: 0.02, r: 0.02 }],
      [{ w: "n0", v: 0.4, a: 1, d: 1, t: 0.25 }],
      [
        { w: "sine", v: 0.3, a: 0.1, d: 1, s: 0.5 },
        { w: "sine", v: 4, t: 0, f: 1.5, d: 1, s: 1, r: 0.1, g: 1 },
        {
          g: 1,
          w: "sine",
          v: 4,
          t: 0,
          f: 2,
          a: 0.6,
          h: 0,
          d: 0.1,
          s: 1,
          r: 0.1,
          b: 0,
          c: 0
        }
      ],
      [
        { w: "square", v: 0.3, t: 0.25, d: 11, s: 1 },
        { w: "square", v: 12, t: 0, f: 8, d: 1, s: 1, r: 11, g: 1 }
      ],
      [
        { w: "n0", v: 0.4, t: 0.5, a: 1, d: 11, s: 1, r: 0.5 },
        { w: "square", v: 1, t: 0, f: 14, d: 1, s: 1, r: 11, g: 1 }
      ],
      [
        { w: "sine", t: 0, f: 1221, a: 0.2, d: 1, r: 0.25, s: 1 },
        { g: 1, w: "n0", v: 3, t: 0.5, d: 1, s: 1, r: 1 }
      ],
      [
        { w: "sine", d: 0.4, r: 0.4, p: 0.1, t: 2.5, v: 1 },
        { w: "n0", v: 12, t: 2, d: 1, r: 1, g: 1 }
      ]
    ],
    program0: [
      // 1-8 : Piano
      [{ w: "triangle", v: 0.5, d: 0.7 }],
      [{ w: "triangle", v: 0.5, d: 0.7 }],
      [{ w: "triangle", v: 0.5, d: 0.7 }],
      [{ w: "triangle", v: 0.5, d: 0.7 }],
      [{ w: "triangle", v: 0.5, d: 0.7 }],
      [{ w: "triangle", v: 0.5, d: 0.7 }],
      [{ w: "sawtooth", v: 0.3, d: 0.7 }],
      [{ w: "sawtooth", v: 0.3, d: 0.7 }],
      /* 9-16 : Chromatic Perc*/
      [{ w: "sine", v: 0.5, d: 0.3, r: 0.3 }],
      [{ w: "triangle", v: 0.5, d: 0.3, r: 0.3 }],
      [{ w: "square", v: 0.2, d: 0.3, r: 0.3 }],
      [{ w: "square", v: 0.2, d: 0.3, r: 0.3 }],
      [{ w: "sine", v: 0.5, d: 0.1, r: 0.1 }],
      [{ w: "sine", v: 0.5, d: 0.1, r: 0.1 }],
      [{ w: "square", v: 0.2, d: 1, r: 1 }],
      [{ w: "sawtooth", v: 0.3, d: 0.7, r: 0.7 }],
      /* 17-24 : Organ */
      [{ w: "sine", v: 0.5, a: 0.01, s: 1 }],
      [{ w: "sine", v: 0.7, d: 0.02, s: 0.7 }],
      [{ w: "square", v: 0.2, s: 1 }],
      [{ w: "triangle", v: 0.5, a: 0.01, s: 1 }],
      [{ w: "square", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "square", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "square", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "square", v: 0.2, a: 0.05, s: 1 }],
      /* 25-32 : Guitar */
      [{ w: "triangle", v: 0.5, d: 0.5 }],
      [{ w: "square", v: 0.2, d: 0.6 }],
      [{ w: "square", v: 0.2, d: 0.6 }],
      [{ w: "triangle", v: 0.8, d: 0.6 }],
      [{ w: "triangle", v: 0.4, d: 0.05 }],
      [{ w: "square", v: 0.2, d: 1 }],
      [{ w: "square", v: 0.2, d: 1 }],
      [{ w: "sine", v: 0.4, d: 0.6 }],
      /* 33-40 : Bass */
      [{ w: "triangle", v: 0.7, d: 0.4 }],
      [{ w: "triangle", v: 0.7, d: 0.7 }],
      [{ w: "triangle", v: 0.7, d: 0.7 }],
      [{ w: "triangle", v: 0.7, d: 0.7 }],
      [{ w: "square", v: 0.3, d: 0.2 }],
      [{ w: "square", v: 0.3, d: 0.2 }],
      [{ w: "square", v: 0.3, d: 0.1, s: 0.2 }],
      [{ w: "sawtooth", v: 0.4, d: 0.1, s: 0.2 }],
      /* 41-48 : Strings */
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "sawtooth", v: 0.3, d: 0.1 }],
      [{ w: "sawtooth", v: 0.3, d: 0.5, r: 0.5 }],
      [{ w: "triangle", v: 0.6, d: 0.1, r: 0.1, h: 0.03, p: 0.8 }],
      /* 49-56 : Ensamble */
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "sawtooth", v: 0.2, a: 0.02, s: 1 }],
      [{ w: "triangle", v: 0.3, a: 0.03, s: 1 }],
      [{ w: "sine", v: 0.3, a: 0.03, s: 1 }],
      [{ w: "triangle", v: 0.3, a: 0.05, s: 1 }],
      [{ w: "sawtooth", v: 0.5, a: 0.01, d: 0.1 }],
      /* 57-64 : Brass */
      [{ w: "square", v: 0.3, a: 0.05, d: 0.2, s: 0.6 }],
      [{ w: "square", v: 0.3, a: 0.05, d: 0.2, s: 0.6 }],
      [{ w: "square", v: 0.3, a: 0.05, d: 0.2, s: 0.6 }],
      [{ w: "square", v: 0.2, a: 0.05, d: 0.01, s: 1 }],
      [{ w: "square", v: 0.3, a: 0.05, s: 1 }],
      [{ w: "square", v: 0.3, s: 0.7 }],
      [{ w: "square", v: 0.3, s: 0.7 }],
      [{ w: "square", v: 0.3, s: 0.7 }],
      /* 65-72 : Reed */
      [{ w: "square", v: 0.3, a: 0.02, d: 2 }],
      [{ w: "square", v: 0.3, a: 0.02, d: 2 }],
      [{ w: "square", v: 0.3, a: 0.03, d: 2 }],
      [{ w: "square", v: 0.3, a: 0.04, d: 2 }],
      [{ w: "square", v: 0.3, a: 0.02, d: 2 }],
      [{ w: "square", v: 0.3, a: 0.05, d: 2 }],
      [{ w: "square", v: 0.3, a: 0.03, d: 2 }],
      [{ w: "square", v: 0.3, a: 0.03, d: 2 }],
      /* 73-80 : Pipe */
      [{ w: "sine", v: 0.7, a: 0.02, d: 2 }],
      [{ w: "sine", v: 0.7, a: 0.02, d: 2 }],
      [{ w: "sine", v: 0.7, a: 0.02, d: 2 }],
      [{ w: "sine", v: 0.7, a: 0.02, d: 2 }],
      [{ w: "sine", v: 0.7, a: 0.02, d: 2 }],
      [{ w: "sine", v: 0.7, a: 0.02, d: 2 }],
      [{ w: "sine", v: 0.7, a: 0.02, d: 2 }],
      [{ w: "sine", v: 0.7, a: 0.02, d: 2 }],
      /* 81-88 : SynthLead */
      [{ w: "square", v: 0.3, s: 0.7 }],
      [{ w: "sawtooth", v: 0.4, s: 0.7 }],
      [{ w: "triangle", v: 0.5, s: 0.7 }],
      [{ w: "sawtooth", v: 0.4, s: 0.7 }],
      [{ w: "sawtooth", v: 0.4, d: 12 }],
      [{ w: "sine", v: 0.4, a: 0.06, d: 12 }],
      [{ w: "sawtooth", v: 0.4, d: 12 }],
      [{ w: "sawtooth", v: 0.4, d: 12 }],
      /* 89-96 : SynthPad */
      [{ w: "sawtooth", v: 0.3, d: 12 }],
      [{ w: "triangle", v: 0.5, d: 12 }],
      [{ w: "square", v: 0.3, d: 12 }],
      [{ w: "triangle", v: 0.5, a: 0.08, d: 11 }],
      [{ w: "sawtooth", v: 0.5, a: 0.05, d: 11 }],
      [{ w: "sawtooth", v: 0.5, d: 11 }],
      [{ w: "triangle", v: 0.5, d: 11 }],
      [{ w: "triangle", v: 0.5, d: 11 }],
      /* 97-104 : FX */
      [{ w: "triangle", v: 0.5, d: 11 }],
      [{ w: "triangle", v: 0.5, d: 11 }],
      [{ w: "square", v: 0.3, d: 11 }],
      [{ w: "sawtooth", v: 0.5, a: 0.04, d: 11 }],
      [{ w: "sawtooth", v: 0.5, d: 11 }],
      [{ w: "triangle", v: 0.5, a: 0.8, d: 11 }],
      [{ w: "triangle", v: 0.5, d: 11 }],
      [{ w: "square", v: 0.3, d: 11 }],
      /* 105-112 : Ethnic */
      [{ w: "sawtooth", v: 0.3, d: 1, r: 1 }],
      [{ w: "sawtooth", v: 0.5, d: 0.3 }],
      [{ w: "sawtooth", v: 0.5, d: 0.3, r: 0.3 }],
      [{ w: "sawtooth", v: 0.5, d: 0.3, r: 0.3 }],
      [{ w: "square", v: 0.3, d: 0.2, r: 0.2 }],
      [{ w: "square", v: 0.3, a: 0.02, d: 2 }],
      [{ w: "sawtooth", v: 0.2, a: 0.02, d: 0.7 }],
      [{ w: "triangle", v: 0.5, d: 1 }],
      /* 113-120 : Percussive */
      [{ w: "sawtooth", v: 0.3, d: 0.3, r: 0.3 }],
      [{ w: "sine", v: 0.8, d: 0.1, r: 0.1 }],
      [{ w: "square", v: 0.2, d: 0.1, r: 0.1, p: 1.05 }],
      [{ w: "sine", v: 0.8, d: 0.05, r: 0.05 }],
      [{ w: "triangle", v: 0.5, d: 0.1, r: 0.1, p: 0.96 }],
      [{ w: "triangle", v: 0.5, d: 0.1, r: 0.1, p: 0.97 }],
      [{ w: "square", v: 0.3, d: 0.1, r: 0.1 }],
      [{ w: "n1", v: 0.3, a: 1, s: 1, d: 0.15, r: 0, t: 0.5 }],
      /* 121-128 : SE */
      [{ w: "triangle", v: 0.5, d: 0.03, t: 0, f: 1332, r: 0.001, p: 1.1 }],
      [{ w: "n0", v: 0.2, t: 0.1, d: 0.02, a: 0.05, h: 0.02, r: 0.02 }],
      [{ w: "n0", v: 0.4, a: 1, d: 1, t: 0.25 }],
      [{ w: "sine", v: 0.3, a: 0.8, d: 1, t: 0, f: 1832 }],
      [{ w: "triangle", d: 0.5, t: 0, f: 444, s: 1 }],
      [{ w: "n0", v: 0.4, d: 1, t: 0, f: 22, s: 1 }],
      [{ w: "n0", v: 0.5, a: 0.2, d: 11, t: 0, f: 44 }],
      [{ w: "n0", v: 0.5, t: 0.25, d: 0.4, r: 0.4 }]
    ],
    drummap1: [
      /*35*/ [
        { w: "triangle", t: 0, f: 70, v: 1, d: 0.05, h: 0.03, p: 0.9, q: 0.1 },
        { w: "n0", g: 1, t: 6, v: 17, r: 0.01, h: 0, p: 0 }
      ],
      [
        { w: "triangle", t: 0, f: 88, v: 1, d: 0.05, h: 0.03, p: 0.5, q: 0.1 },
        { w: "n0", g: 1, t: 5, v: 42, r: 0.01, h: 0, p: 0 }
      ],
      [{ w: "n0", f: 222, p: 0, t: 0, r: 0.01, h: 0 }],
      [
        {
          w: "triangle",
          v: 0.3,
          f: 180,
          d: 0.05,
          t: 0,
          h: 0.03,
          p: 0.9,
          q: 0.1
        },
        { w: "n0", v: 0.6, t: 0, f: 70, h: 0.02, r: 0.01, p: 0 },
        { g: 1, w: "square", v: 2, t: 0, f: 360, r: 0.01, b: 0, c: 0 }
      ],
      [
        { w: "square", f: 1150, v: 0.34, t: 0, r: 0.03, h: 0.025, d: 0.03 },
        { g: 1, w: "n0", t: 0, f: 13, h: 0.025, d: 0.1, s: 1, r: 0.1, v: 1 }
      ],
      /*40*/ [
        { w: "triangle", f: 200, v: 1, d: 0.06, t: 0, r: 0.06 },
        { w: "n0", g: 1, t: 0, f: 400, v: 12, r: 0.02, d: 0.02 }
      ],
      [
        {
          w: "triangle",
          f: 100,
          v: 0.9,
          d: 0.12,
          h: 0.02,
          p: 0.5,
          t: 0,
          r: 0.12
        },
        { g: 1, w: "n0", v: 5, t: 0.4, h: 0.015, d: 0.005, r: 0.005 }
      ],
      [{ w: "n1", f: 390, v: 0.25, r: 0.01, t: 0 }],
      [
        {
          w: "triangle",
          f: 120,
          v: 0.9,
          d: 0.12,
          h: 0.02,
          p: 0.5,
          t: 0,
          r: 0.12
        },
        { g: 1, w: "n0", v: 5, t: 0.5, h: 0.015, d: 0.005, r: 0.005 }
      ],
      [{ w: "n1", v: 0.25, f: 390, r: 0.03, t: 0, h: 0.005, d: 0.03 }],
      /*45*/ [
        {
          w: "triangle",
          f: 140,
          v: 0.9,
          d: 0.12,
          h: 0.02,
          p: 0.5,
          t: 0,
          r: 0.12
        },
        { g: 1, w: "n0", v: 5, t: 0.3, h: 0.015, d: 0.005, r: 0.005 }
      ],
      [
        { w: "n1", v: 0.25, f: 390, t: 0, d: 0.2, r: 0.2 },
        { w: "n0", v: 0.3, t: 0, c: 0, f: 440, h: 0.005, d: 0.05 }
      ],
      [
        {
          w: "triangle",
          f: 155,
          v: 0.9,
          d: 0.12,
          h: 0.02,
          p: 0.5,
          t: 0,
          r: 0.12
        },
        { g: 1, w: "n0", v: 5, t: 0.3, h: 0.015, d: 0.005, r: 0.005 }
      ],
      [
        {
          w: "triangle",
          f: 180,
          v: 0.9,
          d: 0.12,
          h: 0.02,
          p: 0.5,
          t: 0,
          r: 0.12
        },
        { g: 1, w: "n0", v: 5, t: 0.3, h: 0.015, d: 0.005, r: 0.005 }
      ],
      [
        { w: "n1", v: 0.3, f: 1200, d: 0.2, r: 0.2, h: 0.05, t: 0 },
        { w: "n1", t: 0, v: 1, d: 0.1, r: 0.1, p: 1.2, f: 440 }
      ],
      /*50*/ [
        {
          w: "triangle",
          f: 220,
          v: 0.9,
          d: 0.12,
          h: 0.02,
          p: 0.5,
          t: 0,
          r: 0.12
        },
        { g: 1, w: "n0", v: 5, t: 0.3, h: 0.015, d: 0.005, r: 0.005 }
      ],
      [
        { w: "n1", f: 500, v: 0.15, d: 0.4, r: 0.4, h: 0, t: 0 },
        { w: "n0", v: 0.1, t: 0, r: 0.01, f: 440 }
      ],
      [
        { w: "n1", v: 0.3, f: 800, d: 0.2, r: 0.2, h: 0.05, t: 0 },
        { w: "square", t: 0, v: 1, d: 0.1, r: 0.1, p: 0.1, f: 220, g: 1 }
      ],
      [
        { w: "sine", f: 1651, v: 0.15, d: 0.2, r: 0.2, h: 0, t: 0 },
        { w: "sawtooth", g: 1, t: 1.21, v: 7.2, d: 0.1, r: 11, h: 1 },
        { g: 1, w: "n0", v: 3.1, t: 0.152, d: 0.002, r: 0.002 }
      ],
      null,
      /*55*/ [
        { w: "n1", v: 0.3, f: 1200, d: 0.2, r: 0.2, h: 0.05, t: 0 },
        { w: "n1", t: 0, v: 1, d: 0.1, r: 0.1, p: 1.2, f: 440 }
      ],
      null,
      [
        { w: "n1", v: 0.3, f: 555, d: 0.25, r: 0.25, h: 0.05, t: 0 },
        { w: "n1", t: 0, v: 1, d: 0.1, r: 0.1, f: 440, a: 0.005, h: 0.02 }
      ],
      [
        { w: "sawtooth", f: 776, v: 0.2, d: 0.3, t: 0, r: 0.3 },
        {
          g: 1,
          w: "n0",
          v: 2,
          t: 0,
          f: 776,
          a: 0.005,
          h: 0.02,
          d: 0.1,
          s: 1,
          r: 0.1,
          c: 0
        },
        { g: 11, w: "sine", v: 0.1, t: 0, f: 22, d: 0.3, r: 0.3, b: 0, c: 0 }
      ],
      [
        { w: "n1", f: 440, v: 0.15, d: 0.4, r: 0.4, h: 0, t: 0 },
        { w: "n0", v: 0.4, t: 0, r: 0.01, f: 440 }
      ],
      /*60*/ null,
      null,
      null,
      null,
      null,
      /*65*/ null,
      null,
      null,
      null,
      null,
      /*70*/ null,
      null,
      null,
      null,
      null,
      /*75*/ null,
      null,
      null,
      null,
      null,
      /*80*/ [
        { w: "sine", f: 1720, v: 0.3, d: 0.02, t: 0, r: 0.02 },
        { w: "square", g: 1, t: 0, f: 2876, v: 6, d: 0.2, s: 1, r: 0.2 }
      ],
      [
        { w: "sine", f: 1720, v: 0.3, d: 0.25, t: 0, r: 0.25 },
        { w: "square", g: 1, t: 0, f: 2876, v: 6, d: 0.2, s: 1, r: 0.2 }
      ]
    ],
    drummap0: [
      /*35*/ [{ w: "triangle", t: 0, f: 110, v: 1, d: 0.05, h: 0.02, p: 0.1 }],
      [
        {
          w: "triangle",
          t: 0,
          f: 150,
          v: 0.8,
          d: 0.1,
          p: 0.1,
          h: 0.02,
          r: 0.01
        }
      ],
      [{ w: "n0", f: 392, v: 0.5, d: 0.01, p: 0, t: 0, r: 0.05 }],
      [{ w: "n0", f: 33, d: 0.05, t: 0 }],
      [{ w: "n0", f: 100, v: 0.7, d: 0.03, t: 0, r: 0.03, h: 0.02 }],
      /*40*/ [{ w: "n0", f: 44, v: 0.7, d: 0.02, p: 0.1, t: 0, h: 0.02 }],
      [{ w: "triangle", f: 240, v: 0.9, d: 0.1, h: 0.02, p: 0.1, t: 0 }],
      [{ w: "n0", f: 440, v: 0.2, r: 0.01, t: 0 }],
      [{ w: "triangle", f: 270, v: 0.9, d: 0.1, h: 0.02, p: 0.1, t: 0 }],
      [{ w: "n0", f: 440, v: 0.2, d: 0.04, r: 0.04, t: 0 }],
      /*45*/ [{ w: "triangle", f: 300, v: 0.9, d: 0.1, h: 0.02, p: 0.1, t: 0 }],
      [{ w: "n0", f: 440, v: 0.2, d: 0.1, r: 0.1, h: 0.02, t: 0 }],
      [{ w: "triangle", f: 320, v: 0.9, d: 0.1, h: 0.02, p: 0.1, t: 0 }],
      [{ w: "triangle", f: 360, v: 0.9, d: 0.1, h: 0.02, p: 0.1, t: 0 }],
      [{ w: "n0", f: 150, v: 0.2, d: 0.1, r: 0.1, h: 0.05, t: 0, p: 0.1 }],
      /*50*/ [{ w: "triangle", f: 400, v: 0.9, d: 0.1, h: 0.02, p: 0.1, t: 0 }],
      [{ w: "n0", f: 150, v: 0.2, d: 0.1, r: 0.01, h: 0.05, t: 0, p: 0.1 }],
      [{ w: "n0", f: 150, v: 0.2, d: 0.1, r: 0.01, h: 0.05, t: 0, p: 0.1 }],
      [{ w: "n0", f: 440, v: 0.3, d: 0.1, p: 0.9, t: 0, r: 0.1 }],
      [{ w: "n0", f: 200, v: 0.2, d: 0.05, p: 0.9, t: 0 }],
      /*55*/ [{ w: "n0", f: 440, v: 0.3, d: 0.12, p: 0.9, t: 0 }],
      [{ w: "sine", f: 800, v: 0.4, d: 0.06, t: 0 }],
      [{ w: "n0", f: 150, v: 0.2, d: 0.1, r: 0.01, h: 0.05, t: 0, p: 0.1 }],
      [{ w: "n0", f: 33, v: 0.3, d: 0.2, p: 0.9, t: 0 }],
      [{ w: "n0", f: 300, v: 0.3, d: 0.14, p: 0.9, t: 0 }],
      /*60*/ [{ w: "sine", f: 200, d: 0.06, t: 0 }],
      [{ w: "sine", f: 150, d: 0.06, t: 0 }],
      [{ w: "sine", f: 300, t: 0 }],
      [{ w: "sine", f: 300, d: 0.06, t: 0 }],
      [{ w: "sine", f: 250, d: 0.06, t: 0 }],
      /*65*/ [{ w: "square", f: 300, v: 0.3, d: 0.06, p: 0.8, t: 0 }],
      [{ w: "square", f: 260, v: 0.3, d: 0.06, p: 0.8, t: 0 }],
      [{ w: "sine", f: 850, v: 0.5, d: 0.07, t: 0 }],
      [{ w: "sine", f: 790, v: 0.5, d: 0.07, t: 0 }],
      [{ w: "n0", f: 440, v: 0.3, a: 0.05, t: 0 }],
      /*70*/ [{ w: "n0", f: 440, v: 0.3, a: 0.05, t: 0 }],
      [{ w: "triangle", f: 1800, v: 0.4, p: 0.9, t: 0, h: 0.03 }],
      [{ w: "triangle", f: 1800, v: 0.3, p: 0.9, t: 0, h: 0.13 }],
      [{ w: "n0", f: 330, v: 0.3, a: 0.02, t: 0, r: 0.01 }],
      [{ w: "n0", f: 330, v: 0.3, a: 0.02, t: 0, h: 0.04, r: 0.01 }],
      /*75*/ [{ w: "n0", f: 440, v: 0.3, t: 0 }],
      [{ w: "sine", f: 800, t: 0 }],
      [{ w: "sine", f: 700, t: 0 }],
      [{ w: "n0", f: 330, v: 0.3, t: 0 }],
      [{ w: "n0", f: 330, v: 0.3, t: 0, h: 0.1, r: 0.01, p: 0.7 }],
      /*80*/ [{ w: "sine", t: 0, f: 1200, v: 0.3, r: 0.01 }],
      [{ w: "sine", t: 0, f: 1200, v: 0.3, d: 0.2, r: 0.2 }]
    ],
    init: () => {
      const that = this;
      that.pg = [];
      that.vol = [];
      that.ex = [];
      that.bend = [];
      that.rpnidx = [];
      that.brange = [];
      that.sustain = [];
      that.notetab = [];
      that.rhythm = [];
      that.masterTuningC = 0;
      that.masterTuningF = 0;
      that.tuningC = [];
      that.tuningF = [];
      (that.maxTick = 0), (that.playTick = 0), (that.playing = 0);
      that.releaseRatio = 3.5;
      for (let i = 0; i < 16; ++i) {
        that.pg[i] = 0;
        that.vol[i] = (3 * 100 * 100) / (127 * 127);
        that.bend[i] = 0;
        that.brange[i] = 0x100;
        that.tuningC[i] = 0;
        that.tuningF[i] = 0;
        that.rhythm[i] = 0;
      }
      that.rhythm[9] = 1;
      that.preroll = 0.2;
      that.relcnt = 0;
      const callback = () => {
        if (++that.relcnt >= 3) {
          that.relcnt = 0;
          for (let i = that.notetab.length - 1; i >= 0; --i) {
            const nt = that.notetab[i];
            if (that.audioContext.currentTime > nt.e) {
              that._pruneNote(nt);
              that.notetab.splice(i, 1);
            }
          }
        }
        if (that.playing && that.song.ev.length > 0) {
          let e = that.song.ev[that.playIndex];
          while (that.audioContext.currentTime + that.preroll > that.playTime) {
            if (e.m[0] == 0xff51) {
              that.song.tempo = e.m[1];
              that.tick2Time = (4 * 60) / that.song.tempo / that.song.timebase;
            } else that.send(e.m, that.playTime);
            ++that.playIndex;
            if (that.playIndex >= that.song.ev.length) {
              if (that.loop) {
                e = that.song.ev[(that.playIndex = 0)];
                that.playTick = e.t;
              } else {
                that.playTick = that.maxTick;
                that.playing = 0;
                break;
              }
            } else {
              e = that.song.ev[that.playIndex];
              that.playTime += (e.t - that.playTick) * that.tick2Time;
              that.playTick = e.t;
            }
          }
        }
        requestAnimationFrame(callback);
      };

      requestAnimationFrame(callback);
      if (that.internalcontext) {
        that.setAudioContext(new AudioContext());
      }
      that.isReady = 1;
    },
    setMasterVol: (v) => {
      const that = this;
      if (v != undefined) that.masterVol = v;
      if (that.out) that.out.gain.value = that.masterVol;
    },
    setReverbLev: (v) => {
      const that = this;
      if (v != undefined) that.reverbLev = v;
      const r = parseFloat(that.reverbLev);
      if (that.rev && !isNaN(r)) that.rev.gain.value = r * 8;
    },
    setLoop: (f) => {
      const that = this;
      that.loop = f;
    },
    setVoices: (v) => {
      const that = this;
      that.voices = v;
    },
    getPlayStatus: () => {
      const that = this;
      return {
        play: that.playing,
        maxTick: that.maxTick,
        curTick: that.playTick
      };
    },
    locateMIDI: (tick) => {
      const that = this;
      let i,
        p = that.playing;
      that.pause();
      for (i = 0; i < that.song.ev.length && tick > that.song.ev[i].t; ++i) {
        const m = that.song.ev[i];
        const ch = m.m[0] & 0xf;
        switch (m.m[0] & 0xf0) {
          case 0xb0:
            switch (m.m[1]) {
              case 1:
                that.setModulation(ch, m.m[2]);
                break;
              case 7:
                that.setChVol(ch, m.m[2]);
                break;
              case 10:
                that.setPan(ch, m.m[2]);
                break;
              case 11:
                that.setExpression(ch, m.m[2]);
                break;
              case 64:
                that.setSustain(ch, m.m[2]);
                break;
            }
            break;
          case 0xc0:
            that.pg[m.m[0] & 0x0f] = m.m[1];
            break;
        }
        if (m.m[0] == 0xff51) that.song.tempo = m.m[1];
      }
      if (!that.song.ev[i]) {
        that.playIndex = 0;
        that.playTick = that.maxTick;
      } else {
        that.playIndex = i;
        that.playTick = that.song.ev[i].t;
      }
      if (p) that.playMIDI();
    },
    getTimbreName: (m, n) => {
      const that = this;
      if (m == 0) return that.program[n].name;
      else return that.drummap[n - 35].name;
    },
    reset: () => {
      const that = this;
      for (let i = 0; i < 16; ++i) {
        that.setProgram(i, 0);
        that.setBendRange(i, 0x100);
        that.setModulation(i, 0);
        that.setChVol(i, 100);
        that.setPan(i, 64);
        that.resetAllControllers(i);
        that.allSoundOff(i);
        that.rhythm[i] = 0;
        that.tuningC[i] = 0;
        that.tuningF[i] = 0;
      }
      that.masterTuningC = 0;
      that.masterTuningF = 0;
      that.rhythm[9] = 1;
    },
    pause: () => {
      const that = this;
      that.playing = 0;
      for (let i = 0; i < 16; ++i) {
        that.allSoundOff(i);
      }
    },
    resume: () => {
      const that = this;
      if (!that.song) return;
      const dummy = that.audioContext.createOscillator();
      dummy.connect(that.audioContext.destination);
      dummy.frequency.value = 0;
      dummy.start(0);
      dummy.stop(that.audioContext.currentTime + 0.001);
      if (that.playTick >= that.maxTick)
        (that.playTick = 0), (that.playIndex = 0);
      that.playTime = that.audioContext.currentTime + 0.1;
      that.tick2Time = (4 * 60) / that.song.tempo / that.song.timebase;
      that.playing = 1;
    },
    play: ({ data, masterVolume = 0.1 }) => {
      const that = this;
      that.setMasterVol(masterVolume);
      function Get2(s, i) {
        return (s[i] << 8) + s[i + 1];
      }
      function Get3(s, i) {
        return (s[i] << 16) + (s[i + 1] << 8) + s[i + 2];
      }
      function Get4(s, i) {
        return (s[i] << 24) + (s[i + 1] << 16) + (s[i + 2] << 8) + s[i + 3];
      }
      function GetStr(s, i, len) {
        return String.fromCharCode.apply(null, s.slice(i, i + len));
      }
      function Delta(s, i) {
        let v = 0,
          d;
        datalen = 1;
        while ((d = s[i]) & 0x80) {
          v = (v << 7) + (d & 0x7f);
          ++datalen;
          ++i;
        }
        return (v << 7) + d;
      }
      function Msg(song, tick, s, i) {
        let v = s[i];
        datalen = 1;
        if ((v & 0x80) == 0) (v = runst), (datalen = 0);
        runst = v;
        let len, exd, val;
        switch (v & 0xf0) {
          case 0xc0:
          case 0xd0:
            song.ev.push({ t: tick, m: [v, s[i + datalen]] });
            datalen += 1;
            break;
          case 0xf0:
            switch (v) {
              case 0xf0:
              case 0xf7:
                len = Delta(s, i + 1);
                datastart = 1 + datalen;
                exd = Array.from(s.slice(i + datastart, i + datastart + len));
                exd.unshift(0xf0);
                song.ev.push({ t: tick, m: exd });
                /*
                var sysex=[];
                for(var jj=0;jj<len;++jj)
                  sysex.push(s[i+datastart+jj].toString(16));
                console.log(sysex);
                */
                datalen += len + 1;
                break;
              case 0xff:
                len = Delta(s, i + 2);
                datastart = 2 + datalen;
                datalen = len + datalen + 2;
                switch (s[i + 1]) {
                  case 0x02:
                    song.copyright += GetStr(s, i + datastart, datalen - 3);
                    break;
                  case 0x01:
                  case 0x03:
                  case 0x04:
                  case 0x09:
                    song.text = GetStr(s, i + datastart, datalen - datastart);
                    break;
                  case 0x2f:
                    return 1;
                  case 0x51:
                    val = Math.floor(60000000 / Get3(s, i + 3));
                    song.ev.push({ t: tick, m: [0xff51, val] });
                    break;
                }
                break;
            }
            break;
          default:
            song.ev.push({
              t: tick,
              m: [v, s[i + datalen], s[i + datalen + 1]]
            });
            datalen += 2;
        }
        return 0;
      }
      that.pause();
      const s = new Uint8Array(data);
      let datalen = 0,
        datastart = 0,
        runst = 0x90;
      let idx = 0;
      let hd = s.slice(0, 4);
      if (hd.toString() != "77,84,104,100") {
        //MThd
        return;
      }
      let len = Get4(s, 4);
      // var fmt = Get2(s, 8);
      const numtrk = Get2(s, 10);
      that.maxTick = 0;
      const tb = Get2(s, 12) * 4;
      idx = len + 8;
      that.song = { copyright: "", text: "", tempo: 120, timebase: tb, ev: [] };
      for (let tr = 0; tr < numtrk; ++tr) {
        hd = s.slice(idx, idx + 4);
        len = Get4(s, idx + 4);
        if (hd.toString() == "77,84,114,107") {
          //MTrk
          let tick = 0;
          let j = 0;
          that.notetab.length = 0;
          for (;;) {
            tick += Delta(s, idx + 8 + j);
            j += datalen;
            const e = Msg(that.song, tick, s, idx + 8 + j);
            j += datalen;
            if (e) break;
          }
          if (tick > that.maxTick) that.maxTick = tick;
        }
        idx += len + 8;
      }
      that.song.ev.sort((x, y) => {
        return x.t - y.t;
      });
      that.reset();
      that.locateMIDI(0);
      that.resume();
    },
    setQuality: (q) => {
      const that = this;
      if (q != undefined) that.quality = q;
      for (let i = 0; i < 128; ++i) that.setTimbre(0, i, that.program0[i]);
      for (let i = 0; i < that.drummap0.length; ++i)
        that.setTimbre(1, i + 35, that.drummap0[i]);
      if (that.quality) {
        for (let i = 0; i < that.program1.length; ++i)
          that.setTimbre(0, i, that.program1[i]);
        for (let i = 0; i < that.drummap.length; ++i) {
          if (that.drummap1[i]) that.setTimbre(1, i + 35, that.drummap1[i]);
        }
      }
    },
    setTimbre: (m, n, p) => {
      const that = this;
      const defp = {
        g: 0,
        w: "sine",
        t: 1,
        f: 0,
        v: 0.5,
        a: 0,
        h: 0.01,
        d: 0.01,
        s: 0,
        r: 0.05,
        p: 1,
        q: 1,
        k: 0
      };
      function filldef(p) {
        for (n = 0; n < p.length; ++n) {
          for (let k in defp) {
            if (Object.hasOwn(!p[n], k) || typeof p[n][k] == "undefined")
              p[n][k] = defp[k];
          }
        }
        return p;
      }
      if (m && n >= 35 && n <= 81) that.drummap[n - 35].p = filldef(p);
      if (m == 0 && n >= 0 && n <= 127) that.program[n].p = filldef(p);
    },
    _pruneNote: (nt) => {
      const that = this;
      for (let k = nt.o.length - 1; k >= 0; --k) {
        if (nt.o[k].frequency) {
          nt.o[k].frequency.cancelScheduledValues(0);
        } else {
          nt.o[k].playbackRate.cancelScheduledValues(0);
        }
        nt.g[k].gain.cancelScheduledValues(0);

        nt.o[k].stop();
        if (nt.o[k].detune) {
          try {
            that.chmod[nt.ch].disconnect(nt.o[k].detune);
          } catch (e) {
            // ignored
          }
        }
        nt.g[k].gain.value = 0;
      }
    },
    _limitVoices: (/*ch, n*/) => {
      const that = this;
      that.notetab.sort((n1, n2) => {
        if (n1.f != n2.f) return n1.f - n2.f;
        if (n1.e != n2.e) return n2.e - n1.e;
        return n2.t - n1.t;
      });
      for (let i = that.notetab.length - 1; i >= 0; --i) {
        const nt = that.notetab[i];
        if (that.audioContext.currentTime > nt.e || i >= that.voices - 1) {
          that._pruneNote(nt);
          that.notetab.splice(i, 1);
        }
      }
    },
    _note: (t, ch, n, v, p) => {
      const that = this;
      let out, sc, pn;
      const o = [],
        g = [],
        vp = [],
        fp = [],
        r = [];
      const f =
        440 *
        Math.pow(
          2,
          (n -
            69 +
            that.masterTuningC +
            that.tuningC[ch] +
            (that.masterTuningF + that.tuningF[ch]) / 8192) /
            12
        );
      that._limitVoices(ch, n);
      for (let i = 0; i < p.length; ++i) {
        pn = p[i];
        const dt = t + pn.a + pn.h;
        if (pn.g == 0)
          (out = that.chvol[ch]),
            (sc = (v * v) / 16384),
            (fp[i] = f * pn.t + pn.f);
        else if (pn.g > 10)
          (out = g[pn.g - 11].gain),
            (sc = 1),
            (fp[i] = fp[pn.g - 11] * pn.t + pn.f);
        else if (o[pn.g - 1].frequency)
          (out = o[pn.g - 1].frequency),
            (sc = fp[pn.g - 1]),
            (fp[i] = fp[pn.g - 1] * pn.t + pn.f);
        else
          (out = o[pn.g - 1].playbackRate),
            (sc = fp[pn.g - 1] / 440),
            (fp[i] = fp[pn.g - 1] * pn.t + pn.f);
        switch (pn.w[0]) {
          case "n":
            o[i] = that.audioContext.createBufferSource();
            o[i].buffer = that.noiseBuf[pn.w];
            o[i].loop = true;
            o[i].playbackRate.value = fp[i] / 440;
            if (pn.p != 1)
              that._setParamTarget(
                o[i].playbackRate,
                (fp[i] / 440) * pn.p,
                t,
                pn.q
              );
            if (o[i].detune) {
              that.chmod[ch].connect(o[i].detune);
              o[i].detune.value = that.bend[ch];
            }
            break;
          default:
            o[i] = that.audioContext.createOscillator();
            o[i].frequency.value = fp[i];
            if (pn.p != 1)
              that._setParamTarget(o[i].frequency, fp[i] * pn.p, t, pn.q);
            if (pn.w[0] == "w") o[i].setPeriodicWave(that.wave[pn.w]);
            else o[i].type = pn.w;
            if (o[i].detune) {
              that.chmod[ch].connect(o[i].detune);
              o[i].detune.value = that.bend[ch];
            }
            break;
        }
        g[i] = that.audioContext.createGain();
        r[i] = pn.r;
        o[i].connect(g[i]);
        g[i].connect(out);
        vp[i] = sc * pn.v;
        if (pn.k) vp[i] *= Math.pow(2, ((n - 60) / 12) * pn.k);
        if (pn.a) {
          g[i].gain.value = 0;
          g[i].gain.setValueAtTime(0, t);
          g[i].gain.linearRampToValueAtTime(vp[i], t + pn.a);
        } else g[i].gain.setValueAtTime(vp[i], t);
        that._setParamTarget(g[i].gain, pn.s * vp[i], dt, pn.d);
        o[i].start(t);
        if (that.rhythm[ch]) {
          o[i].onended = () => {
            try {
              if (o[i].detune) that.chmod[ch].disconnect(o[i].detune);
            } catch (e) {
              // ignored
            }
          };
          o[i].stop(t + p[0].d * that.releaseRatio);
        }
      }
      if (!that.rhythm[ch])
        that.notetab.push({
          t: t,
          e: 99999,
          ch: ch,
          n: n,
          o: o,
          g: g,
          t2: t + pn.a,
          v: vp,
          r: r,
          f: 0
        });
    },
    _setParamTarget: (p, v, t, d) => {
      if (d != 0) p.setTargetAtTime(v, t, d);
      else p.setValueAtTime(v, t);
    },
    _releaseNote: (nt, t) => {
      const that = this;
      if (nt.ch != 9) {
        for (let k = nt.g.length - 1; k >= 0; --k) {
          nt.g[k].gain.cancelScheduledValues(t);
          if (t == nt.t2) nt.g[k].gain.setValueAtTime(nt.v[k], t);
          else if (t < nt.t2)
            nt.g[k].gain.setValueAtTime(
              (nt.v[k] * (t - nt.t)) / (nt.t2 - nt.t),
              t
            );
          that._setParamTarget(nt.g[k].gain, 0, t, nt.r[k]);
        }
      }
      nt.e = t + nt.r[0] * that.releaseRatio;
      nt.f = 1;
    },
    setModulation: (ch, v, t) => {
      const that = this;
      that.chmod[ch].gain.setValueAtTime((v * 100) / 127, that._tsConv(t));
    },
    setChVol: (ch, v, t) => {
      const that = this;
      that.vol[ch] = (3 * v * v) / (127 * 127);
      that.chvol[ch].gain.setValueAtTime(
        that.vol[ch] * that.ex[ch],
        that._tsConv(t)
      );
    },
    setPan: (ch, v, t) => {
      const that = this;
      if (that.chpan[ch])
        that.chpan[ch].pan.setValueAtTime((v - 64) / 64, that._tsConv(t));
    },
    setExpression: (ch, v, t) => {
      const that = this;
      that.ex[ch] = (v * v) / (127 * 127);
      that.chvol[ch].gain.setValueAtTime(
        that.vol[ch] * that.ex[ch],
        that._tsConv(t)
      );
    },
    setSustain: (ch, v, t) => {
      const that = this;
      that.sustain[ch] = v;
      t = that._tsConv(t);
      if (v < 64) {
        for (let i = that.notetab.length - 1; i >= 0; --i) {
          const nt = that.notetab[i];
          if (t >= nt.t && nt.ch == ch && nt.f == 1) that._releaseNote(nt, t);
        }
      }
    },
    allSoundOff: (ch) => {
      const that = this;
      for (let i = that.notetab.length - 1; i >= 0; --i) {
        const nt = that.notetab[i];
        if (nt.ch == ch) {
          that._pruneNote(nt);
          that.notetab.splice(i, 1);
        }
      }
    },
    resetAllControllers: (ch) => {
      const that = this;
      that.bend[ch] = 0;
      that.ex[ch] = 1.0;
      that.rpnidx[ch] = 0x3fff;
      that.sustain[ch] = 0;
      if (that.chvol[ch]) {
        that.chvol[ch].gain.value = that.vol[ch] * that.ex[ch];
        that.chmod[ch].gain.value = 0;
      }
    },
    setBendRange: (ch, v) => {
      const that = this;
      that.brange[ch] = v;
    },
    setProgram: (ch, v) => {
      const that = this;
      that.pg[ch] = v;
    },
    _tsConv: (t) => {
      const that = this;
      if (t == undefined || t <= 0) {
        t = 0;
        if (that.audioContext) t = that.audioContext.currentTime;
      } else {
        if (that.tsmode) t = t * 0.001 - that.tsdiff;
      }
      return t;
    },
    setBend: (ch, v, t) => {
      const that = this;
      t = that._tsConv(t);
      const br = (that.brange[ch] * 100) / 127;
      that.bend[ch] = ((v - 8192) * br) / 8192;
      for (let i = that.notetab.length - 1; i >= 0; --i) {
        const nt = that.notetab[i];
        if (nt.ch == ch) {
          for (let k = nt.o.length - 1; k >= 0; --k) {
            if (nt.o[k].frequency)
              if (nt.o[k].detune)
                nt.o[k].detune.setValueAtTime(that.bend[ch], t);
          }
        }
      }
    },
    noteOff: (ch, n, t) => {
      const that = this;
      if (that.rhythm[ch]) return;
      t = that._tsConv(t);
      for (let i = that.notetab.length - 1; i >= 0; --i) {
        const nt = that.notetab[i];
        if (t >= nt.t && nt.ch == ch && nt.n == n && nt.f == 0) {
          nt.f = 1;
          if (that.sustain[ch] < 64) that._releaseNote(nt, t);
        }
      }
    },
    noteOn: (ch, n, v, t) => {
      const that = this;
      if (v == 0) {
        that.noteOff(ch, n, t);
        return;
      }
      t = that._tsConv(t);
      if (that.rhythm[ch]) {
        if (n >= 35 && n <= 81) that._note(t, ch, n, v, that.drummap[n - 35].p);
        return;
      }
      that._note(t, ch, n, v, that.program[that.pg[ch]].p);
    },
    setTsMode: (tsmode) => {
      const that = this;
      that.tsmode = tsmode;
    },
    send: (msg, t) => {
      const that = this;
      /* send midi message */
      const ch = msg[0] & 0xf;
      const cmd = msg[0] & ~0xf;
      if (cmd < 0x80 || cmd >= 0x100) return;
      if (that.audioContext.state == "suspended") {
        that.audioContext.resume();
      }
      switch (cmd) {
        case 0xb0 /* ctl change */:
          switch (msg[1]) {
            case 1:
              that.setModulation(ch, msg[2], t);
              break;
            case 7:
              that.setChVol(ch, msg[2], t);
              break;
            case 10:
              that.setPan(ch, msg[2], t);
              break;
            case 11:
              that.setExpression(ch, msg[2], t);
              break;
            case 64:
              that.setSustain(ch, msg[2], t);
              break;
            case 98:
            case 99:
              that.rpnidx[ch] = 0x3fff;
              break; /* nrpn lsb/msb */
            case 100:
              that.rpnidx[ch] = (that.rpnidx[ch] & 0x3f80) | msg[2];
              break; /* rpn lsb */
            case 101:
              that.rpnidx[ch] = (that.rpnidx[ch] & 0x7f) | (msg[2] << 7);
              break; /* rpn msb */
            case 6 /* data entry msb */:
              switch (that.rpnidx[ch]) {
                case 0:
                  that.brange[ch] = (msg[2] << 7) + (that.brange[ch] & 0x7f);
                  break;
                case 1:
                  that.tuningF[ch] =
                    (msg[2] << 7) +
                    ((that.tuningF[ch] + 0x2000) & 0x7f) -
                    0x2000;
                  break;
                case 2:
                  that.tuningC[ch] = msg[2] - 0x40;
                  break;
              }
              break;
            case 38 /* data entry lsb */:
              switch (that.rpnidx[ch]) {
                case 0:
                  that.brange[ch] = (that.brange[ch] & 0x3f80) | msg[2];
                  break;
                case 1:
                  that.tuningF[ch] =
                    ((that.tuningF[ch] + 0x2000) & 0x3f80) | (msg[2] - 0x2000);
                  break;
                case 2:
                  break;
              }
              break;
            case 120: /* all sound off */
            case 123: /* all notes off */
            case 124:
            case 125:
            case 126:
            case 127 /* omni off/on mono/poly */:
              that.allSoundOff(ch);
              break;
            case 121:
              that.resetAllControllers(ch);
              break;
          }
          break;
        case 0xc0:
          that.setProgram(ch, msg[1]);
          break;
        case 0xe0:
          that.setBend(ch, msg[1] + (msg[2] << 7), t);
          break;
        case 0x90:
          that.noteOn(ch, msg[1], msg[2], t);
          break;
        case 0x80:
          that.noteOff(ch, msg[1], t);
          break;
        case 0xf0:
          if (msg[0] == 0xff) {
            that.reset();
            break;
          }
          /*
          if (msg[0] != 254 && that.debug) {
            const ds = [];
            for (let ii = 0; ii < msg.length; ++ii)
              ds.push(msg[ii].toString(16));
          }
          */
          if (msg[0] == 0xf0) {
            if (msg[1] == 0x7f && msg[3] == 4) {
              if (msg[4] == 3 && msg.length >= 8) {
                // Master Fine Tuning
                that.masterTuningF = msg[6] * 0x80 + msg[5] - 8192;
              }
              if (msg[4] == 4 && msg.length >= 8) {
                // Master Coarse Tuning
                that.masterTuningC = msg[6] - 0x40;
              }
            }
            if (
              msg[1] == 0x41 &&
              msg[3] == 0x42 &&
              msg[4] == 0x12 &&
              msg[5] == 0x40
            ) {
              if ((msg[6] & 0xf0) == 0x10 && msg[7] == 0x15) {
                const c = [
                  9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15
                ][msg[6] & 0xf];
                that.rhythm[c] = msg[8];
              }
            }
          }
          break;
      }
    },
    _createWave: (w) => {
      const that = this;
      const imag = new Float32Array(w.length);
      const real = new Float32Array(w.length);
      for (let i = 1; i < w.length; ++i) imag[i] = w[i];
      return that.audioContext.createPeriodicWave(real, imag);
    },
    getAudioContext: () => {
      const that = this;
      return that.audioContext;
    },
    setAudioContext: (audioContext, dest) => {
      const that = this;
      that.audioContext = that.audioContext = audioContext;
      that.dest = dest;
      if (!dest) that.dest = audioContext.destination;
      that.out = that.audioContext.createGain();
      that.comp = that.audioContext.createDynamicsCompressor();
      const blen = (that.audioContext.sampleRate * 0.5) | 0;
      that.convBuf = that.audioContext.createBuffer(
        2,
        blen,
        that.audioContext.sampleRate
      );
      that.noiseBuf = {};
      that.noiseBuf.n0 = that.audioContext.createBuffer(
        1,
        blen,
        that.audioContext.sampleRate
      );
      that.noiseBuf.n1 = that.audioContext.createBuffer(
        1,
        blen,
        that.audioContext.sampleRate
      );
      const d1 = that.convBuf.getChannelData(0);
      const d2 = that.convBuf.getChannelData(1);
      const dn = that.noiseBuf.n0.getChannelData(0);
      const dr = that.noiseBuf.n1.getChannelData(0);
      for (let i = 0; i < blen; ++i) {
        if (i / blen < Math.random()) {
          d1[i] = Math.exp((-3 * i) / blen) * (Math.random() - 0.5) * 0.5;
          d2[i] = Math.exp((-3 * i) / blen) * (Math.random() - 0.5) * 0.5;
        }
        dn[i] = Math.random() * 2 - 1;
      }
      for (let jj = 0; jj < 64; ++jj) {
        const r1 = Math.random() * 10 + 1;
        const r2 = Math.random() * 10 + 1;
        for (let i = 0; i < blen; ++i) {
          const dd =
            Math.sin((i / blen) * 2 * Math.PI * 440 * r1) *
            Math.sin((i / blen) * 2 * Math.PI * 440 * r2);
          dr[i] += dd / 8;
        }
      }
      if (that.useReverb) {
        that.conv = that.audioContext.createConvolver();
        that.conv.buffer = that.convBuf;
        that.rev = that.audioContext.createGain();
        that.rev.gain.value = that.reverbLev;
        that.out.connect(that.conv);
        that.conv.connect(that.rev);
        that.rev.connect(that.comp);
      }
      that.setMasterVol();
      that.out.connect(that.comp);
      that.comp.connect(that.dest);
      that.chvol = [];
      that.chmod = [];
      that.chpan = [];
      that.wave = { w9999: that._createWave("w9999") };
      that.lfo = that.audioContext.createOscillator();
      that.lfo.frequency.value = 5;
      that.lfo.start(0);
      for (let i = 0; i < 16; ++i) {
        that.chvol[i] = that.audioContext.createGain();
        if (that.audioContext.createStereoPanner) {
          that.chpan[i] = that.audioContext.createStereoPanner();
          that.chvol[i].connect(that.chpan[i]);
          that.chpan[i].connect(that.out);
        } else {
          that.chpan[i] = null;
          that.chvol[i].connect(that.out);
        }
        that.chmod[i] = that.audioContext.createGain();
        that.lfo.connect(that.chmod[i]);
        that.pg[i] = 0;
        that.resetAllControllers(i);
      }
      that.setReverbLev();
      that.reset();
      that.send([0x90, 60, 1]);
      that.send([0x90, 60, 0]);
    }
  });
}

class WebAudioTinySynth {
  constructor(opt) {
    const that = this;
    WebAudioTinySynthCore.bind(this)(this);
    for (let k in that.properties) {
      this[k] = that.properties[k].value;
    }
    that.setQuality(1);
    if (opt) {
      if (opt.useReverb != undefined) that.useReverb = opt.useReverb;
      if (opt.quality != undefined) that.setQuality(opt.quality);
      if (opt.voices != undefined) that.setVoices(opt.voices);
    }
    that.init();
  }
}

export default WebAudioTinySynth;
