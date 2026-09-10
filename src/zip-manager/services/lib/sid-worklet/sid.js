// Based on work jsSID by Hermit (Mihaly Horvath) : https://github.com/og2t/jsSID

import { createCPU } from "./cpu.js";
import { createSID } from "./sid-device.js";

//emulated machine constants
const C64_PAL_CPUCLK = 985248; //Hz
const PAL_FRAMERATE = 50; //NTSC_FRAMERATE = 60;
const SIDamount_vol = [1, 0.6, 0.4]; //how much to attenuate with more 2SID/3SID to avoid master-output overflows

export function SIDPlayer(samplerate = globalThis.sampleRate ?? 44100) {
  const clk_ratio = C64_PAL_CPUCLK / samplerate;

  let title = "";
  let author = "";
  let info = "";

  const timermode = new Uint8Array(32);
  let loadaddr = 0x1000;
  let initaddr = 0x1000;
  let playaddf = 0x1003;
  let playaddr = 0x1003;
  let subtune = 0;
  let subtune_amount = 1;
  let playlength = 0;

  const SID_model = [8580, 8580, 8580];
  const SID_address = [0xd400, 0, 0];
  const memory = new Uint8Array(65536);
  let loaded = 0;
  let initialized = 0;
  let finished = 0;
  let endcallback = () => {};
  let playtime = 0;
  let ended = 0;

  //framespeed = 1;
  let frame_sampleperiod = samplerate / PAL_FRAMERATE; //samplerate/(PAL_FRAMERATE*framespeed);
  let framecnt = 1;
  let volume = 1.0;
  let CPUtime = 0;
  let SIDamount = 0;
  let mix = 0;

  const CPU = createCPU(memory);
  const SID = createSID(memory, samplerate, clk_ratio, SID_model);

  const CHECKPOINT_INTERVAL = 30; // seconds

  let checkpoints = [];

  function unload() {
    loaded = 0;
    SID.init();
  }

  function load(data, subt = 0) {
    subtune = subt;
    const filedata = new Uint8Array(data);
    //SID-file format information can be found at HVSC
    const offs = filedata[7];
    loadaddr =
      filedata[8] + filedata[9]
        ? filedata[8] * 256 + filedata[9]
        : filedata[offs] + filedata[offs + 1] * 256;
    for (let i = 0; i < 32; i++)
      timermode[31 - i] = filedata[0x12 + (i >> 3)] & (2 ** (7 - (i % 8)));
    memory.fill(0);
    for (
      let i = offs + 2, addr = loadaddr;
      i < filedata.byteLength && addr < memory.length;
      i++, addr++
    ) {
      memory[addr] = filedata[i];
    }
    title = getString(filedata, 0x16);
    author = getString(filedata, 0x36);
    info = getString(filedata, 0x56);

    initaddr =
      filedata[0xa] + filedata[0xb]
        ? filedata[0xa] * 256 + filedata[0xb]
        : loadaddr;
    playaddr = playaddf = filedata[0xc] * 256 + filedata[0xd];
    subtune_amount = filedata[0xf];
    SID_model[0] = (filedata[0x77] & 0x30) >= 0x20 ? 8580 : 6581;
    SID_model[1] = (filedata[0x77] & 0xc0) >= 0x80 ? 8580 : 6581;
    SID_model[2] = (filedata[0x76] & 3) >= 3 ? 8580 : 6581;
    SID_address[1] =
      filedata[0x7a] >= 0x42 &&
      (filedata[0x7a] < 0x80 || filedata[0x7a] >= 0xe0)
        ? 0xd000 + filedata[0x7a] * 16
        : 0;
    SID_address[2] =
      filedata[0x7b] >= 0x42 &&
      (filedata[0x7b] < 0x80 || filedata[0x7b] >= 0xe0)
        ? 0xd000 + filedata[0x7b] * 16
        : 0;
    SIDamount = 0;
    if (SID_address[1] > 0) SIDamount++;
    if (SID_address[2] > 0) SIDamount++;
    loaded = 1;
    init(subtune);
  }

  function init(subt) {
    if (loaded) {
      initialized = 0;
      subtune = subt;
      CPU.init(initaddr, subtune);
      SID.init();
      memory[1] = 0x37;
      memory[0xdc05] = 0;
      for (let timeout = 100000; timeout >= 0; timeout--) {
        if (CPU.tick()) break;
      }
      if (timermode[subtune] || memory[0xdc05]) {
        //&& playaddf {   //CIA timing
        if (!memory[0xdc05]) {
          memory[0xdc04] = 0x24;
          memory[0xdc05] = 0x40;
        }
        frame_sampleperiod =
          (memory[0xdc04] + memory[0xdc05] * 256) / clk_ratio;
      } else frame_sampleperiod = samplerate / PAL_FRAMERATE;
      //Vsync timing
      //frame_sampleperiod = (memory[0xDC05]!=0 || (!timermode[subtune] && playaddf))? samplerate/PAL_FRAMERATE : (memory[0xDC04] + memory[0xDC05]*256) / clk_ratio;
      if (playaddf === 0)
        playaddr =
          (memory[1] & 3) < 2
            ? memory[0xfffe] + memory[0xffff] * 256
            : memory[0x314] + memory[0x315] * 256;
      else {
        playaddr = playaddf;
        if (playaddr >= 0xe000 && memory[1] === 0x37) memory[1] = 0x35;
      }

      CPU.init(playaddr);
      framecnt = 1;
      finished = 0;
      CPUtime = 0;
      playtime = 0;
      ended = 0;
      checkpoints = [];
      initialized = 1;
    }
  }

  function play() {
    if (loaded && initialized) {
      framecnt--;
      playtime += 1 / samplerate;
      if (framecnt <= 0) {
        framecnt = frame_sampleperiod;
        finished = 0;
        CPU.PC = playaddr;
        CPU.SP = 0xff;
      }
      if (finished === 0) {
        while (CPUtime <= clk_ratio) {
          const pPC = CPU.PC;
          if (CPU.tick() >= 0xfe) {
            finished = 1;
            break;
          } else {
            CPUtime += CPU.cycles;
          }
          const PC = CPU.PC;
          if (
            (memory[1] & 3) > 1 &&
            pPC < 0xe000 &&
            (PC === 0xea31 || PC === 0xea81)
          ) {
            finished = 1;
            break;
          }
          const { addr } = CPU;
          //IRQ player ROM return handling
          if (
            (addr === 0xdc05 || addr === 0xdc04) &&
            memory[1] & 3 &&
            timermode[subtune]
          ) {
            frame_sampleperiod =
              (memory[0xdc04] + memory[0xdc05] * 256) / clk_ratio;
          }
          CPU.galwayRubiconWorkaround(SID_address[1], SID_address[2]);
          SID.whittakerPlayerWorkaround(addr);
        }
        CPUtime -= clk_ratio;
      }
    }

    if (playlength > 0 && (playtime | 0) === (playlength | 0) && ended === 0) {
      ended = 1;
      endcallback();
    }
    mix = SID.emulate(0, 0xd400);
    if (SID_address[1]) mix += SID.emulate(1, SID_address[1]);
    if (SID_address[2]) mix += SID.emulate(2, SID_address[2]);

    // Save a checkpoint at each CHECKPOINT_INTERVAL boundary.
    if (Math.floor(playtime / CHECKPOINT_INTERVAL) > checkpoints.length - 1) {
      checkpoints.push({
        playtime,
        cpu: CPU.getState(),
        sid: SID.getState(),
        memory: new Uint8Array(memory),
        CPUtime,
        framecnt,
        frame_sampleperiod,
        finished,
        ended,
        playaddr,
        subtune
      });
    }

    return mix * volume * SIDamount_vol[SIDamount];
  }

  function seek(seconds) {
    if (!loaded) return;
    const targetSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;

    // Find the latest checkpoint at or before the target time.
    const cpIndex = checkpoints.findLastIndex(
      (cp) => cp.playtime <= targetSeconds
    );

    let startSamples;
    if (cpIndex >= 0) {
      // Restore checkpoint state without calling init().
      const cp = checkpoints[cpIndex];
      memory.set(cp.memory);
      CPU.setState(cp.cpu);
      SID.setState(cp.sid);
      playtime = cp.playtime;
      CPUtime = cp.CPUtime;
      framecnt = cp.framecnt;
      frame_sampleperiod = cp.frame_sampleperiod;
      finished = cp.finished;
      ended = cp.ended;
      playaddr = cp.playaddr;
      subtune = cp.subtune;
      startSamples = Math.floor(cp.playtime * samplerate);
    } else {
      // No usable checkpoint: restart from the beginning.
      init(subtune);
      startSamples = 0;
    }

    const targetSamples = Math.floor(targetSeconds * samplerate);
    for (let i = startSamples; i < targetSamples; i++) {
      play();
    }
  }

  function setEndCallback(callback, seconds) {
    endcallback = callback;
    playlength = seconds;
  }

  return {
    unload,
    load,
    init,
    play,
    seek,
    get playtime() {
      return playtime;
    },
    get volume() {
      return volume;
    },
    set volume(value) {
      volume = value;
    },
    get subtunes() {
      return subtune_amount;
    },
    get subtune() {
      return subtune;
    },
    get title() {
      return title;
    },
    get author() {
      return author;
    },
    get info() {
      return info;
    },
    isEnded: () => ended === 1,
    SID_model,
    setEndCallback
  };
}

function getString(buffer, startOffset) {
  const maxOffset = startOffset + 32;
  let endOffset = startOffset;

  while (endOffset < maxOffset && buffer[endOffset] !== 0) {
    endOffset++;
  }

  return String.fromCharCode(...buffer.subarray(startOffset, endOffset));
}
