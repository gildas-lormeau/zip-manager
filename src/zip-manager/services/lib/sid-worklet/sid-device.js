const SID_CHANNEL_AMOUNT = 3;
const OUTPUT_SCALEDOWN = 0x10000 * SID_CHANNEL_AMOUNT * 16;
const ENV_SCALE = 1 / 256;

const Bitmask = {
  GATE: 0x01,
  SYNC: 0x02,
  RING: 0x04,
  TEST: 0x08,
  TRI: 0x10,
  SAW: 0x20,
  PULSE: 0x40,
  NOISE: 0x80,
  HOLDZERO: 0x10,
  DECAYSUSTAIN: 0x40,
  ATTACK: 0x80,
  LOWPASS: 0x10,
  BANDPASS: 0x20,
  HIGHPASS: 0x40,
  OFF3: 0x80
};

// ADSR constants
const ADSRperiods = [
  0, 32, 63, 95, 149, 220, 267, 313, 392, 977, 1954, 3126, 3907, 11720, 19532,
  31251
];
const ADSRstep = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// Prescaler values that slow down the envelope-counter as it decays and approaches zero level
const ADSR_exptable = [
  1, 30, 30, 30, 30, 30, 30, 16, 16, 16, 16, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1
];

// Waveforms
function createCombineWaveForm(bitmul, bitstrength, treshold) {
  const waveform = Array.from({ length: 4096 });
  const attenuation = Array.from({ length: 12 }, (_, j) =>
    Array.from(
      { length: 12 },
      (_, k) => bitmul / bitstrength ** Math.abs(k - j)
    )
  );
  // Neighboring bits affect each other recursively
  for (let i = 0; i < 4096; i++) {
    let value = 0;
    //neighbour-bit strength and DAC MOSFET treshold is approximately set by ears'n'trials
    for (let j = 0; j < 12; j++) {
      let bitlevel = 0;
      for (let k = 0; k < 12; k++) {
        bitlevel += attenuation[j][k] * (((i >> k) & 1) - 0.5);
      }
      value += bitlevel >= treshold ? 2 ** j : 0;
    }
    waveform[i] = value * 12;
  }
  return waveform;
}

//precalculate combined waveform
const TriSaw_8580 = createCombineWaveForm(0.8, 2.4, 0.64);
const PulseSaw_8580 = createCombineWaveForm(1.4, 1.9, 0.68);
const PulseTriSaw_8580 = createCombineWaveForm(0.8, 2.5, 0.64);

