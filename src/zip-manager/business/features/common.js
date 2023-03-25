function getCommonFeatures({
  downloadId,
  selectedFolder,
  setDownloadId,
  setDownloads,
  setEntries,
  setErrorMessageDialogOpened,
  setErrorMessage,
  downloaderElement,
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
    const { signal } = controller;
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
        throw error;
      }
    }
    return download;
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

  function displayError(message) {
    setErrorMessage(message);
    setErrorMessageDialogOpened(true);
  }

  return {
    downloadFile,
    updateSelectedFolder,
    displayError
  };
}

export default getCommonFeatures;
