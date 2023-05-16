/* global addEventListener, removeEventListener */

const KEYUP_EVENT_NAME = "keyup";
const KEYDOWN_EVENT_NAME = "keydown";

function addKeyUpListener(listener) {
  addEventListener(KEYUP_EVENT_NAME, listener);
}

function removeKeyUpListener(listener) {
  removeEventListener(KEYUP_EVENT_NAME, listener);
}

function addKeyDownListener(listener) {
  addEventListener(KEYDOWN_EVENT_NAME, listener);
}

function removeKeyDownListener(listener) {
  removeEventListener(KEYDOWN_EVENT_NAME, listener);
}

export {
  addKeyUpListener,
  removeKeyUpListener,
  addKeyDownListener,
  removeKeyDownListener
};
