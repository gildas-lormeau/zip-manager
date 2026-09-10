/* global AudioWorkletProcessor, registerProcessor */

import { SIDPlayer } from "./sid.js";

class SIDProcessor extends AudioWorkletProcessor {
  sid = SIDPlayer(/*sampleRate*/);
  /** Pending seek target in seconds; null if no seek is queued (last-wins). */
  pendingSeek = null;
  /** Duration of the current song in seconds (0 when unknown). */
  duration = 0;
  /** Sample counter used to throttle periodic position messages. */
  samplesSinceLastPosition = 0;
  /** Emit a position message every ~100 ms (at 44100 Hz ≈ 4410 samples). */
  static POSITION_INTERVAL = 4410;

  constructor() {
    super();
    this.port.onmessage = (ev) => {
      const { id, ...params } = ev.data;
      this[id]?.(params);
    };
  }

  process(_input, outputs) {
    const output = outputs[0];
    const length = output[0].length;
    const left = output[0];
    const right = output[1];

    // Apply pending seek (last-wins) before producing samples.
    if (this.pendingSeek !== null) {
      const target = this.pendingSeek;
      this.pendingSeek = null;
      this.sid.seek(target);
      this.port.postMessage({ id: "position", value: this.sid.playtime });
      this.samplesSinceLastPosition = 0;
    }

    for (let i = 0; i < length; i++) {
      left[i] = right[i] = this.sid.play();
    }

    this.samplesSinceLastPosition += length;
    if (this.samplesSinceLastPosition >= SIDProcessor.POSITION_INTERVAL) {
      this.samplesSinceLastPosition = 0;
      this.port.postMessage({ id: "position", value: this.sid.playtime });
    }

    return true;
  }

  setPosition({ value }) {
    // value is in seconds; queue as pending (last-wins to avoid backlog).
    this.pendingSeek = value;
  }

  setSubsong({ value }) {
    const index = Math.max(0, Math.floor(value));
    this.sid.init(index);
    this.port.postMessage({ id: "songInfo", songInfo: this.getSongInfo() });
    this.port.postMessage({ id: "position", value: 0 });
  }

  load({ songData }) {
    this.sid.load(songData, 0);
    this.port.postMessage({ id: "songInfo", songInfo: this.getSongInfo() });
    this.port.postMessage({ id: "position", value: 0 });
  }

  setDuration({ value }) {
    this.duration = value;
  }

  getSongInfo() {
    return {
      Name: `${this.sid.author} - ${this.sid.title}`,
      Info: this.sid.info,
      Duration: this.duration,
      Subsong: this.sid.subtune,
      Subsongs: this.sid.subtunes
    };
  }
}

registerProcessor("sid", SIDProcessor);
