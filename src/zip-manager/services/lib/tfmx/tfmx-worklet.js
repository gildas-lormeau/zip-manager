/* global AudioWorkletProcessor, registerProcessor, sampleRate, WebAssembly */

const PANNING = 75;

class TFMXProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.exports = null;
    this.port.onmessage = ({ data }) => this.load(data);
  }

  async load({ wasm, data, song }) {
    const module = await WebAssembly.compile(wasm);
    const imports = {};
    for (const { module: name, name: field } of WebAssembly.Module.imports(
      module
    )) {
      imports[name] ??= {};
      imports[name][field] = () => 0;
    }
    const instance = await WebAssembly.instantiate(module, imports);
    const { exports } = instance;
    exports._initialize();
    exports.create(sampleRate, PANNING);
    const bytes = new Uint8Array(data);
    const pointer = exports.allocate(bytes.length);
    new Uint8Array(exports.memory.buffer, pointer, bytes.length).set(bytes);
    if (exports.load(bytes.length, song)) {
      this.exports = exports;
    }
  }

  process(_inputs, outputs) {
    const [left, right] = outputs[0];
    if (this.exports) {
      this.exports.generate(left.length);
      const output = new Float32Array(
        this.exports.memory.buffer,
        this.exports.output(),
        left.length * 2
      );
      for (let index = 0; index < left.length; index++) {
        left[index] = output[index * 2];
        right[index] = output[index * 2 + 1];
      }
    }
    return true;
  }
}

registerProcessor("tfmx", TFMXProcessor);
