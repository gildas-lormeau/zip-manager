/* global navigator, window, document, URL, AbortController, Intl, localStorage */

const ABORT_ERROR_NAME = "AbortError";
const CANCELLED_DOWNLOAD_MESSAGE = "download cancelled";
const KEYUP_EVENT_NAME = "keyup";
const KEYDOWN_EVENT_NAME = "keydown";
const BEFORE_UNLOAD_EVENT_NAME = "beforeunload";
const RESIZE_EVENT_NAME = "resize";
const ZIP_EXTENSION = ".zip";
const ZIP_MIME_TYPE = "application/zip";
const EN_US_LANGUAGE_ID = "en-US";
const MIME_TYPES = {
  [ZIP_EXTENSION]: ZIP_MIME_TYPE
};
const SIZE_NUMBER_FORMATS = [
  "byte",
  "kilobyte",
  "megabyte",
  "gigabyte",
  "terabyte",
  "petabyte"
].map(
  (unit) =>
    new Intl.NumberFormat(EN_US_LANGUAGE_ID, {
      style: "unit",
      maximumFractionDigits: 1,
      unit
    })
);
const DATE_TIME_FORMAT = new Intl.DateTimeFormat(EN_US_LANGUAGE_ID, {
  dateStyle: "short",
  timeStyle: "short"
});
const MACOS_PLATFORMS = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];

function downloadBlob(blob, downloaderElement, download) {
  const href = URL.createObjectURL(blob);
  Object.assign(downloaderElement, { href, download });
  dispatchClick(downloaderElement);
  URL.revokeObjectURL(href);
}

function addKeyUpListener(listener) {
  window.addEventListener(KEYUP_EVENT_NAME, listener);
}

function removeKeyUpListener(listener) {
  window.removeEventListener(KEYUP_EVENT_NAME, listener);
}

function addKeyDownListener(listener) {
  window.addEventListener(KEYDOWN_EVENT_NAME, listener);
}

function removeKeyDownListener(listener) {
  window.removeEventListener(KEYDOWN_EVENT_NAME, listener);
}

function addUnloadListener(listener) {
  window.addEventListener(BEFORE_UNLOAD_EVENT_NAME, listener);
}

function removeUnloadListener(listener) {
  window.removeEventListener(BEFORE_UNLOAD_EVENT_NAME, listener);
}

function addResizeListener(listener) {
  window.addEventListener(RESIZE_EVENT_NAME, listener);
}

function removeResizeListener(listener) {
  window.removeEventListener(RESIZE_EVENT_NAME, listener);
}

function scrollIntoView(element) {
  element.scrollIntoView({ block: "nearest" });
}

function dispatchClick(element) {
  element.click();
}

function getHeight(element) {
  return element.offsetHeight;
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

function setStyleProperty(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function saveValue(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

function restoreValue(name) {
  const value = localStorage.getItem(name);
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

function getDefaultMaxWorkers() {
  return navigator.hardwareConcurrency;
}

async function showOpenFilePicker({ multiple, description, extension }) {
  const excludeAcceptAllOption = Boolean(extension);
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
    if (error.name === ABORT_ERROR_NAME) {
      return [];
    } else {
      throw error;
    }
  }
}

function formatSize(number) {
  let indexNumberFormat = 0;
  while (number > 1000 && indexNumberFormat < SIZE_NUMBER_FORMATS.length - 1) {
    number = number / 1000;
    indexNumberFormat++;
  }
  return SIZE_NUMBER_FORMATS[indexNumberFormat].format(number);
}

function formatDate(date) {
  return DATE_TIME_FORMAT.format(date);
}

function setTimeout(callback, delay, ...args) {
  return window.setTimeout(callback, delay, ...args);
}

function clearTimeout(id) {
  return window.clearTimeout(id);
}

function isMacOSPlatform() {
  // eslint-disable-next-line no-unused-expressions
  const { platform } = window.navigator;
  return platform !== undefined && MACOS_PLATFORMS.includes(platform);
}

export {
  downloadBlob,
  createAbortController,
  abortDownload,
  downloadAborted,
  scrollIntoView,
  dispatchClick,
  addKeyUpListener,
  removeKeyUpListener,
  addKeyDownListener,
  removeKeyDownListener,
  addUnloadListener,
  removeUnloadListener,
  addResizeListener,
  removeResizeListener,
  getHeight,
  setStyleProperty,
  saveValue,
  restoreValue,
  showOpenFilePicker,
  formatSize,
  formatDate,
  setTimeout,
  clearTimeout,
  isMacOSPlatform,
  getDefaultMaxWorkers
};
