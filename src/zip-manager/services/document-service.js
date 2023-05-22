/* global document, getComputedStyle, ResizeObserver */

function scrollIntoView(element) {
  element.scrollIntoView({ block: "nearest" });
}

function getHeight(element) {
  return element.offsetHeight;
}

function getRowHeight(element) {
  return (
    getHeight(element) +
    parseInt(getComputedStyle(element.parentElement).rowGap, 10)
  );
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
