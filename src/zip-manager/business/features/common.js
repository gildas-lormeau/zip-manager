function getCommonFeatures({
  downloadId,
  selectedFolder,
  setDownloadId,
  setDownloads,
  setEntries,
  setErrorMessageDialog,
  setImportPasswordDialog,
  setImportPasswordCallback,
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
          setImportPasswordDialog({ opened: true });
          const password = await new Promise((resolve) =>
            setImportPasswordCallback(resolve)
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
      message,
      opened: true
    });
  }

  function closeDisplayError() {
    setErrorMessageDialog({
      message: "",
      opened: false
    });
  }

  return {
    downloadFile,
    updateSelectedFolder,
    openDisplayError,
    closeDisplayError
  };
}

export default getCommonFeatures;
