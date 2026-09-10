/* global AudioWorkletNode, CustomEvent */

export class SIDNode extends AudioWorkletNode {
  constructor(context) {
    super(context, "sid", {
      outputChannelCount: [2],
      numberOfInputs: 0,
      numberOfOutputs: 1
    });

    this.handleMessages();
  }

  handleMessages() {
    this.port.onmessage = (ev) => {
      const { id, ...detail } = ev.data;
      this.dispatchEvent(new CustomEvent(id, { detail }));
    };
  }

  /**
   * Subscribe to a worklet event.
   * @returns A function that removes the listener when called.
   */
  on(id, callback) {
    this.addEventListener(id, callback);
    return () => this.removeEventListener(id, callback);
  }

  sendMessage(message) {
    this.port.postMessage(message);
  }

  load(songData) {
    this.sendMessage({ id: "load", songData });
  }

  setPosition(value) {
    this.sendMessage({ id: "setPosition", value });
  }

  setSubsong(value) {
    this.sendMessage({ id: "setSubsong", value });
  }

  setDuration(seconds) {
    this.sendMessage({ id: "setDuration", value: seconds });
  }
}
