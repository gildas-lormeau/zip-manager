const VGM_MAGIC = 0x206d6756;
const VGM_SAMPLE_RATE = 44100;
const VERSION_WITH_DATA_OFFSET = 0x150;
const LEGACY_DATA_OFFSET = 0x40;
const OFFSET_END = 0x04;
const OFFSET_VERSION = 0x08;
const OFFSET_LOOP = 0x1c;
const OFFSET_DATA = 0x34;
const OFFSET_YM2610_CLOCK = 0x4c;
const OFFSET_VOLUME_MODIFIER = 0x7c;
const CLOCK_MASK = 0x3fffffff;
const COMMAND_YM2610_PORT0 = 0x58;
const COMMAND_YM2610_PORT1 = 0x59;
const COMMAND_WAIT = 0x61;
const COMMAND_WAIT_60HZ = 0x62;
const COMMAND_WAIT_50HZ = 0x63;
const COMMAND_END = 0x66;
const COMMAND_DATA_BLOCK = 0x67;
const COMMAND_WAIT_SHORT = 0x70;
const COMMAND_WAIT_SHORT_END = 0x7f;
const WAIT_60HZ = 735;
const WAIT_50HZ = 882;
const DATA_BLOCK_ADPCM_A = 0x82;
const DATA_BLOCK_ADPCM_B = 0x83;
const DATA_BLOCK_SIZE_MASK = 0x7fffffff;
const ACCESS_ADPCM_A = 1;
const ACCESS_ADPCM_B = 2;
const COMMAND_LENGTHS = [
  [0x30, 0x3f, 2],
  [0x40, 0x4e, 3],
  [0x4f, 0x50, 2],
  [0x51, 0x5f, 3],
  [0xa0, 0xbf, 3],
  [0xc0, 0xdf, 4],
  [0xe0, 0xff, 5]
];
const CHIP_BUFFER_FRAMES = 8192;
const MAX_BATCH_FRAMES = 1024;

class VGMEngine {
  constructor(exports, bytes, outputRate) {
    this.exports = exports;
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (this.view.getUint32(0, true) !== VGM_MAGIC) {
      throw new Error("not a VGM file");
    }
    const version = this.view.getUint32(OFFSET_VERSION, true);
    this.end = this.view.getUint32(OFFSET_END, true) + OFFSET_END;
    const loopOffset = this.view.getUint32(OFFSET_LOOP, true);
    this.loop = loopOffset ? loopOffset + OFFSET_LOOP : 0;
    this.dataStart =
      version >= VERSION_WITH_DATA_OFFSET
        ? this.view.getUint32(OFFSET_DATA, true) + OFFSET_DATA
        : LEGACY_DATA_OFFSET;
    const clock = this.view.getUint32(OFFSET_YM2610_CLOCK, true);
    if (!clock) {
      throw new Error("no YM2610 in this VGM file");
    }
    const volumeByte =
      this.dataStart > OFFSET_VOLUME_MODIFIER
        ? bytes[OFFSET_VOLUME_MODIFIER]
        : 0;
    this.gain = 2 ** ((volumeByte > 192 ? volumeByte - 256 : volumeByte) / 32);
    this.chipRate = exports.create(clock & CLOCK_MASK, clock >>> 31);
    this.chipStep = this.chipRate / VGM_SAMPLE_RATE;
    this.outputStep = this.chipRate / outputRate;
    this.outputPointer = exports.output();
    this.maxFrames = Math.min(exports.outputFrames(), MAX_BATCH_FRAMES);
    this.roms = new Map();
    this.position = this.dataStart;
    this.pending = 0;
    this.ended = false;
    this.buffer = new Float32Array(CHIP_BUFFER_FRAMES * 2);
    this.bufferStart = 0;
    this.bufferEnd = 0;
    this.fraction = 0;
  }

  render(left, right) {
    const { buffer } = this;
    for (let index = 0; index < left.length; index++) {
      while (this.bufferEnd - this.bufferStart < 2) {
        if (!this.fill()) {
          left.fill(0, index);
          right.fill(0, index);
          return;
        }
      }
      const offset = this.bufferStart * 2;
      const { fraction } = this;
      left[index] =
        buffer[offset] + (buffer[offset + 2] - buffer[offset]) * fraction;
      right[index] =
        buffer[offset + 1] +
        (buffer[offset + 3] - buffer[offset + 1]) * fraction;
      const advanced = this.fraction + this.outputStep;
      const whole = Math.floor(advanced);
      this.bufferStart += whole;
      this.fraction = advanced - whole;
    }
  }

