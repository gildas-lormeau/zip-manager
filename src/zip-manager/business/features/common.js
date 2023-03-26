function getCommonFeatures({
  zipFilesystem,
  downloadId,
  selectedFolder,
  setDownloadId,
  setDownloads,
  setEntries,
  setErrorMessageDialogOpened,
  setErrorMessage,
  setEntryPasswordDialogOpened,
  downloaderElement,
  zipService,
  util
}) {
  function updateSelectedFolder(folder = selectedFolder) {
    if (folder) {
      const { parent, children } = folder;
      const folders = filterChildren(children, true);
      const files = filterChildren(children, false);
      const ancestors = [];
      if (parent) {
        ancestors.push(parent);
      }
      setEntries([...ancestors, ...folders, ...files]);
    }
  }

  function filterChildren(children, isDirectory) {
    return children
      .filter((child) => Boolean(child.directory) === isDirectory)
      .sort((previousChild, nextChild) =>
        previousChild.name.localeCompare(nextChild.name)
      );
  }

  async function downloadFile(name, options, blobGetter) {
    const controller = util.createAbortController();
    const progressValue = null;
    const progressMax = null;
    const id = downloadId + 1;
    setDownloadId(() => id);
    const download = { id, name, controller, progressValue, progressMax };
    setDownloads((downloads) => [download, ...downloads]);
    try {
      await executeDownload(download, options, blobGetter);
    } catch (error) {
      if (!util.downloadAborted(error)) {
        if (zipService.passwordNeeded(error)) {
          let password;
          if (error.entryId === undefined) {
            password = promptPassword();
          } else {
            const entry = zipFilesystem.getById(error.entryId);
            password = promptPassword(entry.getFullname());
          }
          if (password) {
            options.readerOptions = { password };
            await executeDownload(download, options, blobGetter);
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }
    return download;
  }

  async function executeDownload(download, options, blobGetter) {
    const { signal } = download.controller;
    const onprogress = (progressValue, progressMax) =>
      onDownloadProgress(download.id, progressValue, progressMax);
    const blob = await blobGetter(download, {
      ...options,
      signal,
      onprogress
    });
    util.downloadBlob(blob, downloaderElement, download.name);
  }

  function promptPassword(filename) {
    // eslint-disable-next-line no-undef
    return window.prompt(
      "Enter password" + (filename ? " of " + filename : "") + ":"
    );
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

  function openDisplayError(message) {
    setErrorMessage(message);
    setErrorMessageDialogOpened(true);
  }

  function closeDisplayError() {
    setErrorMessageDialogOpened(false);
  }

  return {
    downloadFile,
    updateSelectedFolder,
    openDisplayError,
    closeDisplayError
  };
}

export default getCommonFeatures;
