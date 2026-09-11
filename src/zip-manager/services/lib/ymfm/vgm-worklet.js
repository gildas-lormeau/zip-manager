/* global AudioWorkletProcessor, registerProcessor, sampleRate, WebAssembly */

import { VGMEngine } from "./vgm-engine.js";

const WASI_IMPORTS = {
  wasi_snapshot_preview1: {
    clock_time_get: () => 0,
    fd_close: () => 0,
    fd_seek: () => 0,
    fd_write: () => 0
  }
};

class VGMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.engine = null;
    this.port.onmessage = ({ data }) => this.load(data);
  }

  async load({ wasm, data }) {
    const { instance } = await WebAssembly.instantiate(
      new Uint8Array(wasm),
      WASI_IMPORTS
    );
    instance.exports._initialize();
    this.engine = new VGMEngine(
      instance.exports,
      new Uint8Array(data),
      sampleRate
    );
  }

  process(_inputs, outputs) {
    if (this.engine) {
      this.engine.render(outputs[0][0], outputs[0][1]);
    }
    return true;
  }
}

registerProcessor("vgm", VGMProcessor);
