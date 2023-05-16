/* global addEventListener, removeEventListener */

const RESIZE_EVENT_NAME = "resize";
const BEFORE_UNLOAD_EVENT_NAME = "beforeunload";

function addUnloadListener(listener) {
  addEventListener(BEFORE_UNLOAD_EVENT_NAME, listener);
}

function removeUnloadListener(listener) {
  removeEventListener(BEFORE_UNLOAD_EVENT_NAME, listener);
}

function addResizeListener(listener) {
  addEventListener(RESIZE_EVENT_NAME, listener);
}

function removeResizeListener(listener) {
  removeEventListener(RESIZE_EVENT_NAME, listener);
}

export {
  addUnloadListener,
  removeUnloadListener,
  addResizeListener,
  removeResizeListener
};
