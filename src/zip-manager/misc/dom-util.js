/* global navigator, window, document, ResizeObserver */

const RESIZE_EVENT_NAME = "resize";
const KEYUP_EVENT_NAME = "keyup";
const KEYDOWN_EVENT_NAME = "keydown";
const BEFORE_UNLOAD_EVENT_NAME = "beforeunload";
const MACOS_PLATFORMS = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];

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

function getHeight(element) {
  return element.offsetHeight;
}

function getRowHeight(element) {
  return (
    getHeight(element) +
    parseInt(window.getComputedStyle(element.parentElement).rowGap, 10)
  );
}

function removeDocumentAttribute(name) {
  document.documentElement.removeAttribute(name);
}

function setStyle(styleElement, name, value) {
  const rule = Array.from(styleElement.sheet.rules).find((rule) =>
    rule.style.getPropertyValue(name)
  );
  if (rule) {
    rule.style.setProperty(name, value);
  } else {
    styleElement.sheet.insertRule(":root { " + name + ": " + value + "}");
  }
}

function setDocumentClass(value) {
  if (value) {
    document.documentElement.className = value;
  } else {
    document.documentElement.removeAttribute("class");
  }
}

function getDefaultMaxWorkers() {
  return navigator.hardwareConcurrency;
}

function isMacOSPlatform() {
  // eslint-disable-next-line no-unused-expressions
  const { platform } = window.navigator;
  return platform !== undefined && MACOS_PLATFORMS.includes(platform);
}

function setLaunchQueueConsumer(listener) {
  if ("launchQueue" in window) {
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
  scrollIntoView,
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
  getRowHeight,
  removeDocumentAttribute,
  setStyle,
  setDocumentClass,
  isMacOSPlatform,
  getDefaultMaxWorkers,
  setLaunchQueueConsumer,
  fetch,
  getLocationSearch,
  resetLocationSearch
};
