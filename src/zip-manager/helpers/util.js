/* global window, URL, AbortController */

const ABORT_ERROR_NAME = "AbortError";
const CANCELLED_DOWNLOAD_MESSAGE = "download cancelled";

function downloadBlob(blob, downloaderElement, download) {
  const href = URL.createObjectURL(blob);
  Object.assign(downloaderElement, { href, download });
  dispatchClick(downloaderElement);
  URL.revokeObjectURL(href);
}

function alert(message) {
  return window.alert(message);
}

function confirm(message) {
  return window.confirm(message);
}

function prompt(message, defaultValue) {
  return window.prompt(message, defaultValue);
}

function addEventListener(type, listener, options) {
  window.addEventListener(type, listener, options);
}

function removeEventListener(type, listener, options) {
  window.removeEventListener(type, listener, options);
}

function setFocus(element) {
  element.focus();
}

function dispatchClick(element) {
  element.click();
}

function createController() {
  return new AbortController();
}

function abortDownload(controller) {
  controller.abort(new Error(CANCELLED_DOWNLOAD_MESSAGE));
}

function downloadAborted(error) {
  const message = error.message || error;
  return (
    message === CANCELLED_DOWNLOAD_MESSAGE || error.name === ABORT_ERROR_NAME
  );
}

export {
  downloadBlob,
  createController,
  abortDownload,
  downloadAborted,
  alert,
  confirm,
  prompt,
  setFocus,
  dispatchClick,
  addEventListener,
  removeEventListener
};
