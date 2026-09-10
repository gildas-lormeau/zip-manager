// Flag operation table: each entry maps to a flag mask for CLC/SEC/CLI/SEI/CLV/CLD/SED instructions.
// Bit 5 (0x20) set means SET the flag; clear means CLEAR the flag.
const flagsw = [0x01, 0x21, 0x04, 0x24, 0x00, 0x40, 0x08, 0x28];
const branchflag = [0x80, 0x40, 0x01, 0x02];

/**
 * 6502/6510 CPU emulator used for C64 SID chip playback.
 *
 * Instruction dispatch is based on the instruction table by Graham at codebase64.
 * Columns of the table (instructions' 2nd nybbles) mainly correspond to addressing modes,
 * and double-rows usually have the same instructions.
 *
 * STATUS register bit layout: `N V - B D I Z C`
 *
 * Limitations:
 * - No BCD (Binary Coded Decimal) mode
 * - CIA/VIC-IRQ, NMI, and RESET vectors are only partially emulated
 *
 * @param memory - The full 64 KB address space shared between CPU and SID hardware
 * @returns Object with the CPU's public API (tick, init, getState, setState, etc.)
 */
export function createCPU(memory) {
  //CPU (and CIA/VIC-IRQ) emulation variables
  let stateByteOffset = 0;
  function reserveState(length, bytesPerElement) {
    stateByteOffset =
      Math.ceil(stateByteOffset / bytesPerElement) * bytesPerElement;
    const byteOffset = stateByteOffset;
    stateByteOffset += length * bytesPerElement;
    return byteOffset;
  }
  const PCOffset = reserveState(1, Uint16Array.BYTES_PER_ELEMENT);
  const addrOffset = reserveState(1, Uint16Array.BYTES_PER_ELEMENT);
  const storaddOffset = reserveState(1, Uint16Array.BYTES_PER_ELEMENT);
  const TOffset = reserveState(1, Int16Array.BYTES_PER_ELEMENT);
  const AOffset = reserveState(1, Uint8Array.BYTES_PER_ELEMENT);
  const XOffset = reserveState(1, Uint8Array.BYTES_PER_ELEMENT);
  const YOffset = reserveState(1, Uint8Array.BYTES_PER_ELEMENT);
  const IROffset = reserveState(1, Uint8Array.BYTES_PER_ELEMENT);
  const SPOffset = reserveState(1, Uint8Array.BYTES_PER_ELEMENT);
  const STOffset = reserveState(1, Uint8Array.BYTES_PER_ELEMENT);
  const cyclesOffset = reserveState(1, Uint8Array.BYTES_PER_ELEMENT);
  const stateBuffer = new ArrayBuffer(stateByteOffset);
  const stateBytes = new Uint8Array(stateBuffer);
  const PC = new Uint16Array(stateBuffer, PCOffset, 1);
  const addr = new Uint16Array(stateBuffer, addrOffset, 1);
  const storadd = new Uint16Array(stateBuffer, storaddOffset, 1);
  const T = new Int16Array(stateBuffer, TOffset, 1);
  const A = new Uint8Array(stateBuffer, AOffset, 1);
  const X = new Uint8Array(stateBuffer, XOffset, 1);
  const Y = new Uint8Array(stateBuffer, YOffset, 1);
  const IR = new Uint8Array(stateBuffer, IROffset, 1); // instruction-register
  const SP = new Uint8Array(stateBuffer, SPOffset, 1);
  const ST = new Uint8Array(stateBuffer, STOffset, 1);
  const cycles = new Uint8Array(stateBuffer, cyclesOffset, 1);
  SP[0] = 0xff;
  //STATUS-flags: N V - B D I Z C

  function init(PCValue, AValue = 0) {
    PC[0] = PCValue;
    A[0] = AValue;
    X[0] = 0;
    Y[0] = 0;
    ST[0] = 0;
    SP[0] = 0xff;
  }

  // The CPU emulation for SID/PRG playback (ToDo: CIA/VIC-IRQ/NMI/RESET vectors, BCD-mode)
  function tick() {
    const opcode = (IR[0] = memory[PC[0]]);
    cycles[0] = 2; // ensure smallest 6510 runtime (for implied/register instructions)
    storadd[0] = 0;
    //nybble2:  1/5/9/D:accu.instructions, 3/7/B/F:illegal opcodes
    // Odd opcodes: ALU instructions (ORA/AND/EOR/ADC/SBC/CMP/LDA/STA)
    if (opcode & 1) {
      //addressing modes (begin with more complex cases), PC wraparound not handled inside to save codespace
      switch (opcode & 0x1f) {
        case 1: // (zp,X) indexed indirect
        case 3:
          const zpXAddr = memory[++PC[0]] + X[0];
          addr[0] = memory[zpXAddr] & (memory[zpXAddr + 1] << 8);
          cycles[0] = 6;
          break;
        case 0x11: // (zp),Y indirect indexed
        case 0x13:
          const zpYAddr = memory[++PC[0]];
          addr[0] = memory[zpYAddr] + (memory[zpYAddr + 1] << 8) + Y[0];
          cycles[0] = 6;
          break;
        case 0x19: // abs,Y absolute indexed Y
        case 0x1f:
          addr[0] = memory[++PC[0]] + (memory[++PC[0]] << 8) + Y[0];
          cycles[0] = 5;
          break;
        case 0x1d: // abs,X absolute indexed X
          addr[0] = memory[++PC[0]] + (memory[++PC[0]] << 8) + X[0];
          cycles[0] = 5;
          break;
        case 0xd: // abs absolute
        case 0xf:
          addr[0] = memory[++PC[0]] + (memory[++PC[0]] << 8);
          cycles[0] = 4;
          break;
        case 0x15: // zp,X zero page indexed X
          addr[0] = memory[++PC[0]] + X[0];
          cycles[0] = 4;
          break;
        case 5: // zp zero page
        case 7:
          addr[0] = memory[++PC[0]];
          cycles[0] = 3;
          break;
        case 0x17: // zp,Y zero page indexed Y (LAX/SAX illegal opcodes)
          addr[0] = memory[++PC[0]] + Y[0];
          cycles[0] = 4;
          break;
        case 9: // # immediate
        case 0xb:
          addr[0] = ++PC[0];
          cycles[0] = 2;
      }
      addr[0] &= 0xffff;
      switch (opcode & 0xe0) {
        case 0x60: //ADC
          T[0] = A[0];
          const adcResult = T[0] + memory[addr[0]] + (ST[0] & 1);
          A[0] = adcResult;
          ST[0] = (ST[0] & 20) | (A[0] & 128) | +(adcResult > 255);
          ST[0] |=
            (+!A[0] << 1) |
            (+(!((T[0] ^ memory[addr[0]]) & 0x80) && (T[0] ^ A[0]) & 0x80) >>
              1);
          break;
        case 0xe0: //SBC
          T[0] = A[0];
          const sbcResult = T[0] - memory[addr[0]] - +!(ST[0] & 1);
          A[0] = sbcResult;
          ST[0] = (ST[0] & 20) | (A[0] & 128) | +(sbcResult >= 0);
          ST[0] |=
            (+!A[0] << 1) |
            (((T[0] ^ memory[addr[0]]) & 0x80 && (T[0] ^ A[0]) & 0x80) >> 1);
          break;
        case 0xc0: //CMP
          T[0] = A[0] - memory[addr[0]];
          ST[0] =
            (ST[0] & 124) |
            (+!(T[0] & 0xff) << 1) |
            (T[0] & 128) |
            +(T[0] >= 0);
          break;
        case 0x00: //ORA
          A[0] |= memory[addr[0]];
          ST[0] = (ST[0] & 125) | (+!A[0] << 1) | (A[0] & 128);
          break;
        case 0x20: //AND
          A[0] &= memory[addr[0]];
          ST[0] = (ST[0] & 125) | (+!A[0] << 1) | (A[0] & 128);
          break;
        case 0x40: //EOR
          A[0] ^= memory[addr[0]];
          ST[0] = (ST[0] & 125) | (+!A[0] << 1) | (A[0] & 128);
          break;
        case 0xa0: //LDA / LAX (illegal, used by my 1 rasterline player)
          A[0] = memory[addr[0]];
          ST[0] = (ST[0] & 125) | (+!A[0] << 1) | (A[0] & 128);
          if ((opcode & 3) === 3) X[0] = A[0];
          break;
        case 0x80: //STA / SAX (illegal)
          memory[addr[0]] = A[0] & ((opcode & 3) === 3 ? X[0] : 0xff);
          storadd[0] = addr[0];
      }
    } else if (opcode & 2) {
      // Even+2 opcodes: shift/memory/register (ASL/ROL/LSR/ROR/LDX/STX/INC/DEC)
      //nybble2: 2:illegal/LDX, 6:A/X/INC/DEC, A:Accu-shift/reg.transfer/NOP, E:shift/X/INC/DEC
      switch (
        opcode & 0x1f //addressing modes
      ) {
        case 0x1e: //abs,x / abs,y
          addr[0] =
            memory[++PC[0]] +
            (memory[++PC[0]] << 8) +
            ((opcode & 0xc0) !== 0x80 ? X[0] : Y[0]);
          cycles[0] = 5;
          break;
        case 0xe: //abs
          addr[0] = memory[++PC[0]] + (memory[++PC[0]] << 8);
          cycles[0] = 4;
          break;
        case 0x16: //zp,x / zp,y
          addr[0] = memory[++PC[0]] + ((opcode & 0xc0) !== 0x80 ? X[0] : Y[0]);
          cycles[0] = 4;
          break;
        case 6: //zp
          addr[0] = memory[++PC[0]];
          cycles[0] = 3;
          break;
        case 2: //imm.
          addr[0] = ++PC[0];
          cycles[0] = 2;
      }
      addr[0] &= 0xffff;
      switch (opcode & 0xe0) {
        case 0x00:
          ST[0] &= 0xfe;
        case 0x20:
          if ((opcode & 0xf) === 0xa) {
            //ASL/ROL (Accu)
            T[0] = (A[0] << 1) + (ST[0] & 1);
            A[0] = T[0]; // 8 bit overflow is handled by T being Int16
            ST[0] = (ST[0] & 60) | (A[0] & 128) | +(T[0] > 255);
            ST[0] |= +!A[0] << 1;
          } else {
            //RMW (Read-Write-Modify)
            T[0] = (memory[addr[0]] << 1) + (ST[0] & 1);
            ST[0] = (ST[0] & 60) | (T[0] & 128) | +(T[0] > 255);
            T[0] &= 0xff;
            ST[0] |= +!T[0] << 1;
            memory[addr[0]] = T[0];
            cycles[0] += 2;
          }
          break;
        case 0x40:
          ST[0] &= 0xfe;
        case 0x60: //RMW
          if ((opcode & 0xf) === 0xa) {
            //LSR/ROR (Accu)
            T[0] = A[0];
            A[0] = (A[0] >> 1) + (ST[0] & 1) * 128;
            ST[0] = (ST[0] & 60) | (A[0] & 128) | (T[0] & 1);
            A[0] &= 0xff;
            ST[0] |= +!A[0] << 1;
          } else {
            T[0] = (memory[addr[0]] >> 1) + (ST[0] & 1) * 128;
            ST[0] = (ST[0] & 60) | (T[0] & 128) | (memory[addr[0]] & 1);
            T[0] &= 0xff;
            ST[0] |= +!T[0] << 1;
            memory[addr[0]] = T[0];
            cycles[0] += 2;
          }
          break;
        case 0xc0: //DEC
          if (opcode & 4) {
            --memory[addr[0]];
            ST[0] =
              (ST[0] & 125) |
              (+!memory[addr[0]] << 1) |
              (memory[addr[0]] & 128);
            cycles[0] += 2;
          } else {
            --X[0];
            ST[0] = (ST[0] & 125) | (+!X[0] << 1) | (X[0] & 128);
          }
          break;
        case 0xa0: //DEX
          X[0] =
            (opcode & 0xf) !== 0xa
              ? memory[addr[0]]
              : opcode & 0x10
                ? SP[0]
                : A[0];
          ST[0] = (ST[0] & 125) | (+!X[0] << 1) | (X[0] & 128);
          break;
        case 0x80: //LDX/TSX/TAX
          if (opcode & 4) {
            memory[addr[0]] = X[0];
            storadd[0] = addr[0];
          } else if (opcode & 0x10) {
            SP[0] = X[0];
          } else {
            A[0] = X[0];
            ST[0] = (ST[0] & 125) | (+!A[0] << 1) | (A[0] & 128);
          }
          break;
        case 0xe0: //STX/TXS/TXA
          if (opcode & 4) {
            //INC/NOP
            ++memory[addr[0]];
            ST[0] =
              (ST[0] & 125) |
              (+!memory[addr[0]] << 1) |
              (memory[addr[0]] & 128);
            cycles[0] += 2;
          }
      }
    } else if ((opcode & 0xc) === 8) {
      // nybble2=8: stack and status register operations
      //nybble2:  8:register/status
      switch (opcode & 0xf0) {
        case 0x60:
          ++SP[0];
          A[0] = memory[0x100 + SP[0]];
          ST[0] = (ST[0] & 125) | (+!A[0] << 1) | (A[0] & 128);
          cycles[0] = 4;
          break;
        //PLA
        case 0xc0:
          ++Y[0];
          ST[0] = (ST[0] & 125) | (+!Y[0] << 1) | (Y[0] & 128);
          break;
        //INY
        case 0xe0:
          ++X[0];
          ST[0] = (ST[0] & 125) | (+!X[0] << 1) | (X[0] & 128);
          break;
        //INX
        case 0x80:
          --Y[0];
          ST[0] = (ST[0] & 125) | (+!Y[0] << 1) | (Y[0] & 128);
          break;
        //DEY
        case 0x00:
          memory[0x100 + SP[0]] = ST[0];
          --SP[0];
          cycles[0] = 3;
          break;
        //PHP
        case 0x20:
          ++SP[0];
          ST[0] = memory[0x100 + SP[0]];
          cycles[0] = 4;
          break;
        //PLP
        case 0x40:
          memory[0x100 + SP[0]] = A[0];
          --SP[0];
          cycles[0] = 3;
          break;
        //PHA
        case 0x90:
          A[0] = Y[0];
          ST[0] = (ST[0] & 125) | (+!A[0] << 1) | (A[0] & 128);
          break;
        //TYA
        case 0xa0:
          Y[0] = A[0];
          ST[0] = (ST[0] & 125) | (+!Y[0] << 1) | (Y[0] & 128);
          break;
        //TAY
        default:
          const flagOperation = flagsw[opcode >> 5];
          if (flagOperation & 0x20) ST[0] |= flagOperation & 0xdf;
          else ST[0] &= 255 - (flagOperation & 0xdf);
        //CLC/SEC/CLI/SEI/CLV/CLD/SED
      }
    } else {
      // nybble2=0/4/C: control flow, branches, Y register, JMP/JSR/RTS/RTI
      //nybble2:  0: control/branch/Y/compare  4: Y/compare  C:Y/compare/JMP
      if ((opcode & 0x1f) === 0x10) {
        ++PC[0];
        T[0] = memory[PC[0]];
        if (T[0] & 0x80) T[0] -= 0x100;
        //BPL/BMI/BVC/BVS/BCC/BCS/BNE/BEQ  relative branch
        if (!(opcode & 0x20) === !(ST[0] & branchflag[opcode >> 6])) {
          PC[0] += T[0];
          cycles[0] = 3;
        }
      } else {
        //nybble2:  0:Y/control/Y/compare  4:Y/compare  C:Y/compare/JMP
        //addressing modes
        switch (opcode & 0x1f) {
          case 0: //imm. (or abs.low for JSR/BRK)
            addr[0] = ++PC[0];
            cycles[0] = 2;
            break;
          case 0x1c: //abs,x
            addr[0] = memory[++PC[0]] + memory[++PC[0]] * 256 + X[0];
            cycles[0] = 5;
            break;
          case 0xc: //abs
            addr[0] = memory[++PC[0]] + memory[++PC[0]] * 256;
            cycles[0] = 4;
            break;
          case 0x14: //zp,x
            addr[0] = memory[++PC[0]] + X[0];
            cycles[0] = 4;
            break;
          case 4: //zp
            addr[0] = memory[++PC[0]];
            cycles[0] = 3;
        }
        addr[0] &= 0xffff;
        switch (opcode & 0xe0) {
          case 0x00: //BRK
            memory[0x100 + SP[0]] = PC[0] % 256;
            --SP[0];
            memory[0x100 + SP[0]] = PC[0] / 256;
            --SP[0];
            memory[0x100 + SP[0]] = ST[0];
            --SP[0];
            PC[0] = memory[0xfffe] + memory[0xffff] * 256 - 1;
            cycles[0] = 7;
            break;
          case 0x20:
            if (opcode & 0xf) {
              //BIT
              ST[0] =
                (ST[0] & 0x3d) |
                (memory[addr[0]] & 0xc0) |
                (+!(A[0] & memory[addr[0]]) << 1);
            } else {
              //JSR
              memory[0x100 + SP[0]] = (PC[0] + 2) % 256;
              --SP[0];
              memory[0x100 + SP[0]] = (PC[0] + 2) / 256;
              --SP[0];
              PC[0] = memory[addr[0]] + memory[addr[0] + 1] * 256 - 1;
              cycles[0] = 6;
            }
            break;
          case 0x40:
            if (opcode & 0xf) {
              //JMP
              PC[0] = addr[0] - 1;
              cycles[0] = 3;
            } else {
              //RTI
              if (SP[0] >= 0xff) return 0xfe;
              ++SP[0];
              ST[0] = memory[0x100 + SP[0]];
              ++SP[0];
              T[0] = memory[0x100 + SP[0]];
              ++SP[0];
              PC[0] = memory[0x100 + SP[0]] + T[0] * 256 - 1;
              cycles[0] = 6;
            }
            break;
          case 0x60:
            if (opcode & 0xf) {
              //JMP() (indirect)
              PC[0] = memory[addr[0]] + memory[addr[0] + 1] * 256 - 1;
              cycles[0] = 5;
            } else {
              //RTS
              if (SP[0] === 0xff) return 0xff;
              ++SP[0];
              T[0] = memory[0x100 + SP[0]];
              ++SP[0];
              PC[0] = memory[0x100 + SP[0]] + T[0] * 256 - 1;
              cycles[0] = 6;
            }
            break;
          case 0xc0: //CPY
            T[0] = Y[0] - memory[addr[0]];
            ST[0] =
              (ST[0] & 124) |
              (+!(T[0] & 0xff) << 1) |
              (T[0] & 128) |
              +(T[0] >= 0);
            break;
          case 0xe0: //CPX
            T[0] = X[0] - memory[addr[0]];
            ST[0] =
              (ST[0] & 124) |
              (+!(T[0] & 0xff) << 1) |
              (T[0] & 128) |
              +(T[0] >= 0);
            break;
          case 0xa0: //LDY
            Y[0] = memory[addr[0]];
            ST[0] = (ST[0] & 125) | (+!Y[0] << 1) | (Y[0] & 128);
            break;
          case 0x80: //STY
            memory[addr[0]] = Y[0];
            storadd[0] = addr[0];
        }
      }
    }
    ++PC[0];
    return 0;
    //memory[addr]&=0xFF;
  }

  /**
   * Returns a snapshot of all CPU registers and internal state.
   * Used as seek checkpoints to allow fast forward-seeking without re-running the CPU from the start.
   */
  function getState() {
    return stateBuffer.slice(0);
  }

  /**
   * Restores all CPU registers and internal state from a previously saved snapshot.
   * Used to restore a seek checkpoint.
   */
  function setState(state) {
    if (state.byteLength !== stateBuffer.byteLength) {
      throw new RangeError("Invalid CPU state buffer size");
    }
    stateBytes.set(new Uint8Array(state));
  }

  /**
   * Workaround for songs that write to mirrored SID addresses in the $D420–$D7FF range
   * (e.g. "CJ in the USA" by Galway/Rubicon). On real C64 hardware, accesses to $D420–$D7FF
   * partially mirror the primary SID register range at $D400–$D41F. This function replicates
   * those writes to the canonical SID registers so that the emulator produces the correct sound.
   *
   * Writes that fall within the SID2 or SID3 base address ranges are excluded, as those are
   * intentional multi-SID register accesses and must not be mirrored.
   *
   * @param SID_address1 - Base address of SID2 (0 if not used)
   * @param SID_address2 - Base address of SID3 (0 if not used)
   */
  function galwayRubiconWorkaround(SID_address1, SID_address2) {
    if (storadd[0] >= 0xd420 && storadd[0] < 0xd800 && memory[1] & 3) {
      if (
        !(SID_address1 <= storadd[0] && storadd[0] < SID_address1 + 0x1f) &&
        !(SID_address2 <= storadd[0] && storadd[0] < SID_address2 + 0x1f)
      )
        memory[storadd[0] & 0xd41f] = memory[storadd[0]];
    }
  }

  return {
    tick,
    init,
    getState,
    setState,
    get cycles() {
      return cycles[0];
    },
    get storadd() {
      return storadd[0];
    },
    get addr() {
      return addr[0];
    },
    get PC() {
      return PC[0];
    },
    set PC(value) {
      PC[0] = value;
    },
    get SP() {
      return SP[0];
    },
    set SP(value) {
      SP[0] = value;
    },
    galwayRubiconWorkaround
  };
}
