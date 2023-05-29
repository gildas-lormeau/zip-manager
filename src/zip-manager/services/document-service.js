/* global document, getComputedStyle, ResizeObserver */

function scrollIntoView(element) {
  element.scrollIntoView({ block: "nearest" });
}

function getHeight(element) {
  return element.offsetHeight;
}

function getRowHeight(element) {
  const rowGap = parseInt(getComputedStyle(element.parentElement).rowGap, 10);
  return getHeight(element) + (Number.isNaN(rowGap) ? 0 : rowGap);
}

function removeDocumentAttribute(name) {
  document.documentElement.removeAttribute(name);
}

function addResizeObserver(element, listener) {
  const observer = new ResizeObserver(listener);
  observer.observe(element, { attributes: true });
  return observer;
}

function setDocumentLanguage(language) {
  document.documentElement.lang = language;
}

export {
  getHeight,
  getRowHeight,
  scrollIntoView,
  removeDocumentAttribute,
  addResizeObserver,
  setDocumentLanguage
};
