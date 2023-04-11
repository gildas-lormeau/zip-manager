/* global navigator, window, document, URL, AbortController, Intl, localStorage, TransformStream, Response, LaunchParams, ResizeObserver */

const RESIZE_EVENT_NAME = "resize";
const ABORT_ERROR_NAME = "AbortError";
const CANCELLED_DOWNLOAD_MESSAGE = "download cancelled";
const KEYUP_EVENT_NAME = "keyup";
const KEYDOWN_EVENT_NAME = "keydown";
const BEFORE_UNLOAD_EVENT_NAME = "beforeunload";
const EN_US_LANGUAGE_ID = "en-US";

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
const FILESYSTEM_FILE_KIND = "file";
const FILESYSTEM_DIRECTORY_KIND = "directory";

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

function addResizeObserver(element, listener) {
  const observer = new ResizeObserver(listener);
  observer.observe(element, { attributes: true });
  return observer;
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

async function showOpenFilePicker({ multiple, description, accept }) {
  const excludeAcceptAllOption = Boolean(accept);
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
            accept
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

function openFilePickerSupported() {
  return "showOpenFilePicker" in window;
}

function showDirectoryPicker(options) {
  return window.showDirectoryPicker(options);
}

function showSaveFilePicker(options) {
  return window.showSaveFilePicker(options);
}

function savePickersSupported() {
  return "showSaveFilePicker" in window && "showDirectoryPicker" in window;
}

function getWritableBlob() {
  const { readable, writable } = new TransformStream({});
  const blob = new Response(readable).blob();
  return {
    blob,
    writable
  };
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

function getFilesystemHandles(items) {
  return Promise.all(
    items
      .filter((item) => item.kind === FILESYSTEM_FILE_KIND)
      .map((item) => {
        if ("getAsFileSystemHandle" in item) {
          return item.getAsFileSystemHandle();
        } else {
          const entry = item.webkitGetAsEntry();
          return transformToFileSystemhandle(entry);
        }
      })
  );
}

async function transformToFileSystemhandle(entry) {
  const handle = {
    name: entry.name
  };
  if (entry.isFile) {
    handle.kind = FILESYSTEM_FILE_KIND;
    handle.getFile = () =>
      new Promise((resolve, reject) => entry.file(resolve, reject));
  }
  if (entry.isDirectory) {
    handle.kind = FILESYSTEM_DIRECTORY_KIND;
    const handles = await transformToFileSystemhandles(entry);
    handle.values = () => handles;
  }
  return handle;
}

async function transformToFileSystemhandles(entry) {
  const entries = [];
  function readEntries(directoryReader, resolve, reject) {
    directoryReader.readEntries(async (entriesPart) => {
      if (!entriesPart.length) {
        resolve(entries);
      } else {
        for (const entry of entriesPart) {
          entries.push(await transformToFileSystemhandle(entry));
        }
        readEntries(directoryReader, resolve, reject);
      }
    }, reject);
  }
  await new Promise((resolve, reject) =>
    readEntries(entry.createReader(), resolve, reject)
  );
  return {
    [Symbol.iterator]() {
      let entryIndex = 0;
      return {
        next() {
          const result = {
            value: entries[entryIndex],
            done: entryIndex === entries.length
          };
          entryIndex++;
          return result;
        }
      };
    }
  };
}

function setLaunchQueueConsumer(listener) {
  if ("launchQueue" in window && "files" in LaunchParams.prototype) {
    window.launchQueue.setConsumer(listener);
  }
}

function fetch(url) {
  return window.fetch(url);
}

function getLocationSearch() {
  return window.location.search;
}

function resetLocationSearch() {
  return window.history.replaceState(null, null, window.location.pathname);
}

export {
  FILESYSTEM_FILE_KIND,
  FILESYSTEM_DIRECTORY_KIND,
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
  addResizeObserver,
  addResizeListener,
  removeResizeListener,
  getHeight,
  setStyleProperty,
  saveValue,
  restoreValue,
  showOpenFilePicker,
  openFilePickerSupported,
  showDirectoryPicker,
  showSaveFilePicker,
  savePickersSupported,
  getWritableBlob,
  formatSize,
  formatDate,
  setTimeout,
  clearTimeout,
  isMacOSPlatform,
  getDefaultMaxWorkers,
  getFilesystemHandles,
  setLaunchQueueConsumer,
  fetch,
  getLocationSearch,
  resetLocationSearch
};
