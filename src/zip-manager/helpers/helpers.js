/* global AbortController */

import { fs } from "@zip.js/zip.js";

const { FS } = fs;

function getUtil({
  downloadId,
  setDownloadId,
  setDownloads,
  downloaderRef,
  util,
  constants,
  messages
}) {
  const { ABORT_ERROR_NAME, CANCELLED_DOWNLOAD_MESSAGE } = constants;
  const { DOWNLOAD_MESSAGE } = messages;

  async function downloadFile(name, options, blobGetter) {
    name = util.prompt(DOWNLOAD_MESSAGE, name);
    if (name) {
      const controller = new AbortController();
      const progressValue = null;
      const progressMax = null;
      const id = downloadId + 1;
      setDownloadId(() => id);
      const download = { id, name, controller, progressValue, progressMax };
      setDownloads((downloads) => [download, ...downloads]);
      const { signal } = controller;
      const onprogress = (progressValue, progressMax) =>
        onDownloadProgress(download.id, progressValue, progressMax);
      Object.assign(options, {
        signal,
        onprogress,
        bufferedWrite: true,
        keepOrder: true
      });
      try {
        const blob = await blobGetter(download, options);
        util.downloadBlob(blob, downloaderRef.current, download.name);
      } catch (error) {
        const message = error.message || error;
        if (
          message !== CANCELLED_DOWNLOAD_MESSAGE &&
          error.name !== ABORT_ERROR_NAME
        ) {
          util.alert(message);
        }
      }
      return download;
    }
  }

  function onDownloadProgress(downloadId, progressValue, progressMax) {
    setDownloads((downloads) =>
      downloads.map((download) => {
        if (download.id === downloadId) {
          download = {
            ...download,
            progressValue,
            progressMax
          };
        }
        return download;
      })
    );
  }

  return {
    downloadFile
  };
}

function createZipFileSystem() {
  return new FS();
}

export { getUtil, createZipFileSystem };
