function getEntriesNavigationHandlers({
  entries,
  highlightedEntry,
  getEntriesHeight,
  setHighlightedEntry
}) {
  function highlightPrevious() {
    const indexEntry = getEntryIndex();
    const previousEntry =
      entries[(indexEntry - 1 + entries.length) % entries.length];
    setHighlightedEntry(previousEntry);
  }

  function highlightNext() {
    const indexEntry = getEntryIndex();
    const nextEntry = entries[(indexEntry + 1) % entries.length];
    setHighlightedEntry(nextEntry);
  }

  function highlightPreviousPage() {
    const indexEntry = getEntryIndex();
    const nextEntry = entries[Math.max(indexEntry - getEntriesHeight(), 0)];
    setHighlightedEntry(nextEntry);
  }

  function highlightNextPage() {
    const indexEntry = getEntryIndex();
    const previousEntry =
      entries[Math.min(indexEntry + getEntriesHeight(), entries.length - 1)];
    setHighlightedEntry(previousEntry);
  }

  function highlightFirst() {
    setHighlightedEntry(entries[0]);
  }

  function highlightLast() {
    setHighlightedEntry(entries[entries.length - 1]);
  }

  function highlight(entry) {
    setHighlightedEntry(entry);
  }

  function getEntryIndex() {
    return entries.findIndex((entry) => entry === highlightedEntry);
  }

  return {
    highlightPrevious,
    highlightNext,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    highlight
  };
}

function getFolderNavigationHandlers({
  history,
  historyIndex,
  selectedFolder,
  setSelectedFolder,
  setPreviousSelectedFolder,
  setHistory,
  setHistoryIndex
}) {
  function goIntoFolder(entry) {
    const newHistory = [...history];
    const newHistoryIndex = historyIndex + 1;
    if (entry.isDescendantOf(selectedFolder)) {
      newHistory.length = newHistoryIndex + 1;
    }
    newHistory[newHistoryIndex] = entry;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
    setSelectedFolders(entry);
  }

  function navigateBack() {
    navigateHistory(-1);
  }

  function navigateForward() {
    navigateHistory(1);
  }

  function navigateHistory(offset) {
    const newHistoryIndex = historyIndex + offset;
    setHistoryIndex(newHistoryIndex);
    const entry = history[newHistoryIndex];
    setSelectedFolders(entry);
  }

  function setSelectedFolders(entry) {
    setPreviousSelectedFolder(selectedFolder);
    setSelectedFolder(entry);
  }

  return {
    goIntoFolder,
    navigateBack,
    navigateForward
  };
}

function getHighlightedEntryHandlers({
  zipFilesystem,
  history,
  historyIndex,
  highlightedEntry,
  selectedFolder,
  clipboardData,
  setHistory,
  setHistoryIndex,
  setClipboardData,
  setHighlightedEntry,
  removeDownload,
  updateSelectedFolder,
  downloadFile,
  util,
  constants,
  messages
}) {
  const { DEFAULT_MIME_TYPE } = constants;
  const { RENAME_MESSAGE, DELETE_MESSAGE } = messages;

  function copy() {
    setClipboardData({
      entry: highlightedEntry.clone(true)
    });
  }

  function cut() {
    setClipboardData({
      entry: highlightedEntry,
      cut: true
    });
  }

  function paste() {
    try {
      const { entry, cut } = clipboardData;
      let clone;
      if (!cut) {
        clone = entry.clone(true);
      }
      zipFilesystem.move(entry, selectedFolder);
      if (!cut) {
        setClipboardData({ entry: clone });
      }
      updateSelectedFolder();
    } catch (error) {
      util.alert(error.message);
    }
  }

  function rename() {
    try {
      const entryName = util.prompt(RENAME_MESSAGE, highlightedEntry.name);
      if (entryName && entryName !== highlightedEntry.name) {
        highlightedEntry.rename(entryName);
        updateSelectedFolder();
      }
    } catch (error) {
      util.alert(error.message);
    }
  }

  function remove() {
    if (util.confirm(DELETE_MESSAGE)) {
      zipFilesystem.remove(highlightedEntry);
      updateHistoryData();
      setHighlightedEntry(null);
      updateSelectedFolder();
    }
  }

  function download(entry) {
    downloadFile(entry.name, {}, async (download, options) => {
      const blob = await entry.getBlob(DEFAULT_MIME_TYPE, options);
      removeDownload(download);
      return blob;
    });
  }

  function updateHistoryData() {
    let offsetIndex = 0;
    let previousEntry;
    const newHistory = history.filter((entry, indexEntry) => {
      const entryRemoved =
        previousEntry === entry ||
        entry === highlightedEntry ||
        entry.isDescendantOf(highlightedEntry);
      if (entryRemoved) {
        if (indexEntry <= historyIndex) {
          offsetIndex++;
        }
      } else {
        previousEntry = entry;
      }
      return !entryRemoved;
    });
    const newHistoryIndex = historyIndex - offsetIndex;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
  }

  return {
    copy,
    cut,
    paste,
    rename,
    remove,
    download
  };
}

