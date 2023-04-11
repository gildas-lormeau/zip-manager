function getCommonFeatures({
  selectedFolder,
  setDownloadId,
  setDownloads,
  setEntries,
  setErrorMessageDialog,
  setClickedButtonName,
  removeDownload,
  downloaderElement,
  zipService,
  storageService,
  util,
  constants
}) {
  function refreshSelectedFolder(folder = selectedFolder) {
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

  async function saveEntries(entries, filename, options, parentHandle) {
    if (util.savePickersSupported()) {
      try {
        if (!parentHandle && (entries.length > 1 || entries[0].directory)) {
          parentHandle = await getParentHandle();
        }
      } catch (error) {
        if (util.downloadAborted(error)) {
          return;
        } else {
          throw error;
        }
      }
    }
    await Promise.all(
      entries.map(async (entry) =>
        saveEntry(entry, filename, options, parentHandle)
      )
    );
  }

  async function saveEntry(entry, filename, options, parentHandle) {
    if (!parentHandle && entry.directory) {
      parentHandle = await getParentHandle();
    }
    const name = filename || entry.name;
    let download;
    try {
      if (entry.directory) {
        await saveDirectoryEntry(name, entry, options, parentHandle);
      } else {
        download = {
          name,
          controller: util.createAbortController(),
          progressValue: null,
          progressMax: null
        };
        await saveFileEntry(name, entry, options, download, parentHandle);
      }
    } catch (error) {
      if (!util.downloadAborted(error)) {
        throw error;
      }
    } finally {
      if (download) {
        removeDownload(download);
      }
    }
  }

  async function saveDirectoryEntry(name, entry, options, parentHandle) {
    const directoryHandle = await parentHandle.getDirectoryHandle(name, {
      create: true
    });
    await saveEntries(entry.children, null, options, directoryHandle);
  }

  async function saveFileEntry(name, entry, options, download, parentHandle) {
    const savePickersSupported = util.savePickersSupported();
    const { signal } = download.controller;
    const onprogress = (progressValue, progressMax) =>
      onDownloadProgress(download.id, progressValue, progressMax);
    let fileHandle, writable, blob;
    if (savePickersSupported) {
      if (parentHandle) {
        fileHandle = await parentHandle.getFileHandle(name, {
          create: true
        });
      } else {
        fileHandle = await getFileHandle(name);
        download.name = fileHandle.name;
      }
      writable = await fileHandle.createWritable();
    } else {
      ({ writable, blob } = util.getWritableBlob());
    }
    setDownloadId((downloadId) => {
      download.id = downloadId + 1;
      return download.id;
    });
    setDownloads((downloads) => [download, ...downloads]);
    await entry.getWritable(writable, { signal, onprogress, ...options });
    if (!savePickersSupported) {
      util.downloadBlob(await blob, downloaderElement, download.name);
    }
  }

  function getParentHandle() {
    return util.showDirectoryPicker({
      mode: "readwrite",
      startIn: "downloads"
    });
  }

  function getFileHandle(suggestedName) {
    return util.showSaveFilePicker({
      suggestedName,
      mode: "readwrite",
      startIn: "downloads"
    });
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
    const { DEFAULT_OPTIONS, OPTIONS_KEY_NAME } = constants;
    let options = storageService.get(OPTIONS_KEY_NAME);
    if (!options) {
      options = { ...DEFAULT_OPTIONS };
      options.maxWorkers = util.getDefaultMaxWorkers();
    }
    if (options.hideNavigationBar === undefined) {
      options.hideNavigationBar = DEFAULT_OPTIONS.hideNavigationBar;
    }
    if (options.hideDownloadManager === undefined) {
      options.hideDownloadManager = DEFAULT_OPTIONS.hideDownloadManager;
    }
    if (options.hideInfobar === undefined) {
      options.hideInfobar = DEFAULT_OPTIONS.hideInfobar;
    }
    if (options.promptForExportPassword === undefined) {
      options.promptForExportPassword = DEFAULT_OPTIONS.promptForExportPassword;
    }
    if (options.defaultExportPassword === undefined) {
      options.defaultExportPassword = DEFAULT_OPTIONS.defaultExportPassword;
    }
    if (options.checkSignature === undefined) {
      options.checkSignature = DEFAULT_OPTIONS.checkSignature;
    }
    configureZipService(options);
    return options;
  }

  function configureZipService(options) {
    const { maxWorkers, chunkSize } = options;
    zipService.configure({
      maxWorkers,
      chunkSize
    });
  }

  return {
    saveEntry,
    saveEntries,
    refreshSelectedFolder,
    setOptions,
    getOptions,
    openDisplayError,
    closeDisplayError,
    resetClickedButtonName
  };
}

export default getCommonFeatures;
