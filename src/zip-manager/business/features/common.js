function getCommonFeatures({
  downloadId,
  selectedFolder,
  setDownloadId,
  setDownloads,
  setEntries,
  setErrorMessageDialog,
  setImportPasswordDialog,
  setClickedButtonName,
  downloaderElement,
  zipService,
  storageService,
  util,
  constants
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
    await executeDownload(download, options, blobGetter);
    return download;
  }

  async function executeDownload(download, options, blobGetter) {
    const { signal } = download.controller;
    const onprogress = (progressValue, progressMax) =>
      onDownloadProgress(download.id, progressValue, progressMax);
    try {
      const blob = await blobGetter(download, {
        ...options,
        signal,
        onprogress
      });
      util.downloadBlob(blob, downloaderElement, download.name);
    } catch (error) {
      if (!util.downloadAborted(error)) {
        if (zipService.passwordNeeded(error)) {
          const { password } = await new Promise((resolve) =>
            setImportPasswordDialog({ onSetImportPassword: resolve })
          );
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
    setErrorMessageDialog({
      message
    });
  }

  function closeDisplayError() {
    setErrorMessageDialog(null);
  }

  function resetClickedButtonName() {
    setClickedButtonName(null);
  }

  function setOptions(options) {
    configureZipService(options);
    storageService.set(constants.OPTIONS_KEY_NAME, options);
  }

  function getOptions() {
    let options = storageService.get(constants.OPTIONS_KEY_NAME);
    if (!options) {
      options = constants.DEFAULT_OPTIONS;
      options.maxWorkers = util.getDefaultMaxWorkers();
    }
    configureZipService(options);
    return options;
  }

  function configureZipService(options) {
    const { maxWorkers, chunkSize } = options;
    zipService.configure({
      maxWorkers,
      chunkSize: chunkSize * 1024
    });
  }

  return {
    downloadFile,
    updateSelectedFolder,
    setOptions,
    getOptions,
    openDisplayError,
    closeDisplayError,
    resetClickedButtonName
  };
}

export default getCommonFeatures;
