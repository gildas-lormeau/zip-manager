/* global window, URL */

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

export {
  downloadBlob,
  alert,
  confirm,
  prompt,
  setFocus,
  dispatchClick,
  addEventListener,
  removeEventListener
};
