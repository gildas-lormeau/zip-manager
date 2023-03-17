/* global window, document, URL, AbortController, Intl, localStorage */

const ABORT_ERROR_NAME = "AbortError";
const CANCELLED_DOWNLOAD_MESSAGE = "download cancelled";
const KEYUP_EVENT_NAME = "keyup";
const BEFORE_UNLOAD_EVENT_NAME = "beforeunload";
const ACCENT_COLOR_CUSTOM_PROPERTY_NAME = "accent-color";
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

function addUnloadListener(listener) {
  window.addEventListener(BEFORE_UNLOAD_EVENT_NAME, listener);
}

function removeUnloadListener(listener) {
  window.removeEventListener(BEFORE_UNLOAD_EVENT_NAME, listener);
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

function saveAccentColor(color) {
  document.documentElement.style.setProperty(
    "--" + ACCENT_COLOR_CUSTOM_PROPERTY_NAME,
    color
  );
  localStorage.setItem(ACCENT_COLOR_CUSTOM_PROPERTY_NAME, color);
}

function restoreAccentColor(defaultColor) {
  return (
    localStorage.getItem(ACCENT_COLOR_CUSTOM_PROPERTY_NAME) || defaultColor
  );
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
  addUnloadListener,
  removeUnloadListener,
  getHeight,
  saveAccentColor,
  restoreAccentColor,
  showOpenFilePicker,
  formatSize,
  formatDate,
  setTimeout,
  clearTimeout
};
