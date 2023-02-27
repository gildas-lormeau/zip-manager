import { fs } from "@zip.js/zip.js";

const { FS } = fs;

function getUtil({
  downloadId,
  setDownloadId,
  setDownloads,
  downloaderElement,
  util,
  messages
}) {
  const { DOWNLOAD_MESSAGE } = messages;

  async function downloadFile(name, options, blobGetter) {
    name = util.prompt(DOWNLOAD_MESSAGE, name);
    if (name) {
      const controller = util.createController();
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
        util.downloadBlob(blob, downloaderElement, download.name);
      } catch (error) {
        if (!util.downloadAborted(error)) {
          util.alert(error);
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
