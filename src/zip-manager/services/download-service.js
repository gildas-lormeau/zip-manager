/* global URL, AbortController */

const ABORT_ERROR_NAME = "AbortError";
const CANCELLED_DOWNLOAD_MESSAGE = "download cancelled";

function downloadBlob(blob, downloaderElement, download) {
  const href = URL.createObjectURL(blob);
  Object.assign(downloaderElement, { href, download });
  downloaderElement.click();
  URL.revokeObjectURL(href);
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

export {
  downloadBlob,
  createAbortController,
  abortDownload,
  downloadAborted
};
