function getHelpers({
  zipFilesystem,
  downloadId,
  setDownloadId,
  setDownloads,
  removeDownload,
  downloaderElement,
  zipService,
  util,
  messages
}) {
  const {
    DOWNLOAD_MESSAGE,
    ENTER_PASSWORD_MESSAGE,
    ENTER_ENTRY_PASSWORD_MESSAGE
  } = messages;

  async function downloadFile(name, options, blobGetter) {
    name = util.prompt(DOWNLOAD_MESSAGE, name);
    if (name) {
      const controller = util.createAbortController();
      const progressValue = null;
      const progressMax = null;
      const id = downloadId + 1;
      setDownloadId(() => id);
      const download = { id, name, controller, progressValue, progressMax };
      setDownloads((downloads) => [download, ...downloads]);
      const { signal } = controller;
      const onprogress = (progressValue, progressMax) =>
        onDownloadProgress(download.id, progressValue, progressMax);
      await executeDownload(
        download,
        { ...options, signal, onprogress },
        blobGetter
      );
      return download;
    }
  }

  async function executeDownload(download, options, blobGetter) {
    try {
      const blob = await blobGetter(download, options);
      util.downloadBlob(blob, downloaderElement, download.name);
    } catch (error) {
      if (!util.downloadAborted(error)) {
        if (zipService.passwordNeeded(error)) {
          let password;
          if (error.entryId === undefined) {
            password = util.prompt(ENTER_PASSWORD_MESSAGE);
          } else {
            const entry = zipFilesystem.getById(error.entryId);
            password = util.prompt(
              ENTER_ENTRY_PASSWORD_MESSAGE + entry.getFullname()
            );
          }
          if (password) {
            options.readerOptions = { password };
            await executeDownload(download, options, blobGetter);
          } else {
            removeDownload(download);
            util.alert(error);
          }
        } else {
          removeDownload(download);
          util.alert(error);
        }
      }
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

export default getHelpers;