function getSelectedFolderHandlers({
  selectedFolder,
  updateSelectedFolder,
  removeDownload,
  downloadFile,
  util,
  constants,
  messages
}) {
  const { DEFAULT_MIME_TYPE, ZIP_EXTENSION } = constants;
  const { ROOT_ZIP_FILENAME, CREATE_FOLDER_MESSAGE } = messages;

  function createFolder() {
    const folderName = util.prompt(CREATE_FOLDER_MESSAGE);
    if (folderName) {
      try {
        selectedFolder.addDirectory(folderName);
        updateSelectedFolder();
      } catch (error) {
        util.alert(error.message);
      }
    }
  }

  function addFiles(files) {
    files.forEach((file) => {
      try {
        return selectedFolder.addBlob(file.name, file);
      } catch (error) {
        util.alert(error.message);
      }
    });
    updateSelectedFolder();
  }

  function importZipFile(zipFile) {
    async function updateZipFile() {
      try {
        await selectedFolder.importBlob(zipFile);
      } catch (error) {
        util.alert(error.message);
      }
      updateSelectedFolder();
    }

    updateZipFile();
  }

  function exportZipFile() {
    downloadFile(
      selectedFolder.name
        ? selectedFolder.name + ZIP_EXTENSION
        : ROOT_ZIP_FILENAME,
      { mimeType: DEFAULT_MIME_TYPE },
      async (download, options) => {
        const blob = await selectedFolder.exportBlob(options);
        removeDownload(download);
        return blob;
      }
    );
  }

  return {
    createFolder,
    addFiles,
    importZipFile,
    exportZipFile
  };
}

function getDownloadHandlers({ setDownloads, util }) {
  function abortDownload(deletedDownload) {
    removeDownload(deletedDownload);
    util.abortDownload(deletedDownload.controller);
  }

  function removeDownload(deletedDownload) {
    setDownloads((downloads) =>
      downloads.filter((download) => download.id !== deletedDownload.id)
    );
  }

  return {
    removeDownload,
    abortDownload
  };
}

function getZipFilesystemHandlers({
  createZipFileSystem,
  setZipFilesystem,
  util,
  messages
}) {
  const { RESET_MESSAGE } = messages;
  function reset() {
    if (util.confirm(RESET_MESSAGE)) {
      setZipFilesystem(createZipFileSystem());
    }
  }
  return {
    reset
  };
}

function getClipboardHandlers({ setClipboardData }) {
  function resetClipboardData() {
    setClipboardData(null);
  }

  return {
    resetClipboardData
  };
}

function getActionHandlers({ highlightedEntry, goIntoFolder, download }) {
  function enter(entry = highlightedEntry) {
    if (entry.directory) {
      goIntoFolder(entry);
    } else {
      download(entry);
    }
  }

  return { enter };
}

export {
  getEntriesNavigationHandlers,
  getFolderNavigationHandlers,
  getHighlightedEntryHandlers,
  getSelectedFolderHandlers,
  getDownloadHandlers,
  getZipFilesystemHandlers,
  getClipboardHandlers,
  getActionHandlers
};