  fill() {
    if (this.bufferStart) {
      this.buffer.copyWithin(0, this.bufferStart * 2, this.bufferEnd * 2);
      this.bufferEnd -= this.bufferStart;
      this.bufferStart = 0;
    }
    if (this.pending < 1) {
      this.execute();
      if (this.pending < 1) {
        return false;
      }
    }
    const frames = Math.min(
      Math.floor(this.pending),
      CHIP_BUFFER_FRAMES - this.bufferEnd,
      this.maxFrames
    );
    this.exports.generate(frames);
    const output = new Float32Array(
      this.exports.memory.buffer,
      this.outputPointer,
      frames * 2
    );
    const { buffer, gain } = this;
    let offset = this.bufferEnd * 2;
    for (let index = 0; index < output.length; index++) {
      buffer[offset++] = output[index] * gain;
    }
    this.bufferEnd += frames;
    this.pending -= frames;
    return true;
  }

  execute() {
    const { bytes, view } = this;
    while (this.pending < 1 && !this.ended) {
      if (this.position >= this.end) {
        this.finish();
        continue;
      }
      const command = bytes[this.position];
      if (
        command === COMMAND_YM2610_PORT0 ||
        command === COMMAND_YM2610_PORT1
      ) {
        this.exports.write(
          command - COMMAND_YM2610_PORT0,
          bytes[this.position + 1],
          bytes[this.position + 2]
        );
        this.position += 3;
      } else if (command === COMMAND_WAIT) {
        this.wait(view.getUint16(this.position + 1, true));
        this.position += 3;
      } else if (command === COMMAND_WAIT_60HZ) {
        this.wait(WAIT_60HZ);
        this.position++;
      } else if (command === COMMAND_WAIT_50HZ) {
        this.wait(WAIT_50HZ);
        this.position++;
      } else if (
        command >= COMMAND_WAIT_SHORT &&
        command <= COMMAND_WAIT_SHORT_END
      ) {
        this.wait(command - COMMAND_WAIT_SHORT + 1);
        this.position++;
      } else if (command === COMMAND_END) {
        this.finish();
      } else if (command === COMMAND_DATA_BLOCK) {
        this.readDataBlock();
      } else {
        this.position += commandLength(command);
      }
    }
  }

  wait(samples) {
    this.pending += samples * this.chipStep;
  }

  finish() {
    if (this.loop) {
      this.position = this.loop;
    } else {
      this.ended = true;
    }
  }

  readDataBlock() {
    const { bytes, view, exports } = this;
    const type = bytes[this.position + 2];
    const size = view.getUint32(this.position + 3, true) & DATA_BLOCK_SIZE_MASK;
    const start = this.position + 7;
    if (type === DATA_BLOCK_ADPCM_A || type === DATA_BLOCK_ADPCM_B) {
      const access =
        type === DATA_BLOCK_ADPCM_A ? ACCESS_ADPCM_A : ACCESS_ADPCM_B;
      const romSize = view.getUint32(start, true);
      const romStart = view.getUint32(start + 4, true);
      let rom = this.roms.get(access);
      if (!rom) {
        rom = { pointer: exports.allocate(access, romSize), size: romSize };
        this.roms.set(access, rom);
      }
      const payload = bytes.subarray(start + 8, start + size);
      const length = Math.min(payload.length, Math.max(rom.size - romStart, 0));
      new Uint8Array(exports.memory.buffer, rom.pointer + romStart, length).set(
        payload.subarray(0, length)
      );
    }
    this.position = start + size;
  }
}

function commandLength(command) {
  const entry = COMMAND_LENGTHS.find(
    ([first, last]) => command >= first && command <= last
  );
  if (!entry) {
    throw new Error(`unsupported VGM command 0x${command.toString(16)}`);
  }
  return entry[2];
}

export { VGMEngine };