export function createSID(memory, samplerate, clk_ratio, SID_model) {
  ADSRperiods[0] = Math.max(clk_ratio, 9);
  ADSRstep[0] = Math.ceil(ADSRperiods[0] / 9);

  //SID emulation constants
  const FILTSW = [1, 2, 4, 1, 2, 4, 1, 2, 4];
  const channelStateLength = SID_CHANNEL_AMOUNT * 3;
  const sidStateLength = 3;
  //SID emulation variables
  let stateByteOffset = 0;
  function reserveState(length, bytesPerElement) {
    stateByteOffset =
      Math.ceil(stateByteOffset / bytesPerElement) * bytesPerElement;
    const byteOffset = stateByteOffset;
    stateByteOffset += length * bytesPerElement;
    return byteOffset;
  }
  const ADSRstateOffset = reserveState(
    channelStateLength,
    Uint8Array.BYTES_PER_ELEMENT
  );
  const ratecntOffset = reserveState(
    channelStateLength,
    Float64Array.BYTES_PER_ELEMENT
  );
  const envcntOffset = reserveState(
    channelStateLength,
    Int16Array.BYTES_PER_ELEMENT
  );
  const expcntOffset = reserveState(
    channelStateLength,
    Uint8Array.BYTES_PER_ELEMENT
  );
  const prevSROffset = reserveState(
    channelStateLength,
    Uint8Array.BYTES_PER_ELEMENT
  );
  const phaseaccuOffset = reserveState(
    channelStateLength,
    Float64Array.BYTES_PER_ELEMENT
  );
  const prevaccuOffset = reserveState(
    channelStateLength,
    Float64Array.BYTES_PER_ELEMENT
  );
  const sourceMSBriseOffset = reserveState(
    sidStateLength,
    Uint8Array.BYTES_PER_ELEMENT
  );
  const sourceMSBOffset = reserveState(
    sidStateLength,
    Uint32Array.BYTES_PER_ELEMENT
  );
  const noiseLFSROffset = reserveState(
    channelStateLength,
    Uint32Array.BYTES_PER_ELEMENT
  );
  const prevwfoutOffset = reserveState(
    channelStateLength,
    Float64Array.BYTES_PER_ELEMENT
  );
  const prevwavdataOffset = reserveState(
    channelStateLength,
    Uint16Array.BYTES_PER_ELEMENT
  );
  const prevlowpassOffset = reserveState(
    sidStateLength,
    Float64Array.BYTES_PER_ELEMENT
  );
  const prevbandpassOffset = reserveState(
    sidStateLength,
    Float64Array.BYTES_PER_ELEMENT
  );
  const wfoutOffset = reserveState(1, Float64Array.BYTES_PER_ELEMENT);
  const cutoffOffset = reserveState(1, Float64Array.BYTES_PER_ELEMENT);
  const resonanceOffset = reserveState(1, Float64Array.BYTES_PER_ELEMENT);
  const filtinOffset = reserveState(1, Float64Array.BYTES_PER_ELEMENT);
  const outputOffset = reserveState(1, Float64Array.BYTES_PER_ELEMENT);
  const stateBuffer = new ArrayBuffer(stateByteOffset);
  const stateBytes = new Uint8Array(stateBuffer);
  const ADSRstate = new Uint8Array(
    stateBuffer,
    ADSRstateOffset,
    channelStateLength
  );
  const ratecnt = new Float64Array(
    stateBuffer,
    ratecntOffset,
    channelStateLength
  );
  const envcnt = new Int16Array(stateBuffer, envcntOffset, channelStateLength);
  const expcnt = new Uint8Array(stateBuffer, expcntOffset, channelStateLength);
  const prevSR = new Uint8Array(stateBuffer, prevSROffset, channelStateLength);
  const phaseaccu = new Float64Array(
    stateBuffer,
    phaseaccuOffset,
    channelStateLength
  );
  const prevaccu = new Float64Array(
    stateBuffer,
    prevaccuOffset,
    channelStateLength
  );
  const sourceMSBrise = new Uint8Array(
    stateBuffer,
    sourceMSBriseOffset,
    sidStateLength
  );
  const sourceMSB = new Uint32Array(
    stateBuffer,
    sourceMSBOffset,
    sidStateLength
  );
  const noise_LFSR = new Uint32Array(
    stateBuffer,
    noiseLFSROffset,
    channelStateLength
  );
  const prevwfout = new Float64Array(
    stateBuffer,
    prevwfoutOffset,
    channelStateLength
  );
  const prevwavdata = new Uint16Array(
    stateBuffer,
    prevwavdataOffset,
    channelStateLength
  );
  const prevlowpass = new Float64Array(
    stateBuffer,
    prevlowpassOffset,
    sidStateLength
  );
  const prevbandpass = new Float64Array(
    stateBuffer,
    prevbandpassOffset,
    sidStateLength
  );
  const wfout = new Float64Array(stateBuffer, wfoutOffset, 1);
  const cutoff = new Float64Array(stateBuffer, cutoffOffset, 1);
  const resonance = new Float64Array(stateBuffer, resonanceOffset, 1);
  const filtin = new Float64Array(stateBuffer, filtinOffset, 1);
  const output = new Float64Array(stateBuffer, outputOffset, 1);
  noise_LFSR.fill(0x7ffff8);
  const cutoff_ratio_8580 = (-2 * 3.14 * (12500 / 256)) / samplerate;
  const cutoff_ratio_6581 = (-2 * 3.14 * (20000 / 256)) / samplerate;

  function init() {
    for (let i = 0xd400; i <= 0xd7ff; i++) memory[i] = 0;
    for (let i = 0xde00; i <= 0xdfff; i++) memory[i] = 0;
    for (let i = 0; i < 9; i++) {
      ADSRstate[i] = Bitmask.HOLDZERO;
      ratecnt[i] = envcnt[i] = expcnt[i] = prevSR[i] = 0;
    }
  }

  function emulate(num, SIDaddr) {
    //the SID emulation itself ('num' is the number of SID to iterate (0..2)
    filtin[0] = 0;
    output[0] = 0;
    const channelStart = num * SID_CHANNEL_AMOUNT;
    const channelEnd = channelStart + SID_CHANNEL_AMOUNT;
    const filterRoute = memory[SIDaddr + 0x17];
    const volumeFilter = memory[SIDaddr + 0x18];

    //treating 2SID and 3SID channels uniformly (0..5 / 0..8), this probably avoids some extra code
    for (let channel = channelStart; channel < channelEnd; channel++) {
      const voiceIndex = channel - channelStart;
      const prevgate = ADSRstate[channel] & Bitmask.GATE;
      const chnadd = SIDaddr + voiceIndex * 7;
      const ctrl = memory[chnadd + 4];
      const wf = ctrl & 0xf0;
      const test = ctrl & Bitmask.TEST;
      const SR = memory[chnadd + 6];

      //ADSR envelope generator:
      let crispStart = 0;
      if (prevgate !== (ctrl & Bitmask.GATE)) {
        //gatebit-change?
        if (prevgate) {
          ADSRstate[channel] &=
            0xff - (Bitmask.GATE | Bitmask.ATTACK | Bitmask.DECAYSUSTAIN);
        } //falling edge (with Whittaker workaround this never happens, but should be here)
        else {
          ADSRstate[channel] =
            Bitmask.GATE | Bitmask.ATTACK | Bitmask.DECAYSUSTAIN;
          //rising edge, also sets hold_zero_bit=0
          if ((SR & 0xf) > (prevSR[channel] & 0xf)) crispStart = 1;
          //assume SR->GATE write order: workaround to have crisp soundstarts by triggering delay-bug
        }
        //(this is for the possible missed CTRL(GATE) vs SR register write order situations (1MHz CPU is cca 20 times faster than samplerate)
      }
      prevSR[channel] = SR;

      ratecnt[channel] += clk_ratio;
      if (ratecnt[channel] >= 0x8000) ratecnt[channel] -= 0x8000;
      //can wrap around (ADSR delay-bug: short 1st frame is usually achieved by utilizing this bug)

      //set ADSR period that should be checked against rate-counter (depending on ADSR state Attack/DecaySustain/Release)
      const periodStep =
        ADSRstate[channel] & Bitmask.ATTACK
          ? memory[chnadd + 5] >> 4
          : ADSRstate[channel] & Bitmask.DECAYSUSTAIN
            ? memory[chnadd + 5] & 0xf
            : SR & 0xf;
      const period = ADSRperiods[periodStep];
      const step = ADSRstep[periodStep];

      if (
        ratecnt[channel] >= period &&
        ratecnt[channel] < period + clk_ratio &&
        crispStart === 0
      ) {
        //ratecounter shot (matches rateperiod) (in genuine SID ratecounter is LFSR)
        ratecnt[channel] -= period;
        //compensation for timing instead of simply setting 0 on rate-counter overload
        if (
          ADSRstate[channel] & Bitmask.ATTACK ||
          ++expcnt[channel] === ADSR_exptable[envcnt[channel]]
        ) {
          if (!(ADSRstate[channel] & Bitmask.HOLDZERO)) {
            if (ADSRstate[channel] & Bitmask.ATTACK) {
              envcnt[channel] += step;
              if (envcnt[channel] >= 0xff) {
                envcnt[channel] = 0xff;
                ADSRstate[channel] &= 0xff - Bitmask.ATTACK;
              }
            } else if (
              !(ADSRstate[channel] & Bitmask.DECAYSUSTAIN) ||
              envcnt[channel] > (SR >> 4) + (SR & 0xf0)
            ) {
              envcnt[channel] -= step;
              if (envcnt[channel] <= 0 && envcnt[channel] + step !== 0) {
                envcnt[channel] = 0;
                ADSRstate[channel] |= Bitmask.HOLDZERO;
              }
            }
          }
          expcnt[channel] = 0;
        }
      }

      envcnt[channel] &= 0xff;
      //'envcnt' may wrap around in some cases, mostly 0 -> FF (e.g.: Cloudless Rain, Boombox Alley)

      //WAVE generation codes (phase accumulator and waveform-selector):  (They are explained in resid source, I won't go in details, the code speaks for itself.)
      const accuadd = (memory[chnadd] + memory[chnadd + 1] * 256) * clk_ratio;
      if (test || (ctrl & Bitmask.SYNC && sourceMSBrise[num])) {
        phaseaccu[channel] = 0;
      } else {
        phaseaccu[channel] += accuadd;
        if (phaseaccu[channel] > 0xffffff) phaseaccu[channel] -= 0x1000000;
      }
      const MSB = phaseaccu[channel] & 0x800000;
      sourceMSBrise[num] = MSB > (prevaccu[channel] & 0x800000) ? 1 : 0;
      //phaseaccu[channel] &= 0xFFFFFF;

      //waveform-selector:
      if (wf & Bitmask.NOISE) {
        //noise waveform
        let noiseLFSR = noise_LFSR[channel];
        if (
          (phaseaccu[channel] & 0x100000) !== (prevaccu[channel] & 0x100000) ||
          accuadd >= 0x100000
        ) {
          //clock LFSR all time if clockrate exceeds observable at given samplerate
          const step = (noiseLFSR & 0x400000) ^ ((noiseLFSR & 0x20000) << 5);
          noiseLFSR = ((noiseLFSR << 1) + +(step > 0 || test)) & 0x7fffff;
          noise_LFSR[channel] = noiseLFSR;
        }
        //we simply zero output when other waveform is mixed with noise. On real SID LFSR continuously gets filled by zero and locks up. ($C1 waveform with pw<8 can keep it for a while...)
        wfout[0] =
          wf & 0x70
            ? 0
            : ((noiseLFSR & 0x100000) >> 5) +
              ((noiseLFSR & 0x40000) >> 4) +
              ((noiseLFSR & 0x4000) >> 1) +
              ((noiseLFSR & 0x800) << 1) +
              ((noiseLFSR & 0x200) << 2) +
              ((noiseLFSR & 0x20) << 5) +
              ((noiseLFSR & 0x04) << 7) +
              ((noiseLFSR & 0x01) << 8);
      } else if (wf & Bitmask.PULSE) {
        //simple pulse
        let pw = (memory[chnadd + 2] + (memory[chnadd + 3] & 0xf) * 256) * 16;
        const pwMin = accuadd >> 9;
        if (pw > 0 && pw < pwMin) pw = pwMin;
        const pwMax = pwMin ^ 0xffff;
        if (pw > pwMax) pw = pwMax;

        const phase = phaseaccu[channel] >> 8;
        if (wf === Bitmask.PULSE) {
          const step = 256 / (accuadd >> 16);
          //simple pulse, most often used waveform, make it sound as clean as possible without oversampling
          //One of my biggest success with the SwinSID-variant was that I could clean the high-pitched and thin sounds.
          //(You might have faced with the unpleasant sound quality of high-pitched sounds without oversampling. We need so-called 'band-limited' synthesis instead.
          // There are a lot of articles about this issue on the internet. In a nutshell, the harsh edges produce harmonics that exceed the
          // Nyquist frequency (samplerate/2) and they are folded back into hearable range, producing unvanted ringmodulation-like effect.)
          //After so many trials with dithering/filtering/oversampling/etc. it turned out I can't eliminate the fukkin aliasing in time-domain, as suggested at pages.
          //Oversampling (running the wave-generation 8 times more) was not a way at 32MHz SwinSID. It might be an option on PC but I don't prefer it in JavaScript.)
          //The only solution that worked for me in the end, what I came up eventually: The harsh rising and falling edges of the pulse are
          //elongated making it a bit trapezoid. But not in time-domain, but altering the transfer-characteristics. This had to be done
          //in a frequency-dependent way, proportionally to pitch, to keep the deep sounds crisp. The following code does this (my favourite testcase is Robocop3 intro):
          if (test) {
            wfout[0] = 0xffff;
          } else if (phase < pw) {
            //rising edge
            let limit = (0xffff - pw) * step;
            if (limit > 0xffff) limit = 0xffff;
            wfout[0] = limit - (pw - phase) * step;
            if (wfout[0] < 0) wfout[0] = 0;
          } else {
            //falling edge
            let limit = pw * step;
            if (limit > 0xffff) limit = 0xffff;
            wfout[0] = (0xffff - phase) * step - limit;
            if (wfout[0] >= 0) wfout[0] = 0xffff;
            wfout[0] &= 0xffff;
          }
        } else if (phase >= pw || test) {
          //combined pulse
          //(this would be enough for simple but aliased-at-high-pitches pulse)
          wfout[0] = 0xffff;

          // pulse+triangle
          if (wf & Bitmask.TRI) {
            // pulse+triangle+saw (waveform nearly identical to tri+saw)
            if (wf & Bitmask.SAW) {
              wfout[0] = combinedWaveForm(
                num,
                channel,
                PulseTriSaw_8580,
                phase >> 4,
                1
              );
            } else {
              const value =
                phaseaccu[channel] ^ (ctrl & Bitmask.RING ? sourceMSB[num] : 0);
              wfout[0] = combinedWaveForm(
                num,
                channel,
                PulseSaw_8580,
                (value ^ (value & 0x800000 ? 0xffffff : 0)) >> 11,
                0
              );
            }
          } else if (wf & Bitmask.SAW) {
            //pulse+saw
            wfout[0] = combinedWaveForm(
              num,
              channel,
              PulseSaw_8580,
              phase >> 4,
              1
            );
          }
        } else {
          wfout[0] = 0;
        }
      } else if (wf & Bitmask.SAW) {
        //saw
        wfout[0] = phaseaccu[channel] >> 8;
        //saw (this row would be enough for simple but aliased-at-high-pitch saw)
        //The anti-aliasing (cleaning) of high-pitched sawtooth wave works by the same principle as mentioned above for the pulse,
        //but the sawtooth has even harsher edge/transition, and as the falling edge gets longer, tha rising edge should became shorter,
        //and to keep the amplitude, it should be multiplied a little bit (with reciprocal of rising-edge steepness).
        //The waveform at the output essentially becomes an asymmetric triangle, more-and-more approaching symmetric shape towards high frequencies.
        //(If you check a recording from the real SID, you can see a similar shape, the high-pitch sawtooth waves are triangle-like...)
        //But for deep sounds the sawtooth is really close to a sawtooth, as there is no aliasing there, but deep sounds should be sharp...
        if (wf & Bitmask.TRI) {
          //saw+triangle
          wfout[0] = combinedWaveForm(
            num,
            channel,
            TriSaw_8580,
            wfout[0] >> 4,
            1
          );
        } else {
          //simple cleaned (bandlimited) saw
          const step = accuadd / 0x1200000;
          wfout[0] += wfout[0] * step;
          if (wfout[0] > 0xffff) {
            wfout[0] = 0xffff - (wfout[0] - 0x10000) / step;
          }
        }
      } else if (wf & Bitmask.TRI) {
        //triangle (this waveform has no harsh edges, so it doesn't suffer from strong aliasing at high pitches)
        const value =
          phaseaccu[channel] ^ (ctrl & Bitmask.RING ? sourceMSB[num] : 0);
        wfout[0] = (value ^ (value & 0x800000 ? 0xffffff : 0)) >> 7;
      }

      prevwfout[channel] = wfout[0] = wf ? wfout[0] : prevwfout[channel];

      //emulate waveform 00 floating wave-DAC (on real SID waveform00 decays after 15s..50s depending on temperature?)
      prevaccu[channel] = phaseaccu[channel];
      sourceMSB[num] = MSB;
      //(So the decay is not an exact value. Anyway, we just simply keep the value to avoid clicks and support SounDemon digi later...)

      //routing the channel signal to either the filter or the unfiltered master output depending on filter-switch SID-registers
      const channelOutput = (wfout[0] - 0x8000) * (envcnt[channel] * ENV_SCALE);
      if (filterRoute & FILTSW[channel]) {
        filtin[0] += channelOutput;
      } else if (voiceIndex !== 2 || !(volumeFilter & Bitmask.OFF3)) {
        output[0] += channelOutput;
      }
    }

    //update readable SID-registers (some SID tunes might use 3rd channel ENV3/OSC3 value as control)
    if (memory[1] & 3) memory[SIDaddr + 0x1b] = wfout[0] >> 8;
    memory[SIDaddr + 0x1c] = envcnt[3];
    //OSC3, ENV3 (some players rely on it)

    //FILTER: two integrator loop bi-quadratic filter, workings learned from resid code, but I kindof simplified the equations
    //The phases of lowpass and highpass outputs are inverted compared to the input, but bandpass IS in phase with the input signal.
    //The 8580 cutoff frequency control-curve is ideal, while the 6581 has a treshold, and below it it outputs a constant lowpass frequency.
    const filterCutoffLo = memory[SIDaddr + 0x15];
    const filterCutoffHi = memory[SIDaddr + 0x16];
    cutoff[0] = (filterCutoffLo & 7) / 8 + filterCutoffHi + 0.2;
    if (SID_model[num] === 8580) {
      cutoff[0] = 1 - Math.exp(cutoff[0] * cutoff_ratio_8580);
      resonance[0] = 2 ** ((4 - (filterRoute >> 4)) / 8);
    } else {
      cutoff[0] =
        cutoff[0] < 24
          ? 0.035
          : 1 - 1.263 * Math.exp(cutoff[0] * cutoff_ratio_6581);
      resonance[0] = filterRoute > 0x5f ? 8 / (filterRoute >> 4) : 1.41;
    }
    let filterValue =
      filtin[0] + prevbandpass[num] * resonance[0] + prevlowpass[num];
    if (volumeFilter & Bitmask.HIGHPASS) output[0] -= filterValue;
    filterValue = prevbandpass[num] - filterValue * cutoff[0];
    prevbandpass[num] = filterValue;
    if (volumeFilter & Bitmask.BANDPASS) output[0] -= filterValue;
    filterValue = prevlowpass[num] + filterValue * cutoff[0];
    prevlowpass[num] = filterValue;
    if (volumeFilter & Bitmask.LOWPASS) output[0] += filterValue;

    //when it comes to $D418 volume-register digi playback, I made an AC / DC separation for $D418 value in the SwinSID at low (20Hz or so) cutoff-frequency,
    //and sent the AC (highpass) value to a 4th 'digi' channel mixed to the master output, and set ONLY the DC (lowpass) value to the volume-control.
    //This solved 2 issues: Thanks to the lowpass filtering of the volume-control, SID tunes where digi is played together with normal SID channels,
    //won't sound distorted anymore, and the volume-clicks disappear when setting SID-volume. (This is useful for fade-in/out tunes like Hades Nebula, where clicking ruins the intro.)
    return (output[0] / OUTPUT_SCALEDOWN) * (volumeFilter & 0xf);
    // SID output
  }

  function combinedWaveForm(num, channel, waveform, index, differ6581) {
    //on 6581 most combined waveforms are essentially halved 8580-like waves
    if (differ6581 && SID_model[num] === 6581) index &= 0x7ff;
    const combiwf = (waveform[index] + prevwavdata[channel]) / 2;
    prevwavdata[channel] = waveform[index];
    return combiwf;
  }

  function getState() {
    return stateBuffer.slice(0);
  }

  function setState(state) {
    if (state.byteLength !== stateBuffer.byteLength) {
      throw new RangeError("Invalid SID state buffer size");
    }
    stateBytes.set(new Uint8Array(state));
  }

  //volume range: 0..1
  function getOutput() {
    return (output[0] / OUTPUT_SCALEDOWN) * (memory[0xd418] & 0xf);
  }

  function whittakerPlayerWorkaround(addr) {
    if (addr === 0xd404 && !(memory[0xd404] & 1)) ADSRstate[0] &= 0x3e;
    if (addr === 0xd40b && !(memory[0xd40b] & 1)) ADSRstate[1] &= 0x3e;
    if (addr === 0xd412 && !(memory[0xd412] & 1)) ADSRstate[2] &= 0x3e;
  }

  return {
    init,
    emulate,
    whittakerPlayerWorkaround,
    getOutput,
    getState,
    setState
  };
}
