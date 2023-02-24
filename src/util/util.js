/* global window, URL */

function downloadBlob(blob, downloaderElement, download) {
  const href = URL.createObjectURL(blob);
  Object.assign(downloaderElement, { href, download });
  downloaderElement.click();
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

export {
  downloadBlob,
  alert,
  confirm,
  prompt,
  addEventListener,
  removeEventListener
};
