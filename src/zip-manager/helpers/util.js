/* global window, document, URL, AbortController, localStorage */

const ABORT_ERROR_NAME = "AbortError";
const CANCELLED_DOWNLOAD_MESSAGE = "download cancelled";
const KEYUP_EVENT_NAME = "keyup";
const ACCENT_COLOR_CUSTOM_PROPERTY_NAME = "accent-color";
const ZIP_EXTENSION = ".zip";
const ZIP_MIME_TYPE = "application/zip";
const MIME_TYPES = {
  [ZIP_EXTENSION]: ZIP_MIME_TYPE
};

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

function addKeyListener(listener) {
  window.addEventListener(KEYUP_EVENT_NAME, listener);
}

function removeKeyListener(listener) {
  window.removeEventListener(KEYUP_EVENT_NAME, listener);
}

function highlight(element) {
  element.focus();
}

function dispatchClick(element) {
  element.click();
}

function getHeight(element) {
  return element.offsetHeight;
}

function resetValue(inputElement) {
  inputElement.value = "";
}

function createAbortController() {
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

function setAccentColor(color) {
  document.documentElement.style.setProperty(
    "--" + ACCENT_COLOR_CUSTOM_PROPERTY_NAME,
    color
  );
  localStorage.setItem(ACCENT_COLOR_CUSTOM_PROPERTY_NAME, color);
}

function getAccentColor(defaultColor) {
  return (
    localStorage.getItem(ACCENT_COLOR_CUSTOM_PROPERTY_NAME) || defaultColor
  );
}

async function showOpenFilePicker({ multiple, description, extension }) {
  let excludeAcceptAllOption = Boolean(extension);
  try {
    const options = {
      excludeAcceptAllOption,
      multiple
    };
    if (excludeAcceptAllOption) {
      Object.assign(options, {
        types: [
          {
            description,
            accept: {
              [MIME_TYPES[extension]]: [extension]
            }
          }
        ]
      });
    }
    const fileHandles = await window.showOpenFilePicker(options);
    return Promise.all(fileHandles.map((fileHandle) => fileHandle.getFile()));
  } catch (error) {
    if (error.name !== ABORT_ERROR_NAME) {
      throw error;
    }
  }
}

export {
  downloadBlob,
  createAbortController,
  abortDownload,
  downloadAborted,
  alert,
  confirm,
  prompt,
  highlight,
  dispatchClick,
  resetValue,
  addKeyListener,
  removeKeyListener,
  getHeight,
  setAccentColor,
  getAccentColor,
  showOpenFilePicker
};
