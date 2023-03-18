function getCommonFeatures({
  zipFilesystem,
  downloadId,
  selectedFolder,
  setDownloadId,
  setDownloads,
  setEntries,
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

  async function downloadFile(
    name,
    options,
    importPassword,
    setImportPassword,
    blobGetter
  ) {
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
        importPassword,
        setImportPassword,
        blobGetter
      );
      return download;
    }
  }

  async function executeDownload(
    download,
    options,
    importPassword,
    setImportPassword,
    blobGetter
  ) {
    try {
      const blob = await blobGetter(download, options);
      util.downloadBlob(blob, downloaderElement, download.name);
    } catch (error) {
      if (!util.downloadAborted(error)) {
        if (zipService.passwordNeeded(error)) {
          if (
            importPassword &&
            (!options.readerOptions ||
              options.readerOptions.password !== importPassword)
          ) {
            options.readerOptions = { importPassword };
            await executeDownload(
              download,
              options,
              importPassword,
              setImportPassword,
              blobGetter
            );
          } else {
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
              await executeDownload(
                download,
                options,
                importPassword,
                setImportPassword,
                blobGetter
              );
              setImportPassword(importPassword);
            } else {
              throw error;
            }
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

  return {
    downloadFile,
    updateSelectedFolder
  };
}

export default getCommonFeatures;
